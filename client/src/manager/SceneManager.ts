import Handler = Laya.Handler;
import SceneBase from "../game/scene/SceneBase";
import Sprite = Laya.Sprite;
import {LayerManager} from "./LayerManager";
import {Singleton} from "../common/Singleton";

export class SceneManager extends Singleton
{
    //private static _instance:SceneManager;
    private static _gameScene = null;
    private static _viewScene = null;
    private currentDisplayScene:SceneBase;
    private gameLayer:Sprite;

    constructor()
    {
        super();
        this.gameLayer = LayerManager.getInstance().gameLayer;
    }

    // public static get instance()
    // {
    //     if(!this._instance)
    //     {
    //         this._instance = new this();
    //     }
    //     return this._instance;
    // }

    public openScene(cls:any, param:any = null,complate:Handler = null, closeOther:boolean = true)
    {

        cls.showScene(param, complate);
        this.gameLayer.addChild(cls);
        if(closeOther && this.currentDisplayScene)
        {
            this.currentDisplayScene.hideScene();
            // this.currentDisplayScene.getChildAt(0).getChildAt(0).active = false;
        }
        this.currentDisplayScene = cls;
    }

    public loadScene(url:string, complate:Handler = null)
    {
        Laya.loader.create(url, complate)
    }
}