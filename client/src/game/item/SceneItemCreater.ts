/**
 * @Purpose 场景掉落物创建器
 * 用于创建 / 删除 / 打包数据
 * @Author zhanghj
 * @Date 2020/8/6 20:05
 * @Version 1.0
 */
import { SceneItem } from "./SceneItem";
import { ClassPool } from "../../manager/ClassPool";
import Vector3 = Laya.Vector3;
import { Singleton } from "../../common/Singleton";
import { Utils } from "../../utils/Utils";
import Camera = Laya.Camera;
import Vector2 = Laya.Vector2;
import { Drop_Cfg, Sceneeffect_Cfg } from "../../manager/ConfigManager";
import { Player } from "../player/Player";
import GameScene from "../scene/GameScene";

export class SceneItemCreater extends Singleton {
    private _itemList: Array<SceneItem> = new Array<SceneItem>();
    private _index: number = 0;
    private MAX_SCENE_ITEM_NUM:number = 50;
    private itemNumDic:Array<number> = new Array();

    public constructor() {
        super();
        this.itemNumDic[0] = 0;
        this.itemNumDic[1] = 0;
        this.itemNumDic[2] = 0;
    }
    /**
     * 创建掉落
     * @param tableId
     * @param pos
     * @param price 拾取获得货币数量
     */
    public createItem(tableId: number, pos: Vector3, price: number = 1): SceneItem {
        var index:number = 0;
        if(this.itemNumDic[index] >= this.MAX_SCENE_ITEM_NUM)
            return null;
        var item: SceneItem = ClassPool.getInstance().getItemByClass("SceneItem" + tableId.toString(), SceneItem);
        item.init(tableId, pos,()=>{
            this._itemList.push(item);
            this.itemNumDic[index] += 1;
        },price, index);
        item.index = this._index;
        this._index += 1;
        return item;
    }

    /***
     * 移除一个场景掉落
     * @param item
     */
    public removeItem(item: SceneItem): void {
        for (var i: number = 0; i < this._itemList.length; ++i) {
            if (this._itemList[i].index == item.index) {
                this._itemList[i].destroy();
                this._itemList.splice(i, 1);
                break;
            }
        }
    }

    /***
     * 获取目标位置最近的场景掉落
     * @param pos
     * @param range
     */
    public getNearItem(pos: Vector3, range: number): SceneItem {
        var distance: number = 1000;
        var curDis: number;
        var index: number = -1;
        for (var i: number = 0; i < this._itemList.length; ++i) {
            curDis = Vector3.distance(this._itemList[i].transform.position, pos);
            if (curDis < range && curDis < distance) {
                distance = curDis;
                index = i;
            }
        }
        return index == -1 ? null : this._itemList[index];
    }

    public pickItemNearby(camera: Camera, item: SceneItem, range: number = 3): void {
        var pos: Vector3 = item.transform.position;
        var curDis: number;
        var totalGold: number = 0;
        var totalStar: number = 0;
        var itemPos:number;
        var itemTotal:number = 0;
        for (var i: number = 0; i < this._itemList.length; ++i) {
            curDis = Vector3.distance(this._itemList[i].transform.position, pos);
            if (curDis < range) {
                itemTotal += 1;
                itemPos = this._itemList[i].ownerIndex;
                this._itemList[i].onClick();
                itemPos = this._itemList[i].ownerIndex;
                if (this._itemList[i].tableId == 1)
                    totalGold += this._itemList[i].addGold;
                if (this._itemList[i].tableId == 2)
                    totalStar += this._itemList[i].addGold;
            }
        }
        var v2: Vector2 = Utils.worldToScreen(camera, item.transform.position);
        var delay: number = 0;
        if (totalGold > 0 && totalStar > 0) {
            delay = 100;
        }

        this.itemNumDic[itemPos] -= itemTotal;
        if(this.itemNumDic[itemPos] < 0)
            this.itemNumDic[itemPos] = 0;

        console.log("==============debug======", "totalGold:", totalGold, "item:", item)

        if (totalGold > 0) {
            Utils.createNumberText(Math.floor(totalGold).toString(), v2.x, v2.y, "+", false, Drop_Cfg[1].strfont_color);
            GameScene.instance.playEffect(Sceneeffect_Cfg[2].streffect, item.transform.position, 0, true, () => {
                Player.getInstance().refreshGold(Math.floor(totalGold));
            })

        }
        if (totalStar > 0) {
            Laya.timer.once(delay, this, function () {
                Utils.createNumberText(Math.floor(totalStar).toString(), v2.x, v2.y, "+", true, Drop_Cfg[1].strfont_color);
                Player.getInstance().refreshStar(Math.floor(totalStar));
            })
        }
    }
}