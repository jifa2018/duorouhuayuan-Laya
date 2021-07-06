

/**
 * 文字描述提示
 */

import { ui } from "../../../ui/layaMaxUI";
import contentTipUI = ui.view.common.ContentTipUI
import { GameUIManager } from "../../../manager/GameUIManager";
import { Collection_station_Cfg, Map_Cfg } from "../../../manager/ConfigManager";
import { CollectMapDataManager } from "../../../manager/CollectMapDataManager";
import { TipViewScene } from "../Common/TipViewScene";

export class ContentTip extends contentTipUI {

    private _comp = Collection_station_Cfg;
    private sign = null;
    private _title: any;
    constructor(param) {
        super()
        this.sign = param[0];
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height
        this.bindEvent();
        this.onShowContent();
        Laya.timer.once(2000, this, this.onHideContent)

    }

    onDestroy() {
        this.off(Laya.Event.CLICK, this, this.onClick)
        Laya.timer.clearAll(this);
        GameUIManager.getInstance().destroyUI(TipViewScene)
    }

    bindEvent() {
        this.on(Laya.Event.CLICK, this, this.onClick)
    }
    onClick() {
        this.onHideContent();
    }

    onShowContent() {
        let content = this.getCompBySign(this.sign);
        if(content == "")   return;
        this._title = this._title || "";
        GameUIManager.getInstance().destroyUI(TipViewScene)
        GameUIManager.getInstance().createTopUI(TipViewScene, [this._title, content, false])
    }

    onHideContent() {
        GameUIManager.getInstance().destroyUI(ContentTip)
    }

    getCompBySign(sign: string) {
        if (CollectMapDataManager.getInstance().getLock(sign))
            return "";//"已解锁,内容刷新还没写好";
        for (const key in this._comp) {
            if (Object.prototype.hasOwnProperty.call(this._comp, key)) {
                const element = this._comp[key];
                let arrUnlockmap = (element.strunlockmap as string).split(",");
                this.getMapName(arrUnlockmap[0], arrUnlockmap[1])
                let newTxt = element.strunlockmap.replace(",", "_") + "_collectpoint"
                if (newTxt == sign) {
                    return element.strunlocktip
                }
            }
        }
    }

    getMapName(id, lv) {

        for (const key in Map_Cfg) {
            if (Object.prototype.hasOwnProperty.call(Map_Cfg, key)) {
                const element = Map_Cfg[key];
                if (Number(id) == element.mapid && Number(lv) == element.mapLevel) {
                    this._title = element.strDoc;
                    return
                }
            }
        }
    }

}