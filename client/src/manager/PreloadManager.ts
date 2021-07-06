import Handler = Laya.Handler;
import { Singleton } from "../common/Singleton";
import { ResourceManager } from "./ResourceManager";

export class PreloadManager extends Singleton {

    //private static _instance:PreloadManager;
    private _list: Array<string> = new Array<string>();

    /***
     * 对象实例
     */
    // public static get instance():PreloadManager
    // {
    //     if(!this._instance)
    //         this._instance = new PreloadManager();
    //     return this._instance;
    // }

    public init(callBack: Handler): void {
        this.preloadSprite3D();
        Laya.loader.load("res/config/preload.json", Laya.Handler.create(this, () => {
            //解析配置
            let res = Laya.loader.getRes("res/config/preload.json");
            if (!res || res.data.length == 0) {
                return;
            }
            Laya.loader.load(res.data, Laya.Handler.create(this, () => {
                callBack && callBack.run();
            }));
        }));
    }

    /**部分3D物体提前加载 */
    preloadSprite3D() {
        Laya.loader.load("res/config/preload3D.json", Laya.Handler.create(this, () => {
            //解析配置
            let res = Laya.loader.getRes("res/config/preload3D.json");
            if (!res || res.data.length == 0) {
                return;
            }
            ResourceManager.getInstance().getResource(res.data, null);
        }));
    }
}