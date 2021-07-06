/**
 * @Purpose 底座管理器
 * 用于创建 / 删除 / 打包数据
 * @Author zhanghj
 * @Date 2020/8/6 20:05
 * @Version 1.0
 */
import { Bottom } from "./Bottom";
import GameScene from "../scene/GameScene";
import { Utils } from "../../utils/Utils";
import GameConfig from "../../GameConfig";
import { LocalStorage } from "../GameDefine";
import { CommonDefine } from "../../common/CommonDefine";
import { Singleton } from "../../common/Singleton";
import { ConfigManager, DefaultStatue_Cfg, Succulent_Cfg, Statue_Cfg } from "../../manager/ConfigManager";
import { Debug } from "../../common/Debug";
import { Player } from "../player/Player";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
import { LandManager } from "../../manager/LandManager";
export class BottomCreater extends Singleton {

    //private static _instance: BottomCreater;
    private _bottomList: Array<Bottom> = new Array<Bottom>();
    public _curSelectBottom: Bottom = null;
    public maxBottomUpLv: number = 0; //最大升级限制
    statueArray: any;
    defaultStatueArray: any;

    // public static get instance(): BottomCreater {
    //     if (!this._instance)
    //         this._instance = new BottomCreater();
    //     return this._instance;
    // }

    constructor() {
        super();
        Laya.stage.on(CommonDefine.EVENT_BOTTOM, this, this.createSceneDecorates)
        Laya.stage.on(CommonDefine.EVENT_BOTTOM_LEVEL_UP, this, this.bottomLevelUp)
        let _arr = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
        _arr.forEach(element => {
            if (element.StatueType == 1) {
                this.maxBottomUpLv = element.lv
            }
        });
        this.statueArray = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
        this.defaultStatueArray = ConfigManager.prototype.GetJsonToArray(DefaultStatue_Cfg);
    }

    /**当前选中的底座 */
    curSelectBottom(b: Bottom) {
        this._curSelectBottom = b as Bottom;
    }

    clearSelectBottom() {
        this._curSelectBottom = null;
    }

    /**
     * 根据id创建底座
     * @param id
     */
    public createBottom(data): Bottom {
        var bottom: Bottom = new Bottom();
        bottom.init(data);
        this._bottomList.push(bottom);
        return bottom;
    }

    /**
     * 加载默认底座
     */
    public getDefaultData() {

        let nodeArr = LandManager.getInstance().getBottomUnlockedArr();
        let nCurDecorateId = this.getDefaulSelectDecorate();
        let defauleData = []
        // Player.getInstance().nStar = 1000;
        nodeArr.forEach(ele => {
            let statueData = this.getStatueItemData(1);
            let d = {
                parentName: ele,                                // 场景中的节点
                bLevel: 1,                                      // 等级
                bId: statueData.id,                             // 装饰表中id
                attraction: statueData.attraction,              // 吸引力
                star: 0,                                        // 评星
                curDecorateId: nCurDecorateId,                  // 装饰模型id
                curDecorateInfo: {                              // 装饰信息
                    state: false, //状态
                    time: 0       //时间
                },
                unLockDecorates: [nCurDecorateId]                // 已开的装饰列表
            };
            defauleData.push(d);
            // Player.getInstance().refreshStar(statueData.GiveStar)
        });
        return defauleData

    }

    /**获取解锁默认选择的装饰物 */
    getDefaulSelectDecorate() {
        for (const key in Statue_Cfg) {
            if (Object.prototype.hasOwnProperty.call(Statue_Cfg, key)) {
                const element = Statue_Cfg[key];
                if (element.StatueType > 1) {
                    return element.id;
                }
            }
        }
        console.log("err：===========表格中配置错误====方法：getDefaulSelectDecorate==========")
    }

    getStatueItemData(_lv): any {
        for (let index = 0; index < this.statueArray.length; index++) {
            const element = this.statueArray[index];
            if (element.lv == _lv) {
                return element;
            }
        }
    }

    getPooledData(_initData) {
        let data = _initData;
        let sData = SaveManager.getInstance().GetCache(ModelStorage.Bottom);
        sData = sData || (sData = [])
        sData.forEach(element => {
            for (let index = 0; index < data.length; index++) {
                if (data[index].parentName == element.parentName) {
                    data[index] = element;
                }
            }
        });
        this._bottomList.forEach((element, index) => {
            for (let index = 0; index < data.length; index++) {
                ;
                if (data[index].parentName == element._name) {
                    data.splice(index, 1)
                }
            }
        });
        return data
    }

    /**
     * 根据数据创建底座
     * @param data
     */
    public createByData(data: any, scene: any): void {
        let arr = this.getPooledData(data);
        arr.forEach(element => {
            let _parent: Laya.Sprite3D = scene.getChildByName("point").getChildByName(element.parentName);
            if (!_parent) {
                Utils.clearLocalByKey(LocalStorage.Bottom);
                Debug.Log("存在旧数据，已自动清除，请刷新")
            } else {
                _parent.active = true;
                let bottom = this.createBottom(element);
                bottom.transform.rotationEuler = new Laya.Vector3(0, bottom.transform.rotationEuler.y + 180, 0);
                _parent.destroyChildren();
                _parent.addChild(bottom)
                // console.log(scene.getChildByName("point"))
            }
        });

        // this.refreshData()
    }


    /**
     * 构建装饰物
     * _decorateId 装饰物id
     */
    private createSceneDecorates() {
        this._curSelectBottom.addDecorate()
        //更新存储
        this.refreshData()
        Laya.stage.event(CommonDefine.EVENT_BOTTOM_REFRESH)
    }

    /**
     * 升级底座
     * 目前只有 parentName 是唯一的属性
     */
    public bottomLevelUp() {
        let parentName = this._curSelectBottom._name;
        for (let index = 0; index < this._bottomList.length; index++) {
            const e = this._bottomList[index];
            if (e._name == parentName) {
                let cmp = Statue_Cfg[e._bId];
                e.onLevelUp(this.maxBottomUpLv);
                this.deductCost(cmp);
                e.addStar(cmp.GiveStar);
                e.addAttraction(cmp.attraction);

                break
            }
        }
        //更新存储
        this.refreshData()
        Laya.stage.event(CommonDefine.EVENT_BOTTOM_REFRESH)
    }


    /**解锁装饰消息 */
    public unLockDecorate(_id) {
        let cmp = Statue_Cfg[_id];
        this._curSelectBottom.unLockDecoratesById(_id);
        this._curSelectBottom.addStar(cmp.GiveStar);
        this._curSelectBottom.addAttraction(cmp.attraction);
        this.deductCost(cmp);
        //更新存储
        this.refreshData()
        Laya.stage.event(CommonDefine.EVENT_BOTTOM_REFRESH)
    }

    /**
     * 升级/解锁
     * 扣除消耗
     * cmp 表数据
    */
    deductCost(cmp) {


        //TODO 通过玩家实例 扣除相应的内容
        Player.getInstance().refreshStar(cmp.GiveStar)      // 更新星星
        Player.getInstance().refreshGold(-cmp.UnlockGold)   // 更新金币

    }

    /**
     * 序列化存储
     */
    refreshData() {
        let _data = [];
        this._bottomList.forEach(_e => {

            //存储装饰信息
            let _curDecorateInfo = {};
            if (_e._curDecorate) {
                _curDecorateInfo["state"] = _e._curDecorate.state
                _curDecorateInfo["time"] = _e._curDecorate.time
            }

            let item = {
                parentName: _e._name,
                bLevel: _e._level,
                bId: _e._bId,
                attraction: _e._attraction,
                star: _e._star,
                curDecorateId: _e._curDecorateId,
                curDecorateInfo: _curDecorateInfo,
                unLockDecorates: _e._unLockDecorates
            };
            _data.push(item);
        });

        // console.log("========序列化存储=========", _data)

        SaveManager.getInstance().SetBottomCache(_data);
    }

    getBottomList() {
        return this._bottomList;
    }
}