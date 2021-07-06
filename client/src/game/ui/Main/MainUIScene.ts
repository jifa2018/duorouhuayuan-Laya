import { ui } from "../../../ui/layaMaxUI";
import { Player } from "../../player/Player";
import { CommonDefine } from "../../../common/CommonDefine";
import { Utils } from "../../../utils/Utils";
import { StaffManager } from "../../../manager/StaffManager";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { Time } from "../../../common/Time";
import { GameUIManager } from "../../../manager/GameUIManager";
import { Staff_Cfg, Succulent_Cfg, gift_Cfg, Share_Cfg, Effect_Cfg } from "../../../manager/ConfigManager";
import { GameData } from "../../data/GameData";
import { BackPackScene } from "../BackPack/BackPackScene";
import { HandBookView } from "../HandBook/HandBookView";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { EffectManager } from "../../../effect/EffectManager";
import { WXRankView } from "../rank/WXRankView";
import { MyPlayer } from "../../MyPlayer";
import { UnlockView } from "../Unlock/UnlockView";
import { getGoods } from "./GetGoods/GetGoods";
import { BagSystem } from "../../bag/BagSystem";
import { DataLog } from "../../../common/DataLog";
import { GamePoint } from "../../GameDefine";
import { Avatars } from "../../../effect/Avatars";
import GameScene from "../../scene/GameScene";
import { PlantView } from "../HandBook/PlantView";


export enum GatherStateType {
    Idle,      //闲置
    Collecting,      //工作
    Rest,       //休息去了
    Receiving,   //待收货
}

/**
 * 主界面
 */
export class MainUIScene extends ui.view.main.MainUIUI {
    private TakePhotoing: boolean = true;
    private PickMoneying: boolean = true;
    private TakePhotoTime: number = 0;
    private PickMoneyTime: number = 0;
    //解锁X和Y
    private _unlockX: number = 0;
    private _unlockY: number = 0;

    //领取礼物实例
    private goodsInit: getGoods = null;
    //礼物特效
    private goodsEffect: Avatars = null;
    curGetGoodsId: number;
    curGetGoodsNum: number;


    constructor() { super(); }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        if (SaveManager.getInstance().GetCache(ModelStorage.Publicity))
            this.Panel_publicity.visible = true;
        else
            this.Panel_publicity.visible = false;
        this.progressbar_flyer.value = 0;
        this.Panel_TakePhoto.visible = false;
        this.Panel_pickMoney.visible = false;
        this.init();
        this.bindEvent();
        this.LoadLocalData();
        this.goodsInit = new getGoods(this.pro);
    }

    onDisable() {
        this.stage.off(CommonDefine.EVENT_MAIN_REFRESH, this, this.refresh)
        this.stage.off(CommonDefine.EVENT_MAIN_UI_SHOW, this, this.setMianBtnShow)
        this.stage.off(CommonDefine.EVENT_MAIN_GOODS_EVENT, this, this.setGoods)
        this.btn_time_bg.off(Laya.Event.CLICK, this, this.goodsClick)
        GEvent.RemoveEvent(GacEvent.OnShowUI_propagandist, Laya.Handler.create(this, this.StartFlyer));
        GEvent.RemoveEvent(GacEvent.OnShowUI_dustman, Laya.Handler.create(this, this.StartpickMoney));
        GEvent.RemoveEvent(GacEvent.OnShowUI_cameraman, Laya.Handler.create(this, this.StartTakePhoto));
        GEvent.RemoveEvent(GacEvent.OnUpdata_cameramantime, Laya.Handler.create(this, this.UpdateTakePhototime));
        GEvent.RemoveEvent(GacEvent.OnUpdata_dustmantime, Laya.Handler.create(this, this.UpdatepickMoneytime));
        // GEvent.RemoveEvent(GacEvent.OnUnlockAni, Laya.Handler.create(this, this.PlayUnlockAnimation));
        // this.Test.offAll()
    }

    bindEvent() {
        this.stage.on(CommonDefine.EVENT_MAIN_REFRESH, this, this.refresh)
        this.stage.on(CommonDefine.EVENT_MAIN_UI_SHOW, this, this.setMianBtnShow)
        this.stage.on(CommonDefine.EVENT_MAIN_GOODS_EVENT, this, this.setGoods)
        this.btn_time_bg.on(Laya.Event.CLICK, this, this.goodsClick)
        this.btn_edit.on(Laya.Event.CLICK, this, this.edit);
        this.btn_rank.on(Laya.Event.CLICK, this, this.rank);
        this.btn_ad.on(Laya.Event.CLICK, this, this.Btn_Showadvertising);
        this.btn_flyer.on(Laya.Event.CLICK, this, this.Btn_SendFlyer);
        this.btn_pickMoney.on(Laya.Event.CLICK, this, this.Btn_PickMoney);
        this.btn_TakePhoto.on(Laya.Event.CLICK, this, this.Btn_TakePhoto);
        this.btn_backpack.on(Laya.Event.CLICK, this, this.OpenBackPackUI);
        this.btn_handbook.on(Laya.Event.CLICK, this, this.OpenHandBookUI)
        GEvent.RegistEvent(GacEvent.OnShowUI_propagandist, Laya.Handler.create(this, this.StartFlyer));
        GEvent.RegistEvent(GacEvent.OnShowUI_dustman, Laya.Handler.create(this, this.StartpickMoney));
        GEvent.RegistEvent(GacEvent.OnShowUI_cameraman, Laya.Handler.create(this, this.StartTakePhoto));
        GEvent.RegistEvent(GacEvent.OnUpdata_cameramantime, Laya.Handler.create(this, this.UpdateTakePhototime));
        GEvent.RegistEvent(GacEvent.OnUpdata_dustmantime, Laya.Handler.create(this, this.UpdatepickMoneytime));
        // GEvent.RegistEvent(GacEvent.OnUnlockAni, Laya.Handler.create(this, this.PlayUnlockAnimation));
    }

    init() {
        this.refresh();
    }

    refresh() {
        let strGold: string = Player.getInstance().nGold.toString();
        let strStar: string = Player.getInstance().nStar.toString();
        this.num_gold.removeChildren();
        this.num_star.removeChildren();
        MyPlayer.wxSDK.WxUpload("stars", Player.getInstance().nStar)
        for (let index = 0; index < strGold.length; index++) {
            const str = Number(strGold[index]);
            let arr = [this.num_gold.x + 45 + index * 16, 8, str, "gameui/main/number.png", 10, 1]
            let c = Utils.getClipNum(arr);
            this.num_gold.addChild(c)
        }

        for (let index = 0; index < strStar.length; index++) {
            const str = Number(strStar[index]);
            let arr = [this.num_gold.x + 45 + index * 16, 8, str, "gameui/main/number.png", 10, 1]
            let c = Utils.getClipNum(arr);
            this.num_star.addChild(c)
        }
    }


    //#region  Button点击事件
    zhuangshi() {
        this.showTip(true)
    }
    caiji() {
        this.showTip(true)
    }
    diy() {
        this.showTip(true)
    }
    rank() {
        EffectManager.getInstance().BtnEffect(this.btn_rank);
        GameUIManager.getInstance().showUI(WXRankView)
    }
    edit() {
        this.showTip(true)
    }

    // 播放广告
    private Btn_Showadvertising() {
        EffectManager.getInstance().BtnEffect(this.btn_ad);
        //是否在微信中
        if (Laya.Browser.onWeiXin) {
            //分享
            MyPlayer.wxSDK.Share(Share_Cfg[2]["strtitle"], { title: Share_Cfg[2]["strdescribe"], imageUrl: Share_Cfg[2]["strpic"], query: "" }, {
                successFn: function () {
                    //TODO  
                    console.log("是时候播放广告了！");
                    StaffManager.getInstance().LoadRangetenNpc();
                },
                failFn() {
                }
            });
        }
        else {
            //TODO  
            console.log("是时候播放广告了！");
            StaffManager.getInstance().LoadRangetenNpc();
        }

        //打点 2020年10月10日16:34:45
        DataLog.getInstance().LogVideo_log(GamePoint.Advertising)
    }

    // 发传单
    private Btn_SendFlyer() {
        EffectManager.getInstance().BtnEffect(this.btn_flyer);
        this.progressbar_flyer.value += 0.1;
        if (Math.ceil(this.progressbar_flyer.value * 10) >= 10) {
            EffectManager.getInstance().PlayEffect(this.btn_flyer, 1, 1);
            StaffManager.getInstance().LoadRangeNpc();
            this.progressbar_flyer.value = 0;
        }
    }

    // 拍照
    private Btn_TakePhoto() {
        //按钮特效
        EffectManager.getInstance().BtnEffect(this.btn_TakePhoto);
        //是否在微信中
        if (Laya.Browser.onWeiXin) {
            let _that = this;
            //分享
            MyPlayer.wxSDK.Share(Share_Cfg[8]["strtitle"], { title: Share_Cfg[8]["strdescribe"], imageUrl: Share_Cfg[8]["strpic"], query: "" }, {
                successFn: function () {
                    _that.StartorContinue_TakePhoto();
                    _that.SaveInfo(3, GatherStateType.Collecting);
                },
                failFn() {
                }
            });
        }
        else {
            this.StartorContinue_TakePhoto();
            this.SaveInfo(3, GatherStateType.Collecting);
        }

        //2020年10月10日16:55:47 打点
        DataLog.getInstance().LogVideo_log(GamePoint.PickUpMoney)
    }

    // 捡钱
    private Btn_PickMoney() {
        //按钮特效
        EffectManager.getInstance().BtnEffect(this.btn_pickMoney);
        //是否在微信中
        if (Laya.Browser.onWeiXin) {
            let _that = this;
            //分享
            MyPlayer.wxSDK.Share(Share_Cfg[7]["strtitle"], { title: Share_Cfg[7]["strdescribe"], imageUrl: Share_Cfg[7]["strpic"], query: "" }, {
                successFn: function () {
                    _that.StartorContinue_PickMoney();
                    _that.SaveInfo(2, GatherStateType.Collecting);
                },
                failFn() {
                }
            });
        }
        else {
            this.StartorContinue_PickMoney();
            this.SaveInfo(2, GatherStateType.Collecting);
        }

        //2020年10月10日16:55:47 打点
        DataLog.getInstance().LogVideo_log(GamePoint.Photograph)
    }

    //背包
    private OpenBackPackUI() {
        EffectManager.getInstance().BtnEffect(this.btn_backpack);
        GameUIManager.getInstance().showUI(BackPackScene);
    }
    //图鉴
    private OpenHandBookUI() {
        EffectManager.getInstance().BtnEffect(this.btn_handbook);
        GameUIManager.getInstance().showUI(HandBookView);
    }
    //#endregion

    private SubTakePhotoTime(): void {
        this.TakePhotoTime -= 1;
        this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
        this.progressbar_TakePhoto.value = 1 - (this.TakePhotoTime / StaffManager.getInstance().GetTakePhotoTimer());
        if (this.TakePhotoTime <= 0) {
            StaffManager.getInstance().StopTakePhoto();
            this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
            this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
            this.progressbar_TakePhoto.value = 0;
            Laya.timer.clear(this, this.SubTakePhotoTime);
            this.TakePhotoing = true;
            this.SaveInfo(3, GatherStateType.Idle);
        }
    }

    private SubpickMoneyTime(): void {
        this.PickMoneyTime -= 1;
        this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
        this.progressbar_pickMoney.value = 1 - (this.PickMoneyTime / StaffManager.getInstance().GetPickMoneyTimer());
        if (this.PickMoneyTime <= 0) {
            StaffManager.getInstance().StopPickMoney();
            this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
            this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
            this.progressbar_pickMoney.value = 0;
            Laya.timer.clear(this, this.SubpickMoneyTime);
            this.PickMoneying = true;
            this.SaveInfo(2, GatherStateType.Idle);
        }
    }

    //#region 界面展示
    private StartFlyer() {
        this.Panel_publicity.visible = true;
        SaveManager.getInstance().SetPublicityCache(true);
    }

    private StartTakePhoto() {
        this.Panel_TakePhoto.visible = true;
        this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
        this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
        this.progressbar_TakePhoto.value = 0;
        let tp = GameData.RoleInfo;
        if (tp != null) {
            for (let index = 0; index < tp.length; index++) {
                const info = tp[index];
                if (info.id != 0 && Staff_Cfg[info.id].jobID == 3 && info.workState == GatherStateType.Collecting) {
                    let t = StaffManager.getInstance().GetTakePhotoTimer() - (Time.serverSeconds - info.workTimeStamp);
                    if (t > 0) {
                        this.TakePhotoTime = t;
                        this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
                        this.progressbar_TakePhoto.value = 1 - (this.TakePhotoTime / StaffManager.getInstance().GetTakePhotoTimer());
                    }

                }
            }
        }
    }

    private StartpickMoney() {
        this.Panel_pickMoney.visible = true;
        this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
        this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
        this.progressbar_pickMoney.value = 0;
        let tp = GameData.RoleInfo;
        if (tp != null) {
            for (let index = 0; index < tp.length; index++) {
                const info = tp[index];
                if (info.id != 0 && Staff_Cfg[info.id].jobID == 2 && info.workState == GatherStateType.Collecting) {
                    let t = StaffManager.getInstance().GetPickMoneyTimer() - (Time.serverSeconds - info.workTimeStamp);
                    if (t > 0) {
                        this.PickMoneyTime = t;
                        this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
                        this.progressbar_pickMoney.value = 1 - (this.PickMoneyTime / StaffManager.getInstance().GetPickMoneyTimer());
                    }

                }
            }
        }
    }

    private UpdateTakePhototime() {
        if (this.TakePhotoing) {
            this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
            this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
        }
    }

    private UpdatepickMoneytime() {
        if (this.PickMoneying) {
            this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
            this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
        }
    }
    //#endregion

    showTip(t: boolean) {
        if (this.tishi.visible && t) return
        this.tishi.visible = t;
        if (t) {
            Laya.timer.once(1000, this, () => {
                this.tishi.visible = false;
            })
        }
    }

    private StartorContinue_PickMoney(): void {
        if (this.PickMoneying) {
            this.PickMoneying = false;
            this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
            Laya.timer.loop(1000, this, this.SubpickMoneyTime);
            StaffManager.getInstance().StartPickMoney();
        }
    }

    private StartorContinue_TakePhoto(): void {
        if (this.TakePhotoing) {
            this.TakePhotoing = false;
            this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
            Laya.timer.loop(1000, this, this.SubTakePhotoTime);
            StaffManager.getInstance().StartTakePhoto();
        }
    }

    //#region  保存本地
    private LoadLocalData(): void {
        let tp = GameData.RoleInfo;
        if (tp != null) {
            for (let index = 0; index < tp.length; index++) {
                const info = tp[index];
                if (info.id != 0) {
                    switch (Staff_Cfg[info.id].jobID) {
                        case 1:
                            StaffManager.getInstance().Addpropagandist(info.id, -1);
                        break;
                        case 2:
                            StaffManager.getInstance().AddDustman(info.id, -1);
                            switch (info.workState) {
                                case GatherStateType.Idle:
                                    this.PickMoneying = true;
                                    break;
                                case GatherStateType.Collecting:
                                    this.PickMoneying = false;
                                    Laya.timer.loop(1000, this, this.SubpickMoneyTime);
                                    StaffManager.getInstance().StartPickMoney();
                                    let t = StaffManager.getInstance().GetPickMoneyTimer() - (Time.serverSeconds - info.workTimeStamp);
                                    if (t > 0)
                                        this.PickMoneyTime = t;
                                    break;
                            }
                        break;
                        case 3:
                             StaffManager.getInstance().AddCameraman(info.id, -1);
                            switch (info.workState) {
                                case GatherStateType.Idle:
                                    this.TakePhotoing = true;
                                    break;
                                case GatherStateType.Collecting:
                                    this.TakePhotoing = false;
                                    Laya.timer.loop(1000, this, this.SubTakePhotoTime);
                                    StaffManager.getInstance().StartTakePhoto();
                                    let t = StaffManager.getInstance().GetTakePhotoTimer() - (Time.serverSeconds - info.workTimeStamp);
                                    if (t > 0)
                                        this.TakePhotoTime = t;
                                    break;
                            }
                        break;
                    }
                }
            }
        }
    }


    /**保存信息 */
    private SaveInfo(type: number, state: GatherStateType) {
        let array = GameData.RoleInfo;
        for (const key in array) {
            if (array.hasOwnProperty(key)) {
                const info = array[key];
                if (info.id != 0) {
                    if (Staff_Cfg[info.id].jobID == type) {
                        info.workState = state;
                        switch (state) {
                            case GatherStateType.Idle:
                                info.workTimeStamp = 0;
                                break;
                            case GatherStateType.Collecting:
                                info.workTimeStamp = Time.serverSeconds;
                                break;
                        }
                        GameData.RoleInfo = array;
                        SaveManager.getInstance().SetStaffCache(array);
                    }
                }

            }
        }
    }
    //#endregion

    /**
     * 设置界面按钮显示和隐藏 
    */

    setMianBtnShow(b: boolean) {
        this.num_star.visible = b;
        this.num_star_img.visible = b;
        this.num_gold.visible = b;
        this.num_gold_img.visible = b;
        // this.btn_edit.visible = b;
        this.btn_rank.visible = b;
        // this.btn_backpack.visible = b;
        this.btn_handbook.visible = b;
        this.btn_time.visible = b;

        if (this.goodsEffect) {
            this.goodsEffect.setShow(b);
        }

    }

    setGoods(b: boolean, time?: number, goodsId?: number, goodsNum?: number) {
        this.btn_time_bg.skin = "gameui/main/img-kaixiangzi1.png";
        this.goods_title_tips.skin = "";
        this.goods_item.visible = false;
        if (b) {
            // this.goods_title_tips.skin = "gameui/main/ljlq.png"
            this.goods_item.disabled = false
            this.btn_time_bg.disabled = false
            //倒计时结束需要添加特效
            this.goodsEffect = EffectManager.getInstance().PlayOnceEffect(this.btn_time_effect, 7, 1, true);
            GameScene.instance.eventMainUIShow();
            // EffectManager.getInstance().PlayEffect(this.goods_item, 1, 1);
        } else {
            // this.goods_title_tips.skin = "gameui/main/dslq.png"
            this.goods_item.disabled = true
            this.btn_time_bg.disabled = true
            //倒计时开始需要删除特效
            this.goodsEffect && this.goodsEffect.Destroy();
        }
        if (goodsId) {
            this.goods_item.skin = Succulent_Cfg[goodsId].striconurl;
            this.curGetGoodsId = goodsId;
            this.curGetGoodsNum = goodsNum;
        }
        if (time) {
            this.backTime.text = Utils.TimeToTimeFormat(time);
        }
        // this.goods_item.visible = true;
    }

    /**礼物点击事件 */
    goodsClick() {
        EffectManager.getInstance().BtnEffect(this.btn_time_bg);
        //是否在微信中
        if (Laya.Browser.onWeiXin) {
            let _that = this;
            //分享
            MyPlayer.wxSDK.Share(Share_Cfg[5]["strtitle"], { title: Share_Cfg[5]["strdescribe"], imageUrl: Share_Cfg[5]["strpic"], query: "" }, {
                successFn: function () {
                    _that.setGoods(false)
                    // this.goods_item.visible = false
                    _that.goodTween1();
                },
                failFn() {
                }
            });
        }
        else {
            this.setGoods(false)
            // this.goods_item.visible = false
            this.goodTween1();
        }
        //2020年10月10日16:55:47 打点
        DataLog.getInstance().LogVideo_log(GamePoint.Get)


    }

    goodTween1() {
        let img = new Laya.Image(this.goods_item.skin);
        let point = (this.goods_item.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.goods_item.x, this.goods_item.y))
        img.x = point.x;
        img.y = point.y;
        img.width = this.goods_item.width;
        img.height = this.goods_item.height;
        Laya.stage.addChild(img);
        Laya.Tween.to(img, {
            y: img.y - 60
        }, 100, Laya.Ease.elasticInOut, Laya.Handler.create(this, this.goodTween1Finish, [img]))
    }

    goodTween1Finish(target) {
        Laya.timer.once(500, this, () => {
            this.goodTween2(target)
        })
    }

    goodTween2(target) {
        let target_point = new Laya.Point(this.btn_backpack.x, this.btn_backpack.y)
        Laya.Tween.to(target, {
            x: target_point.x, y: target_point.y
        }, 300, null, Laya.Handler.create(this, this.goodTween2Finish, [target]))
    }

    goodTween2Finish(target) {
        target.visible = false;
        (target as Laya.Sprite).destroy();
        this.goodsInit.startTime();
        BagSystem.getInstance().addItem(this.curGetGoodsId, this.curGetGoodsNum)
    }



}