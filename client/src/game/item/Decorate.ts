/**
 * @Purpose 装饰类
 * @Author zhanghj
 * @Date 2020/8/5 16:52
 * @Version 1.0
 */
import Sprite3D = Laya.Sprite3D;
import { ResourceManager } from "../../manager/ResourceManager";
import Handler = Laya.Handler;
import { Statue_Cfg } from "../../manager/ConfigManager";
import Timer = Laya.timer
import { BottomCreater } from "./BottomCreater";
import { Effect3D } from "../../effect/Effect3D";

export class Decorate extends Sprite3D {

    private _model: Sprite3D;
    private _id: number;
    public state: boolean = false;
    public time: number = 0;
    private _rotateTime: number = 0;
    private _stopTime: number = 0
    public _effect: Effect3D = null;
    private _effectUrl: string = "";
    private _indicateEffect: Laya.Sprite3D = null;
    public init(id: number): void {
        var url: string = Statue_Cfg[id].strStatueModel;
        this._id = id;
        ResourceManager.getInstance().getResource(url, Handler.create(this, this.onDecorateLoaded));

    }

    setInfo(_data, rT, sT) {

        if (_data) {
            this.state = _data.state;
            this.time = _data.time ? _data.time : 0;
        }

        this._rotateTime = rT * 1000;
        this._stopTime = sT * 1000;
    }



    /**
     * 更好模型
     */
    public onChangeModel(id: number): void {
        var url: string = Statue_Cfg[id].strStatueModel;
        this._id = id;
        Laya.timer.clearAll(this);
        ResourceManager.getInstance().getResource(url, Handler.create(this, this.onDecorateLoaded));

    }

    /**
     * 加载完毕
     * @param decorate
     */
    private onDecorateLoaded(decorate: Sprite3D): void {
        this._model && this._model.destroy();
        this._model = null;

        this._model = decorate;
        this.addChild(decorate);

        this.behavior();
    }

    private _nT: number = 1000;
    /**旋转 */
    behavior() {
        Laya.timer.loop(this._nT, this, () => {
            if (isNaN(this.time)) {
                this.time = 0;
            }
            if (this.time == 0) {
                BottomCreater.getInstance().refreshData();
            }
            if (this.state) {
                this.createEffect();
                this.rotateBehavior();
                return
            } else {
                Laya.Tween.clearAll(this)
                this.stopState();
                this.disableEffect();
                return
            }
        })
    }

    stopState() {
        this.time += this._nT;
        if (this.time >= this._stopTime) {
            this.state = true;
            this.time = 0;
        }
    }

    rotateBehavior() {
        this.time += this._nT;
        if (this.time >= this._rotateTime) {
            this.state = false;
            this.time = 0;
        }
        let rot = new Laya.Vector3(this._model.transform.rotationEuler.x, this._model.transform.rotationEuler.y + 20, this._model.transform.rotationEuler.z);
        Laya.Tween.to(this._model.transform.rotationEuler, {
            x: rot.x, y: rot.y, z: rot.z, update: new Handler(this, function () {
                if (!this._model || !this._model.transform) {
                    Laya.Tween.clearAll(this)
                    return
                }
                this._model.transform.rotationEuler = this._model.transform.rotationEuler;
            })
        }, 1000);
    }

    addEffect(url, indicateEffect) {
        this._effectUrl = url;
        this._indicateEffect = indicateEffect;
    }

    createEffect() {
        if (this._effect) return
        this._effect = new Effect3D();
        this._effect.createSceneEffect(this._effectUrl, this, this._model.transform.position, 0, true, null);
        this._indicateEffect.active = true;
    }

    disableEffect() {
        if (!this._effect) return
        this._effect.destroy();
        this._effect = null;
        this._indicateEffect.active = false;
    }




}