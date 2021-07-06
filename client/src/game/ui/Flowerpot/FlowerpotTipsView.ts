/**花盆列表 */

import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Player } from "../../player/Player";
import { Utils } from "../../../utils/Utils";
import { Succulent_Cfg } from "../../../manager/ConfigManager";
import { CommonDefine } from "../../../common/CommonDefine";
import { SceneManager } from "../../../manager/SceneManager";
import { DIYScene } from "../../scene/DIYScene";
import { DiyView } from "../DiyView/DiyView";
import { FlowerpotSelView } from "./FlowerpotSelView";
import { LoadingScenes1 } from "../LoadingScenes1";
import { EffectManager } from "../../../effect/EffectManager";

export class FlowerpotTipsView extends ui.view.Flowerpot.FlowerpotTipsViewUI {

    private curPottedId: number;
    private _pointName: string = "";
    private _pointIndex: number = 0;
    private callback:Laya.Handler
    /** 花盆列表 */
    private _potData = [];

    constructor(data) {
        super()
        this._pointName = data[0]
        this._pointIndex = data[1]
        this.curPottedId = data[2];
        this.callback = data[3]
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
        GameUIManager.getInstance().destroyUI(FlowerpotTipsView)
    }

    private InitEvent() {
        this.cBtn.on(Laya.Event.CLICK, this, this.onClose);
        this.tBtn.on(Laya.Event.CLICK, this, this.OnSure);
    }

    private InitView() {
        this.img_potbg.y = 66;
        if (Player.getInstance().tPotData[this.curPottedId]) {    //已解锁
            this.lockPanel.visible = false;
            this.title.text = Utils.format("使用{0}花盆", Succulent_Cfg[this.curPottedId].strname || "00");
            this.img_potbg.y = 86;
            this.useVolumePanel.visible = true;
            this.la_usevolume.text = Succulent_Cfg[this.curPottedId].capacity;
            this.img_sure.visible = true;
            this.img_money.visible = false;
            this.volumePanel.visible = false;
        } else {
            this.useVolumePanel.visible = false;
            this.condition0.text = Succulent_Cfg[this.curPottedId].unlockstar
            // if (Player.getInstance().nStar < Succulent_Cfg[this.curPottedId].unlockstar) {
            //     this.tBtn.disabled = true;
            //     this.condition0.color = "#FF0000";
            // }
            this.condition1.text = Succulent_Cfg[this.curPottedId].givestar
            this.condition2.text = Succulent_Cfg[this.curPottedId].gold
            if (Player.getInstance().nGold < Succulent_Cfg[this.curPottedId].gold) {
                this.condition2.color = "#FF0000";
                this.tBtn.disabled = true;
            }
            this.condition2.visible = true;
            this.title.text = Utils.format("购买{0}花盆", Succulent_Cfg[this.curPottedId].strname || "00");
        }
        this.la_volume.text = Utils.format("容量：{0}", Succulent_Cfg[this.curPottedId].capacity);
        this.img_pot.skin = Succulent_Cfg[this.curPottedId].striconurl;
    }

    private OnSure() {
        EffectManager.getInstance().BtnEffect(this.tBtn);
        if (!Player.getInstance().tPotData[this.curPottedId]) {
            if (Player.getInstance().nStar >= Succulent_Cfg[this.curPottedId].unlockstar &&
                Player.getInstance().nGold >= Succulent_Cfg[this.curPottedId].gold) {
                Player.getInstance().refreshGold(-Succulent_Cfg[this.curPottedId].gold);
                Player.getInstance().refreshStar(+Succulent_Cfg[this.curPottedId].givestar);
                Player.getInstance().refreshPotData(this.curPottedId, true);
            }
        }

        // Laya.stage.event(CommonDefine.EVENT_CHECKED_POTTED, [this.curPottedId])
        this.onClose();
        GameUIManager.getInstance().destroyUI(FlowerpotSelView)
        //GameUIManager.getInstance().showUI(LoadingScenes1);
        // SceneManager.getInstance().openScene(DIYScene.instance, [this._pointName, this._pointIndex, 0], Laya.Handler.create(this, () => {
           
        // }));
        //DIYScene.instance.checkedPooted(this.curPottedId);
        this.callback.run()
    }
}


