import Vector3 = Laya.Vector3;
import Vector2 = Laya.Vector2;
import { Utils } from "../utils/Utils";
import {Singleton} from "../common/Singleton";
import { GEvent } from "../common/GEvent";
import { GacEvent } from "../common/GacEvent";
import GameScene from "../game/scene/GameScene";
import { SceneItem } from "../game/item/SceneItem";
import { SceneItemCreater } from "../game/item/SceneItemCreater";
import { SoundManager } from "./SoundManager";
import { Sound_Cfg, Staff_Cfg, Constant_Cfg } from "./ConfigManager";
import { BubbleCreater } from "../game/ui/Bubble/BubbleCreater";
import { Bubble } from "../game/ui/Bubble/Bubble";
import { Dictionary } from "../utils/Dictionary";
import { Propagandist } from "../game/Staff/Propagandist";
import { Dustman } from "../game/Staff/Dustman";
import { Cameraman } from "../game/Staff/Cameraman";
import { IManager } from "./IManager";
import { GameData } from "../game/data/GameData";
import { Player } from "../game/player/Player";
import { SaveManager, ModelStorage } from "./SaveManager";

export enum StaffType{
    Propagandist = 2,
    Dustman = 3,
    Cameraman = 4,
}

export class StaffManager extends Singleton implements IManager
{
    public StaffArray:Array<any> = new Array<any>();
    public StaffDic:Dictionary = new Dictionary();
    public _ispropagandist:Boolean = false;
    public _isdustman:Boolean = false;
    public _iscameraman:Boolean = false;

    
    onInit (): void
    {
        if (SaveManager.getInstance().GetCache(ModelStorage.ConnNum)==1) 
            this.Addpropagandist(1,0);
    }

    onUpdata (): void
    {
        if (this.StaffDic.Count() != 0) {
            this.StaffDic.forEach(element => {
                element.onUpdate();
            });
        } 
    }

    onDestroy (): void{}

    /**
     * 升级
     * @param beforeId 升级前Id   表ID
     * @param laterId 升级后Id
     */
    public upgrade(beforeId:number,laterId:number):void
    {
        this.StaffDic.forEach(element => {
            if (element.GetId() == beforeId) {
                element.upgrade(laterId);
                GameData.upgrade(beforeId,laterId);
            }
        });
    }

    public GetTakePhotoTimer()
    {
        return this.StaffDic.get(StaffType.Cameraman).GetTakePhotoTime();
    }

    public GetPickMoneyTimer()
    {
        return this.StaffDic.get(StaffType.Dustman).GetPickMoneyTime();
    }

    public SetCollectTime(staffID:number,time:number):void
    {
        this.StaffDic.get(staffID).SetCollectTime(time);
    }

    public GetCollectTime(staffID:number): number {
        return   this.StaffDic.get(staffID).GetCollectTime();
    }

    public GetRestTime(staffID:number): number {
        return   this.StaffDic.get(staffID).GetRestTime();
    }


    //#region  招募
    // 招募一个宣传员
    public Addpropagandist(id:number,dataIndex):Propagandist
    {
        if (this.StaffDic.get(StaffType.Propagandist) != null || this.StaffDic.get(StaffType.Propagandist) != undefined) {
            if(Constant_Cfg[14].value == 0)
                GEvent.DispatchEvent(GacEvent.OnShowUI_propagandist); 
            return this.StaffDic.get(StaffType.Propagandist);
        }
        let npc:Propagandist = new Propagandist();
        this.InitStaffID(id,dataIndex); 
        npc.onLoad(id);
        this.StaffDic.set(StaffType.Propagandist,npc);
        npc.transform.position = GameScene.instance.scene3d.getChildByName("staffpoint").getChildByName("xuanchuan").transform.position;
        GameScene.instance.scene3d.addChild(npc);
        if(Constant_Cfg[14].value == 0)
            GEvent.DispatchEvent(GacEvent.OnShowUI_propagandist); 
        return npc;
    }

    // 招募一个清洁工
    public AddDustman(id:number,dataIndex):Dustman
    {
        if (this.StaffDic.get(StaffType.Dustman) != null || this.StaffDic.get(StaffType.Dustman) != undefined) {
            GEvent.DispatchEvent(GacEvent.OnShowUI_dustman);  
            return this.StaffDic.get(StaffType.Dustman);
        }
        let npc:Dustman = new Dustman();
        this.InitStaffID(id,dataIndex); 
        npc.onLoad(id);
        this.StaffDic.set(StaffType.Dustman,npc);
        npc.transform.position = GameScene.instance.scene3d.getChildByName("staffpoint").getChildByName("qingjie").transform.position;
        GameScene.instance.scene3d.addChild(npc);
        GEvent.DispatchEvent(GacEvent.OnShowUI_dustman);     
        return npc;
    }

    // 招募一个摄影师
    public AddCameraman(id:number,dataIndex):Cameraman
    {
        if (this.StaffDic.get(StaffType.Cameraman) != null || this.StaffDic.get(StaffType.Cameraman) != undefined) {
            GEvent.DispatchEvent(GacEvent.OnShowUI_cameraman);  
            return this.StaffDic.get(StaffType.Cameraman);
        }
        let npc:Cameraman = new Cameraman();
        this.InitStaffID(id,dataIndex);  
        npc.onLoad(id);
        this.StaffDic.set(StaffType.Cameraman,npc);
        npc.transform.position = GameScene.instance.scene3d.getChildByName("staffpoint").getChildByName("zhaoxiang").transform.position;
        GameScene.instance.scene3d.addChild(npc);
        GEvent.DispatchEvent(GacEvent.OnShowUI_cameraman);   
        return npc; 
    }

    private InitStaffID(id:number,dataIndex:number)
    {
       GameData.InitStaffID(id,dataIndex);
    }
    //#endregion

    //#region  干了什么事
    public LoadRangeNpc():void
    {
        if(this.StaffDic.get(StaffType.Propagandist))
        {
            this.StaffDic.get(StaffType.Propagandist).LoadRangeNpc();
        }
    }

    public LoadRangetenNpc():void
    {
        if (this.StaffDic.get(StaffType.Propagandist)) 
        {
            this.StaffDic.get(StaffType.Propagandist).LoadRangetenNpc();
        }
    }

    public StartPickMoney():void
    {
        this._SubMoney();
        Laya.timer.loop(2000,this,this._SubMoney);
    }

    public StopPickMoney():void
    {
        Laya.timer.clear(this,this._SubMoney);
    }

    public StartTakePhoto():void
    {
        this.AutoTakePhoto();
        Laya.timer.loop(2000,this,this.AutoTakePhoto);

    }

    public StopTakePhoto():void
    {
        Laya.timer.clear(this,this.AutoTakePhoto);
    } 
    //#endregion  
    
    private _SubMoney():void
    {
        var nearItem:SceneItem = SceneItemCreater.getInstance().getNearItem(new Vector3(0,0,0), 1000);
        if(!nearItem)    return;
         
        SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);//"金币碰撞的音效" 
        var v2:Vector2 = Utils.worldToScreen(GameScene.instance.camera, nearItem.pos);
        //TODO 加图标
        Utils.createNumberText(nearItem.addGold.toString(),v2.x,v2.y,"+",false,"#ffea00");
        nearItem.onClick();
        if (nearItem.tableId ==1) {
            Player.getInstance().refreshGold(nearItem.addGold);
        }else if (nearItem.tableId ==2) {
            Player.getInstance().refreshStar(nearItem.addGold);
        }
        
    }

    private AutoTakePhoto():void
    {
        let b:Bubble = BubbleCreater.instance.GetTypewithNormal();
        if (b!=null) {
            b.changeImage("res/icon/sysicon.png");
            b.RotationIcon();
            Laya.timer.once(1000,this,()=>{
                b.onClick(null);
            });
        }  
    }
    
}

  /**
     * 开始升级
     * @param tableID 表ID
     */
    // public ChangUpGrade(tableID:number):void
    // {
    //     this.StaffDic.forEach(element => {
    //         if (element.GetId() == tableID) {
    //             GameData.ChangUpGrade(tableID);
    //             this.StaffDic.get(Staff_Cfg[tableID].staffID).ChangUpGrade();
    //         }
    //     });
    // }