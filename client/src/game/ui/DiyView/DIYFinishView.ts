/**花盆列表 */

import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Player } from "../../player/Player";
import { Utils } from "../../../utils/Utils";
import { Succulent_Cfg, Effect_Cfg } from "../../../manager/ConfigManager";
import { CommonDefine } from "../../../common/CommonDefine";
import { SceneManager } from "../../../manager/SceneManager";
import { DIYScene } from "../../scene/DIYScene";
import { DiyView } from "./DiyView";
import { Potted } from "../../item/Potted";
import { DiyToolView } from "./DiyToolView";
import { EffectManager } from "../../../effect/EffectManager";
import { Avatars } from "../../../effect/Avatars";

export class DIYFinishView extends ui.view.DIYFinishViewUI {

    
    private _ani;

    constructor(data) {
        super()
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.InitEvent();
        this.InitView();
    }

    onDisable() {
    }

    onDestroy() {
        this.makeSureBtn.offAll();
    }

    onClose() {
        GameUIManager.getInstance().destroyUI(DIYFinishView)
    }
    

    private InitEvent() {
       // this.makeSureBtn.on(Laya.Event.CLICK, this, this.Finished);
    }

    private InitView() {
        this.scorePanel.visible = true;
        this.scorePanel.mouseEnabled = true;
        let tPot:Potted = DIYScene.instance.getPotted();

        let id = 3;
        let scale = 1;
        let box = this.eff_bg;
        let eff: Avatars = new Avatars(box);
        let isloop = false;
        let aniName = tPot?tPot.GetQualityName():"";
        eff.Load(Effect_Cfg[id].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
                 eff.Play(aniName, isloop, true,()=>{
                     this.makeSureBtn.visible = true;
                     this.makeSureBtn.on(Laya.Event.CLICK, this, this.Finished);
                 });
             }));
             
        DIYScene.instance.savePoint();
        DIYScene.instance.potted && DIYScene.instance.potted.clearSelect();
        return eff;
    }

    private Finished() {
        this.onClose()
        GameUIManager.getInstance().destroyUI(DiyView);
        GameUIManager.getInstance().destroyUI(DiyToolView);
    }
}