/**花盆列表 */

import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Share_Cfg, Succulentpoint_Cfg, Succulent_Cfg, Constant_Cfg } from "../../../manager/ConfigManager";
import { Player } from "../../player/Player";
import { PotManager } from "../../../manager/PotManager";
import { Potted } from "../../item/Potted";
import { PotState, GamePoint } from "../../GameDefine";
import { Time } from "../../../common/Time";
import { Utils } from "../../../utils/Utils";
import GameScene from "../../scene/GameScene";
import { Global } from "../../../utils/Global";
import { Point } from "../../item/Point";
import { SceneManager } from "../../../manager/SceneManager";
import { DIYScene } from "../../scene/DIYScene";
import { DrawModel } from "../DrawModel";
import { CommonDefine } from "../../../common/CommonDefine";
import { FlowerpotSelView } from "../Flowerpot/FlowerpotSelView";
import { LoadingScenes1 } from "../LoadingScenes1";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { MyPlayer } from "../../MyPlayer";
import { DataLog } from "../../../common/DataLog";
import { EffectManager } from "../../../effect/EffectManager";

export class PointFlowerStateView extends ui.view.Flowerpot.FlowerpotStateViewUI {
    /** 当前使用花盆索引 */
    private curPottedId: number = 0;
    /** 点位名称 */
    private _pointName: string = "";
    /** 花盆列表 */
    private _potData = [];

    private flowerModel: DrawModel;            	// 模型

    private _tCurPot: Potted;

    private timeItme;
    private timeItmepro;

    constructor(pointName) {
        super()
        this._pointName = pointName[0]

    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.InitEvent()
        this.InitView();
        Global.sceneLock = true
    }

    onDisable() {
        Laya.timer.clearAll(this);
    }

    onDestroy() {
        this.cBtn.offAll()
        GEvent.RemoveEvent(GacEvent.OnPlantRipe, Laya.Handler.create(this, this.UpdatePotList));
        Global.sceneLock = false
    }

    onClose() {
        GameUIManager.getInstance().destroyUI(PointFlowerStateView)
    }

    private InitEvent() {
        this.cBtn.on(Laya.Event.CLICK, this, this.onClose);
        //this.growBtn.on(Laya.Event.CLICK, this, this.OnGotoGrowView);
        this.speedUpGrowBtn.on(Laya.Event.CLICK, this, this.OnSpeedUp);
        this.editBtn.on(Laya.Event.CLICK, this, this.OnGotoEditPot);
        // this.rightBtn.on(Laya.Event.CLICK, this, this.OnClickRight);
        // Laya.stage.on(CommonDefine.EVENT_POT_INIT_FINISH, this, this.UpdatePotList)
        Laya.timer.loop(1000, this, this.UpdateTime);
        GEvent.RegistEvent(GacEvent.OnPlantRipe, Laya.Handler.create(this, this.UpdatePotList));
    }

    private InitView() {
        this.SetPotList();

    }

    private UpdatePotData() {
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
        this._potData = _arr;
        function SortFun(tLeft, tRight): number {
            let nleftLock = Player.getInstance().tPotData[tLeft.id] ? 1 : 0;
            let nRightLock = Player.getInstance().tPotData[tRight.id] ? 1 : 0;
            if (nleftLock != nRightLock)
                return nleftLock > nRightLock ? -1 : 1;

            let nleftcan = (Player.getInstance().nStar >= Succulent_Cfg[tLeft.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tLeft.id].gold) ? 1 : 0;
            let nRightcan = (Player.getInstance().nStar >= Succulent_Cfg[tRight.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tRight.id].gold) ? 1 : 0;

            if (nleftcan != nRightcan)
                return nleftcan > nRightcan ? -1 : 1;
            return tLeft.id < tRight.id ? -1 : 1;
        }
        this._potData.sort(SortFun);

    }


    private UpdatePotList() {
        this.UpdatePotData();
        this.timeItme = null;
        let tPot = this.GetPotted(this.curPottedId);
        this.UpdateBtn(tPot ? tPot.State : null, this.curPottedId);
    }

    private UpdateTime() {
        let tPot: Potted = this.GetPotted(this.curPottedId);
        if (tPot && this.timeItme && tPot.State == PotState.Grow) {
            let nPro = (Time.Seconds - tPot.GrowStartTime) / tPot.GrowTime;
            this.timeItmepro.value = nPro;
            let time = Utils.formatStandardTime(tPot.GrowTime - (Time.Seconds - tPot.GrowStartTime), false);
            this.timeItme.text = Utils.format("正在成长 {0}", time);
        }
    }

    private SetPotList() {
        this.timeItme = null;
        this.UpdatePotData();
        let tPot = this.GetPotted(this.curPottedId);
        this.UpdateBtn(tPot ? tPot.State : null, this.curPottedId);
    }

    private OnUpdateFlowerModel(ui, index) {
        if (this.flowerModel) {
            this.flowerModel.Destroy();
            this.flowerModel = null;
        }
        if (!PotManager.getInstance().PotMap[this._pointName] || !PotManager.getInstance().PotMap[this._pointName].PotList
            || !PotManager.getInstance().PotMap[this._pointName].PotList[index]) {
            this.flowerModel = new DrawModel();
            this.flowerModel.bEmptyPot = true;
            this.flowerModel.position = new Laya.Vector3(0, -0.3, -1.7)
            this.flowerModel.scale = 1;
            this.flowerModel.Start(ui);
            return
        }

        let tPoint = PotManager.getInstance().PotMap[this._pointName].PotList[index];
        if (tPoint && tPoint.State == PotState.Grow) {
            this.flowerModel = new DrawModel();
            this.flowerModel.bEmptyBox = true;
            this.flowerModel.position = new Laya.Vector3(0, -1.8, -5)
            this.flowerModel.scale = 1;
            this.flowerModel.Start(ui);
            return
        }
        this.flowerModel = new DrawModel();
        this.flowerModel.flowerData = PotManager.getInstance().PotMap[this._pointName];
        this.flowerModel.flowerPotStruct = PotManager.getInstance().PotMap[this._pointName].PointDataList[index];
        this.flowerModel.bFlower = true;
        let pos = PotManager.getInstance().scaleInfo[Succulentpoint_Cfg[this._pointName].type];
        this.flowerModel.position = new Laya.Vector3(0, -pos[0], -pos[1])
        this.flowerModel.scale = 1.1;
        this.flowerModel.Start(ui);
    }

    private GetPotted(index) {
        if (index < 0)
            return;
        let point: Point = PotManager.getInstance().PotMap[this._pointName];
        if (!point)
            return;
        if (point.PotList[index])
            return point.PotList[index]
        return;
    }

    private UpdateBtn(state: PotState, index) {
        let tPot: Potted = this.GetPotted(index);
        this.speedUpGrowBtn.visible = false;
        this.img_ripepot.visible = false;
        this.diystate.visible = false
        this.state_grow.visible = false
        this.state_ripe.visible = false
        this.SetDuoRouData(state)
        this.SetDiyEvaData(tPot)
        if (!state) {
            // if (!this._tCurPot || this._tCurPot.State != PotState.Grow)
            // this.img_ripepot.visible = true;
            // this.OnUpdateFlowerModel(this.img_ripepot, index);
            console.error("花盆是空？？？？？？？？")
            return
        } else if (state == PotState.Grow) {
            this.diystate.visible = true
            this.state_grow.visible = true
            this.speedUpGrowBtn.visible = true;
            this.img_ripepot.visible = true;
            this.OnUpdateFlowerModel(this.img_ripepot, index);
            this.editBtn.disabled = true
        } else if (state == PotState.Ripe) {
            this.diystate.visible = true
            this.state_ripe.visible = true
            this.editBtn.disabled = false
            this.img_ripepot.visible = true;
            this.OnUpdateFlowerModel(this.img_ripepot, index);
        }
    }

    /**  */
    private OnGotoGrowView() {
        // GameUIManager.getInstance().createUI(FlowerpotSelView, [this._pointName, this.curPottedId]);
        // this.onClose();
    }


    /**  */
    private OnSpeedUp() {
        //是否在微信中
        if (Laya.Browser.onWeiXin) {
            let _that = this;
            //分享
            MyPlayer.wxSDK.Share(Share_Cfg[1]["strtitle"], { title: Share_Cfg[1]["strdescribe"], imageUrl: Share_Cfg[1]["strpic"], query: "" }, {
                successFn: function () {
                    let tPot: Potted = _that.GetPotted(_that.curPottedId);
                    if (tPot && tPot.State == PotState.Grow) {
                        PotManager.getInstance().OnSpeedUp(_that._pointName, _that.curPottedId)
                    }
                    // _that.UpdatePotList();
                },
                failFn() {
                }
            });
        }
        else {
            let tPot: Potted = this.GetPotted(this.curPottedId);
            if (tPot && tPot.State == PotState.Grow) {
                PotManager.getInstance().OnSpeedUp(this._pointName, this.curPottedId)
            }
            this.UpdatePotList();
        }

        //打点 2020年10月10日16:34:45
        DataLog.getInstance().LogVideo_log(GamePoint.Ripe)
        this.onClose()
    }


    /** 替换花盆 */
    private OnReplacePot() {
        PotManager.getInstance().ReplaceCurUse(this._pointName, this.curPottedId);
        this.onClose();
    }

    /**  */
    private OnGotoEditPot() {
        EffectManager.getInstance().BtnEffect(this.editBtn);
        let tPot: Potted = this.GetPotted(this.curPottedId);
        this.onClose();
        GameUIManager.getInstance().showUI(LoadingScenes1);
        SceneManager.getInstance().openScene(DIYScene.instance, [this._pointName, this.curPottedId, 1], Laya.Handler.create(this, () => {
            // DIYScene.instance.checkedPooted( this.curPottedId);
        }));
    }

    /** 多肉成长状态 */
    private SetDuoRouData(sState: PotState | null)
    {
        if(sState == null)
            return
        let tPot = this.GetPotted(0)
        if(tPot == null)
            return
        if(sState == PotState.Grow)
        {
            let pro_grow = this.state_grow.getChildByName("pro_grow") as Laya.ProgressBar;
            let la_growtime = this.state_grow.getChildByName("la_growtime") as Laya.Label
            let nPro = (Time.Seconds - tPot.GrowStartTime) / tPot.GrowTime;
            pro_grow.value = nPro;
            let time = Utils.formatStandardTime(tPot.GrowTime - (Time.Seconds - tPot.GrowStartTime), false);
            la_growtime.text = Utils.format("正在成长 {0}", time);
            this.timeItme = la_growtime;
            this.timeItmepro = pro_grow;
        }
        else if( sState == PotState.Ripe)
        {
            let potnum = this.state_ripe.getChildByName("potnum")as Laya.Label
            let pottips = this.state_ripe.getChildByName("pottips")as Laya.Image
            let num = tPot._treeList.length
            potnum.text = num + ""

            //判断花盆是否有可解锁的
            pottips.visible = this.ISHaveLock()
        }
    }
    private ISHaveLock():boolean
    {
        function func(potId:any)
        {
            /** 是否满足解锁条件 */
            if (Player.getInstance().nStar < Succulent_Cfg[potId].unlockstar) {
                return false;
            }
            if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
                return false
            }
            return true;
        }
        for(let i in this._potData)
        {
            if (!(Player.getInstance().tPotData[this._potData[i].id])) 
            {   
                if(func(this._potData[i].id))
                {
                    return true
                } 
            }
        }
        return false
    }
    /** 多肉评分等数据 */
    private SetDiyEvaData(Pot:Potted)
    {
        this.moneynum.text = Pot.giveReward()+""  
        this.photonum.text = Pot.takePhoto_outputGold()+""

        let tScore = this.DiyEva.getChildByName("img_score") as Laya.Image;
        tScore.skin = Pot.GetQualityImg();
        let bg = this.DiyEva.getChildByName("bg") as Laya.Image;
        //判断评分的 第二阶段和第三阶段
        let data = Pot.GetNextTwoNode()
        this.second.skin = "gameui/flowerstate/potquality" +data[0]+".png"
        this.trird.skin = "gameui/flowerstate/potquality" +data[1]+".png"

        let va = Pot.quality/Constant_Cfg[9].value[data[1]]
        this.diyeva.value = va/2+0.5
        bg.x = 55 + this.diyeva.value*360
    }
}


