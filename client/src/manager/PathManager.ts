/**
 * @Purpose 场景路径获取 每个场景都需要初始化
 * @Author zhanghj
 * @Date 2020/8/10 15:53
 * @Version 1.0
 */
import Scene3D = Laya.Scene3D;
import Vector3 = Laya.Vector3;
import { Dictionary } from "../utils/Dictionary";
import { Singleton } from "../common/Singleton";
import GameScene from "../game/scene/GameScene";
import { IManager } from "./IManager";
import {Utils} from "../utils/Utils";

export class PathManager extends Singleton implements IManager
{
    private pathDic: Dictionary = new Dictionary();
    private collectDIc: Dictionary = new Dictionary();
    private collectIdleDIc: Dictionary = new Dictionary();
    private collectPathDic: Dictionary = new Dictionary();

    private collectArray:Array<Vector3> = null;
    public growSpecialArray:Array<any> = new Array<any>();
    public growCommonArray:Array<any> = new Array<any>();

    onInit (): void
    {
       this.initPath();
       //this.initCollect();
       this.initCollectIdle();
       // this.initGrowPoint();
       this.initCollectPath();
    }

    onUpdata (): void
    {
        
    }

    onDestroy (): void
    {
       
    }

    /***
     * 初始化场景中的路径点
     * @param scene3dNode
     */
    public initPath(): void {
        this.pathDic.clear();
        var childrenNode: any = GameScene.instance.scene3d.getChildByName("path");
        if (!childrenNode) {
            console.log("路径点为空")
            return;
        }
        var num: number = childrenNode.numChildren;
        for (var i: number = 0; i < num; ++i) {
            var childNode: any = childrenNode.getChildAt(i);
            var arrPath: Array<Vector3> = new Array<Vector3>();
            for (var j: number = 0; j < childNode.numChildren; ++j) {
                arrPath.push(childNode.getChildAt(j).transform.position);
            }
            this.pathDic.set(childNode.name, arrPath);
        }
    }

     /***
     * 初始化场景中采集常规转圈路径点
     * @param scene3dNode
     */
    public initCollectPath(): void {
        this.collectPathDic.clear();
        var childrenNode: any = GameScene.instance.scene3d.getChildByName("scenes1_caijipoint");
        if (!childrenNode) {
            console.log("路径点为空")
            return;
        }

        var num: number = childrenNode.numChildren;
        for (var i: number = 0; i < 10; ++i) {
            var childNode: any = childrenNode.getChildAt(i);
            var arrPath: Array<Vector3> = new Array<Vector3>();
            for (var j: number = 0; j < childNode.numChildren; ++j) {
                arrPath.push(childNode.getChildAt(j).transform.position);
            }
            this.collectPathDic.set(childNode.name, arrPath);
        }
      
    }

    /***
     * 初始化场景中的路径点
     * @param scene3dNode
     */
    public initCollect(): void {
        this.collectDIc.clear();
        var childrenNode: any = GameScene.instance.scene3d.getChildByName("caijipath").getChildByName("scene1");
        if (!childrenNode) {
            console.log("路径点为空")
            return;
        }
        var num: number = childrenNode.numChildren;
        for (var i: number = 0; i < num; ++i) {
            var childNode: any = childrenNode.getChildAt(i);
            this.collectDIc.set(childNode.name, childNode.transform.position);
        }
    }

    public initGrowPoint():void
    {
        for(var i:number = 1; i < 2; ++i)
        {
            var childrenNode: any = GameScene.instance.scene3d.getChildByName("scenes" + i.toString() + "_caijipoint");
            var pt = childrenNode.getChildByName("pt");
            var num: number = pt.numChildren;
            var arr:Array<any> = new Array<any>();
            for (var j: number = 0; j < num; ++j) {

                var arrPT:Array<any> = new Array<any>();
                var s = pt.getChildAt(j);
                for(var k=0; k<s.numChildren; ++k)
                {
                    arrPT.push(s.getChildAt(k).transform.position);
                }
                arr.push(arrPT);
            }

            this.growCommonArray[i] = arr;

            var ts = childrenNode.getChildByName("ts");
            var num: number = ts.numChildren;
            var arrTs:Array<Vector3> = new Array<Vector3>();
            for (var j: number = 0; j < num; ++j) {
                arrTs.push(ts.getChildAt(j).transform.position);
            }
            this.growSpecialArray[i] = arrTs;
        }

    }

      /***
     * 初始化场景中采集员休息点
     * @param scene3dNode
     */
    public initCollectIdle(): void {
        this.collectIdleDIc.clear();
        var childrenNode: any = GameScene.instance.scene3d.getChildByName("rest area");
        if (!childrenNode) {
            console.log("路径点为空")
            return;
        }
        var num: number = childrenNode.numChildren;
        for (var i: number = 0; i < num; ++i) {
            var childNode: any = childrenNode.getChildAt(i);
            this.collectIdleDIc.set(childNode.name, [childNode.transform.position,false]);
        }
    }

    /**
     * 获取路径点
     * @param name
     */
    public getPathByName(name: string): any {
        return this.pathDic.has(name) ? this.pathDic.get(name) : [];
    }

    /**
     * 获取收集点
     * @param name
     */
    public getCollectByName(name: string): any {
        return this.collectDIc.has(name) ? this.collectDIc.get(name) : [];
    }

    /**
     * 获取采集常规转圈路径点
     * @param name
     */
    public getCollectPathByName(name: string): any {
        name = "path" + name;
        return this.collectPathDic.has(name) ? this.collectPathDic.get(name) : [];
    }

    /**
     * 获取收集点
     * @param name
     */
    public getCollectIdleByName(name: number): any {
        if (this.collectIdleDIc.has(name.toString())) {
            let path = this.collectIdleDIc.get(name);
            if (path[1])
                return this.getCollectIdleByName(name+1);
            else
            {
                path[1] = true;
                return path[0];
            }
        }
        return null;
    }

    

    public getCollectIdleClear(pos: Vector3)
    {
        for (const key in this.collectIdleDIc.items) {
            if (this.collectIdleDIc.items.hasOwnProperty(key)) {
                const element = this.collectIdleDIc.items[key];
                if (Vector3.equals(element[0],pos)) {
                    element[1] = false;
                   
                }
            }
        }
    }

    /**
     * 获取全部收集点
     * @param name
     */
    public getAllCollect(): Array<Vector3> {
        if(!this.collectArray)
            this.collectArray = Utils.formatObject2Array(this.collectDIc.items);
        return this.collectArray;
    }

    /***
     * 获取目标点最近的点
     * @param pos
     */
    public getPathByDistance(pos: Vector3): string {
        var dis: number = 1000;
        var name: string;
        var _dis: number;
        var posPoint: Vector3;
        for (const key of Object.keys(this.pathDic.items)) {
            if (this.pathDic.items.hasOwnProperty(key)) {
                posPoint = this.getPathByName(key)[0];
                _dis = Vector3.distance(pos, posPoint);
                if (_dis < dis) {
                    dis = _dis;
                    name = key;
                }
            }
        }
        return name;
    }

    /**获取目标点最近的点
     * @param collect
     */
    public getCollectByDistance(pos: Vector3,list:Array<string>): string {
        var dis: number = 1000;
        var name: string;
        var _dis: number;
        var posPoint;
        for (const key of Object.keys(this.collectDIc.items)) {
            if(list.indexOf(key)>-1) continue;
            if (this.collectDIc.items.hasOwnProperty(key)) {
                posPoint = this.getCollectByName(key);
                _dis = Vector3.distance(pos, posPoint);
                if (_dis < dis && _dis > 0.1) {
                    dis = _dis;
                    name = key;
                }
            }
        }
        return name;
    }

    /**获得 */
    public getCollectWallName(){
        return this.collectDIc.items
    }
}
