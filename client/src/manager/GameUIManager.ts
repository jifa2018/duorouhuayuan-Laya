import Sprite = Laya.Sprite;
import { LayerManager } from "./LayerManager";
import ClassUtils = Laya.ClassUtils;
import View = Laya.View;
import { Singleton } from "../common/Singleton";
import { ViewLayer, ViewState } from "../game/GameDefine";
import { ViewManager } from "./ViewManager";
import { DefaultStatue_Cfg } from "./ConfigManager";
import { Debug } from "../common/Debug";

export class GameUIManager extends Singleton {
    private uiList: Array<any> = new Array<any>();
    //private static _instance: GameUIManager;
    private uiLayer: Laya.View;
    private topUILayer: Laya.View;
    private itemLayer: Laya.View;
    private downUILayer: Laya.View;

    constructor () {
        super();
        this.uiLayer = LayerManager.getInstance().uiLayer;
        this.topUILayer = LayerManager.getInstance().topUILayer;
        this.itemLayer = LayerManager.getInstance().itemLayer
        this.topUILayer = LayerManager.getInstance().topUILayer
    }


    /***
     * 创建在游戏ui
     * @param cls       ui类名
     * @param params         携带参数
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public createUI(cls: any, params?: Array<any> | any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.uiLayer, params, callBack);
    }

    /***
     * 创建在UI下层显示HP
     * @param cls       ui类名
     * @param params         携带参数
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public createHPUI(cls: any, params?: Array<any> | any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.downUILayer, params, callBack);
    }

    /***
     * 创建在游戏掉落UI层
     * @param cls       ui类名
     * @param params         携带参数
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public createItemUI(cls: any, params?: Array<any> | any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.itemLayer, params, callBack);
    }
    
    /***
     * 创建在顶部UI显示公告
     * @param cls       ui类名
     * @param params         携带参数
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public createTopUI(cls: any, params?: Array<any> | any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.topUILayer, params, callBack);
    }


    /***
     * 显示游戏ui
     * @param cls       ui类名
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public showUI(cls: any, callBack?: Laya.Handler, params?: Array<any> | any): any {
        ViewManager.getInstance().ShowUI(cls, this.uiLayer, params, callBack);
    }

    /***
     * UI下层显示HP
     * @param cls       ui类名
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public showHPUI(cls: any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.downUILayer, cls, callBack);
    }

    /***
     * 显示游戏掉落UI层
     * @param cls       ui类名
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public showItemUI(cls: any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.itemLayer, cls, callBack);
    }
    
    /***
     * 顶部UI显示公告
     * @param cls       ui类名
     * @param callBack        回调 例：Laya.Handler.create(this, (view) => {})
     */
    public showTopUI(cls: any, callBack?: Laya.Handler): any {
        ViewManager.getInstance().ShowUI(cls, this.topUILayer, cls, callBack);
    }


    // /***
    //  * 设置ui显示状态
    //  * @param clsName   ui名称
    //  * @param bShow     是否显示
    //  * @param param     携带参数
    //  */
    // public setUIVisible(clsName: string, bShow: boolean, param: any = null) {
    //     var cls = ClassUtils.getClass(clsName);
    //     if (!cls) {
    //         // throw Error("clss is not regist");
    //         console.log("clss is not regist");
    //         return;
    //     }

    //     var inst: View = this.uiList[clsName];
    //     if (!inst) {
    //         //throw Error("clss is no instance");
    //         console.log("clss is no instance")
    //         return;
    //     }

    //     if (inst.visible != bShow)
    //         inst.visible = bShow;
    // }

    /**
     * 查找并返回 viewClass
     * @param viewClassName UI类名
     */
    public GetViewByClass(viewClass: any): any {
        return ViewManager.getInstance().GetViewByClass(viewClass);
    }


    /**
     * 获取UI状态
     * @param viewClass UI类
     */
    public GetState(viewClass: any): ViewState {
        return ViewManager.getInstance().GetState(viewClass);
        
    }

    // /**
    //  * 销毁ui对象
    //  * @param clsName ui类名
    //  */
    // public destroyUI(cls: any, layer: ViewLayer) {
    //     let view: Laya.View = null;
    //     switch (layer) {
    //         case ViewLayer.UIView:
    //             view = LayerManager.getInstance().uiLayer;
    //             break;
    //         case ViewLayer.HPView:
    //             view = LayerManager.getInstance().downUILayer;
    //             break;
    //         case ViewLayer.GoodsView:
    //             view = LayerManager.getInstance().itemLayer;
    //             break;
    //         case ViewLayer.TopView:
    //             view = LayerManager.getInstance().topUILayer;
    //             break;
    //         default:
    //             view = LayerManager.getInstance().uiLayer;
    //             break;
    //     }
    //     ViewManager.getInstance().DestroyUI(cls, view);
    // }

    /***
     * 隐藏游戏ui
     * @param cls       ui类名
     */
    public hideUI(cls: any): any {
        ViewManager.getInstance().HideUI(cls, this.uiLayer);
    }
    /***
     * 隐藏UI下层显示HP
     * @param cls       ui类名
     */
    public hideHPUI(cls: any): any {
        ViewManager.getInstance().HideUI(cls, this.downUILayer);
    }
    /***
     * 隐藏游戏掉落UI层
     * @param cls       ui类名
     */
    public hideItemUI(cls: any): any {
        ViewManager.getInstance().HideUI(cls, this.itemLayer);
    }
    /***
     * 隐藏顶部UI显示公告
     * @param cls       ui类名
     */
    public hideTopUI(cls: any): any {
        ViewManager.getInstance().HideUI(cls, this.topUILayer);
    }


    /***
     * 销毁游戏ui
     * @param cls       ui类名
     */
    public destroyUI(cls: any): any {
        ViewManager.getInstance().DestroyUI(cls, this.uiLayer);
    }
    /***
     * 销毁UI下层显示HP
     * @param cls       ui类名
     */
    public destroyHPUI(cls: any): any {
        ViewManager.getInstance().DestroyUI(cls, this.downUILayer);
    }
    /***
     * 销毁游戏掉落UI层
     * @param cls       ui类名
     */
    public destroyItemUI(cls: any): any {
        ViewManager.getInstance().DestroyUI(cls, this.itemLayer);
    }
    /***
     * 销毁顶部UI显示公告
     * @param cls       ui类名
     */
    public destroyTopUI(cls: any): any {
        ViewManager.getInstance().DestroyUI(cls, this.topUILayer);
    }

    /**
     * 引导专用
     * 判断UI层 除了主界面是否还有其它界面在展示
     * 在场景中
     */
    public GetOtherUIShow()
    {
        if(this.uiLayer.numChildren>0)
        {
            for(let i=0;i<this.uiLayer.numChildren;i++)
            {
                let ui = this.uiLayer.getChildAt(i) as Laya.View;
                if(ui.name != "MainUIScene" && ui.visible == true && ui.name != "SwitchScene")
                {
                    return true
                }
            }
        }
        return false

    }
    /**
     * 引导专用
     * 判断UI层 是否有界面在此引导之上
     * UI层
     */
    public GetOtherUIShowTop(hir:string)
    {
        let curindex = -1
        let ui = this.uiLayer.getChildByName(hir) as Laya.View;
        if(ui == null)return false
        if(this.uiLayer.numChildren>0)
        {
            for(let i=0;i<this.uiLayer.numChildren;i++)
            {
                let ui = this.uiLayer.getChildAt(i) as Laya.View;
                if(ui.name == hir)
                {
                    curindex = i
                }
                if(i>curindex&&ui.visible == true&&curindex!=-1)
                {
                    return true
                }
            }
        }
        return false

    }
}