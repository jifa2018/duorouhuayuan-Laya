import Handler = Laya.Handler;
import Camera = Laya.Camera;

export default class SceneBase extends Laya.Sprite
{
    public sceneLoaded:boolean = false;
    public scene3d:any = null;
    public camera:Camera;
    constructor() {
        super();
    }

    public onAwake() {
        super.onAwake();
    }

    public onEnable() {
        super.onEnable();
    }

    public onDisable() {
        super.onDisable();
    }

    public destroy(destroyChild?: boolean) {
        super.destroy(destroyChild);
    }

    public onDestroy() {
        super.onDestroy();
    }

    /**
     * 显示场景
     * */
    public showScene(param:any, handler:Handler)
    {

    }

    /**
     * 隐藏场景
     * */
    public hideScene()
    {
        this.removeSelf();
    }

}