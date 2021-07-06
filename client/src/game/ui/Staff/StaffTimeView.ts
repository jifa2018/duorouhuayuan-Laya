import { ui } from "../../../ui/layaMaxUI";
import { Staff_Cfg, Succulent_Cfg, Constant_Cfg } from "../../../manager/ConfigManager";
import { StaffManager } from "../../../manager/StaffManager";
import { GameUIManager } from "../../../manager/GameUIManager";
import { ViewManager } from "../../../manager/ViewManager";
import { EffectManager } from "../../../effect/EffectManager";

/**
 * 主界面
 */
export class StaffTimeView extends ui.view.StaffTimeViewUI {
    /**角色数据 */
    private _goodData: Array<[number, number]> = [];
    /**当前角色选中的id */
    private _goodIndex: number = 0;
    /**循环时间 */
    private timeVoid: void = null;

    constructor () {
        super();
        this.createView(Laya.loader.getRes("view/StaffTimeView.json"));
    }


    onEnable() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.onInit();
        this.onEvent();
    }

    onDisable() {
        this.offAll();
        this.ui_start_button.off(Laya.Event.CLICK, this, this.SureClick);
    }

    private onInit() {

    }

    /**注册事件 */
    private onEvent() {

        this.ui_start_button.on(Laya.Event.CLICK, this, this.SureClick);
        
    }

    /**获取当前角色信息列表 */
    private SetScrollBar() {
        this.ui_stafftime_scroll.changeHandler = new Laya.Handler(this, this.onChange);
        // this.ui_stafftime_scroll.on(Laya.Event.MOUSE_MOVE, this, this.onChangeEnd);
    }

    private onChange() {
        this.ui_stafftime_font.text = "采集"+Math.floor(this.ui_stafftime_scroll.value)*Constant_Cfg[11]["value"]+"分钟";
    }

    /***/
    public SetDataID(index: number = -1) {
        if (index == -1) return;
        //当前选中的索引
        this._goodIndex = index;
        // //解锁皮肤的列表
        let time = 0;
        switch (Staff_Cfg[index]["jobID"]) {
            case 1:
                time = Staff_Cfg[index]["propaganda"];
                break;
            case 2:
                time = Staff_Cfg[index]["clean"];
                break;
            case 3:
                time = Staff_Cfg[index]["takepicture"];
                break;
            case 4:
                time = Staff_Cfg[index]["collectime"];
                break;
        }
        this.ui_stafftime_scroll.max = time / Constant_Cfg[11]["value"];
        this.ui_stafftime_scroll.min = 1;
        this.ui_stafftime_scroll.value = 1;
        // this.ui_stafftime_scroll.rollRatio = 1;
        this.ui_stafftime_scroll.tick = 1;
        this.ui_min_time.text=Constant_Cfg[11]["value"]+"分钟";
        this.ui_max_time.text=time / Constant_Cfg[11]["value"]*Constant_Cfg[11]["value"]+"分钟";
        this.ui_staff_image.skin = Staff_Cfg[index].stricon;
        this.la_id.text = Staff_Cfg[index]["lv"];
        this.SetScrollBar();
        this.onChange();
    }


    /**确定按钮 */
    private SureClick() {
        EffectManager.getInstance().BtnEffect(this.ui_start_button);
        //开始采集
        //StaffManager.getInstance().StartAI(Staff_Cfg[this._goodIndex]["staffID"],this.ui_stafftime_scroll.value*Constant_Cfg[11]["value"]*60);
        GameUIManager.getInstance().hideUI(StaffTimeView);
        
    }

}
ViewManager.getInstance().SaveViewResUrl(StaffTimeView, [
    { url: "view/StaffTimeView.json", type: Laya.Loader.JSON },
]);

