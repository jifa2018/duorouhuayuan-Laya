import { Singleton } from "../common/Singleton";
import { Potted } from "../game/item/Potted";
import { Succulentpoint_Cfg, Constant_Cfg, Sceneeffect_Cfg } from "./ConfigManager";
import { Utils } from "../utils/Utils";
import { LocalStorage, PotState } from "../game/GameDefine";
import { CommonDefine } from "../common/CommonDefine";
import { Point } from "../game/item/Point";
import { Time } from "../common/Time";
import GameScene from "../game/scene/GameScene";
import { GameUIManager } from "./GameUIManager";
import { FlowerRipeTipsView } from "../game/ui/FlowerState/FlowerRipeTipsView";
import { SaveManager, ModelStorage } from "./SaveManager";
import { GEvent } from "../common/GEvent";
import { GacEvent } from "../common/GacEvent";

/** 场景点位花盆管理器 */
export class PotManager extends Singleton {

    /** 点位备用的花盆列表 */
    public PotMap: { [point: string]: Point } = {};

    public PotRipeList: Array<any> = [];

    public scaleInfo = { "1": [0.24, 1], "2": [0.3, 1.7], "3": [0.5, 1.9] };

    constructor() {
        super();
        this.initData();
    }

    initData() {
        for (const key in ModelStorage) {
            let strName = ModelStorage[key];
            if (ModelStorage[key].indexOf("defaulsucculent") != -1) {
                var _data = SaveManager.getInstance().GetCache(strName);
                if (_data) {
                    let point: Point = new Point();
                    point.initPoint(_data, null);
                    let pointName = strName.substr(6, strName.length - 1);
                    this.PotMap[pointName] = point;
                }
            }
        }
    }

    /** 根据点位获得花盆列表 */
    public AddPot(point: string, potid: number, pot: Potted) {
        if (!this.PotMap[point]) {
            this.PotMap[point] = new Point();
            let _data = {};
            _data["Name"] = point;
            _data["UseIndex"] = potid;
            this.PotMap[point].initPoint(_data, null)
        }
        pot.State = PotState.Grow;
        pot.GrowStartTime = Time.Seconds;
        pot.GrowTime = Constant_Cfg[8].value;
        this.PotMap[point].PotList[potid] = pot;
        this.PotMap[point].UseIndex = potid;
        this.PotMap[point].packData()
    }

    public OnSpeedUp(point: string, index: number) {
        if (!this.PotMap[point] || !this.PotMap[point].PotList[index]) {
            return
        }
        let pot = this.PotMap[point].PotList[index];
        pot.State = PotState.Ripe;
        pot.GrowStartTime = 0;
        pot.GrowTime = 0;
        this.PotMap[point].packData();
        GameScene.instance.createSceneBotany()
        this.PotRipeList.push([point, index]);
        if (this.PotMap[point].growProBar) {
            this.PotMap[point].growProBar.destroy();
        }
        GameUIManager.getInstance().showUI(FlowerRipeTipsView);
        GEvent.DispatchEvent(GacEvent.OnPlantRipe);
    }

    /** 根据点位获得花盆列表 */
    public DelPot(point: string, index: number) {
        if (!this.PotMap[point]) {
            return;
        }
        let tPoint: Point = this.PotMap[point];
        if (tPoint.UseIndex == index) {
            //删除场景中的多肉
            GameScene.instance.delPotted(tPoint, "point_" + tPoint.Name, index);
        }
        tPoint.DelPot(index);
        tPoint.packData();
    }

    /** 获得点位当前最大坑位 */
    public GetPotMaxPost(point: string) {
        return Succulentpoint_Cfg[point].ministorage || 0 + (this.PotMap[point] ? this.PotMap[point].ExpansionNum : 0);
    }

    /** 点位当前使用的花盆索引 */
    public GetPointCurPotIndex(point: string) {
        if (!this.PotMap[point])
            return -1;
        return this.PotMap[point].UseIndex;
    }

    /** 点位当前使用的花盆索引 */
    public GetPointCurPot(point: string): Potted {
        if (!this.PotMap[point] || !this.PotMap[point].PotList[this.PotMap[point].UseIndex])
            return;
        return this.PotMap[point].PotList[this.PotMap[point].UseIndex];
    }

    /** 替换花盆 */
    public ReplaceCurUse(point: string, index) {
        if (!this.PotMap[point])
            return;
        let tPoint: Point = this.PotMap[point];
        tPoint.UseIndex = index
        tPoint.packData()
        GameScene.instance.createPotted(tPoint, "point_" + tPoint.Name, index);
    }

    public UpdateScenePot(point: string, index) {
        if (!this.PotMap[point] || !this.PotMap[point].PointDataList[index])
            return;
        let tPoint: Point = this.PotMap[point];
        tPoint.PointDataList[index].State = PotState.Ripe;
        tPoint.PointDataList[index].GrowStartTime = 0;
        tPoint.PointDataList[index].GrowTime = 0;
        tPoint.packData(tPoint.PointDataList[index], index)
        GameScene.instance.createPotted(tPoint, "point_" + tPoint.Name, index);

        this.PotRipeList.push([point, index]);
        GameUIManager.getInstance().showUI(FlowerRipeTipsView);
        GEvent.DispatchEvent(GacEvent.OnPlantRipe);


        /**2020年10月14日17:30:09 添加种植点特效 */
        let sp3d = GameScene.instance.getScene().getChildByName("point").getChildByName(tPoint.Name) as Laya.Sprite3D;
        GameScene.instance.playEffect(Sceneeffect_Cfg[1].streffect, sp3d.transform.position, 2000);

    }

    /** 根据点位获得花盆列表 */
    public SavePot(point: string, potid: number, pot: Potted) {
        if (!this.PotMap[point] || !this.PotMap[point].PotList[potid]) {
            return;
        }
        this.PotMap[point].PotList[potid] = pot;
        this.PotMap[point].packData()
    }

    public GetPottedQuiteImg() {

    }

    /** 打包数据-- 存储数据 */
    public PackageData() {
        for (const key in this.PotMap) {
            this.PotMap[key].packData()
        }
    }
}