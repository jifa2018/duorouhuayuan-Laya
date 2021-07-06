

/**
 * 2020年9月8日14:30:23
 * 登录
 */

import { ui } from "../../../ui/layaMaxUI";
import { Player } from "../../player/Player";
import Application from "../../../common/Application";
import { GameUIManager } from "../../../manager/GameUIManager";
import { LoginLogic } from "../../Login/LoginLogic";
import {WxSDKManager} from "../../../platform/WxSDKManager";
import Handler = Laya.Handler;

export class Login extends ui.view.Login.LoginViewUI {

    constructor(param) {
        super()
    }

    onEnable() {
        this.init();
        this.bindEvent();
    }


    onDestroy() {
        this.loginBtn.offAll();
    }

    init() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.loginInput.text = "";
    }

    bindEvent() {
        this.loginBtn.on(Laya.Event.CLICK, this, this.onLoginBtnClick);
    }


    onLoginBtnClick() {
        let _t: string = this.loginInput.text;

        // if (Laya.Browser.window.wx)
        // {
        //
        // }
        // else
        // {
        //
        // }
        var sdk:WxSDKManager = new WxSDKManager({});
        sdk.Login({successFn : Handler.create(this, function (ret) {
                debugger;
                LoginLogic.inst.Login(ret.openid);
            })})
        // sdk.Login({successFn:function (ret) {
        //         debugger
        //         LoginLogic.inst.Login(this.loginInput.text);
        //     }, failFn:function () {
        //         console.log("登录失败");
        //     }});
        if (_t == "") {
            return
        }



        LoginLogic.inst.Login(this.loginInput.text);

        // Player.getInstance().setName(_t);
        // Player.getInstance().refreshStorage();
        // this.loginInput.text = "";
        // Application.onLoading();
        // GameUIManager.getInstance().destroyUI("Login");
    }






}