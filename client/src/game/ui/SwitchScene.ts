import { ui } from "../../ui/layaMaxUI";
import SwitchSceneUI = ui.view.SwitchSceneUI;
import Event = Laya.Event;
import { Global } from "../../utils/Global";
import { CommonDefine } from "../../common/CommonDefine";

export class SwitchScene extends SwitchSceneUI {
    public onAwake() {
        super.onAwake();

        Laya.stage.on(CommonDefine.EVENT_BEGIN_ROLL, this, this.hideHand);
        Laya.stage.on(CommonDefine.EVENT_BEGIN_VIEW, this, this.hideUI);
        Laya.stage.on(CommonDefine.EVENT_END_VIEW, this, this.showUI);
    }

    public onEnable() {
        this.leftbt.on(Event.MOUSE_UP, this, this.onLeftClick)
        this.rightbt.on(Event.MOUSE_UP, this, this.onRightClick);
        this.exitView.on(Event.MOUSE_UP, this, this.onExitView);
        this.hand_right.visible = false;
        this.hand_left.visible = false;
        this.exitView.visible = false;
        this.mouseThrough = true;
        super.onEnable();

        this.leftbt.visible = false;
        this.rightbt.visible = false;

    }

    public onDisable() {
        super.onDisable();
        this.leftbt.off(Event.MOUSE_UP, this, this.onLeftClick)
        this.rightbt.off(Event.MOUSE_UP, this, this.onRightClick);
        this.exitView.off(Event.MOUSE_UP, this, this.onExitView);
    }

    public onDestroy() {
        super.onDestroy();
        this.leftbt.off(Event.MOUSE_UP, this, this.onLeftClick)
        this.rightbt.off(Event.MOUSE_UP, this, this.onRightClick);
        this.exitView.off(Event.MOUSE_UP, this, this.onExitView);
    }

    public onOpened(param: any) {
        super.onOpened(param);
    }

    private onLeftClick(e: Event) {
        Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", Global.gameCamera]);
    }

    private onRightClick(e: Event) {
        Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", Global.gameCamera]);
    }

    private onExitView(e: Event) {
        Laya.stage.event(CommonDefine.EVENT_ROLL_BACK);
    }

    private hideHand() {
        this.hand_left.visible = false;
    }

    private hideUI() {
        this.leftbt.visible = false;
        this.rightbt.visible = false;
        this.exitView.visible = true;
    }

    private showUI() {
        this.leftbt.visible = false;
        this.rightbt.visible = false;
        this.exitView.visible = false;
    }
}