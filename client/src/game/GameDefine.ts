/**
 * 国际化类型
 */
export enum LanguageType {
	Chinese = 0,
	English = 1,
	Japanese = 2
}

/**
 * socket状态
 */
export enum SocketState {
	NONE = 0,
	CONNECTING = 1,
	CONNECTED = 2,
	CONNECT_CLOSE = 3,
	CONNECT_FAIL = 4
}

/**
 * Log等级类型
 */
export enum LogLevel {
	None = 0,
	Error = 1,
	Exception = 2,
	Warning = 3,
	Log = 4
}

/**
 * View状态
 */
export enum ViewState {
	None = 0,
	Loading = 1,
	Loaded = 2
}

/**View层级 */
export enum ViewLayer {
	//显示游戏ui
	UIView = 0,
	//显示血条等
	HPView = 1,
	//显示游戏掉落
	GoodsView = 2,
	//显示公告等
	TopView = 3,
}

/**
 * 主角性别类型
 */
export enum GenderType {
	Male = 1,
	Female = 2
}

/**
 * 方向
 */
export enum DirectionType {
	right = 1,
	left = -1,
}

/**
 * 断线类型
 */
export enum OffLineType {
	eUnknow = 0,            //网络异常
	eBanPlay = 1,			//封号踢人
	eRepeatLogin = 2,		//顶号（重复登录）
	eGMKick = 3,			//GM踢人，不封号
	eServerShutdown = 4,	//服务器关闭
	eLoginFailed = 5,		//登陆失败
	eLoginServerError = 6,	//登陆服务器错误
	eLoginFull = 7,			//服务器高负载
	eReName = 8,			//改名成功后踢人
	eVersionFail = 10,		// 客户端版本号检测错误
	eShield = 9999,			//使用外挂，恶意软件
}

/**
 * 导航类型
 */
export enum NavMeshType {
	/**无效导航网格、不可行走、不可跌落 */
	NavMesh_None = 0,
	/**没有导航网格、不可行走、可跌落 */
	NavMesh_Empty = 1,
	/**完全导航网格、可行走、不可跌落 */
	NavMesh_Full = 2,
}

/**
 * A*节点状态
 */
export enum AstarNodeState {
	NONE = 0,
	OPEN = 1,
	CLOSE = 2,
}

/**
 * Prefab资源路径
 */
export enum ResPrefabPath {
	MapLevel = "res/prefab/LayaScene_MapLevelPrefab/Conventional/",
	Camera = "res/prefab/LayaScene_CameraPrefab/Conventional/",
	Gun = "res/prefab/LayaScene_GunPrefab/Conventional/",
	Npc = "res/prefab/LayaScene_NpcPrefab/Conventional/",
	Effect = "res/prefab/LayaScene_EffectPrefab/Conventional/",
	SkyBox = "res/prefab/LayaScene_SkyBoxPrefab/Conventional/",
}

/**
 * 地图类型枚举
 */
/**
 * 地图类型枚举
 */
export enum MapType {
	MainMap = 0,		//主界面
	BattleMap = 1,		//枪械战斗
	AssemblyMap = 2,	//枪械拼装
}

/**
 * Npc类型枚举
 */
export enum NpcType {
	PlayerNpc = 0,
	MonsterNpc = 1,
	BuildNpc = 2,
}


/**
 * 本地存储枚举
 */
export enum LocalStorage {
	Bottom = "bottom",
	Player = "player",
	//员工数据
	Staff = "Staff",
	GatherLV = "GatherLV",
	Point = "point",
	Tree = "tree"
}



/**
 * 花盆状态
 */
export enum PotState {
	None = 0,
	Grow = 1,
	Ripe = 2,
}


/**
 * 埋点类型
 */
export enum GamePoint {
	Ripe = 0,			//成熟
	Advertising = 1,	//广告	
	Seniority = 2,		//资历
	Sleep = 3,			//休息
	Get = 4,			//领取
	PickUpMoney = 5,	//捡钱
	Photograph = 6,		//拍照
}