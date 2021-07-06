import Script3D = Laya.Script3D;
import Handler = Laya.Handler;
import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import Animator = Laya.Animator;
import {CommonDefine} from "../../common/CommonDefine";
import {NpcBase} from "../npc/NpcBase";
import { Debug } from "../../common/Debug";
import { Path_Cfg, Constant_Cfg } from "../../manager/ConfigManager";
import Tween = Laya.Tween;
import Timer = Laya.Timer;

export class MoveController extends Script3D {
    /*插件控制的实例*/
    private _character: NpcBase;
    private _isMove: boolean;
    private speed: number = 2;
    private _currentPathStep: number = 0;
    private _offset: number;
    /*行走路径*/
    private _path: Array<any>;
    private _complate: Handler;
    private _finishArgs: any;
    private _keepMove: boolean;

    private _curDistance: number = 0;    // 當前位置
    private _distance: number = 0;       // 整個路徑的距離

    private _dirationX:number = 0;
    private _dirationZ:number = -1;

    private static target: Vector3 = new Vector3();

    constructor() {
        super();
    }

    public onAwake() {
        super.onAwake();
    }

    public onEnable() {
        super.onEnable();
        this.character = this.owner as NpcBase;
    }

    public onDisable() {
        super.onDisable();
    }

    public onDestroy() {
        super.onDestroy();
    }

    private get character():NpcBase
    {
        if(!this._character)
            this.character = this.owner as NpcBase;
        return this._character;
    }

    private set character(c:NpcBase)
    {
        this._character = c;
    }

    public moveTo(wayPoint: any, complate: Handler = null, offset: number = 0) {
        wayPoint = wayPoint.concat();
        this._path = wayPoint;
        //增加空数组判断
        if (this._path.length <= 0) {
            complate && complate.run(); 
            return;
        }
        this._finishArgs = wayPoint.callback;
        this._offset = offset;
        this._complate = complate;
        this._currentPathStep = 0;
        // if(offset != 0)
        //     this.offsetWayPoint()
        if (!this.isMove) {
            this.isMove = true;
        } else {
            this._keepMove = true;
        }

        this._path.unshift(this.character.transform.position.clone());
        this._curDistance = 0;
        this._distance = 0;
        for (var a = 0; a < this._path.length - 1; a++) {
            this._distance += Vector3.distance(this._path[a], this._path[a + 1]);
        }

        // this.calcSpeed();
    }

    public changSpeed(num: number): void {
        if (this.speed == num) return;
        this.speed = num;
        // Vector3.scale(this.tempSpeedVec, this.speed , this.speedVec);
        this.isMove = this.isMove;
        //Debug.Log("修改速度值为： " + this.speed);
    }

    //
    // public get speed():number
    // {
    //     return this._speed;
    // }
    //
    // public set speed(val:number)
    // {
    //     this._speed = val;
    // }

    public get isMove(): boolean {
        return this._isMove;
    }

    public set isMove(bool: boolean) {
        if (bool) {
            Laya.timer.loop(1, this, this.update);
            this._isMove = true;
            if (this.speed <= Constant_Cfg[12].value) 
            {
                this.character.playAnimation(CommonDefine.ANIMATION_WAKL);
            } 
            else if(this.speed > Constant_Cfg[12].value )
            {
                this.character.playAnimation(CommonDefine.ANIMATION_Run);
            }
        } else {
            Laya.timer.clear(this, this.update);
            this._isMove = false;
            this.character.playAnimation(CommonDefine.ANIMATION_IDLE);
        }
    }

    /***
     * 停止移动
     */
    public stopMove() {
        // this._complate && this._complate.runWith(this._finishArgs);
        if (!this._keepMove)
            this.isMove = false;
    }

    /***
     * 更新函数
     */
    private update() {
        if (!this._isMove) return;

        this._curDistance += this.speed * Laya.timer.delta / 1000;

        if (this._curDistance > this._distance) {
            this._curDistance = this._distance;
            this.isMove = false;
            this.character.transform.position = this._path[this._path.length - 1];
            this._complate && this._complate.run();
            return;
        }

        let lastPoint = 0;
        let dis = 0;
        for (var a = 0; a < this._path.length - 1; a++) {
            lastPoint = dis;
            dis += Vector3.distance(this._path[a], this._path[a + 1]);
            if (dis > this._curDistance) {
                let section = this._curDistance - lastPoint;
                let dir = new Vector3(0, 0, 0);
                Vector3.subtract(this._path[a + 1], this._path[a], dir);
                Vector3.normalize(dir, dir);
                Vector3.scale(dir, section, dir);

                var fin = new Vector3(0, 0, 0);
                Vector3.add(this._path[a], dir, fin);
                this.character.transform.position = fin;

                this.calcOwnerAngleBySpeed(dir.x, dir.z);
                break;
            }

            // if (this.checkArrived())
            // {
            //     //this.isMove = false;
            //     this.nextPoint();
            // }
        }
    }

        // private nextPoint()
        // {
        //     this._currentPathStep += 1;
        //     if(this._path.length <= this._currentPathStep)
        //     {
        //
        //         this.stopMove();
        //         this._complate && this._complate.run();
        //         return;
        //     }
        //     this.calcSpeed();
        //     this._keepMove = false;
        // }

        /**
         * 检查是否到达
         * */
        // private checkArrived():boolean
        // {
        //     if(Vector3.distance(this.character.transform.position, this._pathTarget) < 0.1)
        //         return true;
        //     return false;
        // }

        /***
         * 计算速度矢量
         */
        //运动方向矢量，计算过程变量
        // private _derectVec:Vector3 = new Vector3();
        // private _pathTarget:Vector3 = new Vector3();
        // private speedVec:Vector3 = new Vector3();
        // private tempSpeedVec:Vector3 = new Vector3();
        // private calcSpeed()
        // {
        //     var targetPos:Vector3 = this._path[this._currentPathStep];
        //
        //     this._pathTarget.x = targetPos.x;
        //     this._pathTarget.y = targetPos.y;
        //     this._pathTarget.z = targetPos.z;
        //
        //     this._derectVec.x = this._pathTarget.x - this.character.transform.position.x;
        //     this._derectVec.y = this._pathTarget.y - this.character.transform.position.y;
        //     this._derectVec.z = this._pathTarget.z - this.character.transform.position.z;
        //
        //     Vector3.normalize(this._derectVec, this.tempSpeedVec);
        //     Vector3.scale(this.tempSpeedVec, this.speed , this.speedVec);
        //
        //     this.calcOwnerAngleBySpeed(this._derectVec.x, this._derectVec.z);
        // }

        /***
         * 设置转向
         */
        private calcOwnerAngleBySpeed(disX:number,disZ:number)
        {
            let roleSpeed = 5;
            // console.log("Math.atan2(disX, disZ) * 180 /Math.PI = " + Math.atan2(disX, disZ) * 180 /Math.PI);
            // console.log("this.character.transform.localRotationEulerY = " + this.character.transform.localRotationEulerY);
            // Tween.to(this.character.transform, {"localRotationEulerY":Math.atan2(disX, disZ) * 180 /Math.PI},100);

            this._dirationX = this._dirationX + (disX - this._dirationX) * Laya.timer.delta / 1000 * roleSpeed;
            this._dirationZ = this._dirationZ + (disZ - this._dirationZ) * Laya.timer.delta / 1000 * roleSpeed;

            this.character.transform.localRotationEulerY = Math.atan2(this._dirationX, this._dirationZ) * 180 /Math.PI;
        }

        // /**
        //  * 重置
        //  */
        // private clear()
        // {
        //     this._complate = null;
        // }
        //
        // /**
        //  * 偏移路径点
        //  */
        // private offsetWayPoint():void
        // {
        //     for(var i:number = 0; i < this._path.length; ++i)
        //     {
        //         this._path[i].x =+ this._offset;
        //         this._path[i].z =+ this._offset;
        //     }
        // }

}