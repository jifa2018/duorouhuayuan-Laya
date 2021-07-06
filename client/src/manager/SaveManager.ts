import { Singleton } from "../common/Singleton";
import { RemoteCall } from "../game/net/RemoteCall";
import { GEvent } from "../common/GEvent";
import { GacEvent } from "../common/GacEvent";
import { MyPlayer } from "../game/MyPlayer";
import { HttpService } from "../game/http/HttpService";
import { GameLink } from "../game/Login/GameLink";
import { Utils } from "../utils/Utils";
import {GameUIManager} from "./GameUIManager";
import {LoadingScenes1} from "../game/ui/LoadingScenes1";

/** 模块存储枚举 */
export enum ModelStorage {
    /** 玩家数据 */
    Player = "player",
    /** 员工数据 */
    Staff = "Staff",
    GatherLV = "GatherLV",
    Point = "point",
    Tree = "tree",
    Bottom = "bottom",
    bagsystem = "bagsystem",
    plant = "plant",
    mapData = "mapData",
    /**登陆次数 */
    ConnNum = "ConnNum",
    GuideID = "GuideId",
    FreeGuideID = "FreeGuideID",
    openid = "openid",
    /**计时礼物 */
    SgoodsTime = "SgoodsTime",
    NPC = "npc",
    /** 主界面宣传按钮是否显示 */
    Publicity = "Publicity",
    /** 前10个Npc */
    AgeNpcCount = "AgeNpcCount",
    /** 种值点信息 */
    point_defaulsucculent1 = "point_defaulsucculent1",
    point_defaulsucculent2 = "point_defaulsucculent2",
    point_defaulsucculent3 = "point_defaulsucculent3",
    point_defaulsucculent4 = "point_defaulsucculent4",
    point_defaulsucculent5 = "point_defaulsucculent5",
    point_defaulsucculent6 = "point_defaulsucculent6",
}

/** 管理器 */
export class SaveManager extends Singleton {
    /** 游戏数据 */
    private ModelData = {};
    /** 数据脏位 */
    private _dirtyData = {};
    /** 是否登录 */
    private _isLogin = false;

    /** 缓存上传服务器间隔时间(毫秒) */
    private _uploadIntervalTime: number = 30000;//30秒

    constructor() {
        super();
    }

    public OnStart() {
        this.ModelData = {};
        this._isLogin = false;
        Laya.timer.loop(this._uploadIntervalTime, this, this.LoopToUploadCache);
    }

    public OnDestroy() {
        this.ModelData = {};
        this._isLogin = false;
        Laya.timer.clearAll(this);
    }

    /** 是否登录 */
    public get IsLogin() {
        return this._isLogin;
    }

    /** 设置已登录 */
    public set IsLogin(login: boolean) {
        this._isLogin = login;
    }

    /** 初始化玩家数据 */
    public InitCache() {
        GameUIManager.getInstance().showTopUI(LoadingScenes1);
        RemoteCall.instance.HttpSend("getsavecache", GameLink.inst.urlParams["openid"], this, this.InitCacheData, () => {
            this.InitCacheData(null);
        });
        Laya.timer.once(3500, this, this.InitCacheData);
    }

    private InitCacheData(loginData) {
        if (this._isLogin)
            return;
        this._isLogin = true;
        loginData = this.decodeHttpData(loginData);
        let localData = this.GetLocalCache();
        if (this.CheckPlayerLv(loginData, localData)) {
            this.ModelData = localData
        } else {
            this.ModelData = loginData;
            this.SetLocalCache();//刷新本地数据
        }
        MyPlayer.EnterMap();
        this.SetOpenidCache(GameLink.inst.urlParams["openid"]);
    }

    private decodeHttpData(data) {
        let tInfo = null;
        try {
            tInfo = JSON.parse(data);
        } catch (error) {

        }
        let tTemp = {};
        for (const key in tInfo) {
            let name = tInfo[key].modelname;
            let value = tInfo[key].cachevalue;
            try {
                tTemp[name] = JSON.parse(value);
            } catch (error) {

            }
        }
        return tTemp;
    }

    /** 查看本地数据是否是最新的 */
    private CheckPlayerLv(loginData, localData) {
        if (!loginData) {
            return true;
        }
        if (!loginData[ModelStorage.Player] || !loginData[ModelStorage.Player].star) {
            return true;
        }

        if (!localData[ModelStorage.Player] || !localData[ModelStorage.Player].star) {
            return false;
        }

        let starS = loginData[ModelStorage.Player].star;
        let starL = localData[ModelStorage.Player].star;
        return starL >= starS;
    }

    /** 获取本地缓存 */
    private GetLocalCache() {
        let tData = {};
        if (Utils.getJSONFromLocal(ModelStorage.openid) != GameLink.inst.urlParams["openid"]) {
            Utils.clearLocal();
            return tData;
        }
        for (const key in ModelStorage) {
            let cacheName = ModelStorage[key];
            tData[cacheName] = Utils.getJSONFromLocal(cacheName);
        }
        return tData;
    }

    /** 获取本地缓存 */
    private SetLocalCache() {
        for (const key in ModelStorage) {
            let cacheName = ModelStorage[key];
            if (this.ModelData[key])
                Utils.saveJSONToLocal(cacheName, this.ModelData[key]);
        }
    }


    /** 定时上传缓存数据至服务器 */
    private LoopToUploadCache() {
        let data = {};
        let num = 0;
        for (const key in this._dirtyData) {
            if (this.ModelData[key]) {
                data[key] = JSON.stringify(this.ModelData[key]);
                data[key] = data[key].replace(/\\/g, "\\\\")
                num++;
            }
        }
        if (num <= 0)
            return;
        let tData = {};
        tData["openid"] = GameLink.inst.urlParams["openid"];
        tData["params"] = data;
        RemoteCall.instance.HttpSend("onsavecache", tData, this);
        this._dirtyData = {};
    }

    /** 缓存上传服务器 */
    private SendModelCacheToS(cacheName: ModelStorage) {
        let data = {};
        data[cacheName] = this.ModelData[cacheName];

        let tData = {};
        tData["openid"] = GameLink.inst.urlParams["openid"];
        tData["params"] = data;
        RemoteCall.instance.HttpSend("onsavecache", tData, this)
        if (this._dirtyData[cacheName]) {
            delete this._dirtyData[cacheName];
        }
    }

    /** ------------------------------------------设置游戏各系统存储------------------------------------------- */
    /** 缓存 */
    private SetCache(cacheName: ModelStorage, value: any) {
        this.ModelData[cacheName] = value;
        Utils.saveJSONToLocal(cacheName, value);
        this._dirtyData[cacheName] = true;
    }

    /** 根据模块名获取缓存 */
    public GetCache(cacheName: ModelStorage) {
        if (!this.ModelData[cacheName]) {
            return;
        }
        return this.ModelData[cacheName];
    }

    /** 设置玩家属性 */
    public SetPlayerCache(value: any) {
        this.SetCache(ModelStorage.Player, value);
    }

    /** 设置玩家背包属性 */
    public SetBagSystemCache(value: any) {
        this.SetCache(ModelStorage.bagsystem, value);
    }

    /** 设置Staff */
    public SetStaffCache(value: any) {
        this.SetCache(ModelStorage.Staff, value);
    }

    /** 主界面宣传按钮是否显示 */
    public SetPublicityCache(value: any) {
        this.SetCache(ModelStorage.Publicity, value);
    }

    /** 前10个Npc */
    public SetAgeNpcCountCache(value: any) {
        this.SetCache(ModelStorage.AgeNpcCount, value);
    }

    /** 设置Tree */
    public SetTreeCache(value: any) {
        this.SetCache(ModelStorage.Tree, value);
    }

    /** 设置Bottom */
    public SetBottomCache(value: any) {
        this.SetCache(ModelStorage.Bottom, value);
    }

    /** 设置GatherLv */
    public SetGatherLvCache(value: any) {
        this.SetCache(ModelStorage.GatherLV, value);
    }

    /** 设置mapData */
    public SetmapDataCache(value: any) {
        this.SetCache(ModelStorage.mapData, value);
    }

    /** 设置point */
    public SetPointCache(key, value: any) {
        this.SetCache(key, value);
    }

    /** 设置登陆次数 */
    public SetConnNum(value: number) {
        this.SetCache(ModelStorage.ConnNum, value);
    }
    /** 设置引导 */
    public SetGuideID(value: number) {
        this.SetCache(ModelStorage.GuideID, value);
    }
    /** 设置非强制引导 */
    public SetFreeGuideID(value: number) {
        this.SetCache(ModelStorage.FreeGuideID, value);
    }

    /** 设置Openid */
    public SetOpenidCache(value: any) {
        this.SetCache(ModelStorage.openid, value);
    }

    /** 设置Openid */
    public SetGoodsTime(value: any) {
        this.SetCache(ModelStorage.SgoodsTime, value);
    }

    /** 设置Openid */
    public SetNpc(value: any) {
        this.SetCache(ModelStorage.NPC, value);
    }
}