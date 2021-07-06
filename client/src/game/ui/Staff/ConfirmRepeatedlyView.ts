import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Succulent_Cfg, Staff_Cfg } from "../../../manager/ConfigManager";

export class ConfirmRepeatedlyView extends ui.view.ConfirmRepeatedlyViewUI {

    private _tableId:number;
    private _gold:number;
    private callback:Laya.Handler;

    constructor(data) {
        super()
        this._tableId = data[0];
        this._gold = data[1];
        this.callback = data[2];
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.InitEvent();
        this.InitView();
    }

    onDisable() {
    }

    onClose() {
        GameUIManager.getInstance().destroyUI(ConfirmRepeatedlyView);
    }

    private InitEvent() {
        this.cBtn.on(Laya.Event.CLICK, this, this.onClose);
        this.tBtn.on(Laya.Event.CLICK, this, this.OnSure);
    }

    private InitView() {
        this.title.text = "员工";
        this.img_potbg.skin = Staff_Cfg[this._tableId].stricon;
        this.condition1.text = "" + Staff_Cfg[this._tableId].star;
        this.detail.text = "" + Staff_Cfg[this._tableId+1].strdeclare;
        this.condition2.text = "" + this._gold;
    }

    private OnSure() 
    {
        this.onClose();
        this.callback.run();
    }
}


