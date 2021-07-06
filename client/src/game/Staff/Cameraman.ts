import { StaffBase } from "./StaffBase";
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import { ResourceManager } from "../../manager/ResourceManager";
import { AnimatorController } from "../script/AnimatorController";

export class Cameraman extends StaffBase  
{
    public _takePhotoTime:number=0;
    constructor() { super();}

    public onLoad(tableId:number):void
    {
        super.onLoad(tableId);
        this._takePhotoTime = this._tableData.takepicture;
        ResourceManager.getInstance().getResource(this._tableData.strmodle, Handler.create(this, (node:Sprite3D)=>{
            this.sprite3dNode = node;
            this._animator = this.addComponent(AnimatorController);
            this.addChild(this.sprite3dNode);
            this._loadDone = true;
        }))
    }

    public onStop():void{}

    //public onUpdate():void{  super.onUpdate();}

    public onDestroy():void{}

   //返回秒
   public GetTakePhotoTime():number
   {
       return this._tableData.takepicture; 
   }

}