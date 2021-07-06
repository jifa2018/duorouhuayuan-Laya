/**
 * @Purpose NPC生成器
 * @Author las
 * @Date 2020/9/12 17:11
 * @Version 1.0
 */

import { NpcManager } from "../../manager/NpcManager";
import GameScene from "../scene/GameScene";
import { GameUIManager } from "../../manager/GameUIManager";
import { UnlockView } from "../ui/Unlock/UnlockView";
import { CommonDefine } from "../../common/CommonDefine";
import { GEvent } from "../../common/GEvent";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";

export class NpcCreater 
{
    public stopCreater:Boolean = true;
    public stop:Boolean = true;
    private needCreate:Boolean = true;
    private CreatInterval:number; //创建的时间间隔
    public _Array:Array<any> = new Array<any>();
    public bool_init:Boolean  = false;

    constructor() 
    {
        this.CreatInterval = 10000;
        this.getLocalData();
        GEvent.RegistEvent(CommonDefine.EVENT_UNLOCK_PLANT,Laya.Handler.create(this, this.AddNpcKind));
    }

    /***
     * 初始化
     */
    public initCreater():void
    {
        if (!this.bool_init) {
            this.bool_init = true;
            this.createNpc();
            Laya.timer.loop(this.CreatInterval, this, this.createNpc);
        }
    }

    public clearCreater():void
    {
        Laya.timer.clear(this, this.createNpc);
        GEvent.RemoveEvent(CommonDefine.EVENT_UNLOCK_PLANT,Laya.Handler.create(this, this.AddNpcKind));
    }

    private AddNpcKind(name:string)
    {
        switch (name) {
            case "defaulsucculent3":
                this._Array.push(2);
                GameUIManager.getInstance().showUI(UnlockView,Laya.Handler.create(this,(view)=>{
                    view.Init(7);
                }));
                break;
            case "defaulsucculent4":
                this._Array.push(3);
                GameUIManager.getInstance().showUI(UnlockView,Laya.Handler.create(this,(view)=>{
                    view.Init(8);
                }));
            break;
            case "defaulsucculent6":
                this._Array.push(4);
                GameUIManager.getInstance().showUI(UnlockView,Laya.Handler.create(this,(view)=>{
                    view.Init(9);
                }));
            break;
        }
        SaveManager.getInstance().SetNpc(this._Array);
    }


    private createNpc() 
    {
        if (!this.stop) return;
        if (!this.stopCreater) return;
        if (!this.needCreate) return;
        this.needCreate = false;
        var f = Math.random() * (this._Array.length -1);
        f = Math.round(f);
        f = this._Array[f];
        if (f == 4 || f == 3 || f == 2) {
            var e = Math.random();
            if (e >= 0.2) {
                this.needCreate = true;
                this.createNpc();
                return;
            }
        }
        //console.log("创建一个NPC id = " + f);
        var npc = NpcManager.getInstance().createNpc(f);
        npc.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
        GameScene.instance.scene3d.addChild(npc);
        this.needCreate = true;
    }

    private getLocalData()
    {
       let data = SaveManager.getInstance().GetCache(ModelStorage.NPC);
       if (data) {
           this._Array = data;
       }else
       {
        this._Array.push(1);this._Array.push(5);this._Array.push(6);
       }
    }
 
}