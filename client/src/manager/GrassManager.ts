import {Singleton} from "../common/Singleton";
import { Map_Cfg } from "./ConfigManager";
import { IManager } from "./IManager";

/***
 * 百草屋
 */
export class GrassManager extends Singleton implements IManager
{
    private _lv:number = 5;
    private _mapData:Array<any> = new Array<any>();

    onInit (): void
    {
        
    }

    onUpdata (): void
    {
        
    }

    onDestroy (): void
    {
       
    }

    //返回当前等级
    public GetCurrentLv():number
    {
        //todo
        return this._lv % 10;
    }

    //升级
    public Upgrade():void
    {

    }

    /***
     * 获取地图的全部数据
     * @param mapId
     */
    public getMapData(mapId:number):any
    {
        var data = {};
        var _obj = Map_Cfg;
        for (const key in _obj) {
            if (Object.prototype.hasOwnProperty.call(_obj, key)) {
                const element = _obj[key];
                if(element.mapid == mapId)
                    data[element["mapLevel"]] = element;
            }
        }
        return data;
    }

    public UnLockMap():void
    {

    }



  
  

    
}


  

