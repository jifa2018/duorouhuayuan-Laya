import { ui } from "../../../ui/layaMaxUI";
import { Share_Cfg, Staff_Cfg } from "../../../manager/ConfigManager";
import { StaffManager } from "../../../manager/StaffManager";
import { Time } from "../../../common/Time";
import { Utils } from "../../../utils/Utils";
import { Timer } from "../../../common/TImer";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Player } from "../../player/Player";
import { GameData } from "../../data/GameData";
import { TipViewScene } from "../Common/TipViewScene";
import { Debug } from "../../../common/Debug";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { ViewManager } from "../../../manager/ViewManager";
import { UnlockView } from "../Unlock/UnlockView";
import { GacEvent } from "../../../common/GacEvent";
import { GEvent } from "../../../common/GEvent";
import { DataLog } from "../../../common/DataLog";
import { GamePoint } from "../../GameDefine";
import { MyPlayer } from "../../MyPlayer";
import { EffectManager } from "../../../effect/EffectManager";

/**
 * 主界面
 */
export class StaffView extends ui.view.StaffViewUI {
    /**角色数据 */
    private _roleData: number[] = [];
    /**当前角色选中的id */
    private _roleIndex: number = 0;
    /**存储的角色信息 */
    private _roleInfo: any[] = [];
    /**当前星星数 */
    private _starNum: number = 500;
    /**循环时间 */
    private timeVoid: void = null;

    constructor() {
        super();
        this.createView(Laya.loader.getRes("view/StaffView.json"));
        Laya.loader.getRes("res/atlas/gameui/staff.atlas");
    }


    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.onInit();
        this.onEvent();

    }

    onShow() {
        this.GetRoleMessageList();
    }

    onDisable() {
        this.offAll();
        this.ui_end_button.offAll();
        GEvent.RemoveEvent(GacEvent.RefreshUserInfo, Laya.Handler.create(this, this.GetRoleMessageList));
    }
    /**初始化数据（临时） */
    private DataInit() {
        for (let i = 0; i < this._roleInfo.length; i++) {
            if (this._roleInfo[i]["updateState"] > 0) {
                this.UpdateTime();
                break;
            }
        }
    }

    private onInit() {
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
        this.DataInit();
        this.GetRoleMessageList();
        this.TimeRefresh();
    }

    /**注册事件 */
    private onEvent() {
        this.ui_end_button.on(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(StaffView);
            // EffectManager.getInstance().BtnEffect(this.ui_end_button);
        });
        GEvent.RegistEvent(GacEvent.RefreshUserInfo, Laya.Handler.create(this, this.GetRoleMessageList));
    }



    /**获取当前角色信息列表 */
    private GetRoleMessageList() {
        // this.varxml.array= this._roleData;
        // this.ui_user_list.visible=false;
        this.ui_user_list.array = this._roleData;
        this.ui_user_list.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
        this.ui_user_list.vScrollBarSkin = "";
        this.ui_user_list.selectedIndex = 0;
    }

    /**获得当前角色信息 */
    private SetRoleMessageList(box: Laya.Box, index: number) {
        //角色的名字
        let Name: Laya.Label = box.getChildByName("user_name") as Laya.Label;
        //角色头像
        let head: Laya.Image = box.getChildByName("head") as Laya.Image;
        //角色等级
        let Lv: Laya.Label = box.getChildByName("la_id") as Laya.Label;
        //角色的状态
        let State: Laya.Image = box.getChildByName("user_state") as Laya.Image;
        //采集剩余时间
        let StateTime: Laya.Label = box.getChildByName("staff_time") as Laya.Label;
        //升级进度条
        let progress: Laya.Image = box.getChildByName("ui_progress_bg") as Laya.Image;
        let progressValue: Laya.Image = progress.getChildByName("ui_progress_value") as Laya.Image;
        //星星背景
        let starImage: Laya.Label = box.getChildByName("star_image") as Laya.Label;
        //星星个数
        let starFont: Laya.Label = starImage.getChildByName("star_font") as Laya.Label;

        //角色信息BG
        let userInfo: Laya.Image = box.getChildByName("ui_user_info") as Laya.Image;
        //角色介绍
        let userMessage: Laya.Label = userInfo.getChildByName("ui_evaluate1_font") as Laya.Label;
        //状态按钮
        let userButton: Laya.Image = userInfo.getChildByName("ui_use2_button") as Laya.Image;
        //按钮状态图片
        let userImg: Laya.Image = userButton.getChildByName("ui_use2_img") as Laya.Image;
        //按钮状态文字
        let userFont: Laya.Label = userButton.getChildByName("ui_use2_font") as Laya.Label;
        //按钮金币图片
        let goldImage: Laya.Image = userButton.getChildByName("ui_user2_i") as Laya.Image;
        //按钮金币文字
        let goldLabel: Laya.Label = goldImage.getChildByName("ui_user2_label") as Laya.Label;
        //按钮红点
        let red: Laya.Image = userButton.getChildByName("ui_user2_red") as Laya.Image;



        if (!this._roleInfo[index])
            return

        let data = this._roleInfo[index]["id"] > 0 ? this._roleInfo[index]["id"] : this._roleData[index];

        userButton.offAll();
        userButton.on(Laya.Event.CLICK, this,(index)=>{
            EffectManager.getInstance().BtnEffect(userButton);
            this.SureClick(index);
        },[index]);


        userMessage.text = "" + Staff_Cfg[data]["strdeclare"];

        if (index == 0) {
            box.width = 1000;
        }

        userButton.visible = true;
        starImage.visible = false;
        StateTime.visible = false;
        userFont.visible = true;
        goldImage.visible = true;
        userImg.y = 18;
        State.visible = true;
        progress.visible = false;
        Name.text = Staff_Cfg[data].strname;
        head.skin = Staff_Cfg[data].stricon;
        //当前没有存储信息
        if (this._roleInfo[index] == null) {
            Debug.Log("");
        }

        //是否被雇佣
        if (this._roleInfo[index]["id"] == 0) {
            userFont.text = "" + Staff_Cfg[data]["hiregold"];
            let bool = Staff_Cfg[data]["hiregold"] > Player.getInstance().nGold;
            // userButton.gray = bool;
            userButton.disabled=bool;
            red.visible = !bool;
            State.visible = !bool;
            //判断是否解锁
            if (Staff_Cfg[data]["unlockstar"] <= Player.getInstance().nStar) {
                State.skin = "gameui/staff/keguyongfont.png"
                userButton.skin = "gameui/staff/surepurplebutton.png";
                goldLabel.color = "#4e006e";
                userImg.skin = "gameui/staff/guyongfont.png";
                Lv.text = Staff_Cfg[data]["lv"];
            }
            else {
                State.visible = false;
                starImage.visible = true;
                starFont.text = Staff_Cfg[data]["unlockstar"];
                userButton.visible = false
                userButton.skin = "gameui/staff/suregreenbutton.png";
                goldLabel.color = "#226e00";
                userImg.skin = "gameui/staff/guyongfont.png";
                Lv.text = Staff_Cfg[data]["lv"];
            }
        }
        else {
            userFont.text = "" + Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"];
            //是否正在升级中
            if (this._roleInfo[index]["updateState"] == 1) {
                //升级进度
                let cdtime = (Time.serverSeconds - this._roleInfo[index]["updateTimeStamp"]);
                let times = Staff_Cfg[this._roleInfo[index]["id"]]["cd"] * 60;
                let value = cdtime / times;
                value = value > 1 ? 1 : value;

                State.visible = false;
                State.skin = "gameui/staff/keguyongfont.png";
                StateTime.visible = true;

                StateTime.text = "" + Utils.TimeToTimeFormat(times - cdtime);
                progress.visible = true;
                progressValue.width = progress.width * (value);
                Lv.text = Staff_Cfg[this._roleInfo[index]["id"]]["lv"];
                userButton.gray = false;
                red.visible = true;
                userButton.skin = "gameui/staff/suregreenbutton.png";
                goldLabel.color = "#226e00";
                userImg.skin = "gameui/staff/speedfont.png";
                userFont.visible = false;
                userImg.y = 41;
                goldImage.visible = false;
            }
            else {
                Lv.text = Staff_Cfg[this._roleInfo[index]["id"]]["lv"];

                //是否满级
                if (Staff_Cfg[this._roleInfo[index]["id"]]["next"] > this._roleInfo[index]["id"]) {
                    let bool = Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] > Player.getInstance().nGold;
                    userButton.gray = bool;
                    red.visible = !bool;
                    State.visible = !bool;
                    //是否可以升级
                    if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] <= Player.getInstance().nGold) {
                        State.skin = "gameui/staff/keupdatefont.png";
                        userButton.skin = "gameui/staff/suregreenbutton.png";
                        goldLabel.color = "#226e00";
                        userImg.skin = "gameui/staff/updatefont.png";

                    }
                    else {
                        State.visible = false;
                        // State.text = "金币不足";
                        // userButton.skin = "gameui/staff/graybutton.png";
                        userImg.skin = "gameui/staff/updatefont.png";
                    }
                }
                else {
                    State.visible = false;
                    // State.text = "已满级";
                    userButton.visible = false;
                }

            }
        }
    }



    /**刷新按钮状态*/
    private RefreshButtonState() {
        let data = SaveManager.getInstance().GetCache(ModelStorage.Staff);
        this._roleInfo = data == null ? this._roleInfo : data;
    }

    /**确定按钮 */
    private SureClick(index: number) {
        
        if (!this._roleInfo[index]) return
        //雇佣状态
        if (this._roleInfo[index]["id"] == 0) {
            //判断是否解锁
            if (Staff_Cfg[this._roleData[index]]["unlockstar"] <= Player.getInstance().nStar
                && Staff_Cfg[this._roleData[index]]["hiregold"] <= Player.getInstance().nGold
            ) {
                //雇佣工人并更改金币
                if (!Player.getInstance().canPayGold(Number(Staff_Cfg[this._roleData[index]]["hiregold"]))) {
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
                    return;
                }
                Player.getInstance().refreshGold(-Number(Staff_Cfg[this._roleData[index]]["hiregold"]));
                let fun: Function = null;
                switch (Staff_Cfg[this._roleData[index]]["jobID"]) {
                    //宣传员
                    case 1:
                        GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                            view.Init(3, this._roleData[index], index);
                        }));
                        // StaffManager.getInstance().Addpropagandist(this._roleData[index], index);
                        break;
                    //清洁工
                    case 2:
                        GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                            view.Init(1, this._roleData[index], index);
                        }));
                        // StaffManager.getInstance().AddDustman(this._roleData[index], index);
                        break;
                    //摄影师
                    case 3:
                        GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                            view.Init(2, this._roleData[index], index);
                        }));
                        // StaffManager.getInstance().AddCameraman(this._roleData[index], index);
                        break;
                    //采集员
                    case 4:
                        //StaffManager.getInstance().AddGather(this._roleData[index], index);
                        break;
                }
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "员工雇佣成功", false]);
            }
            //金币不足
            else if (Staff_Cfg[this._roleData[index]]["hiregold"] > Player.getInstance().nGold) {
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
            }
        }
        else {
            if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] <= Player.getInstance().nGold
                && this._roleInfo[index]["updateState"] == 0) {
                Player.getInstance().refreshGold(-Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"]);
                //设置cd时间
                //StaffManager.getInstance().ChangUpGrade(this._roleInfo[index]["id"]);
                this.UpdateTime();
            }
            else if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] > Player.getInstance().nGold) {
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
            }
            //升级加速
            else if (this._roleInfo[index]["updateState"] == 1) {
                //是否在微信中
                if (Laya.Browser.onWeiXin) {
                    let _that = this;
                    //分享
                    MyPlayer.wxSDK.Share(Share_Cfg[3]["strtitle"], { title: Share_Cfg[3]["strdescribe"], imageUrl: Share_Cfg[3]["strpic"], query: "" }, {
                        successFn: function () {
                            if (_that._roleInfo[index]["id"] != 0) {
                                //升级员工
                                StaffManager.getInstance().upgrade(_that._roleInfo[index]["id"], Staff_Cfg[_that._roleInfo[index]["id"]]["next"]);
                                //打点 2020年10月10日16:34:45
                                DataLog.getInstance().LogVideo_log(GamePoint.Seniority)
                            }
                        },
                        failFn() {
                        }
                    });
                }
                else {
                    if (this._roleInfo[index]["id"] != 0) {
                        //升级员工
                        StaffManager.getInstance().upgrade(this._roleInfo[index]["id"], Staff_Cfg[this._roleInfo[index]["id"]]["next"]);
                        //打点 2020年10月10日16:34:45
                        DataLog.getInstance().LogVideo_log(GamePoint.Seniority)
                    }
                }
            }
        }
        this.RefreshButtonState();
        this.ui_user_list.array = this._roleData;
    }


    /**升级定时器*/
    private UpdateTime() {
        if (this.timeVoid == null) {
            this.timeVoid = Timer.Loop(1000, this, this.UpdateTimeCD);
        }
    }

    private UpdateTimeCD() {
        let bool = false;
        for (const key of this._roleInfo) {
            if (key["updateState"] > 0) {
                bool = true;
                break;
            }
        }
        //当没有玩家在升级时
        if (bool == false) {
            //删除当前计时器
            Timer.Clear(this, this.UpdateTimeCD);
            this.timeVoid = null;
            this.TimeRefresh();
        }
        else {
            this.TimeRefresh();
        }
    }

    /**升级时间刷新*/
    private TimeRefresh() {
        this.ui_user_list.array = this._roleData;
        this.RefreshButtonState();
    }


    /**读取信息 */
    private LoadInfo() {
        //解锁皮肤的列表
        let value = GameData.RoleInfo;
        if (value) {
            this._roleInfo = value;
        }
        // else {
        //     for (let i = 1; i <= Staff_Cfg[1]["staffunm"]; i++) {
        //         for (let j = 1; j <= Staff_Cfg[1]["idunm"]; j++) {
        //             if (Staff_Cfg[j]["staffID"] == i) {
        //                 let data={
        //                     //角色id 对应staff表中id
        //                     id:0,
        //                     //升级状态 0不升级 1升级
        //                     updateState:0,
        //                     //工作状态 0默认 1工作 2休息 3收获
        //                     workState:0,
        //                     //升级时间戳 0为默认
        //                     updateTimeStamp:0,
        //                     //工作时间戳 0为默认
        //                     workTimeStamp:0,
        //                     //休息时间戳 0为默认
        //                     restTimeStamp:0,
        //                     //工作休息时长
        //                     workOrRestTimeCD:0
        //                 }
        //                 this._roleInfo.push(data);
        //                 break;
        //             }
        //         }
        //     }
        // }
    }
}
ViewManager.getInstance().SaveViewResUrl(StaffView, [
    { url: "view/StaffView.json", type: Laya.Loader.JSON },
    { url: "res/atlas/gameui/staff.atlas", type: Laya.Loader.ATLAS },
]);

