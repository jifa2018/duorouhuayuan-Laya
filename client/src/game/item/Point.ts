/***
 * 种植点
 */
import Handler = Laya.Handler;
import { Potted } from "./Potted";
import { Utils } from "../../utils/Utils";
import { Succulentpoint_Cfg } from "../../manager/ConfigManager";
import { PottedStruct } from "./PottedStruct";
import { TreeGrowProgressBar } from "../ui/ProgressBar/TreeGrowProgressBar";
import { SaveManager } from "../../manager/SaveManager";

export class Point {
    /** 种植点名字 */
    public Name: string = "";
    /** 点位当前使用的花盆索引 */
    public UseIndex:number = 0;
    /** 点位扩容数据 */
    public ExpansionNum: number = 0;
    /** 点位备用的花盆数据 */
    public PointDataList: { [id: number]: PottedStruct } = {};
    /** 点位备用的花盆数据 */
    public PotList:{ [id: number]: Potted } = {};
    public _num = 0;

    public growProBar:TreeGrowProgressBar;
    /***
     * 根据数据创建花盆
     * @param data
     * @param complate
     */
    public initPoint(data: any, complate: Handler): void {
        if (!data) {
            complate && complate.runWith(null);
            return;
        }
        this.Name = data.Name ||"";
        this.UseIndex = data.UseIndex;
        this.ExpansionNum = data.ExpansionNum||0;
        let tList = data.PointDataList||{};
        this.PointDataList = {};
        for (const key in tList) {
            var pottedStruct = new PottedStruct();
            pottedStruct.unPackData(tList[key]);
            this.PointDataList[key] = (pottedStruct)
        }
    }

    /**
     * 打包花盆数据
     */
    public packData(PointData?:any,index?:any): any {
        var point = {};
        point["Name"] = this.Name;
        point["UseIndex"] = this.UseIndex;
        point["ExpansionNum"] = this.ExpansionNum;
        point["PointDataList"] = {};
        for (const key in this.PotList) {
            if(this.PotList[key]){
                if(PointData&&index == key){
                    point["PointDataList"][key] = PointData;
                }else{
                    point["PointDataList"][key] = this.PotList[key].packData(this.Name);
                }
            }
        }
        this.PointDataList = point["PointDataList"];
        SaveManager.getInstance().SetPointCache("point_" + this.Name,point);
    }

    /** 获得点位当前最大坑位 */
    public GetPotMaxPost() {
        let tBasePost = Succulentpoint_Cfg[this.Name].ministorage || 0;
        return tBasePost + this.ExpansionNum;
    }

    /** 获得点位当前最大坑位 */
    public DelPot(index) {
        if(!this.PotList[index])
            return;
        if(index == this.UseIndex){
            this.UseIndex = -1;
        }
        this.PotList[index].destroy();
        delete this.PotList[index];
    }

    public destroy(destroyChild?: boolean) {
        this.destroy(destroyChild);
    }
}