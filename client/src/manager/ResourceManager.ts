
/*
* 资源管理类;
*/
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import { Singleton } from "../common/Singleton";

export class ResourceManager extends Singleton {
    // 单例
    // private static _class = null;
    // public static get instance():ResourceManager{
    //     if (this._class == null) {
    //         this._class = new this();
    //     }
    //     return this._class;
    // }

    public OnStart(callBack?: Laya.Handler) {
    }

    public OnDestroy() {
    }

    public getResource(url: string | Array<string>, complate: Handler): void {
        if (Array.isArray(url)) {
            //如果是数组, 加载回调会返回true, 再次调用getResource(单个url)方法获取对象
        }
        else {
            var tar: Sprite3D = Laya.Loader.getRes(url);
            if (tar) {
                complate && complate.runWith(tar.clone());
                return;
            }
        }

        Laya.loader.create(url, Handler.create(this, function (ret: any) {

            complate && complate.runWith(ret.clone());
        }));
    }



    /**Laya3D相关加载 */

    /**
     * Laya3D异步加载
     * @param pUrl 资源地址的字符串(单个)或者字符串数组(多个)
     * @param fComplete 当为单个时，传入的是资源对象。多个时，传入的是map{资源地址 = 资源对象}}
     */
    public LoadASyn(pUrl: string | Array<string>, fComplete?: Laya.Handler): void {
        if (Array.isArray(pUrl)) {
            // let mapRetRes: {[key:string] : any} = {};
            let mapRetRes = new Map<string, any>();
            let aryLoadUrl: Array<string> = [];

            pUrl.forEach(sUrl => {
                let pRes = Laya.Loader.getRes(sUrl);
                if (pRes == null) {
                    aryLoadUrl.push(sUrl);
                }
                else {
                    mapRetRes[sUrl] = pRes;
                }
            });

            function multipleLoadDone() {
                aryLoadUrl.forEach(sUrl => {
                    // 闭包后，字符串数组变成了Object数组,需取出Object中的url字符串传给getRes函数
                    sUrl = (sUrl as any).url;
                    mapRetRes[sUrl] = Laya.Loader.getRes(sUrl);
                });
                if (fComplete) fComplete.runWith(mapRetRes);
            };

            if (aryLoadUrl.length > 0) {
                Laya.loader.create(aryLoadUrl, Laya.Handler.create(this, multipleLoadDone));
            }
            else {
                Laya.timer.frameOnce(1, this, multipleLoadDone);
            }
        }
        else {
            let pRes = Laya.Loader.getRes(pUrl);
            function singleLoadDone() {
                if (fComplete) fComplete.runWith(Laya.Loader.getRes(pUrl as string));
            }

            if (pRes == null) {
                Laya.loader.create(pUrl, Laya.Handler.create(this, singleLoadDone));
            }
            else {
                Laya.timer.frameOnce(1, this, singleLoadDone);
            }
        }
    }

    // public GetResAllPath(eType: ResPrefabPath, pName:string | Array<string>): string | Array<string>{
    //     if (Array.isArray(pName)){
    //         let aryAllPath: Array<string> = []
    //         let sPath: string = eType.toString();
    //         pName.forEach(sName => {
    //             aryAllPath.push(sPath + sName);
    //         });
    //         return aryAllPath;
    //     }
    //     else{
    //         return eType.toString() + pName;
    //     }
    // }
    //
    // public LoadPrefabASyn(eType: ResPrefabPath, pName:string | Array<string>, fComplete?: Laya.Handler): void{
    //     this.LoadASyn(this.GetResAllPath(eType, pName), fComplete);
    // }
}