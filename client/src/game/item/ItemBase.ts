/**
 * @Purpose 场景物品基类
 * @Author zhanghj
 * @Date 2020/8/11 10:25
 * @Version 1.0
 */
import Sprite3D = Laya.Sprite3D;

export class ItemBase extends Sprite3D{

    /***
     * 3d场景节点点击回调
     * 有点击需求的重载此方法
     */
    public onClick():void
    {

    }
}