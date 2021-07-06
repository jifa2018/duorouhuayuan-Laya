/**
 * 2020年10月22日20:21:50
 * 动态生成的装饰
  */

import { GameUIManager } from "../../../manager/GameUIManager";
import { UnlockView } from "./unlockView";
import { BottomCreater } from "../../item/BottomCreater";
import { Bottom } from "../../item/Bottom";

export class IndexDecorateItem {
    pref: Laya.Prefab;
    index: any;
    private _heightoffset: number = 132;
    view: any;
    list: Laya.List = null;
    img_bg: Laya.Image;
    listHeight: number;
    name: any;
    more: Laya.Label;
    public get getList() {
        return this.list
    }

    public get getName() {
        return name;
    }

    constructor(pref: Laya.Prefab, index, view, name) {
        this.pref = pref;
        this.index = index;
        this.view = view;
        this.init();
        this.img_bg = this.list.getChildByName("img_bg") as Laya.Image;
        this.more = (this.list.getChildByName("more") as Laya.Label);
        this.listHeight = this.list.height
        this.name = name
    }

    onDestroy() {
        this.more.offAll()
    }

    init() {
        let pre: Laya.Prefab = new Laya.Prefab()
        pre.json = this.pref;
        this.list = Laya.Pool.getItemByCreateFun("decorateList", pre.create, pre) as Laya.List;
        this.list.name = "decorate_list_" + this.index;
    }

    renderList(cell: Laya.Box, index) {
        let img = cell.getChildByName("decorate_item") as Laya.Image;
        img.width = 100;
        img.height = 100;
        let imgSelect = (cell.getChildByName("sign_selected") as Laya.Image);
        let imgUplock = (cell.getChildByName("sign_uplock") as Laya.Image);
        img.skin = cell.dataSource.strStatueIcon;
        let _id = cell.dataSource.id

        let extend = this.list["extend"];
        if (extend) {
            imgUplock.visible = true;
            imgSelect.visible = false;
            cell.disabled = false;
            if (extend.unLock.indexOf(_id) == -1 && extend.isMeet.indexOf(_id) == -1) {
                imgUplock.skin = "gameui/lock.png";
                cell.disabled = true
            } else if (extend.isMeet.indexOf(_id) != -1) {
                imgUplock.skin = "gameui/zs/img_upLock.png"
            } else {
                imgUplock.visible = false
            }
            if (extend.selected.indexOf(_id) != -1) {
                imgSelect.visible = true;
            }
        }

    }

    eventList(e: Laya.Event) {
        if (e.type == "click") {
            let extend = this.list["extend"];
            let _box = e.currentTarget as Laya.Box;
            if (extend.unLock.indexOf(_box.dataSource.id) != -1) {
                console.log("已解锁")
            } else {
                // this.needViewInit(_box.dataSource);
                // this.need_view.visible = true

                console.log("未解锁")
                let _data = {
                    dataSource: _box.dataSource,
                    name: this.name
                }
                BottomCreater.getInstance().curSelectBottom(this.getCurBottom(this.name))
                GameUIManager.getInstance().showUI(UnlockView, null, _data);
            }
        }
    }

    setArray(data) {
        this.list.array = data.arrDecorate;
        this.list["extend"] = data.extend
    }

    /**
     * 标题
     */
    setTitle(str) {
        let _titile = (this.list.getChildByName("title") as Laya.Label)
        _titile.text = str || "";
        _titile.color = "#000"
    }

    /**更多事件 */
    setMoreEvent() {
        this.more.on(Laya.Event.CLICK, this, this.moreEvent)
    }


    moreEvent() {
        this.setListConfig();
        this.view.refreshList();
    }

    setMoreState() {
        let _more = (this.list.getChildByName("more") as Laya.Label);
        if (this.list.array.length > 4) {
            _more.visible = true;
        } else {
            _more.visible = false;
        }
    }

    /**渲染列表的Y轴数量 */
    setListConfig() {
        let n = (this.list.repeatY == 1) ? Math.ceil(this.list.array.length / 4) : 1;
        this.list.repeatY = n;
        this.img_bg.height = this.listHeight * n;
        this.list.height = this.listHeight * n

        if (n > 1) {
            this.more.text = "收起"
        } else {
            this.more.text = "更多"
        }

    }

    setPos(x, y) {
        let _x = x || this.list.x;
        let _y = y || this.list.y;
        this.list.pos(_x, _y)
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
