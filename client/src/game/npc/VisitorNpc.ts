import {NpcBase} from "./NpcBase";
import {MoveController} from "../script/MoveController";
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import {ResourceManager} from "../../manager/ResourceManager";
import { AnimatorController } from "../script/AnimatorController";
import { Utils } from "../../utils/Utils";
import {NorVisitorAI} from "../ai/NorVisitorAI";
import { VisitorProgressBar } from "../ui/ProgressBar/VisitorProgressBar";
import GameScene from "../scene/GameScene";
import { NpcManager } from "../../manager/NpcManager";
import { BubbleCreater } from "../ui/Bubble/BubbleCreater";
/***
 * 游荡类型npc
 */
export class VisitorNpc extends NpcBase
{
    
    constructor() { super(); }

    public createById(tableId:number)
    {
        super.createById(tableId);
        this.clickIndex = 0;
        this.firstClick = false;
        this.loadModel();
    }

    public loadModel():void
    {
        ResourceManager.getInstance().getResource(this._tableData.strmodelurl, Handler.create(this, (node:Sprite3D)=>{
            if (!node) {
                console.log("NPC模型没有加载完成！");
            }
            this.sprite3dNode = node;
            this.Camera =  Utils.FindTransfrom(this.sprite3dNode,"Prop_xiangji");
            this._animator = this.addComponent(AnimatorController);
            this._moveController = this.addComponent(MoveController);
            Laya.timer.callLater( this, ()=> {
                this._aiController = this.addComponent(NorVisitorAI);
                this._aiController.init(this);
                this._moveController.changSpeed(this.Cruise_speed);     
            });
            this.clickEnable = Boolean(this._tableData.click);
            this.addChild(this.sprite3dNode);
            if (this.type==3)
            {
                this.SetModelAlpha(0.2);
            }
        }))
    }


    public GetCamera()
    {
        super.GetCamera();
        return this.Camera;
    }

    private firstClick:boolean = false;
    private _ProgressBar:VisitorProgressBar;

    public onClick():void
    {
        if (this.type==1) 
           return;
        if (this.type==3 || this.type==4 || this.type==2 ) 
        {    
            super.onClick();
            this.clickIndex++; 
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner==this)
                   BubbleCreater.instance.removeBubble(element);
            });   
            if (!this.firstClick) 
            {
                this.CreatProgressBar();
                return;
            }

            if (this._ProgressBar) 
            {
                this._ProgressBar.setProgress(this.clickIndex*0.1)          
                if (this.clickIndex>=10)
                {
                    this.clickEnable= false;                 
                    this._ProgressBar.destroy();
                    if (this.type==3 || this.type==4) 
                    {
                        this.disappear();
                        if (this.type==4 &&  this._aiController != null) 
                            this._aiController.ClickTypeFourNpc();
                    }
                }
                if (this.type==2 &&  this._aiController != null) {
                    this._aiController.ClickTypeThreeNpc(this.clickIndex);
                }
            }
        }                  
    }

    private CreatProgressBar()
    {
        this.firstClick = true;  
        if (this.type==3) 
        {
            this._moveController.changSpeed(5);        
            this.pickUpMoneySpeed = 500;
        } 
        this._ProgressBar = new VisitorProgressBar();
        this._ProgressBar.init(GameScene.instance.camera, this,Handler.create(this, function(){
            this._ProgressBar.setProgress(this.clickIndex*0.1);
        }));
        if (this.type==2 &&  this._aiController != null) {
            this._aiController.ClickTypeThreeNpc(this.clickIndex);
        }
    }

    public ActionDone():void
    {
        super.ActionDone();
        this.firstClick = false;
        this.clickIndex = 0;
    }

    public isHaveProgressBar()
    {
        super.isHaveProgressBar();
        if (this._ProgressBar) {
            return true;
        }
        return false;
    }

    public disappear():void
    {
        super.disappear();
        this.clickEnable = false;
        this._ProgressBar && this._ProgressBar.destroy();
        this._ProgressBar = null;
    }

    public clear() {
        this.sprite3dNode.destroy();
        this.removeSelf();
        this._animator.destroy();
        this._moveController.destroy();
        this._aiController.destroy();
        this._ProgressBar && this._ProgressBar.destroy();
        this._animator = null;
        this._moveController = null;
        this._aiController = null;
        this._ProgressBar = null;
        BubbleCreater.instance._bubbleList.forEach(element => {
            if (element.owner==this)
               BubbleCreater.instance.removeBubble(element);
        });  
        Laya.timer.clearAll(this);
    }

    public onMove():void
    {
        super.onMove();
    }

    public onStop():void
    {
        super.onStop();
        //console.log("刪除NPC："  + this._tableData.strname);
        this.clear();
        NpcManager.getInstance().recoverNpc("NpcBase",this);
    }
    
    public onUpdate():void
    {
        super.onUpdate();
    }

    public onDestroy():void  { }
}


    /*
    private escapeTimes:number;
    private starPos:Vector3;
    //开始逃跑
    public escape(hander:Handler):void
    {
        super.escape(hander);
        this.changMoveSpeed(10);
        let minNum = 1;
        let maxNum = 3;
        let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
        let value_b = parseInt(value_a);
        console.log("随机逃跑折返次数： " +  value_b);
        this.escapeTimes = value_b;
        this.starPos = this.transform.position.clone();
        Debug.Log("开始逃跑");
        this.escapeMove(hander);
        Laya.timer.loop(3000, this, this.escapeMove,[hander])
        SoundManager.getInstance().playSound(Sound_Cfg[5].strsound);
    }

   //每次逃跑随机一条路
    private escapeMove(hander:Handler):void
    {
        if(this.escapeTimes <= 0)
        {
            this.clearEscape();
            this.changMoveSpeed(2);
            hander && hander.run();                //this.RangePath();
            console.log("逃跑结束！！！");
            return;
        }
        this.moveTo([this.randomPos()],null);
        this.escapeTimes -= 1;
    }

    private clearEscape():void
    {
        this.isMove = false;
        Laya.timer.clear(this, this.escapeMove);
    }

    // 随机一个位置
    private randomPos():Vector3
    {
        var x:number = Math.random() + 2 * 2.5 ;
        var z:number = Math.random() + 2 * 2.5;

        var vx:number = Math.random()- 0.5;
        var vz:number = Math.random()- 0.5;

        return new Vector3(vx > 0 ? x : -x + this.starPos.x, 0, vz > 0 ? z : -z + this.starPos.z);
    }
    */