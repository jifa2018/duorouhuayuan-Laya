import { AIBase } from "./AIBase";
import Vector3 = Laya.Vector3;
import Handler = Laya.Handler;
import GameScene from "../scene/GameScene";
import { NpcMoveState } from "../npc/npcstate/NPCMoveState";
import { NpcActionState } from "../npc/npcstate/NpcActionState";
import { NpcDefaultState } from "../npc/npcstate/NpcDefaultState";
import { PathManager } from "../../manager/PathManager";
import { BubbleCreater } from "../ui/Bubble/BubbleCreater";
import { Utils } from "../../utils/Utils";
import { BubbleType, Bubble } from "../ui/Bubble/Bubble";
import { CommonDefine } from "../../common/CommonDefine";
import { SoundManager } from "../../manager/SoundManager";
import { NpcDriveAwayState } from "../npc/npcstate/NpcDriveAwayState";
import { NpcStateType } from "../npc/npcstate/NPCBaseState";
import { Bottom } from "../item/Bottom";
import { Path_Cfg, Sound_Cfg, Constant_Cfg } from "../../manager/ConfigManager";
import { NpcManager } from "../../manager/NpcManager";
import { Potted } from "../item/Potted";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";

export class GuideAI extends AIBase 
{
    private CurrentActionId:number;  //当前行为Id
    private NorDic:IMap<(p:any)=>void> = {};
    private CurrentPathId:number = 1;
    private pickUpMoneyIndex:number = 0;  //捡钱次数
    private ActionPointIndex:number ; //  走到行为路径的Index

    //初始化行为组
    private initActionMap(): void 
    {
        this.NorDic[1] = this.payMoney;          
        this.NorDic[2] = this.creatBubble;        
        this.NorDic[3] = this.creatMoreBubble;      
        this.NorDic[4] = this.pickUpMoney;
        this.NorDic[5] = this.makeTrouble;
    }

    public onEnable(): void 
    {
        super.onEnable();
        this.initActionMap();
        this.CurrentPathId = 2;
        if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
            this.LookAt(Path_Cfg[this.CurrentPathId].strsucculentpoint);
        }
        GEvent.RegistEvent(GacEvent.GuideCreateBubInScene,Laya.Handler.create(this, this.payMoney));
      
    }

    public onDisable() { 
        super.onDisable();  
        GEvent.RemoveEvent(GacEvent.GuideCreateBubInScene, Laya.Handler.create(this, this.payMoney));
    }

    public onUpdate()  
    {
        super.onUpdate();
        if (this.character) 
        {
            if (this.character.type == 1  || this.character.type == 2) 
            {
                if (NpcManager.getInstance().nordriveAwayVisitors(this.character.transform.position)) 
                    this.character.changMoveSpeed(this.character._tableData.harass_speed);
                else
                    this.character.changMoveSpeed(this.character.Cruise_speed);
            }
        }
    }

    public onMove(): void 
    {
        super.onMove();
        let state:NpcMoveState = new NpcMoveState(this);
        this.character.ChangeState(state);
    }

    // 指定或随机一条路走
    public RangePath():void
    {
        if (Path_Cfg[this.CurrentPathId].strLinkPathID==0)
        {
            this.onStop();
            return;
        }
        this.GetNextPath();
        this.onMove();
    }

    /**
     * 走着走着就没了
     */
    public RuntoStop():void
    {
        let state:NpcDefaultState = new NpcDefaultState(this);
        this.character.ChangeState(state);
        this.GetNextPath();
        let path = this.Currentpath;
        this.GetNextPath();
        path = path.concat(this.Currentpath);
        this.character.moveTo(path,null);
    }

    public GetNextPath():void
    {
        if (Path_Cfg[this.CurrentPathId].strLinkPathID==0)
        {
            this.onStop();
            return;
        }
        BubbleCreater.instance._bubbleList.forEach(element => {
            if (element.owner==this.character)
               BubbleCreater.instance.removeBubble(element);
        }); 
        let content:string[] = Path_Cfg[this.CurrentPathId].strLinkPathID.split(",");
        let index;
        if (content.length == 2) 
        {
            let strProb:string[] = Path_Cfg[this.CurrentPathId].strProb.split(",");
            if (strProb.length == 2) 
            {
                let bu:Bottom = GameScene.instance.getBottomByName(Path_Cfg[this.CurrentPathId].strStatue)
                let cost:number = 0;
                if (bu!=null && bu!=undefined) {
                    cost = bu.getWeight();
                }
                let num = parseInt(strProb[0])+ parseInt(strProb[1])  + cost;
                let minNum = 1;  let maxNum = num;
                let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
                let value_b = parseInt(value_a);   // console.log(value_b);  
                if (value_b>(parseInt(strProb[0]) + cost)) 
                    index = content[1];
                else
                    index = content[0];
            }
            this.CurrentPathId = index;
            this.Currentpath = PathManager.getInstance().getPathByName(Path_Cfg[this.CurrentPathId].strPathName);    
        } 
        else
        {
            this.CurrentPathId = Path_Cfg[this.CurrentPathId].strLinkPathID;
            let pathName = Path_Cfg[this.CurrentPathId].strPathName;
            this.Currentpath = PathManager.getInstance().getPathByName(pathName);
        }
    }

    //走到行为点上
    public RangeActionPath():void
    {  
         if (Path_Cfg[this.CurrentPathId].strLinkPathID==0) 
         {
             this.onStop();
             return;
         }
         this.CurrentPathId = Path_Cfg[this.CurrentPathId].strLinkPathID;
         let pathName = Path_Cfg[this.CurrentPathId].strPathName;
         this.Currentpath = PathManager.getInstance().getPathByName(pathName).concat();
         let minNum = 1;   let maxNum = this.Currentpath.length-1;
         let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
         let value_b = parseInt(value_a);
         //console.log(value_b);
         this.ActionPointIndex = value_b;
         let vector3 = this.Currentpath[this.ActionPointIndex];
         this.Currentpath = [vector3];//    this.Currentpath.splice(0,this.ActionPointIndex);
         this.onMove();
    }

    //有捣乱者不做行为
    public ActionDonePath():void
    {  
        if (this.character.type != 1 && this.character.type != 2) return;
        BubbleCreater.instance._bubbleList.forEach(element => {
            if (element.owner==this.character)
               BubbleCreater.instance.removeBubble(element);
        });  
        this.character.changMoveSpeed(this.character.Cruise_speed);
        this.RangePath();
    }

    // 走完一段路 看看接下来该干什么
    public isKeepUpMove(): void 
    {
        super.isKeepUpMove();
        let type = Path_Cfg[this.CurrentPathId].next;
        if (type>3) {
            this.SwitchAction(type);
        }
        else
        {
            switch (type) 
            {
                case -1:
                    this.onStop();
                break;
                case 1:
                    this.RangePath();
                break;
                case 2:
                    this.RangePath();
                break;
                case 3:
                    this.RangeActionPath();
                break;
            }
        }    
    }

    // 判断各种行为是否可以执行
    public SwitchAction(type:number): void 
    {
        if (Path_Cfg[this.CurrentPathId].strsucculentpoint) 
        {
            let isHave = GameScene.instance.getBottomByPoint(Path_Cfg[this.CurrentPathId].strsucculentpoint);
            if (isHave) 
            {
                let Marplot:Boolean = this.isContainMarplot(this.character.transform.position);
                if (Marplot && this.character.type != 4 && this.character.type != 3 )
                {
                    if (this.character.GetType()!= NpcStateType.DriveAway) {
                        let state:NpcDriveAwayState = new NpcDriveAwayState(this);
                        this.character.ChangeState(state);
                    }
                }
                else
                {
                    if (this.character.type == 3) 
                    {
                        if (!this.character.GetstealGold(2))
                        {
                            //this.ActionDonePath();
                            this.RangePath();
                            return;
                        } 
                    }
                    let state:NpcActionState = new NpcActionState(this,type);
                    this.character.ChangeState(state);
                }
            }
            else
            {
                //this.ActionDonePath();
                this.RangePath();
                return;
            }
        }
    }

    public onStop(): void 
    {
        super.onStop();
        let state:NpcDefaultState = new NpcDefaultState(this);
        this.character.ChangeState(state);
        this.character.onStop();
        //Debug.Log("AI结束");
    }

     // 执行各种行为
    public onPay(type:number): void 
    {
        super.onPay(type);
        let stractionIds:string[] = this.character._tableData.stractionId.split("|");//行为组
        let stractionProbs:string[] = this.character._tableData.stractionProb.split("|");//概率
        let id:string[] = stractionIds[type-4].split(",");
        let prob:string[] = stractionProbs[type-4].split(",");
        if (prob.length ==1 && prob[0] == "0") {
            //this.ActionDonePath();
            this.RangePath();
            return;
        }
        else
        {
            let index = Utils.getWeight(prob);
            this.CurrentActionId = parseInt(id[index]);
            let handler = this.NorDic[this.CurrentActionId];
            handler && handler.call(this);
        }
        if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
            this.LookAt(Path_Cfg[this.CurrentPathId].strsucculentpoint);
        }
    }

    //#region  行为
    private creatBubble(): void 
    {
        let bubble:Bubble = BubbleCreater.instance.createBubble(2, GameScene.instance.camera,BubbleType.Normal,this.character,
            Laya.Handler.create(this, ()=>{
                BubbleCreater.instance.removeBubble(bubble);
                //Debug.Log("执行完成CreatBubble！！！ 获得金币或其他资源"); //TODO  表中读取掉落
                this.CreatGold(Constant_Cfg[2].value,true);
                //Laya.timer.clear(this,this.ActionGo_on1);
                this.PlayAnimation(CommonDefine.ANIMATION_TakePhoto);
                let camera = this.character.GetCamera();
                camera.active = true;
                SoundManager.getInstance().playSound(Sound_Cfg[4].strsound);
                Laya.timer.once(6000,this,()=>{
                    camera.active = false;
                    this.RangePath();

                }  );//this.ActionDonePath
            }));
    }

    private creatMoreBubble(): void   //土豪气泡
    {
         //此处因传进去type  区分普通和土豪
        this.character.clickEnable= true;
        let bubble:Bubble = BubbleCreater.instance.createBubble(3, GameScene.instance.camera,BubbleType.Wealthy,this.character,
            Laya.Handler.create(this, ()=>{
                this.character.onClick();       
                BubbleCreater.instance.removeBubble(bubble);  
            },null, false));
    }

    private payMoney():void
    {
        //Debug.Log("执行了一个具体的行为，比如撒钱！！！");
        this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
        SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
        Laya.timer.once(1000,this,()=>{    
            this.CreatGold(Constant_Cfg[1].value,false);
        });
        Laya.timer.once(2000,this,this.RangePath); //this.ActionDonePath;
    }

    private pickUpMoney():void
    {
        //Debug.Log("执行了一个具体的行为，捡钱！！！");
        Utils.setModelAlpha(this.character.sprite3dNode,1);
        let bubble:Bubble = BubbleCreater.instance.createBubble(4, GameScene.instance.camera,BubbleType.pickMoney,this.character,
            Laya.Handler.create(this, ()=>{
                this.character.onClick();   
                BubbleCreater.instance.removeBubble(bubble);
            }));
        this.Action_PickMoney(bubble);
    }

    /**
     * 循环10次捡钱
     * @param bubble 捡钱气泡
     */
    private Action_PickMoney(bubble:any):void
    {
        if (this.character.clickIndex>= 10) return;
                   
        let ok = this.character.GetstealGold(2);
        if (ok) 
        {
            this.character.stealGold(2,Handler.create(this,(pick)=>{
                if (pick)
                {
                    this.pickUpMoneyIndex++;
                    if (this.pickUpMoneyIndex>=10) 
                    {
                        BubbleCreater.instance.removeBubble(bubble);
                        this.RuntoStop();
                        this.character.disappear();
                        return;
                    }
                    this.Action_PickMoney(bubble);
                    return;
                }
                else
                {
                    this.character.SetModelAlpha(0.2);
                    BubbleCreater.instance.removeBubble(bubble);
                    this.RangePath();
                }
            }));
        }
        else
        {
            this.character.SetModelAlpha(0.2);
            BubbleCreater.instance.removeBubble(bubble);
            this.RangePath();
        }
       
    }

    public ClickTypeThreeNpc(index:number):void
    {
        super.ClickTypeThreeNpc(index);
        this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
        SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
        Laya.timer.once(1000,this,()=>{    
            this.CreatGold(Constant_Cfg[3].value,false);
        });
        if (index>=10) {
            this.character.clickEnable= false;
            this.RangePath();
            this.character.ActionDone();
            //Debug.Log("执行完成CreatMoreBubble！！！ 获得金币或其他资源"); //TODO  表中读取掉落
            return;
        }
    }

    private makeTrouble():void
    {
        //Debug.Log("执行了一个具体的行为，比如捣乱！！！");
        this.character.clickEnable= true;
        this.PlayAnimation(CommonDefine.ANIMATION_makeTrouble);
        SoundManager.getInstance().playSound(Sound_Cfg[3].strsound);
        let bubble = BubbleCreater.instance.createBubble(5, GameScene.instance.camera,BubbleType.Noise,this.character,
            Laya.Handler.create(this, ()=>{
                this.character.onClick();       
                BubbleCreater.instance.removeBubble(bubble);
            },null, false));
    }

    public ClickTypeFourNpc():void
    {
        super.ClickTypeFourNpc();
        BubbleCreater.instance._bubbleList.forEach(element => {
            if (element.owner==this.character)
               BubbleCreater.instance.removeBubble(element);
        });  
        this.RuntoStop();
    }

    /**
     * 产生星星   产生金币
     * @param cost_scale 价值比例
     * @param isStar 是否产生星星
     */
    private CreatGold(cost_scale:number,isStar:Boolean):void
    {
        let offset = new Vector3(Math.random(),Math.random(),Math.random());
        Vector3.scale(offset,0.8,offset);
        Vector3.add(offset,this.character.transform.position,offset);
        let Potted:Potted = GameScene.instance.getBottomByPoint(Path_Cfg[this.CurrentPathId].strsucculentpoint);
        if (Potted) {
            let gold = Potted.gold;//基本金币
            let addition = Math.sqrt(Potted.TreeCount/Potted.Capacity)+Potted.ExtraPrefer()+Potted.BorderMultiScore();
            let getGold = Math.floor(gold * addition);
            if (getGold != 0) 
                GameScene.instance.createSceneItem(1, offset,getGold);   
            
            if (isStar) 
                GameScene.instance.createSceneItem(2, offset);     
        }
    }

    //#endregion  
} 

  // 限定值类型的MAP
  interface IMap<V>{
    [index:string] : V;
}


// 限定key为数字并限定值类型的MAP
interface INMap<V>{
    [index:number] : V;
}