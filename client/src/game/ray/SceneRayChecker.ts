import Scene3D = Laya.Scene3D;
import Event = Laya.Event;
import { Tree } from "../item/Tree";
import Vector2 = Laya.Vector2;
import MouseManager = Laya.MouseManager;
import Vector3 = Laya.Vector3;
import Ray = Laya.Ray;
import HitResult = Laya.HitResult;
import Camera = Laya.Camera;
import { Utils } from "../../utils/Utils";
import Sprite3D = Laya.Sprite3D;
import Node = Laya.Node;
import Point = Laya.Point;
import SceneBase from "../scene/SceneBase";
import { NpcBase } from "../npc/NpcBase";
import { SceneItem } from "../item/SceneItem";
import { Singleton } from "../../common/Singleton";
import { Bottom } from "../item/Bottom";
import { BottomCreater } from "../item/BottomCreater";
import { GameUIManager } from "../../manager/GameUIManager";
import { SceneManager } from "../../manager/SceneManager";
import { DIYScene } from "../scene/DIYScene";
import { Potted } from "../item/Potted";
import { Decorate } from "../item/Decorate";
import Sprite = Laya.Sprite;
import { Debug } from "../../common/Debug";
import { SceneItemCreater } from "../item/SceneItemCreater";
import { StaffBase } from "../Staff/StaffBase";
// import { CarEditor } from "../edit/CarEditor";
import GameScene from "../scene/GameScene";
import Box = Laya.Box;
import Image = Laya.Image;
import { CommonDefine } from "../../common/CommonDefine";
import { CollectMapDataManager } from "../../manager/CollectMapDataManager";
import Button = Laya.Button;
import { PotManager } from "../../manager/PotManager";
import { FlowerpotSelView } from "../ui/Flowerpot/FlowerpotSelView";
import { PointFlowerStateView } from "../ui/FlowerState/PointFlowerStateView";
import { ContentTip } from "../ui/ContentTip/ContentTip";
import { GatherView } from "../ui/Gather/GatherView";
import { Illustrated } from "../ui/Illustrated/Illustrated";
import { StaffView } from "../ui/Staff/StaffView";
import { MyPlayer } from "../MyPlayer";
import { DecorateViewScene } from "../ui/Decorate/DecorateVIew";
import { LandManager } from "../../manager/LandManager";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";
import { GuideManager } from "../ui/Guide/GuideManager";
import { DiyChangePot } from "../ui/DiyView/DiyChangePot";

export class SceneRayChecker extends Singleton {
    private _sceneBase: SceneBase;
    private _scene: Scene3D;
    private _camera: Camera;
    private _target: Sprite3D = null;
    private point: Vector2 = new Vector2();
    public disabledHit = false //禁止射线检测
    private ray: Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));

    private pressPoint: Point = new Point();
    private touchDistance: number = 100;
    private outHitResult: HitResult = new HitResult();

    // public static get instance() {
    //     if (!SceneRayChecker._instance)
    //         SceneRayChecker._instance = new SceneRayChecker();
    //     return SceneRayChecker._instance;
    // }

    public initChecker(scene: SceneBase): void {
        Laya.stage.on(Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);

        this._sceneBase = scene;
        this._scene = scene.scene3d;
        this._camera = scene.camera;
    }

    public clearChecker(): void {
        Laya.stage.off(Event.MOUSE_DOWN, this, this.onMouseDown);
        // Laya.stage.off(Event.MOUSE_MOVE, this, this.onDragMove);
        // Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp);

        this._sceneBase = null;
        this._scene = null;
        this._camera = null;
    }

    private onMouseUp(e: Event) {
        // GameScene.instance.carEditor.endDrag();
        if (e.target != Laya.stage) return;
        if (e.target.name == "bubble") return;
        if (this.disabledHit) return;
        this.point.x = MouseManager.instance.mouseX;
        this.point.y = MouseManager.instance.mouseY;

        if (this.pressPoint.x != -1 && this.pressPoint.y != -1) {
            if (e["stageX"] - this.pressPoint.x > this.touchDistance) {
                //右移
                Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", this._camera]);
                return;
            }
            else if (this.pressPoint.x - e["stageX"] > this.touchDistance) {
                //左移
                Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", this._camera]);
                return;
            }
        }



        //产生射线
        this._camera.viewportPointToRay(this.point, this.ray);
        //拿到射线碰撞的物体
        this._scene.physicsSimulation.rayCast(this.ray, this.outHitResult);
        //如果碰撞到物体
        if (this.outHitResult.succeeded) {
            this.execUpEvent(this.outHitResult.collider.owner);
        }
        this._target = null;
        this.pressPoint.x = -1;
        this.pressPoint.y = -1;
    }

    private onMouseDown(e: Event) {
        if (e.target != Laya.stage) return;
        this.pressPoint.x = -1;
        this.pressPoint.y = -1;
        if (e.target.name == "bubble") return;
        if (e.target instanceof Box) return;
        if (e.target instanceof Image) return;
        if (e.target instanceof Button) return;
        if (this.disabledHit) return;
        this.point.x = MouseManager.instance.mouseX;
        this.point.y = MouseManager.instance.mouseY;
        //产生射线
        this._camera.viewportPointToRay(this.point, this.ray);
        //拿到射线碰撞的物体
        this._scene.physicsSimulation.rayCast(this.ray, this.outHitResult);
        //如果碰撞到物体
        if (this.outHitResult.succeeded) {
            this.execDownEvent(this.outHitResult.collider.owner);
        }

        this.pressPoint.x = e["stageX"];
        this.pressPoint.y = e["stageX"];
    }

    private onMouseMove(e: Event) {
        if (e.target != Laya.stage) return;
        // GameScene.instance.carEditor.onDragMove(e);
    }

    private execDownEvent(rat: any): void {
        if (rat.name.indexOf("defaulsucculent") != -1 || rat.name.indexOf("defaultStatueNode") != -1
            || rat.name.indexOf("mapNode") != -1) {
            this._target = rat;
            // SceneManager.getInstance().openScene(DIYScene.instance, rat.name);
        }
        if (rat.parent instanceof NpcBase) {
            (rat.parent as NpcBase).onClick();
        }
        if (rat.parent instanceof StaffBase) {
            (rat.parent as StaffBase).onClick();
            // if (rat.parent instanceof Gatherman)
            //     GameScene.instance.carEditor.beginDrag(rat.parent);
        }
        else if (rat.parent instanceof SceneItem) {
            //(rat.parent as SceneItem).onClick();
            SceneItemCreater.getInstance().pickItemNearby(this._camera, rat.parent);
            GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, rat)
        } else if (rat.parent instanceof Bottom) {
            let bottom: Bottom = rat.parent;
            if (bottom instanceof Bottom) {
                this._target = bottom;
                // BottomCreater.getInstance().curSelectBottom(bottom);
                // GameUIManager.getInstance().openUI("DecorateViewScene");
            }
        } else if (rat.parent instanceof Decorate) {
            let bottom: Bottom = rat.parent.parent.parent.parent;
            if (bottom instanceof Bottom) {
                this._target = bottom;
                // BottomCreater.getInstance().curSelectBottom(bottom);
                // GameUIManager.getInstance().openUI("DecorateViewScene");
            }
        } else if (rat.name.indexOf("_collectpoint") != -1) {
            this._target = rat;
        }
        else if (rat.parent && rat.parent.parent instanceof Potted) {
            this._target = rat.parent;
            // GameUIManager.getInstance().setUIVisible("LoadingScene1", true);
            // SceneManager.getInstance().openScene(DIYScene.instance);
        } else if (rat.name == "HY_fangzi01" || rat.name == "HY_fangzi02" || rat.name.indexOf("gaoshipai_1") != -1) {
            this._target = rat;
        }
    }

    private OpenFlowerStateView(name) {
        if (!name) return
        let tPoint = PotManager.getInstance().PotMap[name];
        let potData = [];
        let nLength = 0;
        if (tPoint) {
            for (const key in tPoint.PotList) {
                nLength++;
            }
        }

        if (nLength <= 0) {
            SceneManager.getInstance().openScene(DIYScene.instance, [name, 0]);
            return;
        }
        GameUIManager.getInstance().createUI(PointFlowerStateView, [name]);
    }

    private execUpEvent(rat: any): void {
        if ((rat.name.indexOf("defaulsucculent") != -1 || rat.name.indexOf("defaultStatueNode") != -1
        || rat.name.indexOf("mapNode") != -1) && this._target == rat) {
            // SceneManager.getInstance().openScene(DIYScene.instance, rat.name);
            // GameUIManager.getInstance().openUI("PointFlowerStateView", [rat.name]);
            //this.OpenFlowerStateView(rat.name)
            LandManager.getInstance().checkLandState(rat.name);
        }
        else if (rat.parent instanceof Bottom) {
            let bottom: Bottom = rat.parent;
            if (bottom instanceof Bottom && bottom == this._target) {
                BottomCreater.getInstance().curSelectBottom(bottom);
                GameUIManager.getInstance().showUI(DecorateViewScene);
            }
        } else if (rat.parent instanceof Decorate) {
            let bottom: Bottom = rat.parent.parent.parent.parent;
            if (bottom instanceof Bottom && bottom == this._target) {
                BottomCreater.getInstance().curSelectBottom(bottom);
                GameUIManager.getInstance().showUI(DecorateViewScene);
            }
        } else if (rat.parent && rat.parent.parent instanceof Potted && rat.parent == this._target) {
            // GameUIManager.getInstance().setUIVisible("LoadingScene1", true);
            //SceneManager.getInstance().openScene(DIYScene.instance, rat.parent.parent.parent.name);
            // GameUIManager.getInstance().openUI("PointFlowerStateView", [rat.parent.parent.parent.name]);
            this.OpenFlowerStateView(rat.parent.parent.parent.name)
        }
        else if (rat.name.indexOf("_collectpoint") != -1) {
            if (this._target == rat) {
                GameUIManager.getInstance().destroyUI(ContentTip)
                GameUIManager.getInstance().createUI(ContentTip, [rat.name])
            }
        }
        else if (rat.name == "HY_fangzi01") {
            if (this._target == rat) {
                //点击了一个房子
                GameUIManager.getInstance().showUI(GatherView)
            }
        } else if (rat.name == "HY_fangzi02") {
            if (this._target == rat) {
                //点击了一个房子
                GameUIManager.getInstance().showUI(StaffView)

            }
        } else if (rat.name.indexOf("gaoshipai_1") != -1) {
            if (this._target == rat) {
                var name = rat.name;
                var mapId: number = Number(name.substr(name.indexOf("_") + 1, name.length))
                var mapLevel: number = CollectMapDataManager.getInstance().getMaxMapLevel(mapId);
                GameUIManager.getInstance().createUI(Illustrated, [mapId, mapLevel]);
            }
        }
        GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, rat)
    }

}