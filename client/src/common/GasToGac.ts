
import { Time } from "./Time";
import { LoginLogic } from "../game/Login/LoginLogic";
import { MyPlayer } from "../game/MyPlayer";
import { RemoteCall } from "../game/net/RemoteCall";

export class GasToGac {
    // 单例
    private static _class = null;
    public static get inst(): GasToGac {
        if (this._class == null) {
            this._class = new this();
        }
        return this._class;
    }
    private C_LastError(data: any) {
        RemoteCall.instance.LastError(data);
    }

    private C_ServerTime(data: any) {
        Time.SetTimeDifference(data[0]);
    }

    private C_LoadCharListMsg(data: any) {
        LoginLogic.inst.LoadCharListMsg(data);
    }

    public C_CreateCharResMsg(code: number) {
        LoginLogic.inst.CreateCharResMsg(code);
    }

    private C_EnterMap() {
        // MyPlayer.EnterMap();
    }
    
    private C_HeartBeat() {
        RemoteCall.instance.C_HeartBeat()
    }

    

    public OnStart() {
        RemoteCall.instance.RegisterProtocol("C_LastError", this);
        RemoteCall.instance.RegisterProtocol("C_ServerTime", this);
        RemoteCall.instance.RegisterProtocol("C_LoadCharListMsg", this);
        RemoteCall.instance.RegisterProtocol("C_CreateCharResMsg", this);
        RemoteCall.instance.RegisterProtocol("C_SyncPlayerInfoMsg", this);
        RemoteCall.instance.RegisterProtocol("C_EnterMap", this);
        RemoteCall.instance.RegisterProtocol("C_HeartBeat", this);
    }
    
    public OnDestroy() {
        RemoteCall.instance.UnRegisterProtocol("C_LastError", this);
        RemoteCall.instance.UnRegisterProtocol("C_ServerTime", this);
        RemoteCall.instance.UnRegisterProtocol("C_LoadCharListMsg", this);
        RemoteCall.instance.UnRegisterProtocol("C_CreateCharResMsg", this);
        RemoteCall.instance.UnRegisterProtocol("C_SyncPlayerInfoMsg", this);
        RemoteCall.instance.UnRegisterProtocol("C_EnterMap", this);
        RemoteCall.instance.UnRegisterProtocol("C_HeartBeat", this);
    }
}