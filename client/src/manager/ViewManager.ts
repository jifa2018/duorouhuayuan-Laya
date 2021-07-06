/**
 * 界面管理类
 */
import { ViewState } from "../game/GameDefine";
import { Debug } from "../common/Debug";
import { Singleton } from "../common/Singleton";

export class ViewManager extends Singleton {
    /**UI状态集合 */
    private _stateList: { [index: string]: boolean } = {};

    /*UI实例集合 */
    private _UIViewList: { [index: string]: any } = {}

    /**界面图集资源 */
    private _viewAtlasRes: { [index: string]: Array<any> } = {};

    /**ViewClass集合 */
    private _viewClassList = {}

    public OnStart() {
        this._stateList = {};
        this._viewClassList = {};
    }

    public OnDestroy() {
        this._stateList = {};
    }

    /**
     * 保存界面资源路径
     * @param viewClass UI名
     * @param resArray 
     */
    public SaveViewResUrl(viewClass: any, resArray: Array<any>) {
        if (!viewClass) {
            Debug.LogError("加载UI资源参数有误！");
            return;
        }
        this._viewAtlasRes[viewClass.name] = resArray;
    }

    /**
     * 加载图集资源
     * @param url 资源路径
     * @param loaded 完成回调
     */
    public LoadViewAtlas(viewClass: any, loaded: Laya.Handler) {
        let url: any = this._viewAtlasRes[viewClass.name];
        if (url != null) {
            Laya.loader.load(url, Laya.Handler.create(this, () => {
                loaded.run();
            }));
        }
        else {
            loaded.run();
        }
    }

    //适配
    private Adaptation(view: Laya.View) {
        view.left = 0;
        view.right = 0;
        view.top = 0;
        view.bottom = 0;
    }

    /**
     * 获取UI状态
     * @param viewClass UI类
     */
    public GetState(viewClass: any): ViewState {
        if (!viewClass) {
            Debug.LogError("查询UI状态有误！");
            return ViewState.None;
        }
        if (this._stateList[viewClass.name] == true) {
            return ViewState.Loaded;
        }
        else if (this._stateList[viewClass.name] == false) {
            return ViewState.Loading;
        }
        else {
            return ViewState.None;
        }
    }

    /**
     * 创建UI，异步，不允许存在多个
     * @param viewClass UI类
     * @param hierarchy 层级
     * @param params 额外参数
     * @param callBack 完成回调
     */
    public ShowUI(viewClass: any, hierarchy: Laya.View, params?: Array<any> | any, callBack?: Laya.Handler): void {
        if (!viewClass || !hierarchy) {
            Debug.LogError("创建UI参数有误！");
            return;
        }
        if (this._stateList[viewClass.name] != null) {
            Debug.LogError("此UI已经存在，创建失败！");
            return;
        }
        this._stateList[viewClass.name] = false;
        let view = this._UIViewList[viewClass.name];
        if (view == null) {
            this._Create(viewClass, hierarchy, params, callBack);
        }
        else {
            this._Show(viewClass, hierarchy);
            if (view.onShow) view.onShow();
            if (callBack != null) {
                callBack.runWith(view);
            }
        }
    }

    /**
     * 创建UI，异步，不允许存在多个
     * @param viewClass UI类
     * @param node 节点
     * @param params 额外参数
     * @param callBack 完成回调
     */
    public AddUI(viewClass: any, node: Laya.View, params?: Array<any>, callBack?: Laya.Handler): void {
        if (!viewClass || !node) {
            Debug.LogError("添加UI参数有误！");
            return;
        }

        if (this._stateList[viewClass.name] != null) {
            Debug.LogError("此UI已经存在，创建失败！");
            return;
        }

        this._stateList[viewClass.name] = false;
        this._Create(viewClass, node, params, callBack);
    }


    /**
     * 隐藏UI UI使用
     * @param viewClass UI类
     * @param hierarchy 层级
     */
    public HideUI(viewClass: any, hierarchy: Laya.View): void {
        if (!viewClass || !hierarchy) {
            Debug.LogError("隐藏UI参数有误！");
            return;
        }

        this._Hide(viewClass, hierarchy);
    }

    /**
     * 销毁UI 切换场景
     * @param viewClass UI类
     * @param hierarchy 层级
     */
    public DestroyUI(viewClass: any, hierarchy: Laya.View): void {
        if (!viewClass || !hierarchy) {
            Debug.LogError("销毁UI参数有误！");
            return;
        }

        this._Destroy(viewClass, hierarchy);
    }

    private _Create(viewClass: any, hierarchy: Laya.View, params: Array<any>, callBack?: Laya.Handler): void {
        let __this = this;
        function _load() {
            let view = new viewClass(params);
            view.name = viewClass.name;
            view.width = Laya.stage.width
            view.height = Laya.stage.height
            hierarchy.addChild(view);
            __this.Adaptation(view);
            __this._viewClassList[view.name] = view;
            __this._stateList[viewClass.name] = true;
            __this._UIViewList[viewClass.name] = view;

            if (callBack != null) {
                callBack.runWith(view);
            }
        }
        this.LoadViewAtlas(viewClass, Laya.Handler.create(this, () => {
            _load();
        }));
    }

    private _Show(viewClass: any, hierarchy: Laya.View): void {
        let ui = hierarchy.getChildByName(viewClass.name) as Laya.View;
        if (ui != null) {
            ui.visible = true;
        }
    }

    private _Hide(viewClass: any, hierarchy: Laya.View): void {
        let ui = hierarchy.getChildByName(viewClass.name) as Laya.View;
        if (ui != null) {
            if (this._UIViewList[viewClass.name].onHide) {
                this._UIViewList[viewClass.name].onHide()
            }
            delete this._stateList[viewClass.name];
            ui.visible = false;
        }
    }

    private _Destroy(viewClass: any, hierarchy: Laya.View): void {
        let ui = hierarchy.getChildByName(viewClass.name) as Laya.View;
        if (ui != null) {
            ui.destroy(true);
            this._UIViewList[viewClass.name].offAll()
            if (this._UIViewList[viewClass.name].OnDestroy) {
                this._UIViewList[viewClass.name].OnDestroy()
            }
            delete this._viewClassList[viewClass.name];
            delete this._stateList[viewClass.name];
            delete this._UIViewList[viewClass.name];
        }
    }

    /**
     * 查找并返回 viewClass
     * @param viewClassName UI类名
     */
    public GetViewByClass(viewClass: any): any {
        if (!viewClass) {
            Debug.LogError("参数有误！");
            return;
        }
        return this._viewClassList[viewClass.name];
    }

    /**
     * 查找并返回 viewClass
     * @param name 名字
     */
    public GetViewByName(name: any): any {
        if (!name) {
            Debug.LogError("参数有误！");
            return;
        }
        return this._viewClassList[name];
    }

    /**
     * 按层级销毁UI
     * @param hierarchy 层级名
     */
    public DestroyUIByHie(hierarchy: Laya.View) {
        let viewIndex = [];
        for (let _id = 0; _id < hierarchy.numChildren; _id++) {
            let ui = hierarchy.getChildAt(_id);
            if (ui != null) {
                viewIndex.push(ui.name)
            }
        }
        for (let key = 0; key < viewIndex.length; key++) {
            let _viewName = viewIndex[key];
            let ui = hierarchy.getChildByName(_viewName);
            ui.destroy(true);
            delete this._stateList[ui.name];
            delete this._UIViewList[ui.name];
        }
    }
}

  // // 单例
    // private static _class = null;
    // public static get inst(): ViewManager {
    //     if (this._class == null) {
    //         this._class = new this();
    //     }
    //     return this._class;
    // }
