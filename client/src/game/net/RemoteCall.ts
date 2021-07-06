import { GacEvent } from "../../common/GacEvent";
import { OffLineType } from "../GameDefine";
import { Network } from "./Network";
import { GEvent } from "../../common/GEvent";
import { Debug } from "../../common/Debug";
import { Format, GetFormatTime } from "../../utils/Utils";
import { MyPlayer } from "../MyPlayer";
import { HttpService } from "../http/HttpService";
import { GameLink } from "../Login/GameLink";

export class RemoteCall {
    // 单例
    private static _class = null;
    public static get instance(): RemoteCall {
        if (this._class == null) {
            this._class = new this();
        }
        return this._class;
    }
    private _network: Network;

    public OnStart() {
        this._network = new Network();
        GEvent.RegistEvent(GacEvent.OnConnected, Laya.Handler.create(this, this.OnReConnected));
        GEvent.RegistEvent(GacEvent.OnConnectClose, Laya.Handler.create(this, this.OnConnectClose));
        // this.Connect("127.0.0.1", 8888);
    }

    public OnDestroy() {
        this.Close();
        this._network = null;
        GEvent.RemoveEvent(GacEvent.OnConnected, Laya.Handler.create(this, this.OnReConnected));
        GEvent.RemoveEvent(GacEvent.OnConnectClose, Laya.Handler.create(this, this.OnConnectClose));
    }

    public Connect(host: string, port: number): void {
        this._network.connect(host, port);
    }

    public Close(): void {
        this._network.close();
    }

    public IsConnected(): boolean {
        return this._network.isConnected();
    }

    public RegisterProtocol(protocolId: string, cls: any): void {
        this._network.registerProtocol(protocolId, Laya.Handler.create(cls, cls[protocolId]));
    }

    public UnRegisterProtocol(protocolId: string, cls: any): void {
        this._network.unRegisterProtocol(protocolId, Laya.Handler.create(cls, cls[protocolId]));
    }

    public Send(i_strMsg: any, ...args): void {
        this._network.send(i_strMsg, ...args);
    }

    public TGW(i_SendBuffer: ArrayBuffer) {
        this._network.TGW(i_SendBuffer);
    }

    public HttpSend(i_strMsg: string, i_jParam: any,caller: any, fn?: Function,errFn?:Function): void {
        let hs: HttpService = new HttpService();
        let postLoginServerUrl;
        if(GameLink.inst._defaultHTTPPort == 0)
        {
            postLoginServerUrl = "https://" + GameLink.inst._defaultHTTPIP + "/" + i_strMsg;
        }
        else
        {
            postLoginServerUrl = "http://" + GameLink.inst.__defaultHTTPIP + ":" + GameLink.inst.__defaultHTTPPort + "/" + i_strMsg;
        }
            hs.Request(postLoginServerUrl, i_jParam, "post", "text", (data) => {
            if(fn){
                fn.call(caller,data);
            }
        },(data)=>{
            if(errFn){
                errFn.call(caller,data);
            }
        })
    }

    //---------------------------------------------------------断线重连------------------------------------------------------------
    /**断线重连次数 */
    private _reConnectNum: number = 0;
    /**断线重连最大次数 */
    private _reConnectMaxNum: number = 5;
    /**断线重连第一次重连间隔(毫秒)  */
    private _firstReConnectIntervalTime: number = 2000;
    /**断线重连间隔时间(毫秒) */
    private _reConnectIntervalTime: number = 5000;
    /**心跳包超时(毫秒) */
    private _heartBeatOverTime: number = 14000;
    /**心跳包延时(毫秒) */
    private _heartBeatDelayed: number = 5000;
    /**重连缓冲时间 */
    private _bufferTime: number = 1000;
    /**是否正在重连 */
    private _bReConnecting: boolean = false;
    public get bReConnecting() {
        return this._bReConnecting;
    }

    /**开启断线重连 */
    public OpenReConnect() {
        this.K_HeartBeat();
    }

    /**关闭断线重连、直接踢下线 */
    public CloseReConnect() {
        this._bReConnecting = false;
        Laya.timer.clear(this, this.K_HeartBeat);
        Laya.timer.clear(this, this.OnReConnectBuffer);
        Laya.timer.clear(this, this.OnReConnectStart);
        Laya.timer.clear(this, this.OnReConnectWait);
        // 关闭当前连接
        this.Close();
    }

    /**发送心跳包 */
    private K_HeartBeat() {
        if (this._bReConnecting) return;
        this.Send("K_HeartBeat");
        Laya.timer.once(this._heartBeatOverTime, this, this.OnReConnectBuffer)
    }

    /**接收心跳包 */
    public C_HeartBeat() {
        if (this._bReConnecting) return;
        Laya.timer.clear(this, this.OnReConnectBuffer);
        Laya.timer.clear(this, this.OnReConnectStart);

        Laya.timer.once(this._heartBeatDelayed, this, this.K_HeartBeat);
    }

    /**重连缓冲 */
    private OnReConnectBuffer() {
        if (this._bReConnecting) return;
        Laya.timer.once(this._bufferTime, this, this.OnReConnectStart);
    }

    /**断线重连开始 */
    private OnReConnectStart() {
        if (this._bReConnecting) return;
        this._bReConnecting = true;
        // 关闭当前连接
        this.Close();
        //ViewManager.instance.ShowUI(ReConnectView, TopView);
        Laya.timer.once(this._firstReConnectIntervalTime, this, () => {
            this.OnReConnectWait();
            Laya.timer.loop(this._reConnectIntervalTime, this, this.OnReConnectWait);
        });
    }

    /**尝试重连等待 */
    private OnReConnectWait() {
        this._reConnectNum++;
        if (this._reConnectNum > this._reConnectMaxNum) {
            this.OnReConnected(false);
        }
        else {
            //LoginLogic.instance.OnReConnect();
        }
    }

    /**断线重连结束 */
    private OnReConnected(bSuccess: boolean) {
        Laya.timer.once(500, this, () => {
            this.OpenReConnect();
        })
        if (!this._bReConnecting) {
            return;
        }
        this._bReConnecting = false;
        this.OpenReConnect();
        this._reConnectNum = 0;
        Laya.timer.clear(this, this.OnReConnectWait);
        this.Send("K_StoryFinish", 12345);
        GEvent.DispatchEvent(GacEvent.OnReConnected, [bSuccess]);
    }

    //---------------------------------------------------------服务器断线提示------------------------------------------------------------
    //离线类型
    private offLineType: OffLineType = OffLineType.eUnknow;
    //离线附加数据
    private offLineData: any;
    private _offLineTips = {
        1: "与服务器断开连接(#%s)！<br>",
        2: "您的账号将在%s被解封，请大侠耐心等待！",
        3: "登陆异常！您的账号在IP：%s登录！您已被迫下线！",
        4: "抱歉,您已被GM请出游戏！",
        5: "服务器已关闭,请诸位耐心等候！",
        6: "登录失败,请大侠重新登陆！",
        7: "登录服务器出现异常,请重新登陆！",
        8: "当前在线人数已超出服务器上限，请大侠重新登录！",
        9: "恭喜您,改名成功，请重新登录！",
        10: "当前网络出现异常，请重新登录！",
        11: "检测到您正在使用外挂, 请关闭后重试！",
        12: "您的数据出现异常，请重新登录！",
        13: "检测到客户端有新版本，请刷新后重新登陆！"
    }

    /**
     * 服务器返回账号掉线信息
     * @param type 掉线类型
     * @param data 提示数据
     */
    public LastError(data: any) {
        this.offLineType = data[0];
        this.offLineData = data[1];
    }

    /**
     * 服务器连接断开了，给予提示信息
     */
    private OnConnectClose() {
        let str = Format(this._offLineTips[1], this.offLineType);
        //封号踢人
        if (OffLineType.eBanPlay == this.offLineType) {
            let tstr = GetFormatTime(this.offLineData);
            str += Format(this._offLineTips[2], tstr);
            RemoteCall.instance.CloseReConnect();
        }
        //顶号（重复登录）
        else if (OffLineType.eRepeatLogin == this.offLineType) {
            str += Format(this._offLineTips[3], this.offLineData);
            RemoteCall.instance.CloseReConnect();
        }
        //GM踢人，不封号
        else if (OffLineType.eGMKick == this.offLineType) {
            str += this._offLineTips[4];
            RemoteCall.instance.CloseReConnect();
        }
        //服务器关闭
        else if (OffLineType.eServerShutdown == this.offLineType) {
            str += this._offLineTips[5];
            RemoteCall.instance.CloseReConnect();
        }
        //登陆失败
        else if (OffLineType.eLoginFailed == this.offLineType) {
            str += this._offLineTips[6];
            RemoteCall.instance.CloseReConnect();
        }
        // 登陆服务器错误
        else if (OffLineType.eLoginServerError == this.offLineType) {
            str += this._offLineTips[7];
            RemoteCall.instance.CloseReConnect();
        }
        //服务器高负载
        else if (OffLineType.eLoginFull == this.offLineType) {
            str += this._offLineTips[8];
            RemoteCall.instance.CloseReConnect();
        }
        //改名被踢
        else if (OffLineType.eReName == this.offLineType) {
            str += this._offLineTips[9];
            RemoteCall.instance.CloseReConnect();
        }
        //网络异常
        else if (OffLineType.eUnknow == this.offLineType) {
            if (MyPlayer.bInGame) {
                return;
            }
            else {
                str += this._offLineTips[10];
            }
        }
        //使用外挂，恶意软件
        else if (OffLineType.eShield == this.offLineType) {
            str += this._offLineTips[11];
            RemoteCall.instance.CloseReConnect();
        }
        // 版本更新
        else if (OffLineType.eVersionFail == this.offLineType) {
            str += this._offLineTips[13];
            RemoteCall.instance.CloseReConnect();
        }
        //未知错误
        else {
            //已经在游戏中，不提示，走断线重连
            if (MyPlayer.bInGame) {
                return;
            }
            else {
                str += this._offLineTips[12];
            }
        }
        Debug.Log(str);
        // location.reload();
    }
}