import { ui } from "../../../ui/layaMaxUI";
import { ConfigManager, ManageSucculent_Cfg, Land_Cfg, Succulentpoint_Cfg, Succulent_Cfg } from "../../../manager/ConfigManager";
import { Utils } from "../../../utils/Utils";
import { Debug } from "../../../common/Debug";
import { GameUIManager } from "../../../manager/GameUIManager";
import { unLockDialog } from "../Unlock/unLockDialog";
import { LandManager } from "../../../manager/LandManager";
import { Player } from "../../player/Player";
import { FlowerpotTipsView } from "../Flowerpot/FlowerpotTipsView";
import { BagSystem } from "../../bag/BagSystem";
import { CommonDefine } from "../../../common/CommonDefine";
import { PotManager } from "../../../manager/PotManager";
import { DIYScene } from "../../scene/DIYScene";
import { Potted } from "../../item/Potted";
import { DiyChangePot } from "../DiyView/DiyChangePot";
import { HandBookView } from "./HandBookView";
import { SceneManager } from "../../../manager/SceneManager";

export class PlantView extends ui.view.PlantViewUI
{
    private _unlockedArr:any
    private _defaultLandJosnArr: any;//默认的种植点数组
    private _curselect:number //当前选中的种植点ID
    private _curplantname:string = ""; //当前选中的种植点名称
    private _curpot:Potted //当前种植点花盆
    private _curPotid:number//当前种植点花盆id
    constructor()
    {
        super()
    }
    public OnShow()
    {
        this.InitView()
        //设置默认选中的种植点
        this.ClickPlant(1)
        this.InitEvent()
    }
    private InitView()
    {
        this._unlockedArr = Utils.getJSONFromLocal("landData");
        if (!this._unlockedArr) {
            this._unlockedArr = new Array<number>();
            this._unlockedArr.push("1");
        }
        this._defaultLandJosnArr = ConfigManager.prototype.GetJsonToArray(Land_Cfg);
        //种植点分3类：花盆,多肉,玩具
        let arr=['huapen','duorou','wanju']
        this.contentList.array = arr
        //种植点数量
        this.plantlist.array = ConfigManager.prototype.GetJsonToArray(ManageSucculent_Cfg)
    }
    private InitEvent()
    {
        this.contentList.renderHandler = new Laya.Handler(this,this.SetDuoRouData)
        this.contentList.vScrollBarSkin = ""
        this.plantlist.renderHandler = new Laya.Handler(this,this.SetPlantData)
        this.plantlist.hScrollBarSkin = ""
        this.compliePot.on(Laya.Event.CLICK,this,function()
        {
            console.log("编辑花盆")
            SceneManager.getInstance().openScene(DIYScene.instance, [this._curplantname, 0]);
            GameUIManager.getInstance().hideUI(HandBookView)
        })
    }

    //设置种植点内数据
    private SetDuoRouData(box: Laya.Box, index: number)
    {
        let dec = box.getChildByName("dec")as Laya.Label
        let itemlist = box.getChildByName("itemlist")as Laya.List
        let name = ""
        if(index==0)
        {
            name = "花盆"
            let str = ManageSucculent_Cfg[this._curselect].strflowerpotgroup+""
            let arr = this.GetArr(str)
            itemlist.renderHandler = new Laya.Handler(this,this.ItemFlowerData,[arr,itemlist])
            itemlist.array = arr
            itemlist.hScrollBarSkin=""
        }
        else if(index==1)
        {
            name = "多肉"
            let str = ManageSucculent_Cfg[this._curselect].strsucculentgroup+""
            let arr = this.GetArr(str)
            itemlist.renderHandler = new Laya.Handler(this,this.ItemDuoRouData,[arr,itemlist,0])
            itemlist.array = arr
            itemlist.hScrollBarSkin=""
        }
        else{
            name = "玩具"
            let str = ManageSucculent_Cfg[this._curselect].strtoygroup+""
            let arr = this.GetArr(str)
            itemlist.renderHandler = new Laya.Handler(this,this.ItemDuoRouData,[arr,itemlist,1])
            itemlist.array = arr
            itemlist.hScrollBarSkin=""
        }
        dec.text = "种植点"+(index+1)+name
    }
    //花盆数据
    private ItemFlowerData(arr: any, list: any, box: Laya.Box, index: number)
    {
        let itemicon = box.getChildByName("itemicon")as Laya.Image
        let itemname = box.getChildByName("itemname")as Laya.Label
        let pricebg = box.getChildByName("pricebg")as Laya.Image
        let starbg = box.getChildByName("starbg")as Laya.Image
        let itemprice = box.getChildByName("itemprice")as Laya.Label
        pricebg.visible = false
        starbg.visible = false
        itemprice.visible = false
        box.offAll()
        let arr1 = Player.getInstance().tPotData
        if (!(Player.getInstance().tPotData[arr[index]])) 
        {   
            //已解锁
            if (this.GetPotIsCanUnLock(arr[index])) 
            {
                //可解锁
                starbg.visible = true
                itemprice.visible = true
                pricebg.visible = true
                box.on(Laya.Event.CLICK, this, this.ClickDuoRouItem, [arr[index],list]);
            } 
            else 
            {
                //未解锁，不满足解锁条件
                starbg.visible = true
                itemprice.visible = true
                
            }
        }
        let data = Succulent_Cfg[arr[index]]
        itemicon.skin = data["striconurl"]
        itemname.text = data["strname"]
        itemprice.text = data.gold
    }
    //多肉shuju
    private ItemDuoRouData(arr: any, list: any, type:number,box: Laya.Box, index: number)
    {
        let itemicon = box.getChildByName("itemicon")as Laya.Image
        let itemname = box.getChildByName("itemname")as Laya.Label
        let pricebg = box.getChildByName("pricebg")as Laya.Image
        let starbg = box.getChildByName("starbg")as Laya.Image
        let itemprice = box.getChildByName("itemprice")as Laya.Label
        pricebg.visible = true
        starbg.visible = true
        itemprice.visible = true
        let allduorou
        if(type == 0)
        {
            allduorou =  BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_DUOROU);
        }
        else if(type == 1)
        {
            allduorou =  BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_ZHUANGSHI);
        }
        box.on(Laya.Event.CLICK, this, this.ClickDuoRouItem, [arr[index],list]);
        for(let i in allduorou)
        {
            if(allduorou[i].itemId==arr[index])
            {
                //解锁
                box.offAll()
                starbg.visible = false
                itemprice.visible = false
                pricebg.visible = false
            }
        }
        let data = Succulent_Cfg[arr[index]]
        itemicon.skin = data["striconurl"]
        itemname.text = data["strname"]
        itemprice.text = data.gold
    }
    //多肉item点击解锁
    private ClickDuoRouItem(potId:number,list:any)
    {
        GameUIManager.getInstance().createUI(FlowerpotTipsView, [this._curplantname, 0, potId, Laya.Handler.create(this,()=>{
            //刷新列表
            list.refresh()
        })]);
    }

    //#region 种植点模块
    private SetPlantData(box: Laya.Box, index: number)
    {
        let name = box.getChildByName("name")as Laya.Label
        let lock = box.getChildByName("lock")as Laya.Image
        name.text = "种植点"+(index+1)
        lock.visible = true
        for(let i in this._unlockedArr)
        {
            if(index+1 == this._unlockedArr[i])
            {
                lock.visible = false
            }
        }
        box.on(Laya.Event.CLICK, this, this.ClickPlant, [index+1]);
    }
    private ClickPlant(index: number) 
    {
         let plantpointid = ManageSucculent_Cfg[index].plantpointid
         let strname = Land_Cfg[plantpointid].strname
         this._curselect = index
         this._curplantname = strname
         this.GetPotData(strname)
    }
    //#endregion


    /** 是否满足解锁条件 */
    private GetPotIsCanUnLock(potId) {
        if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
            return false
        }
        return true;
    }
    GetArr(str:any)
    {
        let first = str.indexOf("{")
        let end = str.indexOf("}")
        var alldata = str.substring(first+1,end)
        let arr = alldata.split(",")
        return arr
    }
    GetPotData(name:string)
    {
        let arr = PotManager.getInstance().PotMap

        if(PotManager.getInstance().PotMap[name]!=null)
        {
            //已有花盆
            this.plantvalue.visible = true
            //this._curpot = DIYScene.instance.getPotted()
            //this._curPotid = PotManager.getInstance().PotMap[name].PointDataList[0].containerId
            let arr1 = PotManager.getInstance().PotMap[name].PotList
            let arr2 = PotManager.getInstance().PotMap[name].PointDataList
        }
        else
        {
           //没有花盆
           this.plantvalue.visible = false
        }
    }

    public HideUI()
    {
        
    }
}