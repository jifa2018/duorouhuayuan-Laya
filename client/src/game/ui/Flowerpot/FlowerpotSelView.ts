

/**花盆列表 */

import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Succulentpoint_Cfg, Succulent_Cfg } from "../../../manager/ConfigManager";
import { Player } from "../../player/Player";
import { Utils } from "../../../utils/Utils";
import { FlowerpotTipsView } from "./FlowerpotTipsView";

export class FlowerpotSelView extends ui.view.Flowerpot.FlowerpotSelViewUI {

    private curPottedId: number;
    private _pointName: string = "";
    private _pointIndex: number = 0;
    /** 花盆列表 */
    private _potData = [];
    constructor(pointName) {
        super()
        this._pointName = pointName[0]
        this._pointIndex = pointName[1];
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.InitEvent();
        this.InitView();
    }

    onDisable() {
    }

    onClose() {
        GameUIManager.getInstance().destroyUI(FlowerpotSelView)
    }

    private InitEvent() {
        this.closeBtn.on(Laya.Event.CLICK, this, this.onClose);

    }

    private InitView() {
        this.SetPotList();
    }

    private UpdatePotData() {
        if (!this._pointName) return
        let _data = Succulentpoint_Cfg[this._pointName].flowerpot;
        let _arr = [];
        if (Object.keys(_data).length > 0) {
            for (const key in _data) {
                if (Object.prototype.hasOwnProperty.call(_data, key)) {
                    const element = _data[key];
                    let eItem = Succulent_Cfg[element];
                    eItem.id = element;
                    _arr.push(eItem)
                }
            }
        } else {
            let eItem = Succulent_Cfg[_data];
            eItem.id = _data;
            _arr.push(eItem)
        }
        this._potData = _arr;
        function SortFun(tLeft, tRight): number {
            let nleftLock = Player.getInstance().tPotData[tLeft.id] ? 1 : 0;
            let nRightLock = Player.getInstance().tPotData[tRight.id] ? 1 : 0;
            if (nleftLock != nRightLock)
                return nleftLock > nRightLock ? -1 : 1;

            let nleftcan = (Player.getInstance().nStar >= Succulent_Cfg[tLeft.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tLeft.id].gold) ? 1 : 0;
            let nRightcan = (Player.getInstance().nStar >= Succulent_Cfg[tRight.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tRight.id].gold) ? 1 : 0;

            if (nleftcan != nRightcan)
                return nleftcan > nRightcan ? -1 : 1;
            return tLeft.id < tRight.id ? -1 : 1;
        }
        this._potData.sort(SortFun);
    }

    private SetPotList() {
        this.UpdatePotData();
        this.potList.array = this._potData;
        this.potList.renderHandler = new Laya.Handler(this, this.renderHandler);
        this.potList.vScrollBarSkin = "";
    }

    private renderHandler(item, index) {
        let tPot = item.getChildByName("img_pot") as Laya.Image;
        let tVolume = item.getChildByName("la_volume") as Laya.Label;
        let tLockCon = item.getChildByName("la_lockcon") as Laya.Image;
        let tunLockCon = item.getChildByName("la_unlockcon") as Laya.Image;
        let tBg = item.getChildByName("img_bg") as Laya.Image;
        tPot.skin = this._potData[index].striconurl;
        tVolume.text = Utils.format("容量:{0}", this._potData[index].capacity || 0);
        tLockCon.visible = false;
        tunLockCon.visible = false;
        tPot.disabled = false;
        tBg.visible = index % 3 == 0;
        if (!(Player.getInstance().tPotData[this._potData[index].id])) 
        {   
            //已解锁
            if (this.GetPotIsCanUnLock(this._potData[index].id)) 
            {
                //是否满足解锁条件
                tLockCon.visible = true;
            } else {
                //未解锁，不满足解锁条件
                tPot.disabled = true;
                tunLockCon.visible = true;
            }
        }
        item.on(Laya.Event.CLICK, this, this.OnClickPot, [index]);
    }

    private OnClickPot(index) {
        let potId = this._potData[index].id;
        //打开二级确认框
        GameUIManager.getInstance().createUI(FlowerpotTipsView, [this._pointName, this._pointIndex, potId]);
    }

    /** 是否满足解锁条件 */
    private GetPotIsCanUnLock(potId) {
        if (Player.getInstance().nStar < Succulent_Cfg[potId].unlockstar) {
            return false;
        }
        if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
            return false
        }
        return true;
    }
}


