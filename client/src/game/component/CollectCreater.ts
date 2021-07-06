/**
 * @Purpose 采集物品生成器
 * @Author zhanghj
 * @Date 2020/8/27 16:52
 * @Version 1.0
 */
import Vector3 = Laya.Vector3;
import {Collection_station_Cfg, Map_Cfg, Staff_Cfg} from "../../manager/ConfigManager";
import {Utils} from "../../utils/Utils";
import {GrassManager} from "../../manager/GrassManager";
import {PathManager} from "../../manager/PathManager";

export class CollectCreater {

    private path:Array<Vector3> = new Array<Vector3>();
    private createMaxTime:number;
    private createMinTime:number;

    private mapData;
    private staffData;
    private findData = {};

    /***
     * 初始化
     * @param mapId
     * @param staffId
     */
    public initCreater(mapId:number, staffId:number):void
    {
        this.staffData = Staff_Cfg[staffId];
        this.mapData = Map_Cfg[mapId];
        if(!this.mapData || !this.staffData)
        {
            console.log("采集物品生成器创建失败");
            return;
        }

        this.createMinTime = this.mapData.minimumtime;
        this.createMaxTime = this.mapData.maxtime;

        this.randomCreateItem();
    }

    /***
     * 获取搜寻结果
     */
    public getFindItemData():any
    {
        return Object.assign({}, this.findData);
    }

    /***
     * 清空搜寻结果
     */
    public clearFindItemData():void
    {
        this.findData = {};
    }

    /***
     * 随机时间创建多肉
     */
    private randomCreateItem():void
    {
        var time:number = Math.random() * (this.createMaxTime - this.createMinTime) + this.createMinTime;
        //Laya.timer.once(time * 1000, this, this.onGetTree);
         Laya.timer.once(20 * 1000, this, this.onGetTree);
    }

    /***
     * 时间到, 创建多肉
     */
    private onGetTree():void
    {
        this.randomCreateItem();
        if(this.findData == {})  return;
        var _data = GrassManager.getInstance().getMapData(1);
        //随机出一个等级掉落组
        var curLevel = GrassManager.getInstance().GetCurrentLv();
        curLevel = curLevel == 0 ? 10 : curLevel;
        //这样随机一下能提高最高等级随到的概率
        var rLevel = Math.floor(Math.random() * (curLevel+1) + 1);
        rLevel = rLevel > curLevel ? curLevel : rLevel;
        this.mapData =_data[rLevel];
        //组合权重随机出一个多肉
        var mapItem = this.mapData.strdrop + "|" + this.mapData.strSidgroup;
        var mapWeight = this.mapData.strCweight + "|" + this.mapData.strSweight;

        var arrItem:Array<string> = mapItem.split("|");
        var arrWeight:Array<string> = mapWeight.split("|");

        let nNum = Utils.getWeight(arrWeight);
        var itemId = (arrItem[nNum]);

        var area = this.checkArea(itemId, _data);
        var fPos:Vector3;
        var fArea = area;
        if(area == -1)
        {
            //普通 随机一个区域
            var _area:number = Math.floor(Math.random() * 9) + 1;
            _area = _area == 10 ? 9 : _area;
            var arrGroup = PathManager.getInstance().growCommonArray[1];
            var arrPoint = arrGroup[_area];
            fArea = _area;
            if(arrPoint.length > 1)
            {
                var _r = Math.floor(Math.random() * arrPoint.length)
                _r = arrPoint.length == _r ? _r-1 : _r;
                fPos = arrPoint[_r];
            }else if(arrPoint.length == 1)
            {
                fPos = arrPoint[0];
            }
        }
        else
        {
            //特殊
            // @ts-ignore
            var arrGroup = PathManager.getInstance().growSpecialArray[1];
            fPos = arrGroup[area];
        }

        this.findData["itemId"] = itemId;
        this.findData["pos"] = fPos;
        this.findData["area"] = fArea;
        this.findData["special"] = (area != -1);

    }

    private checkArea(itemId:any, mapData:any):number
    {
        for(var o in mapData)
        {
            if(mapData[o].unlockID == itemId)
            return Number(o);
        }
        return -1;
    }

    /***
     * 清空各种状态
     */
    public clear():void
    {
        Laya.timer.clear(this, this.onGetTree);
        this.mapData = null ;
        this.staffData = null ;
        this.findData = {};
    }
}