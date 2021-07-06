export class ProcessInfo {
    public protocolId: string;
    public protoBuf: JXS2CL_RESPONE;
    private _handlerList: Array<Laya.Handler> = new Array<Laya.Handler>();

    constructor(protocolId: string) {
        this.protocolId = protocolId;
        this.protoBuf = new JXS2CL_RESPONE();
    }

    public AddHandler(handler: Laya.Handler): void {
        if (handler != null) {
            this._handlerList.push(handler);
        }
    }

    public DelHandler(handler: Laya.Handler): void {
        for (let i: number = 0; i < this._handlerList.length; i++) {
            if (handler.caller == this._handlerList[i].caller && handler.method == this._handlerList[i].method) {
                this._handlerList[i].recover();
                this._handlerList.splice(i, 1);
                handler.recover();
                return;
            }
        }
    }

    public Dispatch(): void {
        (this.protoBuf as JXS2CL_RESPONE).data.shift();
        for (let i: number = 0; i < this._handlerList.length; i++) {
            let handler: Laya.Handler = this._handlerList[i];
            if (handler != null) {
                handler.setTo(handler.caller, handler.method, [(this.protoBuf as JXS2CL_RESPONE).data], false);
                handler.run();
            }
        }
    }
}

export class ProtocolMap {
    private _processInfoDict: Object;

    constructor() {
        this._processInfoDict = {};
    }

    public AddProtocolHandler(protocolId: string, handler: Laya.Handler): void {
        let info: ProcessInfo = this._processInfoDict[protocolId];
        if (info == null) {
            info = new ProcessInfo(protocolId);
            this._processInfoDict[protocolId] = info;
        }
        info.AddHandler(handler);
    }

    public DelProtocolHandler(protocolId: string, handler: Laya.Handler): void {
        let info: ProcessInfo = this._processInfoDict[protocolId];
        if (info != null && handler != null) {
            info.DelHandler(handler);
        }
    }

    public GetProcessInfo(protocolId: string): ProcessInfo {
        return this._processInfoDict[protocolId];
    }
}

class JXS2C_PROTOCOL_HEADER {
    //消息名称
    public protocolID: string;
    //消息数据
    public data: any;
    public GetData(i_Args: any): void {
        this.data = i_Args;
        this.protocolID = i_Args[0];
    }
}

class JXS2CL_RESPONE extends JXS2C_PROTOCOL_HEADER {
    public GetData(i_Args: any): void {
        super.GetData(i_Args);
    }
}