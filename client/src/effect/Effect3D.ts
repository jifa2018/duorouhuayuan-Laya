import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import Node = Laya.Node;
import { ResourceManager } from "../manager/ResourceManager";
import Handler = Laya.Handler;
import ShuriKenParticle3D = Laya.ShuriKenParticle3D;

export class Effect3D extends Sprite3D {
    private addNode: Node;
    private bLoop: boolean;
    private pos: Vector3 = null;
    private offset: Vector3;
    private effectNode: Sprite3D;
    private liveTime: number;
    private callback: any

    constructor() {
        super();
    }

    /**
     * 创建跟随特效
     * @param url       特效url
     * @param parent    跟随节点
     * @param playTime  播放时间 0为无限存在 手动删除
     * @param loop      是否循环
     * @param offset    特效偏移
     */
    public createFollowEffect(url: string, parent: any, playTime: number = 3000, loop: boolean = false, offset: Vector3 = null): void {
        this.addNode = parent;
        this.bLoop = loop;
        this.offset = offset;
        this.liveTime = playTime;
        ResourceManager.getInstance().getResource(url, Handler.create(this, this.onLoaded));
    }

    /***
     * 创建固定位置特效
     * @param url           特效url
     * @param parent        父节点
     * @param position      特效位置
     * @param playTime      播放时间 0为无限存在 手动删除
     * @param loop          是否循环
     * @param offset        特效偏移
     */
    public createSceneEffect(url: string, parent: any, position: Vector3, playTime: number = 3000, loop: boolean = false, offset: Vector3 = null, callback: any = null): void {
        this.addNode = parent;
        this.bLoop = loop;
        this.pos = position;
        this.offset = offset;
        this.liveTime = playTime;
        this.callback = callback;
        ResourceManager.getInstance().getResource(url, Handler.create(this, this.onLoaded));
    }

    /**
     * 特效加载完毕
     * @param effect
     */
    public onLoaded(effect: Sprite3D): void {
        this.effectNode = effect;
        this.addNode.addChild(effect);
        if (this.pos) {
            effect.transform.position = this.pos.clone();
        }
        if (this.offset) {
            Vector3.add(effect.transform.position, this.offset, this.pos);
            effect.transform.position = this.pos.clone();
        }
        if (this.liveTime > 0) {
            Laya.timer.once(this.liveTime, this, this.destroy);
        }

        this.setLoop(effect, this.bLoop);
        this.callback && this.callback(effect);
    }

    /**
     * 销毁
     * @param destroyChild
     */
    public destroy(destroyChild?: boolean) {
        this.effectNode.destroy();
        super.destroy(destroyChild);
    }

    /**
     * 设置特效循环播放
     * @param b 是否循环
     */
    private setLoop(node: Sprite3D, b: boolean): void {
        for (var i: number = 0; i < node.numChildren; ++i) {
            var childs: any = node.getChildAt(i);
            if (childs instanceof ShuriKenParticle3D) {
                (childs as ShuriKenParticle3D).particleSystem.looping = b;
            }
            if (childs.numChildren > 0)
                this.setLoop(childs, b);
        }

    }
}