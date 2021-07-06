import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import Tween = Laya.Tween;
import GameScene from "../scene/GameScene";
import {ResourceManager} from "../../manager/ResourceManager";
import Pool = Laya.Pool;
import {Drop_Cfg} from "../../manager/ConfigManager";
import {Utils} from "../../utils/Utils";
import {SceneItemCreater} from "./SceneItemCreater";


export class SceneItem extends Sprite3D
{
    public pos:Vector3;
    private itemModel:Sprite3D = null;
    private _tableId:number = 0;
    private _tableData:any;
    public  index:number = 0;
    public ownerIndex:number;

    public addGold:number;
    private _alpha:number;
    private _complate:Function;

    constructor() {
        super();
    }

    public init(tableId:number, position:Vector3, handler:Function, price:number = 1, ownerPos:number = 0):void
    {
        this._tableId = tableId;
        this.ownerIndex = ownerPos;
        this._tableData = Drop_Cfg[tableId];
        this.pos = position;
        this.addGold = price;
        this._complate = handler;
        if(!this.itemModel)
        {
            this.loadModel();
        }
        else
        {
            this.doMove();
            handler();
        }
    }

    // public setPosition(position:Vector3):void
    // {
    //
    // }

    public loadModel():void
    {
        ResourceManager.getInstance().getResource(this._tableData.strmodel, Handler.create(this, this.onLoaded));
    }

    public get tableId():number
    {
        return this._tableId;
    }

    public onClick():void
    {
        //console.log("点击了金币");
        Tween.to(this.transform.position,{y:this.transform.position.y + 2, update:new Handler(this, function () {
                this.transform.position = this.transform.position;
            })}, 200, null);
        Laya.timer.loop(50, this, this.onHide);
    }

    private onHide()
    {
        this._alpha -= 0.1;
        Utils.setModelAlpha(this, this._alpha);
        if(this._alpha <= 0)
        {
            Laya.timer.clear(this, this.onHide);
            //todo
            SceneItemCreater.getInstance().removeItem(this);
        }
    }

    public recover():void
    {
        Pool.recover("SceneItem" + this._tableId.toString(), this);
    }

    private onLoaded(sp3d:Sprite3D):void
    {
        this.itemModel = sp3d;
        sp3d.transform.localPosition = new Vector3(0,0.3,0);
        this.addChild(sp3d);
        this.doMove();
        this._complate();
    }

    private doMove():void
    {
        this._alpha = 1;
        Utils.setModelAlpha(this, 1);
        this.transform.position = this.pos;
        var _x:number = this.transform.position.x;
        var _y:number = this.transform.position.y;
        GameScene.instance.scene3d.addChild(this);
        var offset:number = Math.random() * 0.8;


        offset = Number(offset.toFixed(1));
        Tween.to(this.transform.position, {x:_x-offset, y:_y+1, update:new Handler(this, function () {
                this.transform.position = this.transform.position;
            })},200,null,Handler.create(this, function () {

            Tween.to(this.transform.position, {x:_x-offset*2, y:_y, update:new Handler(this, function () {
                    this.transform.position = this.transform.position;
                })},200, null,Handler.create(this, function () {
            }))
        }))
    }

    public destroy(destroyChild?: boolean) {
        this.removeSelf();
        Pool.recover("SceneItem" + this._tableId.toString(), this);
    }

}