import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { NewTip_Cfg, Share_Cfg } from "../../../manager/ConfigManager";
import { ViewManager } from "../../../manager/ViewManager";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import GameScene from "../../scene/GameScene";
import { StaffManager } from "../../../manager/StaffManager";
import { EffectManager } from "../../../effect/EffectManager";
import { StaffView } from "../Staff/StaffView";
import { Avatars } from "../../../effect/Avatars";
import { WxSDKManager } from "../../../platform/WxSDKManager";
import { MyPlayer } from "../../MyPlayer";

/**
 * 主界面
 */
export class UnlockView extends ui.view.UnLockViewUI {
    /**数据id */
    private _dataID: number = -1;
    /**玩家id */
    private _userID: number = -1;
    /**玩家数据id */
    private _userDataID: number = -1;
    /**标题特效 */
    private _tipsEffect: Avatars = null;
    /**背景灯光特效 */
    private _lightEffect: Avatars = null;
    //回调
    private _function: Laya.Handler = null;

    constructor() {
        super();
        this.createView(Laya.loader.getRes("view/UnLockView.json"));
        this.onEvent();
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;

    }

    /**注册事件 */
    private onEvent() {

        this.ui_sure_btn.on(Laya.Event.CLICK, this, this.SureClick);
        this.ui_close_btn.on(Laya.Event.CLICK, this, this.CloseClick);

    }

    onDisable() {
        this.offAll();
        this.ui_sure_btn.offAll();
        this.ui_close_btn.offAll();
        if (this._tipsEffect) {
            this._tipsEffect.Destroy();
        }
        if (this._lightEffect) {
            this._lightEffect.Destroy();
        }
    }

    /**解锁新功能
     * @param id 解锁表中的id
     * @param fun 解锁回调
     */
    private Init(id: number, userID: number = -1, dataID: number = -1, fun: Function) {
        this._dataID = id;
        this._userID = userID;
        this._userDataID = dataID;
        this._function = Laya.Handler.create(this, fun);

        //初始化隐藏功能
        this.fun_bg.visible = true;
        this.fun_icon.visible = false;
        this.Refresh();
        this.PlayEffect();
    }


    /**播放解锁特效 */
    private PlayEffect() {
        this._tipsEffect = EffectManager.getInstance().PlayOnceEffect(this.ui_tips_effect, 2, 1, false);
        this._lightEffect = EffectManager.getInstance().PlayOnceEffect(this.ui_light_effect, 4, 1, true);
    }

    private onHide() {
        if (this._tipsEffect) {
            this._tipsEffect.Destroy();
            this._tipsEffect = null;
        }
        if (this._lightEffect) {
            this._lightEffect.Destroy();
            this._lightEffect = null;

        }
    }

    //刷新
    private Refresh() {
        //功能图片
        this.ui_fun_icon.skin = NewTip_Cfg[this._dataID]["strpicture"];
        this.ui_fun_pic.skin = NewTip_Cfg[this._dataID]["strpicture"];
        // //标题
        this.ui_tips_font.text = NewTip_Cfg[this._dataID]["strname"];
        //功能介绍
        this.ui_introduce_font.text = NewTip_Cfg[this._dataID]["strdeclare"];

        //确定按钮
        if (NewTip_Cfg[this._dataID]["share"] == 1) {
            this.ui_sure_btn.visible = true;
            this.ui_close_btn.visible = false;
        }
        else {
            this.ui_sure_btn.visible = false;
            this.ui_close_btn.visible = true;
        }


    }

    /**确定按钮 */
    private SureClick() {
        //是否在微信中
        if (Laya.Browser.onWeiXin) {
            let _that = this;
            //分享
            MyPlayer.wxSDK.Share(Share_Cfg[6]["strtitle"], { title: Share_Cfg[6]["strdescribe"], imageUrl: Share_Cfg[6]["strpic"], query: "" }, {
                successFn: function () {
                    //是否关闭其他UI
                    if (NewTip_Cfg[_that._dataID]["closeui"] == 1) {
                        GameUIManager.getInstance().hideUI(StaffView);
                    }
                    _that.PlayUnlockAnimation(_that._dataID);
                    if (NewTip_Cfg[_that._dataID]["skipID"] != -1) {
                        //跳转页面id
                        GameScene.instance.switchViewByIndex(NewTip_Cfg[_that._dataID]["skipID"]);
                    }
                },
                failFn() {
                }
            });
        }
        else {
            //是否关闭其他UI
            if (NewTip_Cfg[this._dataID]["closeui"] == 1) {
                GameUIManager.getInstance().hideUI(StaffView);
            }
            this.PlayUnlockAnimation(this._dataID);
            if (NewTip_Cfg[this._dataID]["skipID"] != -1) {
                //跳转页面id
                GameScene.instance.switchViewByIndex(NewTip_Cfg[this._dataID]["skipID"]);
            }
        }
    }

    private CloseClick() {
        //是否关闭其他UI
        if (NewTip_Cfg[this._dataID]["closeui"] == 1) {
            GameUIManager.getInstance().hideUI(StaffView);
        }
        this.PlayUnlockAnimation(this._dataID);
        //跳转页面id
        GameScene.instance.switchViewByIndex(NewTip_Cfg[this._dataID]["skipID"]);
    }


    private PlayUnlockAnimation(num: number) {
        this.fun_bg.visible = false;
        this.fun_icon.visible = true;
        let fun: Function = null;
        let ra = 0;
        let ba = 0;
        this.ui_fun_pic.right = 273;
        this.ui_fun_pic.bottom = 646;
        switch (num) {
            //自动捡钱
            case 1:
                ra = this.ui_money_box.right;
                ba = this.ui_money_box.bottom;

                fun = () => {
                    StaffManager.getInstance().AddDustman(this._userID, this._userDataID);
                }
                break;
            //自动拍照
            case 2:
                ra = this.ui_photo_box.right;
                ba = this.ui_photo_box.bottom;
                fun = () => {
                    StaffManager.getInstance().AddCameraman(this._userID, this._userDataID);
                }
                break;
            //宣传
            case 3:
                ra = this.ui_publicity_box.right;
                ba = this.ui_publicity_box.bottom;
                fun = () => {
                    StaffManager.getInstance().Addpropagandist(this._userID, this._userDataID);
                }
                break;
            default:

                GameUIManager.getInstance().hideUI(UnlockView);
                if (this._function) this._function.run();
                return;
        }

        this.AnimationMove(this.ui_fun_pic, ra, ba, Laya.Handler.create(this, () => {
            if (fun) {
                fun();
            }
            //刷新员工界面信息
            GEvent.DispatchEvent(GacEvent.RefreshUserInfo);
            //
            GameUIManager.getInstance().hideUI(UnlockView);
            if (this._function) this._function.run();
        }));
    }

    /**解锁动画 */
    private AnimationMove(box: any, r: number, b: number, fun: Laya.Handler) {
        Laya.Tween.to(box, { right: r, bottom: b }, 600, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
            fun.runWith(true);
        }));
    }

}
ViewManager.getInstance().SaveViewResUrl(UnlockView, [
    { url: "view/UnLockView.json", type: Laya.Loader.JSON },
]);


