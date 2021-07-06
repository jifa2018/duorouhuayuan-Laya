import { PottedStruct } from "../item/PottedStruct";
import { ResourceManager } from "../../manager/ResourceManager";
import GameScene from "../scene/GameScene";
import { Point } from "../item/Point";
import { Potted } from "../item/Potted";
import { PotState } from "../GameDefine";
import { PotManager } from "../../manager/PotManager";
import { Succulentpoint_Cfg } from "../../manager/ConfigManager";

/** 将模型、特效显示在ui上 */
export class DrawModel {
    //界面中的3D场景
    private _scene: Laya.Scene3D;
    //界面中的摄像机
    private _camera: Laya.Camera;
    //承载模型的ui
    private _ui: any;

    //是否已经销毁
    private _isDestroy: boolean = false;

    //模型坐标
    public position: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    //缩放
    public scale: number = 1;
    //模型旋转
    public rotationEuler: Laya.Vector3 = new Laya.Vector3(0, 0, 0);

    public flowerData: Point;
    public flowerPotStruct: PottedStruct;

    //是否是多肉
    public bFlower: boolean = false;
    //是否是多肉
    public bEmptyBox: boolean = false;
    //是否是多肉
    public bEmptyPot: boolean = false;
    
    /**
     * 将模型显示在UI上
     * @param ui 承载的ui 
     * @param index 模型在ui层级的index
     */
    public Start(ui: any) {
        this._ui = ui;
        //与UI搭配的3D场景
        this._scene = new Laya.Scene3D();
        let light = new Laya.DirectionLight();
        light.color = new Laya.Vector3(1, 1, 1);
        var mat = light.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        light.transform.worldMatrix=mat;
        this._ui.addChild(this._scene);
        this._scene.addChild(light);
        // light.transform.position = new Laya.Vector3(this.position.x,this.position.y + 10,this.position.z+ 10);
        this._ui.setChildIndex(this._scene, 0);
        if (this.bFlower) {
            this.LoadFlower(() => {
                //加载摄像机
                this.LoadCamera();
            });
        }else if (this.bEmptyBox) {
            this.LoadEmptyBox(() => {
                //加载摄像机
                this.LoadCamera();
            });
        }else if (this.bEmptyPot) {
            this.LoadEmptyPot(() => {
                //加载摄像机
                this.LoadCamera();
            });
        }
    }

    // 加载多肉
    private LoadFlower(callBack: Function) {
        if (this.flowerData && this.flowerPotStruct) {
            let strName = "point_" + this.flowerData.Name;
            Potted.createByData(this.flowerPotStruct, Laya.Handler.create(this, function (name: string, potted, ang: number) {
                potted.transform.rotationEuler = new Laya.Vector3(0, potted.transform.rotationEuler.y + ang, 0);
                potted.transform.position = this.position;
                // potted.transform.scale = new Laya.Vector3(this.scale, this.scale, this.scale);
                // this.scale = this.scaleInfo[Succulentpoint_Cfg[this.flowerData.Name].type];
                this._scene.addChild(potted);
                callBack();
            }, [strName]))

            // ResourceManager.getInstance().getResource("res/model/Succulent_pengzi_02.lh", Laya.Handler.create(this, function (ret11:Laya.Sprite3D) {

            //     this._scene.addChild(ret11);
            //     ret11.transform.scale = new Laya.Vector3(1, 1,1);
            //     callBack();
            // }));
        }
    }

    // 加载多肉
    private LoadEmptyBox(callBack: Function) {
        
        ResourceManager.getInstance().getResource("res/model/Succulent_pengzi_02.lh", Laya.Handler.create(this, function (ret11:Laya.Sprite3D) {
            ret11.transform.position = this.position;
            // ret11.transform.scale = new Laya.Vector3(this.scale, this.scale, this.scale);
            ret11.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
            this._scene.addChild(ret11);
            callBack();
        }))
    }

    // 加载多肉
    private LoadEmptyPot(callBack: Function) {
        
        ResourceManager.getInstance().getResource("res/plant/Succulent_pen_01_A.lh", Laya.Handler.create(this, function (ret11:Laya.Sprite3D) {
            ret11.transform.position = this.position;
            // ret11.transform.scale = new Laya.Vector3(this.scale, this.scale, this.scale);
            ret11.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
            this._scene.addChild(ret11);
            callBack();
        }))
    }

    //加载摄像机
    private LoadCamera() {
        this._camera = new Laya.Camera();
        //相机设置清楚标记,使用固定颜色
        this._camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
        //设置背景颜色
        // this._camera.clearColor = new Laya.Vector4(0.99,0.87,0.61,1);//(0.99,0.87,0.61,0.1);

        this._camera.transform.translate(new Laya.Vector3(0, 0, 0), false);

        Laya.timer.once(100, this, () => {
            if (this._isDestroy || this._ui._destroyed) return;
            let pos = this._ui.localToGlobal(new Laya.Point(0, 0));
            let width = this._ui.width;
            let height = this._ui.height;
            let offsetX = pos.x;
            let offsetY = pos.y;
            this._camera.viewport = new Laya.Viewport(offsetX, offsetY, width, height);
            this._scene.addChild(this._camera);
        });
    }

    public Destroy() {
        Laya.timer.clearAll(this);
        if (this._scene)
            this._scene.destroy(true);
        this._isDestroy = true;
    }
}