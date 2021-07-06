import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Matrix4x4 = Laya.Matrix4x4;
import Vector3 = Laya.Vector3;
import Tween = Laya.Tween;
import Handler = Laya.Handler;
import GameScene from "./scene/GameScene";
import Quaternion = Laya.Quaternion;
import MouseController from "./script/MouseController";
import { CommonDefine } from "../common/CommonDefine";
import { SceneManager } from "../manager/SceneManager";
import ViewScene from "./scene/ViewScene";
import { GameUIManager } from "../manager/GameUIManager";
import { SceneRayChecker } from "./ray/SceneRayChecker";
import { LoadingScenes } from "./ui/LoadingScenes";

export class CameraAnimation {
    private inView: boolean = false;

    private qu: Matrix4x4;
    public position: Vector3;
    public rotate: Vector3;
    public rotation: Quaternion;
    public test: Quaternion;
    public camera: Camera;
    public size: number;
    public mouseScript: MouseController;
    private isMoving: boolean;
    private nearView: boolean;

    private durationTime: number = 600;

    constructor() {
        Laya.stage.on(CommonDefine.EVENT_CLICK_TARGET, this, this.beginView);
        Laya.stage.on(CommonDefine.EVENT_ROLL_BACK, this, this.endView);
        // Laya.stage.on(CommonDefine.EVENT_ROLL_SCREEN, this, this.rollScreen);
    }

    public beginView() {
        GameUIManager.getInstance().showUI(LoadingScenes);


        SceneManager.getInstance().openScene(ViewScene.instance);
        //GameUIManager.instance.setUIVisible("SwitchScene", false);
        Laya.stage.event(CommonDefine.EVENT_BEGIN_VIEW);
        return;
        if (this.isMoving || this.nearView) return;
        console.log("beginview!!")
        Laya.stage.event(CommonDefine.EVENT_BEGIN_VIEW);
        this.isMoving = true;
        var camera = GameScene.instance.camera;
        this.mouseScript = camera.getComponent(MouseController);
        this.mouseScript.moveEnable = false;
        this.mouseScript.rotateEnable = true;
        this.mouseScript.scaleEnable = true;

        this.position = camera.transform.position.clone();
        //this.rotate      = camera.parent.transform.rotationEuler.clone();
        //this.rotation    = camera.parent.transform.rotation.clone();
        this.test = camera.transform.rotation.clone();
        this.camera = camera;

        console.log("--position");
        console.log(this.position);
        console.log("--parent rotation");
        console.log(this.rotation);
        console.log("--rotation");
        console.log(this.test);

        this.qu = camera.transform.worldMatrix.clone();

        var cameraNode: Sprite3D = <Sprite3D>GameScene.instance.getScene().getChildByName("Camera_node");
        var pos = cameraNode.transform.position.clone();
        var rot = cameraNode.transform.rotationEuler.clone();
        this.size = camera.orthographicVerticalSize;

        Tween.to(this.camera.transform.position, {
            x: pos.x, y: pos.y, z: pos.z, update: new Handler(this, function () {
                this.camera.transform.position = this.camera.transform.position;
            })
        }, this.durationTime);

        // @ts-ignore
        Tween.to(this.camera.parent.transform.rotationEuler, {
            x: rot.x, y: rot.y, z: rot.z, update: new Handler(this, function () {
                this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
            })
        }, this.durationTime);

        Tween.to(this.camera, { orthographicVerticalSize: 5 }, this.durationTime, null, new Handler(this, function () {
            this.nearView = true;
            this.isMoving = false;
        }));
    }

    public endView() {
        SceneManager.getInstance().openScene(GameScene.instance);
        Laya.stage.event(CommonDefine.EVENT_END_VIEW);

        return;
        if (this.isMoving) return;
        Laya.stage.event(CommonDefine.EVENT_END_VIEW);
        this.isMoving = true;
        this.mouseScript.moveEnable = true;
        this.mouseScript.rotateEnable = false;
        this.mouseScript.scaleEnable = false;


        Tween.to(this.camera.transform.position, {
            x: this.position.x, y: this.position.y, z: this.position.z, update: new Handler(this, function () {
                this.camera.transform.position = this.camera.transform.position;
            })
        }, this.durationTime, null, Handler.create(this, function () {
            console.log("position")
            console.log(this.camera.transform.position)
        }));
        // @ts-ignore
        if (this.camera.parent.transform.rotation.x != this.rotation.x || this.camera.parent.transform.rotation.y != this.rotation.y ||
            // @ts-ignore
            this.camera.parent.transform.rotation.z != this.rotation.z || this.camera.parent.transform.rotation.w != this.rotation.w) {
            // @ts-ignore
            Tween.to(this.camera.parent.transform.rotation, {
                x: this.rotation.x, y: this.rotation.y, z: this.rotation.z, w: this.rotation.w, update: new Handler(this, function () {
                    //   this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                    this.camera.parent.transform.rotation = this.camera.parent.transform.rotation;
                })
            }, this.durationTime, null, Handler.create(this, function () {
                console.log("parent rotation")
                console.log(this.camera.parent.transform.rotation)
            }));
            Tween.to(this.camera.transform.rotation, {
                x: this.test.x, y: this.test.y, z: this.test.z, w: this.test.w, update: new Handler(this, function () {
                    this.camera.transform.rotation = this.camera.transform.rotation;
                    //   this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                    //this.camera.parent.transform.rotationEuler = this.camera.parent.transform.rotationEuler;
                })
            }, this.durationTime, null, Handler.create(this, function () {
                console.log("rotation")
                console.log(this.camera.transform.rotation)
            }));
        }

        Tween.to(this.camera, { orthographicVerticalSize: this.size }, this.durationTime, null, new Handler(this, function () {
            this.nearView = false;
            this.isMoving = false;

            console.log("---------------  orthographicVerticalSize")
            console.log(this.camera.orthographicVerticalSize);
        }));
    }

    public rollScreen(direction: string, camera: Camera) {
        //特殊处理 UI 开启场景左右移动的问题
        if (SceneRayChecker.getInstance().disabledHit) return

        if (direction == "right" && GameScene.instance.canMove("right")) {
            Tween.to(camera.transform.position, {
                x: 9.89, update: new Handler(this, function () {
                    camera.transform.position = camera.transform.position;
                })
            }, 200);
        }
        else if (direction == "left" && GameScene.instance.canMove("left")) {
            Laya.stage.event(CommonDefine.EVENT_BEGIN_ROLL);
            Tween.to(camera.transform.position, {
                x: -7.76, update: new Handler(this, function () {
                    camera.transform.position = camera.transform.position;
                })
            }, 200);
        }

    }

}