
/**装饰 */

import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Debug } from "../../../common/Debug";
import GameScene from "../../scene/GameScene";
import { BottomCreater } from "../../item/BottomCreater";
import { Statue_Cfg, ConfigManager, DefaultStatue_Cfg } from "../../../manager/ConfigManager";
import { CommonDefine } from "../../../common/CommonDefine";
import { Utils } from "../../../utils/Utils";
import { SceneRayChecker } from "../../ray/SceneRayChecker";
import { Player } from "../../player/Player";
import GameConfig from "../../../GameConfig";
import { TipViewScene } from "../Common/TipViewScene";
import { EffectManager } from "../../../effect/EffectManager";
import { Bottom } from "../../item/Bottom";

export class DecorateViewScene extends ui.view.decorate.decorateUIUI {

    unLockId: any;
    selectedId: any;
    glowFilter: Laya.GlowFilter;
    private nList: any = ConfigManager.prototype.GetJsonToArray(DefaultStatue_Cfg);
    private nUnLock: number = 0;  //已解锁的
    private selectSign = "gameui/zs/img_use.png"
    private nodeName: string = null;
    constructor(name) {
        super();
        this.nodeName = name || null
    }

    onEnable() {
        this.init()
        this.initBtnList();
        this.refreshBtnList(this.nList);
        this.selectBtn(this.nodeName);
        this.initList();
        this.bindEvent();
        this.refresh(true);
        this.initListBg();
        SceneRayChecker.getInstance().disabledHit = true;
    }

    bindEvent() {
        this.btn_close.on(Laya.Event.CLICK, this, this.closeEv)
        this.select_view.getChildByName("selected").on(Laya.Event.CLICK, this, this.selectEv)
        this.need_view.getChildByName("selected").on(Laya.Event.CLICK, this, this.needEv)
        this.select_view.getChildByName("tip_close").on(Laya.Event.CLICK, this, this.tipClose)
        this.need_view.getChildByName("tip_close").on(Laya.Event.CLICK, this, this.tipClose)
        this.btn_up_level.on(Laya.Event.CLICK, this, this.upLevel)
        Laya.stage.on(CommonDefine.EVENT_BOTTOM_REFRESH, this, this.refresh)
    }
    refresh(isFirst = false) {
        if (!isFirst) {
            this.setTip()
        }
        this.nUnLock = 0;
        this.refreshBottom();
        this.refreshList();
        this.isOnDisableUpBtn();
        this.setHtmlText();
        this.setProValue();
        this.unLockNumberShow();
    }
    onDisable() {
        SceneRayChecker.getInstance().disabledHit = false;
        this.btn_close.offAll()
        this.select_view.getChildByName("selected").offAll()
        this.need_view.getChildByName("selected").offAll()
        this.select_view.getChildByName("tip_close").offAll()
        this.need_view.getChildByName("tip_close").offAll()
        Laya.stage.off(CommonDefine.EVENT_BOTTOM_REFRESH, this, this.refresh)
    }

    init() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.select_view.visible = false;
        this.need_view.visible = false;
        // 创建一个发光滤镜
        const GlowFilter = Laya.GlowFilter;
        this.glowFilter = new GlowFilter("#28cc0d", 6, 0, 0);
    }

    setTip() {
        // let lv = this.label_level.text.replace("LV.", "");
        // if (BottomCreater.getInstance()._curSelectBottom._level.toString() != lv) {
        //     GameUIManager.getInstance().createTopUI(TipViewScene, [null, "装饰底座升级成功", false])
        // }
    }

    refreshBottom() {
        let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
        this.label_level.text = "LV." + BottomCreater.getInstance()._curSelectBottom._level;
        this.miaoshu.text = cmp.strdescription
        this.decorate_img.skin = cmp.strStatueIcon
    }

    initListBg() {
        let aLength = Math.ceil(this.decorate_list.array.length / 4)
        let _arr = [];
        for (let index = 0; index < aLength; index++) {
            _arr[index] = index;
        }
        // this.decorate_list_bg.array = _arr;
        this.decorate_list_bg.array = [];
    }


    initList() {
        this.decorate_list.array = [];
        this.decorate_list.vScrollBarSkin = "";
        this.decorate_list.renderHandler = Laya.Handler.create(this, this.renderHandler, null, false)
        this.decorate_list.mouseHandler = Laya.Handler.create(this, this.mouseHandler, null, false)
    }
    refreshList() {
        let _array = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
        let _bArrray = [];
        _array.forEach(ele => {
            if (ele.StatueType == 2) {
                if (BottomCreater.getInstance()._curSelectBottom) {
                    if (BottomCreater.getInstance()._curSelectBottom._unLockDecorates.indexOf(ele.id) != -1) {
                        ele.unLock = true;
                        this.nUnLock++;
                    } else {
                        ele.unLock = false;
                    }
                    if (BottomCreater.getInstance()._curSelectBottom._curDecorateId == ele.id) {
                        ele.selected = true
                    } else {
                        ele.selected = false
                    }

                    let vNum: number = 0;
                    if (ele.UnlockGold <= Player.getInstance().nGold) vNum++
                    if (ele.UnlockStar <= Player.getInstance().nStar) vNum++
                    if (ele.UnlockLv <= BottomCreater.getInstance()._curSelectBottom._level) vNum++

                    if (ele.unLock || vNum == 3) {
                        ele.isMeet = true;
                    } else {
                        ele.isMeet = false;
                    }
                }
                _bArrray.push(ele);
            }
        });
        this.decorate_list.array = _bArrray;
    }
    mouseHandler(e: Laya.Event) {

        if (e.type == "click") {
            let _box = e.currentTarget as Laya.Box;
            if (_box.dataSource.unLock) {
                this.selectViewInit(_box.dataSource);
                this.select_view.visible = true
            } else {
                this.needViewInit(_box.dataSource);
                this.need_view.visible = true
            }
        }

    }
    renderHandler(cell: Laya.Box) {
        let img = cell.getChildByName("decorate_item") as Laya.Image
        let imgSelect = (cell.getChildByName("sign_selected") as Laya.Image);
        let imgUplock = (cell.getChildByName("sign_uplock") as Laya.Image);
        let goldNumber = (cell.getChildByName("gold_number") as Laya.Label);
        let goldBg = (cell.getChildByName("gold_bg") as Laya.Image);
        let goldImg = (cell.getChildByName("gold_img") as Laya.Image);
        img.width = 100;
        img.height = 100;
        img.skin = cell.dataSource.strStatueIcon;
        goldNumber.text = cell.dataSource.UnlockGold
        img.disabled = (cell.dataSource.unLock == false) ? true : false;
        if (cell.dataSource.selected == false) {
            imgSelect.skin = ""
            if (!img.disabled) {
                Utils.setGlowFilter(img, null)
            }
        } else {
            imgSelect.skin = this.selectSign;
            Utils.setGlowFilter(img, this.glowFilter)
        }
        if (cell.dataSource.isMeet && cell.dataSource.unLock == false) {
            imgUplock.visible = true
            imgUplock.skin = "gameui/zs/img_upLock.png";
        } else if (!cell.dataSource.isMeet) {
            // imgUplock.visible = false
            imgUplock.visible = true
            imgUplock.skin = "gameui/lock.png";
        } else {
            imgUplock.visible = false
        }
    }

    selectViewInit(data) {
        (this.select_view.getChildByName("item") as Laya.Image).skin = data.strStatueIcon;
        this.selectedId = data.id;
    }

    needViewInit(data) {
        (this.need_view.getChildByName("item") as Laya.Image).skin = data.strStatueIcon;
        (this.need_view.getChildByName("need_gold") as Laya.Label).text = "" + data.UnlockGold;
        (this.need_view.getChildByName("need_star") as Laya.Label).text = "" + data.UnlockStar;
        (this.need_view.getChildByName("need_lv") as Laya.Label).text = "" + data.UnlockLv;

        if (data.UnlockGold > Player.getInstance().nGold) {
            (this.need_view.getChildByName("need_gold") as Laya.Label).color = "#f00"
        } else {
            (this.need_view.getChildByName("need_gold") as Laya.Label).color = "#fff"
        }
        if (data.UnlockStar > Player.getInstance().nStar) {
            (this.need_view.getChildByName("need_star") as Laya.Label).color = "#f00"
        } else {
            (this.need_view.getChildByName("need_star") as Laya.Label).color = "#fff"
        }
        if (data.UnlockLv > BottomCreater.getInstance()._curSelectBottom._level) {
            (this.need_view.getChildByName("need_lv") as Laya.Label).color = "#f00"
        } else {
            (this.need_view.getChildByName("need_lv") as Laya.Label).color = "#fff"
        }
        if (data.isMeet) {
            (this.need_view.getChildByName("selected") as Laya.Button).disabled = false;
            this.unLockId = data.id
        } else {
            (this.need_view.getChildByName("selected") as Laya.Button).disabled = true;
            this.unLockId = null;
        }
    }


    upLevel() {
        EffectManager.getInstance().BtnEffect(this.btn_up_level);
        Laya.stage.event(CommonDefine.EVENT_BOTTOM_LEVEL_UP)
    }
    needEv() {
        if (this.unLockId) {
            BottomCreater.getInstance().unLockDecorate(this.unLockId)
            this.unLockId = null;
        }
        this.tipClose();
    }
    selectEv() {
        BottomCreater.getInstance()._curSelectBottom._curDecorateId = this.selectedId;
        this.selectedId = null;
        this.tipClose();
        Laya.stage.event(CommonDefine.EVENT_BOTTOM);

    }
    closeEv() {
        GameUIManager.getInstance().destroyUI(DecorateViewScene);
    }

    /**
     * 设置升级按钮的状态
     */
    isOnDisableUpBtn() {
        let _is = false;
        if (BottomCreater.getInstance()._curSelectBottom._bId) {
            let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
            if (cmp.UnlockGold <= Player.getInstance().nGold && cmp.UnlockStar <= Player.getInstance().nStar && this.nUnLock >= cmp.UnlockLvNum) {
                _is = false
            } else {
                _is = true;
            }
            if (BottomCreater.getInstance()._curSelectBottom._level >= BottomCreater.getInstance().maxBottomUpLv) {
                _is = true;
            }
        }
        this.btn_up_level.disabled = _is;
    }

    /**
     * 描述文字
     *  
     */
    setHtmlText() {
        let nAttraction = 0;
        let nStar = 0;
        let iCmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
        if (iCmp) {
            nAttraction = iCmp.attraction
            nStar = iCmp.GiveStar
        }
        this.htmlText.x = 0;
        this.htmlText.y = 0;
        this.htmlText.style.width = 514;
        this.htmlText.style.height = 81;
        this.htmlText.style.align = "center";
        this.htmlText.style.lineHeight = 30;
        this.htmlText.style.color = "#b0792b";
        this.htmlText.style.fontSize = 24;
        this.htmlText.style.padding = [10, 5, 10, 5]

        let strArr = Utils.getArrayBySplitString(iCmp.strdescription1, "\n");
        let html = "";
        strArr.forEach(element => {
            html += "<span>" + element + "</span><br/>";
        });
        this.htmlText.innerHTML = html;
    }

    /**
     * 根据等级获取下一等级的数据
     * @param _id 
     */
    // getNextLvDataById(): any {
    //     let sCmp = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
    //     let iCmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
    //     for (let index = 0; index < sCmp.length; index++) {
    //         const element = sCmp[index];
    //         if (iCmp.StatueType == element.StatueType && (element.lv - 1) == iCmp.lv) {
    //             return element;
    //         }
    //     }
    // }

    /**
     * 设置进度条
     */
    setProValue() {
        if (!BottomCreater.getInstance()._curSelectBottom) return
        let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
        if (Player.getInstance().nGold >= cmp.UnlockGold) {
            this.pro_value.value = 1;
            Utils.setGlowFilter(this.pro_value, this.glowFilter)
        } else {
            this.pro_value.value = Player.getInstance().nGold / cmp.UnlockGold;
            Utils.setGlowFilter(this.pro_value, null)
        }

        this.value_gold1.text = Player.getInstance().nGold + "";
        this.value_gold2.text = cmp.UnlockGold + ""

    }

    tipClose() {
        this.need_view.visible = false
        this.select_view.visible = false
    }

    /**
     * 显示解锁信息
     */
    unLockNumberShow() {
        let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
        let bottom: Bottom = this.getCurBottom(this.nodeName);
        let point = bottom._name.replace("defaultStatueNode", "");
        this.title1.text = "装饰点" + point;
        this.unLockNumber1.text = "装饰点" + point + " (已解锁:" + this.nUnLock + "个)";
        this.unLockNumber2.text = this.nUnLock + "/" + cmp.UnlockLvNum;
    }

    refreshBtnList(arr) {
        this.btn_list.array = arr;
    }

    initBtnList() {
        this.btn_list.array = [];
        this.btn_list.renderHandler = Laya.Handler.create(this, this.renderH, null, false)
        this.btn_list.mouseHandler = Laya.Handler.create(this, this.mouseH, null, false)
    }

    renderH(cell: Laya.Box, index) {
        let _btn_item = cell.getChildByName("btn_item") as Laya.Button
        let _img_lock = cell.getChildByName("img_lock") as Laya.Image
        _btn_item.label = "装饰点" + (index + 1);
        _btn_item["node_name"] = cell.dataSource.strNodeName;
        if (this.getCurBottom(cell.dataSource.strNodeName) == null) {
            _img_lock.visible = true;
            cell.gray = false;
        } else {
            _img_lock.visible = false;
            cell.gray = true;
        }

    }

    mouseH(e: Laya.Event) {

        if (e.type == "click") {
            this.nodeName = e.target["node_name"];
            this.selectBtn(this.nodeName)
        }

    }


    /**
     * 获取底座
     * @param name 
     */
    getCurBottom(name) {
        let bottomList = BottomCreater.getInstance().getBottomList();
        let bottom: Bottom = null;
        bottomList.forEach((e, i) => {
            if (name == e._name) {
                bottom = e;
            }
        })
        return bottom
    }


    /**默认选中的btn按钮 */
    selectBtn(name) {
        if (!name) {
            this.nodeName = this.nList[0].strNodeName;
        }
        BottomCreater.getInstance().curSelectBottom(this.getCurBottom(this.nodeName))
        this.refresh();
    }

}