/**
 * @Purpose 头顶泡泡
 * @Author zhanghj
 * @Date 2020/8/7 20:03
 * @Version 1.0
 */
import Sprite = Laya.Sprite;
import {NpcBase} from "../../npc/NpcBase";
import Handler = Laya.Handler;
import Camera = Laya.Camera;
import {Utils} from "../../../utils/Utils";
import Vector2 = Laya.Vector2;
import Pool = Laya.Pool;
import Event = Laya.Event;
import { Debug } from "../../../common/Debug";
import {Action_Cfg} from "../../../manager/ConfigManager";
import Tween = Laya.Tween;

export enum BubbleType{
    Normal,
    Wealthy,
    pickMoney,
    Noise,
    Collect,
}

export class Bubble extends Sprite{
    public owner:any;
    public bubble:Sprite;// = new Sprite();
    public sceneCamera:Camera;
    private callback:Handler;
    //内部id
    public createIndex:number;
    public type:BubbleType;

    public init(tableId:number, camera:Camera,type:BubbleType, owner:any = null, handler:Handler = null):void
    {
        this.sceneCamera = camera;
        this.owner = owner;
        this.bubble = new Sprite();
        this.type = type
        this.callback = handler;
        this.mouseEnabled = true;
        this.bubble.mouseEnabled = true;
        this.bubble.name = "bubble";
        this.on(Event.MOUSE_UP, this, this.onClick);
        this.addChild(this.bubble);
        var str:string = Action_Cfg[tableId].stricon;
        if(!str)    return;
        this.bubble.loadImage(str, Handler.create(this, function (ret) {
            this.bubble.pivotX = this.bubble.width/2;
            this.bubble.pivotY = this.bubble.height;
            this.setPosition();
        }))
    }

      /***
     * 更换图片
     * @param url
     */
    public changeImage(url:string):void
    {
        if(!url)    return;
        this.off(Event.MOUSE_UP, this, this.onClick);
        this.bubble.loadImage(url, Handler.create(this, function (ret) {
            this.bubble.pivotX = this.bubble.width/2;
            this.bubble.pivotY = this.bubble.height;
            this.setPosition();
        }))
    }

    public RotationIcon():void
    {
        var add:boolean = false;
        Laya.timer.loop(1,this,()=>{
            if(!add)
            {
                this.bubble.scaleX -= 0.2;
                if(this.bubble.scaleX <= -1)
                  add = true;
            }
            else{
                this.bubble.scaleX += 0.2;
                if(this.bubble.scaleX >= 1)
                    add = false;
            }
        }); 
    }

    public onClick(e:any):void
    {
        this.scaleX = 1.1;
        this.scaleY = 1.1;
        Tween.to(this, {scaleX:1, scaleY:1}, 50);
        //console.log("点击了聊天泡泡");
        this.callback && this.callback.run();
        // if(this.owner)
        // {
        //     console.log(this.owner.type);
        // }
    }

    public setPosition():void
    {
        if(!this.owner) return;
        if (this.bubble==null || this.bubble ==undefined) return;
        var v2:Vector2 = Utils.worldToScreen(this.sceneCamera, this.owner.transform.position);
        this.pos(v2.x, v2.y- 80);//- (this.bubble.width / 2)  - this.bubble.height
    }

    public isMove():boolean
    {
        return this.owner.isMove;
    }

    public destroy(destroyChild?: boolean) {
        this.off(Event.MOUSE_UP, this, this.onClick)
        this.bubble.destroy();
        this.bubble = null;
        this.removeSelf();
        Pool.recover("bubble", this);
        Laya.timer.clearAll(this);
    }
}