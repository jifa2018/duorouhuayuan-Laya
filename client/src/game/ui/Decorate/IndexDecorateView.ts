/**
 * 图鉴中引用的装饰的界面
 * 2020年10月22日17:09:33
 */

import { ui } from "../../../ui/layaMaxUI";
import { DefaultStatue_Cfg, ConfigManager, Statue_Cfg } from "../../../manager/ConfigManager";
import { IndexDecorateItem } from "./indexDecorateItem";
import { BottomCreater } from "../../item/BottomCreater";
import { Player } from "../../player/Player";
import { CommonDefine } from "../../../common/CommonDefine";
import { Bottom } from "../../item/Bottom";

export class IndexDecorateView extends ui.view.decorate.indexDecorateUI {
    private mDecorateItem: Map<string, Laya.List> = new Map()
    private nList: any = ConfigManager.prototype.GetJsonToArray(DefaultStatue_Cfg);
    private nStatue: any = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
    constructor() {
        super();
    }

    onEnable() {
        this.init();
        this.bindEvent();
        // this.initList().then(
        //     () => {
        //         this.createList();
        //         this.refreshList();
        //     }
        // );

        this.initBtnList();
        this.refreshBtnList(this.nList)

    }

    onDestroy() {
        // Laya.stage.off(CommonDefine.EVENT_REFRESH_INDEXDECORATEVIEW_LIST, this, this.refreshList);
    }

    init() {
        // this.panel.vScrollBarSkin = "";
        this.width = Laya.stage.width;
        this.height = Laya.stage.height
        // this.x = Laya.stage.width / 2 - this.width / 2
        // this.y = Laya.stage.height / 2 - this.height / 2
    }

    bindEvent() {
        // Laya.stage.on(CommonDefine.EVENT_REFRESH_INDEXDECORATEVIEW_LIST, this, this.refreshList);
    }

    extendArrDecorate(item: IndexDecorateItem, obj) {
        let _data = obj.arrDecorate
        let bottomList = BottomCreater.getInstance().getBottomList();
        let unLock = [];
        let _curDecorateId = null;
        let _lv = 0;
        let extend = { unLock: [], selected: [], isMeet: [] };
        bottomList.forEach((e, i) => {
            if (item.name == e._name) {
                unLock = e._unLockDecorates;
                _curDecorateId = e._curDecorateId;
                _lv = e._level
            }
        })
        for (let index = 0; index < _data.length; index++) {
            const element = _data[index];
            if (_curDecorateId == element.id && extend["selected"].indexOf(element.id) == -1) {
                extend["selected"].push(element.id)
            }
            if (extend["unLock"].indexOf(element.id) == -1) {
                if (unLock.indexOf(element.id) != -1) {
                    extend["unLock"].push(element.id)
                    continue
                }
            } else {
                continue

            }
            let vNum: number = 0;
            if (element.UnlockGold <= Player.getInstance().nGold) vNum++
            if (element.UnlockStar <= Player.getInstance().nStar) vNum++
            if (element.UnlockLv <= _lv) vNum++
            if (element.unLock || vNum == 3 && extend["isMeet"].indexOf(element.id) == -1) {
                extend["isMeet"].push(element.id)
            }
            obj["extend"] = extend
        }
        return obj
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
        _img_lock.visible = this.getCurBottom(cell.dataSource.strNodeName) == null ? true : false
    }

    mouseH(e: Laya.Event) {

        if (e.type == "click") {
            let _name = e.target["node_name"];
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

}  