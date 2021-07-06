

/**DIY调整工具 */
import DiyToolViewUI = ui.view.DiyToolSceneUI
import { ui } from "../../../ui/layaMaxUI";
import { CommonDefine } from "../../../common/CommonDefine";
import { Tree } from "../../item/Tree";
import { SceneManager } from "../../../manager/SceneManager";
import { DIYScene } from "../../scene/DIYScene";
import { Debug } from "../../../common/Debug";
import { GameUIManager } from "../../../manager/GameUIManager";
import GameScene from "../../scene/GameScene";
import { Global } from "../../../utils/Global";
import { Utils } from "../../../utils/Utils";
import { Succulent_Cfg, Tree_Cfg } from "../../../manager/ConfigManager";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { EffectManager } from "../../../effect/EffectManager";

export class DiyToolView extends DiyToolViewUI {

    /**之后走配表 */
    private vZoom: number = 0.05;
    private vRotate: number = 2;
    private nTime: number = 400;
    private vZoomMax: number = 5;
    private vZoomMin: number = 0.5;
    curTree: Tree;
    bar: Laya.ProgressBar
    private _mouseY = 0
    private treeZoom: number = 1;
    private isCreate: boolean = false;

    /**植物编辑前初始数据 */
    private treeInitData: any = {
        _id: null,
        _scale: null,
        _pos: null,
        _rotate: null
    }
    huakuanState: boolean;

    constructor() {
        super()
    }

    onEnable() {
        this.width = Laya.stage.width
        this.height = Laya.stage.height
        this.BindEvent();
        Laya.stage.event(CommonDefine.EVENT_EDIT, [true])
    }

    /**
     * 
     * @param _tree        植物
     * @param isCreate     是否是首次种植 
     */
    setCurTree(_tree: Tree, isCreate: boolean) {
        this.curTree = _tree;
        this.isCreate = isCreate;
        this.treeZoom = this.curTree.getScale();
        this.vZoomMax = this.curTree.maxZoom;
        this.vZoomMin = this.curTree.minZoom;
        // this.setTool();
        this.setTreeInitData();
        this.scrollbar.max = Tree_Cfg[this.curTree._id].zoommax
        this.scrollbar.min = Tree_Cfg[this.curTree._id].zoommin
        this.scrollbar.scrollSize = 0.1;
        this.scrollbar.value = this.scrollbar.max + this.scrollbar.min - this.curTree._scale

        this.scrollbar.changeHandler = Laya.Handler.create(this, this.onChange, null, false)
    }
    /**设置初始化植物的数据 */
    setTreeInitData() {
        this.treeInitData = {
            _id: this.curTree._id,
            _scale: this.curTree.transform.scale.x,
            _pos: new Laya.Vector3(this.curTree.transform.position.x, this.curTree.transform.position.y, this.curTree.transform.position.z),
            _rotate: this.curTree.transform.localRotationEuler.y
        }
    }

    /**取消之后恢复原来的数据 */
    cancelAfter() {
        if (this.isCreate) {
            DIYScene.instance.RemoveTree();
            Laya.stage.event(CommonDefine.EVENT_DIYUI_REFRESH)
        } else {
            Laya.stage.event(CommonDefine.EVENT_DIY_RESET_TREE)
        }
    }

    setTool() {
        let v3: Laya.Vector3 = new Laya.Vector3(this.curTree.transform.position.x, this.curTree.transform.position.y, this.curTree.transform.position.z)
        let v2: Laya.Vector2 = Utils.worldToScreen(DIYScene.instance.camera, v3);
        this.pos(v2.x + 5, v2.y - 85);
        this.treeZoom = this.treeZoom * 0.9
        if (this.treeZoom < 1) return
        this.scale(this.treeZoom, this.treeZoom)
        for (let index = 0; index < this.numChildren; index++) {
            const _child = this.getChildAt(index) as Laya.Sprite;
            _child.scale(1 / (this.treeZoom), 1 / (this.treeZoom))
        }
    }

    onClosed() {
        Laya.stage.event(CommonDefine.EVENT_EDIT, [false])
    }

    onDestroy() {
        this.left_btn.offAll();
        this.right_btn.offAll();
        this.cancel.offAll();
        this.save.offAll();
        this.big.offAll();
        this.little.offAll();
        this.scrollbar.offAll();
        DIYScene.instance.editorMode = false
        Laya.stage.event(CommonDefine.EVENT_EDIT, [false])
    }

    BindEvent() {
        this.left_btn.on(Laya.Event.CLICK, this, this.LeftEvent, [this]);
        this.right_btn.on(Laya.Event.CLICK, this, this.RightEvent, [this]);

        this.cancel.on(Laya.Event.CLICK, this, this.cancelEv);
        this.save.on(Laya.Event.CLICK, this, this.saveEv);

        this.left_btn.on(Laya.Event.MOUSE_DOWN, this, this.DContinueLeftEvent);
        this.right_btn.on(Laya.Event.MOUSE_DOWN, this, this.DContinueRightEvent);

        this.left_btn.on(Laya.Event.MOUSE_UP, this, this.ClearTime);
        this.right_btn.on(Laya.Event.MOUSE_UP, this, this.ClearTime);

        this.left_btn.on(Laya.Event.MOUSE_OUT, this, this.ClearTime);
        this.right_btn.on(Laya.Event.MOUSE_OUT, this, this.ClearTime);
    }

    onChange(value) {
        let n = this.scrollbar.max + this.scrollbar.min - value
        this.curTree.setScale(n)
        GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 2)
    }

    saveEv() {
        GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 3)
        GameUIManager.getInstance().destroyUI(DiyToolView);
    }
    cancelEv() {
        this.cancelAfter();
        GameUIManager.getInstance().destroyUI(DiyToolView);
    }

    /**计时器 */
    private GoTime(state: boolean, callBack?: any) {
        if (state) {
            Laya.timer.once(this.nTime, this, () => {
                if (callBack) {
                    callBack();
                }
            })
        } else {
            Laya.timer.clearAll(this);
        }
    }

    private ClearTime() {
        this.GoTime(false)
    }


    RefershEvent(call) {
        Laya.timer.frameLoop(1, this, () => {
            call(this);
        })
    }

    DContinueRightEvent() {
        this.GoTime(true, () => {
            this.RefershEvent(this.RightEvent)
        })
    }
    DContinueLeftEvent() {
        this.GoTime(true, () => {
            this.RefershEvent(this.LeftEvent)
        })
    }

    RightEvent(self) {
        let _rotate: number = self.curTree.getRotate();
        self.curTree.setRotate(_rotate + self.vRotate)
    }
    LeftEvent(self) {
        let _rotate: number = self.curTree.getRotate();
        self.curTree.setRotate(_rotate - self.vRotate)
    }


}