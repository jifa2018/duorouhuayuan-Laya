
/**
 * 解锁
 * 2020年9月16日15:01:03
 */

import { ui } from "../../../ui/layaMaxUI"
import { GameUIManager } from "../../../manager/GameUIManager";
import { Player } from "../../player/Player";
import { EffectManager } from "../../../effect/EffectManager";

export class unLockDialog extends ui.view.unLock.unLockDialogUI {

    private lockData: any = null;
    private callBack: Function = null;
    private preconditionTitle: string = null;
    constructor(param) {
        super()
        if (!param) {
            console.log("unLockDialog没有任何参数")
            return
        }
        this.lockData = param[0] || null;     //解锁数据
        this.callBack = param[1] || null;     //点击解锁回调  
        this.preconditionTitle = param[2] || null;   //是否可以解锁      
    }

    onEnable() {
        this.init();
        this.bindEvent();
    }
    onDestroy() {
        this.unLock_btn.offAll();
        this.close_btn.offAll();
    }
    init() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        let canLock = this.preconditionTitle == null;
        let isUnLock = canLock && this.lockData.gold <= Player.getInstance().nGold && this.lockData.unlockstar <= Player.getInstance().nStar;
        this.title.text = this.lockData.struiname;
        this.item_img.skin = this.lockData.stricon;
        this.lock_num.text = this.lockData.unlockstar.toString();
        this.lock_num.color = this.lockData.unlockstar > Player.getInstance().nStar ? "#ff0400" : "#000000";
        this.money_num.text = this.lockData.gold.toString();
        this.money_num.color = this.lockData.gold > Player.getInstance().nGold ? "#ff0400" : "#000000";
        this.star_num.text = this.lockData.star.toString();
        if (canLock) {
            this.preconditionTips.visible = false;
        }
        else {
            this.preconditionTips.text = "前置节点：\n" + this.preconditionTitle + "  未解锁\n请前往解锁!";
            this.preconditionTips.visible = true;
        }
        this.unLock_btn.disabled = !isUnLock;
    }
    bindEvent() {
        this.unLock_btn.on(Laya.Event.CLICK, this, this.unLockEv)
        this.close_btn.on(Laya.Event.CLICK, this, this.closeEv)
    }

    unLockEv() {
        EffectManager.getInstance().BtnEffect(this.unLock_btn);
        if (this.callBack) {
            this.callBack(this.lockData);
        }
        this.closeEv();

    }

    closeEv() {
        GameUIManager.getInstance().destroyUI(this);
    }


}