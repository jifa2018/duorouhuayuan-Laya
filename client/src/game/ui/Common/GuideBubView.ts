import { ui } from "../../../ui/layaMaxUI"

export class GuideBubView extends ui.view.common.GuideBubViewUI
{
    //物品id
    private _data:any

    constructor(data) {
        super()
        this._data = data
    }
    OnInit()
    {
        
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
}