/**
 * 2020年9月3日12:25:44
 * 图鉴 
 */

import { ui } from "../../../ui/layaMaxUI";
import IllustratedUI = ui.view.Illustrated.IllustratedUI
import { Map_Cfg, Succulent_Cfg } from "../../../manager/ConfigManager";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Point } from "../../item/Point";
import { CommonDefine } from "../../../common/CommonDefine";

export class Illustrated extends IllustratedUI {

    private _comp = null;
    private _initListArr = [];
    private _mapId = null;
    private _mapLv = null;
    constructor(agms) {
        super()
        this._mapId = agms[0] || 1;
        this._mapLv = agms[1] || 1;
    }

    onEnable() {
        this._comp = this.getComp()
        let oDrop = this.getUnRepetDrop(this._comp);
        this.setTitle();
        this.setListArr(oDrop);
        this.initList();
        this.refreshList();
        this.bindEvent();
    }

    onDestroy() {
        this.btn_close.off(Laya.Event.CLICK, this, this.closeEv)
        this.stage.off(CommonDefine.EVENT_ILLUSTRATED_REFRESH, this, this.refreshList)
    }

    bindEvent() {
        this.btn_close.on(Laya.Event.CLICK, this, this.closeEv)
        this.stage.on(CommonDefine.EVENT_ILLUSTRATED_REFRESH, this, this.refreshList)
    }

    closeEv() {
        GameUIManager.getInstance().destroyUI(Illustrated);
    }

    setTitle() {
        this.title_label.text = this._comp[1].strmapname
    }

    setListArr(oDrop) {
        for (const key in oDrop) {
            if (Object.prototype.hasOwnProperty.call(oDrop, key)) {
                const _element = oDrop[key];
                let item = {}
                item["id"] = key;
                item["sComp"] = Succulent_Cfg[key];
                for (const _key in _element) {
                    if (Object.prototype.hasOwnProperty.call(_element, _key)) {
                        const element = _element[_key];
                        item[_key] = element
                    }
                }
                this._initListArr.push(item);
            }
        }

    }

    refreshList() {
        this.list.array = this._initListArr
    }

    initList() {
        this.list.array = []
        this.list.vScrollBarSkin = "";
        this.list.renderHandler = Laya.Handler.create(this, this.renderHandler, null, false)
        this.list.mouseHandler = Laya.Handler.create(this, this.mouseHandler, null, false)
    }

    renderHandler(cell: Laya.Box) {
        let img = cell.getChildByName("list_item_img") as Laya.Image;
        let la_lockcon = cell.getChildByName("la_lockcon") as Laya.Image;
        img.skin = cell.dataSource.sComp.striconurl
        if (cell.dataSource.mapLevel > this._mapLv) {
            img.gray = true;
            la_lockcon.skin = "gameui/lock.png";
        } else {
            img.gray = false;
            la_lockcon.skin = "gameui/cancollect.png";
        }
        (cell.getChildByName("label_name") as Laya.Label).text = cell.dataSource.sComp.strname
    }

    mouseHandler(e: Laya.Event) {
        let dataSource = (e.currentTarget as Laya.Box).dataSource
        let img = (e.currentTarget as Laya.Box).getChildByName("list_item_img") as Laya.Image;
        if (e.type == "click") {
            this.setTip(false)
            let text = "";
            let _pos = e.target.localToGlobal(new Laya.Point(img.x, img.y))
            let pos = _pos
            if (img.gray) {
                text = dataSource.sComp.strname + " 开放" + dataSource.strDoc + "区域解锁";
            } else {
                text = dataSource.sComp.strname;
            }
            this.setTip(true, text, pos)
        }

    }

    /**去重获得 */
    getUnRepetDrop(dComp) {
        let dropMap = {};
        for (const key in dComp) {
            if (Object.prototype.hasOwnProperty.call(dComp, key)) {
                const element = dComp[key];
                let arrSidgroup = (element.strSidgroup as String).split("|");
                let strdrop = (element.strdrop as String).split("|");
                strdrop.forEach((e, i) => {
                    if (!dropMap[e]) {
                        dropMap[e] = element;
                    }
                });
                arrSidgroup.forEach((e, i) => {
                    if (!dropMap[e]) {
                        dropMap[e] = element;
                    }
                })
            }
        }
        return dropMap;
    }

    /**对应地图表数据 */
    getComp() {
        let _comp = {};
        for (const key in Map_Cfg) {
            if (Object.prototype.hasOwnProperty.call(Map_Cfg, key)) {
                const element = Map_Cfg[key];
                if (element.mapid == this._mapId) {
                    _comp[key] = element;
                }
            }
        }
        return _comp
    }

    /**
     * 设置提示
     * @param text 
     * @param pos 
     * @param isShow 
     */
    setTip(isShow, text?, pos?) {
        this.tip.visible = isShow;
        if (isShow == false) {
            Laya.timer.clearAll(this)
            return
        }
        this.tip.pos(pos.x - 50, pos.y - 60);
        this.tipTxt.text = text;


        Laya.timer.once(1500, this, () => {
            this.tip.visible = false
        })

    }

}