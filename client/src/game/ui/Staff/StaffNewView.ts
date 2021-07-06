import { ui } from "../../../ui/layaMaxUI";
import { Staff_Cfg } from "../../../manager/ConfigManager";
import { Utils } from "../../../utils/Utils";
import { GameData } from "../../data/GameData";
import { Player } from "../../player/Player";
import { GameUIManager } from "../../../manager/GameUIManager";
import { TipViewScene } from "../Common/TipViewScene";
import { UnlockView } from "../Unlock/UnlockView";
import { StaffManager } from "../../../manager/StaffManager";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { ConfirmRepeatedlyView } from "./ConfirmRepeatedlyView";

export class StaffNewView extends ui.view.StaffNewViewUI {
    /**角色数据 */
    private _roleData: number[] = [];
    /**当前角色选中的id */
    private _roleIndex: number = 0;
    /**存储的角色信息 */
    private _roleInfo: any[] = [];
 
    constructor() {
        super();
    }

    onEnable() 
    {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.onInit();
        this.onEvent();
    }

    /**注册事件 */
    private onEvent() { }

    onShow() {
        this.GetRoleMessageList();
    }

    onDisable() {
        this.offAll();
    }
 
    private onInit() 
    {
        //临时初始化数据
        let idunm: number = Utils.GetTableLength(Staff_Cfg);
        let staffunm: number = Staff_Cfg[idunm].staffID;
        for (let i = 1; i <= staffunm; i++) {
            for (let j = 1; j <= idunm; j++) {
                if (Staff_Cfg[j]["staffID"] == i) {
                    this._roleData.push(j);
                    break;
                }
            }
        }
        
        this.LoadInfo();
        this.GetRoleMessageList();
    }

     /**获取当前角色信息列表 */
     private GetRoleMessageList() {
        this.StaffList.array = this._roleData;
        this.StaffList.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
        this.StaffList.vScrollBarSkin = "";
        this.StaffList.selectedIndex = 0;
    }

    /**获得当前角色信息 */
    private SetRoleMessageList(box: Laya.Box, index: number) 
    {
        //角色的名字
        let Name: Laya.Label = box.getChildByName("user_name") as Laya.Label;
        //角色头像
        let head: Laya.Image = box.getChildByName("Icon") as Laya.Image;
        //角色等级
        let Lv: Laya.Label = box.getChildByName("level").getChildByName("user_lv") as Laya.Label;
        //角色介绍
        let userMessage: Laya.Label = box.getChildByName("ui_evaluate") as Laya.Label;
        //状态图标
        let stateImage: Laya.Image = box.getChildByName("ChangStateImage") as Laya.Image;
        //状态按钮
        let userButton: Laya.Button = stateImage.getChildByName("ChangStateButton") as Laya.Button;
        //按钮金币文字
        let goldLabel: Laya.Label = stateImage.getChildByName("ChangStategold") as Laya.Label;
 
        if (!this._roleInfo[index])
            return

        let data = this._roleInfo[index]["id"] > 0 ? this._roleInfo[index]["id"] : this._roleData[index];

        userButton.offAll();
        userButton.on(Laya.Event.CLICK, this,(index)=>{
            this.SureClick(index);
        },[index]);

        userMessage.text = "" + Staff_Cfg[data]["strdeclare"];
        Name.text = Staff_Cfg[data].strname;
        head.skin = Staff_Cfg[data].stricon;

        //是否被雇佣
        if (this._roleInfo[index]["id"] == 0) 
        {
            //没有被雇佣
            Lv.text = Staff_Cfg[data]["lv"];
            goldLabel.text = "" + Staff_Cfg[data]["hiregold"];
            let bool = Staff_Cfg[data]["hiregold"] > Player.getInstance().nGold;
            stateImage.gray = bool;
            userButton.label = bool? "不可雇佣":"可雇佣";
            if (bool) {
                userButton.offAll();
            }
        }
        else 
        {
            Lv.text = Staff_Cfg[this._roleInfo[index]["id"]]["lv"];
            goldLabel.text = "" + Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"];
            //是否满级
            if (Staff_Cfg[this._roleInfo[index]["id"]]["next"] > this._roleInfo[index]["id"]) 
            {
                let bool = Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] > Player.getInstance().nGold;
                stateImage.gray = bool;
                userButton.label = bool? "不可升级":"可升级";
                if (bool) {
                    userButton.offAll();
                }
            }
            else 
            {
                //满级
                userButton.offAll();
                userButton.on(Laya.Event.CLICK, this,(index)=>{
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "员工已满级", false]);
                },[index]);
            }
        }  
    }


    /**确定按钮 */
    private SureClick(index: number) 
    {
        if (!this._roleInfo[index]) return
        //雇佣状态
        if (this._roleInfo[index]["id"] == 0) 
        {
            //雇佣工人并更改金币
            if (!Player.getInstance().canPayGold(Number(Staff_Cfg[this._roleData[index]]["hiregold"]))) {
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
                return;
            }
            //打开二级确认框
            GameUIManager.getInstance().createUI(ConfirmRepeatedlyView, [this._roleData[index], Number(Staff_Cfg[this._roleData[index]]["hiregold"]), Laya.Handler.create(this,()=>{
                Player.getInstance().refreshGold(-Number(Staff_Cfg[this._roleData[index]]["hiregold"]));
            let fun: Function = null;
            switch (Staff_Cfg[this._roleData[index]]["jobID"]) {
                //宣传员
                case 1:
                    GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                        view.Init(3, this._roleData[index], index);
                    }));
                    StaffManager.getInstance().Addpropagandist(this._roleData[index], index);
                break;
                //清洁工
                case 2:
                    GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                        view.Init(1, this._roleData[index], index);
                    }));
                    StaffManager.getInstance().AddDustman(this._roleData[index], index);
                break;
                //摄影师
                case 3:
                    GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                        view.Init(2, this._roleData[index], index);
                    }));
                    StaffManager.getInstance().AddCameraman(this._roleData[index], index);
                break;
            }
            GameUIManager.getInstance().createTopUI(TipViewScene, [null, "员工雇佣成功", false]);
            this.RefreshButtonState();
            this.StaffList.array = this._roleData;
            })]);   
        }
        else 
        {
            if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] <= Player.getInstance().nGold) 
            {
                let gold = Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"];
                GameUIManager.getInstance().createUI(ConfirmRepeatedlyView, [this._roleInfo[index]["id"], gold, Laya.Handler.create(this,()=>{
                    Player.getInstance().refreshGold(-gold);
                    StaffManager.getInstance().upgrade(this._roleInfo[index]["id"],this._roleInfo[index]["id"]+1);
                    this.RefreshButtonState();
                    this.StaffList.array = this._roleData;
                })]);   
            }
            else
            {
                console.log("钱不够！！！！！！！！！！！！！！！");
                return;
            }
        }
    }

    /**刷新按钮状态*/
    private RefreshButtonState() 
    {
        let data = SaveManager.getInstance().GetCache(ModelStorage.Staff);
        this._roleInfo = data == null ? this._roleInfo : data;
    }

    /**读取信息 */
    private LoadInfo() 
    {
        //解锁皮肤的列表
        let value = GameData.RoleInfo;
        if (value) {
            this._roleInfo = value;
        }
    }
}