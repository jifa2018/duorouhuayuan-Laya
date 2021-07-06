import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Utils } from "../../../utils/Utils";
import { Player } from "../../player/Player";
import { Succulent_Cfg, Succulentpoint_Cfg } from "../../../manager/ConfigManager";
import { FlowerpotTipsView } from "../Flowerpot/FlowerpotTipsView";
import { DIYScene } from "../../scene/DIYScene";
import { DiyView } from "./DiyView";
import { PotManager } from "../../../manager/PotManager";
import { Potted } from "../../item/Potted";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";

export class DiyChangePot extends ui.view.DiyChangePotUI
{
    private _potData = [];
    private curPottedId: number;
    private _pointName: string = "";
    private _pointIndex: number = 0;
    private curPotid:number = -1
    private curpot:Potted
    constructor(pointName) {
        super()
        this._pointName = pointName[0]
        this._pointIndex = pointName[1];

    }
    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.InitEvent();
        this.SetPotList();
        DIYScene.instance.OpenDrag = false
        if(PotManager.getInstance().PotMap[this._pointName]!=null)
        {
            //已有花盆
            this.curpot = DIYScene.instance.getPotted()
            this.curPotid = PotManager.getInstance().PotMap[this._pointName].PointDataList[0].containerId
            this.SetPotData(this.curPotid,0,false)
            //隐藏多肉
            this.curpot.HideTree(false)
        }
        else
        {
            this.SetPotData(this.curPotid,0,false,true)
        }
    }

    onDisable() {
    }

    onClose() {
        GameUIManager.getInstance().destroyUI(DiyChangePot)
    }

    private InitEvent() {
        this.btn_click.on(Laya.Event.CLICK,this,this.OpenDiyView)
    }
    private OpenDiyView()
    {
        if(this.curPotid != -1)
        {
            this.curpot.HideTree(true)
            DIYScene.instance.OpenDrag = true
            GameUIManager.getInstance().showUI(DiyView);
            GameUIManager.getInstance().destroyUI(DiyChangePot)
            GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 1)
        }
    }
    private SetPotList() {
        this.UpdatePotData();
        this.potList.array = this._potData;
        this.potList.renderHandler = new Laya.Handler(this, this.renderHandler);
        this.potList.vScrollBarSkin = "";
    }
    private renderHandler(item, index) {
        let tPot = item.getChildByName("img_pot") as Laya.Image;
        let tVolume = item.getChildByName("la_volume") as Laya.Label;
        let tLockCon = item.getChildByName("la_lockcon") as Laya.Image;
        let tunLockCon = item.getChildByName("la_unlockcon") as Laya.Image;
        let tBg = item.getChildByName("img_bg") as Laya.Image;
        tPot.skin = this._potData[index].striconurl;
        tVolume.text = Utils.format("容量:{0}", this._potData[index].capacity || 0);
        tLockCon.visible = false;
        tunLockCon.visible = false;
        tPot.disabled = false;
        tBg.visible = index % 4 == 0;
        if (!(Player.getInstance().tPotData[this._potData[index].id])) 
        {   
            //已解锁
            if (this.GetPotIsCanUnLock(this._potData[index].id)) 
            {
                //是否满足解锁条件
                tLockCon.visible = true;
            } else {
                //未解锁，不满足解锁条件
                tPot.disabled = true;
                tunLockCon.visible = true;
            }
        }
        item.on(Laya.Event.CLICK, this, this.OnClickPot, [index]);
    }
    //获取花盆数据
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
        /**
     * 
     * @param curid 之前的花盆ID
     * @param potId 现在的花盆ID
     * @param isclick 是否是选择
     */
    private SetPotData(curid:number, potId:number,isclick = false,ispot = false)
    {

        let curpotnum = this.state_ripe.getChildByName("curpotnum")as Laya.Label
        let potnum = this.state_ripe.getChildByName("potnum")as Laya.Label
        curpotnum.visible = true
        let jiantou = this.state_ripe.getChildByName("jiantou")as Laya.Label
        if(ispot)
        {
            curpotnum.visible = false
            jiantou.visible = false
            potnum.visible = false
            return
        }
        jiantou.visible = isclick
        potnum.visible = isclick
        if(isclick)
        {
            potnum.text = Succulent_Cfg[potId].capacity
        }
        //设置花盆容量
        if(curid != -1)
        {
            curpotnum.text = Succulent_Cfg[curid].capacity
        }

    }
    /** 是否满足解锁条件 */
    private GetPotIsCanUnLock(potId) {
        if (Player.getInstance().nStar < Succulent_Cfg[potId].unlockstar) {
            return false;
        }
        if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
            return false
        }
        return true;
    }
    private OnClickPot(index) {
        let potId = this._potData[index].id;

        if (!(Player.getInstance().tPotData[this._potData[index].id])) 
        {   
            //已解锁
            if (this.GetPotIsCanUnLock(this._potData[index].id)) 
            {
                //是否满足解锁条件
                //this.ClickOk(potId)
                return
            } else {
                //未解锁，不满足解锁条件
                //this.ClickOk(potId)
                return
            }
        }
        DIYScene.instance.checkedPooted(potId);
        this.curPotid = potId
        this.curpot =  DIYScene.instance.getPotted()
        this.SetPotData(this.curPotid,potId,true)
       
    }
    private ClickOk(potId)
    {
        //打开二级确认框
        // GameUIManager.getInstance().createUI(FlowerpotTipsView, [this._pointName, this._pointIndex, potId, Laya.Handler.create(this,()=>{
        //     if(this.curPotid==-1)
        //     {
        //         this.SetPotData(potId,this.curPotid,false)
                
        //     }
        //     else
        //     {
        //         this.SetPotData(this.curPotid,potId,true)
        //     }
        //     this.curPotid = potId
        //     this.curpot =  DIYScene.instance.getPotted()
        //     this.potList.refresh()
        // })]);
    }
}