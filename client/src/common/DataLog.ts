import { GameLink } from "../game/Login/GameLink";
import { RemoteCall } from "../game/net/RemoteCall";
import { Player } from "../game/player/Player";
import { Singleton } from "./Singleton";

/** 打点 */
export class DataLog extends Singleton {
    constructor() {
        super();
    }

    /**
     * 视频打点
     * @param op_type 视频类型
     */
    public LogVideo_log(op_type: number) {
        console.log("==================打点====================", op_type)
        let tData = {};
        tData["openid"] = GameLink.inst.urlParams["openid"];
        tData["star"] = Player.getInstance().nStar;
        tData["op_type"] = op_type;
        RemoteCall.instance.HttpSend("onvideolog", tData, this);
    }

    /**
     * 产品UI数据--广告按钮使用打点
     * @param op_type 广告类型 （1:一次, 2:十次）
     */
    public LogAdvert_log(op_type: number) {
        let tData = {};
        tData["openid"] = GameLink.inst.urlParams["openid"];
        tData["star"] = Player.getInstance().nStar;
        tData["op_type"] = op_type;
        RemoteCall.instance.HttpSend("onadvertlog", tData, this);
    }

    /**
     * 种植数据
     * @param plant_name 解锁种值点名称 
     */
    public LogPlant_log(plant_name: string) {
        let tData = {};
        tData["openid"] = GameLink.inst.urlParams["openid"];
        tData["star"] = Player.getInstance().nStar;
        tData["plant_name"] = plant_name;
        tData["params"] = tData;
        RemoteCall.instance.HttpSend("onplantlog", tData, this);
    }

    /**
     * 引导打点
     * @param guide_type 引导id
     */
    public LogGuide_log(guide_type: number) {
        let tData = {};
        tData["openid"] = GameLink.inst.urlParams["openid"];
        tData["star"] = Player.getInstance().nStar;
        tData["guide_type"] = guide_type;
        RemoteCall.instance.HttpSend("onguidelog", tData, this);
    }
}
