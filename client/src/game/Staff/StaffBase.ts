import Sprite3D = Laya.Sprite3D;
import Handler = Laya.Handler;
import Pool = Laya.Pool;
import {AnimatorController} from "../script/AnimatorController";
import { Staff_Cfg } from "../../manager/ConfigManager";
import { MoveController } from "../script/MoveController";
import { GameData } from "../data/GameData";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";

export class StaffBase extends Sprite3D  
{
    protected _animator:AnimatorController;
    protected _moveController:MoveController;
    protected _type:number;
    protected _lv:number;
    protected _id:number;
    protected _loadDone:Boolean = false;

    public _tableData:any;
    public sprite3dNode:Sprite3D;
    public clsName:string;

    private upgradeing:Boolean = false;
    private upgradeTime:number = 0;
 

    constructor() {super();}

    public onLoad(tableId:number):void
    {
        this.createById(tableId);
    }

    public onStop():void{}


    public onUpdate(){
        if ( this._loadDone) {
            if (this.upgradeing)
            {
                this.upgradeTime = this.upgradeTime - Laya.timer.delta/1000;
                if (this.upgradeTime<=0) 
                {
                    this.upgradeing = false;
                    this.upgrade(this._id+1);
                    GameData.upgrade(this._id-1,this._id);
                }
            }
        }
    }

    public onDestroy():void{}

    public onClick():void{}

    private createById(tableId:number):void
    {
        this._tableData = Staff_Cfg[tableId];
        if(!this._tableData)
        {
            console.log("員工表中没有id = " + tableId.toString());
            return;
        }
        this._id = tableId;
        this._lv =  this._tableData.lv;
        this._type =this._tableData.jobID;
    }

   //#region 属性
    public GetType():number{
        return this._type;
    }

    public GetId():number{
        return this._id;
    }

    public Getgrade():number
    {
        return this._lv;
    }

    public SetupgradeTime(time:number):void
    {
        this.upgradeTime = time;
    }
    //#endregion

    public cloneThis(sp3d:Sprite3D):void
    {
        this.sprite3dNode = sp3d.clone() as Sprite3D;
        this._animator = this.addComponent(AnimatorController);
        this.addChild(this.sprite3dNode);
    }

    public moveTo(path:any, complate:Handler)
    {
        if(this._moveController)
            this._moveController.moveTo(path, complate);
    }

    public stopMove()
    {
        if(this._moveController)
            this._moveController.stopMove();
    }

    public recover():void
    {
        this.sprite3dNode.destroy();
        this.sprite3dNode = null;
        Pool.recover(this.clsName, this);
    }

    public playAnimation(name:string)
    {
        this._animator.play(name);
    }

    public upgrade(tableId:number)
    {
        this.upgradeing = false;
        this._id = tableId;
        this._tableData = Staff_Cfg[tableId];
        this._lv =  this._tableData.lv;
        this._type =this._tableData.jobID;
        switch (this._type) 
        {
            case 2:
                GEvent.DispatchEvent(GacEvent.OnUpdata_dustmantime);
            break;
            case 3:
                GEvent.DispatchEvent(GacEvent.OnUpdata_cameramantime); 
            break;
        }
    }

    // public ChangUpGrade()
    // {
    //     this.upgradeTime = Staff_Cfg[this._id].cd*60;
    //     this.upgradeing = true;
    // }
}