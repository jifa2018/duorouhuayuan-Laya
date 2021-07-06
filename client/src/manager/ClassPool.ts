import Pool = Laya.Pool;
import {Singleton} from "../common/Singleton";
export class ClassPool extends Singleton
{
    //private static _instance:ClassPool;
    private poolChildren:any = {};

    /***
     * 对象实例
     */
    // public static get instance():ClassPool
    // {
    //     if(!this._instance)
    //         this._instance = new ClassPool();
    //     return this._instance;
    // }

    /***
     * 根据标记创建对象
     * @param name  标记
     * @param cls   类
     */
    public getItemByClass(sign:string, cls:any):any
    {
        if(!this.poolChildren[sign])
            this.poolChildren[sign] = 1;
        return Pool.getItemByClass(sign, cls);
    }

    /**
     * 根据标记获取对象池数组
     * @param sign  标记
     */
    public getPoolBySign(sign:string):any
    {
        return Pool.getPoolBySign(sign);
    }

    /***
     * 根据标记清理对象池数组
     * @param sign  标记
     */
    public clearPoolSign(sign:string):any
    {
        return Pool.clearBySign(sign);
    }

    /***
     * 根据标记回收对象
     * @param sign  标记
     * @param cls   类
     */
    public recover(sign:string, cls:any):void
    {
        return Pool.recover(sign, cls);
    }

    /***
     * 根据类回收对象
     * @param cls   类
     */
    public recoverByClass(cls:any):void
    {
        return Pool.recoverByClass(cls);
    }

    /***
     * 清理对象池中所有对象
     */
    public destroyAllPool():void
    {
        var arr:Array<any>;
        for(var o in this.poolChildren)
        {
            arr = this.getPoolBySign(o);
            for(var i:number = 0; i < arr.length; ++i)
            {
                arr[i].destroy();
            }

            this.clearPoolSign(o);
        }
    }
}