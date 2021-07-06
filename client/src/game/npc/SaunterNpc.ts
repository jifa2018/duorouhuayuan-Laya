/***
 * 游荡类型npc
 */
import {NpcBase} from "./NpcBase";
import {MoveController} from "../script/MoveController";
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import PhysicsCollider = Laya.PhysicsCollider;
import {Effect3D} from "../../effect/Effect3D";
import {ResourceManager} from "../../manager/ResourceManager";
import { AnimatorController } from "../script/AnimatorController";
import { RandomMove } from "../ai/RandomMove";
import {Debug} from "../../common/Debug";
import { SoundManager } from "../../manager/SoundManager";
import { Sound_Cfg } from "../../manager/ConfigManager";

export class SaunterNpc extends NpcBase
{
    constructor()
    {
        super();
        this.onLoad();
    }


    private escapeTimes:number;
    private starPos:Vector3;
    /***
     * 开始逃跑
     */
    public escape(hander:Handler):void
    {
        this.changMoveSpeed(10);
        let minNum = 1;
        let maxNum = 3;
        let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
        let value_b = parseInt(value_a);
        console.log("随机逃跑折返次数： " +  value_b);
        this.escapeTimes = value_b;
        this.starPos = this.transform.position.clone();
        Debug.Log("开始逃跑1");
        this.escapeMove(hander);
        Laya.timer.loop(3000, this, this.escapeMove,[hander])
        SoundManager.getInstance().playSound(Sound_Cfg[5].strsound);
        // this.escapeMove();
    }

    /**
     * 每次逃跑随机一条路
     * */
    private escapeMove(hander:Handler):void
    {
        Debug.Log("随机逃跑");
        if(this.escapeTimes <= 0)
        {
            this.clearEscape();
            this.changMoveSpeed(2);
            hander && hander.run();                //this.RangePath();
            console.log("逃跑结束！！！");
            return;
        }
        this.moveTo([this.randomPos()],null);
        this.escapeTimes -= 1;
    }

    private clearEscape():void
    {
        this.isMove = false;
        Laya.timer.clear(this, this.escapeMove);
    }

    /**
     * 随机一个位置
     */
    private randomPos():Vector3
    {
        var x:number = Math.random() + 2 * 2.5 ;
        var z:number = Math.random() + 2 * 2.5;

        var vx:number = Math.random()- 0.5;
        var vz:number = Math.random()- 0.5;

        return new Vector3(vx > 0 ? x : -x + this.starPos.x, 0, vz > 0 ? z : -z + this.starPos.z);
    }

    public onLoad():void
    {
        super.onLoad();
        ResourceManager.getInstance().getResource("res/test/NpcPrefab.lh", Handler.create(this, function (node:Sprite3D) {
            node.transform.localPosition = new Vector3(0,0,0);
            node.transform.position = new Vector3(0,8,0);
            this.sprite3dNode = node;
            this._animator = this.addComponent(AnimatorController);
            this._moveController = this.addComponent(MoveController);
            this._moveController.changSpeed(10);
            // Laya.timer.callLater( this, function () {
            //     this._aiController = this.addComponent(RandomMove);
            // })

            Laya.timer.once(1000, this, this.escape);

            this.addChild(this.sprite3dNode);

            // var d:any = new Effect3D();
            // d.createFollowEffect("res/effect/zhishengji_hit01.lh", node, 0, true);
            //node.addComponent(PhysicsCollider);
            // this.cloneThis(node);
        }))
        // Laya.loader.create("res/npc/Role_yg_01_skin.lh", Handler.create(this, function (node:Sprite3D) {
        //     node = node.clone() as Sprite3D;
        //     node.transform.position = new Vector3(-6, 0.2, 8.7);
        //     this.sprite3dNode = node;
        //     this._moveColtroller = this.addComponent(MoveController);
        //     this.addChild(this.sprite3dNode);
        //
        //     var d:any = new Effect3D();
        //     d.createFollowEffect("res/effect/diren_hit.lh", node, 0, true);
        //     //node.addComponent(PhysicsCollider);
        //    // this.cloneThis(node);
        // }))
    }
    public onMove():void
    {
        super.onMove();
    }
    public onStop():void
    {
        super.onStop();
    }
    public onUpdate():void
    {
        super.onUpdate();
    }
    public onDestroy():void
    {
    }



}