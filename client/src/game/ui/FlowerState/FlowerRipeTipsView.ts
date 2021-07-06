/**花盆列表 */

import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Player } from "../../player/Player";
import { Utils } from "../../../utils/Utils";
import { Succulent_Cfg, Succulentpoint_Cfg } from "../../../manager/ConfigManager";
import { CommonDefine } from "../../../common/CommonDefine";
import { SceneManager } from "../../../manager/SceneManager";
import { DIYScene } from "../../scene/DIYScene";
import { DiyView } from "../DiyView/DiyView";
import { Point } from "../../item/Point";
import { PotManager } from "../../../manager/PotManager";
import { Potted } from "../../item/Potted";
import { DrawModel } from "../DrawModel";
import { Effect3D } from "../../../effect/Effect3D";
import { EffectManager } from "../../../effect/EffectManager";

export class FlowerRipeTipsView extends ui.view.Flowerpot.FlowerRipeTipsViewUI {

    private _pointName: string = "";
    private _pointIndex: number = 0;
    private flowerModel: DrawModel;            	// 模型

    constructor() {
        super()
        let data = PotManager.getInstance().PotRipeList.shift();
        if(!data){
            this.onClose()
        }
        this._pointName = data[0];
        this._pointIndex = data[1]
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
        GameUIManager.getInstance().destroyUI(FlowerRipeTipsView)
    }

    private InitEvent() {
        this.tBtn.on(Laya.Event.CLICK, this, this.OnSure);
    }

    private InitView() {
        let tPoint:Point = PotManager.getInstance().PotMap[this._pointName];
        let tPot:Potted = tPoint.PotList[this._pointIndex];
        if(tPot){
            this.icon0.skin = tPot.GetQualityImg();
            this.condition1.text = String(tPot.quality);
            this.OnUpdateFlowerModel(this.img_pot);
        }
    }

    private OnUpdateFlowerModel(ui) {
        if (this.flowerModel) {
            this.flowerModel.Destroy();
            this.flowerModel = null;
        }
        this.flowerModel = new DrawModel();
        this.flowerModel.flowerData = PotManager.getInstance().PotMap[this._pointName];
        this.flowerModel.flowerPotStruct = PotManager.getInstance().PotMap[this._pointName].PointDataList[this._pointIndex];
        this.flowerModel.bFlower = true;
        let pos = PotManager.getInstance().scaleInfo[Succulentpoint_Cfg[this._pointName].type];
        this.flowerModel.position = new Laya.Vector3(0, -pos[0], -pos[1])
        this.flowerModel.Start(ui);
    }

    private OnSure() {
        EffectManager.getInstance().BtnEffect(this.tBtn);
        PotManager.getInstance().PotRipeList.shift();
        this.onClose();
        if(PotManager.getInstance().PotRipeList.length > 0)
            GameUIManager.getInstance().showUI(FlowerRipeTipsView);
    }
}


