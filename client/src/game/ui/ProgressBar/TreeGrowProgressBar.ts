/**
 * @Purpose 角色进度条
 * @Author zhanghj
 * @Date 2020/8/12 16:12
 * @Version 1.0
 */
import Sprite = Laya.Sprite;
import { NpcBase } from "../../npc/NpcBase";
import { Utils } from "../../../utils/Utils";
import Camera = Laya.Camera;
import Handler = Laya.Handler;
import ProgressBar = Laya.ProgressBar;
import Vector2 = Laya.Vector2;
import Pool = Laya.Pool;
import { LayerManager } from "../../../manager/LayerManager";
import { Time } from "../../../common/Time";
import { PotManager } from "../../../manager/PotManager";

export class TreeGrowProgressBar extends Sprite {

    public owner: NpcBase;
    public progress: ProgressBar;
    public timeLabel: Laya.Label;
    public sceneCamera: Camera;
    private callback: Handler;

    public GrowStartTime: number = 0;
    public GrowTime: number = 0;

    public pointName;
    public index;

    /***
     * @param camera
     * @param owner
     * @param handler   加载完成回调
     */
    public init(camera: Camera, owner = null, data, handler: Handler = null): void {
        this.sceneCamera = camera;
        this.owner = owner;
        this.callback = handler;
        this.GrowStartTime = data.startTime;
        this.GrowTime = data.growTime;

        this.pointName = data.pointName;
        this.index = data.index;


        if (!this.progress) {
            Laya.loader.load(["gameui/flowerstate/progress.png", "gameui/flowerstate/progress$bar.png"], Handler.create(this, function () {
                this.progress = new ProgressBar("gameui/flowerstate/progress.png");
                this.progress.width = 160;
                this.progress.height = 26;
                this.progress.sizeGrid = "0,18,0,18";

                this.progress.pivot(this.progress.width / 2, this.progress.height/2);
                this.addChild(this.progress);
                // let la_text = new Laya.Text();
                // la_text.text = "成长中";
                // la_text.fontSize = 24;
                // la_text.align = "center"
                // la_text.pivot(la_text.width / 2, la_text.height);
                // la_text.y = -30
                // this.addChild(la_text);
                this.timeLabel = new Laya.Label(Utils.formatStandardTime(this.GrowTime - (Time.Seconds - this.GrowStartTime), false));
                this.timeLabel.fontSize = 18;
                this.timeLabel.align = "center"
                this.timeLabel.color = "#8d4e10";
                this.timeLabel.pivot(this.timeLabel.width / 2, this.timeLabel.height);
                this.addChild(this.timeLabel);
                this.setPosition();
                Laya.timer.loop(10, this, this.setPosition);
                LayerManager.getInstance().downUILayer.addChild(this);
                this.callback && this.callback.run();
            }));
        }
        else {
            this.setProgress(0);
            Laya.timer.loop(10, this, this.setPosition);
            LayerManager.getInstance().uiLayer.addChild(this);
            this.callback && this.callback.run();
        }
    }

    public setProgress(value: number): void {
        this.progress.value = value;
    }

    public UpdateProgress(): void {
        let nPro = (Time.Seconds - this.GrowStartTime) / this.GrowTime;
        this.progress.value = nPro;
        this.timeLabel.text = Utils.format("正在成长 {0}", Utils.formatStandardTime(this.GrowTime - (Time.Seconds - this.GrowStartTime), false));
        this.timeLabel.pivot(this.timeLabel.width / 2, this.timeLabel.height/2);
        if ((1-nPro) <= 0) {
            Laya.timer.clear(this, this.setPosition);
            this.destroy(true)
            PotManager.getInstance().UpdateScenePot(this.pointName, this.index);
        }
    }

    public setPosition(): void {
        if (!this.owner) return;
        var v2: Vector2 = Utils.worldToScreen(this.sceneCamera, this.owner.transform.position);
        this.pos(v2.x, v2.y - 90);
        this.UpdateProgress()
    }

    public isMove(): boolean {
        return this.owner.isMove;
    }

    public destroy(destroyChild?: boolean) {
        this.removeSelf();
        Laya.timer.clear(this, this.setPosition);
    }
}