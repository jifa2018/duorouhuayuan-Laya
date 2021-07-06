import { ui } from "../../../ui/layaMaxUI";
import { Staff_Cfg, Succulent_Cfg } from "../../../manager/ConfigManager";
import { StaffManager } from "../../../manager/StaffManager";
import { Utils } from "../../../utils/Utils";
import { Timer } from "../../../common/TImer";
import { GameUIManager } from "../../../manager/GameUIManager";
import { GameData } from "../../data/GameData";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { ViewManager } from "../../../manager/ViewManager";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { EffectManager } from "../../../effect/EffectManager";

/**
 * 采集物显示界面
 */
export class StaffCommonView extends ui.view.StaffCommonViewUI {
    // /**角色数据 */
    // private _goodData: Array<[number,number]> = [];
    /**当前角色选中的id */
    private _goodIndex: number = 0;
    /**循环时间 */
    private timeVoid: void = null;

    constructor () {
        super();
        this.createView(Laya.loader.getRes("view/StaffCommonView.json"));
    }



    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.onInit();
        this.onEvent();
    }

    onDisable() {
        this.offAll();
        this.ui_sure_button.off(Laya.Event.CLICK, this, this.SureClick);
        this.ui_close_button.off(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(StaffCommonView);
        });
    }

    private onInit() {

    }

    /**注册事件 */
    private onEvent() {
        this.ui_sure_button.on(Laya.Event.CLICK, this, this.SureClick);
        this.ui_close_button.on(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(StaffCommonView);
        });
    }



    /**获取当前角色信息列表 */
    private GetRoleMessageList() {
        this.ui_good_list.array = GameData.GetItem(Staff_Cfg[this._goodIndex]["staffID"]);
        this.ui_good_list.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
    }

    /**获得当前角色信息 */
    private SetRoleMessageList(box: Laya.Box, index: number) {
        //物品图片
        let GoodPic: Laya.Image = box.getChildByName("good_pic") as Laya.Image;
        //物品数量
        let GoodNum: Laya.Label = box.getChildByName("good_num") as Laya.Label;
        let GoodName: Laya.Label = box.getChildByName("good_name") as Laya.Label;

        let array = GameData.GetItem(Staff_Cfg[this._goodIndex]["staffID"])[index]
        GoodPic.skin = Succulent_Cfg[array[1]]["striconurl"];
        GoodNum.text = "X" + array[0];
        GoodName.text = "" + Succulent_Cfg[array[1]]["strname"];
    }


    /**点击选择 */
    public SetDataID(index: number = -1) {
        //当前选中的索引
        this._goodIndex = index;
        //解锁皮肤的列表
        let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
        for (let i = 0; i < value.length; i++) {
            if (this._goodIndex == value[i]["id"]) {
                //如果是采集状态
                if (value[i]["workState"] == 1 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                    this.ui_time_font.visible = true;
                    let time = StaffManager.getInstance().GetCollectTime(Staff_Cfg[value[i]["id"]]["staffID"]);
                    this.ui_time_font.text = "剩余采集时间：" + Utils.TimeToTimeFormat(time);
                    this.ui_tips_font.skin = "gameui/staffcommon/staffingfont.png";
                    this.ui_sure_button.visible = false;
                    this.UpdateTime();
                }
                else if (value[i]["workState"] == 3 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                    this.ui_time_font.visible = false;
                    this.ui_tips_font.skin = "gameui/staffcommon/stafffont.png";
                    this.ui_sure_button.visible = true;
                }
                break;
            }

        }
        this.GetRoleMessageList();
    }


    /**确定按钮 */
    private SureClick() {
        EffectManager.getInstance().BtnEffect(this.ui_sure_button);
        //StaffManager.getInstance().ToRest(Staff_Cfg[this._goodIndex]["staffID"]);
        //刷新百草屋界面
        GEvent.DispatchEvent(GacEvent.RefreshGatherInfo);
        GameUIManager.getInstance().hideUI(StaffCommonView);
    }

    /**升级定时器*/
    private UpdateTime() {
        if (this.timeVoid == null) {
            this.timeVoid = Timer.Loop(1000, this, this.UpdateTimeCD);
        }
    }

    private UpdateTimeCD() {
        let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
        let bool = false;
        for (const key of value) {
            if (key["workState"] == 1) {
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


    /**采集时间时间刷新*/
    private TimeRefresh() {
        //解锁皮肤的列表
        let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
        //如果是采集状态
        for (let i = 0; i < value.length; i++) {
            if (this._goodIndex == value[i]["id"]) {
                //如果是采集状态
                if (value[i]["workState"] == 1 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                    this.ui_time_font.visible = true;
                    let time = StaffManager.getInstance().GetCollectTime(Staff_Cfg[value[i]["id"]]["staffID"]);
                    this.ui_time_font.text = "剩余采集时间：" + Utils.TimeToTimeFormat(time); 
                    this.ui_tips_font.skin = "gameui/staffcommon/staffingfont.png";
                    this.ui_sure_button.visible = false;
                    this.UpdateTime();
                }
                else if (value[i]["workState"] == 3 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                    this.ui_time_font.visible = false;
                    this.ui_tips_font.skin = "gameui/staffcommon/stafffont.png";
                    this.ui_sure_button.visible = true;
                }
                break;
            }

        }
        this.ui_good_list.array = GameData.GetItem(Staff_Cfg[this._goodIndex]["staffID"]);
    }

}
ViewManager.getInstance().SaveViewResUrl(StaffCommonView, [
    { url: "view/StaffCommonView.json", type: Laya.Loader.JSON },
]);
