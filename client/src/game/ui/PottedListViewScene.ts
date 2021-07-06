

/**花盆列表 */

import PottedListUI = ui.view.PottedListUI
import { ui } from "../../ui/layaMaxUI";
import { CommonDefine } from "../../common/CommonDefine";
import { Debug } from "../../common/Debug";
import { ConfigManager, Succulent_Cfg, Succulentpoint_Cfg } from "../../manager/ConfigManager";
import GameScene from "../scene/GameScene";
import { GameUIManager } from "../../manager/GameUIManager";
import { Global } from "../../utils/Global";


export class PottedListViewScene extends PottedListUI {

    private curPottedId: number;
    private _pointName: string = "";
    constructor(pointName) {
        super()
        this._pointName = pointName

    }

    onEnable() {
        this.init();
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        Global.sceneLock = true;
    }

    onDisable() {
        Global.sceneLock = false;
    }

    onClose() {
        GameUIManager.getInstance().destroyUI(PottedListViewScene)
    }

    init() {
        this.getListArray();
        this.initList();
        this.bindEvent();
    }
    getListArray() {
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
        this.pottedList.array = _arr
    }
    bindEvent() {
        this.btn_close.on(Laya.Event.CLICK, this, this.onClose)
    }

    initList() {
        this.pottedList.vScrollBarSkin = "";
        this.pottedList.mouseHandler = Laya.Handler.create(this, this.mouseHandler, null, false);
        this.pottedList.renderHandler = Laya.Handler.create(this, this.renderHandler, null, false);
    }
    renderHandler(cell: Laya.Box) {
        let _item = cell.getChildByName("pottedItem") as Laya.Image;
        _item.skin = cell.dataSource.striconurl;
    }
    mouseHandler(e: any) {
        if (e.type == Laya.Event.CLICK) {
            this.curPottedId = e.target.dataSource.id;
            Laya.stage.event(CommonDefine.EVENT_CHECKED_POTTED, [this.curPottedId])
            this.onClose();
        }
    }


}


