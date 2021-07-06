import { LogLevel } from "../game/GameDefine";

export class Debug {
    public static _logLevel: LogLevel = 100;
    // public static _onLog: Laya.Handler;
    public static _onLogWarning: Laya.Handler;
    public static _onLogError: Laya.Handler;
    public static _onLogException: Laya.Handler;
    public static _onAssert: Laya.Handler;
    /**锁-控制输出 */
    public static isLock: boolean = true;


    public static _onLog = Laya.Handler.create(null, (msg) => {
        if (Debug.isLock) {
            console.log(msg)
        }
    })

    public static Log(msg: any): void {
        if (Debug._logLevel >= LogLevel.Log) {
            if (Debug._onLog != null) {
                Debug._onLog.setTo(Debug._onLog.caller, Debug._onLog.method, [msg], false);
                Debug._onLog.run();
            }
        }
    }

    public static LogWarning(msg: any): void {
        if (Debug._logLevel >= LogLevel.Warning) {
            if (Debug._onLogWarning != null) {
                Debug._onLogWarning.setTo(Debug._onLogWarning.caller, Debug._onLogWarning.method, [msg], false);
                Debug._onLogWarning.run();
            }
        }
    }

    public static LogError(msg: any): void {
        if (Debug._logLevel >= LogLevel.Error) {
            if (Debug._onLogError != null) {
                Debug._onLogError.setTo(Debug._onLogError.caller, Debug._onLogError.method, [msg], false);
                Debug._onLogError.run();
            }
        }
    }

    public static Assert(condition: boolean, msg: string = ""): void {
        if (Debug._onAssert != null) {
            Debug._onLogError.setTo(Debug._onLogError.caller, Debug._onLogError.method, [condition, msg], false);
            Debug._onLogError.run();
        }
    }
}