export class GameLink{
    // 单例
    private static _class = null;
    public static get inst():GameLink{
        if (this._class == null) {
            this._class = new this();
        }
        return this._class;
    }
    private _urlParams: Object;

    public static wxVersionNum = "1.0.0.0";

    //wx
    public _defaultHTTPIP = "ssjxzh5-wb-login.gyyx.cn/wx_plant";
    public _defaultHTTPPort:number = 8882;

    public __defaultHTTPIP = "211.159.171.150";
    public __defaultHTTPPort: number = 8882

    private _defaultGatewayIP = "211.159.171.150";
    private _defaultGatewayPort: number = 8883

    // public _defaultHTTPIP = "127.0.0.1";
    // public _defaultHTTPPort: number = 8882
    // private _defaultGatewayIP = "127.0.0.1";
    // private _defaultGatewayPort: number = 8888
    public get urlParams(): Object {
        return this._urlParams;
    }

    public OnStart() {
        // if(Laya.Browser.onWeiXin){
        //     this._defaultGatewayPort = null;
        // }
        this._urlParams = {};
        this.SetGameParams();
    }

    public OnDestroy() {
        this._urlParams = {};
    }

    public WxCheckServerIp(appVersion:string){
        if(GameLink.wxVersionNum == appVersion){
            this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/wx_plant";
        }else{
            this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/wx_plant";
        }
        this._urlParams['selServerIP'] = this._defaultGatewayIP;
    }

    // 设置游戏参数
    public SetGameParams() {
        this._urlParams['selServerIP'] = this._defaultGatewayIP;
        this._urlParams['selServerPort'] = this._defaultGatewayPort;
        this._urlParams['serverid'] = new Link().loginParams.serverid;
        this._urlParams['sid'] = new Link().loginParams.sid;
        this._urlParams['firstGame'] = 'false';
        this._urlParams['mac'] = '';
        this._urlParams['openid'] = new Link().loginParams.openid;
        this._urlParams['pf'] = new Link().loginParams.pf;
    }
}

// 本地开发参数
class Link {
    public loginParams = {
        openid: "",
        serverid: 1,
        sid: 1,
        pf: "pf",
        firstGame: "FALSE",
        openkey: null,
        seqid: null,
        pfkey: null,
        sig: null,
        mac: ""
    }
}