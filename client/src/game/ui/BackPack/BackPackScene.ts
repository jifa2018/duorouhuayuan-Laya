import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { StaffManager } from "../../../manager/StaffManager";
import { Staff_Cfg, Succulent_Cfg } from "../../../manager/ConfigManager";
import { Utils } from "../../../utils/Utils";
import { LocalStorage } from "../../GameDefine";
import { Timer } from "../../../common/TImer";
import { BagSystem } from "../../bag/BagSystem";
import { CommonDefine } from "../../../common/CommonDefine";
import { Debug } from "../../../common/Debug";
import { StaffInfo } from "../Common/StaffInfo";

/**
 * 主界面
 */
export class BackPackScene extends ui.view.BackPackSceneUI {
    private _dArr = []
    private _zArr = []

    constructor() {
        super();
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.onInit();
        this.onEvent();
    }

    onDisable() {
        this.offAll();
        this.ui_close_button.off(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(BackPackScene);
        });
    }

    public set visible(b:boolean)
    {
        super.visible = b;
        if(b)   this.onEnable()
    }
    /**初始化列表 */
    private onInit() {
        let list = []
        this._dArr = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_DUOROU);
        this._zArr = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_ZHUANGSHI);
        for (let i in this._dArr) {
            list.push(this._dArr[i])
        }
        for (let i in this._zArr) {
            list.push(this._zArr[i])
        }
        this.ui_good_list.array = list
        this.ui_good_list.vScrollBarSkin = ""
        this.ui_good_list.renderHandler = new Laya.Handler(this, this.SetItemInfo);
        this.ui_good_list.selectEnable = true
        this.ui_good_list.selectHandler = new Laya.Handler(this, this.ClickItem);

        this.decorate_list_bg.vScrollBarSkin = ""
        let delist = []
        for (let i = 0; i < Math.ceil(list.length / 3); i++) {
            delist.push(i)
        }
        //this.decorate_list_bg.array = delist
    }

    /**注册事件 */
    private onEvent() {
        this.ui_close_button.on(Laya.Event.CLICK, this, () => {
            GameUIManager.getInstance().hideUI(BackPackScene);
        });
    }

    /**设置物品信息 */
    private SetItemInfo(box: Laya.Box, index: number) {
        //物品图片
        let GoodPic: Laya.Image = box.getChildByName("good_pic") as Laya.Image;
        //物品数量
        let GoodNum: Laya.Label = box.getChildByName("good_num") as Laya.Label;
        let boxnum: Laya.Label = box.getChildByName("boxnum") as Laya.Label;
        let name: Laya.Label = box.getChildByName("label_name") as Laya.Label;

        let bg: Laya.Label = box.getChildByName("bg") as Laya.Label;
        if (index % 3 == 0) {
            bg.visible = true
        }
        let data = this.GetItemInfo(index)
        GoodPic.skin = Succulent_Cfg[data.itemId]["striconurl"]
        name.text = Succulent_Cfg[data.itemId]["strname"]
        GoodNum.text = data.itemNum
        let st = GoodNum.text.length
        boxnum.removeChildren();
        for (let index = 0; index < st; index++) {
            const str = Number(GoodNum.text[index]);
            let c = this.getCurClipNumer(boxnum, str, index);
            boxnum.addChild(c)
        }
    }
    getCurClipNumer(offsetTarget: any, n: number, index: number) {
        let clip = new Laya.Clip("gameui/main/number.png", 10, 1);
        clip.index = n;
        clip.pos(index * 16, 0);
        return clip;

    }
    private ClickItem(index: number) {
        GameUIManager.getInstance().createUI(StaffInfo, this.GetItemInfo(index));
        // if(view.OnShow)
        // {
        //     view.OnShow()
        // }
    }

    private GetItemInfo(index: number) {
        let data = null
        if (index < this._dArr.length) {
            //多肉
            data = this._dArr[index];
        }
        else {
            //装饰
            data = this._zArr[index - (this._dArr.length)];
        }
        return data
    }
}