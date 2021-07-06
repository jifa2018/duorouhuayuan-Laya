import SceneBase from "./SceneBase";
import Handler = Laya.Handler;
import MouseController from "../script/MouseController";
import { Utils } from "../../utils/Utils";
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import ShadowMode = Laya.ShadowMode;
import Scene3D = Laya.Scene3D;
import MeshSprite3D = Laya.MeshSprite3D;
import DirectionLight = Laya.DirectionLight;
import { GameUIManager } from "../../manager/GameUIManager";
import { DiyView } from "../ui/DiyView/DiyView";
import { LoadingScenes } from "../ui/LoadingScenes";
import { DiyChangePot } from "../ui/DiyView/DiyChangePot";

export default class ViewScene extends SceneBase {
    //private camera: Laya.Camera;
    private light: any;
    private ground: Sprite3D;
    private script3d: MouseController;

    private static _instance = null;
    constructor() {
        super();
    }

    public static get instance() {
        if (!ViewScene._instance)
            ViewScene._instance = new ViewScene();
        return ViewScene._instance;
    }

    public showScene(param: any, handler: Handler) {
        //  Laya.timer.once(2000, this, function () {
        super.showScene(param, handler);
        if (!this.scene3d || !this.sceneLoaded) {
            Laya.loader.create("res/scene/viewscene/Scenes_duorou.ls", Handler.create(this, this.onSceneLoaded, [handler]))
        }
        else {
            this.addChild(this.scene3d);
        }
        //   })

    }

    // public hideScene() {
    //     super.hideScene();
    //     this.script3d.enabled=false;
    // }

    private onSceneLoaded(handler: Handler, scene3d: Scene3D) {

        this.addChild(scene3d);
        if (!this.camera) {
            this.light = scene3d.getChildByName("Spot Light (1)") as DirectionLight;
            this.ground = scene3d.getChildByName("Object").getChildByName("dimian") as MeshSprite3D;
            //this.ground = scene3d.getChildByName("DR_dimian");
            // //地面接收阴影
            // @ts-ignore
            this.ground.meshRenderer.receiveShadow = true;
            // @ts-ignore
            this.camera = scene3d._cameraPool[0];
            this.script3d = this.camera.addComponent(MouseController);

            this.scene3d = scene3d;
            this.script3d.rotateEnable = true;
            this.script3d.moveEnable = false;
            this.script3d.scaleEnable = true;

            Utils.createBloom(this.camera, { intensity: 4, threshold: 1.1, softKnee: 0.5, clamp: 65472, diffusion: 5, anamorphicRatio: 0.0, color: new Laya.Color(1, 0.84, 0, 1), fastMode: true });
            //scene3d.fogRange

            this.loadPlant()
        }
        else {
            Laya.timer.once(2000, this, function () {
                GameUIManager.getInstance().hideUI(LoadingScenes);
            })
        }



    }

    private loadPlant() {
        Laya.loader.create("res/plant/Succulent_zu01.lh", Handler.create(this, function (sp3d: Sprite3D) {


            // @ts-ignore
            sp3d = sp3d.clone();
            sp3d.transform.position = new Vector3(0, -0.2, 0);
            sp3d.transform.rotationEuler = new Vector3(0, 0, 0);

            //  sp3d.active = false;
            this.scene3d.addChild(sp3d);

            Utils.setMeshCastShadow(sp3d, true);
            this.script3d.setCameraCenter(sp3d);
            this.script3d.setTarget(sp3d);

            // //灯光开启阴影
            this.light.shadowMode = ShadowMode.Hard;
            //  this.light.ShadowCascadesMode = ShadowCascadesMode.NoCascades;
            this.light.shadowDistance = 4;
            this.light.shadowResolution = 1024;
            this.light.shadowDepthBias = 1.0;
            this.light.shadowStrength = 0.6;
            (this.light as DirectionLight).shadowNearPlane = 0.001;
            //




            // this.scene3d.
            //


            Laya.timer.once(2000, this, function () {
                GameUIManager.getInstance().hideUI(LoadingScenes);
                //loading结束暂时先在这里调用
                GameUIManager.getInstance().showUI(DiyChangePot)
            })
        }))

    }

}