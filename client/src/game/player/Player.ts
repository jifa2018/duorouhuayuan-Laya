/**
 * 玩家
 */

import { Utils } from "../../utils/Utils";
import { LocalStorage } from "../GameDefine";
import { Singleton } from "../../common/Singleton";
import { CommonDefine } from "../../common/CommonDefine";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
import { GameLink } from "../Login/GameLink";
import {Constant_Cfg} from "../../manager/ConfigManager";

export class Player extends Singleton {
    public nGold: number = 100;
    public nStar: number = 10;
    public nAttraction: number;
    private sName: string = "";
    /** 花盆解锁情况 */
    public tPotData: { [flowerpotId: number]: boolean } = {};

    constructor() {
        super();
        this.initData();
    }

    initData() {
        let _data = SaveManager.getInstance().GetCache(ModelStorage.Player);
        if (!_data) {
            //TODO取得默认数据
            _data = {};
            _data["star"] = this.nStar ? this.nStar : 10//Constant_Cfg[15].value;
            _data["gold"] = this.nGold ? this.nGold : 100//Constant_Cfg[16].value;
        }
        else
        {
            this.nStar = _data.star;
            this.nGold = _data.gold;
        }
        this.nAttraction = _data.attraction;
        this.tPotData = _data.potData || {};
        this.refreshStorage();
        
    }

    /**
     * 更新玩家数据
     */
    refreshStorage() {

        let _data = {};
        _data["star"] = this.nStar;
        _data["gold"] = this.nGold;
        _data["name"] = this.sName;
        _data["potData"] = this.tPotData;
        SaveManager.getInstance().SetPlayerCache(_data);
        Laya.stage.event(CommonDefine.EVENT_MAIN_REFRESH);

    }
    /**
     * +/-评星
     */
    public refreshStar(v: number) {
        this.nStar += v;
        console.log(this.nStar);
        this.refreshStorage();
    }
    /**
     * +/-金币
     */
    public refreshGold(v: number) {
        this.nGold += v;
        console.log(this.nGold);
        this.refreshStorage();
    }

    public canPayGold(value: number): boolean {
        return this.nGold - value >= 0;
    }

    /**
     * +/-花盆数据
     */
    refreshPotData(v: number, flag: boolean) {
        this.tPotData[v] = flag;
        this.refreshStorage();
    }

    /**设置名字 */
    setName(name: string) {
        this.sName = name;
    }


}