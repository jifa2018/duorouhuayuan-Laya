import SceneBase from "./SceneBase";
import Handler = Laya.Handler;
import Scene3D = Laya.Scene3D;
import { Utils } from "../../utils/Utils";
import { GameUIManager } from "../../manager/GameUIManager";
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import Event = Laya.Event;
import MouseManager = Laya.MouseManager;
import Point = Laya.Point;
import Vector2 = Laya.Vector2;
import HitResult = Laya.HitResult;
import Node = Laya.Node;
import { Tree } from "../item/Tree";
import { CommonDefine } from "../../common/CommonDefine";
import MouseController from "../script/MouseController";
import { Debug } from "../../common/Debug";
import { DiyToolView } from "../ui/DiyView/DiyToolView";
import { Potted } from "../item/Potted";
import { Global } from "../../utils/Global";
import MeshSprite3D = Laya.MeshSprite3D;
import DirectionLight = Laya.DirectionLight;
import ShadowMode = Laya.ShadowMode;
import { Tree_Cfg, Succulent_Cfg } from "../../manager/ConfigManager";
import Box = Laya.Box;
import Button = Laya.Button;
import Image = Laya.Image;
import { PotManager } from "../../manager/PotManager";
import { BagSystem } from "../bag/BagSystem";
import { DiyView } from "../ui/DiyView/DiyView";
import { SwitchScene } from "../ui/SwitchScene";
import { LoadingScenes1 } from "../ui/LoadingScenes1";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
import { DIYFinishView } from "../ui/DiyView/DIYFinishView";
import { ViewManager } from "../../manager/ViewManager";
import { GEvent } from "../../common/GEvent";
import { GacEvent } from "../../common/GacEvent";
import { DiyChangePot } from "../ui/DiyView/DiyChangePot";
import { ResourceManager } from "../../manager/ResourceManager";

export class DIYScene extends SceneBase {

    private static _instance = null;
    private potted: Potted;
    private pottedDefult: Sprite3D;
    public _dragTarget: Sprite3D = null;
    private _editTarget: Tree = null;
    private _isMouseDown: boolean;
    private _editorTargetDown: boolean;
    private _selectTarget: boolean;
    private script3d: any;
    private isMove: boolean;
    private curCheckedTree: Tree = null;
    private caneraAngleTime: number = 600;
    private point: Vector2 = new Vector2();
    private offset: Vector2 = new Vector2();
    private _editorMode: boolean;
    private _touchPoint: Point = new Point();
    private _closeDistance: number = 2;

    private ground: any;
    private light: any;

    private _pointName: string;
    private _pointIndex: number;
    private _enterType = 0;//0：新建多肉 1：编辑多肉
    private _frontPos: Vector3;
    private _frontRot: Vector3;
    private _topPos: Vector3;
    private _topRot: Vector3;
    private isfirst: boolean = false //是否第一次进入  引导相关
    private _size: number;

    private _callback;

    private _treeData: any = null; //拖动之前数据存放

    private isopendrag = false
    public set OpenDrag(value: boolean) {
        this.isopendrag = value
        if (this.script3d != null) {
            if (value) {
                this.script3d.rotateEnable = true;
                this.script3d.moveEnable = false;
                this.script3d.scaleEnable = true;
            }
            else {
                this.script3d.rotateEnable = value;
                this.script3d.moveEnable = value;
                this.script3d.scaleEnable = value;
            }

        }

    }
    constructor() {
        super();

    }

    public onEnable() {
        super.onEnable();
        Laya.stage.on(Event.MOUSE_DOWN, this, this.onDragBegin);
        Laya.stage.on(Event.MOUSE_MOVE, this, this.onDragMove);
        Laya.stage.on(Event.MOUSE_UP, this, this.onDragEnd);
        Laya.stage.on(CommonDefine.EVENT_CREATE_TREE, this, this.createTree);
        Laya.stage.on(CommonDefine.EVENT_CHECKED_POTTED, this, this.checkedPooted);
        Laya.stage.on(CommonDefine.EVENT_CHECKED_POTTED_FINISH, this, this.checkedPottedFinish)
        Laya.stage.on(CommonDefine.EVENT_DIY_RESET_TREE, this, this.cancelAfter)
        Laya.stage.on(CommonDefine.EVENT_POTTED_CHANGEED, this, this.initCameraData);
    }

    public onDisable() {
        super.onDisable();
        Laya.stage.off(Event.MOUSE_DOWN, this, this.onDragBegin);
        Laya.stage.off(Event.MOUSE_MOVE, this, this.onDragMove);
        Laya.stage.off(Event.MOUSE_UP, this, this.onDragEnd);
        Laya.stage.off(CommonDefine.EVENT_CREATE_TREE, this, this.createTree);
        Laya.stage.off(CommonDefine.EVENT_CHECKED_POTTED, this, this.checkedPooted);
        Laya.stage.off(CommonDefine.EVENT_CHECKED_POTTED_FINISH, this, this.checkedPottedFinish)
        Laya.stage.off(CommonDefine.EVENT_DIY_RESET_TREE, this, this.cancelAfter)
        Laya.stage.off(CommonDefine.EVENT_POTTED_CHANGEED, this, this.initCameraData)
    }

    public get editorMode(): boolean {
        return this._editorMode;
    }

    public set editorMode(b: boolean) {
        this._editorMode = b;
        if (b) {
            this.potted.setSelect(this._editTarget);
            this._selectTarget = true;
            this.script3d.rotateEnable = false;
        }
        else {
            this._editTarget = null;
            this.potted.clearSelect();
            this.script3d.rotateEnable = true;
        }
    }

    public set editTarget(tar: any) {
        this._editTarget = tar;
    }

    /**当前选中的tree */
    public get getCurCheckedTree() {
        return this.curCheckedTree
    }
    public static get instance() {
        if (!DIYScene._instance)
            DIYScene._instance = new DIYScene();
        return DIYScene._instance;
    }

    public showScene(param: any, handler: Handler) {
        super.showScene(param, handler);
        this._pointName = param[0];
        this._pointIndex = param[1]
        this._enterType = param[2] || 0;
        this._callback = handler;
        this.isfirst = param[3] != null ? param[3] : false
        if (!this.scene3d) {
            Laya.loader.create("res/scene/viewscene/Scenes_duorou.ls", Handler.create(this, this.onSceneLoaded))
        }
        else {
            this.addChild(this.scene3d);
            this.checkCache(this._pointName);
            GameUIManager.getInstance().hideTopUI(LoadingScenes1);
            this._callback && this._callback.run();
            GameUIManager.getInstance().createUI(DiyChangePot, [this._pointName, 0])
        }
        //if (this.potted) {
        //直接打开选择花盆界面

        //}
        GameUIManager.getInstance().hideUI(SwitchScene);

    }

    private onSceneLoaded(scene3d: Scene3D) {

        //test
        scene3d.getChildByName("Object").getChildByName("Particle System (1)").active = false;
        //
        // scene3d.enableFog = false;
        scene3d.fogStart = 4;
        this.scene3d = scene3d;
        this.addChild(scene3d);
        // @ts-ignore
        this.camera = scene3d._cameraPool[0];
        this.script3d = this.camera.addComponent(MouseController);
        this.script3d.rotateEnable = false;
        this.script3d.moveEnable = false;
        this.script3d.scaleEnable = false;

        Utils.createBloom(this.camera, { intensity: 4, threshold: 1.1, softKnee: 0.5, clamp: 65472, diffusion: 5, anamorphicRatio: 0.0, color: new Laya.Color(1, 0.84, 0, 1), fastMode: true });
        this.ground = scene3d.getChildByName("Object").getChildByName("dimian") as MeshSprite3D;
        this.light = scene3d.getChildByName("Spot Light (1)") as DirectionLight;
        // //地面接收阴影
        // @ts-ignore
        this.ground.meshRenderer.receiveShadow = true;
        // //灯光开启阴影
        this.light.shadowMode = ShadowMode.SoftHigh;
        //  this.light.ShadowCascadesMode = ShadowCascadesMode.NoCascades;
        this.light.shadowDistance = 4;
        this.light.shadowResolution = 1024;
        this.light.shadowDepthBias = 1.0;
        this.light.shadowStrength = 0.6;
        (this.light as DirectionLight).shadowNearPlane = 0.001;
        // //
        //
        //
        // ResourceManager.instance.getResource("res/test/xuanfengzhan.lh", Handler.create(this, function (ret11) {
        //     this.scene3d.addChild(ret11);
        // }))
        // return;
        this.checkCache(this._pointName);
        GameUIManager.getInstance().hideTopUI(LoadingScenes1);
        if (this._callback) {
            this._callback.run()
        }

        //todo 偷偷去加载gamescene
        ResourceManager.getInstance().getResource("res/scene/mainscene/Scenes_huayuan.ls", null)
    }

    private initCameraData(pottedId: number): void {
        if (!Tree_Cfg[pottedId]) return;
        this._size = Tree_Cfg[pottedId].big;
        var str: string = Tree_Cfg[pottedId].str1position;
        var arr: any = str.split(",");
        this._frontPos = new Vector3(Number(arr[0]), Number(arr[1]), Number(arr[2]));
        str = Tree_Cfg[pottedId].str1rotation;
        arr = str.split(",");
        this._frontRot = new Vector3(-Number(arr[0]), Number(arr[1]) - 180, Number(arr[2]));

        str = Tree_Cfg[pottedId].str2position;
        arr = str.split(",");
        this._topPos = new Vector3(Number(arr[0]), Number(arr[1]), Number(arr[2]));

        str = Tree_Cfg[pottedId].str2rotation;
        arr = str.split(",");
        this._topRot = new Vector3(-Number(arr[0]), Number(arr[1]) - 180, Number(arr[2]));

        this.camera.transform.position = this._frontPos;
        this.camera.transform.rotationEuler = this._frontRot;
    }

    /***
     * 检查是否有缓存
     */
    private checkCache(str: string): void {
        this.clear();
        var localData = PotManager.getInstance().PotMap[str]
        if (localData /*&& this._enterType == 1*/) {
            this.loadPottedByData(localData.PointDataList[this._pointIndex]);
        }
        else {
            this.loadPottedDefault();
        }
        //临时创建采集数据
    }

    /**
     * 创建默认花盆
     */
    private loadPottedDefault(): void {
        GameUIManager.getInstance().createUI(DiyChangePot, [this._pointName, 0])
        // GameUIManager.getInstance().openUI("PottedListViewScene", [this._pointName]);
        // GameUIManager.getInstance().openUI("PointFlowerStateView", [this._pointName]);
    }

    public set dragTarget(target: any) {
        this._dragTarget = target;
        // target && Utils.setRenderMode(target, 2);
        //target && this.potted.setSelect(target as Tree);
    }

    public get dragTarget() {
        return this._dragTarget;
    }

    /**
     * 根据id创建花盆
     * @param id
     */
    private loadPottedById(id: number): void {
        if (this.potted != null) {
            if (id != this.potted.containerId) {
                //替换花盆
                this.potted.changePotted(id)
                return
            }
        }
        if (this.pottedDefult) {
            this.pottedDefult.destroy();
            this.pottedDefult = null;
        }
        if (this.potted) {
            this.potted.destroy();
            this.potted = null;
        }
        this.initCameraData(id);
        this.potted = new Potted();
        this.potted.initPotted(id, Handler.create(this, function () {

            this.scene3d.addChild(this.potted);
            this.potted.transform.position = new Vector3(0, 0, 0);
            this.script3d.setTarget(this.potted);
            Utils.setMeshCastShadow(this.potted, true);
        }))
    }

    /**
     * 根据data创建花盆
     * @param data
     */
    private loadPottedByData(data: any): void {
        this.initCameraData(data.containerId);
        Potted.createByData(data, Handler.create(this, function (potted) {
            if (!potted) return;
            this.potted = potted;
            // this.potted.transform.localRotationY = data.rotateY+180;
            potted.transform.rotationEuler = new Vector3(0, data.rotateY, 0);
            this.script3d.setTarget(this.potted);
            this.scene3d.addChild(potted);
            Utils.setMeshCastShadow(this.potted, true);
            GameUIManager.getInstance().createUI(DiyChangePot, [this._pointName, 0])
        }))
    }

    private onDragBegin(e: Event) {
        if (e.target instanceof Button) {
            return;
        }
        let view = ViewManager.getInstance().GetViewByClass(DIYFinishView);
        if (view) {
            return;
        }
        /** +2020年9月9日15:19:54 目的：拖拽造成DIY工具显示 */
        if (e.target instanceof Box) return;
        // if (e.target instanceof Image) return;
        if (e.target instanceof Button) return;

        console.log("=========e.target==========", e.target)

        if (!this.isopendrag) return

        this.point.x = MouseManager.instance.mouseX;
        this.point.y = MouseManager.instance.mouseY;
        this._touchPoint.x = MouseManager.instance.mouseX;
        this._touchPoint.y = MouseManager.instance.mouseY;
        this.offset.x = 0;
        this.offset.y = 0;
        this._isMouseDown = true;
        var outHitResult = Utils.rayCastOne(this.point, this.scene3d, this.camera);
        //如果碰撞到物体
        if (outHitResult.succeeded) {
            console.log("碰撞到物体！！");
            if (outHitResult.collider.owner && outHitResult.collider.owner.parent instanceof Tree) {
                this.script3d.rotateEnable = false;
                var _tree: Tree = outHitResult.collider.owner.parent;
                if (this._editTarget && this._editTarget.treeIndex != _tree.treeIndex) {
                    this._selectTarget = false;
                    return;
                }
                this.editTarget = _tree;
                this.editorMode = true;

                this._treeData = {
                    _id: _tree._id,
                    _scale: _tree.transform.scale.x,
                    _pos: new Laya.Vector3(_tree.transform.position.x, _tree.transform.position.y, _tree.transform.position.z),
                    _rotate: _tree.transform.localRotationEuler.y
                }

                var ox = MouseManager.instance.mouseX;
                var oy = MouseManager.instance.mouseY;
                var mx: Vector2 = Utils.worldToScreen(this.camera, this._editTarget.transform.position);
                this.offset.x = mx.x - ox;
                this.offset.y = mx.y - oy;
            }
            // else if (outHitResult.collider.owner && outHitResult.collider.owner.name == "default") {
            //     console.log("打开UI");
            //     GameUIManager.getInstance().openUI("PottedListViewScene");
            // }
        }
        else
            this._selectTarget = false;



        return;
        if (Global.sceneLock) return;
        this.isMove = false;
        this.point.x = MouseManager.instance.mouseX;
        this.point.y = MouseManager.instance.mouseY;
        this.offset.x = 0;
        this.offset.y = 0;
        var outHitResult = Utils.rayCastOne(this.point, this.scene3d, this.camera);
        //如果碰撞到物体
        if (outHitResult.succeeded) {
            console.log("碰撞到物体！！");
            if (outHitResult.collider.owner && outHitResult.collider.owner.parent instanceof Tree) {
                (this.dragTarget as Node) = outHitResult.collider.owner.parent;
                if (this.editorMode && this.dragTarget.treeIndex == (this._editTarget as Tree).treeIndex) {
                    this._editorTargetDown = true;
                }
                // //this.potted.setSelect(this.dragTarget as Tree);
                // this.script3d.rotateEnable = false;
                // this.getTreeInPotted(this.dragTarget as Tree);

                //test

                //
            }
            // else if (outHitResult.collider.owner && outHitResult.collider.owner.parent.name == "default") {
            //     //test
            //     console.log("打开UI");
            //     GameUIManager.instance.openUI("PottedListViewScene");
            // }
        }
    }

    private onDragMove(e: Event): void {
        if (!this._isMouseDown || !this._editTarget || !this.editorMode || !this._selectTarget) {
            // console.log("this._isMouseDown = ", this._isMouseDown);
            // console.log("this._editTarget = ", this._editTarget);
            // console.log("this.editorMode = ", this.editorMode);
            // console.log("this._selectTarget = ", this._selectTarget);
            return;
        }
        if (!this.isopendrag) return
        //todo
        //var height: number = this._size == 1 ? this.potted.getFloorHeight() : 0.1;
        var height: number = this.potted.getFloorHeight();
        (this._editTarget as Tree).setPosition(Utils.screenToWorld(new Point(MouseManager.instance.mouseX + this.offset.x, MouseManager.instance.mouseY + this.offset.y),
            this.camera,
            height, 1.0));

        if (Math.abs(this._touchPoint.x - MouseManager.instance.mouseX) > this._closeDistance || Math.abs(this._touchPoint.y - MouseManager.instance.mouseY) > this._closeDistance)
            GameUIManager.getInstance().hideUI(DiyToolView);
        //移除检测
        if ((this._editTarget as Tree).isPlanted) {
            this.point.x = MouseManager.instance.mouseX + this.offset.x;
            this.point.y = MouseManager.instance.mouseY + this.offset.y;
            var arr: Array<HitResult> = Utils.rayCastAll(this.point, this.scene3d, this.camera);
            var result: any = this.potted.canPut(arr);
            if (!result) {
                this.potted.removeNotice(this._editTarget as Tree);
            }
            else {
                this.potted.clearRemoveNotice(this._editTarget as Tree);
            }
        }


        return;
        if (this.editorMode) {
            this.script3d.rotateEnable = false;
            if (this._editorTargetDown) {
                (this._editTarget as Tree).setPosition(Utils.screenToWorld(new Point(MouseManager.instance.mouseX + this.offset.x, MouseManager.instance.mouseY + this.offset.y),
                    this.camera,
                    height, 1.0));
                this.isMove = true;
            }

        }
        else {
            if (Global.sceneLock) return;
            if (!this.dragTarget) return;
            var height: number = this.potted.getFloorHeight();
            (this.dragTarget as Tree).setPosition(Utils.screenToWorld(new Point(MouseManager.instance.mouseX + this.offset.x, MouseManager.instance.mouseY + this.offset.y),
                this.camera,
                height, 1.0));
            this.isMove = true;

            //移除检测
            if ((this.dragTarget as Tree).isPlanted) {
                this.point.x = MouseManager.instance.mouseX + this.offset.x;
                this.point.y = MouseManager.instance.mouseY + this.offset.y;
                var arr: Array<HitResult> = Utils.rayCastAll(this.point, this.scene3d, this.camera);
                var result: any = this.potted.canPut(arr);
                if (!result) {
                    this.potted.removeNotice(this.dragTarget as Tree);
                }
                else {
                    this.potted.clearRemoveNotice(this.dragTarget as Tree);
                }
            }
            this.script3d.rotateEnable = false;
        }

    }

    private onDragEnd(e: Event): void {
        this._isMouseDown = false;
        if (!this._editTarget || !this._selectTarget) return;
        if (!this.isopendrag) return
        this._selectTarget = false;
        this.point.x = MouseManager.instance.mouseX + this.offset.x;
        this.point.y = MouseManager.instance.mouseY + this.offset.y;

        var arr: Array<HitResult> = Utils.rayCastAll(this.point, this.scene3d, this.camera);
        var result: any = this.potted.canPut(arr);
        let isCreate: boolean = false;
        if (result) {
            if (this._editTarget.isPlanted) {
                (this._editTarget as Tree).setPosition(result);
                isCreate = false;
            }
            else {
                (this._editTarget as Tree).isSave = false;
                this.potted.addTreeByInstance(this._editTarget, result, true);
                BagSystem.getInstance().delItem(this._editTarget.id, 1);
                isCreate = true;
                //新手引导相关
                let data = { name: "diyClick" }
                GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, data)
            }
            this.getTreeInPotted(this._editTarget as Tree, isCreate);
        }
        else {
            this.potted.delTree(this._editTarget);
            this.editTarget = null;
            this.editorMode = false;
        }
        //刷新DIY列表
        Laya.stage.event(CommonDefine.EVENT_DIYUI_REFRESH);


        return;
        //         if (Global.sceneLock || !this.camera) return;
        //         if (!this.potted) return;
        //
        //         this._editorTargetDown = false
        //         this.point.x = MouseManager.instance.mouseX + this.offset.x;
        //         this.point.y = MouseManager.instance.mouseY + this.offset.y;
        //
        //         if(this.editorMode)
        //         {
        //             if((this.dragTarget as Tree).treeIndex != (this._editTarget as Tree).treeIndex)
        //             {
        //                 return;
        //             }
        //         }
        //
        //         if (this.dragTarget) {
        //             var arr: Array<HitResult> = Utils.rayCastAll(this.point, this.scene3d, this.camera);
        //             var result: any = this.potted.canPut(arr);
        //             if (result) {
        //                 if ((this.dragTarget as Tree).isPlanted) {
        //                     (this.dragTarget as Tree).setPosition(result);
        //                     if(!this.isMove)
        //                     {
        //                         this.getTreeInPotted(this.dragTarget as Tree);
        //                         this._editTarget = this.dragTarget;
        //                     }
        // <<<<<<< .mine
        //                     else
        //                     {
        //                         this.dragTarget = null;
        // ||||||| .r1768
        //                     else {
        //                         this.potted.addTreeByInstance((this.dragTarget as Tree), result);
        //                         this.getTreeInPotted(this.dragTarget as Tree)
        // =======
        //                     else {
        //                         this.potted.addTreeByInstance((this.dragTarget as Tree), result);
        //                         Laya.stage.event(CommonDefine.EVENT_CREATE_TREE_FINISH);
        //                         this.getTreeInPotted(this.dragTarget as Tree)
        // >>>>>>> .r1776
        //                     }
        //                 }
        //                 else {
        //                     this.potted.addTreeByInstance((this.dragTarget as Tree), result);
        //                     this.dragTarget = null;
        //                 }
        //                 this.dragTarget = null;
        //             }
        //             else {
        //                 this.potted.delTree((this.dragTarget as Tree));
        //                 this.editorMode = false;
        //                 this.dragTarget = null;
        //             }
        //         }
        //         else {
        //             var outHitResult = Utils.rayCastOne(this.point, this.scene3d, this.camera);
        //             if (outHitResult.succeeded) {
        //                 console.log("碰撞到物体！！");
        //                 if (outHitResult.collider.owner && outHitResult.collider.owner.parent instanceof Tree) {
        //                     (this.dragTarget as Node) = outHitResult.collider.owner.parent;
        //                     this.script3d.rotateEnable = false;
        //                     this.getTreeInPotted(this.dragTarget as Tree);
        //
        //                     //test
        //                     // var ox = MouseManager.instance.mouseX;
        //                     // var oy = MouseManager.instance.mouseY;
        //                     // var mx: Vector2 = Utils.worldToScreen(this.camera, this.dragTarget.transform.position);
        //                     // this.offset.x = mx.x - ox;
        //                     // this.offset.y = mx.y - oy;
        //                     //
        //                 }
        //                 else if (outHitResult.collider.owner && outHitResult.collider.owner.parent.name == "default") {
        //                     //test
        //                     console.log("打开UI");
        //                     GameUIManager.instance.openUI("PottedListViewScene");
        //                 }
        //             }
        //         }
        //         // this.potted.clearSelect();
        //         // this.dragTarget && this.potted.changeRenderMode(this.dragTarget);
        //         // this.dragTarget = null;
        //         this.isMove = false;
        //         this.script3d.rotateEnable = true;
    }

    private clear(): void {
        this.pottedDefult = null;
        this.potted && this.potted.destroy();
        this.potted = null;
        this.dragTarget = null;
        //Utils.clearLocalByKey("plant");
    }


    getTreeInPotted(_tree: Tree, isCreate: boolean) {
        if (_tree.isPlanted) {
            this.curCheckedTree = _tree
            GameUIManager.getInstance().createUI(DiyToolView, [_tree]
                , Laya.Handler.create(this, (view) => {
                    view.setCurTree(_tree, isCreate);
                }));

            // this.editorMode = true;
            Debug.Log(this.curCheckedTree)
        } else {
            Debug.LogError("花盆中没有这个植物")
        }
    }

    /**生产植物 */
    createTree(treeId: number) {
        let v3: Laya.Vector3 = Utils.screenToWorld(new Point(MouseManager.instance.mouseX, MouseManager.instance.mouseY), this.camera, 0.4);
        var tree: Tree = new Tree(treeId);
        tree.setPosition(v3);
        this.scene3d.addChild(tree);

        this.editTarget = tree;
        this.editorMode = true;
    }

    /**保存花盆 */
    savePotted() {
        if (this.potted) {
            PotManager.getInstance().SavePot(this._pointName, this._pointIndex, this.potted);

            // this.potted.packData(this._pointName);
        }
    }

    /**
     * 删除当前操作的植物
     */
    RemoveTree() {
        if (!this._editTarget) return
        this.potted.delTree(this._editTarget);
        this.editTarget = null;
        this.editorMode = false;
    }

    /**保存花盆 */
    savePoint() {
        if (this.potted) {
            if (!PotManager.getInstance().PotMap[this._pointName] || !PotManager.getInstance().PotMap[this._pointName].PotList[this._pointIndex]) {
                PotManager.getInstance().AddPot(this._pointName, this._pointIndex, this.potted)
            }
            // this.potted.packData(this._pointName);
        }
    }

    /**Reset花盆 */
    resetPotted() {
        Potted.createByData(SaveManager.getInstance().GetCache(ModelStorage.plant), Handler.create(this, function (potted) {
            if (!potted) return;
            this.potted = potted;
            this.script3d.setTarget(this.potted);
            this.scene3d.addChild(potted);
        }))
    }


    caneraAngle(state) {
        if (state) {
            // this.scene3d.enableFog = false;
            let pos = this._topPos;
            let rot = this._topRot;

            Laya.Tween.to(this.camera.transform.position, {
                x: pos.x, y: pos.y, z: pos.z, update: new Handler(this, function () {
                    this.camera.transform.position = this.camera.transform.position;
                })
            }, this.caneraAngleTime);
            Laya.Tween.to(this.camera.transform.rotationEuler, {
                x: rot.x, y: rot.y, z: rot.z, update: new Handler(this, function () {
                    this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                })
            }, this.caneraAngleTime);
        }
        else {
            // this.scene3d.enableFog = true;
            let pos = this._frontPos;
            let rot = this._frontRot;
            Laya.Tween.to(this.camera.transform.position, {
                x: pos.x, y: pos.y, z: pos.z, update: new Handler(this, function () {
                    this.camera.transform.position = this.camera.transform.position;
                })
            }, this.caneraAngleTime);
            Laya.Tween.to(this.camera.transform.rotationEuler, {
                x: rot.x, y: rot.y, z: rot.z, update: new Handler(this, function () {
                    this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                })
            }, this.caneraAngleTime);
        }
    }

    public payBack(): void {
        this.potted && this.potted.payBack();
    }

    public checkedPooted(_containerId: number) {
        this.loadPottedById(_containerId)
    }

    checkedPottedFinish() {
        //GameUIManager.getInstance().showUI(DiyView);

    }
    /**盆中的植物的数量 */
    getPottedTreeNumber() {
        if (this.potted) {
            return this.potted._treeList.length
        }
    }

    /**盆中的植物的数量 */
    getPottedMaxNum() {
        if (this.potted && this.potted.containerId) {
            return Succulent_Cfg[this.potted.containerId].capacity;
        }
    }

    /**盆中的植物 */
    getPotted() {
        return this.potted
    }

    /**取消之后恢复原来的数据 */
    cancelAfter() {
        if (this._editTarget && this._treeData) {
            this._editTarget.setScale(this._treeData._scale)
            this._editTarget.setPosition(this._treeData._pos);
            this._editTarget.setRotate(this._treeData._rotate);
        }
    }
}