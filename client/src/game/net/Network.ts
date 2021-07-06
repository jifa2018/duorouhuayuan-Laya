import { ProtocolMap, ProcessInfo } from "./Protocol";
import { NetAnalysis } from "./NetAnalysis";
import {SocketState} from "../GameDefine";
import {Debug} from "../../common/Debug";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";

/**最大能够发送的数据尺寸 */
export const MAX_SEND_BUFFER_SIZE: number = 4094;
/**消息头长度 */
export const MESSAGE_HEAD_LENGTH: number = 2;

export class Network {
    private _host: string;
    private _port: number;
    private _socket: Laya.Socket;
    private _state: SocketState;
    private _sequence: number = 0;
    private _sendBuffer: Laya.Byte;
    private _recvBuffer: Laya.Byte;
    private _codeService: NetAnalysis;
    private _protocolMap: ProtocolMap;

    constructor() {
        this._sendBuffer = new Laya.Byte();
        this._recvBuffer = new Laya.Byte();
        this._codeService = new NetAnalysis();
        this._protocolMap = new ProtocolMap();
    }

    /**
     * 连接服务器
     * @param host 地址
     * @param port 端口
     */
    public connect(host: string, port: number): void {
        if (this._socket) {
            this.onConnectClose();
        }
        this._host = host;
        this._port = port;
        this._socket = new Laya.Socket();
        this._socket.on(Laya.Event.OPEN, this, this.onConnected);
        this._socket.on(Laya.Event.ERROR, this, this.onConnectFail);
        this._socket.on(Laya.Event.CLOSE, this, this.onConnectClose);
        this._socket.on(Laya.Event.MESSAGE, this, this.receive);
        if (host.indexOf("ws://") != -1 || host.indexOf("wss://") != -1) {
            this._socket.connectByUrl(host + ":" + port);
        }
        else {
            this._socket.connect(host, port);
        }
        this.setSocketState(SocketState.CONNECTING);
    }

    /**
     * 断开连接
     */
    public close(): void {
        if (!this._socket) {
            return;
        }
        try {
            if (this._socket.connected == true) {
                this._socket.cleanSocket();
            }
            this._socket.close();
        }
        catch (e) {
            Debug.LogError(e);
        }
        finally {
            this._sequence = 0;
            this._socket = null;
        }
    }

    /**
     * 发送消息
     * @param msgType 消息类型
     * @param args 参数
     */
    public send(msgType: string, ...args): void {
        if (!this._socket || !this.isConnected()) {
            return;
        }

        //消息编码
        let bt;
        if (msgType.indexOf("G_") == 0) {
            bt = this._codeService.Encode("K_Ts", msgType, ...args);
        }
        else {
            bt = this._codeService.Encode(msgType, ...args);
        }
        bt.length = bt.pos;
        if (bt.length > MAX_SEND_BUFFER_SIZE) {
            Debug.LogError("消息长度超过" + MAX_SEND_BUFFER_SIZE);
            return;
        }

        //消息包
        this._sendBuffer.clear();
        this._sendBuffer.writeUint16(bt.length + 1);
        this._sendBuffer.writeUint8(this._sequence);
        this._sendBuffer.writeArrayBuffer(bt.buffer);

        //设置消息队列码
        if (++this._sequence >= 256) {
            this._sequence = 0;
        }

        //发送
        this._socket.send(this._sendBuffer.buffer);
    }

    /**
     * 接收消息
     * @param data 数据
     */
    private receive(data: ArrayBuffer): void {
        if (!this._socket || !this.isConnected()) {
            return;
        }

        if (!(data instanceof ArrayBuffer)) {
            Debug.LogError("接收网络消息类型错误! 消息类型应为ArrayBuffer！");
            return;
        }

        this._recvBuffer.writeArrayBuffer(data);
        this._recvBuffer.pos = 0;

        let packageDataLen = this._recvBuffer.getInt16();
        if (packageDataLen <= 0) {
            Debug.LogError("数据包长度小于等于零！");
            return;
        }

        if (packageDataLen + MESSAGE_HEAD_LENGTH > this._recvBuffer.length) {
            this._recvBuffer.pos = this._recvBuffer.length;
            return;
        }

        let _pos, _args;
        while (true) {
            //解析数据并回调
            _args = this._codeService.Decode(this._recvBuffer, packageDataLen);
            //获取消息信息
            let processInfo: ProcessInfo = this._protocolMap.GetProcessInfo(_args[0]);
            if (processInfo != null) {
                //解析数据
                processInfo.protoBuf.GetData(_args);
                //向游戏内分发消息事件
                processInfo.Dispatch();
            }
            //判断是否可继续读取
            if (this._recvBuffer.pos + MESSAGE_HEAD_LENGTH >= this._recvBuffer.length) {
                break;
            }
            _pos = this._recvBuffer.pos;
            packageDataLen = this._recvBuffer.getInt16();
            if (packageDataLen > this._recvBuffer.length - this._recvBuffer.pos) {
                this._recvBuffer.pos = _pos;
                break;
            }
        }
        //数据解析完毕，清理客户端数据缓冲区
        this._socket.input.clear();
        //解决本次收到的数据内容多出的部分进行缓存
        let buffer = this._recvBuffer.buffer.slice(this._recvBuffer.pos, this._recvBuffer.length);
        this._recvBuffer.clear();
        this._recvBuffer.writeArrayBuffer(buffer);
    }

    /**设置socket状态 */
    private setSocketState(state: SocketState) {
        this._state = state;
        if (this._state == SocketState.CONNECT_CLOSE) {
            this.close();
        }
        //打印信息
        if (this._state == SocketState.CONNECTING) {
            Debug.Log("开始连接到服务器!");
            GEvent.DispatchEvent(GacEvent.OnConnecting);
        }
        else if (this._state == SocketState.CONNECTED) {
            Debug.Log("连接服务器成功！");
            GEvent.DispatchEvent(GacEvent.OnConnected, true);
        }
        else if (this._state == SocketState.CONNECT_FAIL) {
            Debug.Log("连接服务器失败！");
            GEvent.DispatchEvent(GacEvent.OnConnectFail);
        }
        else if (this._state == SocketState.CONNECT_CLOSE) {
            Debug.Log("与服务器断开连接！");
            GEvent.DispatchEvent(GacEvent.OnConnectClose);
        }
    }

    /**连接成功 */
    private onConnected(): void {
        this.setSocketState(SocketState.CONNECTED);
    }

    /**连接失败 */
    private onConnectFail(): void {
        this.setSocketState(SocketState.CONNECT_FAIL);
    }

    /**断开连接 */
    private onConnectClose(): void {
        this.setSocketState(SocketState.CONNECT_CLOSE);
    }

    /**是否已经连接 */
    public isConnected(): boolean {
        return this._state == SocketState.CONNECTED;
    }

    /**注册消息监听 */
    public registerProtocol(protocolId: string, handler: Laya.Handler): void {
        this._protocolMap.AddProtocolHandler(protocolId, handler);
    }

    /**删除消息监听 */
    public unRegisterProtocol(protocolId: string, handler: Laya.Handler): void {
        this._protocolMap.DelProtocolHandler(protocolId, handler);
    }

    /**打通网关 */
    public TGW(arrayBuffer: ArrayBuffer) {
        this._socket.send(arrayBuffer);
    }
}