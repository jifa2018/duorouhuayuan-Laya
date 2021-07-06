/**
 * @Purpose
 * @Author zhanghj
 * @Date 2020/8/31 10:49
 * @Version 1.0
 */
import Sprite3D = Laya.Sprite3D;
import Scene3D = Laya.Scene3D;
import Tween = Laya.Tween;
import Handler = Laya.Handler;
import {ResourceManager} from "../../manager/ResourceManager";
import Vector3 = Laya.Vector3;
import {Tree} from "../item/Tree";
import {Utils} from "../../utils/Utils";
import Camera = Laya.Camera;
import Point = Laya.Point;
import MouseManager = Laya.MouseManager;
import { GameUIManager } from "../../manager/GameUIManager";
import { StaffTimeView } from "../ui/Staff/StaffTimeView";
import { StaffManager } from "../../manager/StaffManager";
import { Timer } from "../../common/TImer";
import Ease = Laya.Ease;
import {CommonDefine} from "../../common/CommonDefine";
import GameScene from "../scene/GameScene";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";

export class CarEditor {

    private _car:Sprite3D;
    private _curPosX:number;
    private _staffList:Array<number> = new Array<number>();
    private _dragTarget:Sprite3D;
    private _camera:Camera;
    private _scene:Scene3D;
    private _t:Tween = null;
    private _door:Sprite3D;
    private _seat:Array<[number,Boolean]> = new Array<[number,Boolean]>();
    constructor(scene3d:any) {
        this._car = scene3d.getChildByName("bashiche_01") as Sprite3D;
        this._curPosX = this._car.transform.localPositionX;
        this._door = this._car.getChildByName("bashiche_02") as Sprite3D;
        this._door.active = false;
        this._camera = scene3d._cameraPool[0];
        this._scene = scene3d;
        for (let index = 1; index < 5; index++) {
            this._seat.push([index,false]);    
        }
        return;
        //test
        // this.testcar =  StaffManager.getInstance().AddGather(1);
        // this.testcar.onLoad(1);
        // this._car.addChild(this.testcar);
        // this.testcar.transform.localPosition = new Vector3(0,0,0);
        // this.testcar.transform.position = (this._car.getChildByName("point1") as Laya.Sprite3D).transform.position;

    }

    public refreshStaff(testcar:any):void
    {
        this._car.addChild(testcar);
        for (let index = 0; index < this._seat.length; index++) {
            const element = this._seat[index];
            if (!element[1]) {
                testcar.transform.localMatrix = (this._car.getChildByName("point"+ element[0]) as Laya.Sprite3D).transform.localMatrix;
                element[1] = true;
                testcar.Setseat(element[0]);
                break;
            }
        }
        testcar.transform.localRotationEulerY = 90;
    }

    public InitPos():any
    {
        return (this._car.getChildByName("point1") as Laya.Sprite3D).transform.position;
    }

    public screenMove(bHome:boolean, end:number):void
    {
        if(this._t)
        {
            this._t.clear();
        }
        if(this._curPosX > end)
        {
            this._car.transform.scale = new Vector3(-1,1,1);
            this._door.transform.scale = new Vector3(-1,1,1);
        }

        else
        {
            this._car.transform.scale = new Vector3(1,1,1);
            this._door.transform.scale = new Vector3(1,1,1);
        }


        this._door.active = true;

        this._t = Tween.to(this._car.transform, {localPositionX: end}, 1000, Ease.cubicOut, Handler.create(this, function () {
            this._door.active = false;
            this._t = null;
            if(!bHome)
            {
                //开车门动画
                this._t = null;
            }
        }));

        this._curPosX = end;
    }

    private tweenMove()
    {
        var t:Tween;
        t.complete()
    }

    public beginDrag(target:any):void
    {
        if(target.parent instanceof Sprite3D && GameScene.instance.curRollIndex == 1)
        {
            this._dragTarget = target;
            //(target as Gatherman).playAnimation(CommonDefine.ANIMATION_tuozhuai);
            //(target as Gatherman).transform.localRotationEulerY = 180;
        }
    }

    public endDrag():void
    {
        if(!this._dragTarget)   return;
        var pos:Vector3 = (this._dragTarget).transform.position;
        this._scene.addChild(this._dragTarget);
        //let dataid=(this._dragTarget as Gatherman).GetId();
        // GameUIManager.getInstance().showUI(StaffTimeView,Laya.Handler.create(this,(view)=>{
        //     view.SetDataID(dataid);
        // }));
        // (this._dragTarget as Gatherman).playAnimation(CommonDefine.ANIMATION_IDLE);
        // let id = (this._dragTarget as Gatherman).Getseat();
        // for (let index = 0; index < this._seat.length; index++) {
        //     const e = this._seat[index];
        //     if (e[0]==id) {
        //         e[1]=false;
        //         break;
        //     }
        // }
        this._dragTarget = null;
        
        let check={name:"point1"}
        GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, check)
    }

    public onDragMove(e:any):void
    {
        if(!this._dragTarget)   return;

        var pos:Vector3 = (Utils.screenToWorld(new Point(MouseManager.instance.mouseX , MouseManager.instance.mouseY ),
            this._camera,
            0, 88.0));
        //debugger;
        //pos.x += this._dragTarget.transform.position.x;

        (this._dragTarget).transform.position =pos;
    }

    public canMove():boolean
    {
        return this._dragTarget == null;
    }
}