import {NpcBase} from "../game/npc/NpcBase";
import Pool = Laya.Pool;
import {VisitorNpc} from "../game/npc/VisitorNpc";
import {Singleton} from "../common/Singleton";
import { Utils } from "../utils/Utils";
import Vector3 = Laya.Vector3;
import { Constant_Cfg } from "./ConfigManager";
import { IManager } from "./IManager";
import { NpcCreater } from "../game/component/NpcCreater";
import { GameUIManager } from "./GameUIManager";
import { TipViewScene } from "../game/ui/Common/TipViewScene";
import { GuideNpc } from "../game/npc/GuideNpc";

export class NpcManager extends Singleton implements IManager
{
    public NpcArray:Array<NpcBase> = new Array<NpcBase>();
    public MaxNpcCount:number = 30;
    //public CollectNpcArray:Array<CollectNpc> = new Array<CollectNpc>();
    public npcCreater:NpcCreater;
    
    onInit (): void{
        this.npcCreater = new NpcCreater();
    }

    onUpdata (): void
    {
        if (this.NpcArray.length != null) {
            this.NpcArray.forEach(element => {
                element.onUpdate();
            });
        }

        if (this.npcCreater) 
            this.npcCreater.stopCreater = this.NpcArray.length>=this.MaxNpcCount ? false:true;
    }

    onDestroy (): void
    {
        if (!this.npcCreater) return;
        this.npcCreater.clearCreater();
        this.npcCreater = null;
    }

    public initnpcCreater()
    {
        if (this.npcCreater) {
            this.npcCreater.initCreater();
            this.npcCreater.stop = true;
        }
    }

    public destroynpcCreater()
    {
        if (!this.npcCreater) return;
        this.npcCreater.stop = false;
    }

    public createNpc(tableId:number):NpcBase
    {
        if (this.NpcArray.length>=this.MaxNpcCount) 
        {
            GameUIManager.getInstance().createTopUI(TipViewScene, [null, "游客最多30个！", false]);
            return;
        } 
        var npc:VisitorNpc = Pool.getItemByClass("NpcBase", VisitorNpc);
        npc.createById(tableId);
        this.NpcArray.push(npc);
        //Debug.Log(this.NpcArray.length);
        return npc;
    }

    public createGuideNpc(tableId:number):NpcBase
    {
        var npc:GuideNpc = Pool.getItemByClass("NpcBase", GuideNpc);
        npc.createById(tableId);
        this.NpcArray.push(npc);
        return npc;
    }

    public recoverNpc(clsName:string, cls:any)
    {
       // cls.recover();
       //  cls.clear();
        Utils.remove<NpcBase>(this.NpcArray,cls);
        //Debug.Log(this.NpcArray.length);
        Pool.recover(clsName, cls);
    }
      
     /**
     * 是否包含捣乱者
     * @param pos
     */
    public isContainMarplot(pos:Vector3):Boolean
    {
        let hasElement = false;
        this.NpcArray.forEach(element => {
            if (element.type==4)
            {
                if (Vector3.distance(pos,element.transform.position)< Constant_Cfg[7].value) 
                {
                    hasElement = true;
                    return true;
                }
            }
        });
        return hasElement;
    }


    /**
     * 捣乱者范围内的游客
     * @param pos
     */
    public driveAwayVisitors(pos:Vector3):Array<NpcBase>
    {
        let array:Array<NpcBase> = new Array<NpcBase>();
        this.NpcArray.forEach(element => {
            if (element.type!=4 && element.type!=3)
            {
                if (Vector3.distance(pos,element.transform.position)< Constant_Cfg[7].value) 
                {
                    array.push(element);
                }
            }
        });
        return array;
    }


      /**
     * 捣乱者范围内的游客
     * @param pos
     */
    public nordriveAwayVisitors(pos:Vector3):Boolean
    {
        for (let index = 0; index <  this.NpcArray.length; index++) {
            const element =  this.NpcArray[index];
            if (element.type==4 && !element.Fadeaway) 
            {
                let dis = Vector3.distance(pos,element.transform.position);
                if (dis < Constant_Cfg[7].value) 
                {
                    return true;
                }
            }
        }
        return false;
    }
}


     // public createNpc(clsName:string, cls:any):NpcBase
    // {
    //     var npc:NpcBase = Pool.getItemByClass(clsName, cls);
    //     npc.
    //     // var d:PhysicsCollider =  npc.addComponent(PhysicsCollider)
    //     // d.colliderShape = new MeshColliderShape();
    //     npc.clsName = clsName;
    //     return npc;
    // }

      
     /**
     * 是否包含捣乱者
     * @param decorateId
     */
    // public isContainMarplot(actionSite:number):Boolean
    // {
    //     let hasElement = false;
    //     this.NpcArray.forEach(element => {
    //         if (element.type==4 && element.GetActionSite()==actionSite)
    //         {
    //             hasElement = true;
    //         }
    //     });
    //     return hasElement;
    // }

        // public CreateCollectNpc(tableId:number):CollectNpc{
    //     var npc:CollectNpc = Pool.getItemByClass("CollectNpc", CollectNpc);
    //     npc.createById(tableId);
    //     this.CollectNpcArray.push(npc);
    //     Debug.Log(this.CollectNpcArray.length);
    //     return npc;
    // }

