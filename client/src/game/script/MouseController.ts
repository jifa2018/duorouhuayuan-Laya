import Sprite3D = Laya.Sprite3D;
import Tween = Laya.Tween;
import { Global } from "../../utils/Global";
import MeshSprite3D = Laya.MeshSprite3D;
import Plane = Laya.Plane;
import Vector3 = Laya.Vector3;
import HitResult = Laya.HitResult;
import Point = Laya.Point;
import MouseManager = Laya.MouseManager;
import Vector2 = Laya.Vector2;
import GameScene from "../scene/GameScene";
import { CommonDefine } from "../../common/CommonDefine";
import { SoundManager } from "../../manager/SoundManager";
import { SceneManager } from "../../manager/SceneManager";
import ViewScene from "../scene/ViewScene";
import { Debug } from "../../common/Debug";

export default class MouseController extends Laya.Script3D {
    public rotateEnable: boolean = false;
    public moveEnable: boolean = true;
    public scaleEnable: boolean = false;

    private emptyNode: Sprite3D;
    private camera: Laya.Camera;
    private isPress: boolean;
    private pressPoint: Laya.Point;

    private lookTarget: Sprite3D;
    private touchDistance:number = 100;

    //todo
    private testMusic: boolean = false;
    private movePoint: Point = new Point();

    private hitResult: Laya.HitResult = new Laya.HitResult();
    private hitName: any;
    private ray: Laya.Ray = new Laya.Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    private static clickPoint: Vector2 = new Vector2();

    constructor() {
        super();
    }

    public onAwake(): void {
        this.emptyNode = new Sprite3D();
        this.pressPoint = new Laya.Point();
    }

    public onEnable() {
        super.onEnable();
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rMouseDown);
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.rMouseUp);

        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseWhell);

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, this.mouse2Down);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.mouseDown);

        Laya.stage.on(Laya.Event.TRIGGER_EXIT, this, this.mouseUp);

        this.isPress = false;
        this.camera = this.owner as Laya.Camera;
    }

    public onDisable() {
        super.onDisable();

        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rMouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.rMouseUp);
        Laya.stage.off(Laya.Event.MOUSE_WHEEL, this, this.mouseWhell);
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.KEY_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.TRIGGER_EXIT, this, this.mouseUp);

    }

    public setCameraCenter(sp3d: Sprite3D) {
        this.camera = this.owner as Laya.Camera;
        let temp = this.camera.transform.position.clone();
        let parentNode = this.owner.parent;
        this.emptyNode.addChild(this.camera);
        parentNode.addChild(this.emptyNode);

        this.emptyNode.transform.position = sp3d.transform.position.clone();
        this.camera.transform.position = temp;

    }

    public setTarget(target: Sprite3D) {
        this.lookTarget = target;
    }

    private rMouseDown(e: Event) {
        this.isPress = true;
        this.pressPoint.x = e["stageX"];
        this.pressPoint.y = e["stageX"];
    }

    private rMouseUp(e: Event) {
        this.isPress = false;
    }

    private mouseWhell(e: Event) {
        return;
        if (!this.scaleEnable) return;
        if (e["delta"] > 0) {
            this.camera.fieldOfView -= 0.5;
        }
        else {
            this.camera.fieldOfView += 0.5;
        }
    }

    private mouseDown(e: Event) {
        if (Global.sceneLock) return;
        //todo
        if (!this.testMusic) {
            SoundManager.getInstance().playMusic("res/sound/bg.mp3");
            this.testMusic = true;
        }
        // @ts-ignore
        if (e.touches && e.touches.length > 1) {
            // @ts-ignore
            var touches = e.touches;
            this.lastDistance = Math.sqrt(Math.pow((touches[0].clientX - touches[1].clientX), 2) + Math.pow((touches[0].clientY - touches[1].clientY), 2));
            return;
        }

        if (!this.rotateEnable) {
            this.hitName = this.checkHit();
        }
        else {
            this.isPress = true;
        }
        this.pressPoint.x = e["stageX"];
        this.pressPoint.y = e["stageX"];
        //this.emptyNode.transform.rotate(new Laya.Vector3(0,1,0), true, false);
    }

    private lastDistance: number;
    private mouseMove(e: Event) {
        if (Global.sceneLock) return;
        let _is = e["stageY"] < Laya.stage.height / 2 ? false : true;
        if (!_is) return
        // @ts-ignore
        if (e.touches && e.touches.length > 1 && this.scaleEnable) {
            // @ts-ignore
            var touches = e.touches;
            var l: number = Math.sqrt(Math.pow((touches[0].clientX - touches[1].clientX), 2) + Math.pow((touches[0].clientY - touches[1].clientY), 2));

            var len: number = this.lastDistance - l;
            if (len > 0 && this.camera.orthographicVerticalSize > 6 || len < 0 && this.camera.orthographicVerticalSize < 3.5)
                return;;
            this.camera.orthographicVerticalSize += len / 40;
            this.lastDistance = l;
            this.pressPoint.x = e["stageX"];
            this.pressPoint.y = e["stageX"];
        }
        else {
            if (this.isPress && this.rotateEnable && this.lookTarget) {
                let dist: number = this.pressPoint.x - e["stageX"];
                Global.tempVector3.x = 0;
                Global.tempVector3.y = -dist / 5;
                Global.tempVector3.z = 0;
                //this.emptyNode.transform.rotate(Global.tempVector3, true, false);
                this.lookTarget.transform.rotate(Global.tempVector3, true, false);
                this.pressPoint.x = e["stageX"];
                this.pressPoint.y = e["stageX"];
            }
        }
    }

    private mouseUp(e: Event) {
        if (Global.sceneLock) return;
        if (this.isPress) this.isPress = false;
        if (!this.moveEnable) return;
        this.isPress = false;
        // if (e["stageX"] - this.pressPoint.x > this.touchDistance) {
        //     //右移
        //     Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", this.camera]);
        //     // if(GameScene.instance.canMove("right"))
        //     //      Tween.to(this.camera.transform, {localPositionX: this.camera.transform.localPositionX+12.4},200);
        // }
        // else if (this.pressPoint.x - e["stageX"] > this.touchDistance) {
        //     //左移
        //     Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", this.camera]);
        //     // if(GameScene.instance.canMove("left"))
        //     //      Tween.to(this.camera.transform, {localPositionX: this.camera.transform.localPositionX-12.4},200);
        // }

        if (this.hitName == this.checkHit() && this.hitName != null) {
            Laya.stage.event(CommonDefine.EVENT_CLICK_TARGET, [this.hitName, this.camera]);
        }
    }

    private mouse2Down(e: Event) {
        // Laya.stage.event("rollBack", [this.hitName, this.camera]);
    }

    private checkHit(): any {
        return null;
        MouseController.clickPoint.x = MouseManager.instance.mouseX;
        MouseController.clickPoint.y = MouseManager.instance.mouseY;
        this.camera.viewportPointToRay(MouseController.clickPoint, this.ray);
        this.camera.scene.physicsSimulation.rayCast(this.ray, this.hitResult);
        if (this.hitResult.succeeded) {
            return this.hitResult.collider.owner;
        }

        return null;
    }
}