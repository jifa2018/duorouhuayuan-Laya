export class CommonDefine {
    //event
    public static EVENT_BEGIN_VIEW: string = "beginView";
    public static EVENT_END_VIEW: string = "endView";
    public static EVENT_BEGIN_ROLL: string = "beginRoll";
    public static EVENT_ROLL_SCREEN: string = "rollScreen";
    public static EVENT_ROLL_BACK: string = "rollBack";
    public static EVENT_CLICK_TARGET: string = "clickTarget";

    public static EVENT_LEFT_ROTATE: string = "leftRotate";
    public static EVENT_RIGHT_ROTATE: string = "rightRotate";
    public static EVENT_BIG_ZOOM: string = "bigZoom";
    public static EVENT_SMALL_ZOOM: string = "smallZoom";

    public static EVENT_CREATE_TREE: string = "createTree";//种植
    public static EVENT_CREATE_TREE_FINISH: string = "createTreeFinish"; //种植完毕
    public static EVENT_CHECKED_POTTED: string = "checkedPotted"; //选盆
    public static EVENT_CHECKED_POTTED_FINISH: string = "checkedPottedFinish"; //选盆完毕
    public static EVENT_POT_INIT_FINISH: string = "potInitFinish"; //加载完毕

    public static EVENT_POTTED_CHANGE: string = "pottedChange"; //盆中的植物数量变化
    public static EVENT_EDIT: string = "edit"; //编辑模式

    public static EVENT_BOTTOM: string = "bottom"; //底座事件
    public static EVENT_BOTTOM_LEVEL_UP: string = "bottomLevelUp"; //底座升级

    public static EVENT_BOTTOM_REFRESH: string = "bottomRefresh"; //底座UI刷新
    public static EVENT_MAIN_REFRESH: string = "mainRefresh"; //主界面刷新
    public static EVENT_ILLUSTRATED_REFRESH: string = "illustratedRefresh"; //图鉴刷新
    public static EVENT_DIYUI_REFRESH: string = "diyUIRefresh"; //diy界面刷新
    public static EVENT_MAIN_UI_SHOW: string = "mainUIShow"; //主界面部分uI显示隐藏
    public static EVENT_MAIN_GOODS_EVENT: string = "mainGoodsEvent"; //主界面礼物事件
    public static EVENT_DIY_RESET_TREE: string = "diyResetTree"; //DIY界面的多肉的恢复

    public static EVENT_UNLOCK_PLANT = "unlockplant";//解锁种植点事件

    public static EVENT_POTTED_CHANGEED: string = "potted_changed";//切换花盆了
    public static EVENT_REFRESH_INDEXDECORATEVIEW_LIST: string = "refreshIndexDecorateViewList"; //刷新装饰页面的 2020年10月26日11:56:43


    //animation
    public static ANIMATION_WAKL: string = "walk";       //走路
    public static ANIMATION_IDLE: string = "idle";       //发呆
    public static ANIMATION_Run: string = "run";       //跑起来
    public static ANIMATION_TakePhoto: string = "paizhao";       //拍照
    public static ANIMATION_PayMoney: string = "saqian";       //撒钱
    public static ANIMATION_makeTrouble: string = "daoluan";       //捣乱
    public static ANIMATION_caiji: string = "caiji";       //采集
    public static ANIMATION_chazhao: string = "chazhao";       //查找
    public static ANIMATION_xiuxian: string = "xiuxian";       //闲置
    public static ANIMATION_chengkezuo: string = "chengkezuo";       //乘客坐
    public static ANIMATION_tuozhuai: string = "tuozhuai";       //乘客坐
    public static ANIMATION_PickMoney: string = "jianqian";       //捡钱


    //npctype
    public static SAUNTERNPC: string = "saunterNpc"; //游荡npc
    public static RICHNPC: string = "richNpc";    //土豪

    public static VALUE_ZERO: number = 0;

    //local Storage
    public static diySceneUnFinish: string = "DIYUnFinish";
    public static diySceneFinish: string = "DIYFinish";
    //多肉表中类型
    public static SUCCULENT_TYPE_DUOROU: number = 1;     //多肉
    public static SUCCULENT_TYPE_HUAPEN: number = 2;     //花盆
    public static SUCCULENT_TYPE_ZHUANGSHI: number = 3;  //装饰

    //场景定义
    public static SCENE_CAIJI2: number = 0;
    public static SCENE_CAIJI1: number = 1;
    public static SCENE_RENSHIBU: number = 2;
    public static SCENE_MAIN1: number = 3;
    public static SCENE_MAIN2: number = 4;
    public static SCENE_MAIN3: number = 5;


}