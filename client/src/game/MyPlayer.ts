import { WxSDKManager } from "../platform/WxSDKManager";
import { RemoteCall } from "./net/RemoteCall";
import { Player } from "./player/Player";
import Application from "../common/Application";
import { SaveManager, ModelStorage } from "../manager/SaveManager";


/*
* 主玩家类
*/
export class MyPlayer {
    /** 微信SDK */
    public static wxSDK: WxSDKManager;
    public static wxSystemInfo: any;
    /**是否在游戏中 */
    private static _bInGame: boolean;
    public static get bInGame() {
        return this._bInGame;
    }

    public static OnStart(): void {
        this._bInGame = false;
    }

    public static OnDestroy(): void {
        this._bInGame = false;
    }

    /** 打点log */
    public static ReqPlayLog(play_type: string = null, play_name: string = null, play_param: string = null, op_type: number = null, use_time: number = null) {
        RemoteCall.instance.Send("K_ReqPlayLog", play_type, play_name, play_param, op_type, use_time);
    }

    /**主玩家进入地图 */
    public static EnterMap(): void {
        if (this._bInGame) {
            return
        }
        this._bInGame = true;
        //初始化各种管理器
        Player.getInstance().setName("111");
        Player.getInstance().refreshStorage();
        Application.onLoading();
        //设置登陆次数
        if(!SaveManager.getInstance().GetCache(ModelStorage.ConnNum))
        {
            SaveManager.getInstance().SetConnNum(1)
        }
        else
        {
            SaveManager.getInstance().SetConnNum(SaveManager.getInstance().GetCache(ModelStorage.ConnNum)+1)
        }
        //打开第一个场景
        // Laya.Scene.open("scene/PubScene.scene");
    }
}
