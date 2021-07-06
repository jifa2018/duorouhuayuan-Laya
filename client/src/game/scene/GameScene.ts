import SceneBase from "./SceneBase";
import MouseController from "../script/MouseController";
import { Global } from "../../utils/Global";
import { GameUIManager } from "../../manager/GameUIManager";
import { Utils } from "../../utils/Utils";
import { ResourceManager } from "../../manager/ResourceManager";
import { Potted } from "../item/Potted";
import { SceneManager } from "../../manager/SceneManager";
import { DIYScene } from "./DIYScene";
import { SceneItemCreater } from "../item/SceneItemCreater";
import { BottomCreater } from "../item/BottomCreater";
import { Bottom } from "../item/Bottom";
import { LocalStorage, PotState } from "../GameDefine";
import { PathManager } from "../../manager/PathManager";
import { SceneRayChecker } from "../ray/SceneRayChecker";
import { MainUIScene } from "../ui/Main/MainUIScene";
import { NpcManager } from "../../manager/NpcManager";
import { LayerManager } from "../../manager/LayerManager";
import { CommonDefine } from "../../common/CommonDefine";
// import { CarEditor } from "../edit/CarEditor";
import { StaffManager } from "../../manager/StaffManager";
import { PotManager } from "../../manager/PotManager";
import { Point } from "../item/Point";
import { TreeGrowProgressBar } from "../ui/ProgressBar/TreeGrowProgressBar";
import Handler = Laya.Handler;
import Scene3D = Laya.Scene3D;
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import MouseManager = Laya.MouseManager;
import Vector2 = Laya.Vector2;
import PhysicsCollider = Laya.PhysicsCollider;
import Tween = Laya.Tween;
import { CollectMapDataManager } from "../../manager/CollectMapDataManager";
import { Time } from "../../common/Time";
import { Constant_Cfg, Succulentpoint_Cfg, Sceneeffect_Cfg } from "../../manager/ConfigManager";
import { GameData } from "../data/GameData";
import { LoadingScenes1 } from "../ui/LoadingScenes1";
import { SwitchScene } from "../ui/SwitchScene";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
import { LandManager } from "../../manager/LandManager";
import { GuideManager } from "../ui/Guide/GuideManager";
import { GacEvent } from "../../common/GacEvent";
import { GEvent } from "../../common/GEvent";
import { BagSystem } from "../bag/BagSystem";
import { CheckRed } from "../checkred/CheckRed";
import { EffectManager } from "../../effect/EffectManager";
import { Effect3D } from "../../effect/Effect3D";
import { IndexDecorateView } from "../ui/Decorate/IndexDecorateView";
import { DecorateViewScene } from "../ui/Decorate/DecorateVIew";


export default class GameScene extends SceneBase {
    public script3d: MouseController;
    private static _instance = null;
    public curSceneIndex: number = 0;
    //private rollVector: Array<number> = [59, 40.04, 23.36, 7.68, -8, -23.68];   //15.68
    private rollVector: Array<number> = [7.68, -8, -23.68];   //15.68
    private homeIndex: number = 0;
    public curRollIndex: number = 0;
    // public carEditor: CarEditor;
    private worldRollIndex: number = 2; //世界地区数量
    public oArrow: any = [];

    constructor() {
        super();
    }

    public static get instance(): GameScene {
        if (!GameScene._instance)
            GameScene._instance = new GameScene();
        return GameScene._instance;
    }

    public onEnable() {
        super.onEnable();
        // Laya.stage.on(Event.MOUSE_DOWN, this, this.onDragBegin);
        // Laya.stage.on(Event.MOUSE_MOVE, this, this.onDragMove);
        // Laya.stage.on(Event.MOUSE_UP, this, this.onDragUp);
        //Laya.timer.loop(10, this, this.createNpcTest)
        LayerManager.getInstance().downUILayer.visible = true;
        LayerManager.getInstance().topUILayer.visible = true;
        Laya.stage.on(CommonDefine.EVENT_ROLL_SCREEN, this, this.rollScreen);
        //GEvent.RegistEvent(GacEvent.GuideOver, Laya.Handler.create(this, this.OpenNpcCreater));
        GEvent.RegistEvent(CommonDefine.EVENT_UNLOCK_PLANT, Laya.Handler.create(this, this.unlockPlant));
    }


    public onDisable() {
        super.onDisable();
        // Laya.stage.off(Event.MOUSE_DOWN, this, this.onDragBegin);
        // Laya.stage.off(Event.MOUSE_MOVE, this, this.onDragMove);
        // Laya.stage.off(Event.MOUSE_UP, this, this.onDragUp);
        //Laya.timer.clear(this, this.createNpcTest)
        BottomCreater.getInstance().clearSelectBottom();
        LayerManager.getInstance().downUILayer.visible = false;
        LayerManager.getInstance().topUILayer.visible = false;
        Laya.stage.off(CommonDefine.EVENT_ROLL_SCREEN, this, this.rollScreen);
        //GEvent.RemoveEvent(GacEvent.GuideOver, Laya.Handler.create(this, this.OpenNpcCreater));
    }

    public switchViewByIndex(index: number): void {
        if (index < 0) return;
        if (index >= this.rollVector.length) return;
        if (this.curRollIndex == index) return;
        if (this.curRollIndex > index) {
            this.curRollIndex = index - 1;
            this.rollScreen("left");
        }
        else {
            this.curRollIndex = index + 1;
            this.rollScreen("right");
        }
    }

    public getBottomByPoint(name: string): Potted {
        var tar: Potted = PotManager.getInstance().GetPointCurPot(name);
        if (!tar) return null;
        if (tar.State != PotState.Ripe) return null;
        return (tar as Potted);
    }

    public onDragBegin(): void {
        var outHitResult = Utils.rayCastOne(new Vector2(MouseManager.instance.mouseX, MouseManager.instance.mouseY), this.scene3d, this.camera);
        //如果碰撞到物体
        if (outHitResult.succeeded) {
            // if (outHitResult.collider.owner.parent.parent instanceof Bottom) {
            //     console.log("打开UI", outHitResult.collider.owner.parent.parent)
            //     let bottom: Bottom = outHitResult.collider.owner.parent.parent;
            //     if (bottom) {
            //         BottomCreater.getInstance().curSelectBottom(bottom);
            //         GameUIManager.getInstance().openUI("DecorateViewScene");
            //     }
            //     return
            // }
            GameUIManager.getInstance().showUI(LoadingScenes1);
            SceneManager.getInstance().openScene(DIYScene.instance);
        }
    }

    public onDragMove(): void {

    }

    public onDragUp(): void {

    }

    public showScene(param: any, handler: Handler) {

        super.showScene(param, handler);
        if (!this.scene3d) {
            Laya.loader.create("res/scene/mainscene/Scenes_huayuan.ls", Handler.create(this, this.onSceneLoaded, [handler]))
        }
        else {
            this.addChild(this.scene3d);
            this.createSceneBotany();
            GameUIManager.getInstance().showUI(SwitchScene);
            GameUIManager.getInstance().hideTopUI(LoadingScenes1);
            GameUIManager.getInstance().showUI(MainUIScene);
            if (GuideManager.getInstance().GetGuideState()) {
                NpcManager.getInstance().initnpcCreater();
            }
        }
    }

    public hideScene() {
        super.hideScene();
        GameUIManager.getInstance().hideUI(MainUIScene);
    }

    // public onFirstBagLoaded(){
    //     // 進行部分初始化
    //
    //     loadother(cb(){
    //         onSceneLoaded();
    //     })
    // }


    // 提示箭头临时代码
    public AddArrow() {
        // 百草屋
        let oPoint: Laya.Sprite3D = this.scene3d.getChildAt(0).getChildAt(0).clone();
        this.scene3d.getChildAt(4).getChildAt(4).addChild(oPoint);
        oPoint.transform.localPosition = new Laya.Vector3(0, 0, 0);
        oPoint.transform.localPositionY = 8;
        oPoint.active = false;
        oPoint.transform.localScaleX = 0.03;
        oPoint.transform.localScaleY = 0.03;
        oPoint.transform.localScaleZ = 0.03;
        this.oArrow.push(oPoint);

        // 人事部
        let oPoint1: Laya.Sprite3D = this.scene3d.getChildAt(0).getChildAt(0).clone();
        this.scene3d.getChildAt(4).getChildAt(3).addChild(oPoint1);
        oPoint1.transform.localPosition = new Laya.Vector3(0, 0, 0);
        oPoint1.transform.localPositionY = 7;
        oPoint1.active = false;
        oPoint1.transform.localScaleX = 0.02;
        oPoint1.transform.localScaleY = 0.02;
        oPoint1.transform.localScaleZ = 0.02;
        this.oArrow.push(oPoint1);
    }

    private onSceneLoaded(handler: Handler, scene3d: any) {
        this.addChild(scene3d);
        this.scene3d = scene3d;
        this.AddArrow();
        if (!this.camera) {
            //this.camera = scene3d._cameraPool[0];
            this.camera = scene3d.getChildByName("Main Camera (1)");
            this.addBloom();
            this.camera.orthographicVerticalSize = 25;
            this.camera.orthographicVerticalSize = this.camera.orthographicVerticalSize + 5;
            CollectMapDataManager.getInstance().init(scene3d);
            CollectMapDataManager.getInstance().unLockMapData(1, 1);
            //GuideManager.getInstance().OnStart()
            BagSystem.getInstance();
            CheckRed.getInstance();
            this.script3d = this.camera.addComponent(MouseController);
            this.script3d.rotateEnable = false;
            this.script3d.moveEnable = true;
            this.script3d.scaleEnable = false;
            Global.gameCamera = this.camera;
            this.loadPlant();
            // this.carEditor = new CarEditor(scene3d);
            GameUIManager.getInstance().showUI(SwitchScene);
            GameUIManager.getInstance().hideTopUI(LoadingScenes1);


        }

        SceneRayChecker.getInstance().initChecker(GameScene.instance);
        Laya.timer.once(1000, this, function () {
            this.createSceneBotany();
        })
        this.OnInit();
        LandManager.getInstance().onInitState(this.camera);//初始化点位的解锁情况
        this.initSceneDecorates(); //场景装饰物
        GameUIManager.getInstance().showUI(MainUIScene);
    }


    // private OpenNpcCreater() {
    //     if (GuideManager.getInstance().GetGuideState()) {
    //         NpcManager.getInstance().initnpcCreater();
    //     }
    //     else {
    //         var npc = NpcManager.getInstance().createGuideNpc(1);
    //         npc.transform.position = PathManager.getInstance().getPathByName("path_2")[1];
    //         GameScene.instance.scene3d.addChild(npc);
    //     }
    // }

    private OnInit(): void {
        PathManager.getInstance().onInit();
        GameData.onInit();
        NpcManager.getInstance().onInit();
        StaffManager.getInstance().onInit();
        Laya.timer.loop(1, this, this.OnUpdate);

        //this.OpenNpcCreater();
        NpcManager.getInstance().initnpcCreater();
    }

    private OnUpdate(): void {
        PathManager.getInstance().onUpdata();
        NpcManager.getInstance().onUpdata();
        StaffManager.getInstance().onUpdata();
    }

    public onDestroy(): void {
        super.onDestroy();
        PathManager.getInstance().onDestroy();
        NpcManager.getInstance().onDestroy();
        StaffManager.getInstance().onDestroy();
    }

    /***
     * 屏幕左右移动
     * @param type
     */
    private rollScreen(type: string): void {
        // if (!this.carEditor.canMove()) return;
        Laya.stage.event(CommonDefine.EVENT_BEGIN_ROLL);
        var temp: number;
        if (type == "left") {
            if (this.curRollIndex == this.rollVector.length - 1) return;
            // if (this.curRollIndex < 2)
            // this.carEditor.screenMove(this.curRollIndex == this.homeIndex, this.rollVector[this.curRollIndex + 1]);
            this.curRollIndex += 1;

        }
        else {
            if (this.curRollIndex == 0) return;
            // if (this.curRollIndex <= 3)
            // this.carEditor.screenMove(this.curRollIndex == this.homeIndex, this.rollVector[this.curRollIndex - 1]);
            this.curRollIndex -= 1;

        }

        console.log("屏幕左右移动", this.curRollIndex, this.worldRollIndex)

        this.eventMainUIShow();
        Tween.to(this.camera.transform.position, {
            x: this.rollVector[this.curRollIndex], update: new Handler(this, function () {
                this.camera.transform.position = this.camera.transform.position;
            })
        }, 200, null, Handler.create(this, function () {
            GEvent.DispatchEvent(GacEvent.GuideChangePage, this.curRollIndex)
        }));
    }

    eventMainUIShow() {
        // if (this.curRollIndex <= this.worldRollIndex - 1) {
        //     Laya.stage.event(CommonDefine.EVENT_MAIN_UI_SHOW, false);
        // } else {
        //     Laya.stage.event(CommonDefine.EVENT_MAIN_UI_SHOW, true);
        // }
    }

    /**替换喷泉 */
    createSceneBotany() {
        let potMap = PotManager.getInstance().PotMap
        for (const key in potMap) {
            var strName: string = key;
            var tPoint: Point = potMap[key];
            for (const key in tPoint.PointDataList) {
                this.createPotted(tPoint, "point_" + strName, Number(key));
            }
        }
    }

    public createPotted(tPoint: Point, strName, index) {
        if (tPoint && tPoint.PointDataList[index]) {
            let _data = tPoint.PointDataList[index];

            Potted.createByData(_data, Handler.create(this, function (name: string, potted, ang: number) {

                potted.transform.rotationEuler = new Vector3(0, ang + 180, 0);
                if (tPoint.PointDataList[index].State == PotState.Ripe && index == tPoint.UseIndex) {
                    var node = this.scene3d.getChildByName("zhongzhidian").getChildByName(name.substr(6, name.length - 1));
                    node.active = false;
                    var node = this.scene3d.getChildByName("point").getChildByName(name.substr(6, name.length - 1));
                    var child = node.getChildAt(0)
                    if (child) (child as Sprite3D).removeSelf();
                    node.addChild(potted);
                    var boxCollider = node.getComponent(PhysicsCollider);
                    if (boxCollider) boxCollider.enabled = false;
                }
                if (PotManager.getInstance().PotMap[tPoint.Name].PotList[index]) {
                    PotManager.getInstance().PotMap[tPoint.Name].PotList[index].destroy();
                }
                PotManager.getInstance().PotMap[tPoint.Name].PotList[index] = potted;
                //创建一个空的模型 + 显示进度条
                if (tPoint.PointDataList[index].State == PotState.Grow &&
                    index == tPoint.UseIndex) {
                    let nPro = 1 - (Time.Seconds - tPoint.PointDataList[index].GrowStartTime) / tPoint.PointDataList[index].GrowTime;
                    var node = this.scene3d.getChildByName("zhongzhidian").getChildByName(name.substr(6, name.length - 1));
                    node.active = false;
                    if (nPro <= 0) {
                        PotManager.getInstance().UpdateScenePot(tPoint.Name, index);
                        return;
                    }
                    ResourceManager.getInstance().getResource("res/model/Succulent_pengzi_02.lh", Handler.create(this, function (ret11: Sprite3D) {
                        ret11.transform.rotationEuler = new Vector3(0, ret11.transform.rotationEuler.y, 0);
                        var node = this.scene3d.getChildByName("point").getChildByName(strName.substr(6, strName.length - 1));
                        var child = node.getChildAt(0)
                        if (child) (child as Sprite3D).removeSelf();
                        node.addChild(ret11);
                        var boxCollider = node.getComponent(PhysicsCollider);
                        if (boxCollider) boxCollider.enabled = true;
                        // let type = Succulentpoint_Cfg[strName.substr(6, strName.length - 1)].type;
                        // let scale = { "1": 0.8, "2": 1, "3": 1.2, }
                        // ret11.transform.setWorldLossyScale(new Vector3(scale[type], scale[type], scale[type]));// = new Vector3(1, 1,1);
                        let type = strName.substr(21, strName.length - 1);
                        let scale = Constant_Cfg[18].value
                        ret11.transform.setWorldLossyScale(new Vector3(scale[type], scale[type], scale[type]));// = new Vector3(1, 1,1);

                        let data = {};
                        data["startTime"] = tPoint.PointDataList[index].GrowStartTime
                        data["growTime"] = tPoint.PointDataList[index].GrowTime
                        data["pointName"] = tPoint.Name;
                        data["index"] = index;
                        let _ProgressBar = new TreeGrowProgressBar();
                        _ProgressBar.init(GameScene.instance.camera, node, data, Handler.create(this, function () {

                        }));
                        PotManager.getInstance().PotMap[tPoint.Name].growProBar = _ProgressBar;
                    }))
                }

            }, [strName]))


        }
    }

    public delPotted(tPoint: Point, strName, index) {
        if (tPoint && tPoint.PointDataList[index]) {
            var node = this.scene3d.getChildByName("point").getChildByName(strName.substr(6, strName.length - 1));
            var child = node.getChildAt(0)
            if (child) (child as Sprite3D).destroy();
            var boxCollider = node.getComponent(PhysicsCollider);
            if (boxCollider) boxCollider.enabled = true;
            var node = this.scene3d.getChildByName("zhongzhidian").getChildByName(strName.substr(6, strName.length - 1));
            node.active = true;
        }
    }


    /**
     * 创建一个场景掉落
     * @param tableId
     * @param pos
     */
    public createSceneItem(tableId: number, pos: Vector3, price: number = 1): void {
        var item = SceneItemCreater.getInstance().createItem(tableId, pos, price);
    }

    private addBloom() {
        // 后处理Bloom
        Utils.createBloom(this.camera, { intensity: 4, threshold: 1.1, softKnee: 0.5, clamp: 65472, diffusion: 5, anamorphicRatio: 0.0, color: new Laya.Color(1, 0.84, 0, 1), fastMode: true });
    }

    public loadPlant() {
        return;
        ResourceManager.getInstance().getResource("res/plant/Succulent_zu01.lh", Handler.create(this, function (sp3d: Sprite3D) {
            var plantNode: Sprite3D = this.scene3d.getChildByName("Duorou_zy_01");
            sp3d.transform.position = plantNode.transform.position;
            sp3d.transform.rotate(new Vector3(0, 180, 0), true, false);
            this.scene3d.addChild(sp3d);

            this.script3d.setCameraCenter(sp3d);
        }))
        // Laya.loader.create("res/plant/Succulent_zu01.lh", Handler.create(this, function (sp3d:Sprite3D) {
        //     var plantNode:Sprite3D = this.scene3d.getChildByName("Duorou_zy_01");
        //     sp3d.transform.position = plantNode.transform.position;
        //     sp3d.transform.rotate(new Vector3(0,180,0),true, false);
        //     //this.scene3d.addChild(sp3d);
        //
        //     this.script3d.setCameraCenter(sp3d);
        // }))

    }

    public getScene(): Scene3D {
        return this.scene3d;
    }


    public canMove(direction: string): boolean {
        if (direction == "right") {
            if (this.curSceneIndex > 0) {
                this.curSceneIndex -= 1
                return true;
            }
            else
                return false;
        }
        else if (direction == "left") {
            if (this.curSceneIndex > 0)
                return false;
            else {
                this.curSceneIndex += 1
                return true;
            }
        }
        return false;
    }

    public get path(): Array<Vector3> {
        return [];
    }

    /**初始化场景装饰 */
    initSceneDecorates() {

        // //TODO 本地获取装饰序列
        let arr = BottomCreater.getInstance().getDefaultData();
        BottomCreater.getInstance().createByData(arr, this.scene3d)
        console.log("==============初始化场景装饰==========")
        //debug
        // GameUIManager.getInstance().showUI(DecorateViewScene)
        //初始化采集台子
    }

    /**获取底座 */
    getBottomByName(strName: string) {
        let _bottom = this.scene3d.getChildByName("point").getChildByName(strName).getChildAt(0);
        if (_bottom instanceof Bottom) {
            return _bottom
        }
    }

    /**
     * 2020年10月15日16:54:50
     * 种植点解锁后,提示页面结束之后事件提示特效播放
     * @param strName 
     */
    unlockPlant(strName) {
        let obj = (this.scene3d as Laya.Sprite3D).getChildByName("point").getChildByName(strName) as Laya.Sprite3D;
        this.playEffect(Sceneeffect_Cfg[1].streffect, obj.transform.position, 2000, false)
    }

    //特效播放回调
    private playEffectCallback: Function = null;
    /**
     * @param point 
     */
    playEffect(url, point, time = 2000, loop = false, _playEffectCallback?) {
        let _effect = new Effect3D();
        if (time > 0) {
            _effect.createSceneEffect(url, this.scene3d, point, time, loop, null)
        } else {
            _effect.createSceneEffect(url, this.scene3d, point, time, loop, null, (_e) => {
                this.playFinish(_e)
            });
        }
        this.playEffectCallback = _playEffectCallback
    }


    playFinish(_effect: Laya.Sprite3D) {
        // let _xp = 210 / Utils.getStageScal()["w"];
        // let _yp = 260 / Utils.getStageScal()["h"]
        // let point: Laya.Vector3 = Utils.screenToWorld(new Laya.Point(_xp, _yp), this.camera, 10)
        // // console.log("=============playFinish==============", Laya.stage.width, Laya.stage.height, _effect, point);
        // Laya.Tween.to(_effect.transform.position, {
        //     x: point.x, y: point.y, z: point.z, update: new Laya.Handler(this, () => {
        //         if (_effect.transform) {
        //             _effect.transform.position = _effect.transform.position;
        //         }
        //     })
        // }, 1000, null, Laya.Handler.create(this, this.destroyEffect, [_effect]))
    }

    /**动画播放完毕 */
    destroyEffect(_effect: Laya.Sprite3D) {
        Laya.Tween.clearAll(this);
        _effect.destroy();
        _effect = null;
        this.playEffectCallback && this.playEffectCallback();

    }

    // setResetDecorates() {
    //     let arr = BottomCreater.getInstance().getDefaultData();
    //     BottomCreater.getInstance().createByData(arr, this.scene3d)

    // }

}


   // private needCreate: boolean = true;
    // private createNpcTest() {
    //     if (!this.needCreate) return;
    //     this.needCreate = false;
    //     var d = Math.random() * 5000 + 3000;
    //     Laya.timer.once(d, this, function () {
    //         var f = Math.random() * 6 + 1;
    //         f = Math.floor(f);
    //         if (f == 7) {
    //             this.needCreate = true;
    //             return;
    //         }
    //         if (f == 4 || f == 3 || f == 2) {
    //             var e = Math.random();
    //             if (e >= 0.2) {
    //                 this.needCreate = true;
    //                 return;
    //             }
    //         }
    //         //console.log("创建一个NPC id = " + f);
    //         var npc = NpcManager.getInstance().createNpc(f);
    //         npc.transform.position = this.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
    //         this.scene3d.addChild(npc);
    //         this.needCreate = true;
    //     })
    // }