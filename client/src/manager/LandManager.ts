import Camera = Laya.Camera;
import Vector4 = Laya.Vector4;
import Spirte3d = Laya.Sprite3D;
import MeshSpirte3D = Laya.MeshSprite3D;
import { Singleton } from "../common/Singleton";
import { Utils } from "../utils/Utils";
import { PotManager } from "./PotManager";
import { GameUIManager } from "./GameUIManager";
import { FlowerpotSelView } from "../game/ui/Flowerpot/FlowerpotSelView";
import { PointFlowerStateView } from "../game/ui/FlowerState/PointFlowerStateView";
import { ConfigManager, Land_Cfg, Sceneeffect_Cfg } from "./ConfigManager";
import { Player } from "../game/player/Player";
import { Debug } from "../common/Debug";
import { SaveManager } from "./SaveManager";
import GameScene from "../game/scene/GameScene";
import { unLockDialog } from "../game/ui/Unlock/unLockDialog";
import { BottomCreater } from "../game/item/BottomCreater";
import { ImagePool } from "../effect/ResourcePool";
import { LayerManager } from "./LayerManager";
import { UnlockView } from "../game/ui/Unlock/UnlockView";
import { CommonDefine } from "../common/CommonDefine";
import { GEvent } from "../common/GEvent";
import { DiyChangePot } from "../game/ui/DiyView/DiyChangePot";
import { SceneManager } from "./SceneManager";
import { DIYScene } from "../game/scene/DIYScene";

export class LandManager extends Singleton {
    private _tempR = -15;//提示气泡摆动的角度
    private _reallyTime = 12;//当前经过时间
    private _camera: Camera;
    private _unlockedArr: any;//所有已解锁的点
    private _tipsDataList: any = [];//当前已经显示的提示泡泡数据
    private _defaultLandJosnArr: any;//默认的种植点数组
    private _unlockedBottomArr: any = [];//已解锁的装饰点
    constructor() {
        super();
        this.initData();
    }

    //初始化数据
    initData(): void {
        // Utils.clearLocal();
        // Utils.clearLocalByKey("landData");
        this._tipsDataList = [];
        this._unlockedArr = Utils.getJSONFromLocal("landData");
        this._defaultLandJosnArr = ConfigManager.prototype.GetJsonToArray(Land_Cfg);
        if (!this._unlockedArr) {
            this._unlockedArr = new Array<number>();
            this._unlockedArr.push("1");
        }
    }

    /**初始化种植点状态 */
    public onInitState(camera: Camera) {
        this._camera = camera;
        let landItemData: any;
        let landPointData: any;
        for (let i = 0; i < this._defaultLandJosnArr.length; i++) {
            landItemData = this._defaultLandJosnArr[i];
            let isUnlocked = this._unlockedArr.indexOf(landItemData.id) != -1;
            if (landItemData.type == 3 && isUnlocked)//地图点
            {
                this._camera.scene.getChildByName("map").getChildByName(landItemData.strname).active = false;
                return;
            }
            landPointData = this.getLandPoint(landItemData.type, landItemData.strname);
            if (!isUnlocked && this._unlockedArr.indexOf(landItemData.preconditionID.toString()) != -1)//未解锁且前置节点已解锁
            {
                this.setTipsData(landPointData.lockNode, landItemData);
            }
            else if (isUnlocked && landItemData.type == 2)//解锁的装饰点
            {
                this.createBottom(landItemData.strname);
            }
            landPointData.lockNode.active = !isUnlocked;
            landPointData.modelNode.active = isUnlocked;
        }
    }

    /**检测该点位是可以种植还是需要解锁 */
    public checkLandState(ratName) {
        let unlocklandDataArr = this._defaultLandJosnArr.filter((ele, index, array) => { return ele.strname == ratName });//当前点击的可解锁的种植点
        //有多个点id相同的情况下，取第一个(其实并不会出现此情况)
        let unlocklandData = unlocklandDataArr ? unlocklandDataArr[0] : null;
        //点击的解锁点无数据，不触发任何操作
        if (!unlocklandData)
            return;
        //前置节点已解锁
        if (this._unlockedArr.indexOf(unlocklandData.id) != -1)//节点已解锁，可以继续操作
        {
            if (unlocklandData.type == 1)//种植点
            {
                this.OpenFlowerStateView(ratName);
            }
        }
        else if (unlocklandData.type == 3)//点击的是地图点(能点击地图点，只会是未解锁状态,解锁后隐藏)
        {
            this.unlockMapPoint(unlocklandData);
            return;
        }
        else if (this._unlockedArr.indexOf(unlocklandData.preconditionID.toString()) != -1) {
            GameUIManager.getInstance().createUI(unLockDialog, [unlocklandData, this.unlockLandPoint.bind(this)]);
        }
        else //不可解锁点位
        {
            let precoditionDataArr = this._defaultLandJosnArr.filter((ele, index, array) => { return ele.id == unlocklandData.preconditionID; });
            GameUIManager.getInstance().createUI(unLockDialog, [unlocklandData, this.unlockLandPoint.bind(this), precoditionDataArr[0].struiname]);
        }
    }

    //解锁地图点(有可能外部调用,只传了节点name,此时需要自己在表中读数据)
    private unlockMapPoint(unlockPointData) {
        //检测星星
        if (unlockPointData.unlockstar > Player.getInstance().nStar) {
            Debug.Log("星星不够，无法解锁");
            return;
        }
        //检测金币
        if (unlockPointData.gold > Player.getInstance().nGold) {
            Debug.Log("金币不够，无法解锁");
            return;
        }
        this._unlockedArr.push(unlockPointData.id);
        //解锁
        Player.getInstance().refreshGold(-unlockPointData.gold);
        Player.getInstance().refreshStar(unlockPointData.star);
        Utils.saveJSONToLocal("landData", this._unlockedArr);
        this._camera.scene.getChildByName("map").getChildByName(unlockPointData.strname).active = false;
    }

    /**解锁种植点或装饰点 */
    private unlockLandPoint(unlockPointData: any) {
        //检测星星
        if (unlockPointData.unlockstar > Player.getInstance().nStar) {
            Debug.Log("星星不够，无法解锁");
            return;
        }
        //检测金币
        if (unlockPointData.gold > Player.getInstance().nGold) {
            Debug.Log("金币不够，无法解锁");
            return;
        }

        this.unLockState(unlockPointData);
        this._unlockedArr.push(unlockPointData.id);
        Utils.saveJSONToLocal("landData", this._unlockedArr);
        Player.getInstance().refreshGold(-unlockPointData.gold);
        Player.getInstance().refreshStar(unlockPointData.star);

    }

    //解锁种植点或装饰点
    unLockState(data: any) {
        let lockData = this.getLandPoint(data.type, data.strname);

        if (data.type == 2)//装饰点，需要将装饰点name记录 
        {
            this.createBottom(data.strname);
            GEvent.DispatchEvent(CommonDefine.EVENT_UNLOCK_PLANT, [data.strname])
        }
        else if (data.type == 1)//解锁种植点，打开提示界面
        {
            GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                view.Init(4, -1, -1, () => { GEvent.DispatchEvent(CommonDefine.EVENT_UNLOCK_PLANT, [data.strname]); });
            }));
        }

        let filterTipsArr = this._tipsDataList.filter((ele, index, array) => { return ele.tipsNode == lockData.lockNode; });
        if (filterTipsArr && filterTipsArr.length > 0) {
            let spliceIndex = this._tipsDataList.indexOf(filterTipsArr[0]);
            this._tipsDataList.splice(spliceIndex, 1);
            filterTipsArr[0].tipsImage.destroy(true);
            filterTipsArr[0] = null;
            filterTipsArr = null;
            if (this._tipsDataList.length == 0)
                Laya.timer.clear(this, this.onUpdate);
        }

        //查找可以解锁的点
        let canUnlockArr = this._defaultLandJosnArr.filter((ele, index, array) => { return data.id == ele.preconditionID.toString() });
        if (canUnlockArr && canUnlockArr.length > 0)//如果有可以解锁的点
        {
            let canUnlockData = null;
            for (let i: number = 0; i < canUnlockArr.length; i++) {
                canUnlockData = this.getLandPoint(canUnlockArr[i].type, canUnlockArr[i].strname);
                this.setTipsData(canUnlockData.lockNode, canUnlockArr[i]);
            }
            canUnlockData = null;
        }

        lockData.modelNode.active = true;
        lockData.lockNode.active = false;
    }

    //找到该类型的种植点
    private getLandPoint(type, strname): any {
        let lockNodeData = { lockNode: null, modelNode: null };
        if (type == 1) {
            lockNodeData.lockNode = this._camera.scene.getChildByName("zhongzhidian") as Spirte3d;
            lockNodeData.lockNode = lockNodeData.lockNode.getChildByName(strname) as Spirte3d;
            lockNodeData.modelNode = lockNodeData.lockNode.getChildAt(1) as Spirte3d;
            lockNodeData.lockNode = lockNodeData.lockNode.getChildAt(0) as Spirte3d;
        }
        else if (type == 2) {
            lockNodeData.lockNode = this._camera.scene.getChildByName("zhuangshiwu") as Spirte3d;
            lockNodeData.lockNode = lockNodeData.lockNode.getChildByName(strname) as Spirte3d;
            lockNodeData.modelNode = lockNodeData.lockNode.getChildAt(0) as Spirte3d;
        }
        return lockNodeData;
    }

    //设置提示泡泡数据
    private setTipsData(lockNode: any, data: any): void {
        if (this._tipsDataList.some((ele, index, array) => { return ele.tipsNode == lockNode; }))
            return;

        let tips =
        {
            tipsImage: null,
            tipsNode: null,
            tipsData: null,
        };
        tips.tipsData = data;
        tips.tipsNode = lockNode;
        tips.tipsImage = new Laya.Image("gameui/tipsBack.png");
        tips.tipsImage.width = tips.tipsImage.width;
        tips.tipsImage.height = tips.tipsImage.height;
        tips.tipsImage.pivotX = tips.tipsImage.width / 2;
        tips.tipsImage.pivotY = tips.tipsImage.height;
        let labImage: Laya.Image = new Laya.Image("gameui/tipsBack_1.png");
        labImage.pivotX = labImage.width / 2;
        labImage.pivotY = labImage.height / 2;
        tips.tipsImage.addChild(labImage);
        labImage.pos(tips.tipsImage.pivotX, tips.tipsImage.height / 2 - 10);
        this.setTipsImagePos(tips);
        LayerManager.getInstance().downUILayer.addChild(tips.tipsImage);
        if (this._tipsDataList.length == 0)
            Laya.timer.loop(10, this, this.onUpdate);
        this._tipsDataList.push(tips);
    }

    //随时更新提示泡泡的位置
    private onUpdate(): void {
        if (this._reallyTime >= 25)
            this._reallyTime = 0;
        for (var i: number = 0; i < this._tipsDataList.length; ++i) {
            this.setTipsImagePos(this._tipsDataList[i], this._reallyTime);
        }
        this._reallyTime += 0.3;
    }

    //设置提示泡泡的位置
    private setTipsImagePos(tips, deltaTime?) {
        let v2: Laya.Vector2 = Utils.worldToScreen(this._camera, tips.tipsNode.transform.position);
        tips.tipsImage.pos(v2.x, v2.y - 35);
        if (!deltaTime)
            return;
        if (deltaTime >= 8 || tips.tipsData.unlockstar > Player.getInstance().nStar
            || tips.tipsData.gold > Player.getInstance().nGold) {
            if (tips.tipsImage.rotation != 0)
                tips.tipsImage.rotation = 0;
            return;
        }
        tips.tipsImage.rotation = Math.sin(Math.PI * deltaTime) * this._tempR;
    }

    // //点击解锁气泡
    // private onClick(data):void
    // {
    //     this.checkLandState(data);
    // }

    //创建装饰底座
    private createBottom(strname): void {
        if (!this._unlockedBottomArr)
            this._unlockedBottomArr = new Array<string>();
        this._unlockedBottomArr.push(strname);
        GameScene.instance.initSceneDecorates();
        //取消种植点的碰撞盒，不再检测该点的碰撞，由装饰碰撞盒自行判断
        this._camera.scene.getChildByName("point").getChildByName(strname).getComponent(Laya.PhysicsCollider).enabled = false;
    }

    //获取已解锁的装饰点数组
    public getBottomUnlockedArr(): any {
        return this._unlockedBottomArr;
    }

    //打开种植界面
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
            //GameUIManager.getInstance().createUI(FlowerpotSelView, [name, 0]);
            SceneManager.getInstance().openScene(DIYScene.instance, [name, 0]);
            return;
        }
        GameUIManager.getInstance().createUI(PointFlowerStateView, [name]);
    }
}