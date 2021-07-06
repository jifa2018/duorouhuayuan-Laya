



/**
 * 主界面获取礼物
 */
import { SaveManager, ModelStorage } from "../../../../manager/SaveManager";
import { gift_Cfg, Effect_Cfg } from "../../../../manager/ConfigManager";
import { CommonDefine } from "../../../../common/CommonDefine";
import { Avatars } from "../../../../effect/Avatars";
export class getGoods {

    private storage_time: number = 0;
    private curId: number;
    private curGoodsId: number;
    private curGoodsTime: number;
    private curGoodsNum: number;
    private _pro: any;
    private eff: Avatars = null;
    constructor(pro) {
        this.init();
        this._pro = pro;
    }

    init() {
        this.getStorage();
        this.goTime();
    }

    /**是否可以领取礼物 */
    isGetGoods() {
        let _new_time: number = Laya.Browser.now() / 1000;
        let _dTime: number = _new_time - this.storage_time;
        let mm: number = this.curGoodsTime * 60;
        // mm = mm > 10 ? 10 : mm
        if (_dTime >= mm) {
            Laya.timer.clearAll(this);
            Laya.stage.event(CommonDefine.EVENT_MAIN_GOODS_EVENT, [true, 0, this.curGoodsId, this.curGoodsNum])
        } else {
            Laya.stage.event(CommonDefine.EVENT_MAIN_GOODS_EVENT, [false, mm - _dTime, this.curGoodsId, this.curGoodsNum])
        }
        return [_dTime, mm]
    }

    /**点击的领取
     * 
     */
    startTime() {
        let _d = gift_Cfg[this.curId + 1];
        this.curId = _d ? this.curId + 1 : this.curId
        this.setTime();
        this.goTime();
    }

    goTime() {
        Laya.timer.loop(1000, this, () => {
            let arr = this.isGetGoods();
            this.setProValue(arr[0], arr[1]);
            if (arr[0] >= arr[1]) {
                if (this.eff) {
                    this.eff.Destroy();
                    this.eff = null;
                }
                return
            }
            let _x = this._pro.x + this._pro.width * this._pro.value;
            let _y = this._pro.y;
            if (!this.eff) {
                this.eff = new Avatars(this._pro.parent);
                this.eff.Load(Effect_Cfg[6].streffect, 1, 1, _x, _y, Laya.Handler.create(this, () => {
                    this.eff.Play(Effect_Cfg[6].straniname, true, true, null);
                }));
            } else {
                this.eff.setPostion(_x, _y)
            }
        })
    }


    /**
     * 进度条
     */
    setProValue(cTime, sTime) {
        // let _vaule = 1 - cTime / sTime;
        let _vaule = cTime / sTime;
        this._pro.value = _vaule;
    }

    /**更新记录时间 */
    setTime() {
        let data: any = {
            time: Laya.Browser.now() / 1000,
            curId: this.curId,
        }
        SaveManager.getInstance().SetGoodsTime(data);
        this.getStorage();
    }
    /**
     * 获取缓存
     */
    getStorage() {
        let data = SaveManager.getInstance().GetCache(ModelStorage.SgoodsTime);
        if (data) {
            this.storage_time = data.time
            this.curId = data.curId
        } else {
            this.storage_time = Laya.Browser.now() / 1000;
            this.curId = 1
            let data: any = {
                time: this.storage_time,
                curId: this.curId,
            }
            SaveManager.getInstance().SetGoodsTime(data);
        }
        this.curGoodsId = gift_Cfg[this.curId].itemID;
        this.curGoodsTime = gift_Cfg[this.curId].time;
        this.curGoodsNum = gift_Cfg[this.curId].num;
    }

}