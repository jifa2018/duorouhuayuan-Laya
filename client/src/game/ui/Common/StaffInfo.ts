import { ui } from "../../../ui/layaMaxUI"
import { GameUIManager } from "../../../manager/GameUIManager"
import { Succulent_Cfg } from "../../../manager/ConfigManager"

export class StaffInfo extends ui.view.common.StaffInfoUI
{
    //物品信息
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
        this.itemname.text = Succulent_Cfg[this._data.itemId].strname
        this.good_pic.skin = Succulent_Cfg[this._data.itemId]["striconurl"]
        this.dec.text = Succulent_Cfg[this._data.itemId].strdescribe

        let st:string = this._data.itemNum.toString()
        this.good_num.removeChildren();
        for (let index = 0; index < st.length; index++) {
            const str = Number(st[index]);
            let c = this.getCurClipNumer(this.good_num, str, index);
            this.good_num.addChild(c)
        }
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
        this.bg.on(Laya.Event.CLICK,this,function()
        {
            GameUIManager.getInstance().destroyUI(StaffInfo);
        })
        this.btn_click.on(Laya.Event.CLICK,this,function()
        {
            GameUIManager.getInstance().destroyUI(StaffInfo);
        })
    }
}