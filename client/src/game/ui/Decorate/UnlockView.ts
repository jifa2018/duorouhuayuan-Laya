

/**
 * 装饰解锁页面
 * 2020年10月26日11:07:24
 */

import { ui } from "../../../ui/layaMaxUI";
import { Player } from "../../player/Player";
import { BottomCreater } from "../../item/BottomCreater";
import { GameUIManager } from "../../../manager/GameUIManager";
import { CommonDefine } from "../../../common/CommonDefine";

export class UnlockView extends ui.view.decorate.unlockUI {
    data: any;
    constructor(_data) {
        super();
        this.data = _data.dataSource
        this.name = _data.name;
    }

    onDestroy() {
        // this.need_view.getChildByName("tip_close").offAll()
        // this.need_view.getChildByName("selected").offAll();
    }

    onEnable() {
        this.bindEvent();
        this.init()

        // if (this.data.isMeet) {
        //     (this.need_view.getChildByName("selected") as Laya.Button).disabled = false;
        //     this.unLockId = this.data.id
        // } else {
        //     (this.need_view.getChildByName("selected") as Laya.Button).disabled = true;
        //     this.unLockId = null;
        // }
    }

    bindEvent() {
        this.need_view.getChildByName("tip_close").on(Laya.Event.CLICK, this, this.eventClose)
        this.need_view.getChildByName("selected").on(Laya.Event.CLICK, this, this.selectedEv)
    }

    init() {
        (this.need_view.getChildByName("item") as Laya.Image).skin = this.data.strStatueIcon;
        (this.need_view.getChildByName("need_gold") as Laya.Label).text = "" + this.data.UnlockGold;
        (this.need_view.getChildByName("need_star") as Laya.Label).text = "" + this.data.UnlockStar;
        (this.need_view.getChildByName("need_lv") as Laya.Label).text = "" + this.data.UnlockLv;

        if (this.data.UnlockGold > Player.getInstance().nGold) {
            (this.need_view.getChildByName("need_gold") as Laya.Label).color = "#f00"
        } else {
            (this.need_view.getChildByName("need_gold") as Laya.Label).color = "#fff"
        }
        if (this.data.UnlockStar > Player.getInstance().nStar) {
            (this.need_view.getChildByName("need_star") as Laya.Label).color = "#f00"
        } else {
            (this.need_view.getChildByName("need_star") as Laya.Label).color = "#fff"
        }

        let _lv: number = 0;
        let bottomList = BottomCreater.getInstance().getBottomList();
        bottomList.forEach((e, i) => {
            if (this.name == e._name) {
                _lv = e._level
            }
        })
        if (this.data.UnlockLv > _lv) {
            (this.need_view.getChildByName("need_lv") as Laya.Label).color = "#f00"
        } else {
            (this.need_view.getChildByName("need_lv") as Laya.Label).color = "#fff"
        }
    }

    eventClose() {
        GameUIManager.getInstance().destroyUI(this)
    }

    selectedEv() {
        BottomCreater.getInstance().unLockDecorate(this.data.id);
        Laya.stage.event(CommonDefine.EVENT_REFRESH_INDEXDECORATEVIEW_LIST);
        this.eventClose();
    }



}