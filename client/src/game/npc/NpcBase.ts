import { INpc } from "./INpc";
import Sprite3D = Laya.Sprite3D;
import Animator = Laya.Animator;
import {MoveController} from "../script/MoveController";
import Handler = Laya.Handler;
import Vector3 = Laya.Vector3;
import Vector2 = Laya.Vector2;
import Pool = Laya.Pool;
import {AnimatorController} from "../script/AnimatorController";
import {NpcBaseState} from "../npc/npcstate/NPCBaseState";
import { Debug } from "../../common/Debug";
import {SceneItem} from "../item/SceneItem";
import PhysicsCollider = Laya.PhysicsCollider;
import { AIBase } from "../ai/AIBase";
import { Npc_Cfg, Sound_Cfg } from "../../manager/ConfigManager";
import { SceneItemCreater } from "../item/SceneItemCreater";
import { SoundManager } from "../../manager/SoundManager";
import GameScene from "../scene/GameScene";
import { Utils } from "../../utils/Utils";
import { CommonDefine } from "../../common/CommonDefine";

export class NpcBase extends Sprite3D implements INpc
{
    protected _animator:AnimatorController;
    protected _moveController:MoveController;
    public _aiController:AIBase;
    protected state:NpcBaseState;
    protected _buddle:any;
    protected ActionSite:number ;  //捣乱者所在的行为地点
    protected Camera:any;
    protected _isHaveProgressBar = false;

    public _tableData:any;
    public sprite3dNode:Sprite3D;
    public clsName:string;
    public type:number; //Npc 类型
    public clickIndex:number = 0;
    public pickUpMoneySpeed = 2000;
    public Cruise_speed:number = 2;
    public Fadeaway:Boolean = false;

    constructor() {
        super();
    }

    public onLoad():void{}

    public onMove():void{}

    public onStop():void{}

    public onUpdate():void
    {
        if (this.state) 
        {
            this.state.Update();
            //Debug.Log(this.state.GetType())
        }
    }

    public onDestroy():void{}

    public createById(tableId:number):void
    {
        this._tableData = Npc_Cfg[tableId];
        if(!this._tableData)
        {
            console.log("npc表中没有id = " + tableId.toString());
            return;
        }
        this.type = this._tableData.type;
        this.Cruise_speed =  this._tableData.Cruise_speed;
    }

    public cloneThis(sp3d:Sprite3D):void
    {
        this.sprite3dNode = sp3d.clone() as Sprite3D;
        this._moveController = this.addComponent(MoveController);
        this._animator = this.addComponent(AnimatorController);
        this.addChild(this.sprite3dNode);
    }

    public recover():void
    {
        this.sprite3dNode.destroy();
        this.sprite3dNode = null;
        Pool.recover(this.clsName, this);
    }

    public playAnimation(name:string)
    {
        this._animator.play(name);
    }

    public moveTo(path:any, complate:Handler)
    {
        if(this._moveController)
        {
            this._moveController.moveTo(path, complate);
        }
    }

    public get isMove():boolean
    {
        return !this._moveController ? false : this._moveController.isMove;
    }

    public set isMove(b:boolean)
    {
        if(this._moveController)
        {
            this._moveController.isMove = b;
        }
    }

    public onClick():void
    {
        //console.log("click npc");
    }

    public isHaveProgressBar():Boolean
    {
        return false;
    }


    public ChangeState(state:NpcBaseState)
    {
        if(this.state != null)
        {
            this.state.Exit();
        }

        this.state = state;
        if(this.state != null)
        {
            this.state.Enter();
        }
    }

    public GetType()
    {
        if(this.state != null)
        {
           return this.state.GetType();
        }  
    }

    public GetCamera():any { }

    public set clickEnable(b:boolean)
    {
        if(this.sprite3dNode)
        {
            this.setClickEnable(b);
        }
    }

    private setClickEnable(b:boolean):void
    {
        var c:PhysicsCollider = this.sprite3dNode.getComponent(PhysicsCollider);
        if(c)
            c.enabled = b;
        else
            console.log("角色没有碰撞盒")
    }
    
    public GetstealGold(range:number = 1):Boolean
    {
        var nearItem:SceneItem = SceneItemCreater.getInstance().getNearItem(this.transform.position, range);
        if (nearItem==null || nearItem==undefined ) {
            return false;
        }
        return true;
    }

    public stealGold(range:number = 1,hander:Handler)
    {
        var nearItem:SceneItem = SceneItemCreater.getInstance().getNearItem(this.transform.position, range);
        if(!nearItem)
        {
            hander && hander.runWith(false);
            return;
        }  
        this.moveTo([nearItem.transform.position], Handler.create(this,  ()=> {
            this.playAnimation(CommonDefine.ANIMATION_PickMoney);
            Laya.timer.once(this.pickUpMoneySpeed,this,()=>{
                SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);//"金币碰撞的音效" 
                var v2:Vector2 = Utils.worldToScreen(GameScene.instance.camera, nearItem.pos);
                Utils.createNumberText(nearItem.addGold.toString(),v2.x,v2.y,"-",false);
                nearItem.onClick();
                hander && hander.runWith(true);
            });       
        }))
    }

    public changMoveSpeed(speed:number):void
    {
        this._moveController.changSpeed(speed);
    }

    public LookAtPoint(pointName:string):void
    {
        let point = GameScene.instance.scene3d.getChildByName("point").getChildByName(pointName);
        if (point == null) {
            Debug.Log("没有找到可以看向的多肉点！！！！！！！！！！！！！！");
            return;
        }
        let disX = point.transform.position.x - this.transform.position.x;
        let disZ = point.transform.position.z - this.transform.position.z;
        if (this.transform != null || this.transform != undefined) {
                this.transform.localRotationEulerY = Math.atan2(disX, disZ) * 180 /Math.PI;
        }
    }

    private alphaValue = 0.5;
    public paymoneycallBack():void
    {
        if(!this.sprite3dNode || this.sprite3dNode.destroyed)  return;
        let offset = 0.5/((this._tableData.disappear_time/0.5)+1);
        this.SetModelAlpha(this.alphaValue- offset);
        if (this.alphaValue<=0) 
        {
            this.Fadeaway = false;
            Laya.timer.clear(this,this.paymoneycallBack);
            this._aiController.onStop();
        }
    }

    public disappear():void
    {
        this._moveController.changSpeed(this._tableData.disappear_speed); 
        this.alphaValue = 0.5;
        this.paymoneycallBack();
        Laya.timer.loop(500,this,this.paymoneycallBack);
        this.Fadeaway = true;
    }

    public escape(hander:Handler):void{}
    
    public ActionDone():void { }
    
    public changActionSite(id:number):void{}

    public GetActionSite():number{ return this.ActionSite}

    public SetModelAlpha(alphaValue:number):void
    {
        this.alphaValue = alphaValue;
        Utils.setModelAlpha(this.sprite3dNode, this.alphaValue);
    }

}