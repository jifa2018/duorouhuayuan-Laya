

/**公共提示框 */

import { ui } from "../../../ui/layaMaxUI"
import { GameUIManager } from "../../../manager/GameUIManager";
import MouseController from "../../script/MouseController";
import GameScene from "../../scene/GameScene";
import { Global } from "../../../utils/Global";
import { EffectManager } from "../../../effect/EffectManager";

export class TipViewScene extends ui.view.common.TipViewSceneUI {

    private _confirmCallBack: Function;
    private _cancelCallBack: Function;
    private _title: any;
    private _content: any;
    private isShowBtn = false

    constructor(param) {
        super()
        this._title = param[0] ? param[0] : "";                  // 标题
        this._content = param[1] ? param[1] : "";                // 内容
        this.isShowBtn = param[2] ? param[2] : false;            // 是否显示按钮
        this._confirmCallBack = param[3] ? param[3] : null;      // 取消回调
        this._cancelCallBack = param[4] ? param[4] : null        // 确定回调

        console.log("=======tip============", param)

    }


    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.bindEvent();
        this.initView();
        Global.sceneLock = true
    }
    initView() {
        Laya.timer.clearAll(this);
        this.title.text = this._title;
        this.content.text = this._content;
        if (this.isShowBtn) {
            this.tBtn.visible = true
            this.cBtn.visible = true
        } else {
            this.tBtn.visible = false
            this.cBtn.visible = false
            Laya.timer.once(1000, this, () => {
                GameUIManager.getInstance().destroyTopUI(TipViewScene)
            })
        }
    }
    bindEvent() {
        this.tBtn.on(Laya.Event.CLICK, this, this.confirmEv);
        this.cBtn.on(Laya.Event.CLICK, this, this.cancelEv);
        this.on(Laya.Event.CLICK, this, this.clickEvent)
    }

    clickEvent() {
        GameUIManager.getInstance().destroyUI(TipViewScene);
    }

    cancelEv() {
        //按钮特效
        EffectManager.getInstance().BtnEffect(this.cBtn);
        GameUIManager.getInstance().destroyUI(TipViewScene)
    }
    confirmEv() {
        //按钮特效
        EffectManager.getInstance().BtnEffect(this.tBtn);
        GameUIManager.getInstance().destroyUI(TipViewScene)
        if (this._confirmCallBack)
            this._confirmCallBack()
    }

    onDestroy() {
        this.tBtn.offAll()
        this.cBtn.offAll()
        Global.sceneLock = false
        Laya.timer.clearAll(this);
    }
}