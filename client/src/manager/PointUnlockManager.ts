/**
 * @Purpose 场景功能点解锁
 * @Author zhanghj
 * @Date 2020/9/14 16:11
 * @Version 1.0
 */
import {Singleton} from "../common/Singleton";
import {Dictionary} from "../utils/Dictionary";

export class PointUnlockManager extends Singleton{

    private unLockDic:Dictionary = new Dictionary();

    /***
     * 初始化已经解锁的点
     * @param data
     */
    public initPoint(data:any):void
    {

    }

    /***
     * 当有功能点解锁时调用
     * @param name
     */
    public onUnlockPoint(name:string):void
    {
        //保存已解锁的点
        this.unLockDic[name] = 1;
    }

    /***
     * 获取解锁状态
     * @param name
     */
    public getLockStatus(name:string):boolean
    {
        return this.unLockDic.get(name);
    }
}