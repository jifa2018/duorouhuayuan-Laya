import Sprite = Laya.Sprite;
import { Singleton } from "../common/Singleton";
import GameConfig from "../GameConfig";
import Browser = Laya.Browser;
import {WxSDKManager} from "../platform/WxSDKManager";
import {MyPlayer} from "../game/MyPlayer";

export class LayerManager extends Singleton {
    //private static _instance:LayerManager;

    /**ui顶层， 显示公告等*/
    public topUILayer: Laya.View;
    /**ui层， 显示游戏ui*/
    public uiLayer: Laya.View;
    /**ui下层 显示血条等**/
    public downUILayer:Laya.View;
    /**ui层， 显示游戏掉落*/
    public itemLayer: Laya.View;
    /**3d游戏层， 显示游戏*/
    public gameLayer: Sprite;
    /**根节点*/
    public root: Sprite;

    /** 引导层UI */
    public GuideView:Laya.View;

    private offset:number = 40;

    constructor() {
        super();
        this.initGameLayer();
    }

    // public static get instance():LayerManager
    // {
    //     if(!this._instance)
    //         this._instance = new LayerManager();
    //     return this._instance;
    // }

    private initGameLayer() {
        this.root = new Sprite();

        function Load(viewName: string): Laya.View {
            let view = new Laya.View();
            view.width = GameConfig.width;
            view.height = GameConfig.height;
            // view.centerX = 0;
            // view.centerY = 0;
            view.mouseThrough = true;
            view.name = viewName;
            // Laya.stage.addChild(view);
            return view;
        }

        this.topUILayer = Load("topUILayer");
        this.uiLayer = Load("uiLayer");
        this.itemLayer = Load("itemLayer");
        this.downUILayer = Load("downUILayer");
        this.GuideView = Load("GuideView")
        this.gameLayer = new Sprite();
        // this.uiLayer.width = Laya.stage.width;
        // this.uiLayer.height = Laya.stage.height;
        if(Browser.onWeiXin)
        {
            if(MyPlayer.wxSDK.systemInfo)
            {
                var d = MyPlayer.wxSDK.systemInfo;
                if(d.model.indexOf("iPhone X")!= -1 || d.model.indexOf("iPhone XR")!=-1 ||
                    d.model.indexOf("iPhone 11")!= -1 || d.model.indexOf("iPhone XS Max")!= -1||
                    d.model.indexOf("iPhone XS") != -1) {
                    {
                        this.itemLayer.top = this.offset
                        this.downUILayer.top = this.offset
                        this.uiLayer.top = this.offset
                        this.GuideView.top = this.offset

                        // this.itemLayer.pos(0,this.offset)
                        // this.downUILayer.pos(0,this.offset)
                        // this.uiLayer.pos(0,this.offset)
                        // // this.topUILayer.pos(0,this.offset)
                        // this.GuideView.pos(0,this.offset)
                    }
                }
            }

        }

        this.root.addChild(this.gameLayer);
        this.root.addChild(this.itemLayer);
        this.root.addChild(this.downUILayer);
        this.root.addChild(this.uiLayer);
        this.root.addChild(this.topUILayer);
        this.root.addChild(this.GuideView);
        this.itemLayer.mouseEnabled = true;
        this.topUILayer.mouseEnabled = true;
        this.gameLayer.mouseEnabled = true;
        this.uiLayer.mouseEnabled = true;

        this.itemLayer.mouseThrough = true;
        this.topUILayer.mouseThrough = true;
        this.gameLayer.mouseThrough = true;
        this.uiLayer.mouseThrough = true;
        this.downUILayer.mouseThrough = true;

        Laya.stage.addChild(this.root);
        this.gameLayer.name = "gameLayer";
        // this.downUILayer.name = "downUILayer";
        // this.itemLayer.name = "itemLayer";
        // this.uiLayer.name = "uiLayer";
        // this.topUILayer.name = "topUILayer";
        this.root.name = "root";
        this.uiLayer.zOrder = 10;
        this.topUILayer.zOrder = 11;
        this.GuideView.zOrder = 12;
    }
}