export class Timer {
    /**
     * 定时重复执行(基于帧率)
     * @param	delay	间隔几帧(单位为帧)
     * @param	caller	执行域(this)
     * @param	method	定时器回调函数
     * @param	args	回调参数
     * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true
     */
    public static FrameLoop(delay: number, caller: any, method: Function, args?: Array<any>, coverBefore?: boolean) {
        Laya.timer.frameLoop(delay, caller, method, args, coverBefore);
    }

    /**
     * 定时执行一次(基于帧率)
     * @param	delay	延迟几帧(单位为帧)
     * @param	caller	执行域(this)
     * @param	method	定时器回调函数
     * @param	args	回调参数
     * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true
     */
    public static FrameOnce(delay: number, caller: any, method: Function, args?: Array<any>, coverBefore?: boolean) {
        Laya.timer.frameOnce(delay, caller, method, args, coverBefore);
    }

    /**
     * 定时重复执行。
     * @param	delay	间隔时间(单位毫秒)
     * @param	caller	执行域(this)
     * @param	method	定时器回调函数
     * @param	args	回调参数
     * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true
     * @param	jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
     */
    public static Loop(delay: number, caller: any, method: Function, args?: Array<any>, coverBefore?: boolean, jumpFrame?: boolean) {
        Laya.timer.loop(delay, caller, method, args, coverBefore, jumpFrame);
    }

    /**
     * 定时执行一次。
     * @param	delay	延迟时间(单位为毫秒)
     * @param	caller	执行域(this)
     * @param	method	定时器回调函数
     * @param	args	回调参数
     * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true
     */
    public static Once(delay: number, caller: any, method: Function, args?: Array<any>, coverBefore?: boolean) {
        Laya.timer.once(delay, caller, method, args, coverBefore);
    }

    /**
     * 清理定时器。
     * @param	caller 执行域(this)
     * @param	method 定时器回调函数
     */
    public static Clear(caller: any, method: Function) {
        Laya.timer.clear(caller, method);
    }

    /**
     * 清理对象身上的所有定时器
     * @param	caller 执行域(this)
     */
    public static ClearAll(caller: any) {
        Laya.timer.clearAll(caller);
    }

    /**
     * 一定时间内执行一次
     * @param key 唯一标识
     * @param time 延迟时间(单位为毫秒)
     * @param callBack 定时器回调函数
     */
    public static SpecialOnce(key: string, time: number, callBack: Function) {
        if (!key || !time || !callBack) {
            return;
        }
        if (this._timeSpecial.indexOf(key) != -1) {
            return;
        }
        this._timeSpecial.push(key);
        this.Once(time, null, () => {
            callBack();
            this._timeSpecial.splice(this._timeSpecial.indexOf(key), 1);
        });
    }
    private static _timeSpecial: Array<string> = [];
}