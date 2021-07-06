import { StaffBase } from "./StaffBase";
import { NpcManager } from "../../manager/NpcManager";
import GameScene from "../scene/GameScene";
import { ResourceManager } from "../../manager/ResourceManager";
import { AnimatorController } from "../script/AnimatorController";
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import { GuideManager } from "../ui/Guide/GuideManager";
import { BubbleCreater } from "../ui/Bubble/BubbleCreater";

export enum BubbleType{
    publicity = 2,
    advertising,
}

export class Propagandist extends StaffBase  
{
    constructor() { super();}

    public onLoad(tableId:number):void
    {
        super.onLoad(tableId);
        ResourceManager.getInstance().getResource(this._tableData.strmodle, Handler.create(this, (node:Sprite3D)=>{
            this.sprite3dNode = node;
            this._animator = this.addComponent(AnimatorController);
            this.addChild(this.sprite3dNode);
            this._loadDone = true;
        }))
    }

    public onStop():void{}

    //public onUpdate():void{  super.onUpdate();}

    public onDestroy():void{}

    public LoadRangeNpc()
    {
        this.creatNpc(BubbleType.publicity);
    }

    private _creating:Boolean = true;
    public LoadRangetenNpc()
    {
        if (!this._creating) return;
        this._creating = false;
        NpcManager.getInstance().destroynpcCreater();
        Laya.timer.loop(500,this,this.AddVisitorNpc);
        let welcome = GameScene.instance.scene3d.getChildByName("Effect").getChildByName("welcome");
        welcome.active = true;
        Laya.timer.loop(3000,this,()=>{  welcome.active = false;});
        this.index = 0;
    }

    private index:number = 0;
    private AddVisitorNpc()
    {  
        this.index++;
        if (this.index > this._tableData.propaganda) {
            Laya.timer.clear(this,this.AddVisitorNpc);
            this.index = 0;
            this._creating = true;
            if (GuideManager.getInstance().GetGuideState()) {
                NpcManager.getInstance().initnpcCreater();
            }
            return;
        }
        this.creatNpc(BubbleType.advertising);
    }

    private creatNpc(type:number)
    {
        var f = Math.random() * (NpcManager.getInstance().npcCreater._Array.length -1);
        f = Math.round(f);
        f = NpcManager.getInstance().npcCreater._Array[f];
        var npc = NpcManager.getInstance().createNpc(f);
        if (!npc) return;
        npc.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
        let bubble = BubbleCreater.instance.createBubble(type, GameScene.instance.camera,1,npc,null); 
        Laya.timer.once(2000,this,()=>{
            BubbleCreater.instance.removeBubble(bubble);
        });
        GameScene.instance.scene3d.addChild(npc);
    }
}


    // let minNum = 1;    let maxNum = 5;
    // let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
    // let value_b = parseInt(value_a);
    // //console.log(value_b);
    // console.log("创建一个NPC id = " + value_b);