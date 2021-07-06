import Vector3 = Laya.Vector3;
import { PotState } from "../GameDefine";

export class PottedStruct {
    public containerId:number = 0;
    public rotateY:number;
    public quality:number;
    public treeArray:Array<TreeStruct>;

    public GrowStartTime:number = 0;
    public GrowTime:number = 0;
    public State = PotState.None;

    public unPackData(data:any):void
    {
        this.containerId = data.containerId;
        this.treeArray   = data.treeArray;
        this.rotateY = data.rotateY;
        this.quality = data.quality;

        this.GrowStartTime = data.GrowStartTime;
        this.GrowTime = data.GrowTime;
        this.State = data.State;
    }

}
export class TreeStruct{
    public treeId:number = 0;
    public pos:Vector3;
    public scale:number = null;
    public rotate:number = null;
    public isPlant:boolean=true;
}