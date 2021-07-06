import {IAI} from "./IAI";
import Vector3 = Laya.Vector3;
import Script3D = Laya.Script3D;
import {NpcBase} from "../npc/NpcBase";
import { NpcManager } from "../../manager/NpcManager";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";

export class AIBase extends Script3D implements IAI 
{
    public character:NpcBase;
    public Currentpath:Array<Vector3>;

    public init(npc:NpcBase):void
    {
        this.character = npc;
        GEvent.RegistEvent(GacEvent.OnUpdate,Laya.Handler.create(this,this.OnUpdate));
    }

    public OnUpdate()  {}

    public isKeepUpMove(){}

    public onMove():void{}

    public onPay(type:number):void{}

    public onStop():void{}

    public ClickTypeThreeNpc(index:number):void{}
    public ClickTypeFourNpc():void{}
    public goAwaryPath():void{}
    public ActionDonePath():void {}

    protected isContainMarplot(pos:Vector3):Boolean
    {
       return NpcManager.getInstance().isContainMarplot(pos);
    }

    protected LookAt(pointName:string):void
    {
        this.character.LookAtPoint(pointName);
    }

    protected PlayAnimation(AniName:string)
    {
        this.character.playAnimation(AniName);
    }
}


    //赶跑
    // public DriveAway():void
    // {
    //   let NpcArray:Array<NpcBase> = NpcManager.getInstance().driveAwayVisitors(this.character.transform.position);
    //       NpcArray.forEach(element => {
    //           if (element.GetType()!= NpcStateType.DriveAway) {
    //                 element.changMoveSpeed(element._tableData.harass_speed);
    //             //   let state:NpcDriveAwayState = new NpcDriveAwayState(element._aiController);
    //             //   element.ChangeState(state);
    //           }
    //   });
    // }    
// public onEnable():void
    // {
    //     super.onEnable();    
    // }

    // public onDisable() { super.onDisable(); }

    // public onDestroy() { super.onDestroy(); }

    // public onUpdate()  
    // {
    //      super.onUpdate();
    // }