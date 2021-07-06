import { AIBase } from "./AIBase";
import Handler = Laya.Handler;
import GameScene from "../scene/GameScene";
import { SceneItem } from "../item/SceneItem";
import { ClassPool } from "../../manager/ClassPool";
import { NpcMoveState } from "../npc/npcstate/NPCMoveState";
import { NpcActionState } from "../npc/npcstate/NpcActionState";
import Vector3 = Laya.Vector3;
import { Debug } from "../../common/Debug";
import { CommonDefine } from "../../common/CommonDefine";
import { Path_Cfg } from "../../manager/ConfigManager";

export class RandomMove extends AIBase 
{
    private CurrentActionId:number;
    private Dic:Map<number,Laya.Handler> = new Map<number,Laya.Handler>();//        Map<number, Laya.Handler>  行为组

    constructor() 
    {
        super();
        console.log("RandomMove+++");
        this.Dic[1] = Laya.Handler.create(this, this.playAni);
        this.Dic[2] = Laya.Handler.create(this, this.playDrop);
    }

    public onEnable(): void 
    {
        super.onEnable();
        this.RangePath();

        debugger;
        Path_Cfg[1]
        
    }


    public onMove(): void 
    {
       super.onMove();
      
       let state:NpcMoveState = new NpcMoveState(this);
       this.character.ChangeState(state);
    }


    public RangePath():void
    {
         //此处需要判断是否是多路段，随机出一个路径   需要读表拿到路径
         this.Currentpath = GameScene.instance.path;
         this.onMove();
    }

    public RangeActionPath():void
    {
         //此处需要随机一个行为   需要读表拿到路径
         Math.random();
         let minNum = 1;
         let maxNum = 4;
         let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
         let value_b = parseInt(value_a);
         console.log(value_b);
         this.CurrentActionId = value_b;
         this.Currentpath = GameScene.instance.path;
         this.onMove();
    }

    public isKeepUpMove(): void 
    {
        super.isKeepUpMove();
        let  type = 1;
        switch (type) 
        {
            case 1:
                this.RangeActionPath();
            break;
            case 2:
                this.SwitchAction();
            break;
            case 3:
                this.RangePath();
            break;
            default:
                break;
        }
      
    }

    public SwitchAction(): void 
    {
        let state:NpcActionState = new NpcActionState(this,2);
        this.character.ChangeState(state);
    }



    public onStop(): void 
    {
        

    }

    public onPay(type:number): void 
    {
        super.onPay(type)
        let handler = this.Dic[this.CurrentActionId];
        Laya.Handler.call(handler);
        this.RangePath();

    }

    public playAni(): void 
    {
        this.character.playAnimation(CommonDefine.ANIMATION_IDLE);
        Laya.timer.once(3000,this,this.AnicallBack);
    }


    public playDrop():void
    {
        Debug.Log("执行了一个具体的行为，比如撒钱！！！");
        GameScene.instance.createSceneItem(1,this.character.transform.position);
    }


    public AnicallBack(): void 
    {
        this.RangePath();
    }



}

    // 限定值类型的MAP
    interface IMap<V>{
        [index:string] : V;
    }


    // 限定key为数字并限定值类型的MAP
    interface INMap<V>{
        [index:number] : V;
    }