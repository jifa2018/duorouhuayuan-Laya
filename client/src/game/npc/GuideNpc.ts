import {NpcBase} from "./NpcBase";
import {MoveController} from "../script/MoveController";
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import {ResourceManager} from "../../manager/ResourceManager";
import { AnimatorController } from "../script/AnimatorController";
import { Utils } from "../../utils/Utils";
import { NpcManager } from "../../manager/NpcManager";
import { BubbleCreater } from "../ui/Bubble/BubbleCreater";
import { GuideAI } from "../ai/GuideAI";

/***
 * 游荡类型npc
 */
export class GuideNpc extends NpcBase
{
    
    constructor() { super(); }

    public createById(tableId:number)
    {
        super.createById(tableId);
        this.clickIndex = 0;
        this.loadModel();
    }

    public loadModel():void
    {
        ResourceManager.getInstance().getResource(this._tableData.strmodelurl, Handler.create(this, (node:Sprite3D)=>{
            if (!node) {
               console.log("NPC模型没有加载完成！");
            }
            this.sprite3dNode = node;
            this.Camera =  Utils.FindTransfrom(this.sprite3dNode,"Prop_xiangji");
            this._animator = this.addComponent(AnimatorController);
            this._moveController = this.addComponent(MoveController);
            Laya.timer.callLater( this, ()=> {
                this._aiController = this.addComponent(GuideAI);
                this._moveController.changSpeed(this.Cruise_speed);     
            });
            this.clickEnable = false;
            this.addChild(this.sprite3dNode);
        }))
    }


    public GetCamera()
    {
        super.GetCamera();
        return this.Camera;
    }

    public ActionDone():void
    {
        super.ActionDone();
        this.clickIndex = 0;
    }

    public clear() {
        this.sprite3dNode.destroy();
        this.removeSelf();
        this._animator.destroy();
        this._moveController.destroy();
        this._aiController.destroy();
        this._animator = null;
        this._moveController = null;
        this._aiController = null;
        BubbleCreater.instance._bubbleList.forEach(element => {
            if (element.owner==this)
               BubbleCreater.instance.removeBubble(element);
        });  
        Laya.timer.clearAll(this);
     }

    public onMove():void
    {
        super.onMove();
    }

    public onStop():void
    {
        super.onStop();
        this.clear();
        NpcManager.getInstance().recoverNpc("NpcBase",this);
    }
    
    public onUpdate():void
    {
        super.onUpdate();
    }

    public onDestroy():void  { }
}