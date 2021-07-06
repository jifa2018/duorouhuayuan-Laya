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
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
import { NpcBase } from "../npc/NpcBase";

export class NorVisitorAI extends AIBase 
{
    private CurrentActionId:number;  //当前行为Id
    private NorDic:IMap<(p:any)=>void> = {};//Map<number,Laya.Handler> = new Map<number,Laya.Handler>();
    //private EliDic:IMap<(p:any)=>void> = {};
    private CurrentPathId:number = 1;
    private pickUpMoneyIndex:number = 0;  //捡钱次数
    private delaytime:number =10; //不做行为的回调时间
    private ActionPointIndex:number ; //  走到行为路径的Index

    public init(npc:NpcBase):void
    {
        super.init(npc);
        this.initActionMap();
        let pathName = Path_Cfg[this.CurrentPathId].strPathName;
        this.Currentpath = PathManager.getInstance().getPathByName(pathName);
        if(this.character.isMove || this.character.GetType() == NpcStateType.Action)
            return;
        this.onMove();
    }

    //初始化行为组
    private initActionMap(): void 
    {
        this.NorDic[1] = this.payMoney;          
        this.NorDic[2] = this.creatBubble;        
        this.NorDic[3] = this.creatMoreBubble;      
        this.NorDic[4] = this.pickUpMoney;
        this.NorDic[5] = this.makeTrouble;
    }

    public OnUpdate()  
    {
        super.OnUpdate();
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
                if (bu) {
                    cost = bu.getWeight();
                }
                //let num = parseInt(strProb[0])+ parseInt(strProb[1])  + cost;
                //let minNum = 1;  let maxNum = num;
                //let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
                //let value_b = parseInt(value_a);   // console.log(value_b);  
                // if (value_b>(parseInt(strProb[0]) + cost)) 
                //     index = content[1];
                // else
                //     index = content[0];
                 if (cost>0) 
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
        let ageCount = 0;
          if (SaveManager.getInstance().GetCache(ModelStorage.AgeNpcCount)) 
             ageCount = SaveManager.getInstance().GetCache(ModelStorage.AgeNpcCount)
        if (type-4 == 0  && ageCount<10) 
        {
            this.payMoney();
            SaveManager.getInstance().SetAgeNpcCountCache(ageCount+1);
        }else
        {
            let index = Utils.getWeight(prob);
            if (parseInt(id[index]) == 0) {
                this.RangePath();
                return;
            }
            else
            {
                this.CurrentActionId = parseInt(id[index]);
                let handler = this.NorDic[this.CurrentActionId];
                handler && handler.call(this);
            }
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
                this.CreatGold(2,true);
                //Laya.timer.clear(this,this.ActionGo_on1);
                this.PlayAnimation(CommonDefine.ANIMATION_TakePhoto);
                let camera = this.character.GetCamera();
                camera.active = true;
                SoundManager.getInstance().playSound(Sound_Cfg[4].strsound);
                this.StopAutoDoneAction();
                Laya.timer.once(6000,this,()=>{
                    camera.active = false;
                    this.RangePath();
                }  );//this.ActionDonePath
            }));
        this.OpenAutoDoneAction(this.delaytime,[bubble],false,false);    
        //Laya.timer.once(this.delaytime,this,this.ActionGo_on1,[bubble]);
    }

    private creatMoreBubble(): void   //土豪气泡
    {
         //此处因传进去type  区分普通和土豪
        this.character.clickEnable= true;
        let bubble:Bubble = BubbleCreater.instance.createBubble(3, GameScene.instance.camera,BubbleType.Wealthy,this.character,
            Laya.Handler.create(this, ()=>{
                this.character.onClick();       
                BubbleCreater.instance.removeBubble(bubble);  
                //Laya.timer.clear(this,this.ActionGo_on2);
                this.StopAutoDoneAction();
            },null, false));
        //Laya.timer.once(this.delaytime,this,this.ActionGo_on2,[bubble]);       
        this.OpenAutoDoneAction(this.delaytime,[bubble],true,false);   
    }

    private payMoney():void
    {
        //Debug.Log("执行了一个具体的行为，比如撒钱！！！");
        this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
        SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
        Laya.timer.once(1000,this,()=>{    
            this.CreatGold(1,false);
        });
        Laya.timer.once(2000,this,this.RangePath); //this.ActionDonePath;
    }

    private pickUpMoney():void
    {
        //Debug.Log("执行了一个具体的行为，捡钱！！！");
        Utils.setModelAlpha(this.character.sprite3dNode,1);
        let bubble:Bubble = null;
        if (!this.character.isHaveProgressBar()) {
            bubble = BubbleCreater.instance.createBubble(4, GameScene.instance.camera,BubbleType.pickMoney,this.character,
                Laya.Handler.create(this, ()=>{
                    this.character.onClick();   
                    BubbleCreater.instance.removeBubble(bubble);
                })); 
        }
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
                        if (bubble) 
                            BubbleCreater.instance.removeBubble(bubble);
                        this.RuntoStop();
                        this.character.disappear();
                        return;
                    }
                    this.Action_PickMoney(bubble);
                    return;
                }
                else
                    this.tool_DeteleBubble(bubble);
            }));
        }
        else
            this.tool_DeteleBubble(bubble);
    }

    private tool_DeteleBubble(bubble:any)
    {
        this.character.SetModelAlpha(0.2);
        if (bubble) 
            BubbleCreater.instance.removeBubble(bubble);
        this.RangePath();
    }

    public ClickTypeThreeNpc(index:number):void
    {
        super.ClickTypeThreeNpc(index);
        this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
        SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
        Laya.timer.once(1000,this,()=>{    
            this.CreatGold(1,false);
        });
        //Laya.timer.clear(this,this.ActionGo_on2);
        this.StopAutoDoneAction();
        if (index>=10) {
            this.character.clickEnable= false;
            //Laya.timer.clear(this,this.ActionGo_on2);
            //this.ActionDonePath();
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
        // this.DriveAway();    
        // Laya.timer.loop(50, this, this.DriveAway);
        this.OpenAutoDoneAction(Constant_Cfg[13].value,[bubble],false,true);  
    }

    public ClickTypeFourNpc():void
    {
        super.ClickTypeFourNpc();
        this.StopAutoDoneAction();
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
            let getGold = 0; 
            /**
             *  1 代表打赏
             *  2 代表拍照 
             */
           if (cost_scale==1) 
           {
            let minNum = -Constant_Cfg[21].value*10;  let maxNum = Constant_Cfg[21].value*10;
            let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
            let value_b = Number(value_a)/10;
            getGold = Potted.giveReward()+ Potted.giveReward() * value_b;
           }
           else
           {
            let minNum = -Constant_Cfg[22].value*10;  let maxNum = Constant_Cfg[22].value*10;
            let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
            let value_b = Number(value_a)/10;
            getGold = Potted.takePhoto_outputGold()+ Potted.takePhoto_outputGold() * value_b;
           }
           getGold = Math.floor(getGold);   
            if (getGold != 0) 
                GameScene.instance.createSceneItem(1, offset,getGold);   
            
            if (isStar) 
                GameScene.instance.createSceneItem(2, offset);     
        }
    }

    /**
     * 某个动作持续多久无玩家操作自动跳过
     * @param delaytime 持续时间
     * @param param1 参数1
     * @param param2 参数2
     * @param param3 参数3
     */
    private OpenAutoDoneAction(delaytime:number,param1:any,param2:any,param3:any):void
    {
        Laya.timer.once(delaytime*1000,this,this.AutoDoneAction,[param1,param2,param3]);
    }

    private StopAutoDoneAction():void
    {
        Laya.timer.clear(this,this.AutoDoneAction);
    }

    private AutoDoneAction(param1:any,param2:any,param3:any):void
    {
        BubbleCreater.instance.removeBubble(param1);
        if (param2) 
            this.character.clickEnable= false;
       
        if (param3)
        {
            this.ClickTypeFourNpc();
            this.character.disappear();
        }  
        else
            this.RangePath();// this.ActionDonePath()
        
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


//找到最近的路走
// public goAwaryPath():void
// {  
//     super.goAwaryPath();
//     let pathName = PathManager.getInstance().getPathByDistance(this.character.transform.position);
//     for (const key in Path_Cfg) {
//         if (Path_Cfg.hasOwnProperty(key)) {
//             const element = Path_Cfg[key];
//             if (element.strPathName == pathName) {
//                 this.CurrentPathId = parseInt(key);
//             }
//         }
//     }
//     this.Currentpath = PathManager.getInstance().getPathByName(pathName);
//     this.onMove();
// }

// let pathName = Path_Cfg[this.CurrentPathId].strPathName;
// this.Currentpath = PathManager.getInstance().getPathByName(pathName).concat();
// this.Currentpath =this.Currentpath.splice(this.ActionPointIndex,this.Currentpath.length-1);
        //  let pathName = Path_Cfg[this.CurrentPathId].strPathName;
        //  this.Currentpath = PathManager.getInstance().getPathByName(pathName).concat();
        //  this.Currentpath =this.Currentpath.splice(this.ActionPointIndex,this.Currentpath.length-1);
        // this.GetNextPath();
        // this.character.moveTo(this.Currentpath,null);


            // public onEnable(): void 
    // {
    //     super.onEnable();
    //     this.initActionMap();
    //     //console.log("NorVisitorAI+++"   + "名字："+ this.character._tableData.strname+"     类型："+ this.character.type);
    //     let pathName = Path_Cfg[this.CurrentPathId].strPathName;
    //     this.Currentpath = PathManager.getInstance().getPathByName(pathName);
    //     if(this.character.isMove || this.character.GetType() == NpcStateType.Action)
    //         return;
    //     this.onMove();
    //     GEvent.RegistEvent(GacEvent.OnUpdate,Laya.Handler.create(this,this.OnUpdate))
    // }