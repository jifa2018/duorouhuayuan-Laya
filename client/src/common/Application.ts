import GameScene from "../game/scene/GameScene";
import { SceneManager } from "../manager/SceneManager";
import { Global } from "../utils/Global";
import { ClassRegister } from "./ClassRegister";
import { GameUIManager } from "../manager/GameUIManager";
import Shader3D = Laya.Shader3D;
import Vector3 = Laya.Vector3;
import { ShaderPreCompile } from "../utils/ShaderPreCompile";
import { RemoteCall } from "../game/net/RemoteCall";
import { DIYScene } from "../game/scene/DIYScene";
import Handler = Laya.Handler;
import { ConfigManager } from "../manager/ConfigManager";
import { PreloadManager } from "../manager/PreloadManager";
import Image = Laya.Image;
import { LoginLogic } from "../game/Login/LoginLogic";
import { GameLink } from "../game/Login/GameLink";
import { MyPlayer } from "../game/MyPlayer";
import { GasToGac } from "./GasToGac";
import { LoadingScenes1 } from "../game/ui/LoadingScenes1";
import { ModelStorage, SaveManager } from "../manager/SaveManager";
import { ViewManager } from "../manager/ViewManager";
import { Debug } from "./Debug";
import { GEvent } from "./GEvent";
import { GacEvent } from "./GacEvent";
import { GuideManager } from "../game/ui/Guide/GuideManager";

export default class Application extends Laya.Script {
    constructor() {
        super();
    }

    /**
     * 组件被激活后执行，此时所有节点和组件均已创建完毕，次方法只执行一次
     */
    onAwake(): void {
        ClassRegister.instance;
        ViewManager.getInstance().OnStart();
    }

    /**
     * 第一次执行update之前执行，只会执行一次
     */
    onStart(): void {
        this.LogicStart();
        this.starApp();
        // this.starApp();
    }

    /**
     * 每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
     */
    onUpdate(): void {
        GEvent.DispatchEvent(GacEvent.OnUpdate)
    }

    /**
     * 每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
     */
    onLateUpdate(): void {
    }

    /**
     * 手动调用节点销毁时执行
     */
    onDestroy(): void {
        this.LogicDestroy();
    }

    public static onLoading() {


        Application.joinScene();

        GameUIManager.getInstance().showTopUI(LoadingScenes1);
    }

    private starApp() {
        Laya.stage.frameRate = "slow";

        LoginLogic.inst.StartLogin();
        // Laya.loader.load("res/image/loading.jpg", Handler.create(this, function () {
        //     // GameUIManager.getInstance().openUI("Login");
        //
        // }))
    }

    private static joinScene() {
        PreloadManager.getInstance().init(Handler.create(this, function () {
            new ConfigManager(Handler.create(this, function () {
                //引导初始化先放这里
                ShaderPreCompile.shaderCompile();

                GuideManager.getInstance().OnStart()
                if(GuideManager.getInstance().FreeCurID!=-1)
                {
                    SceneManager.getInstance().openScene(DIYScene.instance, ["defaulsucculent1", 0, 0, true], Handler.create(this, function () {
                        //DIYScene.instance.checkedPooted(20006);
                    }));
                }
                else
                {
                    SceneManager.getInstance().openScene(GameScene.instance);
                }
                //首次登录直接进入diy
                //todo  判定条件可能需要换成diy内新手引导完成
                // if (SaveManager.getInstance().GetCache(ModelStorage.ConnNum) == 1) {

                // }
                // else {
                    
                // }

            }));
        }))
        return;
    }

    private onSceneLoaded(scene3d) {
    }

    /**逻辑类初始化 */
    private LogicStart() {
        GameLink.inst.OnStart();
        RemoteCall.instance.OnStart();
        GasToGac.inst.OnStart()
        LoginLogic.inst.OnStart();
        MyPlayer.OnStart();
        SaveManager.getInstance().OnStart();


    }

    /**逻辑类销毁 */
    private LogicDestroy() {
        GameLink.inst.OnDestroy();
        RemoteCall.instance.OnDestroy();
        GasToGac.inst.OnDestroy()
        LoginLogic.inst.OnDestroy();
        MyPlayer.OnDestroy();
        SaveManager.getInstance().OnDestroy();
        GuideManager.getInstance().OnDestroy();
    }
}