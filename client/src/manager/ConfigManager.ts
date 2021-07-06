/**
 * 配置表管理类
 */
export class ConfigManager {
    private _cfgData: Object = {};

    constructor(callBack: Laya.Handler) {
        this.Load(callBack);
    }

    /**
     * 加载配置表
     * @param callBack 回调函数
     */
    private Load(callBack: Laya.Handler) {
        Laya.loader.load("res/config/include.json", Laya.Handler.create(this, () => {
            //解析配置
            let res = Laya.loader.getRes("res/config/include.json");
            if (!res || res.data.length == 0) {
                return;
            }
            Laya.loader.load(res.data, Laya.Handler.create(this, () => {
                this.Initialize();
                callBack && callBack.run();
            }));
        }));
    }

    /**
     * 获取某一配置文件json格式对象
     * @param key 配置文件名
     */
    private Get(key: string): any {
        if (!key) {
            return null;
        }
        let cfgName: string = "res/config/" + key + ".json";
        // 检查表里是否存在
        if (this._cfgData[cfgName]) {
            return this._cfgData[cfgName];
        }
        return Laya.loader.getRes(cfgName);
    }

    /**json 转 数组 */
    GetJsonToArray(json: any): any {
        let array: any = [];
        for (const key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                const element = json[key];
                if (element) {
                    element.id = key
                    array.push(element);
                }
            }
        }
        return array;
    }

    /**
     * 缓存配置表引用
     */
    private Initialize() {
        Tree_Cfg = this.Get("Succulent_C");
        Succulent_Cfg = this.Get("Succulent_C");
        DefaultStatue_Cfg = this.Get("defaultStatue_C");
        Path_Cfg = this.Get("path_C");
        Statue_Cfg = this.Get("Statue_C");
        Npc_Cfg = this.Get("Npc_C");
        Drop_Cfg = this.Get("drop_C");
        Sound_Cfg = this.Get("sound_C");
        Action_Cfg = this.Get("Action_C");
        Constant_Cfg = this.Get("constant_C");
        Staff_Cfg = this.Get("staff_C");
        Collection_station_Cfg = this.Get("Collection_station_C");
        Map_Cfg = this.Get("map_C");
        Succulentpoint_Cfg = this.getSucculentpointDispose(this.Get("Succulentpoint_C"), "strpointname");
        NewTip_Cfg = this.Get("newtip_C");
        Effect_Cfg = this.Get("effect_C");
        guide_Cfg = this.Get("guide_C");
        Land_Cfg = this.Get("plantunlock_C");
        gift_Cfg = this.Get("gift_C");
        freeGuide_Cfg = this.Get("freeguide_C");
        Share_Cfg = this.Get("share_C");
        Sceneeffect_Cfg = this.Get("sceneeffect_C")
        ManageSucculent_Cfg = this.Get("manage_succulent_C")
    }

    /**
     * 特殊处理
     */
    getSucculentpointDispose(_obj, itemName: string) {
        let _succulentpoint = {};
        for (const key in _obj) {
            if (Object.prototype.hasOwnProperty.call(_obj, key)) {
                const element = _obj[key];
                let _indexStr = element[itemName];
                _succulentpoint[_indexStr] = element
            }
        }
        return _succulentpoint
    }
}

/**测试配置表 */
export let Tree_Cfg;
/**音效配置表 */
// export let Sound_Cfg;
/**音效配置表 */
export let Succulent_Cfg;
/**场景装饰配置表 */
export let DefaultStatue_Cfg
/**路径配置表 */
export let Path_Cfg;
/**装饰列表 */
export let Statue_Cfg;
/**NPC表*/
export let Npc_Cfg;
/**场景掉落物表*/
export let Drop_Cfg;
/**声音表*/
export let Sound_Cfg;
/**行为表*/
export let Action_Cfg;
/**常量表*/
export let Constant_Cfg;
/**多肉点*/
export let Succulentpoint_Cfg;
/**员工表*/
export let Staff_Cfg;
/**采集站*/
export let Collection_station_Cfg;
/**采集地图*/
export let Map_Cfg;
/**新功能开启表*/
export let NewTip_Cfg;
/**特效表*/
export let Effect_Cfg;
/**引导表*/
export let guide_Cfg;
/**种植点表 */
export let Land_Cfg;
/**礼物表表 */
export let gift_Cfg
/** 自由引导表 */
export let freeGuide_Cfg;
/**分享表 */
export let Share_Cfg;
/**场景特效 */
export let Sceneeffect_Cfg;
/**图鉴多肉表 */
export let ManageSucculent_Cfg;
