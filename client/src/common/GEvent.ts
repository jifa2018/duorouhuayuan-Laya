import { Debug } from "./Debug";

export class TEvent {
    private _handerList: Array<Laya.Handler>;

    constructor() {
        this._handerList = new Array<Laya.Handler>();
    }

    public Add(handler: Laya.Handler): void {
        this._handerList.push(handler);
    }

    public Remove(handler: Laya.Handler): void {
        for (let i: number = 0; i < this._handerList.length; i++) {
            if (handler.caller == this._handerList[i].caller && handler.method == this._handerList[i].method) {
                this._handerList[i].recover();
                this._handerList.splice(i, 1);
                handler.recover();
                return;
            }
        }
    }

    public Exec(args?: Array<any>): void {
        for (let i: number = this._handerList.length; i >= 0; i--) {
            let handler: Laya.Handler = this._handerList[i];
            if (handler != null) {
                handler.setTo(handler.caller, handler.method, args, false);
                handler.run();
            }
        }
    }
}

export class GEvent {
    //事件列表
    private static _eventList: Object = {};

    /**
     * 派发事件
     * @param type 消息类型
     * @param args 额外参数
     */
    public static DispatchEvent(type: string, args?: any): void {
        if (!(args instanceof Array))
            args = [args];

        let ev: TEvent = GEvent._eventList[type];
        if (ev != null) {
            try {
                ev.Exec(args);
            }
            catch (e) {
                Debug.LogError(e);
            }
        }
    }

    /**
     * 注册事件
     * @param type 消息类型
     * @param handler 回调函数
     */
    public static RegistEvent(type: string, handler: Laya.Handler): void {
        let ev: TEvent = GEvent._eventList[type];
        if (ev == null) {
            ev = new TEvent()
            GEvent._eventList[type] = ev;
        }
        ev.Add(handler);
    }

    /**
     * 删除事件
     * @param type 消息类型
     * @param handler 回调函数
     */
    public static RemoveEvent(type: string, handler: Laya.Handler): void {
        let ev: TEvent = GEvent._eventList[type];
        if (ev != null && handler != null) {
            ev.Remove(handler);
        }
    }
}