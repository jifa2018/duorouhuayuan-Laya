/***
 * 多肉植物单体
 */
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import Event = Laya.Event;
import { Utils } from "../../utils/Utils";
import MouseManager = Laya.MouseManager;
import Point = Laya.Point;
import { DIYScene } from "../scene/DIYScene";
import HitResult = Laya.HitResult;
import Camera = Laya.Camera;
import Ray = Laya.Ray;
import Scene3D = Laya.Scene3D;
import Vector2 = Laya.Vector2;
import { ResourceManager } from "../../manager/ResourceManager";
import { Tree_Cfg } from "../../manager/ConfigManager";
import Handler = Laya.Handler;
import PhysicsCollider = Laya.PhysicsCollider;
import { Debug } from "../../common/Debug";
import { TipViewScene } from "../ui/Common/TipViewScene";

export class Tree extends Sprite3D {

    //表id
    public _id: number;
    //缩放
    public _scale: number = null;
    //类型
    public _type: number;
    //相对位置
    public _pos: Vector3;
    //y轴旋转
    public _rotate: number = null;
    //植物节点
    public treeNode: Sprite3D;
    //内部id
    public treeIndex: number;
    //是否拖动
    private isDrag: boolean = false;
    //摄像机
    private _camera: Camera;
    //所属场景
    private _scene3d: Scene3D;
    //是否已种植
    public isPlanted: boolean = false;
    //自身价值
    public quality: number;
    //是否已经被保存过
    public isSave: boolean = false;
    //保存过的缩放
    public baseScale: number = 1;
    //加载回调
    private complate: Handler;

    private point: Vector2 = new Vector2();
    minZoom: any;
    maxZoom: any;
    /** 初始缩放值 */
    private _initZoom: number = 1;

    constructor(treeId: number, scale: number = 0, handler: Handler = null, bSave: boolean = true) {
        super();
        this.complate = handler;
        this.init(treeId, scale, bSave);
    }

    private init(treeId: number, scale: number, bSave: boolean = true): void {
        this._camera = DIYScene.instance.camera;
        this._scene3d = DIYScene.instance.scene3d;
        this._initZoom = Tree_Cfg[treeId].zoom;
        this.quality = Tree_Cfg[treeId].point;
        this._type = Tree_Cfg[treeId].type;
        this.isSave = bSave;
        this.baseScale = scale == 0 ? this._initZoom : scale;
        // debugger;
        this.minZoom = Tree_Cfg[treeId].zoommin * this._initZoom;
        this.maxZoom = Tree_Cfg[treeId].zoommax * this._initZoom;
        if (scale > 0)
            this._initZoom = scale;
        this.setScale(this._initZoom)
        this.loadTree(treeId);
    }

    private loadTree(treeId: number): void {
        if (!Tree_Cfg || !Tree_Cfg[treeId]) {
            throw Error("tree is not found , id = " + treeId);
            return;
        }
        this._id = treeId;
        ResourceManager.getInstance().getResource(Tree_Cfg[treeId].strmodelurl, Handler.create(this, function (ret: Sprite3D) {
            this.treeNode = ret;
            this.addChild(ret);


            // let meshCollider = ret.addComponent(PhysicsCollider);
            // //创建网格碰撞器
            // let meshShape = new Laya.MeshColliderShape();
            // //获取模型的mesh-
            //
            // // @ts-ignore
            // meshShape.mesh = Utils.getShaderMesh(ret);
            // //meshShape.mesh = ret.getChildAt(1).meshFilter.sharedMesh;
            // //设置模型的碰撞形状
            // meshCollider.colliderShape = meshShape;


            this.setScale(this._initZoom);
            // this._scale = this.transform.scale.x;
            this._rotate = 0;
            this.complate && this.complate.runWith(this);
            // //shader test
            // MultiplePassOutlineMaterial.initShader();
            // var customMaterial:MultiplePassOutlineMaterial = new MultiplePassOutlineMaterial();
            //
            // // @ts-ignore
            // customMaterial.albedoTexture =sp3d.getChildAt(1).skinnedMeshRenderer.material.albedoTexture;
            // // @ts-ignore
            // sp3d.getChildAt(1).skinnedMeshRenderer.sharedMaterial = customMaterial;
            // //



            // Utils.setMeshCastShadow(sp3d, true);
            // this.script3d.setCameraCenter(sp3d);
            // this.script3d.setTarget(sp3d);
            //
            // // //灯光开启阴影
            // this.light.shadowMode = ShadowMode.Hard;
            // //  this.light.ShadowCascadesMode = ShadowCascadesMode.NoCascades;
            // this.light.shadowDistance = 4;
            // this.light.shadowResolution = 1024;
            // this.light.shadowDepthBias = 1.0;
            // this.light.shadowStrength = 0.6;
            // (this.light as DirectionLight).shadowNearPlane = 0.001;
        }))
    }

    public getTableId(): number {
        return this._id;
    }

    /**
     * 设置缩放
     * @param value
     */
    public setScale(value: number): void {

        // if (value < this.minZoom) {
        //     value = this.minZoom
        // }

        // if (value > this.maxZoom) {
        //     value = this.maxZoom
        // }

        value = Number(value.toFixed(1));
        if (this.transform)
            this.transform.setWorldLossyScale(new Vector3(value, value, value));// = ;
        this._scale = value;
    }
    public SetVisible(val:boolean)
    {
        this.treeNode.active = false  
    }
    /**
     * 获取当前缩放值
     */
    public getScale(): number {
        return Number(this._scale.toFixed(1));
    }

    /**
     * 设置旋转
     * @param value
     */
    public setRotate(value: number): void {
        this.transform.localRotationEuler = new Vector3(this.transform.localRotationEulerX,
            value,
            this.transform.localRotationEulerZ)
        this._rotate = value;
    }

    /**
     * 获取旋转
     */
    public getRotate(): number {
        return this._rotate;
    }

    /**
     * 设置位置
     * @param v3
     */
    public setPosition(v3: Vector3): void {
        this.transform.position = v3;
    }

    /**
     * 获取位置
     */
    public getPosition(): Vector3 {
        var pos: Vector3 = new Vector3();
        pos.x = Number(this.transform.localPosition.x.toFixed(1));
        pos.y = Number(this.transform.localPosition.y.toFixed(1));
        pos.z = Number(this.transform.localPosition.z.toFixed(1));
        return pos;
    }

    public getPayBackNumber(): number {
        if (this.isSave) return 0;
        if (this._scale <= this._initZoom) return 1;
        return 1;
        //TODO
        return (this._scale - this._initZoom) * 10;
    }
    //
    // /**
    //  * 准备拖拽
    //  */
    // private onDragBegin():void
    // {
    //     this.isDrag = true;
    // }
    //
    // /**
    //  * 正在拖拽
    //  */
    // private onDragMove():void
    // {
    //     if(!this.isDrag)    return;
    //     this.transform.position = Utils.screenToWorld(new Point(MouseManager.instance.mouseX, MouseManager.instance.mouseY),
    //                                                             this._camera,
    //                                                       0.3);
    // }
    //
    // /**
    //  * 拖拽结束
    //  */
    // private onDragEnd():void
    // {
    //     this.isDrag = false;
    //     this.point.x = MouseManager.instance.mouseX;
    //     this.point.y = MouseManager.instance.mouseY;
    //     //射线初始化（必须初始化）
    //     var ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    //     var outHitResult = new HitResult();
    //     var arr:Array<HitResult> = new Array<HitResult>();
    //     //产生射线
    //     this._camera.viewportPointToRay(this.point,ray);
    //     //拿到射线碰撞的物体
    //     this._scene3d.physicsSimulation.rayCast(ray,outHitResult);
    //     //this.scene3d.physicsSimulation.rayCastAll(ray,arr);
    //     //如果碰撞到物体
    //     if (outHitResult.succeeded)
    //     {
    //         //删除碰撞到的物体
    //         console.log("碰撞到物体！！");
    //     }
    // }
    //
    // /**
    //  * 准备拖拽
    //  */
    // private onDragBegin():void
    // {
    //     this.isDrag = true;
    // }
    //
    // /**
    //  * 正在拖拽
    //  */
    // private onDragMove():void
    // {
    //     if(!this.isDrag)    return;
    //     this.transform.position = Utils.screenToWorld(new Point(MouseManager.instance.mouseX, MouseManager.instance.mouseY),
    //                                                             this._camera,
    //                                                       0.3);
    // }
    //
    // /**
    //  * 拖拽结束
    //  */
    // private onDragEnd():void
    // {
    //     this.isDrag = false;
    //     this.point.x = MouseManager.instance.mouseX;
    //     this.point.y = MouseManager.instance.mouseY;
    //     //射线初始化（必须初始化）
    //     var ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    //     var outHitResult = new HitResult();
    //     var arr:Array<HitResult> = new Array<HitResult>();
    //     //产生射线
    //     this._camera.viewportPointToRay(this.point,ray);
    //     //拿到射线碰撞的物体
    //     this._scene3d.physicsSimulation.rayCast(ray,outHitResult);
    //     //this.scene3d.physicsSimulation.rayCastAll(ray,arr);
    //     //如果碰撞到物体
    //     if (outHitResult.succeeded)
    //     {
    //         //删除碰撞到的物体
    //         console.log("碰撞到物体！！");
    //     }
    // }




    /**
     * 销毁
     */
    public destroy(destroyChild?: boolean) {
        super.destroy(destroyChild);
        this.treeNode = null;
    }

    public removeSelf(): laya.display.Node {
        debugger;
        return super.removeSelf();

    }

}