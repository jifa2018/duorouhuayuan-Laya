    export class Time {
        //时间差（毫秒）
        private static _timeDifference: number = 0;

        /**
         * 设置服务器与客户端的时间差
         * @param time 服务器当前时间
         */
        public static SetTimeDifference(time: number): void {
            let serverDate: Date = new Date(time * 1000);
            this._timeDifference = serverDate.getTime() - Date.now();
        }

        /**获取服务器当前时间,单位Date */
        public static get serverDate(): Date {
            return new Date(this.serverMilliseconds);
        }

        /**获取服务器当前时间,单位秒 */
        public static get serverSeconds(): number {
            return Math.floor((Date.now() + Time._timeDifference) / 1000);
        }

        /**获取服务器当前时间,单位毫秒 */
        public static get serverMilliseconds(): number {
            return Math.floor(Date.now() + Time._timeDifference);
        }

        /**客户端秒数 */
        public static get Seconds(): number {
            return Math.floor(Date.now() / 1000);
        }

        /**客户端毫秒数 */
        public static get MilliSeconds(): number {
            return Date.now();
        }

        /**获取两帧之间的时间间隔,单位毫秒 */
        public static get delta(): number {
            return Laya.timer.delta;
        }

        /**获取当前帧开始的时间 */
        public static get currTimer(): number {
            return Laya.timer.currTimer;
        }

        /**获取当前的帧数 */
        public static get currFrame(): number {
            return Laya.timer.currFrame;
        }

        /**获取时针缩放 */
        public static get scale(): number {
            return Laya.timer.scale;
        }

        /**设置时针缩放 */
        public static set scale(scale: number) {
            Laya.timer.scale = scale;
        }
    }
