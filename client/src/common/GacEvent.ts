export class GacEvent {
    /**开始连接到服务器 */
    public static readonly OnConnecting: string = "OnConnecting";
    /**连接服务器成功 */
    public static readonly OnConnected: string = "OnConnected";
    /**连接服务器失败 */
    public static readonly OnConnectFail: string = "OnConnectFail";
    /**与服务器断开连接 */
    public static readonly OnConnectClose: string = "OnConnectClose";
    /**断线重连结束 */
    public static readonly OnReConnected: string = "OnReConnected";
    /**客户端循环 */
    public static readonly OnUpdate: string = "OnUpdate";
    /**客户端循环 */
    public static readonly OnLateUpdate: string = "OnLateUpdate";
    /**宣传员UI */
    public static readonly OnShowUI_propagandist: string = "OnShowUI_propagandist";
    /**清洁工UI */
    public static readonly OnShowUI_dustman: string = "OnShowUI_dustman";
    /**清洁工工作時間 */
    public static readonly OnUpdata_dustmantime: string = "OnUpdata_dustmantime";
    /**摄影师UI */
    public static readonly OnShowUI_cameraman: string = "OnShowUI_cameraman";
    /**摄影师工作時間 */
    public static readonly OnUpdata_cameramantime: string = "OnUpdata_cameramantime";
    /**更改金币 */
    public static readonly OnChangeGold: string = "OnChangeGold";
    /**更改星星 */
    public static readonly OnChangeStar: string = "OnChangeStar";
    /**刷新新员工信息 */
    public static readonly RefreshUserInfo: string = "RefreshUserInfo";
    /**刷新百草屋信息 */
    public static readonly RefreshGatherInfo: string = "RefreshGatherInfo";
    /**新解锁功能动画 */
    public static readonly OnUnlockAni: string = "OnUnlockAni";
    /** 多肉成熟 */
    public static readonly OnPlantRipe: string = "OnPlantRipe";
    /** 新手引导3D 场景中点击事件 */
    public static readonly OnClickInSceneByGuide: string = "OnClickInSceneByGuide";
    /** 引导创建气泡 */
    public static readonly GuideCreateBubInScene: string = "GuideCreateBubInScene";
    /** 引导全部结束 */
    public static readonly GuideOver: string = "GuideOver";
    /** 引导全部结束 */
    public static readonly GuideChangePage: string = "GuideChangePage";
    /** diy引导是否完成 */
    public static readonly GuideDiyISOver: string = "GuideDiyISOver";
}