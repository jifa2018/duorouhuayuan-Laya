/** DIY */

import { ui } from "../../../ui/layaMaxUI";
import DiyUI = ui.view.DiySceneUI;
import { Debug } from "../../../common/Debug";
import { ConfigManager, Succulent_Cfg, Constant_Cfg } from "../../../manager/ConfigManager";
import { CommonDefine } from "../../../common/CommonDefine";
import { GameUIManager } from "../../../manager/GameUIManager";
import { DIYScene } from "../../scene/DIYScene";
import { Global } from "../../../utils/Global";
import GameScene from "../../scene/GameScene";
import { SceneManager } from "../../../manager/SceneManager";
import { BagSystem } from "../../bag/BagSystem";
import { Potted } from "../../item/Potted";
import { DIYFinishView } from "./DIYFinishView";
import { TipViewScene } from "../Common/TipViewScene";
import { DiyToolView } from "./DiyToolView";
import { Utils } from "../../../utils/Utils";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { GuideManager } from "../Guide/GuideManager";
import { EffectManager } from "../../../effect/EffectManager";

export enum URLS {
    json_Box_Item = "prefab/BoxItem.json",
    zuoanniu1 = "gameui/btn-zuoanniu1.png",
    zuoanniu2 = "gameui/btn-zuoanniu2.png",
    youanniu1 = "gameui/btn-youanniu1.png",
    youanniu2 = "gameui/btn-youanniu2.png"
}

export class DiyView extends DiyUI {

    /**鼠标标签 */
    private mouseState: boolean = false;
    private _caneraAngle: boolean = false;
    private vRotation: number = 0;
    dCirclePlant: Laya.Sprite;
    zCirclePlant: Laya.Sprite;
    dMouseX: number = 0;
    curCircle: Laya.Sprite;
    private curTreeData: any = null;
    private followImg: Laya.Image = null;
    curItemPosX: number;
    curItemPosY: number;
    boxItem: any;
    boxBg: any;
    curCheckedBoxItem: any;
    curCheckedBoxBg: any;

    /**最大盆中放置的植物 */
    private maxPottedTreesNum: number = 9
    listGrayState: boolean;
    clickTarget: number;
    private editState: boolean = false; // 编辑状态
    constructor(data: any) {
        super()
        //引导相关
        if (GuideManager.getInstance().CurFreeGuide != null && GuideManager.getInstance().CurFreeGuide._guideID < 4) {
            this.back.visible = false
        }
        else {
            this.back.visible = true
        }
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.BtnEvent();
        this.dCreateList();
        this.zCreateList();
        this.refreshList();
        this.showTree();
        this.setPottedTreesNum();
    }

    onDestroy() {
        this.dBtn.offAll();
        this.zBtn.offAll();
        this.qBtn.offAll();
        this.back.offAll();
        this.finish.offAll();
        this.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        this.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.back.off(Laya.Event.CLICK, this, this.Back);
        this.finish.off(Laya.Event.CLICK, this, this.OpenScorePanel);
        this.up_down.offAll();
        Laya.stage.off(CommonDefine.EVENT_CREATE_TREE_FINISH, this, this.createTreeFinish)
        Laya.stage.off(CommonDefine.EVENT_POTTED_CHANGE, this, this.setPottedTreesNum)
        Laya.stage.off(CommonDefine.EVENT_POT_INIT_FINISH, this, this.setPottedTreesNum)
        Laya.stage.off(CommonDefine.EVENT_EDIT, this, this.isEdit)
        Laya.stage.off(CommonDefine.EVENT_DIYUI_REFRESH, this, this.refreshList)
        SceneManager.getInstance().openScene(GameScene.instance);
        this.bottomTab.offAll()
    }

    private BtnEvent() {
        this.dBtn.on(Laya.Event.CLICK, this, this.showTree);
        this.zBtn.on(Laya.Event.CLICK, this, this.decorate);
        this.qBtn.on(Laya.Event.CLICK, this, this.caneraAngle);
        this.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.back.on(Laya.Event.CLICK, this, this.Back);
        this.finish.on(Laya.Event.CLICK, this, this.OpenScorePanel);
        this.up_down.on(Laya.Event.CLICK, this, this.upDown)
        Laya.stage.on(CommonDefine.EVENT_CREATE_TREE_FINISH, this, this.createTreeFinish)
        Laya.stage.on(CommonDefine.EVENT_POTTED_CHANGE, this, this.setPottedTreesNum)
        Laya.stage.on(CommonDefine.EVENT_POT_INIT_FINISH, this, this.setPottedTreesNum)
        Laya.stage.on(CommonDefine.EVENT_EDIT, this, this.isEdit)
        Laya.stage.on(CommonDefine.EVENT_DIYUI_REFRESH, this, this.refreshList)
        this.bottomTab.on(Laya.Event.MOUSE_OVER, this, this.bottomTabOver)
        this.bottomTab.on(Laya.Event.MOUSE_OUT, this, this.bottomTabOut)
    }
    isEdit(state: boolean) {
        if (state) {
            this.joinEdit();
        } else {
            this.outEdit();
        }
    }

    setPottedTreesNum() {
        this.maxPottedTreesNum = DIYScene.instance.getPottedMaxNum() || 9
        let _item = this.bottom_clip_box.getChildByName("item") as Laya.Box;
        let n: number = DIYScene.instance.getPottedTreeNumber()
        n = n || 0
        let _n: string = n.toString();
        let _maxPottedTreesNum: string = this.maxPottedTreesNum.toString();

        _item.removeChildren();
        let nOffset: number = 0;
        nOffset = _n.length > 1 ? 80 : 102;
        for (let index = 0; index < _n.length; index++) {
            const element = _n[index];
            let _arr = [this.content.x + nOffset + index * 22, this.content.y + 6, element, "gameui/main/number.png", 10, 1]
            let img = Utils.getClipNum(_arr);
            img.scale(1.4, 1.4)
            _item.addChild(img);
        }

        for (let index = 0; index < _maxPottedTreesNum.length; index++) {
            const element = _maxPottedTreesNum[index];
            let _arr = [this.content.x + 150 + index * 22, this.content.y + 6, element, "gameui/main/number.png", 10, 1]
            let img = Utils.getClipNum(_arr);
            img.scale(1.4, 1.4)
            _item.addChild(img);
        }



        // this.content.text = n + " / " + this.maxPottedTreesNum

        if (n >= this.maxPottedTreesNum) {
            this.listGrayState = true
            this.toolState(true)
        } else {
            this.listGrayState = false
            this.toolState(false)
        }
        if (n <= 0 || n > this.maxPottedTreesNum) {
            this.finish.disabled = true;
        } else {
            this.finish.disabled = false;
        }
    }

    private OpenScorePanel() {
        DIYScene.instance.savePotted();
        EffectManager.getInstance().BtnEffect(this.finish);
        GameUIManager.getInstance().showUI(DIYFinishView);
        GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 4)
    }




    refreshList() {
        this.dToolList.array = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_DUOROU);
        this.zToolList.array = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_ZHUANGSHI);
        //2020年10月21日17:00:24 修复切换滚动条不归0问题
        this.zToolList.scrollBar.value = 0;
        this.dToolList.scrollBar.value = 0;
        // console.log("背包刷新影响DIY列表数据", "this.dToolList.array", this.dToolList.array, "this.zToolList.array", this.zToolList.array)

        let tPot: Potted = DIYScene.instance.getPotted();
        if (tPot != null) {
            //判断评分的 第二阶段和第三阶段
            let data = tPot.GetNextTwoNode()
            this.second.skin = "gameui/flowerstate/potquality" + data[0] + ".png"
            this.trird.skin = "gameui/flowerstate/potquality" + data[1] + ".png"
            let va = tPot.quality / Constant_Cfg[9].value[data[1]]
            this.diyeva.value = va / 2 + 0.5
            this.curfen.skin = tPot.GetQualityImg();
        }
    }

    dCreateList() {
        this.dToolList.array = [];
        this.dToolList.renderHandler = Laya.Handler.create(this, this.dToolListRender, null, false)
        this.dToolList.hScrollBarSkin = ""
    }

    zCreateList() {
        this.zToolList.array = [];
        this.zToolList.renderHandler = Laya.Handler.create(this, this.zCreateListRender, null, false)
        this.zToolList.hScrollBarSkin = ""
    }


    /**创建多肉的列表 */
    dToolListRender(cell: Laya.Box) {
        let _item = cell.getChildByName("item") as Laya.Image;
        let _data = Succulent_Cfg[cell.dataSource.itemId]
        _data["id"] = cell.dataSource.itemId;
        _item.skin = _data.striconurl
        this.addClipNum(cell);
        // _num.text = cell.dataSource.itemNum
        _item.offAll();
        _item.on(Laya.Event.MOUSE_DOWN, this, this.createListItemMouseDown, [_data, cell]);
        _item.on(Laya.Event.MOUSE_MOVE, this, this.createListItemMouseMove);
        _item.on(Laya.Event.MOUSE_OUT, this, this.createListItemMouseOut);
    }

    /**创建装饰的列表 */
    zCreateListRender(cell: Laya.Box) {
        let _item = cell.getChildByName("item") as Laya.Image;
        let _data = Succulent_Cfg[cell.dataSource.itemId]
        _data["id"] = cell.dataSource.itemId;
        _item.skin = _data.striconurl
        this.addClipNum(cell);
        // _num.text = cell.dataSource.itemNum
        _item.offAll();
        _item.on(Laya.Event.MOUSE_DOWN, this, this.createListItemMouseDown, [_data, cell]);
        _item.on(Laya.Event.MOUSE_MOVE, this, this.createListItemMouseMove);
        _item.on(Laya.Event.MOUSE_OUT, this, this.createListItemMouseOut);
    }

    addClipNum(cell: Laya.Box) {
        let _clip_box = cell.getChildByName("clip_box") as Laya.Box;
        let _itemNum: string = cell.dataSource.itemNum.toString();
        let _num = cell.getChildByName("num") as Laya.Label;
        _clip_box.removeChildren();
        for (let index = 0; index < _itemNum.length; index++) {
            const element = _itemNum[index];
            let _arr = [_num.x + 60 + index * 16, _num.y, element, "gameui/main/number.png", 10, 1]
            let img = Utils.getClipNum(_arr);
            _clip_box.addChild(img);
        }
    }

    createListItemMouseUp() {
        this.mouseState = false;
        this.curTreeData = null;
        this.curItemPosX = 0
        this.curItemPosY = 0
        this.clearFollowImg();
        this.clearGray();
    }

    createListItemMouseDown(data, box) {

        //编辑模式/列表变灰/已经触发
        if (this.editState || this.listGrayState || this.mouseState) return

        this.mouseState = true;
        this.curTreeData = data;

        this.curCheckedBoxItem = box.getChildByName("item");
        this.curCheckedBoxBg = box.getChildByName("bg");

        this.setGray();
    }
    createListItemMouseOut() {
        if (!this.mouseState) return
        this.mouseState = false
    }

    createListItemMouseMove() {

        if (!this.curTreeData) return
        let _y = Laya.stage.mouseY;
        if ((_y - this.curItemPosY) > 120) {
            DIYScene.instance.OpenDrag = true;
            this.setFollowImg(this.curTreeData.striconurl);
            this.dToolList.scrollBar.stopScroll()
            this.zToolList.scrollBar.stopScroll()

        } else {
            DIYScene.instance.OpenDrag = false;
            this.clearFollowImg();
        }
    }
    setFollowImg(imgUrl: string) {
        if (!this.followImg) {
            this.followImg = new Laya.Image(imgUrl);
            this.followImg.width = 140;
            this.followImg.height = 120;
            this.followImg.name = "0990"
            this.addChild(this.followImg);
        }
        if (this.followImg) {
            this.followImg.x = Laya.stage.mouseX - this.followImg.width / 2;
            this.followImg.y = Laya.stage.mouseY - this.followImg.height;
        }
    }

    clearFollowImg() {
        if (this.followImg) {
            this.followImg.destroy();
            this.followImg = null
            // this.dToolList.scrollBar.value = 0;
            // this.zToolList.scrollBar.value = 0;
        }
    }

    createTreeFinish() {
        this.clearGray();
    }

    Finished(CLICK: string, arg1: this, Finished: any) {
        Debug.Log("完成")
        DIYScene.instance.savePoint();
        this.BackHome();
    }
    Back(CLICK: string, arg1: this, Back: any) {
        EffectManager.getInstance().BtnEffect(this.back);
        Debug.Log("退出")
        GameUIManager.getInstance().createUI(TipViewScene, [null, "是否放弃本次操作，当前修改会取消", true, this.BackHome])
    }

    BackHome() {
        DIYScene.instance.potted && DIYScene.instance.potted.clearSelect();
        GameUIManager.getInstance().destroyUI(DiyView);
        GameUIManager.getInstance().destroyUI(DiyToolView);
        DIYScene.instance.payBack();
    }

    mouseDown(e: Event) {
        this.dMouseX = e["stageX"]
        this.curItemPosX = Laya.stage.mouseX
        this.curItemPosY = Laya.stage.mouseY
        DIYScene.instance.OpenDrag = true;
    }

    mouseUp() {
        this.dMouseX = 0
        this.curTreeData = null;
        this.clearFollowImg();
        this.clearGray();
    }

    private nTreeCreate: number = 550;
    private nRoll: number = 300;

    mouseMove(e: Event) {
        this.createListItemMouseMove();
        let _is = e["stageY"] < this.nTreeCreate ? true : false
        /**临时解决列表滑动中植物被创建的问题 */
        if (!_is) {
            if (this.curTreeData) {
                Laya.stage.event(CommonDefine.EVENT_CREATE_TREE, [this.curTreeData.id]);
                this.curTreeData = null;
                this.clearFollowImg();
            }
            return
        }

    }

    /**圆盘的旋转 */
    curCircleRotation(v: number) {
        this.vRotation = v;
        this.curCircle.rotation = v;
    }

    /**设置工具列表的旋转 */
    toolsArrayItemRotation(target, v: number) {
        if (target) {
            for (let index = 0; index < target.numChildren; index++) {
                const element = target.getChildAt(index) as Laya.Box;
                element.rotation = -v

            }
        }
    }

    caneraAngle() {
        EffectManager.getInstance().BtnEffect(this.qBtn);
        this._caneraAngle = !this._caneraAngle;
        DIYScene.instance.caneraAngle(this._caneraAngle);
    }

    decorate() {
        EffectManager.getInstance().BtnEffect(this.zBtn);
        this.clickTarget = 2
        this.dToolList.visible = false;
        this.zToolList.visible = true;
        this.dBtn.skin = URLS.zuoanniu1;
        this.zBtn.skin = URLS.youanniu2;
        (this.dBtn.getChildAt(0) as Laya.Label).color = "#8f5c2a";
        (this.dBtn.getChildAt(0) as Laya.Label).strokeColor = "#fff";
        (this.zBtn.getChildAt(0) as Laya.Label).color = "#fff";
        (this.zBtn.getChildAt(0) as Laya.Label).strokeColor = "#8f5c2a";
        // this.curCircle = this.zCirclePlant;
        this.changeListBg(0);
        this.refreshList();
    }
    showTree() {
        EffectManager.getInstance().BtnEffect(this.dBtn)
        this.clickTarget = 1
        this.dToolList.visible = true;
        this.zToolList.visible = false;
        this.dBtn.skin = URLS.zuoanniu2;
        this.zBtn.skin = URLS.youanniu1;
        (this.dBtn.getChildAt(0) as Laya.Label).color = "#fff";
        (this.dBtn.getChildAt(0) as Laya.Label).strokeColor = "#8f5c2a";
        (this.zBtn.getChildAt(0) as Laya.Label).color = "#8f5c2a";
        (this.zBtn.getChildAt(0) as Laya.Label).strokeColor = "#fff";
        // this.curCircle = this.dCirclePlant;
        this.changeListBg(0);
        this.refreshList();
    }

    /**植物列表置灰操作 */
    setGray() {
        if (this.curCheckedBoxItem && this.curCheckedBoxBg) {
            this.curCheckedBoxItem.gray = true;
            this.curCheckedBoxBg.gray = true;
        }

    }
    /**植物列表重置置灰操作 */
    clearGray() {
        if (this.curCheckedBoxItem && this.curCheckedBoxBg) {
            this.curCheckedBoxItem.gray = false;
            this.curCheckedBoxBg.gray = false;
        }
    }

    /**进入编辑模式 */
    joinEdit() {

        this.back.disabled = true;
        this.finish.disabled = true;
        this.dBtn.disabled = true
        this.zBtn.disabled = true
        this.editState = true;
        this.toolState(true)

    }

    /**退出编辑模式 */
    outEdit() {
        let n: number = DIYScene.instance.getPottedTreeNumber() || 0
        let nMax = DIYScene.instance.getPottedMaxNum() || 9;
        this.back.disabled = false;
        this.finish.disabled = (n <= 0 || n > nMax) ? true : false;
        this.dBtn.disabled = false
        this.zBtn.disabled = false
        this.editState = false;
        if (this.listGrayState) return
        this.toolState(false)
    }

    toolState(b: boolean) {
        for (let index = 0; index < this.dToolList.numChildren; index++) {
            const element = this.dToolList.getChildAt(index) as Laya.Box;
            element.disabled = b
        }

        for (let index = 0; index < this.zToolList.numChildren; index++) {
            const element = this.zToolList.getChildAt(index) as Laya.Box;
            element.disabled = b
        }
    }


    private hBG1 = 222;
    private hBG2 = 360;
    private hBtn2 = 315;
    private hBtn1 = 176;
    private sBtn1 = "gameui/list/kai.png";
    private sBtn2 = "gameui/list/guan.png";
    private hList1 = 113;
    private hList2 = 260;

    upDown() {
        if (this.img_bg.height == this.hBG1) {
            this.changeListBg(1)
            this.refreshList();
        } else {
            this.changeListBg(0)
            this.refreshList();
        }
    }

    changeListBg(state) {
        if (state == 1) {
            this.img_bg.height = this.hBG2;
            this.up_down.skin = this.sBtn2
            this.up_down.y = this.hBtn2
            if (this.zToolList.visible) {
                this.zToolList.scrollBar.value = 0;
                this.zToolList.repeatY = 2
                this.zToolList.height = this.hList2
            }
            if (this.dToolList.visible) {
                this.dToolList.scrollBar.value = 0;
                this.dToolList.repeatY = 2
                this.dToolList.height = this.hList2
            }
        } else {
            this.img_bg.height = this.hBG1;
            this.up_down.skin = this.sBtn1
            this.up_down.y = this.hBtn1
            if (this.zToolList.visible) {
                this.zToolList.repeatY = 1
                this.zToolList.height = this.hList1
            }
            if (this.dToolList.visible) {
                this.dToolList.repeatY = 1
                this.dToolList.height = this.hList1
            }
        }
    }

    bottomTabOver() {
        Global.sceneLock = true
    }

    bottomTabOut() {
        Global.sceneLock = false
    }
}