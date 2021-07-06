/**
 * @Purpose 角色进度条
 * @Author zhanghj
 * @Date 2020/8/12 16:12
 * @Version 1.0
 */
import Sprite = Laya.Sprite;
import {NpcBase} from "../../npc/NpcBase";
import {Utils} from "../../../utils/Utils";
import Camera = Laya.Camera;
import Handler = Laya.Handler;
import ProgressBar = Laya.ProgressBar;
import Vector2 = Laya.Vector2;
import Pool = Laya.Pool;
import {LayerManager} from "../../../manager/LayerManager";

export class VisitorProgressBar extends Sprite{

    public owner:NpcBase;
    public progress:ProgressBar;
    public sceneCamera:Camera;
    private callback:Handler;
    public bubble:Sprite = new Sprite();
    //内部id
    public createIndex:number;

    /***
     * @param camera
     * @param owner
     * @param handler   加载完成回调
     */
    public init(camera:Camera, owner:NpcBase = null, handler:Handler = null):void
    {
        this.sceneCamera = camera;
        this.owner = owner;
        this.callback = handler;

        if(!this.progress)
        {
            Laya.loader.load(["res/image/progressBar.png", "res/image/progressBar$bar.png"], Handler.create(this, function () {
                this.progress = new ProgressBar("res/image/progressBar.png");
                this.progress.width = 80;
                this.progress.height = 20;
                this.progress.sizeGrid = "5,5,5,5";

                this.progress.pivot(this.progress.width / 2,this.progress.height);
                this.addChild(this.progress);

                this.setPosition();
                Laya.timer.loop(10, this, this.setPosition);
                LayerManager.getInstance().downUILayer.addChild(this);
                this.callback && this.callback.run();
            }));
        }
        else
        {
            this.setProgress(0);
            Laya.timer.loop(10, this, this.setPosition);
            LayerManager.getInstance().uiLayer.addChild(this);
            this.callback && this.callback.run();
        }
    }

    public setProgress(value:number):void
    {
        if (this.progress)
            this.progress.value = value;
    }

    public setPosition():void
    {
        if(!this.owner) return;
        //if(!this.isMove())  return;
        var v2:Vector2 = Utils.worldToScreen(this.sceneCamera, this.owner.transform.position);
        this.pos(v2.x, v2.y - 90);
    }

    public isMove():boolean
    {
        return this.owner.isMove;
    }

    public destroy(destroyChild?: boolean) {
        this.removeSelf();
        Laya.timer.clear( this, this.setPosition);
    }
}