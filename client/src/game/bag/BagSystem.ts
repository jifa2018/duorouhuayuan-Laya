/**
 * @Purpose 背包系统
 * @Author zhanghj
 * @Date 2020/8/25 14:48
 * @Version 1.0
 */
import {Singleton} from "../../common/Singleton";
import {Constant_Cfg, Succulent_Cfg} from "../../manager/ConfigManager";
import {Utils} from "../../utils/Utils";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";

export class BagSystem extends Singleton
{
    private itemArr:Array<any> = new Array<any>();

    constructor() {
        super();
        var data = SaveManager.getInstance().GetCache(ModelStorage.bagsystem);
        if(!data)
        {
            // this.addItem(10001, 1);
            // this.addItem(10002, 1);
            // this.addItem(10003, 1);
            // this.addItem(10004, 1);
            // this.addItem(10005, 1);
            // this.addItem(10006, 1);
            // this.addItem(10007, 1);
            //
            // this.addItem(30001, 1);
            // this.addItem(30002, 1);
            // this.addItem(30003, 1);
            // this.addItem(10001, 1);
            // this.addItem(10002, 1);
            // this.addItem(10003, 1);
            // this.addItem(10004, 1);
            // this.addItem(10005, 1);
            // this.addItem(10006, 1);
            // this.addItem(10007, 1);
            //
            // this.addItem(30001, 1);
            // this.addItem(30002, 1);
            // this.addItem(30003, 1);
            // this.addItem(10001, 1);
            // this.addItem(10002, 1);
            // this.addItem(10003, 1);
            // this.addItem(10004, 1);
            // this.addItem(10005, 1);
            // this.addItem(10006, 1);
            // this.addItem(10007, 1);
            //
            // this.addItem(30001, 1);
            // this.addItem(30002, 1);
            // this.addItem(30003, 1);
            // this.addItem(10001, 1);
            // this.addItem(10002, 1);
            // this.addItem(10003, 1);
            // this.addItem(10004, 1);
            // this.addItem(10005, 1);
            // this.addItem(10006, 1);
            // this.addItem(10007, 1);
            //
            // this.addItem(30001, 1);
            // this.addItem(30002, 1);
            // this.addItem(30003, 1);
            // this.addItem(10001, 1);
            // this.addItem(10002, 1);
            // this.addItem(10003, 1);
            // this.addItem(10004, 1);
            // this.addItem(10005, 1);
            // this.addItem(10006, 1);
            // this.addItem(10007, 1);
            //
            // this.addItem(30001, 1);
            // this.addItem(30002, 1);
            // this.addItem(30003, 1);

            for (const key in Constant_Cfg[17].value) {
                if(Number(key) % 2 == 0)
                    continue;
                this.addItem(Number(Constant_Cfg[17].value[key]), Number(Constant_Cfg[17].value[Number(key)+1]));
            }

        }
        else
        {
            this.itemArr = JSON.parse(data);
        }
    }
    /***
     * 根据数据初始化背包
     * @param data
     */
    public initBag(data:any):void
    {
        //todo
    }

    /**
     * 添加物品
     * @param itemId
     * @param itemNumber
     */
    public addItem(itemId:number, itemNumber:number):void
    {
        if(itemNumber <= 0) return;
        var type:number = this.getItemType(itemId);
        this._add(type, itemId, itemNumber);

        this.packData();
    }

    /**
     * 删除物品
     * @param itemId
     * @param itemNumber
     */
    public delItem(itemId:number, itemNumber:number):void
    {
        if(!this.canDel(itemId, itemNumber, true))
        {
            console.log("背包中没有此物品");
        }
    }

    /**
     * 是否可删除
     * @param itemId
     * @param itemNumber
     * @param bDel
     */
    public canDel(itemId:number, itemNumber:number, bDel:boolean):boolean
    {
        var type:number = this.getItemType(itemId);
        for(var i:number = 0; i < this.itemArr[type].length; ++i)
        {
            if(this.itemArr[type][i].itemId == itemId)
            {
                if(this.itemArr[type][i].itemNum < itemNumber)
                    return false;
                if(bDel)
                {
                    if(this.itemArr[type][i].itemNum > itemNumber)
                        this.itemArr[type][i].itemNum -= itemNumber;
                    else
                        this.itemArr[type].splice(i,1);

                    this.packData();
                }
                return true;
            }
        }
        return false;
    }

    /***
     * 根据类型返回背包数据
     * @param type
     */
    public getItemByType(type:number):any
    {
        if(!this.itemArr[type]) return null;
        return this.itemArr[type];
    }
    /***
     * 打包存储
     */
    public packData():any
    {
        //var d = Utils.getJsonByArray2(this.itemArr);
        var d = JSON.stringify(this.itemArr);
        SaveManager.getInstance().SetBagSystemCache(d);
    }

    /**
     * 内部添加
     * @param type
     * @param itemId
     * @param itemNumber
     * @private
     */
    private _add(type:number, itemId:number, itemNumber:number):void
    {
        if(!this.itemArr[type]) this.itemArr[type] = new Array();
        var haveItem:boolean = false;
        for(var i:number = 0; i < this.itemArr[type].length; ++i)
        {
            if(this.itemArr[type][i].itemId == itemId)
            {
                this.itemArr[type][i].itemNum += itemNumber;
                haveItem = true;
            }
        }
        if(!haveItem)
        {
            var itemObj:item = new item();
            itemObj.itemId = itemId;
            itemObj.itemNum = itemNumber;
            this.itemArr[type].push(itemObj);
        }
    }

    /**
     * 获取道具类型
     * @param itemId
     */
    private getItemType(itemId:number):number
    {
        return Succulent_Cfg[itemId].type;
    }
}

class item {
    public itemId:number;
    public itemNum:number;
}