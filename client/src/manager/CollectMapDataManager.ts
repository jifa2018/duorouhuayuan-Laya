/**
 * @Purpose 采集地图数据存储器
 * @Author zhanghj
 * @Date 2020/9/2 16:07
 * @Version 1.0
 */
import {Singleton} from "../common/Singleton";
import Scene3D = Laya.Scene3D;
import {Utils} from "../utils/Utils";
import Sprite3D = Laya.Sprite3D;
import { SaveManager, ModelStorage } from "./SaveManager";

export class CollectMapDataManager extends Singleton{

    private _mapData = [];
    private _scene3d:Scene3D;
    constructor() {
        super();
        this._mapData[1] = [];
    }

    public init(scene3d:Scene3D):void
    {
        var str = SaveManager.getInstance().GetCache(ModelStorage.mapData);
        if(str)
        {
            var js = JSON.parse(str);
            var arr1:Array<any> = new Array<any>();
            for(var o in js)
            {
                var tempArr:Array<any> = new Array<any>();
                if (js[o] instanceof Object){

                    for(var i in js[o]){
                        tempArr[i] = js[o][i];
                    }
                    arr1[Number(o)] = tempArr;
                }else{
                    arr1[Number(o)] = js[o];
                }
            }
             this._mapData = arr1;
        }
        this._scene3d = scene3d;
        this.refreshMapData();
    }

    public refreshMapData()
    {
        var node = this._scene3d;//.getChildByName("Object3");
        if(!node)   return;
        // var mapdata = this._mapData[1];
        // if(!mapdata)    return;
        var nodeName:string;
        var child:Sprite3D;
        for (var i:number = 1; i < 11; ++i)
        {
            nodeName = "1_" + i.toString() + "_collectpoint";
            child = node.getChildByName(nodeName) as Sprite3D;
            if(!child)  continue;
            if(this._mapData[1][i])
            {
                //此点已解锁
                this.setLockState(1, i, true);
            }
            else
            {
                //此点未解锁
                this.setLockState(1, i, false);
            }
        }
    }

    public getMaxMapLevel(mapId:number):number
    {
        if(!this._mapData[mapId])
            return 0;
        return this._mapData[mapId][this._mapData[mapId].length - 1];
    }

    public unLockMapData(mapId:number, openArea:number):void
    {
        // var mapId:number = data.id;
        // var openArea:number = data.area;
        if(!this._mapData[mapId])
            this._mapData[mapId] = [];
        this._mapData[mapId][openArea] = openArea ;

        this.setLockState(mapId, openArea, true);
        this.saveData();
    }

    private setLockState(mapId:number, area:number, bUnLock:boolean = false):void
    {
        // if(!this._mapData[mapId] || !this._mapData[mapId][area])
        //     return;
        // var node = this._scene3d.getChildByName("Object3");
        // if(!node)   return;
        var nodeName:string = mapId.toString() + "_" + area.toString() + "_collectpoint";
        var child:Sprite3D = this._scene3d.getChildByName(nodeName) as Sprite3D;
        if(!child)
            return;
        var lock:Sprite3D = child.getChildByName("suo") as Sprite3D;
        if(!lock)
            return;
        if(!bUnLock)
        {
            Utils.setModelbrightness(child, 0.5);
            Utils.setModelbrightness(lock, 1);
        }
        else
        {
            lock.active = false;
            Utils.setModelbrightness(child, 1);
        }
    }

    public getLock(name:string):boolean
    {
        var mapId:number = Number(name.substr(0, name.indexOf("_")));
        var area:number  = Number(name.substr(name.indexOf("_")+1, name.lastIndexOf("_")-2));
        if(!this._mapData[mapId] || !this._mapData[mapId][area])
            return false;
        return true;
    }

    public saveData():void
    {
        var arr = {};
        for(var o in this._mapData)
        {
            if (this._mapData[o]) {

                if (this._mapData[o] instanceof Array) {
                    let oTemp = {};
                    for (var key in this._mapData[o]) {
                        oTemp[key] = this._mapData[o][key];
                    }
                    arr[o] = oTemp;
                } else {
                    arr[o] = this._mapData[o];
                }
            }
        }

        let str = JSON.stringify(arr);
        SaveManager.getInstance().SetmapDataCache(str);
    }

}