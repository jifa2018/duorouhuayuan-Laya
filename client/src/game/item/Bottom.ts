/**
 * @Purpose 底座类
 * @Author zhanghj
 * @Date 2020/8/6 17:54
 * @Version 1.0
 */
import { ResourceManager } from "../../manager/ResourceManager";
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import { Decorate } from "./Decorate";
import { Succulent_Cfg, Statue_Cfg, ConfigManager, DefaultStatue_Cfg } from "../../manager/ConfigManager";
import { BottomCreater } from "./BottomCreater";
import { Effect3D } from "../../effect/Effect3D";
import GameScene from "../scene/GameScene";

export class Bottom extends Sprite3D {

    public _data: any = null;
    private _model: Sprite3D;
    public _bId: number;
    public _name: string;
    public _level: number = 1;
    public _attraction: number = 0;
    public _star: number = 0;
    public _curDecorate: Decorate = null;
    public _curDecorateId: number = null;
    public _unLockDecorates = [];           //解锁id列表
    public _sustain: number = 0;            //装饰行为持续时间
    public _interval: number = 0;           //装饰行为间隔时间
    private _weight: number = 0;             //权重
    public _curDecorateInfo: any = null;
    public _zoom = 1;
    private _indicateEffect: Laya.Sprite3D = null;
    public init(_data): void {
        this._data = _data;
        this._bId = _data.bId;
        this._name = _data.parentName
        this._level = _data.bLevel;
        this._attraction = _data.attraction
        this._star = _data.star
        this._curDecorateId = _data.curDecorateId
        this._unLockDecorates = _data.unLockDecorates
        this._curDecorateInfo = _data.curDecorateInfo;
        var url: string = Statue_Cfg[this._bId].strStatueModel;
        this._zoom = this.getZoom();
        ResourceManager.getInstance().getResource(url, Handler.create(this, this.onLoaded));

    }

    resetInifo() {
        this._sustain = Statue_Cfg[this._bId].sustain;
        this._interval = Statue_Cfg[this._bId].interval;
        this._weight = Statue_Cfg[this._bId].weight;
    }

    private onLoaded(bottom: Sprite3D): void {
        this._model && this._model.destroy();
        this._model = null;

        let decorate = new Laya.Sprite3D();
        decorate.name = "decorate";
        this._model = bottom;
        this.addChild(bottom);
        bottom.transform.setWorldLossyScale(new Laya.Vector3(this._zoom, this._zoom, this._zoom));// = new Laya.Vector3(this._zoom, this._zoom, this._zoom);
        this._model.addChild(decorate);

        /**每次加载/升级都需要重新获取表中的数据 */
        this.resetInifo();
        this._indicateEffect = GameScene.instance.scene3d.getChildByName("point").getChildByName(this._name + "_jiantou");
        this._indicateEffect.active = false;

        if (this._curDecorateId) {
            this.addDecorate();
        }
    }

    /**
     * 底座上增加装饰
     * @param decorateId
     */
    public addDecorate(): void {
        let url = Statue_Cfg[this._bId].strEffect;
        var dec: Decorate = new Decorate();
        dec.setInfo(this._curDecorateInfo, this._sustain, this._interval);
        dec.addEffect(url, this._indicateEffect);
        dec.onChangeModel(this._curDecorateId);
        this._curDecorateId = this._curDecorateId;
        this._curDecorate = dec;
        this._model.getChildByName("point").destroyChildren()
        this._model.getChildByName("point").addChild(dec);

    }

    /**
     * 升级
     */
    public onLevelUp(maxLv): void {
        if (this._level >= maxLv) return //直接返回
        this._level += 1;
        this._bId = BottomCreater.getInstance().getStatueItemData(this._level).id;
        var url: string = Statue_Cfg[this._bId].strStatueModel;
        ResourceManager.getInstance().getResource(url, Handler.create(this, this.onLoaded));
    }

    /**解锁装饰记录 */
    public unLockDecoratesById(_id: number) {
        this._unLockDecorates.push(_id);
    }

    /**加评星 */
    addStar(v: number) {
        this._star += v;
    }

    /**加吸引力 */
    addAttraction(v: number) {
        this._attraction += v
    }

    /**
     * 缩放值
     */
    getZoom() {
        let zoom: number;
        BottomCreater.getInstance().defaultStatueArray.forEach(element => {
            if (element.strNodeName == this._name) {
                zoom = element.zoom
            }
        });
        return zoom;
    }

    /**权重  */
    getWeight() {
        if (!this._curDecorateId || !this._curDecorate._effect) {
            return 0
        }
        return this._weight
    }
    // showEffect() {
    //     this._effect
    // }

}