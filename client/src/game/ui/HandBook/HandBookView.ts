import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { StaffManager } from "../../../manager/StaffManager";
import { Staff_Cfg, Succulent_Cfg, ConfigManager, Succulentpoint_Cfg } from "../../../manager/ConfigManager";
import { Utils } from "../../../utils/Utils";
import { LocalStorage } from "../../GameDefine";
import { Timer } from "../../../common/TImer";
import { BagSystem } from "../../bag/BagSystem";
import { CommonDefine } from "../../../common/CommonDefine";
import { Debug } from "../../../common/Debug";
import { StaffInfo } from "../Common/StaffInfo";
import { ItemInfoView } from "../Common/ItemInfoView";
import { Player } from "../../player/Player";
import { PotManager } from "../../../manager/PotManager";
import { PlantView } from "./PlantView";
import { ViewManager } from "../../../manager/ViewManager";

/**
 * 主界面
 */
export class HandBookView extends ui.view.HandBookViewUI {
    //当前选择的页签
    private seletab = 0
    //页签UI数组
    private views:Array<any>=[]
    constructor() {
        super();
        
    }

    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.SetButton(this.seletab)
        this.onEvent();
    }

    onDisable() {
        this.offAll();
       
    }
    private SetButton(index:number)
    {
        for (let i = 0; i < 3; i++) {
            let btn: Laya.Button = this["btn" + i];
            if (i == index) {
                btn.skin = "gameui/handbook/"+"tab"+i+"_2.png"
            } else {
                btn.skin = "gameui/handbook/"+"tab"+i+"_1.png"
            }
        }
        this.seletab = index;
        
        switch(index)
        {
            case 0:
                this.SetView(PlantView,0)
            break
        }
    }

    /**注册事件 */
    private onEvent() 
    {
        for (let i= 0; i < 4; i++) {
            let btn: Laya.Button = this["btn" + i];
            btn.on(Laya.Event.CLICK, this, this.SetButton, [i])
        }
        this.btn_close.on(Laya.Event.CLICK,this,function()
        {
            GameUIManager.getInstance().hideUI(HandBookView);
        })
    }

    SetView(viewclass:any,index:number)
    {
        for(let i in this.views)
        {
            this.views[index].visible = false
        }
        if(this.views[index]==null)
        {
            let view = new viewclass()
            this.views[index]=view
            if(view.OnShow)
            {
                view.OnShow()
            }
            this.content.addChild(view) 
        }
        else
        {
            if(this.views[index].OnShow)
            {
                this.views[index].OnShow()
            }
            this.views[index].visible = true
        }

    }

    public onHide()
    {
        // for (let i= 0; i < 4; i++) {
        //     let btn: Laya.Button = this["btn" + i];
        //     btn.offAll()
        // }
        // this.btn_close.offAll()
        // for(let i in this.views)
        // {
        //     if(this.views[i].HideUI)
        //     {
        //         this.views[i].HideUI()
        //     } 
        // }
    }
}