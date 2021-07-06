import { ui } from "../../../ui/layaMaxUI";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { Utils } from "../../../utils/Utils";
import { LocalStorage, GamePoint } from "../../GameDefine";
import { Staff_Cfg, Collection_station_Cfg, Share_Cfg } from "../../../manager/ConfigManager";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Time } from "../../../common/Time";
import { Player } from "../../player/Player";
import { Timer } from "../../../common/TImer";
import { StaffManager } from "../../../manager/StaffManager";
import { CollectMapDataManager } from "../../../manager/CollectMapDataManager";
import { CommonDefine } from "../../../common/CommonDefine";
import GameScene from "../../scene/GameScene";
import { StaffCommonView } from "../Staff/StaffCommonView";
import { GameData } from "../../data/GameData";
import { TipViewScene } from "../Common/TipViewScene";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { ViewManager } from "../../../manager/ViewManager";
import { MyPlayer } from "../../MyPlayer";
import { DataLog } from "../../../common/DataLog";
import { EffectManager } from "../../../effect/EffectManager";

/**
 * 百草屋
 */
export class GatherView extends ui.view.GatherViewUI {
    /**员工列表 */
    private _staffInfo: any[];
    /**当前选中的id */
    private _staffIndex: number = 0;
    private lv = 1;
    /**循环时间 */
    private _timeVoid = null;
    //员工红点显示
    private _staffRedVisible = false;

    constructor() {
        super();
        this.createView(Laya.loader.getRes("view/GatherView.json"));
    }


    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.onInit();
        this.onEvent();
    }

    private onEvent() {
        this.ui_update_button.on(Laya.Event.CLICK, this, this.UpdateClick);
        this.ui_staff_button.on(Laya.Event.CLICK, this, this.StaffClick);
        this.ui_close_button.on(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(GatherView);
        });
        this.ui_updategrade_button.on(Laya.Event.CLICK, this, this.UpdateLV);
        GEvent.RegistEvent(GacEvent.RefreshGatherInfo, Laya.Handler.create(this, this.Refresh));
    }
    onDisable() {
        this.offAll();
        this.ui_update_button.off(Laya.Event.CLICK, this, this.UpdateClick);
        this.ui_staff_button.off(Laya.Event.CLICK, this, this.StaffClick);
        this.ui_close_button.off(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(GatherView);
        });
        this.ui_updategrade_button.off(Laya.Event.CLICK, this, this.UpdateLV);
        GEvent.RemoveEvent(GacEvent.RefreshGatherInfo, Laya.Handler.create(this, this.Refresh));
    }

    public set visible(b: boolean) {
        super.visible = b;
        if (b) {
            this.onEnable();
        }
    }

    private onInit() {
        this.LoadInfo();
        this.GetRoleMessageList();
        this.Refresh();
        this.DataInit();
        this.ui_update_box.visible = true;
        this.ui_list_box.visible = false;
        this.ui_update_button.skin = "gameui/gather/updatebutton_light.png";
        this.ui_staff_button.skin = "gameui/gather/dispatch_choose.png";
        //临时
        this.ui_introduce_font.visible = false;
        this.ui_update2_font.visible = false;
    }

    /**初始化数据（临时） */
    private DataInit() {
        for (let i = 0; i < this._staffInfo.length; i++) {
            if (this._staffInfo[i]["workState"] > 0) {
                this.UpdateTime();
                break;
            }
        }
    }

    /**刷新界面 */
    private Refresh() {
        this.LoadInfo();

        //标题
        if (this.lv > 9) {
            this.ui_grade_shi.visible = true;
            this.ui_grade_shi.index = Math.floor(this.lv / 10);
            this.ui_grade_ge.index = this.lv - Math.floor(this.lv / 10) * 10;
        }
        else {
            this.ui_grade_shi.visible = false;
            this.ui_grade_ge.index = this.lv;
        }

        //百草屋介绍
        this.ui_introduce_font.text = Collection_station_Cfg[this.lv]["strdiscribe"];
        let bool = Collection_station_Cfg[this.lv]["upgold"] > Player.getInstance().nGold
        this.ui_updategrade_button.gray = bool;
        this.ui_red_button.visible = !bool;
        this.ui_update_red.visible = !bool;
        //下一等级
        if (Collection_station_Cfg[this.lv]["lvup"] == this.lv) {
            this.ui_next_font.visible = false;
            this.ui_update_font.visible = false;
            this.ui_updategrade_button.visible = false;
            this.ui_maxgrade_font.visible = true;
        } else {
            this.ui_next_font.visible = true;
            //下一级升级介绍
            this.ui_update_font.visible = true;
            this.ui_update_font.text = Collection_station_Cfg[this.lv]["strDec"];
            //升级按钮
            this.ui_updategrade_button.visible = true;
            // //升级按钮货币图片
            // this.ui_updategrade_pic.skin="";
            //升级按钮货币价格
            this.ui_gold_font.text = Collection_station_Cfg[this.lv]["upgold"];

            this.ui_maxgrade_font.visible = false;
        }
        this._staffRedVisible = false;
        for (let i = 0; i < this._staffInfo.length; i++) {
            if (this._staffInfo[i]["workState"] == 3) {
                this._staffRedVisible = true;
                break;
            }
        }
        this.ui_staff_red.visible = this._staffRedVisible;
    }


    /**获取当前角色信息列表 */
    private GetRoleMessageList() {
        this.emptyTips.visible = this._staffInfo.length <= 0;
        this.ui_staff_list.array = this._staffInfo;
        this.ui_staff_list.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
    }

    /**获得当前角色信息 */
    private SetRoleMessageList(box: Laya.Box, index: number) {
        //头像
        let head: Laya.Image = box.getChildByName("head") as Laya.Image;
        //名字
        let name: Laya.Label = box.getChildByName("name") as Laya.Label;
        //升级进度条
        let progress: Laya.Image = box.getChildByName("progressBG") as Laya.Image;
        let progressValue: Laya.Image = progress.getChildByName("progress") as Laya.Image;

        //冷却时间
        let gather_time: Laya.Label = progress.getChildByName("gather_time") as Laya.Label;
        //按钮
        let button: Laya.Image = box.getChildByName("buttonClick") as Laya.Image;
        let lv: Laya.Label = box.getChildByName("la_id") as Laya.Label;

        //状态
        let state: Laya.Image = box.getChildByName("stateFont") as Laya.Image;
        //按钮红点
        let red: Laya.Image = box.getChildByName("red") as Laya.Image;

        button.offAll();
        button.on(Laya.Event.CLICK, this, this.RoleChoose, [index]);
        button.visible = true;
        state.visible = false;
        progress.visible = true;
        red.visible = false;
        name.text = Staff_Cfg[this._staffInfo[index]["id"]]["strname"];

        if (Staff_Cfg[this._staffInfo[index]["id"]]) {
            lv.text = Staff_Cfg[this._staffInfo[index]["id"]]["lv"];
        }
        head.skin = Staff_Cfg[this._staffInfo[index]["id"]].stricon;

        //工作（员工表缺少休息时长）
        if (this._staffInfo[index]["workState"] == 1) {
            //采集进度
            let cdtime = (Time.serverSeconds - this._staffInfo[index]["workTimeStamp"]);
            let cd = 0;//this._staffInfo[index]["workOrRestTimeCD"];
            let value = cdtime / cd;

            value = value > 1 ? 1 : value;

            progressValue.width = progress.width * (value);
            gather_time.text = "" + Utils.formatStandardTime(StaffManager.getInstance().GetCollectTime(Staff_Cfg[this._staffInfo[index]["id"]]["staffID"]));
            button.skin = "gameui/gather/preview.png";
            state.visible = true;
            state.skin = "gameui/gather/staffing.png";
        }
        //休息
        else if (this._staffInfo[index]["workState"] == 2) {
            //采集进度
            let cdtime = 0;//  (Time.serverSeconds - this._staffInfo[index]["restTimeStamp"]);
            let cd = 0;//this._staffInfo[index]["workOrRestTimeCD"];
            let value = cdtime / cd;
            value = value > 1 ? 1 : value;

            progressValue.width = progress.width * (value);
            gather_time.text = "" + Utils.formatStandardTime(StaffManager.getInstance().GetRestTime(Staff_Cfg[this._staffInfo[index]["id"]]["staffID"]));
            state.visible = true;
            state.skin = "gameui/gather/resting.png";
            // button.visible = false;
            button.skin = "gameui/gather/speedbutton.png";
        }
        //收获
        else if (this._staffInfo[index]["workState"] == 3) {
            progress.visible = false;
            button.skin = "gameui/gather/harvestbutton.png";
            state.skin = "gameui/gather/caijiwancheng.png";
            red.visible = true;
        }
        //闲置
        else {
            progress.visible = false;
            state.visible = true;
            state.skin = "gameui/gather/rest.png";
            button.skin = "gameui/gather/staffend.png"

        }
    }

    public showStaffTable() {
        this.ui_staff_button && this.ui_staff_button.event(Laya.Event.CLICK);
    }

    /**点击选择 */
    private RoleChoose(index: number) {
        let box=this.ui_staff_list.getChildAt(0).getChildAt(index);
        let boxx=box.getChildByName("buttonClick")
        EffectManager.getInstance().BtnEffect(boxx);
        //当前选中的索引
        this._staffIndex = index;
        //工作
        if (this._staffInfo[this._staffIndex]["workState"] == 1) {
            //预览
            GameUIManager.getInstance().hideUI(GatherView)
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", GameScene.instance.camera]);
        }
        //收获
        else if (this._staffInfo[this._staffIndex]["workState"] == 3) {
            //收获
            GameUIManager.getInstance().createUI(StaffCommonView, [StaffCommonView]
                , Laya.Handler.create(this, (view) => {
                    view.SetDataID(this._staffInfo[this._staffIndex]["id"]);
                }));
        }
        //休息中
        else if (this._staffInfo[this._staffIndex]["workState"] == 2) {

            //2020年10月10日17:13:04 打点
            DataLog.getInstance().LogVideo_log(GamePoint.Sleep);

            //是否在微信中
            if (Laya.Browser.onWeiXin) {
                let _that = this;
                //分享
                MyPlayer.wxSDK.Share(Share_Cfg[4]["strtitle"], { title: Share_Cfg[4]["strdescribe"], imageUrl: Share_Cfg[4]["strpic"], query: "" }, {
                    successFn: function () {
                        //看广告修改休息数据
                        //StaffManager.getInstance().ToStop(Staff_Cfg[_that._staffInfo[_that._staffIndex]["id"]]["staffID"])
                    },
                    failFn() {
                    }
                });
            }
            else {
                //看广告修改休息数据
                //StaffManager.getInstance().ToStop(Staff_Cfg[this._staffInfo[this._staffIndex]["id"]]["staffID"])
            }
        }
        else if (this._staffInfo[this._staffIndex]["workState"] == 0) {
            //去采集
            GameUIManager.getInstance().hideUI(GatherView)
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", GameScene.instance.camera]);
        }
    }

    /**升级界面 */
    private UpdateClick() {
        EffectManager.getInstance().BtnEffect(this.ui_update_button);
        this.ui_update_box.visible = true;
        this.ui_list_box.visible = false;
        this.ui_update_button.skin = "gameui/gather/updatebutton_light.png";
        this.ui_staff_button.skin = "gameui/gather/dispatch_choose.png";
    }

    /**雇佣界面 */
    private StaffClick() {
        EffectManager.getInstance().BtnEffect(this.ui_staff_button);
        this.ui_update_box.visible = false;
        this.ui_list_box.visible = true;
        this.ui_update_button.skin = "gameui/gather/updatebutton_choose.png";
        this.ui_staff_button.skin = "gameui/gather/dispatch_bg.png";
    }

    /**升级百草屋 */
    private UpdateLV() {
        EffectManager.getInstance().BtnEffect(this.ui_updategrade_button);
        //可以继续升级
        if (this.lv < Collection_station_Cfg[this.lv]["lvup"]) {
            //并且金币足够
            if (Collection_station_Cfg[this.lv]["upgold"] <= Player.getInstance().nGold) {
                Player.getInstance().refreshGold(-Collection_station_Cfg[this.lv]["upgold"]);
                this.lv = Collection_station_Cfg[this.lv]["lvup"];
                let stra: string = Collection_station_Cfg[this.lv]["strunlockmap"];
                let str: string[] = stra.split(",");
                CollectMapDataManager.getInstance().unLockMapData((Number)((str[0])), (Number)(str[1]));
                this.SaveInfo();
                GameUIManager.getInstance().destroyTopUI(TipViewScene);
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "百草屋升级到" + this.lv + "级", false])
            }
            else {
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false])
            }
        }
        this.Refresh();
    }

    /**状态定时器*/
    private UpdateTime() {
        if (this._timeVoid == null) {
            this._timeVoid = Timer.Loop(1000, this, this.UpdateTimeCD);
        }
    }

    private UpdateTimeCD() {
        this.LoadInfo();
        let bool = false;
        for (const key of this._staffInfo) {
            if (key["workState"] > 0) {
                bool = true;
                break;
            }
        }
        //当没有玩家在升级时
        if (bool == false) {
            //删除当前计时器
            Timer.Clear(this, this.UpdateTimeCD);
            this._timeVoid = null;
            this.TimeRefresh();
        }
        else {
            this.TimeRefresh();
        }
    }

    private TimeRefresh() {
        this.ui_staff_list.array = this._staffInfo;
        this.emptyTips.visible = this._staffInfo.length <= 0;
        this.Refresh();
    }

    /**保存信息 */
    private SaveInfo() {
        SaveManager.getInstance().SetGatherLvCache(this.lv);
    }

    /**读取信息 */
    private LoadInfo() {
        this.lv = SaveManager.getInstance().GetCache(ModelStorage.GatherLV);
        if (this.lv == null) { this.lv = 1; }
        let _data: any[] = [];
        this._staffInfo = [];
        //解锁皮肤的列表
        let value: any[] = GameData.RoleInfo;
        if (value) {
            _data = value;
        }
        // else {
        //     for (let i = 1; i <= Staff_Cfg[1]["staffunm"]; i++) {
        //         for (let j = 1; j <= Staff_Cfg[1]["idunm"]; j++) {
        //             if (Staff_Cfg[j]["staffID"] == i) {
        //                 let data = {
        //                     //角色id 对应staff表中id
        //                     id: 0,
        //                     //升级状态 0不升级 1升级
        //                     updateState: 0,
        //                     //工作状态 0默认 1工作 2休息
        //                     workState: 0,
        //                     //升级时间戳 0为默认
        //                     updateTimeStamp: 0,
        //                     //工作时间戳 0为默认
        //                     workTimeStamp: 0,
        //                     //休息时间戳 0为默认
        //                     restTimeStamp: 0
        //                 }
        //                 _data.push(data);
        //                 break;
        //             }
        //         }
        //     }
        // }
        if (_data != [] || _data != null) {
            for (let i = 0; i < _data.length; i++) {
                if (_data[i]["id"] == 0) continue;
                if (Staff_Cfg[_data[i]["id"]]["jobID"] == 4
                    && Player.getInstance().nStar >= Staff_Cfg[_data[i]["id"]]["unlockstar"]) {
                    this._staffInfo.push(_data[i]);
                }
                else {
                    continue;
                }

            }
        }
    }


}
ViewManager.getInstance().SaveViewResUrl(GatherView, [
    { url: "view/GatherView.json", type: Laya.Loader.JSON },
]);
