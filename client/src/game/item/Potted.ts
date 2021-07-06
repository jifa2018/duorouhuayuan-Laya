/***
 * 盆栽类
 */
import { Tree } from "./Tree";
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import { CommonDefine } from "../../common/CommonDefine";
import { ResourceManager } from "../../manager/ResourceManager";
import Handler = Laya.Handler;
import { Tree_Cfg, Constant_Cfg } from "../../manager/ConfigManager";
import { GameUIManager } from "../../manager/GameUIManager";
import { Utils } from "../../utils/Utils";
import { PottedStruct, TreeStruct } from "./PottedStruct";
import { Global } from "../../utils/Global";
import { DIYScene } from "../scene/DIYScene";
import PhysicsCollider = Laya.PhysicsCollider;
import { PotState } from "../GameDefine";
import { BagSystem } from "../bag/BagSystem";
import { DiyToolView } from "../ui/DiyView/DiyToolView";

export class Potted extends Sprite3D {
    //生长时间
    private _growTime: number;
    //植物列表
    public _treeList: Array<Tree> = new Array<Tree>();
    //花盆id
    private _containerId: number = 20006;
    //种植检测片
    private _plantPlan: Sprite3D;
    //花盆对象
    private _potted: Sprite3D;
    //种植序号
    private _index: number = 0;
    //总价值
    //private _quality: number = 10;

    public GrowStartTime: number = 0;
    public GrowTime: number = 0;

    public State = PotState.None;

    /**
     * 初始化
     * @param containerId
     */
    public initPotted(containerId: number, complate: Handler = null): void {

        if (!Tree_Cfg[containerId]) {
            throw Error("id = " + containerId + " not found");
            return;
        }
        if (containerId != CommonDefine.VALUE_ZERO) {
            if(this._potted)
            {
                this._potted.destroy();
                this._potted = null;
            }
            this._containerId = containerId;
            ResourceManager.getInstance().getResource(Tree_Cfg[containerId].strmodelurl, Handler.create(this, function (ret: Sprite3D) {
                this.addChild(ret);
                this._potted = ret;
                //this.quality += Tree_Cfg[containerId].point;
                ret.transform.position = new Vector3(0, 0, 0);
                this._plantPlan = ret.getChildByName("floor");
                complate && complate.runWith(0);

                Laya.stage.event(CommonDefine.EVENT_POT_INIT_FINISH);
            }))
        }
        else {

        }
        Laya.stage.event(CommonDefine.EVENT_CHECKED_POTTED_FINISH);
    }

    /***
     * ui拖拽创建一颗多肉
     * @param tree
     * @param pos
     */
    public addTreeByInstance(tree: Tree, pos: Vector3, shadow: boolean = false): void {
        this._addTree(tree, pos, null, -this.transform.localRotationEulerY, shadow);
        Laya.stage.event(CommonDefine.EVENT_POTTED_CHANGE);
    }

    /**
     * 创建一颗多肉
     * @param treeId        多肉id
     * @param pos           种植位置
     * @param scal          缩放
     * @param rotate        旋转
     */
    public addTree(treeId: number, pos: Vector3, scale: number = 1, rotate: number = 0, shadow: boolean = false, complate: Handler = null, enablePhysics: boolean = true, isSave: boolean = false): void {
        new Tree(treeId, scale, Handler.create(this, function (tree) {
            this._addTree(tree, pos, scale, rotate, shadow, enablePhysics);
            complate && complate.run();
        }), isSave);

    }

    private _addTree(tree: Tree, pos: Vector3, scale: number, rotate: number, shadow: boolean = false, enablePhysics: boolean = true): void {
        this.addChild(tree);
        // if (scale != null)
        //     tree.setScale(scale);
        if (rotate != null)
            tree.setRotate(rotate);
        tree.isPlanted = true;
        tree.treeIndex = this._index;
        tree.setPosition(pos);
        this._treeList.push(tree);
        this._index += 1;
        //this.quality += tree.quality;
        Utils.setMeshCastShadow(tree, shadow);

        var temp = tree.getChildAt(0);
        this.delayCall(temp, enablePhysics);
    }

    private delayCall(node: any, bool: any): void {
        if (!node) {
            Laya.timer.once(10, this, function () {
                this.delayCall(node, bool)
            })
        }
        else {
            var d = node.getComponent(PhysicsCollider);
            d.enabled = bool;
        }
    }
    /** 隐藏多肉 */
    public HideTree(val:boolean)
    {
        for(let i in this._treeList)
        {
            this._treeList[i].active = val
        }
    }
    /**
     * 删除多肉
     * @param treeIndex
     */
    public delTree(tree: Tree): void {
        var inList: boolean = false;
        for (var i: number = 0; i < this._treeList.length; ++i) {
            if (this._treeList[i].treeIndex == tree.treeIndex) {
                BagSystem.getInstance().addItem(tree.id, tree.getPayBackNumber());
                //this.quality -= tree.quality;
                this._treeList[i].destroy();
                this._treeList.splice(i, 1);
                inList = true;
                break;
            }
        }
        if (!inList) tree.destroy();
        GameUIManager.getInstance().destroyUI(DiyToolView)
        this.clearSelect();
        Laya.stage.event(CommonDefine.EVENT_POTTED_CHANGE);
    }

    /***
     * 品质
     * @param val
     */
    // public set quality(val: number) {
    //     this._quality = val;
    // }

    /***
     * 品质
     * @param val
     */
    public get quality(): number {
        return this.giveMark();
    }


    /***
    * 产出金币
    */
    public get gold(): number {
        let _gold = 0;
        this._treeList.forEach(tree => {
            _gold += Tree_Cfg[tree._id].goldProduce;
        });
        return _gold;
    }

    /***
     * 花盆id
     */
    public get containerId(): number {
        return (this._containerId);
    }

    /***
     * 容量
     */
    public get Volume(): number {
        return (this._index);
    }

    /***
     * 容量
     */
    public get Capacity(): number {
        return Tree_Cfg[this._containerId].capacity;
    }

    /***
    * 花盆植物数
    */
    public get TreeCount(): number {
        let treeNumber = 0;
        this._treeList.forEach(tree => {
            if (tree._type == 1)
                treeNumber++;
        });
        return treeNumber;
    }

    /**
     * 有偏好道具返回偏好加分
     */
    public ExtraPrefer(): number {
        return Tree_Cfg[this._containerId].extraPrefer = 0 ? 0 : Tree_Cfg[this._containerId].pointsPrefer / 100;
    }

    /**
     * 多样性加分
     */
    public BorderMultiScore(): number {
        if (!this._containerId) return 0;  
        let treeNumber = 0; let adornNumber = 0;
        let borderMulti = Tree_Cfg[this._containerId].borderMulti;
        let _List: Array<Tree> = new Array<Tree>();
        this._treeList.forEach(tree => {
            if (tree._type == 1)
                _List.push(tree);
            else if (tree._type == 3)
                adornNumber++;
        });

        let _Listtype: Array<[number, number]> = new Array<[number, number]>();
        _List.forEach(ele => {
            let c: [number, number] = [ele._id, ele._type];
            if (_Listtype.indexOf(c) == -1) {
                _Listtype.push(c);
            }
        });
        treeNumber = _Listtype.length;
        if (adornNumber == 0) {
            return 0;
        }
        if (treeNumber + adornNumber > borderMulti)
            return Tree_Cfg[this._containerId].weightMulti / 100;
        else if (treeNumber / adornNumber == borderMulti)
            return 0;
        else
            return Tree_Cfg[this._containerId].weightMulti / 100 * -1;
    }

    public clearSelect(): void {
        for (var i: number = 0; i < this._treeList.length; ++i) {
            Utils.setModelAlpha(this._treeList[i], 1);
            this.changeRenderMode(null)
            this.changeRenderModeTest();
        }
    }

    public removeNotice(tree: Tree): void {
        Utils.setModelAlpha(tree, 0.3);
    }

    public clearRemoveNotice(tree: Tree): void {
        Utils.setModelAlpha(tree, 1);
    }

    public changeRenderMode(tree: Tree): void {
        for (var i: number = 0; i < this._treeList.length; ++i) {
            if (tree && tree.treeIndex == this._treeList[i].treeIndex)
                Utils.setRenderMode(this._treeList[i], 1);
            else
                Utils.setRenderMode(this._treeList[i], 2);
        }
    }

    //todo this funciton
    public changeRenderModeTest(): void {
        for (var i: number = 0; i < this._treeList.length; ++i) {
            Utils.setRenderMode(this._treeList[i], 1);
        }
    }

    public setSelect(tree: Tree): void {
        for (var i: number = 0; i < this._treeList.length; ++i) {
            if (this._treeList[i].treeIndex == tree.treeIndex) {
                Utils.setModelAlpha(this._treeList[i], 1);
            }
            else {
                Utils.setModelAlpha(this._treeList[i], 0.3);
            }
        }
    }

    /**
     * 打包花盆数据
     */
    public packData(name: string): any {
        if (this._containerId == 0) {
            console.log("containerid is empty, need not save");
            return;
        }
        var pottedStruct = new PottedStruct();
        var treesArr: Array<any> = new Array<any>();
        var treeObject: Tree;
        var treeStruct;
        for (var i: number = 0; i < this._treeList.length; ++i) {
            treeObject = this._treeList[i];
            treeStruct = new TreeStruct();
            treeStruct.pos = treeObject.getPosition();
            treeStruct.rotate = treeObject.getRotate();
            treeStruct.scale = treeObject.getScale();
            treeStruct.treeId = treeObject.getTableId();
            treeStruct.isPlant = true;
            treesArr.push(treeStruct);
        }
        pottedStruct.containerId = this._containerId;
        pottedStruct.treeArray = treesArr;
        pottedStruct.rotateY = Number(this.transform.rotationEuler.y.toFixed(1));
        //pottedStruct.quality = this.quality;

        pottedStruct.GrowStartTime = this.GrowStartTime;
        pottedStruct.GrowTime = this.GrowTime;
        pottedStruct.State = this.State;

        return pottedStruct;
    }

    /***
     * 根据数据创建花盆
     * @param data
     * @param complate
     */
    public static createByData(data: any, complate: Handler, shadow: boolean = false, enablePhysics: boolean = true): void {
        if (!data) {
            complate && complate.runWith(null);
            return;
        }
        var pottedStruct = new PottedStruct();
        pottedStruct.unPackData(data);
        var potted = new Potted();
        var loadedNum: number = 0;
        var maxLoaded: number = 0;
        potted.initPotted(pottedStruct.containerId, Handler.create(this, function () {
            var arr: Array<TreeStruct> = pottedStruct.treeArray;
            maxLoaded = arr.length;
            potted.GrowStartTime = pottedStruct.GrowStartTime
            potted.GrowTime = pottedStruct.GrowTime;
            potted.State = pottedStruct.State;
            if (arr.length > 0) {
                for (var i: number = 0; i < arr.length; ++i) {
                    potted.addTree(arr[i].treeId, new Vector3(arr[i].pos.x, arr[i].pos.y, arr[i].pos.z), arr[i].scale, arr[i].rotate, shadow, Handler.create(this, checkLoaded), enablePhysics, true);

                }
            } else {
                complate && complate.runWith([potted, pottedStruct.rotateY]);
            }
        }))

        function checkLoaded() {
            loadedNum += 1;
            if (loadedNum == maxLoaded) {
                complate && complate.runWith([potted, pottedStruct.rotateY]);
            }
        }
    }

    /**
     * 获取种植面高
     */
    public getFloorHeight(): number {
        if (this._plantPlan && this._plantPlan.transform) {
            return this._plantPlan.transform.localPositionY;
        }
        return 0;
    }

    /**
     * 当前鼠标位置是否可放置多肉
     * @param hitArray
     */
    public canPut(hitArray): any {
        for (var i: number = 0; i < hitArray.length; ++i) {
            if (hitArray[i].collider.owner.name == this._plantPlan.name) {
                return hitArray[i].point;
            }
        }
        return null;
    }


    public GetQualityImg() {
        for (const key in Constant_Cfg[9].value) {
            if (this.quality < Constant_Cfg[9].value[key]) {
                return "gameui/flowerstate/potquality" + (Number(key) - 1) + ".png"//Constant_Cfg[10].value[key]
            }
        }
        return "";
    }

    //获取当前阶段的后面两个阶段
    public GetNextTwoNode() {
        let len = Utils.GetMapLength(Constant_Cfg[9].value)
        for (const key in Constant_Cfg[9].value) {
            if (this.quality < Constant_Cfg[9].value[key]) {
                let k = Number(key)
                return [k - 1, k]
            }
        }
        return [len - 1, len];
    }

    public GetQualityName() {
        for (const key in Constant_Cfg[9].value) {
            if (this.quality < Constant_Cfg[9].value[key]) {
                return Constant_Cfg[10].value[Number(key)-1]; //Constant_Cfg[10].value[key]
            }
        }
        return "";
    }

    public destroy(destroyChild?: boolean) {
        super.destroy(destroyChild);

    }

    /**
     * 更換花盆
     * @param id
     */
    public changePotted(id: number): void {
        if (this._potted) {
            if (this.containerId == id || id == CommonDefine.VALUE_ZERO) return;
            this._potted.destroy();
            this._potted = null;
            ResourceManager.getInstance().getResource(Tree_Cfg[id].strmodelurl, Handler.create(this, function (ret: Sprite3D) {
                this._potted = ret;
                this._containerId = id;
                this.addChild(ret);
                this._plantPlan = ret.getChildByName("floor");
                Laya.stage.event(CommonDefine.EVENT_POTTED_CHANGEED, [id]);

                //处理之前的植物位置
                var p = ret.getChildByName("switch_point");
                if(!p)  return;
                for(var i:number = 0; i < this._treeList.length; ++i)
                {
                    var n:Sprite3D = p.getChildByName((i+1).toString()) as Sprite3D;
                    if(!n) continue;
                    this._treeList[i].setPosition(n.transform.position);
                }
            }));

        }
        else {
            console.log("no potted");
        }
    }

    public payBack(): void {
        for (var i: number = 0; i < this._treeList.length; ++i) {
            BagSystem.getInstance().addItem((this._treeList[i] as Tree).id, (this._treeList[i] as Tree).getPayBackNumber());
        }
    }


    /**
     * 打赏显示
     */
    public giveReward(): number {
        let gold = this.takePhoto_outputGold() * Constant_Cfg[20].value;
        gold = Math.floor(gold);
        return gold;
    }

    /**
     * 拍照显示产出金币
     */
    public takePhoto_outputGold(): number {
        let gold = this.gold;//基本金币
        let borderMultiScore = this.BorderMultiScore();
        if (borderMultiScore < Constant_Cfg[19].value) {
            borderMultiScore = Constant_Cfg[19].value;
        }
        let addition = Math.sqrt(this.TreeCount / this.Capacity) + this.ExtraPrefer() + borderMultiScore;
        let getGold = Math.floor(gold * addition);
        return getGold;
    }

    
     /**
     * 评分
     */
    public giveMark():number
    {
        let score = 0;
        score = Math.pow((this.takePhoto_outputGold()/5),0.47) * 2 * this.takePhoto_outputGold();
        score = Math.floor(score);
        console.log("score: " + score);
        return score;
    }



}