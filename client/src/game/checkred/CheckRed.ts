/**
 * @Purpose 红点
 * @Author zhanghj
 */

import { Singleton } from "../../common/Singleton";
import { Time } from "../../common/Time";
import { GacEvent } from "../../common/GacEvent";
import { GEvent } from "../../common/GEvent";
import GameScene from "../scene/GameScene";
import { GatherView } from "../ui/Gather/GatherView";
import { StaffView } from "../ui/Staff/StaffView";
import { GameData } from "../data/GameData";
import { Player } from "../player/Player";
import { Collection_station_Cfg, Staff_Cfg } from "../../manager/ConfigManager";
import { ModelStorage, SaveManager } from "../../manager/SaveManager";
import { Utils } from "../../utils/Utils";

export class CheckRed extends Singleton
{

    private _Time : number = 0;
    public CheckList : Array<any> =
    [
        // 百草屋
        GatherView,
        // 人事部
        StaffView

    ];


    constructor() {
        super();
        GEvent.RegistEvent(GacEvent.OnUpdate,Laya.Handler.create(this,this.OnUpdate))
    }


    public OnUpdate()
    {
        if (this._Time + Time.delta > 1000){
            GameScene.instance.oArrow[0].active=this.CheckGather();
            GameScene.instance.oArrow[1].active=this.CheckStaff();

        }else{
            this._Time += Time.delta;
        }
    }
    

    private CheckStaff(){
        let _value=[];
         //临时初始化数据
         let idunm: number = Utils.GetTableLength(Staff_Cfg);
         let staffunm: number = Staff_Cfg[idunm].staffID;
         for (let i = 1; i <= staffunm; i++) {
             for (let j = 1; j <= idunm; j++) {
                 if (Staff_Cfg[j]["staffID"] == i) {
                    _value.push(j);
                     break;
                 }
             }
         }
         //解锁皮肤的列表
         let value = GameData.RoleInfo;
         if (value) {
            for (let i = 0; i < value.length; i++) {
                //未雇佣
                if(value[i]["id"] == 0){
                    if(Staff_Cfg[_value[i]]["unlockstar"] <= Player.getInstance().nStar
                    && Staff_Cfg[_value[i]]["hiregold"] <= Player.getInstance().nGold){
                        return true;
                    }
                }
                // else{
                //     if(value[i]["updateState"] == 0
                //     && Staff_Cfg[value[i]["id"]]["Upgold"] <= Player.getInstance().nGold){
                //         return true;
                //     }
    
                // }
            }
         }

        return false;
        
    }
    private CheckGather(){
        //解锁皮肤的列表
        let values: any[] = GameData.RoleInfo;
        let lv = SaveManager.getInstance().GetCache(ModelStorage.GatherLV);
        if (lv == null) { lv = 1; }
        if (values &&lv) {
            if (lv < Collection_station_Cfg[lv]["lvup"] 
            && Collection_station_Cfg[lv]["upgold"] <= Player.getInstance().nGold){
                return true;
            }
        }
        return false;
    }
}
