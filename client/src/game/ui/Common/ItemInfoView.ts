import { ui } from "../../../ui/layaMaxUI"
import { GameUIManager } from "../../../manager/GameUIManager"
import { Succulent_Cfg } from "../../../manager/ConfigManager"
import { EffectManager } from "../../../effect/EffectManager"

export class ItemInfoView extends ui.view.common.ItemInfoViewUI
{
    //物品id
    private _data:any

    constructor(data) {
        super()
        this._data = data
    }
    onEnable() {
        this.OnInit()
        this.OnEvent()
    }
    // public OnShow()
    // {
        
    //     this.OnInit()
    //     this.OnEvent()
    // }
    OnInit()
    {
        this.itemname.text = Succulent_Cfg[this._data].strname
        this.good_pic.skin = Succulent_Cfg[this._data]["striconurl"]
        this.dec.text = Succulent_Cfg[this._data].strdescribe
        this.condivalue.text = Succulent_Cfg[this._data].unlockstar
        this.moneydec.text = Succulent_Cfg[this._data].gold
        this.condi.visible = Number(Succulent_Cfg[this._data].unlockstar)==0 ?false :true
        this.money.visible = Number(Succulent_Cfg[this._data].gold)==0?false:true
    }
    getCurClipNumer(offsetTarget: any, n: number, index: number) {
        let clip = new Laya.Clip("gameui/main/number.png", 10, 1);
        clip.index = n;
        clip.pos(index*16, 0);
        return clip;

    }
    onDisable() {
        this.offAll();
    }
    OnEvent()
    {
        this.btn_click.on(Laya.Event.CLICK,this,function()
        {
            GameUIManager.getInstance().destroyUI(ItemInfoView);
        })
        this.btn_share.on(Laya.Event.CLICK,this,function()
        {
            //按钮特效
            EffectManager.getInstance().BtnEffect(this.btn_share);
            //sGameUIManager.getInstance().destroyUI(StaffInfo);
        })
    }
}