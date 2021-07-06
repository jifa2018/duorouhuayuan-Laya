/**
 * @Purpose 头顶泡泡创建器
 * @Author zhanghj
 * @Date 2020/8/11 18:01
 * @Version 1.0
 */
import {Bubble, BubbleType} from "./Bubble";
import Pool = Laya.Pool;
import {NpcBase} from "../../npc/NpcBase";
import Camera = Laya.Camera;
import Vector2 = Laya.Vector2;
import {LayerManager} from "../../../manager/LayerManager";
import Handler = Laya.Handler;

export class BubbleCreater {

    private static _instance: BubbleCreater;
    public _bubbleList:Array<Bubble> = new Array<Bubble>();
    public static pos:Vector2;
    private isInUpdate:boolean;
    public createIndex:number = 0;

    public static get instance(): BubbleCreater {
        if (!this._instance)
            this._instance = new BubbleCreater();
        return this._instance;
    }

    public createBubble(tableId:number, camera:Camera,type:number, owner:any = null, handler:Handler = null):Bubble
    {
        var bubble:Bubble = Pool.getItemByClass("bubble", Bubble);
        bubble.init(tableId, camera,type, owner, handler);
        bubble.createIndex = this.createIndex;
        bubble.name = "bubble"
        this._bubbleList.push(bubble);
        LayerManager.getInstance().downUILayer.addChild(bubble);
        if(!this.isInUpdate)
            Laya.timer.loop(10, this, this.onUpdate);
        this.isInUpdate = true;
        this.createIndex += 1;
        return bubble;
    }

    public removeBubble(bubble:Bubble):void
    {
        for(var i:number = 0; i < this._bubbleList.length; ++i)
        {
            if(this._bubbleList[i].createIndex == bubble.createIndex)
            {
                this._bubbleList[i].destroy();
                this._bubbleList.splice(i,1);
                break;
            }
        }
        if(this._bubbleList.length == 0)
        {
            Laya.timer.clear(this, this.onUpdate);
            this.isInUpdate = false;
        }
    }

    public GetTypewithNormal():Bubble
    {
        let b :Bubble = null;
        this._bubbleList.forEach(element => {
            if (element.type==BubbleType.Normal)
            {
                b =  element;
                return;
            }
        });
        return b;
    }

    private onUpdate():void
    {
        for(var i:number = 0; i < this._bubbleList.length; ++i)
        {
         //   if(this._bubbleList[i].isMove())
                this._bubbleList[i].setPosition();
        }
    }
}