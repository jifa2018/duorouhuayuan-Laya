
import { Debug } from "../../Common/Debug";
import { GameLink } from "./GameLink";
import { Timer } from "../../Common/Timer";
import { MyPlayer } from "../MyPlayer";
import { GEvent } from "../../common/GEvent";
import { WxSDKManager } from "../../platform/WxSDKManager";
import { GameUIManager } from "../../manager/GameUIManager";
import { RemoteCall } from "../net/RemoteCall";
import { Player } from "../player/Player";
import Application from "../../common/Application";
import { Login } from "../ui/Login/Login";
import { ViewManager } from "../../manager/ViewManager";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
import { Time } from "../../common/Time";
export class LoginLogic {
    // 单例
    private static _class = null;
    public static get inst(): LoginLogic {
        if (this._class == null) {
            this._class = new this();
        }
        return this._class;
    }
    private _accountName: string;

    public OnStart() {
        GEvent.RegistEvent("OnConnecting", Laya.Handler.create(this, this.OnConnecting));
        GEvent.RegistEvent("OnConnected", Laya.Handler.create(this, this.OnConnected));
        GEvent.RegistEvent("OnConnectFail", Laya.Handler.create(this, this.OnConnectFail));
        GEvent.RegistEvent("OnConnectClose", Laya.Handler.create(this, this.OnConnectClose));
        GEvent.RegistEvent("WxEventOnShow", Laya.Handler.create(null, () => {
            Timer.Once(2000, this, () => {
                LoginLogic.inst.OnReConnect();
            });
        }));
    }

    public OnDestroy() {
        GEvent.RemoveEvent("OnConnecting", Laya.Handler.create(this, this.OnConnectFail));
        GEvent.RemoveEvent("OnConnected", Laya.Handler.create(this, this.OnConnected));
        GEvent.RemoveEvent("OnConnectFail", Laya.Handler.create(this, this.OnConnectFail));
        GEvent.RemoveEvent("OnConnectClose", Laya.Handler.create(this, this.OnConnectClose));
    }

    /**登录流程 */
    public StartLogin() {
        let cls = {
            ResUrl: "https://ssjxzh5-wb-login.gyyx.cn/PHP/wxsdk_duorou.php",
            GameID: "plant",
        }
        MyPlayer.wxSDK = new WxSDKManager(cls);
        /** 2020年7月10日11:23:48 + 显示分享按钮 */
        MyPlayer.wxSDK.ShowShareMenu({ withShareTicket: true })

        if (Laya.Browser.onWeiXin) {
            let loginCallBack = {
                successFn: function (res) {
                    GameLink.inst.WxCheckServerIp(res["appVersion"]);
                    LoginLogic.inst.Login(MyPlayer.wxSDK.openId);
                },
                failFn: function () {
                    Debug.Log("登录失败");
                }
            }
            let userInfoCallBack = {
                success: function () {
                    Debug.Log("授权成功");
                    GEvent.DispatchEvent("WXGetAuthor", true);
                },
                failFn: function () {
                    Debug.Log("授权失败");
                    GEvent.DispatchEvent("WXGetAuthor", false);
                }
            }
            MyPlayer.wxSDK.Login(loginCallBack);
            if (MyPlayer.wxSDK.userInfo != null) {
                MyPlayer.wxSDK.GetSystemInfo()
                MyPlayer.wxSDK.Authorize_UserInfo({ x: 0, y: 0 }, userInfoCallBack)
            }

        } else {
        // ViewManager.inst.ShowUI(LoginView, MiddleView);

        ViewManager.getInstance().OnStart();
        GameUIManager.getInstance().showUI(Login);
         }
    }

    /**重连 */
    public OnReConnect() {
        // 临时这么处理
        // Root.destroyChildren()
        // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        RemoteCall.instance.Connect(GameLink.inst.urlParams['selServerIP'], GameLink.inst.urlParams['selServerPort']);
    }

    private OnConnecting(): void {
    }

    private OnConnected(): void {
        this.GWHandShakeRequest();
    }

    private OnConnectFail(): void {
    }

    private OnConnectClose(): void {
    }

    public Login(accountName: string): void {
        this._accountName = accountName;
        GameLink.inst.urlParams["openid"] = accountName;
        GameUIManager.getInstance().destroyUI(Login);
        
        SaveManager.getInstance().InitCache();
        RemoteCall.instance.HttpSend("getservertime",null,this,(data)=>{
            Time.SetTimeDifference(data);
        })
        // RemoteCall.instance.Connect(GameLink.inst.urlParams['selServerIP'], GameLink.inst.urlParams['selServerPort']);
    }

    public LoadCharListMsg(data: any) {
        //销毁登录界面
        // ViewManager.inst.DestroyUI(LoginView, MiddleView);

        
        if (data[0] == 1) {
            //请求创建角色
            RemoteCall.instance.Send("K_PlayerCreate");
        }
        else {
            //进入创建流程
            RemoteCall.instance.Send("K_CreateCharReqMsg", this._accountName, 1, 1)
        }
    }

    public CreateCharResMsg(code: number) {
        if (code == 1) {
            // 名字重复
            Debug.LogError("名字重复！");
        }
    }

    private GWHandShakeRequest(): void {
        // 网关参数
        let str = "tgw_l7_forward\r\nHost:%s\r\n\r\n\0";
        let strTGW = str.replace("%s", GameLink.inst.urlParams['selServerIP'] + ":" + GameLink.inst.urlParams['selServerPort']);
        let byte = new Laya.Byte();
        byte.endian = Laya.Byte.getSystemEndian();
        byte.writeUTFBytes(strTGW);
        RemoteCall.instance.TGW(byte.buffer);
        // 发送登录消息
        GameLink.inst.urlParams['openid'] = this._accountName;
        RemoteCall.instance.Send("K_EnterKSReqMsg", GameLink.inst.urlParams, false);
    }
}