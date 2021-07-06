(function () {
    'use strict';

    class SceneBase extends Laya.Sprite {
        constructor() {
            super();
            this.sceneLoaded = false;
            this.scene3d = null;
        }
        onAwake() {
            super.onAwake();
        }
        onEnable() {
            super.onEnable();
        }
        onDisable() {
            super.onDisable();
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
        }
        onDestroy() {
            super.onDestroy();
        }
        showScene(param, handler) {
        }
        hideScene() {
            this.removeSelf();
        }
    }

    class Global {
    }
    Global.tempVector3 = new Laya.Vector3();
    Global.sceneLock = false;

    class CommonDefine {
    }
    CommonDefine.EVENT_BEGIN_VIEW = "beginView";
    CommonDefine.EVENT_END_VIEW = "endView";
    CommonDefine.EVENT_BEGIN_ROLL = "beginRoll";
    CommonDefine.EVENT_ROLL_SCREEN = "rollScreen";
    CommonDefine.EVENT_ROLL_BACK = "rollBack";
    CommonDefine.EVENT_CLICK_TARGET = "clickTarget";
    CommonDefine.EVENT_LEFT_ROTATE = "leftRotate";
    CommonDefine.EVENT_RIGHT_ROTATE = "rightRotate";
    CommonDefine.EVENT_BIG_ZOOM = "bigZoom";
    CommonDefine.EVENT_SMALL_ZOOM = "smallZoom";
    CommonDefine.EVENT_CREATE_TREE = "createTree";
    CommonDefine.EVENT_CREATE_TREE_FINISH = "createTreeFinish";
    CommonDefine.EVENT_CHECKED_POTTED = "checkedPotted";
    CommonDefine.EVENT_CHECKED_POTTED_FINISH = "checkedPottedFinish";
    CommonDefine.EVENT_POT_INIT_FINISH = "potInitFinish";
    CommonDefine.EVENT_POTTED_CHANGE = "pottedChange";
    CommonDefine.EVENT_EDIT = "edit";
    CommonDefine.EVENT_BOTTOM = "bottom";
    CommonDefine.EVENT_BOTTOM_LEVEL_UP = "bottomLevelUp";
    CommonDefine.EVENT_BOTTOM_REFRESH = "bottomRefresh";
    CommonDefine.EVENT_MAIN_REFRESH = "mainRefresh";
    CommonDefine.EVENT_ILLUSTRATED_REFRESH = "illustratedRefresh";
    CommonDefine.EVENT_DIYUI_REFRESH = "diyUIRefresh";
    CommonDefine.EVENT_MAIN_UI_SHOW = "mainUIShow";
    CommonDefine.EVENT_MAIN_GOODS_EVENT = "mainGoodsEvent";
    CommonDefine.EVENT_DIY_RESET_TREE = "diyResetTree";
    CommonDefine.EVENT_UNLOCK_PLANT = "unlockplant";
    CommonDefine.EVENT_POTTED_CHANGEED = "potted_changed";
    CommonDefine.ANIMATION_WAKL = "walk";
    CommonDefine.ANIMATION_IDLE = "idle";
    CommonDefine.ANIMATION_Run = "run";
    CommonDefine.ANIMATION_TakePhoto = "paizhao";
    CommonDefine.ANIMATION_PayMoney = "saqian";
    CommonDefine.ANIMATION_makeTrouble = "daoluan";
    CommonDefine.ANIMATION_caiji = "caiji";
    CommonDefine.ANIMATION_chazhao = "chazhao";
    CommonDefine.ANIMATION_xiuxian = "xiuxian";
    CommonDefine.ANIMATION_chengkezuo = "chengkezuo";
    CommonDefine.ANIMATION_tuozhuai = "tuozhuai";
    CommonDefine.ANIMATION_PickMoney = "jianqian";
    CommonDefine.SAUNTERNPC = "saunterNpc";
    CommonDefine.RICHNPC = "richNpc";
    CommonDefine.VALUE_ZERO = 0;
    CommonDefine.diySceneUnFinish = "DIYUnFinish";
    CommonDefine.diySceneFinish = "DIYFinish";
    CommonDefine.SUCCULENT_TYPE_DUOROU = 1;
    CommonDefine.SUCCULENT_TYPE_HUAPEN = 2;
    CommonDefine.SUCCULENT_TYPE_ZHUANGSHI = 3;
    CommonDefine.SCENE_CAIJI2 = 0;
    CommonDefine.SCENE_CAIJI1 = 1;
    CommonDefine.SCENE_RENSHIBU = 2;
    CommonDefine.SCENE_MAIN1 = 3;
    CommonDefine.SCENE_MAIN2 = 4;
    CommonDefine.SCENE_MAIN3 = 5;

    class Singleton {
        static getInstance() {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        }
    }

    class SoundManager extends Singleton {
        OnStart() {
        }
        OnDestroy() {
        }
        playMusic(url, loop = true) {
            if (url != null) {
                Laya.SoundManager.playMusic(url, loop == true ? 0 : 1);
            }
        }
        setMusicVolume(volume) {
            Laya.SoundManager.setMusicVolume(volume);
        }
        stopMusic() {
            Laya.SoundManager.stopMusic();
        }
        playSound(url, loop = false) {
            if (url != null) {
                Laya.SoundManager.playSound(url, loop == true ? 0 : 1);
            }
        }
        setSoundVolume(volume, url) {
            if (url != null) {
                Laya.SoundManager.setSoundVolume(volume, url);
            }
            else {
                Laya.SoundManager.setSoundVolume(volume);
            }
        }
        stopSound(url) {
            if (url != null) {
                Laya.SoundManager.stopSound(url);
            }
        }
        stopAllSound() {
            Laya.SoundManager.stopAllSound();
        }
        StopAll() {
            Laya.SoundManager.stopAll();
        }
    }

    var Sprite3D = Laya.Sprite3D;
    var Vector3 = Laya.Vector3;
    var Point = Laya.Point;
    var MouseManager = Laya.MouseManager;
    var Vector2 = Laya.Vector2;
    class MouseController extends Laya.Script3D {
        constructor() {
            super();
            this.rotateEnable = false;
            this.moveEnable = true;
            this.scaleEnable = false;
            this.touchDistance = 100;
            this.testMusic = false;
            this.movePoint = new Point();
            this.hitResult = new Laya.HitResult();
            this.ray = new Laya.Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
        }
        onAwake() {
            this.emptyNode = new Sprite3D();
            this.pressPoint = new Laya.Point();
        }
        onEnable() {
            super.onEnable();
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rMouseDown);
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.rMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseWhell);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, this.mouse2Down);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.TRIGGER_EXIT, this, this.mouseUp);
            this.isPress = false;
            this.camera = this.owner;
        }
        onDisable() {
            super.onDisable();
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.rMouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.rMouseUp);
            Laya.stage.off(Laya.Event.MOUSE_WHEEL, this, this.mouseWhell);
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.off(Laya.Event.KEY_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.TRIGGER_EXIT, this, this.mouseUp);
        }
        setCameraCenter(sp3d) {
            this.camera = this.owner;
            let temp = this.camera.transform.position.clone();
            let parentNode = this.owner.parent;
            this.emptyNode.addChild(this.camera);
            parentNode.addChild(this.emptyNode);
            this.emptyNode.transform.position = sp3d.transform.position.clone();
            this.camera.transform.position = temp;
        }
        setTarget(target) {
            this.lookTarget = target;
        }
        rMouseDown(e) {
            this.isPress = true;
            this.pressPoint.x = e["stageX"];
            this.pressPoint.y = e["stageX"];
        }
        rMouseUp(e) {
            this.isPress = false;
        }
        mouseWhell(e) {
            return;
            if (!this.scaleEnable)
                return;
            if (e["delta"] > 0) {
                this.camera.fieldOfView -= 0.5;
            }
            else {
                this.camera.fieldOfView += 0.5;
            }
        }
        mouseDown(e) {
            if (Global.sceneLock)
                return;
            if (!this.testMusic) {
                SoundManager.getInstance().playMusic("res/sound/bg.mp3");
                this.testMusic = true;
            }
            if (e.touches && e.touches.length > 1) {
                var touches = e.touches;
                this.lastDistance = Math.sqrt(Math.pow((touches[0].clientX - touches[1].clientX), 2) + Math.pow((touches[0].clientY - touches[1].clientY), 2));
                return;
            }
            if (!this.rotateEnable) {
                this.hitName = this.checkHit();
            }
            else {
                this.isPress = true;
            }
            this.pressPoint.x = e["stageX"];
            this.pressPoint.y = e["stageX"];
        }
        mouseMove(e) {
            if (Global.sceneLock)
                return;
            let _is = e["stageY"] < Laya.stage.height / 2 ? false : true;
            if (!_is)
                return;
            if (e.touches && e.touches.length > 1 && this.scaleEnable) {
                var touches = e.touches;
                var l = Math.sqrt(Math.pow((touches[0].clientX - touches[1].clientX), 2) + Math.pow((touches[0].clientY - touches[1].clientY), 2));
                var len = this.lastDistance - l;
                if (len > 0 && this.camera.orthographicVerticalSize > 6 || len < 0 && this.camera.orthographicVerticalSize < 3.5)
                    return;
                ;
                this.camera.orthographicVerticalSize += len / 40;
                this.lastDistance = l;
                this.pressPoint.x = e["stageX"];
                this.pressPoint.y = e["stageX"];
            }
            else {
                if (this.isPress && this.rotateEnable && this.lookTarget) {
                    let dist = this.pressPoint.x - e["stageX"];
                    Global.tempVector3.x = 0;
                    Global.tempVector3.y = -dist / 5;
                    Global.tempVector3.z = 0;
                    this.lookTarget.transform.rotate(Global.tempVector3, true, false);
                    this.pressPoint.x = e["stageX"];
                    this.pressPoint.y = e["stageX"];
                }
            }
        }
        mouseUp(e) {
            if (Global.sceneLock)
                return;
            if (this.isPress)
                this.isPress = false;
            if (!this.moveEnable)
                return;
            this.isPress = false;
            if (this.hitName == this.checkHit() && this.hitName != null) {
                Laya.stage.event(CommonDefine.EVENT_CLICK_TARGET, [this.hitName, this.camera]);
            }
        }
        mouse2Down(e) {
        }
        checkHit() {
            return null;
            MouseController.clickPoint.x = MouseManager.instance.mouseX;
            MouseController.clickPoint.y = MouseManager.instance.mouseY;
            this.camera.viewportPointToRay(MouseController.clickPoint, this.ray);
            this.camera.scene.physicsSimulation.rayCast(this.ray, this.hitResult);
            if (this.hitResult.succeeded) {
                return this.hitResult.collider.owner;
            }
            return null;
        }
    }
    MouseController.clickPoint = new Vector2();

    class GacEvent {
    }
    GacEvent.OnConnecting = "OnConnecting";
    GacEvent.OnConnected = "OnConnected";
    GacEvent.OnConnectFail = "OnConnectFail";
    GacEvent.OnConnectClose = "OnConnectClose";
    GacEvent.OnReConnected = "OnReConnected";
    GacEvent.OnUpdate = "OnUpdate";
    GacEvent.OnLateUpdate = "OnLateUpdate";
    GacEvent.OnShowUI_propagandist = "OnShowUI_propagandist";
    GacEvent.OnShowUI_dustman = "OnShowUI_dustman";
    GacEvent.OnUpdata_dustmantime = "OnUpdata_dustmantime";
    GacEvent.OnShowUI_cameraman = "OnShowUI_cameraman";
    GacEvent.OnUpdata_cameramantime = "OnUpdata_cameramantime";
    GacEvent.OnChangeGold = "OnChangeGold";
    GacEvent.OnChangeStar = "OnChangeStar";
    GacEvent.RefreshUserInfo = "RefreshUserInfo";
    GacEvent.RefreshGatherInfo = "RefreshGatherInfo";
    GacEvent.OnUnlockAni = "OnUnlockAni";
    GacEvent.OnPlantRipe = "OnPlantRipe";
    GacEvent.OnClickInSceneByGuide = "OnClickInSceneByGuide";
    GacEvent.GuideCreateBubInScene = "GuideCreateBubInScene";
    GacEvent.GuideOver = "GuideOver";
    GacEvent.GuideChangePage = "GuideChangePage";
    GacEvent.GuideDiyISOver = "GuideDiyISOver";

    var LanguageType;
    (function (LanguageType) {
        LanguageType[LanguageType["Chinese"] = 0] = "Chinese";
        LanguageType[LanguageType["English"] = 1] = "English";
        LanguageType[LanguageType["Japanese"] = 2] = "Japanese";
    })(LanguageType || (LanguageType = {}));
    var SocketState;
    (function (SocketState) {
        SocketState[SocketState["NONE"] = 0] = "NONE";
        SocketState[SocketState["CONNECTING"] = 1] = "CONNECTING";
        SocketState[SocketState["CONNECTED"] = 2] = "CONNECTED";
        SocketState[SocketState["CONNECT_CLOSE"] = 3] = "CONNECT_CLOSE";
        SocketState[SocketState["CONNECT_FAIL"] = 4] = "CONNECT_FAIL";
    })(SocketState || (SocketState = {}));
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["None"] = 0] = "None";
        LogLevel[LogLevel["Error"] = 1] = "Error";
        LogLevel[LogLevel["Exception"] = 2] = "Exception";
        LogLevel[LogLevel["Warning"] = 3] = "Warning";
        LogLevel[LogLevel["Log"] = 4] = "Log";
    })(LogLevel || (LogLevel = {}));
    var ViewState;
    (function (ViewState) {
        ViewState[ViewState["None"] = 0] = "None";
        ViewState[ViewState["Loading"] = 1] = "Loading";
        ViewState[ViewState["Loaded"] = 2] = "Loaded";
    })(ViewState || (ViewState = {}));
    var ViewLayer;
    (function (ViewLayer) {
        ViewLayer[ViewLayer["UIView"] = 0] = "UIView";
        ViewLayer[ViewLayer["HPView"] = 1] = "HPView";
        ViewLayer[ViewLayer["GoodsView"] = 2] = "GoodsView";
        ViewLayer[ViewLayer["TopView"] = 3] = "TopView";
    })(ViewLayer || (ViewLayer = {}));
    var GenderType;
    (function (GenderType) {
        GenderType[GenderType["Male"] = 1] = "Male";
        GenderType[GenderType["Female"] = 2] = "Female";
    })(GenderType || (GenderType = {}));
    var DirectionType;
    (function (DirectionType) {
        DirectionType[DirectionType["right"] = 1] = "right";
        DirectionType[DirectionType["left"] = -1] = "left";
    })(DirectionType || (DirectionType = {}));
    var OffLineType;
    (function (OffLineType) {
        OffLineType[OffLineType["eUnknow"] = 0] = "eUnknow";
        OffLineType[OffLineType["eBanPlay"] = 1] = "eBanPlay";
        OffLineType[OffLineType["eRepeatLogin"] = 2] = "eRepeatLogin";
        OffLineType[OffLineType["eGMKick"] = 3] = "eGMKick";
        OffLineType[OffLineType["eServerShutdown"] = 4] = "eServerShutdown";
        OffLineType[OffLineType["eLoginFailed"] = 5] = "eLoginFailed";
        OffLineType[OffLineType["eLoginServerError"] = 6] = "eLoginServerError";
        OffLineType[OffLineType["eLoginFull"] = 7] = "eLoginFull";
        OffLineType[OffLineType["eReName"] = 8] = "eReName";
        OffLineType[OffLineType["eVersionFail"] = 10] = "eVersionFail";
        OffLineType[OffLineType["eShield"] = 9999] = "eShield";
    })(OffLineType || (OffLineType = {}));
    var NavMeshType;
    (function (NavMeshType) {
        NavMeshType[NavMeshType["NavMesh_None"] = 0] = "NavMesh_None";
        NavMeshType[NavMeshType["NavMesh_Empty"] = 1] = "NavMesh_Empty";
        NavMeshType[NavMeshType["NavMesh_Full"] = 2] = "NavMesh_Full";
    })(NavMeshType || (NavMeshType = {}));
    var AstarNodeState;
    (function (AstarNodeState) {
        AstarNodeState[AstarNodeState["NONE"] = 0] = "NONE";
        AstarNodeState[AstarNodeState["OPEN"] = 1] = "OPEN";
        AstarNodeState[AstarNodeState["CLOSE"] = 2] = "CLOSE";
    })(AstarNodeState || (AstarNodeState = {}));
    var ResPrefabPath;
    (function (ResPrefabPath) {
        ResPrefabPath["MapLevel"] = "res/prefab/LayaScene_MapLevelPrefab/Conventional/";
        ResPrefabPath["Camera"] = "res/prefab/LayaScene_CameraPrefab/Conventional/";
        ResPrefabPath["Gun"] = "res/prefab/LayaScene_GunPrefab/Conventional/";
        ResPrefabPath["Npc"] = "res/prefab/LayaScene_NpcPrefab/Conventional/";
        ResPrefabPath["Effect"] = "res/prefab/LayaScene_EffectPrefab/Conventional/";
        ResPrefabPath["SkyBox"] = "res/prefab/LayaScene_SkyBoxPrefab/Conventional/";
    })(ResPrefabPath || (ResPrefabPath = {}));
    var MapType;
    (function (MapType) {
        MapType[MapType["MainMap"] = 0] = "MainMap";
        MapType[MapType["BattleMap"] = 1] = "BattleMap";
        MapType[MapType["AssemblyMap"] = 2] = "AssemblyMap";
    })(MapType || (MapType = {}));
    var NpcType;
    (function (NpcType) {
        NpcType[NpcType["PlayerNpc"] = 0] = "PlayerNpc";
        NpcType[NpcType["MonsterNpc"] = 1] = "MonsterNpc";
        NpcType[NpcType["BuildNpc"] = 2] = "BuildNpc";
    })(NpcType || (NpcType = {}));
    var LocalStorage;
    (function (LocalStorage) {
        LocalStorage["Bottom"] = "bottom";
        LocalStorage["Player"] = "player";
        LocalStorage["Staff"] = "Staff";
        LocalStorage["GatherLV"] = "GatherLV";
        LocalStorage["Point"] = "point";
        LocalStorage["Tree"] = "tree";
    })(LocalStorage || (LocalStorage = {}));
    var PotState;
    (function (PotState) {
        PotState[PotState["None"] = 0] = "None";
        PotState[PotState["Grow"] = 1] = "Grow";
        PotState[PotState["Ripe"] = 2] = "Ripe";
    })(PotState || (PotState = {}));
    var GamePoint;
    (function (GamePoint) {
        GamePoint[GamePoint["Ripe"] = 0] = "Ripe";
        GamePoint[GamePoint["Advertising"] = 1] = "Advertising";
        GamePoint[GamePoint["Seniority"] = 2] = "Seniority";
        GamePoint[GamePoint["Sleep"] = 3] = "Sleep";
        GamePoint[GamePoint["Get"] = 4] = "Get";
        GamePoint[GamePoint["PickUpMoney"] = 5] = "PickUpMoney";
        GamePoint[GamePoint["Photograph"] = 6] = "Photograph";
    })(GamePoint || (GamePoint = {}));

    class ProcessInfo {
        constructor(protocolId) {
            this._handlerList = new Array();
            this.protocolId = protocolId;
            this.protoBuf = new JXS2CL_RESPONE();
        }
        AddHandler(handler) {
            if (handler != null) {
                this._handlerList.push(handler);
            }
        }
        DelHandler(handler) {
            for (let i = 0; i < this._handlerList.length; i++) {
                if (handler.caller == this._handlerList[i].caller && handler.method == this._handlerList[i].method) {
                    this._handlerList[i].recover();
                    this._handlerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        }
        Dispatch() {
            this.protoBuf.data.shift();
            for (let i = 0; i < this._handlerList.length; i++) {
                let handler = this._handlerList[i];
                if (handler != null) {
                    handler.setTo(handler.caller, handler.method, [this.protoBuf.data], false);
                    handler.run();
                }
            }
        }
    }
    class ProtocolMap {
        constructor() {
            this._processInfoDict = {};
        }
        AddProtocolHandler(protocolId, handler) {
            let info = this._processInfoDict[protocolId];
            if (info == null) {
                info = new ProcessInfo(protocolId);
                this._processInfoDict[protocolId] = info;
            }
            info.AddHandler(handler);
        }
        DelProtocolHandler(protocolId, handler) {
            let info = this._processInfoDict[protocolId];
            if (info != null && handler != null) {
                info.DelHandler(handler);
            }
        }
        GetProcessInfo(protocolId) {
            return this._processInfoDict[protocolId];
        }
    }
    class JXS2C_PROTOCOL_HEADER {
        GetData(i_Args) {
            this.data = i_Args;
            this.protocolID = i_Args[0];
        }
    }
    class JXS2CL_RESPONE extends JXS2C_PROTOCOL_HEADER {
        GetData(i_Args) {
            super.GetData(i_Args);
        }
    }

    class Converter {
        static GetBytesLengthForString(str) {
            if (str === void 0) {
                return -1;
            }
            ;
            let len = 0;
            for (var i = 0, sz = str.length; i < sz; i++) {
                var c = str.charCodeAt(i);
                if (c <= 0x7F) {
                    len = len + 1;
                }
                else if (c <= 0x7FF) {
                    len = len + 2;
                }
                else if (c <= 0xFFFF) {
                    len = len + 3;
                }
                else {
                    len = len + 4;
                }
            }
            return len;
        }
        static StringToBytes(str) {
            let ch, st, re = [];
            for (let i = 0; i < str.length; i++) {
                ch = str.charCodeAt(i);
                st = [];
                do {
                    st.push(ch & 0xFF);
                    ch = ch >> 8;
                } while (ch);
                re = re.concat(st.reverse());
            }
            return re;
        }
        static GetBKDRHash(str) {
            let seed = 131;
            let hash = 0;
            let strlen = str.length;
            for (let i = 0; i < strlen; ++i) {
                hash = (hash * seed + str.charCodeAt(i)) & 0x7FFFFFFF;
            }
            return hash;
        }
    }

    class NetAnalysis {
        constructor() {
            this._args = new Array();
            this._index = 0;
            this._enByte = new Laya.Byte();
            this._ues = 0;
            this._data = [];
            this._key = null;
            this._tables = [];
        }
        Encode(...args) {
            this._enByte.clear();
            this._enByte.endian = Laya.Byte.getSystemEndian();
            this._enByte.length = MAX_SEND_BUFFER_SIZE;
            do {
                this._args = args;
                this._index = 0;
                while (this.ExcuteEncode(this._args[this._index])) {
                    if (++this._index == this._args.length) {
                        break;
                    }
                }
            } while (false);
            return this._enByte;
        }
        ExcuteEncode(d) {
            let data = d;
            if (data == undefined || data !== data) {
                data = null;
            }
            if (typeof data == "object") {
                if (data == null) {
                    this._enByte.writeByte(0);
                }
                else if (data instanceof Array) {
                    this._enByte.writeByte(16);
                    this._enByte.writeByte(0);
                    for (let idx = 0; idx < data.length; idx++) {
                        if (!this.ExcuteEncode(idx + 1)) {
                            return false;
                        }
                        ;
                        if (!this.ExcuteEncode(data[idx])) {
                            return false;
                        }
                        ;
                    }
                    this._enByte.writeByte(0);
                }
                else {
                    this._enByte.writeByte(16);
                    this._enByte.writeByte(0);
                    for (let prop in data) {
                        if (!this.ExcuteEncode(prop)) {
                            return false;
                        }
                        if (!this.ExcuteEncode(data[prop])) {
                            return false;
                        }
                    }
                    this._enByte.writeByte(0);
                }
            }
            else if (typeof data == "boolean") {
                this._enByte.writeByte((data) ? 1 : 2);
            }
            else if (typeof data == "number") {
                if (data % 1 == 0 && data == (data << 58 >> 58)) {
                    this._enByte.writeByte(64 | (data & 0x3F));
                }
                else if (data % 1 == 0 && data > -32768 && data < 32767) {
                    this._enByte.writeByte(5);
                    this._enByte.writeInt16(data);
                }
                else if (data % 1 == 0 && data > -2147483648 && data < 2417483647) {
                    this._enByte.writeByte(6);
                    this._enByte.writeInt32(data);
                }
                else {
                    this._enByte.writeByte(4);
                    this._enByte.writeFloat64(data);
                }
            }
            else if (typeof data == "string") {
                let strlen = Converter.GetBytesLengthForString(data);
                if (strlen < 64) {
                    this._enByte.writeUint8((-128 | strlen));
                }
                else {
                    this._enByte.writeByte(9);
                    this._enByte.writeInt16(strlen);
                }
                this._enByte.writeUTFBytes(data);
            }
            else {
                return false;
            }
            return true;
        }
        Decode(data, dataLen) {
            do {
                this._ues = 0;
                this._data.length = 0;
                this._key = null;
                this._tables = [];
                while (this.ExcuteDecode(data, dataLen)) {
                    if (this._ues >= dataLen) {
                        break;
                    }
                }
            } while (false);
            this._ues = 0;
            return this._data;
        }
        ExcuteDecode(data, len) {
            if (!this.Query(1, len, false)) {
                return false;
            }
            let flag = data.getByte();
            this.Query(1, len, true);
            if (flag == 0) {
                this._data.push(null);
            }
            else if (flag == 1 || flag == 2) {
                this._data.push((flag == 1) ? true : false);
            }
            else {
                let flag1 = flag & 0xC0;
                let flag2 = flag & 0xFC;
                if (flag1 == 128 || flag2 == 8) {
                    let strlen = 0;
                    if (flag1 == 128) {
                        strlen = flag & 0x3F;
                    }
                    else if (flag == 9) {
                        if (this.Query(2, len, false)) {
                            return false;
                        }
                        strlen = data.getUint16();
                        this.Query(2, len, true);
                    }
                    else {
                        return false;
                    }
                    if (!this.Query(strlen, len, false)) {
                        return false;
                    }
                    this._data.push(data.getUTFBytes(strlen));
                    this.Query(strlen, len, true);
                }
                else if (flag1 == 64 || flag2 == 4) {
                    let _number = -1;
                    if (flag1 == 64) {
                        _number = flag << 26 >> 26;
                    }
                    else if (flag == 5) {
                        if (!this.Query(2, len, false)) {
                            return false;
                        }
                        _number = data.getInt16();
                        this.Query(2, len, true);
                    }
                    else if (flag == 6) {
                        if (!this.Query(4, len, false)) {
                            return false;
                        }
                        _number = data.getInt32();
                        this.Query(4, len, true);
                    }
                    else if (flag == 7 || flag == 4) {
                        if (!this.Query(8, len, false)) {
                            return false;
                        }
                        _number = data.getFloat64();
                        this.Query(8, len, true);
                    }
                    else {
                        return false;
                    }
                    this._data.push(_number);
                }
                else if (flag2 == 16) {
                    if (flag == 16) {
                        if (!this.Query(1, len, false)) {
                            return false;
                        }
                        data.getByte();
                        this.Query(1, len, true);
                        let obj = {};
                        this._tables.push(obj);
                        while (true) {
                            if (!this.ExcuteDecodeTable(obj, data, len, true)) {
                                return false;
                            }
                            if (this._key == null) {
                                this._tables.pop();
                                break;
                            }
                            if (!this.ExcuteDecodeTable(obj, data, len, false)) {
                                return false;
                            }
                        }
                        this._data.push(obj);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            return true;
        }
        ExcuteDecodeTable(o, data, len, iskey) {
            if (!this.Query(1, len, false)) {
                return false;
            }
            ;
            let flag = data.getByte();
            this.Query(1, len, true);
            if (flag == 0) {
                if (iskey) {
                    this._key = null;
                }
                else {
                    o[this._key] = null;
                }
            }
            else if (flag == 1 || flag == 2) {
                let b = (flag == 1) ? true : false;
                if (iskey) {
                    this._key = String(b);
                }
                else {
                    o[this._key] = b;
                }
                ;
            }
            else {
                let flag1 = flag & 0xC0;
                let flag2 = flag & 0xFC;
                if (flag1 == 128 || flag2 == 8) {
                    let strlen = 0;
                    if (flag1 == 128) {
                        strlen = flag & 0x3F;
                    }
                    else if (flag == 9) {
                        if (!this.Query(2, len, false)) {
                            return false;
                        }
                        strlen = data.getUint16();
                        this.Query(2, len, true);
                    }
                    else {
                        return false;
                    }
                    if (!this.Query(strlen, len, false)) {
                        return false;
                    }
                    let __str = data.getUTFBytes(strlen);
                    if (iskey) {
                        this._key = __str;
                    }
                    else {
                        o[this._key] = __str;
                    }
                    this.Query(strlen, len, true);
                }
                else if (flag1 == 64 || flag2 == 4) {
                    let _number = -1;
                    if (flag1 == 64) {
                        _number = flag << 26 >> 26;
                    }
                    else if (flag == 5) {
                        if (!this.Query(2, len, false)) {
                            return false;
                        }
                        ;
                        _number = data.getInt16();
                        this.Query(2, len, true);
                    }
                    else if (flag == 6) {
                        if (!this.Query(4, len, false)) {
                            return false;
                        }
                        ;
                        _number = data.getInt32();
                        this.Query(4, len, true);
                    }
                    else if (flag == 7 || flag == 4) {
                        if (!this.Query(8, len, false)) {
                            return false;
                        }
                        ;
                        _number = data.getFloat64();
                        this.Query(8, len, true);
                    }
                    else {
                        return false;
                    }
                    if (iskey) {
                        this._key = _number;
                    }
                    else {
                        o[this._key] = _number;
                    }
                }
                else if (flag2 == 16) {
                    if (flag == 16) {
                        if (!this.Query(1, len, false)) {
                            return false;
                        }
                        data.getByte();
                        this.Query(1, len, true);
                        let obj = {};
                        this._tables[this._tables.length - 1][this._key] = obj;
                        this._tables.push(obj);
                        while (true) {
                            if (!this.ExcuteDecodeTable(obj, data, len, true)) {
                                return false;
                            }
                            if (this._key == null) {
                                this._tables.pop();
                                break;
                            }
                            if (!this.ExcuteDecodeTable(obj, data, len, false)) {
                                return false;
                            }
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            return true;
        }
        Query(num, len, b) {
            if (!b) {
                if (this._ues + num > len) {
                    return false;
                }
                return true;
            }
            else {
                this._ues += num;
            }
            return true;
        }
    }

    class Debug {
        static Log(msg) {
            if (Debug._logLevel >= LogLevel.Log) {
                if (Debug._onLog != null) {
                    Debug._onLog.setTo(Debug._onLog.caller, Debug._onLog.method, [msg], false);
                    Debug._onLog.run();
                }
            }
        }
        static LogWarning(msg) {
            if (Debug._logLevel >= LogLevel.Warning) {
                if (Debug._onLogWarning != null) {
                    Debug._onLogWarning.setTo(Debug._onLogWarning.caller, Debug._onLogWarning.method, [msg], false);
                    Debug._onLogWarning.run();
                }
            }
        }
        static LogError(msg) {
            if (Debug._logLevel >= LogLevel.Error) {
                if (Debug._onLogError != null) {
                    Debug._onLogError.setTo(Debug._onLogError.caller, Debug._onLogError.method, [msg], false);
                    Debug._onLogError.run();
                }
            }
        }
        static Assert(condition, msg = "") {
            if (Debug._onAssert != null) {
                Debug._onLogError.setTo(Debug._onLogError.caller, Debug._onLogError.method, [condition, msg], false);
                Debug._onLogError.run();
            }
        }
    }
    Debug._logLevel = 100;
    Debug.isLock = true;
    Debug._onLog = Laya.Handler.create(null, (msg) => {
        if (Debug.isLock) {
            console.log(msg);
        }
    });

    class TEvent {
        constructor() {
            this._handerList = new Array();
        }
        Add(handler) {
            this._handerList.push(handler);
        }
        Remove(handler) {
            for (let i = 0; i < this._handerList.length; i++) {
                if (handler.caller == this._handerList[i].caller && handler.method == this._handerList[i].method) {
                    this._handerList[i].recover();
                    this._handerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        }
        Exec(args) {
            for (let i = this._handerList.length; i >= 0; i--) {
                let handler = this._handerList[i];
                if (handler != null) {
                    handler.setTo(handler.caller, handler.method, args, false);
                    handler.run();
                }
            }
        }
    }
    class GEvent {
        static DispatchEvent(type, args) {
            if (!(args instanceof Array))
                args = [args];
            let ev = GEvent._eventList[type];
            if (ev != null) {
                try {
                    ev.Exec(args);
                }
                catch (e) {
                    Debug.LogError(e);
                }
            }
        }
        static RegistEvent(type, handler) {
            let ev = GEvent._eventList[type];
            if (ev == null) {
                ev = new TEvent();
                GEvent._eventList[type] = ev;
            }
            ev.Add(handler);
        }
        static RemoveEvent(type, handler) {
            let ev = GEvent._eventList[type];
            if (ev != null && handler != null) {
                ev.Remove(handler);
            }
        }
    }
    GEvent._eventList = {};

    const MAX_SEND_BUFFER_SIZE = 4094;
    const MESSAGE_HEAD_LENGTH = 2;
    class Network {
        constructor() {
            this._sequence = 0;
            this._sendBuffer = new Laya.Byte();
            this._recvBuffer = new Laya.Byte();
            this._codeService = new NetAnalysis();
            this._protocolMap = new ProtocolMap();
        }
        connect(host, port) {
            if (this._socket) {
                this.onConnectClose();
            }
            this._host = host;
            this._port = port;
            this._socket = new Laya.Socket();
            this._socket.on(Laya.Event.OPEN, this, this.onConnected);
            this._socket.on(Laya.Event.ERROR, this, this.onConnectFail);
            this._socket.on(Laya.Event.CLOSE, this, this.onConnectClose);
            this._socket.on(Laya.Event.MESSAGE, this, this.receive);
            if (host.indexOf("ws://") != -1 || host.indexOf("wss://") != -1) {
                this._socket.connectByUrl(host + ":" + port);
            }
            else {
                this._socket.connect(host, port);
            }
            this.setSocketState(SocketState.CONNECTING);
        }
        close() {
            if (!this._socket) {
                return;
            }
            try {
                if (this._socket.connected == true) {
                    this._socket.cleanSocket();
                }
                this._socket.close();
            }
            catch (e) {
                Debug.LogError(e);
            }
            finally {
                this._sequence = 0;
                this._socket = null;
            }
        }
        send(msgType, ...args) {
            if (!this._socket || !this.isConnected()) {
                return;
            }
            let bt;
            if (msgType.indexOf("G_") == 0) {
                bt = this._codeService.Encode("K_Ts", msgType, ...args);
            }
            else {
                bt = this._codeService.Encode(msgType, ...args);
            }
            bt.length = bt.pos;
            if (bt.length > MAX_SEND_BUFFER_SIZE) {
                Debug.LogError("消息长度超过" + MAX_SEND_BUFFER_SIZE);
                return;
            }
            this._sendBuffer.clear();
            this._sendBuffer.writeUint16(bt.length + 1);
            this._sendBuffer.writeUint8(this._sequence);
            this._sendBuffer.writeArrayBuffer(bt.buffer);
            if (++this._sequence >= 256) {
                this._sequence = 0;
            }
            this._socket.send(this._sendBuffer.buffer);
        }
        receive(data) {
            if (!this._socket || !this.isConnected()) {
                return;
            }
            if (!(data instanceof ArrayBuffer)) {
                Debug.LogError("接收网络消息类型错误! 消息类型应为ArrayBuffer！");
                return;
            }
            this._recvBuffer.writeArrayBuffer(data);
            this._recvBuffer.pos = 0;
            let packageDataLen = this._recvBuffer.getInt16();
            if (packageDataLen <= 0) {
                Debug.LogError("数据包长度小于等于零！");
                return;
            }
            if (packageDataLen + MESSAGE_HEAD_LENGTH > this._recvBuffer.length) {
                this._recvBuffer.pos = this._recvBuffer.length;
                return;
            }
            let _pos, _args;
            while (true) {
                _args = this._codeService.Decode(this._recvBuffer, packageDataLen);
                let processInfo = this._protocolMap.GetProcessInfo(_args[0]);
                if (processInfo != null) {
                    processInfo.protoBuf.GetData(_args);
                    processInfo.Dispatch();
                }
                if (this._recvBuffer.pos + MESSAGE_HEAD_LENGTH >= this._recvBuffer.length) {
                    break;
                }
                _pos = this._recvBuffer.pos;
                packageDataLen = this._recvBuffer.getInt16();
                if (packageDataLen > this._recvBuffer.length - this._recvBuffer.pos) {
                    this._recvBuffer.pos = _pos;
                    break;
                }
            }
            this._socket.input.clear();
            let buffer = this._recvBuffer.buffer.slice(this._recvBuffer.pos, this._recvBuffer.length);
            this._recvBuffer.clear();
            this._recvBuffer.writeArrayBuffer(buffer);
        }
        setSocketState(state) {
            this._state = state;
            if (this._state == SocketState.CONNECT_CLOSE) {
                this.close();
            }
            if (this._state == SocketState.CONNECTING) {
                Debug.Log("开始连接到服务器!");
                GEvent.DispatchEvent(GacEvent.OnConnecting);
            }
            else if (this._state == SocketState.CONNECTED) {
                Debug.Log("连接服务器成功！");
                GEvent.DispatchEvent(GacEvent.OnConnected, true);
            }
            else if (this._state == SocketState.CONNECT_FAIL) {
                Debug.Log("连接服务器失败！");
                GEvent.DispatchEvent(GacEvent.OnConnectFail);
            }
            else if (this._state == SocketState.CONNECT_CLOSE) {
                Debug.Log("与服务器断开连接！");
                GEvent.DispatchEvent(GacEvent.OnConnectClose);
            }
        }
        onConnected() {
            this.setSocketState(SocketState.CONNECTED);
        }
        onConnectFail() {
            this.setSocketState(SocketState.CONNECT_FAIL);
        }
        onConnectClose() {
            this.setSocketState(SocketState.CONNECT_CLOSE);
        }
        isConnected() {
            return this._state == SocketState.CONNECTED;
        }
        registerProtocol(protocolId, handler) {
            this._protocolMap.AddProtocolHandler(protocolId, handler);
        }
        unRegisterProtocol(protocolId, handler) {
            this._protocolMap.DelProtocolHandler(protocolId, handler);
        }
        TGW(arrayBuffer) {
            this._socket.send(arrayBuffer);
        }
    }

    var Sprite3D$1 = Laya.Sprite3D;
    var MeshSprite3D = Laya.MeshSprite3D;
    var SkinnedMeshSprite3D = Laya.SkinnedMeshSprite3D;
    var Vector3$1 = Laya.Vector3;
    var Vector4 = Laya.Vector4;
    var LocalStorage$1 = Laya.LocalStorage;
    var Ray = Laya.Ray;
    var HitResult = Laya.HitResult;
    var Vector2$1 = Laya.Vector2;
    var Text = Laya.Text;
    var Tween = Laya.Tween;
    var Pool = Laya.Pool;
    var Handler = Laya.Handler;
    var PBRStandardMaterial = Laya.PBRStandardMaterial;
    class Utils {
        static setMeshCastShadow(sprite3d, bool) {
            let childNum = sprite3d.numChildren;
            for (let i = 0; i < childNum; ++i) {
                var node = sprite3d.getChildAt(i);
                if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D$1) {
                    if (node.meshRenderer) {
                        node.meshRenderer.castShadow = bool;
                        node.meshRenderer.receiveShadow = bool;
                    }
                    if (node.skinnedMeshRenderer) {
                        node.skinnedMeshRenderer.castShadow = bool;
                        node.skinnedMeshRenderer.receiveShadow = bool;
                    }
                }
                if (node.numChildren > 0)
                    Utils.setMeshCastShadow(node, bool);
            }
        }
        static getShaderMesh(sprite3d) {
            if (sprite3d instanceof MeshSprite3D || sprite3d instanceof SkinnedMeshSprite3D) {
                if (sprite3d.meshFilter && sprite3d.meshFilter.sharedMesh) {
                    return sprite3d.meshFilter.sharedMesh;
                }
            }
            let childNum = sprite3d.numChildren;
            for (let i = 0; i < childNum; ++i) {
                var d = Utils.getShaderMesh(sprite3d.getChildAt(i));
                if (d)
                    return d;
            }
        }
        static setModelAlpha(sprite3d, alpha) {
            var childNum = sprite3d.numChildren;
            for (let i = 0; i < childNum; ++i) {
                var node = sprite3d.getChildAt(i);
                if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D$1) {
                    if (node.meshRenderer) {
                        if (node.meshRenderer.material) {
                            node.meshRenderer.material.renderMode = 2;
                            node.meshRenderer.material.albedoColor = new Vector4(node.meshRenderer.material.albedoColor.x, node.meshRenderer.material.albedoColor.y, node.meshRenderer.material.albedoColor.z, alpha);
                        }
                    }
                    if (node.skinnedMeshRenderer) {
                        if (node.skinnedMeshRenderer.material) {
                            node.skinnedMeshRenderer.material.renderMode = 2;
                            node.skinnedMeshRenderer.material.albedoColor = new Vector4(node.skinnedMeshRenderer.material.albedoColor.x, node.skinnedMeshRenderer.material.albedoColor.y, node.skinnedMeshRenderer.material.albedoColor.z, alpha);
                        }
                    }
                }
                if (node.numChildren > 0)
                    Utils.setModelAlpha(node, alpha);
            }
        }
        static setModelbrightness(sprite3d, val) {
            var childNum = sprite3d.numChildren;
            for (let i = 0; i < childNum; ++i) {
                var node = sprite3d.getChildAt(i);
                if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D$1) {
                    if (node.meshRenderer) {
                        if (node.meshRenderer.material) {
                            if (node.meshRenderer.material instanceof PBRStandardMaterial)
                                node.meshRenderer.material.metallic = 1 - val;
                            else
                                node.meshRenderer.material.albedoIntensity = val;
                        }
                    }
                }
                if (node.numChildren > 0)
                    Utils.setModelAlpha(node, val);
            }
        }
        static setRenderMode(sprite3d, val) {
            var childNum = sprite3d.numChildren;
            for (let i = 0; i < childNum; ++i) {
                var node = sprite3d.getChildAt(i);
                if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D$1) {
                    if (node.meshRenderer) {
                        if (node.meshRenderer.material) {
                            node.meshRenderer.material.renderMode = val;
                        }
                    }
                    if (node.skinnedMeshRenderer) {
                        if (node.skinnedMeshRenderer.material) {
                            node.skinnedMeshRenderer.material.renderMode = val;
                        }
                    }
                }
                if (node.numChildren > 0)
                    Utils.setRenderMode(node, val);
            }
        }
        static createBloom(camera, param) {
            var postProcess = new Laya.PostProcess();
            var bloom = new Laya.BloomEffect();
            postProcess.addEffect(bloom);
            for (var o in param) {
                bloom[o] = param[o];
            }
            Laya.Texture2D.load("res/image/DR_shitou.png", Laya.Handler.create(this, function (tex) {
                bloom.dirtTexture = tex;
                bloom.dirtIntensity = 2.0;
                camera.postProcess = postProcess;
            }));
            return postProcess;
        }
        static worldToScreen(camera, pos) {
            var outPos = new Vector4();
            camera.viewport.project(pos, camera.projectionViewMatrix, outPos);
            return new Vector2$1(outPos.x / Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
        }
        static screenToWorld(mousePos, camera, height = 0.3, distance = -1) {
            function getLowerLeft(transform, distance, width, height) {
                var lowerLeft = new Laya.Vector3();
                var right = new Laya.Vector3();
                transform.getRight(right);
                Laya.Vector3.normalize(right, right);
                var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
                Laya.Vector3.add(transform.position, xx, lowerLeft);
                var up = new Laya.Vector3();
                transform.getUp(up);
                Laya.Vector3.normalize(up, up);
                var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
                Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);
                var forward = new Laya.Vector3();
                transform.getForward(forward);
                Laya.Vector3.normalize(forward, forward);
                var zz = new Laya.Vector3(forward.x * distance, forward.y * distance, forward.z * distance);
                Laya.Vector3.subtract(lowerLeft, zz, lowerLeft);
                return lowerLeft;
            }
            function getScreenScale(width, height) {
                var v = new Laya.Vector3();
                v.x = Laya.stage.width / width / 2;
                v.y = Laya.stage.height / height / 2;
                return v;
            }
            function inverseTransformPoint(origin, point) {
                var xx = new Laya.Vector3();
                origin.getRight(xx);
                var yy = new Laya.Vector3();
                origin.getUp(yy);
                var zz = new Laya.Vector3();
                origin.getForward(zz);
                var zz1 = new Laya.Vector3(-zz.x, -zz.y, -zz.z);
                var x = projectDistance(point, origin.position, xx);
                var y = projectDistance(point, origin.position, yy);
                var z = projectDistance(point, origin.position, zz1);
                var value = new Laya.Vector3(x, y, z);
                return value;
            }
            function transformPoint(origin, point) {
                var value = new Laya.Vector3();
                Laya.Vector3.transformQuat(point, origin.rotation, value);
                Laya.Vector3.add(value, origin.position, value);
                return value;
            }
            function projectDistance(A, C, B) {
                var CA = new Laya.Vector3();
                Laya.Vector3.subtract(A, C, CA);
                var angle = angle2(CA, B) * Math.PI / 180;
                var distance = Laya.Vector3.distance(A, C);
                distance *= Math.cos(angle);
                return distance;
            }
            function angle2(ma, mb) {
                var v1 = (ma.x * mb.x) + (ma.y * mb.y) + (ma.z * mb.z);
                var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y + ma.z * ma.z);
                var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y + mb.z * mb.z);
                var cosM = v1 / (ma_val * mb_val);
                if (cosM < -1)
                    cosM = -1;
                if (cosM > 1)
                    cosM = 1;
                var angleAMB = Math.acos(cosM) * 180 / Math.PI;
                return angleAMB;
            }
            function intersectWithLineANdPlane(linePoint, lineDirection, planeNormal, planePoint) {
                var v1 = new Vector3$1();
                Vector3$1.subtract(planePoint, linePoint, v1);
                var d = Vector3$1.dot(v1, planeNormal)
                    / Vector3$1.dot(lineDirection, planeNormal);
                var v2 = new Vector3$1();
                Vector3$1.scale(lineDirection, d, v2);
                var v3 = new Vector3$1();
                Vector3$1.add(linePoint, v2, v3);
                return v3;
            }
            function getPos(camera, screenPos) {
                var halfFOV = (camera.fieldOfView * 0.5) * Math.PI / 180;
                let height = screenPos.z * Math.tan(halfFOV);
                let width = height * camera.aspectRatio;
                let lowerLeft = getLowerLeft(camera.transform, screenPos.z, width, height);
                let v = getScreenScale(width, height);
                var value = new Vector3$1();
                var lowerLeftA = inverseTransformPoint(camera.transform, lowerLeft);
                value = new Vector3$1(-screenPos.x / v.x, screenPos.y / v.y, 0);
                Laya.Vector3.add(lowerLeftA, value, value);
                value = transformPoint(camera.transform, value);
                return value;
            }
            var screenPosition = new Vector3$1(mousePos.x, mousePos.y, 1);
            var worldPostion = getPos(camera, screenPosition);
            Vector3$1.subtract(worldPostion, camera.transform.position, Utils.rayDirection);
            Vector3$1.normalize(Utils.rayDirection, Utils.rayDirection);
            var myPosition = intersectWithLineANdPlane(camera.transform.position, Utils.rayDirection, new Vector3$1(0, 1, 0), new Vector3$1(0, height, 0));
            if (distance != -1) {
                var myPosition2 = new Vector3$1(myPosition.x, 0, myPosition.z);
                var length = Vector3$1.scalarLengthSquared(myPosition2);
                var maxLength = distance;
                if (length > maxLength * maxLength) {
                    var myPosition3 = new Vector3$1();
                    Vector3$1.normalize(myPosition2, myPosition3);
                    var myPosition4 = new Vector3$1();
                    Vector3$1.scale(myPosition3, maxLength, myPosition3);
                    myPosition = new Vector3$1(myPosition3.x, myPosition.y, myPosition3.z);
                }
            }
            return myPosition;
        }
        static formatObject2Array(object) {
            var arr = new Array();
            for (const key in object) {
                arr.push(object[key]);
            }
            return arr;
        }
        static getWeight(arrWeight) {
            var t = [];
            var nMax = 0;
            for (var i = 0; i < arrWeight.length; i++) {
                if (!t[i - 1]) {
                    t[i - 1] = 0;
                }
                t[i] = t[i - 1] + Number(arrWeight[i]);
                nMax += Number(arrWeight[i]);
            }
            var r = Math.random() * nMax;
            for (var i = 0; i < t.length; i++) {
                if (r < t[i]) {
                    return i;
                }
            }
            return null;
        }
        static getInputParam(param) {
            return Laya.Utils.getQueryString(param);
        }
        static rayCastOne(point, scene3d, camera) {
            if (!Utils.outHitResult)
                Utils.outHitResult = new HitResult();
            if (!Utils.ray)
                Utils.ray = new Ray(new Vector3$1(0, 0, 0), new Vector3$1(0, 0, 0));
            camera.viewportPointToRay(point, Utils.ray);
            scene3d.physicsSimulation.rayCast(Utils.ray, Utils.outHitResult);
            return Utils.outHitResult;
        }
        static rayCastAll(point, scene3d, camera) {
            if (!Utils.outHitResultArr)
                Utils.outHitResultArr = new Array();
            if (!Utils.ray)
                Utils.ray = new Ray(new Vector3$1(0, 0, 0), new Vector3$1(0, 0, 0));
            camera.viewportPointToRay(point, Utils.ray);
            scene3d.physicsSimulation.rayCastAll(Utils.ray, Utils.outHitResultArr);
            return Utils.outHitResultArr;
        }
        static createNumberText(value, posX, posY, operation = "+", left = false, color = "#ff0000") {
            this.createNumberImage(value, posX, posY, operation, left, color);
            return;
            var txt = Pool.getItemByClass("goldTxt", Text);
            txt.text = operation + value;
            txt.alpha = 1;
            txt.width = 50;
            txt.align = "center";
            txt.fontSize = 40;
            txt.font = "Microsoft YaHei";
            txt.color = color;
            txt.bold = true;
            txt.leading = 5;
            txt.stroke = 2;
            txt.strokeColor = "#0e0f1c";
            txt.x = posX;
            txt.y = posY;
            LayerManager.getInstance().topUILayer.addChild(txt);
            var offX = left ? -50 : 50;
            Tween.to(txt, { alpha: 0.3, y: txt.y - 100 }, 500, null, Handler.create(this, function () {
                txt.removeSelf();
                Pool.recover("goldTxt", txt);
            }));
        }
        static createNumberImage(value, posX, posY, operation = "+", left = false, color = "#ff0000") {
            let txt = Pool.getItemByClass("goldTxt", Text);
            txt.text = operation + value;
            txt.alpha = 1;
            txt.width = 50;
            txt.align = "center";
            txt.fontSize = 40;
            txt.font = "Microsoft YaHei";
            txt.color = color;
            txt.bold = true;
            txt.leading = 5;
            txt.stroke = 2;
            txt.strokeColor = "#0e0f1c";
            txt.x = posX;
            txt.y = posY;
            LayerManager.getInstance().topUILayer.addChild(txt);
            let imageName = left ? "img_star" : "img_gold";
            let img = Pool.getItemByClass(imageName, Laya.Image);
            img.skin = "gameui/main/" + imageName + ".png";
            txt.addChild(img);
            img.pos(-img.width, -10);
            var offX = left ? -50 : 50;
            Tween.to(txt, { alpha: 0.3, y: txt.y - 100 }, 500, null, Handler.create(this, function () {
                img.removeSelf();
                Pool.recover(imageName, img);
                txt.removeSelf();
                Pool.recover("goldTxt", txt);
            }));
        }
        static getJsonByArray2(array) {
            var arr = {};
            for (var o in array) {
                if (array) {
                    if (array instanceof Array) {
                        let oTemp = {};
                        for (var key in array) {
                            oTemp[key] = array;
                        }
                        arr[o] = oTemp;
                    }
                    else {
                        arr[o] = array;
                    }
                }
            }
            let str = JSON.stringify(arr);
            return str;
        }
        static getArray2ByJson(str) {
            var js = JSON.parse(str);
            var arr1 = new Array();
            for (var o in js) {
                var tempArr = new Array();
                if (js[o] instanceof Object) {
                    for (var i in js[o]) {
                        tempArr[i] = js[o][i];
                    }
                    arr1[Number(o)] = tempArr;
                }
                else {
                    arr1[Number(o)] = js[o];
                }
            }
            return arr1;
        }
        static GetMapLength(cfg) {
            let _length = 0;
            for (const key in cfg) {
                _length++;
            }
            return _length;
        }
        static saveStringToLocal(key, value) {
            LocalStorage$1.setItem(key, value);
        }
        static getStringFromLocal(key) {
            return LocalStorage$1.getItem(key);
        }
        static saveJSONToLocal(key, value) {
            LocalStorage$1.setJSON(key, value);
        }
        static getJSONFromLocal(key) {
            return LocalStorage$1.getJSON(key);
        }
        static getAllFormLocalByKey(key) {
            var arrKey = new Array();
            for (var i = 0; i < LocalStorage$1.items.length; ++i) {
                var name = LocalStorage$1.items.key(i);
                if (name.indexOf(key) != -1) {
                    arrKey.push(name);
                }
            }
            return arrKey;
        }
        static clearLocalByKey(key) {
            LocalStorage$1.removeItem(key);
        }
        static clearLocal() {
            LocalStorage$1.clear();
        }
        static setGlowFilter(target, glowFilter) {
            if (glowFilter) {
                target.filters = [glowFilter];
            }
            else {
                target.filters = null;
            }
        }
        static remove(dataArray, element) {
            let index = dataArray.indexOf(element);
            if (index !== -1) {
                dataArray.splice(index, 1);
            }
            return index;
        }
        static getArrayBySplitString(str, sign) {
            return str.split(sign);
        }
        static formatStandardTime(seconds, showHours = true) {
            let hours = this.lpad(String(Math.floor(seconds / 3600) % 24), 2, 0);
            let mins = this.lpad(String(Math.floor(seconds / 60) % 60), 2, 0);
            let secs = this.lpad(String(Math.floor(seconds) % 60), 2, 0);
            if (showHours) {
                if (hours === "00") {
                    return this.format("{0}:{1}", mins, secs);
                }
                return this.format("{0}:{1}:{2}", hours, mins, secs);
            }
            return this.format("{0}:{1}", mins, secs);
        }
        static format(content, ...rest) {
            let args = [];
            rest.forEach(value => {
                if (value instanceof Array) {
                    value.forEach(v => {
                        args.push(v);
                    });
                }
                else {
                    args.push(value);
                }
            });
            args.forEach((value, index) => {
                content = content.replace(`{${index}}`, value);
            });
            return content;
        }
        static lpad(content, len, value) {
            if (content.length >= len) {
                return content;
            }
            let num = len - content.length;
            for (let n = 0; n < num; n++) {
                content = value + content;
            }
            return content;
        }
        static TimeToTimeFormat(time) {
            let hour = Math.floor(time / 3600);
            let min = Math.floor((time - 3600 * hour) / 60);
            let sec = Math.floor(time - 3600 * hour - min * 60);
            let str = "";
            if (hour > 0) {
                str = (hour >= 10 && hour || '0' + hour) + ':' + (min >= 10 && min || '0' + min) + ':' + (sec >= 10 && sec || '0' + sec);
            }
            else {
                str = (min >= 10 && min || '0' + min) + ':' + (sec >= 10 && sec || '0' + sec);
            }
            return str;
        }
        static GetTableLength(table) {
            let length = 0;
            for (const key of Object.keys(table)) {
                if (table.hasOwnProperty(key)) {
                    length++;
                }
            }
            return length;
        }
        static getClipNum(param) {
            let _x = param[0];
            let _y = param[1];
            let _n = param[2];
            let _url = param[3];
            let _len = param[4];
            let _once = param[5];
            let clip = new Laya.Clip(_url, _len, _once);
            clip.index = _n;
            clip.pos(_x, _y);
            return clip;
        }
        static FindTransfrom(Root, name) {
            let tran = null;
            tran = Root.getChildByName(name);
            if (tran != null)
                return tran;
            let go = null;
            for (let i = 0; i < Root.numChildren; i++) {
                go = Utils.FindTransfrom(Root.getChildAt(i), name);
                if (go != null) {
                    return go;
                }
            }
            return null;
        }
    }
    Utils.rayDirection = new Vector3$1();
    function Format(str, ...args) {
        let params = [...args];
        let index = 0;
        while (str.search("%S") != -1) {
            str = str.replace('%S', "%s");
        }
        while (str.search("%s") != -1) {
            str = str.replace('%s', params[index]);
            ++index;
        }
        return str;
    }
    function GetFormatTime(secs) {
        secs = Number(secs.toString().split(".")[0]);
        let day = Math.floor(secs / 86400);
        let hour = Math.floor((secs - day * 86400) / 3600);
        let min = Math.floor((secs - hour * 3600) / 60);
        let sec = secs - hour * 3600 - min * 60;
        let str = '';
        if (day > 0) {
            str = (day >= 10 ? day : '0' + day) + '天' + (hour >= 10 ? hour : '0' + hour) + '时';
        }
        else if (hour > 0) {
            str = (hour >= 10 ? hour : '0' + hour) + '时' + (min >= 10 ? min : '0' + min) + '分';
        }
        else if (min > 0) {
            str = (min >= 10 ? min : '0' + min) + '分' + (sec >= 10 ? sec : '0' + sec) + '秒';
        }
        else {
            str = (min >= 10 ? min : '0' + min) + '分' + (sec >= 10 ? sec : '0' + sec) + '秒';
        }
        return str;
    }

    class HttpService {
        constructor() {
            this.hCb = null;
            this.errorCb = null;
        }
        Request(i_strURL, i_jParam, i_strRequestFlag, i_strType, i_hCallBack, i_errCallBack) {
            this.hCb = i_hCallBack;
            this.errorCb = i_errCallBack;
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000;
            xhr.once(Laya.Event.COMPLETE, this, this.completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.errorHandler);
            xhr.send(i_strURL, i_jParam, i_strRequestFlag, i_strType);
        }
        ;
        processHandler(e) {
            console.log(e);
        }
        errorHandler(e) {
            if (this.errorCb) {
                this.errorCb(e);
            }
            console.log(e);
        }
        completeHandler(e) {
            if (this.hCb) {
                this.hCb(e);
            }
        }
    }

    class GameLink {
        constructor() {
            this._defaultHTTPIP = "ssjxzh5-wb-login.gyyx.cn/wx_plant";
            this._defaultHTTPPort = 8882;
            this.__defaultHTTPIP = "211.159.171.150";
            this.__defaultHTTPPort = 8882;
            this._defaultGatewayIP = "211.159.171.150";
            this._defaultGatewayPort = 8883;
        }
        static get inst() {
            if (this._class == null) {
                this._class = new this();
            }
            return this._class;
        }
        get urlParams() {
            return this._urlParams;
        }
        OnStart() {
            this._urlParams = {};
            this.SetGameParams();
        }
        OnDestroy() {
            this._urlParams = {};
        }
        WxCheckServerIp(appVersion) {
            if (GameLink.wxVersionNum == appVersion) {
                this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/wx_plant";
            }
            else {
                this._defaultGatewayIP = "wss://ssjxzh5-wb-login.gyyx.cn/wx_plant";
            }
            this._urlParams['selServerIP'] = this._defaultGatewayIP;
        }
        SetGameParams() {
            this._urlParams['selServerIP'] = this._defaultGatewayIP;
            this._urlParams['selServerPort'] = this._defaultGatewayPort;
            this._urlParams['serverid'] = new Link().loginParams.serverid;
            this._urlParams['sid'] = new Link().loginParams.sid;
            this._urlParams['firstGame'] = 'false';
            this._urlParams['mac'] = '';
            this._urlParams['openid'] = new Link().loginParams.openid;
            this._urlParams['pf'] = new Link().loginParams.pf;
        }
    }
    GameLink._class = null;
    GameLink.wxVersionNum = "1.0.0.0";
    class Link {
        constructor() {
            this.loginParams = {
                openid: "",
                serverid: 1,
                sid: 1,
                pf: "pf",
                firstGame: "FALSE",
                openkey: null,
                seqid: null,
                pfkey: null,
                sig: null,
                mac: ""
            };
        }
    }

    class RemoteCall {
        constructor() {
            this._reConnectNum = 0;
            this._reConnectMaxNum = 5;
            this._firstReConnectIntervalTime = 2000;
            this._reConnectIntervalTime = 5000;
            this._heartBeatOverTime = 14000;
            this._heartBeatDelayed = 5000;
            this._bufferTime = 1000;
            this._bReConnecting = false;
            this.offLineType = OffLineType.eUnknow;
            this._offLineTips = {
                1: "与服务器断开连接(#%s)！<br>",
                2: "您的账号将在%s被解封，请大侠耐心等待！",
                3: "登陆异常！您的账号在IP：%s登录！您已被迫下线！",
                4: "抱歉,您已被GM请出游戏！",
                5: "服务器已关闭,请诸位耐心等候！",
                6: "登录失败,请大侠重新登陆！",
                7: "登录服务器出现异常,请重新登陆！",
                8: "当前在线人数已超出服务器上限，请大侠重新登录！",
                9: "恭喜您,改名成功，请重新登录！",
                10: "当前网络出现异常，请重新登录！",
                11: "检测到您正在使用外挂, 请关闭后重试！",
                12: "您的数据出现异常，请重新登录！",
                13: "检测到客户端有新版本，请刷新后重新登陆！"
            };
        }
        static get instance() {
            if (this._class == null) {
                this._class = new this();
            }
            return this._class;
        }
        OnStart() {
            this._network = new Network();
            GEvent.RegistEvent(GacEvent.OnConnected, Laya.Handler.create(this, this.OnReConnected));
            GEvent.RegistEvent(GacEvent.OnConnectClose, Laya.Handler.create(this, this.OnConnectClose));
        }
        OnDestroy() {
            this.Close();
            this._network = null;
            GEvent.RemoveEvent(GacEvent.OnConnected, Laya.Handler.create(this, this.OnReConnected));
            GEvent.RemoveEvent(GacEvent.OnConnectClose, Laya.Handler.create(this, this.OnConnectClose));
        }
        Connect(host, port) {
            this._network.connect(host, port);
        }
        Close() {
            this._network.close();
        }
        IsConnected() {
            return this._network.isConnected();
        }
        RegisterProtocol(protocolId, cls) {
            this._network.registerProtocol(protocolId, Laya.Handler.create(cls, cls[protocolId]));
        }
        UnRegisterProtocol(protocolId, cls) {
            this._network.unRegisterProtocol(protocolId, Laya.Handler.create(cls, cls[protocolId]));
        }
        Send(i_strMsg, ...args) {
            this._network.send(i_strMsg, ...args);
        }
        TGW(i_SendBuffer) {
            this._network.TGW(i_SendBuffer);
        }
        HttpSend(i_strMsg, i_jParam, caller, fn, errFn) {
            return;
            let hs = new HttpService();
            let postLoginServerUrl;
            if (GameLink.inst._defaultHTTPPort == 0) {
                postLoginServerUrl = "https://" + GameLink.inst._defaultHTTPIP + "/" + i_strMsg;
            }
            else {
                postLoginServerUrl = "http://" + GameLink.inst.__defaultHTTPIP + ":" + GameLink.inst.__defaultHTTPPort + "/" + i_strMsg;
            }
            hs.Request(postLoginServerUrl, i_jParam, "post", "text", (data) => {
                if (fn) {
                    fn.call(caller, data);
                }
            }, (data) => {
                if (errFn) {
                    errFn.call(caller, data);
                }
            });
        }
        get bReConnecting() {
            return this._bReConnecting;
        }
        OpenReConnect() {
            this.K_HeartBeat();
        }
        CloseReConnect() {
            this._bReConnecting = false;
            Laya.timer.clear(this, this.K_HeartBeat);
            Laya.timer.clear(this, this.OnReConnectBuffer);
            Laya.timer.clear(this, this.OnReConnectStart);
            Laya.timer.clear(this, this.OnReConnectWait);
            this.Close();
        }
        K_HeartBeat() {
            if (this._bReConnecting)
                return;
            this.Send("K_HeartBeat");
            Laya.timer.once(this._heartBeatOverTime, this, this.OnReConnectBuffer);
        }
        C_HeartBeat() {
            if (this._bReConnecting)
                return;
            Laya.timer.clear(this, this.OnReConnectBuffer);
            Laya.timer.clear(this, this.OnReConnectStart);
            Laya.timer.once(this._heartBeatDelayed, this, this.K_HeartBeat);
        }
        OnReConnectBuffer() {
            if (this._bReConnecting)
                return;
            Laya.timer.once(this._bufferTime, this, this.OnReConnectStart);
        }
        OnReConnectStart() {
            if (this._bReConnecting)
                return;
            this._bReConnecting = true;
            this.Close();
            Laya.timer.once(this._firstReConnectIntervalTime, this, () => {
                this.OnReConnectWait();
                Laya.timer.loop(this._reConnectIntervalTime, this, this.OnReConnectWait);
            });
        }
        OnReConnectWait() {
            this._reConnectNum++;
            if (this._reConnectNum > this._reConnectMaxNum) {
                this.OnReConnected(false);
            }
            else {
            }
        }
        OnReConnected(bSuccess) {
            Laya.timer.once(500, this, () => {
                this.OpenReConnect();
            });
            if (!this._bReConnecting) {
                return;
            }
            this._bReConnecting = false;
            this.OpenReConnect();
            this._reConnectNum = 0;
            Laya.timer.clear(this, this.OnReConnectWait);
            this.Send("K_StoryFinish", 12345);
            GEvent.DispatchEvent(GacEvent.OnReConnected, [bSuccess]);
        }
        LastError(data) {
            this.offLineType = data[0];
            this.offLineData = data[1];
        }
        OnConnectClose() {
            let str = Format(this._offLineTips[1], this.offLineType);
            if (OffLineType.eBanPlay == this.offLineType) {
                let tstr = GetFormatTime(this.offLineData);
                str += Format(this._offLineTips[2], tstr);
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eRepeatLogin == this.offLineType) {
                str += Format(this._offLineTips[3], this.offLineData);
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eGMKick == this.offLineType) {
                str += this._offLineTips[4];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eServerShutdown == this.offLineType) {
                str += this._offLineTips[5];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eLoginFailed == this.offLineType) {
                str += this._offLineTips[6];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eLoginServerError == this.offLineType) {
                str += this._offLineTips[7];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eLoginFull == this.offLineType) {
                str += this._offLineTips[8];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eReName == this.offLineType) {
                str += this._offLineTips[9];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eUnknow == this.offLineType) {
                if (MyPlayer.bInGame) {
                    return;
                }
                else {
                    str += this._offLineTips[10];
                }
            }
            else if (OffLineType.eShield == this.offLineType) {
                str += this._offLineTips[11];
                RemoteCall.instance.CloseReConnect();
            }
            else if (OffLineType.eVersionFail == this.offLineType) {
                str += this._offLineTips[13];
                RemoteCall.instance.CloseReConnect();
            }
            else {
                if (MyPlayer.bInGame) {
                    return;
                }
                else {
                    str += this._offLineTips[12];
                }
            }
            Debug.Log(str);
        }
    }
    RemoteCall._class = null;

    var ModelStorage;
    (function (ModelStorage) {
        ModelStorage["Player"] = "player";
        ModelStorage["Staff"] = "Staff";
        ModelStorage["GatherLV"] = "GatherLV";
        ModelStorage["Point"] = "point";
        ModelStorage["Tree"] = "tree";
        ModelStorage["Bottom"] = "bottom";
        ModelStorage["bagsystem"] = "bagsystem";
        ModelStorage["plant"] = "plant";
        ModelStorage["mapData"] = "mapData";
        ModelStorage["ConnNum"] = "ConnNum";
        ModelStorage["GuideID"] = "GuideId";
        ModelStorage["FreeGuideID"] = "FreeGuideID";
        ModelStorage["openid"] = "openid";
        ModelStorage["SgoodsTime"] = "SgoodsTime";
        ModelStorage["NPC"] = "npc";
        ModelStorage["Publicity"] = "Publicity";
        ModelStorage["AgeNpcCount"] = "AgeNpcCount";
        ModelStorage["point_defaulsucculent1"] = "point_defaulsucculent1";
        ModelStorage["point_defaulsucculent2"] = "point_defaulsucculent2";
        ModelStorage["point_defaulsucculent3"] = "point_defaulsucculent3";
        ModelStorage["point_defaulsucculent4"] = "point_defaulsucculent4";
        ModelStorage["point_defaulsucculent5"] = "point_defaulsucculent5";
        ModelStorage["point_defaulsucculent6"] = "point_defaulsucculent6";
    })(ModelStorage || (ModelStorage = {}));
    class SaveManager extends Singleton {
        constructor() {
            super();
            this.ModelData = {};
            this._dirtyData = {};
            this._isLogin = false;
            this._uploadIntervalTime = 30000;
        }
        OnStart() {
            this.ModelData = {};
            this._isLogin = false;
            Laya.timer.loop(this._uploadIntervalTime, this, this.LoopToUploadCache);
        }
        OnDestroy() {
            this.ModelData = {};
            this._isLogin = false;
            Laya.timer.clearAll(this);
        }
        get IsLogin() {
            return this._isLogin;
        }
        set IsLogin(login) {
            this._isLogin = login;
        }
        InitCache() {
            RemoteCall.instance.HttpSend("getsavecache", GameLink.inst.urlParams["openid"], this, this.InitCacheData, () => {
                this.InitCacheData(null);
            });
            Laya.timer.once(3500, this, this.InitCacheData);
        }
        InitCacheData(loginData) {
            if (this._isLogin)
                return;
            this._isLogin = true;
            loginData = this.decodeHttpData(loginData);
            let localData = this.GetLocalCache();
            if (this.CheckPlayerLv(loginData, localData)) {
                this.ModelData = localData;
            }
            else {
                this.ModelData = loginData;
                this.SetLocalCache();
            }
            MyPlayer.EnterMap();
            this.SetOpenidCache(GameLink.inst.urlParams["openid"]);
        }
        decodeHttpData(data) {
            let tInfo = null;
            try {
                tInfo = JSON.parse(data);
            }
            catch (error) {
            }
            let tTemp = {};
            for (const key in tInfo) {
                let name = tInfo[key].modelname;
                let value = tInfo[key].cachevalue;
                try {
                    tTemp[name] = JSON.parse(value);
                }
                catch (error) {
                }
            }
            return tTemp;
        }
        CheckPlayerLv(loginData, localData) {
            if (!loginData) {
                return true;
            }
            if (!loginData[ModelStorage.Player] || !loginData[ModelStorage.Player].star) {
                return true;
            }
            if (!localData[ModelStorage.Player] || !localData[ModelStorage.Player].star) {
                return false;
            }
            let starS = loginData[ModelStorage.Player].star;
            let starL = localData[ModelStorage.Player].star;
            return starL >= starS;
        }
        GetLocalCache() {
            let tData = {};
            if (Utils.getJSONFromLocal(ModelStorage.openid) != GameLink.inst.urlParams["openid"]) {
                Utils.clearLocal();
                return tData;
            }
            for (const key in ModelStorage) {
                let cacheName = ModelStorage[key];
                tData[cacheName] = Utils.getJSONFromLocal(cacheName);
            }
            return tData;
        }
        SetLocalCache() {
            for (const key in ModelStorage) {
                let cacheName = ModelStorage[key];
                if (this.ModelData[key])
                    Utils.saveJSONToLocal(cacheName, this.ModelData[key]);
            }
        }
        LoopToUploadCache() {
            let data = {};
            let num = 0;
            for (const key in this._dirtyData) {
                if (this.ModelData[key]) {
                    data[key] = JSON.stringify(this.ModelData[key]);
                    data[key] = data[key].replace(/\\/g, "\\\\");
                    num++;
                }
            }
            if (num <= 0)
                return;
            let tData = {};
            tData["openid"] = GameLink.inst.urlParams["openid"];
            tData["params"] = data;
            RemoteCall.instance.HttpSend("onsavecache", tData, this);
            this._dirtyData = {};
        }
        SendModelCacheToS(cacheName) {
            let data = {};
            data[cacheName] = this.ModelData[cacheName];
            let tData = {};
            tData["openid"] = GameLink.inst.urlParams["openid"];
            tData["params"] = data;
            RemoteCall.instance.HttpSend("onsavecache", tData, this);
            if (this._dirtyData[cacheName]) {
                delete this._dirtyData[cacheName];
            }
        }
        SetCache(cacheName, value) {
            this.ModelData[cacheName] = value;
            Utils.saveJSONToLocal(cacheName, value);
            this._dirtyData[cacheName] = true;
        }
        GetCache(cacheName) {
            if (!this.ModelData[cacheName]) {
                return;
            }
            return this.ModelData[cacheName];
        }
        SetPlayerCache(value) {
            this.SetCache(ModelStorage.Player, value);
        }
        SetBagSystemCache(value) {
            this.SetCache(ModelStorage.bagsystem, value);
        }
        SetStaffCache(value) {
            this.SetCache(ModelStorage.Staff, value);
        }
        SetPublicityCache(value) {
            this.SetCache(ModelStorage.Publicity, value);
        }
        SetAgeNpcCountCache(value) {
            this.SetCache(ModelStorage.AgeNpcCount, value);
        }
        SetTreeCache(value) {
            this.SetCache(ModelStorage.Tree, value);
        }
        SetBottomCache(value) {
            this.SetCache(ModelStorage.Bottom, value);
        }
        SetGatherLvCache(value) {
            this.SetCache(ModelStorage.GatherLV, value);
        }
        SetmapDataCache(value) {
            this.SetCache(ModelStorage.mapData, value);
        }
        SetPointCache(key, value) {
            this.SetCache(key, value);
        }
        SetConnNum(value) {
            this.SetCache(ModelStorage.ConnNum, value);
        }
        SetGuideID(value) {
            this.SetCache(ModelStorage.GuideID, value);
        }
        SetFreeGuideID(value) {
            this.SetCache(ModelStorage.FreeGuideID, value);
        }
        SetOpenidCache(value) {
            this.SetCache(ModelStorage.openid, value);
        }
        SetGoodsTime(value) {
            this.SetCache(ModelStorage.SgoodsTime, value);
        }
        SetNpc(value) {
            this.SetCache(ModelStorage.NPC, value);
        }
    }

    class Player extends Singleton {
        constructor() {
            super();
            this.nGold = 100;
            this.nStar = 10;
            this.sName = "";
            this.tPotData = {};
            this.initData();
        }
        initData() {
            let _data = SaveManager.getInstance().GetCache(ModelStorage.Player);
            if (!_data) {
                _data = {};
                _data["star"] = this.nStar ? this.nStar : 10;
                _data["gold"] = this.nGold ? this.nGold : 100;
            }
            else {
                this.nStar = _data.star;
                this.nGold = _data.gold;
            }
            this.nAttraction = _data.attraction;
            this.tPotData = _data.potData || {};
            this.refreshStorage();
        }
        refreshStorage() {
            let _data = {};
            _data["star"] = this.nStar;
            _data["gold"] = this.nGold;
            _data["name"] = this.sName;
            _data["potData"] = this.tPotData;
            SaveManager.getInstance().SetPlayerCache(_data);
            Laya.stage.event(CommonDefine.EVENT_MAIN_REFRESH);
        }
        refreshStar(v) {
            this.nStar += v;
            this.refreshStorage();
        }
        refreshGold(v) {
            this.nGold += v;
            this.refreshStorage();
        }
        canPayGold(value) {
            return this.nGold - value >= 0;
        }
        refreshPotData(v, flag) {
            this.tPotData[v] = flag;
            this.refreshStorage();
        }
        setName(name) {
            this.sName = name;
        }
    }

    class MyPlayer {
        static get bInGame() {
            return this._bInGame;
        }
        static OnStart() {
            this._bInGame = false;
        }
        static OnDestroy() {
            this._bInGame = false;
        }
        static ReqPlayLog(play_type = null, play_name = null, play_param = null, op_type = null, use_time = null) {
            RemoteCall.instance.Send("K_ReqPlayLog", play_type, play_name, play_param, op_type, use_time);
        }
        static EnterMap() {
            if (this._bInGame) {
                return;
            }
            this._bInGame = true;
            Player.getInstance().setName("111");
            Player.getInstance().refreshStorage();
            Application.onLoading();
            if (!SaveManager.getInstance().GetCache(ModelStorage.ConnNum)) {
                SaveManager.getInstance().SetConnNum(1);
            }
            else {
                SaveManager.getInstance().SetConnNum(SaveManager.getInstance().GetCache(ModelStorage.ConnNum) + 1);
            }
        }
    }

    var Sprite = Laya.Sprite;
    var Browser = Laya.Browser;
    class LayerManager extends Singleton {
        constructor() {
            super();
            this.offset = 40;
            this.initGameLayer();
        }
        initGameLayer() {
            this.root = new Sprite();
            function Load(viewName) {
                let view = new Laya.View();
                view.width = GameConfig.width;
                view.height = GameConfig.height;
                view.mouseThrough = true;
                view.name = viewName;
                return view;
            }
            this.topUILayer = Load("topUILayer");
            this.uiLayer = Load("uiLayer");
            this.itemLayer = Load("itemLayer");
            this.downUILayer = Load("downUILayer");
            this.GuideView = Load("GuideView");
            this.gameLayer = new Sprite();
            if (Browser.onWeiXin) {
                if (MyPlayer.wxSDK.systemInfo) {
                    var d = MyPlayer.wxSDK.systemInfo;
                    if (d.model.indexOf("iPhone X") != -1 || d.model.indexOf("iPhone XR") != -1 ||
                        d.model.indexOf("iPhone 11") != -1 || d.model.indexOf("iPhone XS Max") != -1 ||
                        d.model.indexOf("iPhone XS") != -1) {
                        {
                            this.itemLayer.top = this.offset;
                            this.downUILayer.top = this.offset;
                            this.uiLayer.top = this.offset;
                            this.GuideView.top = this.offset;
                        }
                    }
                }
            }
            this.root.addChild(this.gameLayer);
            this.root.addChild(this.itemLayer);
            this.root.addChild(this.downUILayer);
            this.root.addChild(this.uiLayer);
            this.root.addChild(this.topUILayer);
            this.root.addChild(this.GuideView);
            this.itemLayer.mouseEnabled = true;
            this.topUILayer.mouseEnabled = true;
            this.gameLayer.mouseEnabled = true;
            this.uiLayer.mouseEnabled = true;
            this.itemLayer.mouseThrough = true;
            this.topUILayer.mouseThrough = true;
            this.gameLayer.mouseThrough = true;
            this.uiLayer.mouseThrough = true;
            this.downUILayer.mouseThrough = true;
            Laya.stage.addChild(this.root);
            this.gameLayer.name = "gameLayer";
            this.root.name = "root";
            this.uiLayer.zOrder = 10;
            this.topUILayer.zOrder = 11;
            this.GuideView.zOrder = 12;
        }
    }

    class ViewManager extends Singleton {
        constructor() {
            super(...arguments);
            this._stateList = {};
            this._UIViewList = {};
            this._viewAtlasRes = {};
            this._viewClassList = {};
        }
        OnStart() {
            this._stateList = {};
            this._viewClassList = {};
        }
        OnDestroy() {
            this._stateList = {};
        }
        SaveViewResUrl(viewClass, resArray) {
            if (!viewClass) {
                Debug.LogError("加载UI资源参数有误！");
                return;
            }
            this._viewAtlasRes[viewClass.name] = resArray;
        }
        LoadViewAtlas(viewClass, loaded) {
            let url = this._viewAtlasRes[viewClass.name];
            if (url != null) {
                Laya.loader.load(url, Laya.Handler.create(this, () => {
                    loaded.run();
                }));
            }
            else {
                loaded.run();
            }
        }
        Adaptation(view) {
            view.left = 0;
            view.right = 0;
            view.top = 0;
            view.bottom = 0;
        }
        GetState(viewClass) {
            if (!viewClass) {
                Debug.LogError("查询UI状态有误！");
                return ViewState.None;
            }
            if (this._stateList[viewClass.name] == true) {
                return ViewState.Loaded;
            }
            else if (this._stateList[viewClass.name] == false) {
                return ViewState.Loading;
            }
            else {
                return ViewState.None;
            }
        }
        ShowUI(viewClass, hierarchy, params, callBack) {
            if (!viewClass || !hierarchy) {
                Debug.LogError("创建UI参数有误！");
                return;
            }
            if (this._stateList[viewClass.name] != null) {
                Debug.LogError("此UI已经存在，创建失败！");
                return;
            }
            this._stateList[viewClass.name] = false;
            let view = this._UIViewList[viewClass.name];
            if (view == null) {
                this._Create(viewClass, hierarchy, params, callBack);
            }
            else {
                this._Show(viewClass, hierarchy);
                if (view.onShow)
                    view.onShow();
                if (callBack != null) {
                    callBack.runWith(view);
                }
            }
        }
        AddUI(viewClass, node, params, callBack) {
            if (!viewClass || !node) {
                Debug.LogError("添加UI参数有误！");
                return;
            }
            if (this._stateList[viewClass.name] != null) {
                Debug.LogError("此UI已经存在，创建失败！");
                return;
            }
            this._stateList[viewClass.name] = false;
            this._Create(viewClass, node, params, callBack);
        }
        HideUI(viewClass, hierarchy) {
            if (!viewClass || !hierarchy) {
                Debug.LogError("隐藏UI参数有误！");
                return;
            }
            this._Hide(viewClass, hierarchy);
        }
        DestroyUI(viewClass, hierarchy) {
            if (!viewClass || !hierarchy) {
                Debug.LogError("销毁UI参数有误！");
                return;
            }
            this._Destroy(viewClass, hierarchy);
        }
        _Create(viewClass, hierarchy, params, callBack) {
            let __this = this;
            function _load() {
                let view = new viewClass(params);
                view.name = viewClass.name;
                view.width = Laya.stage.width;
                view.height = Laya.stage.height;
                hierarchy.addChild(view);
                __this.Adaptation(view);
                __this._viewClassList[view.name] = view;
                __this._stateList[viewClass.name] = true;
                __this._UIViewList[viewClass.name] = view;
                if (callBack != null) {
                    callBack.runWith(view);
                }
            }
            this.LoadViewAtlas(viewClass, Laya.Handler.create(this, () => {
                _load();
            }));
        }
        _Show(viewClass, hierarchy) {
            let ui = hierarchy.getChildByName(viewClass.name);
            if (ui != null) {
                ui.visible = true;
            }
        }
        _Hide(viewClass, hierarchy) {
            let ui = hierarchy.getChildByName(viewClass.name);
            if (ui != null) {
                if (this._UIViewList[viewClass.name].onHide) {
                    this._UIViewList[viewClass.name].onHide();
                }
                delete this._stateList[viewClass.name];
                ui.visible = false;
            }
        }
        _Destroy(viewClass, hierarchy) {
            let ui = hierarchy.getChildByName(viewClass.name);
            if (ui != null) {
                ui.destroy(true);
                this._UIViewList[viewClass.name].offAll();
                if (this._UIViewList[viewClass.name].OnDestroy) {
                    this._UIViewList[viewClass.name].OnDestroy();
                }
                delete this._viewClassList[viewClass.name];
                delete this._stateList[viewClass.name];
                delete this._UIViewList[viewClass.name];
            }
        }
        GetViewByClass(viewClass) {
            if (!viewClass) {
                Debug.LogError("参数有误！");
                return;
            }
            return this._viewClassList[viewClass.name];
        }
        GetViewByName(name) {
            if (!name) {
                Debug.LogError("参数有误！");
                return;
            }
            return this._viewClassList[name];
        }
        DestroyUIByHie(hierarchy) {
            let viewIndex = [];
            for (let _id = 0; _id < hierarchy.numChildren; _id++) {
                let ui = hierarchy.getChildAt(_id);
                if (ui != null) {
                    viewIndex.push(ui.name);
                }
            }
            for (let key = 0; key < viewIndex.length; key++) {
                let _viewName = viewIndex[key];
                let ui = hierarchy.getChildByName(_viewName);
                ui.destroy(true);
                delete this._stateList[ui.name];
                delete this._UIViewList[ui.name];
            }
        }
    }

    class GameUIManager extends Singleton {
        constructor() {
            super();
            this.uiList = new Array();
            this.uiLayer = LayerManager.getInstance().uiLayer;
            this.topUILayer = LayerManager.getInstance().topUILayer;
            this.itemLayer = LayerManager.getInstance().itemLayer;
            this.topUILayer = LayerManager.getInstance().topUILayer;
        }
        createUI(cls, params, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.uiLayer, params, callBack);
        }
        createHPUI(cls, params, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.downUILayer, params, callBack);
        }
        createItemUI(cls, params, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.itemLayer, params, callBack);
        }
        createTopUI(cls, params, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.topUILayer, params, callBack);
        }
        showUI(cls, callBack, params) {
            ViewManager.getInstance().ShowUI(cls, this.uiLayer, params, callBack);
        }
        showHPUI(cls, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.downUILayer, cls, callBack);
        }
        showItemUI(cls, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.itemLayer, cls, callBack);
        }
        showTopUI(cls, callBack) {
            ViewManager.getInstance().ShowUI(cls, this.topUILayer, cls, callBack);
        }
        GetViewByClass(viewClass) {
            return ViewManager.getInstance().GetViewByClass(viewClass);
        }
        GetState(viewClass) {
            return ViewManager.getInstance().GetState(viewClass);
        }
        hideUI(cls) {
            ViewManager.getInstance().HideUI(cls, this.uiLayer);
        }
        hideHPUI(cls) {
            ViewManager.getInstance().HideUI(cls, this.downUILayer);
        }
        hideItemUI(cls) {
            ViewManager.getInstance().HideUI(cls, this.itemLayer);
        }
        hideTopUI(cls) {
            ViewManager.getInstance().HideUI(cls, this.topUILayer);
        }
        destroyUI(cls) {
            ViewManager.getInstance().DestroyUI(cls, this.uiLayer);
        }
        destroyHPUI(cls) {
            ViewManager.getInstance().DestroyUI(cls, this.downUILayer);
        }
        destroyItemUI(cls) {
            ViewManager.getInstance().DestroyUI(cls, this.itemLayer);
        }
        destroyTopUI(cls) {
            ViewManager.getInstance().DestroyUI(cls, this.topUILayer);
        }
        GetOtherUIShow() {
            if (this.uiLayer.numChildren > 0) {
                for (let i = 0; i < this.uiLayer.numChildren; i++) {
                    let ui = this.uiLayer.getChildAt(i);
                    if (ui.name != "MainUIScene" && ui.visible == true && ui.name != "SwitchScene") {
                        return true;
                    }
                }
            }
            return false;
        }
        GetOtherUIShowTop(hir) {
            let curindex = -1;
            let ui = this.uiLayer.getChildByName(hir);
            if (ui == null)
                return false;
            if (this.uiLayer.numChildren > 0) {
                for (let i = 0; i < this.uiLayer.numChildren; i++) {
                    let ui = this.uiLayer.getChildAt(i);
                    if (ui.name == hir) {
                        curindex = i;
                    }
                    if (i > curindex && ui.visible == true && curindex != -1) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    var Handler$1 = Laya.Handler;
    class ResourceManager extends Singleton {
        OnStart(callBack) {
        }
        OnDestroy() {
        }
        getResource(url, complate) {
            if (Array.isArray(url)) {
            }
            else {
                var tar = Laya.Loader.getRes(url);
                if (tar) {
                    complate && complate.runWith(tar.clone());
                    return;
                }
            }
            Laya.loader.create(url, Handler$1.create(this, function (ret) {
                complate && complate.runWith(ret.clone());
            }));
        }
        LoadASyn(pUrl, fComplete) {
            if (Array.isArray(pUrl)) {
                let mapRetRes = new Map();
                let aryLoadUrl = [];
                pUrl.forEach(sUrl => {
                    let pRes = Laya.Loader.getRes(sUrl);
                    if (pRes == null) {
                        aryLoadUrl.push(sUrl);
                    }
                    else {
                        mapRetRes[sUrl] = pRes;
                    }
                });
                function multipleLoadDone() {
                    aryLoadUrl.forEach(sUrl => {
                        sUrl = sUrl.url;
                        mapRetRes[sUrl] = Laya.Loader.getRes(sUrl);
                    });
                    if (fComplete)
                        fComplete.runWith(mapRetRes);
                }
                ;
                if (aryLoadUrl.length > 0) {
                    Laya.loader.create(aryLoadUrl, Laya.Handler.create(this, multipleLoadDone));
                }
                else {
                    Laya.timer.frameOnce(1, this, multipleLoadDone);
                }
            }
            else {
                let pRes = Laya.Loader.getRes(pUrl);
                function singleLoadDone() {
                    if (fComplete)
                        fComplete.runWith(Laya.Loader.getRes(pUrl));
                }
                if (pRes == null) {
                    Laya.loader.create(pUrl, Laya.Handler.create(this, singleLoadDone));
                }
                else {
                    Laya.timer.frameOnce(1, this, singleLoadDone);
                }
            }
        }
    }

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class MainSceneUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(MainSceneUI.uiView);
            }
        }
        MainSceneUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Script", "props": { "runtime": "common/Application.ts" }, "compId": 10 }], "loadList": [], "loadList3D": [] };
        ui.MainSceneUI = MainSceneUI;
        REG("ui.MainSceneUI", MainSceneUI);
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            class BackPackSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BackPackSceneUI.uiView);
                }
            }
            BackPackSceneUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 225, "x": 32, "width": 575, "skin": "gameui/img_chekedPotted_di.png", "sizeGrid": "169,84,111,87", "name": "Image", "height": 662 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 41, "x": 186, "visible": true, "var": "ui_tips_font", "skin": "gameui/main/backpackname.png", "centerX": 0 }, "compId": 16 }, { "type": "Box", "props": { "y": 150, "width": 491, "name": "Box", "height": 432, "centerX": 0 }, "compId": 37, "child": [{ "type": "List", "props": { "y": 0, "x": 0, "width": 491, "visible": false, "var": "decorate_list_bg", "spaceY": 20, "spaceX": 0, "repeatX": 1, "height": 419 }, "compId": 38, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "renderType": "render" }, "compId": 39, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 491, "texture": "common/huapendi.png", "height": 132 }, "compId": 40 }] }] }, { "type": "List", "props": { "y": 0, "width": 515, "var": "ui_good_list", "spaceY": 38, "spaceX": 58, "repeatX": 3, "name": "ui_good_list", "height": 436, "centerX": 0 }, "compId": 41, "child": [{ "type": "Box", "props": { "y": 0, "x": 64, "width": 91, "renderType": "render", "name": "box", "height": 127 }, "compId": 46, "child": [{ "type": "Image", "props": { "y": -3, "x": -51, "width": 491, "visible": false, "skin": "common/huapendi.png", "name": "bg", "height": 120 }, "compId": 50 }, { "type": "Image", "props": { "y": 16, "x": 3, "width": 84, "skin": "gameui/staffcommon/goodbg.png", "name": "good_pic", "height": 84 }, "compId": 47 }, { "type": "Label", "props": { "y": 81, "x": 55, "visible": false, "text": "99", "strokeColor": "#883d0f", "stroke": 2, "name": "good_num", "fontSize": 22, "color": "#ffffff" }, "compId": 48 }, { "type": "Box", "props": { "y": 78, "x": 54, "width": 30, "name": "boxnum", "height": 24 }, "compId": 55 }, { "type": "Label", "props": { "y": 103, "x": -19.5, "width": 128, "valign": "middle", "text": "一个多肉", "name": "label_name", "height": 25, "fontSize": 18, "font": "Microsoft YaHei", "color": "#000000", "align": "center" }, "compId": 56 }] }] }] }, { "type": "Image", "props": { "y": 35, "x": 474, "var": "ui_close_button", "skin": "common/close.png" }, "compId": 14 }] }], "loadList": ["gameui/img_chekedPotted_di.png", "gameui/main/backpackname.png", "common/huapendi.png", "gameui/staffcommon/goodbg.png", "common/close.png"], "loadList3D": [] };
            view.BackPackSceneUI = BackPackSceneUI;
            REG("ui.view.BackPackSceneUI", BackPackSceneUI);
            class DiyChangePotUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(DiyChangePotUI.uiView);
                }
            }
            DiyChangePotUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 10.5, "width": 619, "skin": "gameui/flowerstate/diybg.png", "sizeGrid": "237,84,157,87", "name": "content", "height": 473 }, "compId": 3, "child": [{ "type": "List", "props": { "y": 42, "width": 563, "var": "potList", "spaceY": 25, "spaceX": -10, "repeatX": 4, "name": "potList", "height": 294, "centerX": -5 }, "compId": 5, "child": [{ "type": "Box", "props": { "y": 8, "x": 53, "width": 127, "renderType": "render", "height": 130 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": -4, "x": -42, "skin": "gameui/flowerstate/listbg.png", "name": "img_bg" }, "compId": 7 }, { "type": "Image", "props": { "y": 4, "x": 5, "width": 128, "skin": "gameui/iconpen-1.png", "scaleY": 0.9, "scaleX": 0.9, "name": "img_pot", "height": 128 }, "compId": 8 }, { "type": "Label", "props": { "y": 108, "x": 37, "width": 79, "text": "容量: 6", "name": "la_volume", "height": 21, "fontSize": 22, "font": "Microsoft YaHei", "color": "#84480A" }, "compId": 9 }, { "type": "Image", "props": { "y": 101, "x": 5, "width": 26, "skin": "gameui/flowerstate/duorou.png", "height": 28 }, "compId": 10 }, { "type": "Image", "props": { "y": 68, "x": 32, "skin": "gameui/flowerlock/lock.png", "name": "la_lockcon" }, "compId": 11 }, { "type": "Image", "props": { "y": 67, "x": 31, "skin": "gameui/lock.png", "name": "la_unlockcon" }, "compId": 12 }] }] }, { "type": "Box", "props": { "y": 354, "x": 43, "width": 536, "visible": true, "var": "state_ripe", "name": "state_ripe", "height": 67 }, "compId": 14, "child": [{ "type": "Sprite", "props": { "y": 14, "x": 53, "texture": "gameui/flowerstate/duorou.png" }, "compId": 26 }, { "type": "Label", "props": { "y": 21, "x": 238, "width": 127, "valign": "middle", "text": "5", "name": "curpotnum", "height": 33, "fontSize": 25, "font": "Microsoft YaHei", "color": "#ffffff", "align": "left" }, "compId": 15 }, { "type": "Label", "props": { "y": 21, "x": 310, "width": 55, "valign": "middle", "text": "5", "name": "potnum", "height": 33, "fontSize": 25, "font": "Microsoft YaHei", "color": "#ffffff", "align": "left" }, "compId": 25 }, { "type": "Label", "props": { "y": 21, "x": 267, "width": 29, "valign": "middle", "text": "→", "name": "jiantou", "height": 33, "fontSize": 25, "font": "Microsoft YaHei", "color": "#fdfdfd", "align": "left" }, "compId": 24 }, { "type": "Label", "props": { "y": 21, "x": 115, "width": 216, "valign": "middle", "text": "花盆容量：", "height": 33, "fontSize": 25, "font": "Microsoft YaHei", "color": "#fdfdfd", "align": "left" }, "compId": 16 }, { "type": "Button", "props": { "x": 384, "var": "btn_click", "stateNum": 1, "skin": "gameui/flowerstate/cokbg.png", "name": "btn_click", "centerY": 0 }, "compId": 18 }] }] }], "loadList": ["gameui/flowerstate/diybg.png", "gameui/flowerstate/listbg.png", "gameui/iconpen-1.png", "gameui/flowerstate/duorou.png", "gameui/flowerlock/lock.png", "gameui/lock.png", "gameui/flowerstate/cokbg.png"], "loadList3D": [] };
            view.DiyChangePotUI = DiyChangePotUI;
            REG("ui.view.DiyChangePotUI", DiyChangePotUI);
            class DIYFinishViewUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(DIYFinishViewUI.uiView);
                }
            }
            DIYFinishViewUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "x": 0, "visible": false, "var": "scorePanel", "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "name": "scorePanel", "mouseEnabled": true, "left": 0, "bottom": 0 }, "compId": 48, "child": [{ "type": "Image", "props": { "y": 408, "x": 317.5, "width": 640, "var": "eff_bg", "height": 640, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 49 }, { "type": "Button", "props": { "y": 813, "x": 211, "width": 192, "visible": false, "var": "makeSureBtn", "stateNum": 1, "skin": "gameui/flowerstate/lanniulittle.png", "name": "makeSureBtn", "height": 79 }, "compId": 52, "child": [{ "type": "Sprite", "props": { "y": 21, "x": 61, "width": 70, "texture": "gameui/flowerstate/queren.png", "height": 35 }, "compId": 53 }] }] }], "loadList": ["gameui/img-heidi.png", "gameui/flowerstate/lanniulittle.png", "gameui/flowerstate/queren.png"], "loadList3D": [] };
            view.DIYFinishViewUI = DIYFinishViewUI;
            REG("ui.view.DIYFinishViewUI", DIYFinishViewUI);
            class DiySceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(DiySceneUI.uiView);
                }
            }
            DiySceneUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 41, "x": 0, "var": "img_bg", "skin": "gameui/list/lan.png", "sizeGrid": "91,0,88,0", "height": 222 }, "compId": 3, "child": [{ "type": "Button", "props": { "y": 176, "x": 265, "width": 110, "var": "up_down", "stateNum": 1, "skin": "gameui/list/kai.png", "height": 40 }, "compId": 10 }] }, { "type": "List", "props": { "y": 93, "x": 33, "width": 594, "visible": false, "var": "zToolList", "spaceY": 10, "spaceX": 30, "repeatY": 1, "repeatX": 0, "height": 113 }, "compId": 4, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 113, "renderType": "render", "height": 107 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 104, "skin": "gameui/list/di.png", "name": "bg" }, "compId": 12 }, { "type": "Image", "props": { "y": 9, "x": 2, "width": 98, "skin": "gameui/icon-1.png", "name": "item", "height": 87 }, "compId": 13 }, { "type": "Label", "props": { "y": 82, "x": 7, "width": 104, "valign": "middle", "strokeColor": "#9a4f22", "stroke": 2, "padding": "0,2,0,2", "name": "num", "height": 22, "fontSize": 24, "color": "#ffffff", "align": "right" }, "compId": 14 }, { "type": "Box", "props": { "name": "clip_box" }, "compId": 31 }] }] }, { "type": "List", "props": { "y": 93, "x": 33, "width": 594, "visible": false, "var": "dToolList", "spaceY": 10, "spaceX": 30, "repeatY": 1, "repeatX": 0, "name": "dToolList", "height": 113 }, "compId": 5, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 113, "renderType": "render", "height": 107 }, "compId": 15, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 104, "skin": "gameui/list/di.png", "name": "bg" }, "compId": 16 }, { "type": "Image", "props": { "y": 9, "x": 2, "width": 98, "skin": "gameui/icon-1.png", "name": "item", "height": 87 }, "compId": 17 }, { "type": "Label", "props": { "y": 82, "x": 7, "width": 104, "valign": "middle", "strokeColor": "#9a4f22", "stroke": 2, "padding": "0,2,0,2", "name": "num", "height": 22, "fontSize": 24, "color": "#ffffff", "align": "right" }, "compId": 18 }, { "type": "Box", "props": { "y": 0, "x": 0, "name": "clip_box" }, "compId": 32 }] }] }, { "type": "Image", "props": { "y": 0, "x": 130, "top": 0, "skin": "gameui/img-muban1.png" }, "compId": 6, "child": [{ "type": "Button", "props": { "y": 0, "x": 20, "var": "dBtn", "stateNum": 1, "skin": "gameui/btn-zuoanniu1.png" }, "compId": 19, "child": [{ "type": "Label", "props": { "top": 8, "text": "多肉", "strokeColor": "#fff", "stroke": 4, "right": 25, "fontSize": 24, "font": "Microsoft YaHei", "color": "#a88567", "bold": true }, "compId": 20 }] }, { "type": "Button", "props": { "y": 0, "x": 193, "var": "zBtn", "stateNum": 1, "skin": "gameui/btn-youanniu1.png" }, "compId": 21, "child": [{ "type": "Label", "props": { "top": 8, "text": "装饰", "strokeColor": "#fff", "stroke": 4, "left": 25, "fontSize": 24, "font": "Microsoft YaHei", "color": "#a88567", "bold": true }, "compId": 22 }] }] }, { "type": "Button", "props": { "y": 326, "x": 10, "var": "qBtn", "stateNum": 1, "skin": "gameui/btn-shijiao.png", "right": 42 }, "compId": 7 }, { "type": "Image", "props": { "y": 10, "x": 10, "width": 640, "var": "bottomTab", "skin": "gameui/img-muban2.png", "name": "bottomTab", "left": 0, "height": 134, "bottom": 0 }, "compId": 8, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "right": 0, "name": "bottomTab", "mouseEnabled": true, "left": 0, "height": 134, "bottom": 0 }, "compId": 35, "child": [{ "type": "Button", "props": { "y": -7, "x": 0, "var": "back", "stateNum": 1, "skin": "gameui/btn-fanhuianniu.png", "left": 0, "bottom": 20 }, "compId": 23 }, { "type": "Button", "props": { "y": -6, "x": 474, "var": "finish", "stateNum": 1, "skin": "gameui/btn-wanchenganniu1.png", "right": 0, "name": "finish", "bottom": 20 }, "compId": 24 }, { "type": "Box", "props": { "y": 40, "x": 168, "width": 300, "var": "bottom_clip_box", "top": 40, "left": 168, "height": 60 }, "compId": 25, "child": [{ "type": "Label", "props": { "var": "content", "valign": "middle", "top": 8, "text": "/", "right": 0, "left": 25, "height": 60, "fontSize": 40, "font": "Microsoft YaHei", "color": "#ffffff", "bottom": 0, "alpha": 1, "align": "center" }, "compId": 26 }, { "type": "Image", "props": { "y": 4, "x": 60, "width": 45, "skin": "gameui/flowerlock/rongliang.png", "height": 48 }, "compId": 27 }, { "type": "Box", "props": { "name": "item" }, "compId": 33 }] }] }] }, { "type": "Box", "props": { "y": 93, "x": 309, "width": 115, "name": "Box", "height": 108 }, "compId": 34 }, { "type": "Image", "props": { "skin": "gameui/flowerstate/chuangzuobg.png", "sizeGrid": "28,41,18,38", "name": "fen", "centerX": 0, "bottom": 145 }, "compId": 39, "child": [{ "type": "Image", "props": { "y": 19.5, "x": 19, "var": "curfen", "skin": "gameui/flowerstate/potquality7.png" }, "compId": 40 }, { "type": "ProgressBar", "props": { "x": 252, "var": "diyeva", "skin": "gameui/flowerstate/fen.png", "sizeGrid": "0,18,0,18", "pivotY": 15, "pivotX": 139, "centerY": -3 }, "compId": 36, "child": [{ "type": "Image", "props": { "width": 56, "var": "second", "skin": "gameui/flowerstate/potquality3.png", "height": 54, "centerY": 0, "centerX": 0 }, "compId": 37 }, { "type": "Image", "props": { "x": 320, "width": 54, "var": "trird", "skin": "gameui/flowerstate/potquality7.png", "height": 52, "centerY": 0 }, "compId": 38 }] }] }], "loadList": ["gameui/list/lan.png", "gameui/list/kai.png", "gameui/list/di.png", "gameui/icon-1.png", "gameui/img-muban1.png", "gameui/btn-zuoanniu1.png", "gameui/btn-youanniu1.png", "gameui/btn-shijiao.png", "gameui/img-muban2.png", "gameui/btn-fanhuianniu.png", "gameui/btn-wanchenganniu1.png", "gameui/flowerlock/rongliang.png", "gameui/flowerstate/chuangzuobg.png", "gameui/flowerstate/potquality7.png", "gameui/flowerstate/fen.png", "gameui/flowerstate/potquality3.png"], "loadList3D": [] };
            view.DiySceneUI = DiySceneUI;
            REG("ui.view.DiySceneUI", DiySceneUI);
            class DiyToolSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(DiyToolSceneUI.uiView);
                }
            }
            DiyToolSceneUI.uiView = { "type": "Scene", "props": { "width": 640, "mouseThrough": true, "height": 1136 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 640, "top": 660, "right": 0, "left": 0, "height": 356 }, "compId": 41, "child": [{ "type": "Button", "props": { "x": 40, "var": "left_btn", "stateNum": 1, "skin": "gameui/btn-zuozhuan.png", "name": "", "left": 40, "bottom": 282 }, "compId": 6 }, { "type": "Button", "props": { "x": 521, "var": "right_btn", "stateNum": 1, "skin": "gameui/btn-youzhuan.png", "rotation": 0, "right": 40, "pivotY": 0, "pivotX": 0, "name": "", "bottom": 282 }, "compId": 7 }, { "type": "Button", "props": { "y": 894, "x": 220, "var": "cancel", "stateNum": 1, "skin": "gameui/btn-chazi.png", "name": "", "left": 220, "bottom": 182 }, "compId": 28 }, { "type": "Button", "props": { "x": 360, "var": "save", "stateNum": 1, "skin": "gameui/btn-duigou.png", "right": 220, "name": "save", "bottom": 183 }, "compId": 29 }] }, { "type": "Image", "props": { "width": 49, "visible": true, "var": "scrollImg", "top": 320, "skin": "gameui/dikkk.png", "sizeGrid": "47,17,43,14", "left": 50, "height": 304 }, "compId": 22, "child": [{ "type": "VScrollBar", "props": { "y": 3, "x": 3, "width": 43, "var": "scrollbar", "value": 0, "skin": "comp/img-xietiao.png", "sizeGrid": "0,0,0,0", "scrollSize": 1, "height": 297 }, "compId": 37 }, { "type": "Button", "props": { "width": 56, "visible": false, "var": "big", "top": 18, "stateNum": 1, "skin": "gameui/btn-fangda.png", "left": 3, "height": 56 }, "compId": 8 }, { "type": "Button", "props": { "width": 56, "visible": false, "var": "little", "top": 263, "stateNum": 1, "skin": "gameui/btn-suoxiao.png", "left": 3, "height": 56 }, "compId": 10 }] }], "loadList": ["gameui/btn-zuozhuan.png", "gameui/btn-youzhuan.png", "gameui/btn-chazi.png", "gameui/btn-duigou.png", "gameui/dikkk.png", "comp/img-xietiao.png", "gameui/btn-fangda.png", "gameui/btn-suoxiao.png"], "loadList3D": [] };
            view.DiyToolSceneUI = DiyToolSceneUI;
            REG("ui.view.DiyToolSceneUI", DiyToolSceneUI);
            class DiyToolScene1UI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(DiyToolScene1UI.uiView);
                }
            }
            DiyToolScene1UI.uiView = { "type": "Scene", "props": { "y": 175, "x": 200, "width": 400, "scaleX": 1, "pivotY": 175, "pivotX": 200, "mouseThrough": true, "height": 350 }, "compId": 2, "child": [{ "type": "Button", "props": { "var": "left", "stateNum": 1, "skin": "gameui/btn-zuozhuan.png", "left": 40, "bottom": 100 }, "compId": 6 }, { "type": "Button", "props": { "var": "right", "stateNum": 1, "skin": "gameui/btn-youzhuan.png", "rotation": 0, "right": 40, "pivotY": 0, "pivotX": 0, "bottom": 100 }, "compId": 7 }, { "type": "Image", "props": { "width": 62, "top": 0, "skin": "gameui/img-heituo.png", "left": 70, "height": 204 }, "compId": 22, "child": [{ "type": "ProgressBar", "props": { "width": 57, "visible": true, "var": "probar", "value": 1, "top": 131, "skin": "comp/img-xietiao.png", "sizeGrid": "0,0,0,0", "scaleY": 1, "scaleX": 1, "rotation": -90, "left": 17, "height": 28 }, "compId": 11 }, { "type": "Button", "props": { "width": 56, "var": "big", "top": 21, "stateNum": 1, "skin": "gameui/btn-fangda.png", "left": 3, "height": 56 }, "compId": 8 }, { "type": "Button", "props": { "width": 56, "var": "little", "top": 131, "stateNum": 1, "skin": "gameui/btn-suoxiao.png", "left": 3, "height": 56 }, "compId": 10 }] }, { "type": "Button", "props": { "var": "cancel", "stateNum": 1, "skin": "gameui/btn-chazi.png", "right": 220, "bottom": 0 }, "compId": 28 }, { "type": "Button", "props": { "var": "save", "stateNum": 1, "skin": "gameui/btn-duigou.png", "left": 220, "bottom": 0 }, "compId": 29 }], "loadList": ["gameui/btn-zuozhuan.png", "gameui/btn-youzhuan.png", "gameui/img-heituo.png", "comp/img-xietiao.png", "gameui/btn-fangda.png", "gameui/btn-suoxiao.png", "gameui/btn-chazi.png", "gameui/btn-duigou.png"], "loadList3D": [] };
            view.DiyToolScene1UI = DiyToolScene1UI;
            REG("ui.view.DiyToolScene1UI", DiyToolScene1UI);
            class GatherViewUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("view/GatherView");
                }
            }
            view.GatherViewUI = GatherViewUI;
            REG("ui.view.GatherViewUI", GatherViewUI);
            class HandBookViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(HandBookViewUI.uiView);
                }
            }
            HandBookViewUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "width": 547, "skin": "gameui/handbook/namebg.png", "sizeGrid": "155,153,115,124", "name": "bg", "height": 810, "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 29, "x": 196, "skin": "gameui/handbook/name.png" }, "compId": 30 }, { "type": "Label", "props": { "y": 112, "x": 109, "width": 329, "var": "dec", "valign": "middle", "text": "多肉", "height": 34, "fontSize": 20, "font": "Microsoft YaHei", "color": "#b0792b", "align": "center" }, "compId": 32 }, { "type": "Button", "props": { "y": 24, "x": 447, "width": 69, "var": "btn_close", "stateNum": 1, "skin": "gameui/close.png", "height": 69 }, "compId": 31 }, { "type": "List", "props": { "width": 484, "var": "itemlist", "top": 159, "spaceY": 10, "spaceX": -5, "repeatX": 4, "height": 493, "centerX": 0 }, "compId": 5, "child": [{ "type": "Box", "props": { "y": 0, "x": 43, "width": 106, "renderType": "render", "height": 114 }, "compId": 23, "child": [{ "type": "Image", "props": { "y": 0, "x": -34, "width": 469, "visible": false, "skin": "gameui/handbook/bg.png", "name": "bg", "height": 114 }, "compId": 24 }, { "type": "Image", "props": { "y": 8, "x": 11, "width": 84, "skin": "gameui/icon-1.png", "name": "good_pic", "height": 84 }, "compId": 25 }, { "type": "Label", "props": { "y": 68, "x": 67, "visible": false, "text": "99", "strokeColor": "#883d0f", "stroke": 2, "name": "good_num", "fontSize": 22, "color": "#ffffff" }, "compId": 33 }, { "type": "Box", "props": { "y": 68, "x": 65, "width": 30, "name": "boxnum", "height": 24 }, "compId": 34 }, { "type": "Label", "props": { "y": 89, "x": -11, "width": 128, "valign": "bottom", "text": "一个多肉", "name": "label_name", "height": 25, "fontSize": 18, "font": "Microsoft YaHei", "color": "#b0792b", "align": "center" }, "compId": 28 }] }] }, { "type": "Box", "props": { "width": 516, "var": "tabs", "height": 100, "centerX": 0, "bottom": 24 }, "compId": 18, "child": [{ "type": "Button", "props": { "y": 0, "x": 53, "var": "btn0", "stateNum": 1, "skin": "gameui/handbook/tab0_1.png" }, "compId": 19 }, { "type": "Button", "props": { "y": -1, "x": 311, "var": "btn1", "stateNum": 1, "skin": "gameui/handbook/tab0_1.png" }, "compId": 21 }, { "type": "Button", "props": { "y": -1, "x": 182, "var": "btn2", "stateNum": 1, "skin": "gameui/handbook/tab0_1.png" }, "compId": 20 }, { "type": "Button", "props": { "y": 0, "x": 387, "visible": false, "var": "btn3", "stateNum": 1, "skin": "gameui/handbook/tab0_1.png" }, "compId": 22 }] }] }], "loadList": ["gameui/handbook/namebg.png", "gameui/handbook/name.png", "gameui/close.png", "gameui/handbook/bg.png", "gameui/icon-1.png", "gameui/handbook/tab0_1.png"], "loadList3D": [] };
            view.HandBookViewUI = HandBookViewUI;
            REG("ui.view.HandBookViewUI", HandBookViewUI);
            class LoadingSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LoadingSceneUI.uiView);
                }
            }
            LoadingSceneUI.uiView = { "type": "Scene", "props": { "width": 640, "top": 0, "right": 0, "left": 0, "height": 1136, "bottom": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "gameui/loading.jpg", "right": 0, "left": 0, "bottom": 0 }, "compId": 25 }, { "type": "Box", "props": { "zOrder": 3, "visible": false, "right": 0, "left": 0, "centerY": -84, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24, "child": [{ "type": "Box", "props": { "zOrder": 2, "y": 448, "x": 375, "scaleY": 0.5, "scaleX": 0.5, "centerX": 0, "anchorX": 0.5 }, "compId": 4, "child": [{ "type": "Text", "props": { "y": 0, "x": 0, "width": 80, "text": "L", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 3 }, { "type": "Text", "props": { "y": 0, "x": 70, "width": 80, "text": "o", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 12 }, { "type": "Text", "props": { "y": 0, "x": 150, "width": 80, "text": "a", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 13 }, { "type": "Text", "props": { "y": 0, "x": 220, "width": 80, "text": "d", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 14 }, { "type": "Text", "props": { "y": 0, "x": 290, "width": 80, "text": "i", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 15 }, { "type": "Text", "props": { "y": 0, "x": 360, "width": 80, "text": "n", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 16 }, { "type": "Text", "props": { "y": 0, "x": 440, "width": 80, "text": "g", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 17 }, { "type": "Text", "props": { "y": 0, "x": 520, "width": 80, "text": "．", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 18 }, { "type": "Text", "props": { "y": 0, "x": 560, "width": 80, "text": "．", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 21 }, { "type": "Text", "props": { "y": 0, "x": 600, "width": 80, "text": "．", "height": 155, "fontSize": 130, "font": "Microsoft YaHei", "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 22 }] }, { "type": "Image", "props": { "y": 0, "x": 375, "width": 643, "skin": "gameui/img-hua.png", "scaleY": 0.4, "scaleX": 0.4, "height": 1135, "centerX": 0, "anchorX": 0.5 }, "compId": 23 }] }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 10 }] } }, { "target": 12, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 5 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 15 }] } }, { "target": 13, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 10 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 20 }] } }, { "target": 14, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 15 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 25 }] } }, { "target": 15, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 20 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 25 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 30 }] } }, { "target": 16, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 25 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 30 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 35 }] } }, { "target": 17, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 30 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 35 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 40 }] } }, { "target": 18, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 35 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 40 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 45 }] } }, { "target": 21, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 40 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 45 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 50 }] } }, { "target": 22, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 45 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 50 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 55 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 60 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 70 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["gameui/loading.jpg", "gameui/img-hua.png"], "loadList3D": [] };
            view.LoadingSceneUI = LoadingSceneUI;
            REG("ui.view.LoadingSceneUI", LoadingSceneUI);
            class LoadingScene1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LoadingScene1UI.uiView);
                }
            }
            LoadingScene1UI.uiView = { "type": "View", "props": { "y": 0, "x": 0, "width": 0, "top": 0, "right": 0, "left": 0, "height": 0, "bottom": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "gameui/loading.jpg", "right": 0, "left": 0, "bottom": 0 }, "compId": 25 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 10 }] } }, { "target": 12, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 5 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 12, "key": "y", "index": 15 }] } }, { "target": 13, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 10 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 13, "key": "y", "index": 20 }] } }, { "target": 14, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 15 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 25 }] } }, { "target": 15, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 20 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 25 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 15, "key": "y", "index": 30 }] } }, { "target": 16, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 25 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 30 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 16, "key": "y", "index": 35 }] } }, { "target": 17, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 30 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 35 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 17, "key": "y", "index": 40 }] } }, { "target": 18, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 35 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 40 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 18, "key": "y", "index": 45 }] } }, { "target": 21, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 40 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 45 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 21, "key": "y", "index": 50 }] } }, { "target": 22, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 5 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 45 }, { "value": -50, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 50 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 55 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 60 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 22, "key": "y", "index": 70 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["gameui/loading.jpg"], "loadList3D": [] };
            view.LoadingScene1UI = LoadingScene1UI;
            REG("ui.view.LoadingScene1UI", LoadingScene1UI);
            class PottedListUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(PottedListUI.uiView);
                }
            }
            PottedListUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": -1, "skin": "gameui/img-heidi.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 10 }, { "type": "Image", "props": { "width": 540, "skin": "gameui/img_chekedPotted_di.png", "sizeGrid": "169,84,111,87", "height": 940, "centerY": 0, "centerX": 0 }, "compId": 12, "child": [{ "type": "Sprite", "props": { "y": 40, "x": 172, "texture": "gameui/poteedName.png" }, "compId": 15 }, { "type": "List", "props": { "width": 441, "var": "pottedList", "top": 151, "spaceY": 40, "repeatY": 3, "repeatX": 1, "left": 47, "bottom": 98 }, "compId": 3, "child": [{ "type": "Box", "props": { "y": 36, "x": -13, "width": 466, "renderType": "render", "height": 230 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "x": -1, "width": 467, "skin": "gameui/zhuangshi.png", "height": 150 }, "compId": 19 }, { "type": "Image", "props": { "y": -30, "x": 74, "width": 317, "skin": "gameui/iconpen-1.png", "name": "pottedItem", "height": 210 }, "compId": 5 }] }] }, { "type": "Button", "props": { "y": 35, "x": 423, "visible": false, "var": "btn_close", "stateNum": 1, "skin": "gameui/close.png" }, "compId": 17 }] }], "loadList": ["gameui/img-heidi.png", "gameui/img_chekedPotted_di.png", "gameui/poteedName.png", "gameui/zhuangshi.png", "gameui/iconpen-1.png", "gameui/close.png"], "loadList3D": [] };
            view.PottedListUI = PottedListUI;
            REG("ui.view.PottedListUI", PottedListUI);
            class StaffCommonViewUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("view/StaffCommonView");
                }
            }
            view.StaffCommonViewUI = StaffCommonViewUI;
            REG("ui.view.StaffCommonViewUI", StaffCommonViewUI);
            class StaffTimeViewUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("view/StaffTimeView");
                }
            }
            view.StaffTimeViewUI = StaffTimeViewUI;
            REG("ui.view.StaffTimeViewUI", StaffTimeViewUI);
            class StaffViewUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("view/StaffView");
                }
            }
            view.StaffViewUI = StaffViewUI;
            REG("ui.view.StaffViewUI", StaffViewUI);
            class SwitchSceneUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SwitchSceneUI.uiView);
                }
            }
            SwitchSceneUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Button", "props": { "y": 568, "x": 64, "width": 128, "var": "leftbt", "stateNum": 2, "skin": "gameui/arrowL.png", "rotation": 0, "pivotY": 64, "pivotX": 64, "left": 0, "height": 128, "centerY": 0 }, "compId": 3 }, { "type": "Button", "props": { "y": 568, "x": 576, "width": 128, "var": "rightbt", "stateNum": 2, "skin": "gameui/arrowR.png", "right": 0, "pivotY": 64, "pivotX": 64, "height": 128, "centerY": 0 }, "compId": 4 }, { "type": "Box", "props": { "y": 128, "x": 561, "width": 322, "visible": true, "var": "hand_left", "pivotX": 322, "height": 480 }, "compId": 13, "child": [{ "type": "Sprite", "props": { "y": 282, "x": 59, "texture": "gameui/hand.png", "rotation": 0 }, "compId": 14 }, { "type": "Image", "props": { "y": 423, "x": 149, "skin": "gameui/arrow_01.png" }, "compId": 15 }] }, { "type": "Box", "props": { "y": 128, "x": 356, "width": 322, "var": "hand_right", "pivotX": 322, "height": 480 }, "compId": 19, "child": [{ "type": "Sprite", "props": { "y": 328, "x": 49, "texture": "gameui/hand.png", "pivotY": 0, "pivotX": 0 }, "compId": 20 }, { "type": "Image", "props": { "y": 452, "x": 236, "skin": "gameui/arrow_01.png", "rotation": 180, "pivotY": 29, "pivotX": 87 }, "compId": 21 }] }, { "type": "Button", "props": { "y": 1037, "x": 0, "width": 221, "var": "exitView", "skin": "comp/button.png", "labelSize": 50, "label": "退出浏览", "height": 99, "bottom": 0 }, "compId": 22 }], "animations": [{ "nodes": [{ "target": 20, "keyframes": { "y": [{ "value": 328, "tweenMethod": "linearNone", "tween": true, "target": 20, "key": "y", "index": 0 }, { "value": 331, "tweenMethod": "linearNone", "tween": true, "target": 20, "key": "y", "index": 20 }, { "value": 331, "tweenMethod": "linearNone", "tween": true, "target": 20, "key": "y", "index": 30 }], "x": [{ "value": 48, "tweenMethod": "linearNone", "tween": true, "target": 20, "key": "x", "index": 0 }, { "value": 169.5, "tweenMethod": "linearNone", "tween": true, "target": 20, "key": "x", "index": 20 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }, { "nodes": [{ "target": 14, "keyframes": { "y": [{ "value": 290, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 0 }, { "value": 290, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 20 }, { "value": 290, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "y", "index": 30 }], "x": [{ "value": 169, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "x", "index": 0 }, { "value": 49, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "x", "index": 20 }, { "value": 48, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "x", "index": 30 }] } }], "name": "ani1_0", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["gameui/arrowL.png", "gameui/arrowR.png", "gameui/hand.png", "gameui/arrow_01.png", "comp/button.png"], "loadList3D": [] };
            view.SwitchSceneUI = SwitchSceneUI;
            REG("ui.view.SwitchSceneUI", SwitchSceneUI);
            class TesttttUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TesttttUI.uiView);
                }
            }
            TesttttUI.uiView = { "type": "Dialog", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Button", "props": { "var": "werrer", "skin": "comp/button.png", "label": "label", "centerY": 0.5 }, "compId": 3 }], "loadList": ["comp/button.png"], "loadList3D": [] };
            view.TesttttUI = TesttttUI;
            REG("ui.view.TesttttUI", TesttttUI);
            class UnLockViewUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("view/UnLockView");
                }
            }
            view.UnLockViewUI = UnLockViewUI;
            REG("ui.view.UnLockViewUI", UnLockViewUI);
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var common;
            (function (common) {
                class commonTipUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(commonTipUI.uiView);
                    }
                }
                commonTipUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 512, "x": 45, "texture": "gameui/main/t.png" }, "compId": 3 }, { "type": "Label", "props": { "y": 529, "x": 21, "wordWrap": true, "width": 318, "var": "content", "valign": "middle", "text": "SDK发货阿萨德发空间暗红色的发", "strokeColor": "#0b2548", "stroke": 2, "pivotY": -16, "pivotX": -132, "height": 47, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center" }, "compId": 4 }, { "type": "Label", "props": { "var": "title", "text": "label" }, "compId": 5 }], "loadList": ["gameui/main/t.png"], "loadList3D": [] };
                common.commonTipUI = commonTipUI;
                REG("ui.view.common.commonTipUI", commonTipUI);
                class ContentTipUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(ContentTipUI.uiView);
                    }
                }
                ContentTipUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "loadList": [], "loadList3D": [] };
                common.ContentTipUI = ContentTipUI;
                REG("ui.view.common.ContentTipUI", ContentTipUI);
                class GuideBubViewUI extends Laya.View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(GuideBubViewUI.uiView);
                    }
                }
                GuideBubViewUI.uiView = { "type": "View", "props": { "width": 300, "height": 200 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 365, "var": "bg", "skin": "gameui/guide/bubbg.png", "sizeGrid": "20,29,34,49", "name": "bg", "height": 209 }, "compId": 3 }, { "type": "Label", "props": { "y": 24, "x": 21.5, "width": 322, "var": "dec", "text": "label", "height": 136, "fontSize": 18, "font": "Microsoft YaHei" }, "compId": 4 }], "loadList": ["gameui/guide/bubbg.png"], "loadList3D": [] };
                common.GuideBubViewUI = GuideBubViewUI;
                REG("ui.view.common.GuideBubViewUI", GuideBubViewUI);
                class ItemInfoViewUI extends Laya.View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(ItemInfoViewUI.uiView);
                    }
                }
                ItemInfoViewUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "bg", "top": 0, "skin": "common/touming.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 18 }, { "type": "Image", "props": { "width": 450, "skin": "gameui/flowerstate/tishi02.png", "sizeGrid": "31,35,35,34", "name": "content", "height": 386, "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 2, "x": 172, "skin": "common/tip.png", "centerX": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 11, "x": 69, "skin": "common/dec.png" }, "compId": 21 }] }, { "type": "Image", "props": { "y": 86.5, "x": 54.5, "width": 116, "skin": "gameui/handbook/bg1.png", "height": 116 }, "compId": 10 }, { "type": "Image", "props": { "y": 107, "x": 75, "width": 74, "var": "good_pic", "skin": "gameui/icon-1.png", "height": 74 }, "compId": 11 }, { "type": "Image", "props": { "y": 75, "x": 181.5, "width": 231, "var": "decbg", "skin": "gameui/staffcommon/bg.png", "sizeGrid": "20,20,20,20", "height": 139 }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 9, "x": 10, "wordWrap": true, "width": 168, "var": "itemname", "valign": "middle", "text": "大家啊东方海外无法卡萨丁发斯蒂芬卡萨丁福利卡士大夫sadf", "padding": "12,12,12,12", "overflow": "hidden", "leading": 10, "height": 34, "fontSize": 20, "font": "Microsoft YaHei", "color": "#245d9d", "align": "left" }, "compId": 16 }, { "type": "Label", "props": { "y": 51, "x": 10, "wordWrap": true, "width": 215, "var": "dec", "valign": "middle", "text": "大家啊东方海外无法卡萨丁发斯蒂芬卡萨丁福利卡士大夫sadf", "padding": "12,12,12,12", "overflow": "hidden", "leading": 10, "height": 71, "fontSize": 18, "font": "Microsoft YaHei", "color": "#245d9d", "align": "left" }, "compId": 14 }] }, { "type": "Image", "props": { "y": 235.5, "x": 182.5, "width": 230, "var": "condi", "skin": "gameui/zs/num_bg.png", "sizeGrid": "10,34,10,33", "height": 42 }, "compId": 23, "child": [{ "type": "Image", "props": { "y": 2, "x": 44, "skin": "gameui/unlock.png" }, "compId": 25 }, { "type": "Label", "props": { "y": 2, "x": 97, "width": 114, "var": "condivalue", "valign": "middle", "text": "999999", "height": 42, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff", "align": "left" }, "compId": 26 }] }, { "type": "Image", "props": { "y": 291, "x": 182, "width": 230, "var": "money", "skin": "gameui/zs/num_bg.png", "sizeGrid": "10,34,10,33", "height": 42 }, "compId": 24, "child": [{ "type": "Image", "props": { "y": 3, "x": 47, "width": 34, "skin": "common/img_gold.png", "height": 36 }, "compId": 27 }, { "type": "Label", "props": { "y": 2, "x": 97, "width": 114, "var": "moneydec", "valign": "middle", "text": "999999", "height": 42, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff", "align": "left" }, "compId": 28 }] }, { "type": "Button", "props": { "y": 243, "x": 78, "width": 69, "var": "btn_share", "stateNum": 1, "skin": "gameui/handbook/share.png", "height": 69 }, "compId": 17 }] }, { "type": "Button", "props": { "y": 383, "x": 478, "width": 55, "var": "btn_click", "stateNum": 1, "skin": "common/close.png", "height": 55 }, "compId": 15 }], "loadList": ["common/touming.png", "gameui/flowerstate/tishi02.png", "common/tip.png", "common/dec.png", "gameui/handbook/bg1.png", "gameui/icon-1.png", "gameui/staffcommon/bg.png", "gameui/zs/num_bg.png", "gameui/unlock.png", "common/img_gold.png", "gameui/handbook/share.png", "common/close.png"], "loadList3D": [] };
                common.ItemInfoViewUI = ItemInfoViewUI;
                REG("ui.view.common.ItemInfoViewUI", ItemInfoViewUI);
                class StaffInfoUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(StaffInfoUI.uiView);
                    }
                }
                StaffInfoUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "bg", "top": 0, "skin": "common/touming.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 12 }, { "type": "Image", "props": { "width": 442, "var": "content", "skin": "common/tipbg.png", "sizeGrid": "33,33,38,35", "height": 239, "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": -9.5, "skin": "gameui/flowerstate/tishi01.png", "centerX": 0 }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 6, "x": -6.5, "wordWrap": false, "width": 215, "var": "itemname", "valign": "middle", "text": "多肉描述", "strokeColor": "#090765", "stroke": 2, "padding": "12,12,12,12", "overflow": "hidden", "leading": 10, "height": 45, "fontSize": 25, "font": "Microsoft YaHei", "color": "#fdfdfd", "align": "center" }, "compId": 9 }] }, { "type": "Box", "props": { "y": 69, "x": 35, "width": 91, "var": "icon", "renderType": "render", "height": 114 }, "compId": 5, "child": [{ "type": "Image", "props": { "y": 22, "x": 0, "skin": "gameui/staffcommon/goodbg.png" }, "compId": 14 }, { "type": "Image", "props": { "y": 27, "x": 5, "width": 74, "var": "good_pic", "skin": "gameui/icon-1.png", "height": 74 }, "compId": 6 }, { "type": "Box", "props": { "y": 84, "x": 48, "width": 31, "var": "good_num", "height": 23 }, "compId": 16 }] }, { "type": "Image", "props": { "y": 69, "x": 126, "width": 280, "var": "decbg", "skin": "gameui/staffcommon/bg.png", "sizeGrid": "20,20,20,20", "height": 137 }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "wordWrap": true, "width": 277, "var": "dec", "valign": "middle", "text": "大家啊东方海外无法卡萨丁发斯蒂芬卡萨丁福利卡士大夫sadf", "padding": "12,12,12,12", "overflow": "hidden", "leading": 10, "height": 138, "fontSize": 20, "font": "Microsoft YaHei", "color": "#245d9d", "align": "center" }, "compId": 4 }] }, { "type": "Button", "props": { "y": 0, "x": 371.5, "width": 69, "var": "btn_click", "stateNum": 1, "skin": "common/close.png", "height": 69 }, "compId": 8 }] }], "loadList": ["common/touming.png", "common/tipbg.png", "gameui/flowerstate/tishi01.png", "gameui/staffcommon/goodbg.png", "gameui/icon-1.png", "gameui/staffcommon/bg.png", "common/close.png"], "loadList3D": [] };
                common.StaffInfoUI = StaffInfoUI;
                REG("ui.view.common.StaffInfoUI", StaffInfoUI);
                class TipViewSceneUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(TipViewSceneUI.uiView);
                    }
                }
                TipViewSceneUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 512, "x": 45, "skin": "gameui/main/t.png", "sizeGrid": "0,0,0,0", "gray": false }, "compId": 3, "child": [{ "type": "Button", "props": { "y": 126, "var": "tBtn", "stateNum": 1, "skin": "gameui/btn-duigou.png", "right": 131, "labelSize": 24, "labelFont": "Microsoft YaHei", "labelBold": true }, "compId": 5 }, { "type": "Button", "props": { "y": 126, "var": "cBtn", "stateNum": 1, "skin": "gameui/btn-chazi.png", "left": 122, "labelSize": 24, "labelFont": "Microsoft YaHei", "labelBold": true }, "compId": 7 }, { "type": "Label", "props": { "y": -4, "x": 115, "width": 318, "var": "title", "valign": "middle", "text": "标题", "strokeColor": "#0b2548", "stroke": 2, "height": 32, "fontSize": 25, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 10 }, { "type": "Label", "props": { "y": 17, "x": -24, "wordWrap": true, "width": 318, "var": "content", "valign": "middle", "text": "百草屋2级解锁", "pivotY": -16, "pivotX": -132, "height": 47, "fontSize": 22, "font": "Microsoft YaHei", "color": "#232121", "align": "center" }, "compId": 12 }] }], "loadList": ["gameui/main/t.png", "gameui/btn-duigou.png", "gameui/btn-chazi.png"], "loadList3D": [] };
                common.TipViewSceneUI = TipViewSceneUI;
                REG("ui.view.common.TipViewSceneUI", TipViewSceneUI);
            })(common = view.common || (view.common = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var decorate;
            (function (decorate) {
                class decorateUIUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(decorateUIUI.uiView);
                    }
                }
                decorateUIUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 79 }, { "type": "Image", "props": { "width": 610, "top": 104, "skin": "gameui/img_chekedPotted_di.png", "sizeGrid": "169,63,132,107", "left": 15, "height": 930 }, "compId": 19, "child": [{ "type": "Sprite", "props": { "y": 38, "x": 170, "texture": "gameui/zs/title.png" }, "compId": 48 }] }, { "type": "Box", "props": { "y": 254, "x": 39, "top": 254, "scaleX": 1 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "x": 9, "width": 542, "skin": "gameui/zs/bg_db.png", "sizeGrid": "0,0,0,0", "height": 289 }, "compId": 5 }, { "type": "Button", "props": { "y": 69, "x": 387, "width": 154, "var": "btn_up_level", "stateNum": 1, "skin": "gameui/zs/up_btn.png", "labelSize": 30, "height": 95 }, "compId": 10 }, { "type": "Image", "props": { "y": 55, "x": 35, "width": 114, "var": "decorate_img", "skin": "gameui/zs/装饰台01.png", "height": 76 }, "compId": 23 }, { "type": "Button", "props": { "y": -116, "x": 475, "var": "btn_close", "stateNum": 1, "skin": "gameui/close.png" }, "compId": 47 }, { "type": "Image", "props": { "y": 132.5, "x": 43, "skin": "gameui/zs/sign_lv.png" }, "compId": 50 }, { "type": "Label", "props": { "y": 134, "x": 46, "width": 90, "var": "label_level", "valign": "middle", "text": "1级", "padding": "5", "height": 30, "fontSize": 20, "font": "Microsoft YaHei", "color": "#925f16", "bold": false, "align": "center" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 93.5, "x": 181.5, "width": 35, "texture": "gameui/zs/jiantou.png", "height": 44 }, "compId": 51 }, { "type": "Label", "props": { "y": 88, "x": 220, "wordWrap": true, "width": 167, "var": "miaoshu", "valign": "middle", "text": "吸引力提升，解锁装饰，增加评星", "padding": "5", "leading": 3, "height": 58, "fontSize": 20, "font": "Microsoft YaHei", "color": "#925f16", "bold": false, "align": "center" }, "compId": 52 }, { "type": "Label", "props": { "y": 183, "wordWrap": true, "width": 515, "var": "tipContent", "valign": "middle", "padding": "5", "left": 22, "leading": 3, "height": 81, "fontSize": 20, "font": "Microsoft YaHei", "color": "#925f16", "bold": false, "align": "center" }, "compId": 53 }, { "type": "ProgressBar", "props": { "y": 13, "x": 173, "width": 369, "var": "pro_value", "skin": "gameui/zs/progress.png", "height": 51 }, "compId": 83 }, { "type": "Box", "props": { "y": 183, "x": 22, "width": 516, "height": 82 }, "compId": 105, "child": [{ "type": "HTMLDivElement", "props": { "y": 0, "x": 0, "width": 107, "var": "htmlText", "innerHTML": "htmlText", "height": 32, "runtime": "laya.html.dom.HTMLDivElement" }, "compId": 80 }] }, { "type": "Box", "props": { "y": 20, "x": 179, "width": 169, "height": 34 }, "compId": 109, "child": [{ "type": "Label", "props": { "width": 139, "var": "value_gold1", "valign": "middle", "top": 3, "text": "9", "right": 30, "padding": "5", "height": 31, "fontSize": 24, "font": "Microsoft YaHei", "color": "#fff", "bold": true, "align": "right" }, "compId": 102 }, { "type": "Image", "props": { "width": 24, "top": 5, "skin": "gameui/main/img_gold.png", "right": 5, "height": 26 }, "compId": 108 }] }, { "type": "Box", "props": { "y": 20, "x": 363, "height": 34 }, "compId": 110, "child": [{ "type": "Label", "props": { "var": "value_gold2", "valign": "middle", "top": 3, "text": "10", "padding": "5", "left": 3, "height": 31, "fontSize": 24, "font": "Microsoft YaHei", "color": "#fff", "bold": true, "align": "left" }, "compId": 111, "child": [{ "type": "Image", "props": { "width": 24, "top": 3, "skin": "gameui/main/img_gold.png", "right": -25, "height": 26 }, "compId": 112 }] }] }, { "type": "Label", "props": { "valign": "middle", "top": 22, "text": "/", "padding": "5", "left": 351, "height": 31, "fontSize": 24, "font": "Microsoft YaHei", "color": "#fff", "bold": true, "align": "left" }, "compId": 114 }] }, { "type": "Box", "props": { "y": 592, "width": 558, "left": 41, "height": 432 }, "compId": 6, "child": [{ "type": "List", "props": { "y": 0, "x": 0, "width": 558, "var": "decorate_list_bg", "spaceY": 20, "spaceX": 0, "repeatX": 1, "height": 419 }, "compId": 73, "child": [{ "type": "Box", "props": { "y": 0, "x": 8, "renderType": "render" }, "compId": 74, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 541, "texture": "gameui/zs/d_item.png", "height": 132 }, "compId": 77 }] }] }, { "type": "List", "props": { "y": -2, "x": 0, "width": 558, "var": "decorate_list", "spaceY": 65, "spaceX": 3, "repeatX": 4, "height": 438 }, "compId": 12, "child": [{ "type": "Box", "props": { "y": 31, "x": 58, "renderType": "render" }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 59.5, "x": 54, "width": 60, "skin": "gameui/zs/img_use.png", "name": "sign_selected", "height": 27 }, "compId": 57 }, { "type": "Image", "props": { "y": -12.5, "x": 1, "width": 100, "skin": "gameui/zs/装饰05.png", "name": "decorate_item", "height": 100 }, "compId": 56 }, { "type": "Image", "props": { "y": 60, "x": 54, "width": 60, "visible": false, "skin": "gameui/zs/img_upLock.png", "name": "sign_uplock", "height": 27 }, "compId": 107 }] }] }] }, { "type": "Image", "props": { "y": 556, "x": 235, "width": 170, "skin": "gameui/zs/bbb.png" }, "compId": 117, "child": [{ "type": "Label", "props": { "y": 5, "x": 1, "width": 164, "var": "unLockNumber1", "valign": "middle", "text": "已解锁：50", "height": 24, "fontSize": 20, "color": "#b0792b", "align": "center" }, "compId": 115 }] }, { "type": "Label", "props": { "y": 339, "x": 454, "width": 100, "var": "unLockNumber2", "valign": "middle", "text": "90/90", "strokeColor": "#36be2c", "stroke": 1, "height": 24, "fontSize": 20, "color": "#9a9a9a", "align": "center" }, "compId": 116 }, { "type": "View", "props": { "var": "select_view", "top": 2, "right": 0, "left": 0, "bottom": 0 }, "compId": 25, "child": [{ "type": "Image", "props": { "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 26 }, { "type": "Image", "props": { "y": 398, "x": 80, "width": 480, "skin": "gameui/zs/title_bg.png", "sizeGrid": "80,184,54,188", "height": 360 }, "compId": 28, "child": [{ "type": "Sprite", "props": { "y": 14, "x": 201, "texture": "gameui/zs/tip.png" }, "compId": 96 }] }, { "type": "Image", "props": { "width": 109, "top": 502, "skin": "gameui/zs/item_bg.png", "left": 265, "height": 109 }, "compId": 85 }, { "type": "Image", "props": { "y": 496.5, "x": 262, "skin": "gameui/hyzs_02.png", "name": "item" }, "compId": 31 }, { "type": "Button", "props": { "y": 638, "x": 255, "width": 129, "stateNum": 1, "skin": "gameui/zs/btn_use.png", "name": "selected", "labelSize": 20, "labelFont": "Microsoft YaHei", "labelBold": true, "height": 61 }, "compId": 33 }, { "type": "Button", "props": { "y": 412, "x": 484, "width": 65, "stateNum": 1, "skin": "gameui/close.png", "name": "tip_close", "height": 65 }, "compId": 101 }] }, { "type": "View", "props": { "visible": false, "var": "need_view", "top": 1, "right": 0, "left": 0, "bottom": 0 }, "compId": 34, "child": [{ "type": "Image", "props": { "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 35 }, { "type": "Image", "props": { "y": 387, "x": 80, "width": 480, "skin": "gameui/zs/title_bg.png", "sizeGrid": "80,184,54,188", "height": 360 }, "compId": 86, "child": [{ "type": "Sprite", "props": { "y": 14, "x": 201, "texture": "gameui/zs/tip.png" }, "compId": 95 }] }, { "type": "Image", "props": { "width": 109, "top": 493, "skin": "gameui/zs/item_bg.png", "left": 135, "height": 109 }, "compId": 87 }, { "type": "Image", "props": { "y": 497, "x": 139.5, "width": 100, "skin": "gameui/zs/zs1.png", "name": "item", "height": 100 }, "compId": 37 }, { "type": "Button", "props": { "y": 644, "x": 260, "width": 129, "stateNum": 1, "skin": "gameui/zs/btn_unLock.png", "name": "selected", "labelSize": 20, "labelFont": "Microsoft YaHei", "labelBold": true, "height": 61 }, "compId": 38 }, { "type": "Image", "props": { "y": 472, "x": 262, "width": 253, "skin": "gameui/zs/num_bg.png", "height": 44 }, "compId": 89 }, { "type": "Image", "props": { "y": 529, "x": 262, "width": 253, "skin": "gameui/zs/num_bg.png", "height": 44 }, "compId": 90 }, { "type": "Image", "props": { "y": 585, "x": 262, "width": 253, "skin": "gameui/zs/num_bg.png", "height": 44 }, "compId": 91 }, { "type": "Label", "props": { "y": 481, "x": 289, "valign": "middle", "text": "需要金币：", "fontSize": 24, "color": "#296ecd", "bold": true, "align": "center" }, "compId": 39 }, { "type": "Label", "props": { "y": 538, "x": 289, "valign": "middle", "text": "需要评星：", "fontSize": 24, "color": "#296ecd", "bold": true, "align": "center" }, "compId": 40 }, { "type": "Label", "props": { "y": 595, "x": 289, "width": 110, "valign": "middle", "text": "需要等级：", "height": 24, "fontSize": 24, "color": "#296ecd", "bold": true, "align": "center" }, "compId": 41 }, { "type": "Label", "props": { "y": 481, "x": 434, "width": 91, "valign": "middle", "text": "999", "name": "need_gold", "height": 24, "fontSize": 24, "color": "#fff", "bold": true, "align": "left" }, "compId": 92 }, { "type": "Label", "props": { "y": 538, "x": 434, "width": 76, "valign": "middle", "text": "555", "name": "need_star", "height": 24, "fontSize": 24, "color": "#ffffff", "bold": true, "align": "left" }, "compId": 93 }, { "type": "Label", "props": { "y": 595, "x": 434, "width": 84, "valign": "middle", "text": "99", "name": "need_lv", "height": 24, "fontSize": 24, "color": "#fff", "bold": true, "align": "left" }, "compId": 94 }, { "type": "Button", "props": { "y": 400, "x": 484, "width": 65, "stateNum": 1, "skin": "gameui/close.png", "name": "tip_close", "height": 65 }, "compId": 100 }] }], "loadList": ["gameui/img-heidi.png", "gameui/img_chekedPotted_di.png", "gameui/zs/title.png", "gameui/zs/bg_db.png", "gameui/zs/up_btn.png", "gameui/zs/装饰台01.png", "gameui/close.png", "gameui/zs/sign_lv.png", "gameui/zs/jiantou.png", "gameui/zs/progress.png", "gameui/main/img_gold.png", "gameui/zs/d_item.png", "gameui/zs/img_use.png", "gameui/zs/装饰05.png", "gameui/zs/img_upLock.png", "gameui/zs/bbb.png", "gameui/zs/title_bg.png", "gameui/zs/tip.png", "gameui/zs/item_bg.png", "gameui/hyzs_02.png", "gameui/zs/btn_use.png", "gameui/zs/zs1.png", "gameui/zs/btn_unLock.png", "gameui/zs/num_bg.png"], "loadList3D": [] };
                decorate.decorateUIUI = decorateUIUI;
                REG("ui.view.decorate.decorateUIUI", decorateUIUI);
            })(decorate = view.decorate || (view.decorate = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var Flowerpot;
            (function (Flowerpot) {
                class FlowerpotSelViewUI extends Laya.View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(FlowerpotSelViewUI.uiView);
                    }
                }
                FlowerpotSelViewUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 225, "x": 32, "width": 575, "skin": "gameui/img_chekedPotted_di.png", "sizeGrid": "169,84,111,87", "name": "content", "height": 662 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 46, "x": 175, "skin": "gameui/flowerlock/selhuapeng.png" }, "compId": 22 }, { "type": "List", "props": { "y": 139, "x": 41.5, "width": 496, "var": "potList", "spaceY": 25, "spaceX": -8, "repeatX": 3, "name": "potList", "height": 425 }, "compId": 3, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 155, "renderType": "render", "height": 130 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "gameui/flowerlock/seldi.png", "name": "img_bg" }, "compId": 18 }, { "type": "Image", "props": { "y": 11, "x": 47, "width": 104, "skin": "gameui/iconpen-1.png", "name": "img_pot", "height": 104 }, "compId": 7 }, { "type": "Label", "props": { "y": 104.5, "x": 71, "width": 79, "text": "容量: 6", "name": "la_volume", "height": 39, "fontSize": 22, "font": "Microsoft YaHei", "color": "#84480A" }, "compId": 6 }, { "type": "Image", "props": { "y": 100, "x": 44, "width": 26, "skin": "gameui/flowerlock/rongliang.png", "height": 28 }, "compId": 20 }, { "type": "Image", "props": { "y": 69.5, "x": 89, "skin": "gameui/flowerlock/lock.png", "name": "la_lockcon" }, "compId": 21 }, { "type": "Image", "props": { "y": 69, "x": 89, "skin": "gameui/lock.png", "name": "la_unlockcon" }, "compId": 23 }] }] }, { "type": "Button", "props": { "y": 30, "x": 486, "width": 60, "var": "closeBtn", "stateNum": 1, "skin": "gameui/close.png", "labelSize": 30, "height": 60 }, "compId": 15 }] }], "loadList": ["gameui/img_chekedPotted_di.png", "gameui/flowerlock/selhuapeng.png", "gameui/flowerlock/seldi.png", "gameui/iconpen-1.png", "gameui/flowerlock/rongliang.png", "gameui/flowerlock/lock.png", "gameui/lock.png", "gameui/close.png"], "loadList3D": [] };
                Flowerpot.FlowerpotSelViewUI = FlowerpotSelViewUI;
                REG("ui.view.Flowerpot.FlowerpotSelViewUI", FlowerpotSelViewUI);
                class FlowerpotStateViewUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("view/Flowerpot/FlowerpotStateView");
                    }
                }
                Flowerpot.FlowerpotStateViewUI = FlowerpotStateViewUI;
                REG("ui.view.Flowerpot.FlowerpotStateViewUI", FlowerpotStateViewUI);
                class FlowerpotTipsViewUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(FlowerpotTipsViewUI.uiView);
                    }
                }
                FlowerpotTipsViewUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 11 }, { "type": "Image", "props": { "width": 450, "skin": "gameui/flowerstate/tishi02.png", "sizeGrid": "39,46,55,45", "name": "Image", "height": 338, "centerY": 38, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": -5, "x": 124, "skin": "gameui/flowerstate/tishi01.png" }, "compId": 31 }, { "type": "Label", "props": { "y": 7.5, "x": 14.5, "width": 421, "var": "title", "valign": "middle", "text": "标题大厦", "height": 32, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 10 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 457, "var": "lockPanel", "height": 327 }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 72, "x": 181, "width": 231, "var": "unlock0", "skin": "gameui/zs/num_bg.png", "height": 42 }, "compId": 21, "child": [{ "type": "Image", "props": { "y": -5, "x": 18.5, "var": "icon0", "skin": "gameui/flowerlock/suo.png" }, "compId": 22 }, { "type": "Label", "props": { "y": 11, "x": 64, "width": 68, "text": "解锁:", "height": 16, "fontSize": 22, "font": "Microsoft YaHei", "color": "#286EcD" }, "compId": 39 }, { "type": "Label", "props": { "y": 11, "x": 151, "width": 68, "var": "condition0", "text": "99", "height": 16, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff" }, "compId": 40 }] }, { "type": "Image", "props": { "y": 134, "x": 181, "width": 231, "var": "unlock1", "skin": "gameui/zs/num_bg.png", "height": 42 }, "compId": 24, "child": [{ "type": "Image", "props": { "y": -1.5, "x": 18, "width": 38, "var": "icon1", "skin": "gameui/main/img_star.png", "height": 43 }, "compId": 25 }, { "type": "Label", "props": { "y": 11, "x": 64, "width": 68, "text": "提高:", "height": 16, "fontSize": 22, "font": "Microsoft YaHei", "color": "#286EcD" }, "compId": 41 }, { "type": "Label", "props": { "y": 11, "x": 151, "width": 68, "var": "condition1", "text": "99", "height": 16, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff" }, "compId": 42 }] }] }, { "type": "Image", "props": { "y": 66, "x": 43, "width": 117, "var": "img_potbg", "skin": "gameui/staffcommon/goodbg.png", "height": 117 }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 128, "var": "img_pot", "skin": "gameui/iconpen-1.png", "scaleY": 0.9, "scaleX": 0.9, "height": 128 }, "compId": 15 }] }, { "type": "Button", "props": { "y": 212, "width": 205, "var": "tBtn", "stateNum": 1, "skin": "gameui/flowerstate/lanniulittle.png", "right": 121, "name": "tBtn", "labelSize": 24, "labelFont": "Microsoft YaHei", "labelBold": true, "height": 88 }, "compId": 5, "child": [{ "type": "Sprite", "props": { "y": 21, "x": 66, "width": 73, "visible": false, "var": "img_sure", "texture": "gameui/flowerstate/queren.png", "height": 38 }, "compId": 33 }, { "type": "Image", "props": { "y": 36, "x": 49, "width": 111, "height": 20 }, "compId": 27, "child": [{ "type": "Label", "props": { "y": -4, "x": 39, "width": 68, "visible": false, "var": "condition2", "text": "999999", "height": 16, "fontSize": 24, "font": "Microsoft YaHei", "color": "#187100" }, "compId": 29 }] }] }, { "type": "Image", "props": { "y": 169, "x": 43, "var": "volumePanel", "skin": "gameui/flowerlock/back.png" }, "compId": 16, "child": [{ "type": "Label", "props": { "y": 6, "x": 35, "width": 68, "var": "la_volume", "text": "容量：5", "height": 16, "fontSize": 20, "font": "Microsoft YaHei", "color": "#286EcD" }, "compId": 18 }] }, { "type": "Image", "props": { "y": 129, "x": 178, "width": 231, "var": "useVolumePanel", "skin": "gameui/zs/num_bg.png", "sizeGrid": "20,20,20,20", "height": 42 }, "compId": 34, "child": [{ "type": "Image", "props": { "y": -12, "x": 15.5, "skin": "gameui/flowerlock/rongliang.png" }, "compId": 37 }, { "type": "Label", "props": { "y": 11, "x": 67, "width": 68, "text": "容量:", "height": 16, "fontSize": 22, "color": "#286EcD" }, "compId": 38 }, { "type": "Label", "props": { "y": 11, "x": 151, "width": 68, "var": "la_usevolume", "text": "99", "height": 16, "fontSize": 20, "color": "#ffffff" }, "compId": 36 }] }, { "type": "Button", "props": { "y": 7.5, "x": 385.5, "width": 50, "var": "cBtn", "stateNum": 1, "skin": "gameui/close.png", "labelSize": 24, "labelFont": "Microsoft YaHei", "labelBold": true, "height": 50 }, "compId": 43 }, { "type": "Image", "props": { "y": 229, "x": 157, "visible": true, "var": "img_money", "skin": "gameui/main/img_gold.png" }, "compId": 47 }] }], "loadList": ["gameui/img-heidi.png", "gameui/flowerstate/tishi02.png", "gameui/flowerstate/tishi01.png", "gameui/zs/num_bg.png", "gameui/flowerlock/suo.png", "gameui/main/img_star.png", "gameui/staffcommon/goodbg.png", "gameui/iconpen-1.png", "gameui/flowerstate/lanniulittle.png", "gameui/flowerstate/queren.png", "gameui/flowerlock/back.png", "gameui/flowerlock/rongliang.png", "gameui/close.png", "gameui/main/img_gold.png"], "loadList3D": [] };
                Flowerpot.FlowerpotTipsViewUI = FlowerpotTipsViewUI;
                REG("ui.view.Flowerpot.FlowerpotTipsViewUI", FlowerpotTipsViewUI);
                class FlowerRipeTipsViewUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(FlowerRipeTipsViewUI.uiView);
                    }
                }
                FlowerRipeTipsViewUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 11 }, { "type": "Image", "props": { "width": 450, "name": "Image", "height": 358, "centerY": 31, "centerX": 2 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 12, "x": 1, "width": 449, "skin": "gameui/flowerstate/tishi02.png", "sizeGrid": "48,42,54,42", "height": 347 }, "compId": 36 }, { "type": "Image", "props": { "y": 7, "x": 123.5, "skin": "gameui/flowerstate/tishi01.png" }, "compId": 35 }, { "type": "Sprite", "props": { "y": 15, "x": 186.5, "texture": "gameui/zs/tip.png" }, "compId": 37 }, { "type": "Image", "props": { "y": 78, "x": 26, "width": 401, "skin": "gameui/flowerstate/tanchuanzhuangshi.png", "height": 40 }, "compId": 32 }, { "type": "Label", "props": { "y": 84, "x": 33, "width": 403, "var": "title", "valign": "middle", "text": "恭喜多肉成熟！", "height": 32, "fontSize": 22, "font": "Microsoft YaHei", "color": "#2A6FCE", "align": "center" }, "compId": 10 }, { "type": "Image", "props": { "y": 134, "x": 47, "width": 119, "skin": "gameui/zs/item_bg.png", "height": 120 }, "compId": 38 }, { "type": "Image", "props": { "y": 119, "x": 47, "width": 119, "var": "img_pot", "height": 120 }, "compId": 15 }, { "type": "Button", "props": { "y": 294, "x": 223, "width": 152, "var": "tBtn", "stateNum": 1, "skin": "gameui/flowerstate/lanniulittle.png", "name": "tBtn", "labelSize": 24, "labelFont": "Microsoft YaHei", "labelBold": true, "height": 69, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Sprite", "props": { "y": 18.5, "x": 50, "texture": "gameui/flowerstate/queren.png" }, "compId": 33 }] }, { "type": "Image", "props": { "y": 128, "x": 257.5, "var": "icon0", "skin": "gameui/flowerstate/potquality1.png" }, "compId": 22 }, { "type": "Image", "props": { "y": 213, "x": 185, "width": 229, "var": "unlock1", "skin": "gameui/zs/num_bg.png", "height": 42 }, "compId": 24, "child": [{ "type": "Label", "props": { "y": 13, "x": 29, "width": 68, "text": "游客消费：", "height": 16, "fontSize": 20, "font": "Microsoft YaHei", "color": "#296ecd" }, "compId": 34 }, { "type": "Label", "props": { "y": 13, "x": 137, "width": 68, "var": "condition1", "text": "50-60", "height": 16, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff" }, "compId": 26 }] }] }], "loadList": ["gameui/img-heidi.png", "gameui/flowerstate/tishi02.png", "gameui/flowerstate/tishi01.png", "gameui/zs/tip.png", "gameui/flowerstate/tanchuanzhuangshi.png", "gameui/zs/item_bg.png", "gameui/flowerstate/lanniulittle.png", "gameui/flowerstate/queren.png", "gameui/flowerstate/potquality1.png", "gameui/zs/num_bg.png"], "loadList3D": [] };
                Flowerpot.FlowerRipeTipsViewUI = FlowerRipeTipsViewUI;
                REG("ui.view.Flowerpot.FlowerRipeTipsViewUI", FlowerRipeTipsViewUI);
            })(Flowerpot = view.Flowerpot || (view.Flowerpot = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var Illustrated;
            (function (Illustrated) {
                class IllustratedUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(IllustratedUI.uiView);
                    }
                }
                IllustratedUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 306, "x": 41, "width": 559, "var": "bg", "skin": "gameui/zs/title_bg.png", "sizeGrid": "78,179,46,186", "height": 487 }, "compId": 4 }, { "type": "Image", "props": { "y": 390, "x": 77, "width": 486, "skin": "gameui/zs/num_bg.png", "sizeGrid": "22,78,13,107", "height": 356 }, "compId": 15 }, { "type": "Button", "props": { "y": 320, "x": 519.5, "width": 69, "var": "btn_close", "stateNum": 1, "skin": "gameui/close.png", "height": 69 }, "compId": 5 }, { "type": "Label", "props": { "y": 315, "x": 175, "width": 284, "var": "title_label", "valign": "middle", "text": "树龄", "strokeColor": "#0b2548", "stroke": 2, "height": 50, "fontSize": 35, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center" }, "compId": 6 }, { "type": "List", "props": { "y": 400, "x": 92, "width": 456, "var": "list", "spaceY": 20, "spaceX": 20, "height": 329 }, "compId": 7, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 98, "renderType": "render", "height": 97 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 2, "x": 0, "width": 97, "skin": "gameui/zs/item_bg.png", "height": 97 }, "compId": 13 }, { "type": "Image", "props": { "y": 12, "x": 8, "width": 82, "skin": "gameui/icon-2.png", "name": "list_item_img", "height": 72 }, "compId": 9 }, { "type": "Image", "props": { "y": 66, "x": 54, "skin": "gameui/lock.png", "name": "la_lockcon" }, "compId": 16 }, { "type": "Label", "props": { "y": 100, "x": -8, "width": 118, "valign": "middle", "text": "啊撒旦解放", "name": "label_name", "height": 20, "fontSize": 18, "font": "Microsoft YaHei", "color": "#000000", "align": "center" }, "compId": 17 }] }] }, { "type": "Box", "props": { "visible": false, "var": "tip" }, "compId": 10, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 211, "skin": "gameui/zs/cotent.png", "sizeGrid": "12,25,13,27", "height": 67 }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 6, "x": 17, "wordWrap": true, "width": 176, "var": "tipTxt", "valign": "middle", "text": "是的咖啡机阿萨是的咖啡机阿萨", "padding": "5,5,5,5", "overflow": "hidden", "leading": 10, "height": 52, "fontSize": 16, "font": "Microsoft YaHei", "color": "#2968ab", "bold": false, "align": "center" }, "compId": 12 }] }] }], "loadList": ["gameui/zs/title_bg.png", "gameui/zs/num_bg.png", "gameui/close.png", "gameui/zs/item_bg.png", "gameui/icon-2.png", "gameui/lock.png", "gameui/zs/cotent.png"], "loadList3D": [] };
                Illustrated.IllustratedUI = IllustratedUI;
                REG("ui.view.Illustrated.IllustratedUI", IllustratedUI);
            })(Illustrated = view.Illustrated || (view.Illustrated = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var Login;
            (function (Login) {
                class LoginViewUI extends Laya.View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(LoginViewUI.uiView);
                    }
                }
                LoginViewUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "gameui/bg-1.jpg", "sizeGrid": "122,180,117,168", "right": 0, "left": 0, "bottom": 0 }, "compId": 6 }, { "type": "Button", "props": { "y": 637, "x": 220, "width": 200, "var": "loginBtn", "stateNum": 1, "skin": "gameui/staffcommon/bg.png", "sizeGrid": "12,10,13,13", "labelSize": 50, "labelColors": "#fff", "label": "登录", "height": 76, "bottom": 423 }, "compId": 3 }, { "type": "TextInput", "props": { "width": 447, "var": "loginInput", "type": "text", "skin": "gameui/staffcommon/timebg.png", "sizeGrid": "6,5,5,6", "promptColor": "#ffffff", "prompt": "输入角色名称", "padding": "0,0,0,20", "maxChars": 6, "height": 66, "fontSize": 32, "color": "#ffffff", "centerX": -1, "bottom": 564 }, "compId": 4 }, { "type": "Label", "props": { "width": 505, "text": "登录角色界面", "height": 99, "fontSize": 36, "font": "SimSun", "color": "#000000", "centerX": 0, "bottom": 677, "align": "center" }, "compId": 5 }], "loadList": ["gameui/bg-1.jpg", "gameui/staffcommon/bg.png", "gameui/staffcommon/timebg.png"], "loadList3D": [] };
                Login.LoginViewUI = LoginViewUI;
                REG("ui.view.Login.LoginViewUI", LoginViewUI);
            })(Login = view.Login || (view.Login = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var main;
            (function (main) {
                class MainUIUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(MainUIUI.uiView);
                    }
                }
                MainUIUI.uiView = { "type": "Scene", "props": { "width": 640, "mouseThrough": true, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 28, "x": 30, "width": 193, "var": "num_star", "skin": "gameui/main/img_bg.png", "height": 44 }, "compId": 17 }, { "type": "Image", "props": { "y": 21, "x": 50, "var": "num_star_img", "skin": "common/img_star.png" }, "compId": 7 }, { "type": "Image", "props": { "var": "num_gold", "top": 94, "skin": "gameui/main/img_bg.png", "left": 30, "height": 44 }, "compId": 16 }, { "type": "Image", "props": { "y": 89, "x": 49, "width": 46, "var": "num_gold_img", "skin": "common/img_gold.png" }, "compId": 5 }, { "type": "Button", "props": { "visible": false, "var": "btn_edit", "stateNum": 1, "skin": "gameui/main/set.png", "right": 537, "bottom": 159 }, "compId": 11 }, { "type": "Button", "props": { "width": 63, "var": "btn_rank", "top": 27, "stateNum": 1, "skin": "gameui/main/ranking.png", "right": 320, "height": 63 }, "compId": 12 }, { "type": "Button", "props": { "visible": false, "var": "btn_backpack", "stateNum": 1, "skin": "gameui/main/treebag.png", "scaleY": 1.2, "scaleX": 1.3, "right": 510, "name": "btn_backpack", "labelSize": 26, "bottom": 37 }, "compId": 45 }, { "type": "Button", "props": { "var": "btn_handbook", "stateNum": 1, "skin": "gameui/main/tujian.png", "right": 525, "labelSize": 26, "bottom": 37 }, "compId": 46 }, { "type": "Sprite", "props": { "y": 511, "x": 45, "visible": false, "var": "tishi", "texture": "gameui/main/qd.png" }, "compId": 27 }, { "type": "Panel", "props": { "width": 274, "visible": true, "var": "Panel_publicity", "right": 5, "name": "Panel_publicity", "height": 200, "gray": false, "elasticEnabled": true, "disabled": false, "bottom": 31 }, "compId": 31, "child": [{ "type": "Button", "props": { "y": 75, "x": 19, "var": "btn_ad", "stateNum": 1, "skin": "gameui/main/Btn_advertising.png", "name": "btn_ad", "labelSize": 20, "labelFont": "Arial" }, "compId": 28 }, { "type": "Button", "props": { "y": 74, "x": 137, "width": 128, "var": "btn_flyer", "stateNum": 1, "skin": "gameui/main/UI_xuanchuan_00.png", "name": "btn_flyer", "labelSize": 0, "labelFont": "Arial", "height": 128 }, "compId": 29 }, { "type": "ProgressBar", "props": { "y": 34, "x": 138, "width": 126, "var": "progressbar_flyer", "skin": "gameui/main/progressBar.png", "sizeGrid": "0,0,0,10", "height": 24 }, "compId": 30 }] }, { "type": "Panel", "props": { "width": 126, "visible": true, "var": "Panel_pickMoney", "right": 15, "height": 120, "bottom": 231 }, "compId": 32, "child": [{ "type": "Button", "props": { "y": 20, "x": 16, "width": 94, "var": "btn_pickMoney", "stateNum": 1, "skin": "gameui/main/Btn_AutoPickMoney.png", "height": 100 }, "compId": 33 }, { "type": "ProgressBar", "props": { "y": 20, "x": 28, "var": "progressbar_pickMoney", "value": 0.1, "skin": "gameui/main/progressBar2.png", "sizeGrid": "0,0,0,4" }, "compId": 73 }, { "type": "Label", "props": { "y": 70, "x": 0, "width": 126, "var": "Text_pickMoneyTime", "valign": "middle", "text": "00:00:00", "strokeColor": "#2b960a", "stroke": 2, "height": 24, "fontSize": 18, "color": "#ffffff", "align": "center" }, "compId": 75 }] }, { "type": "Panel", "props": { "width": 126, "var": "Panel_TakePhoto", "right": 16, "height": 120, "bottom": 343 }, "compId": 35, "child": [{ "type": "Button", "props": { "y": 20, "x": 16, "width": 94, "var": "btn_TakePhoto", "stateNum": 1, "skin": "gameui/main/Btn_AutoTakePhoto.png", "height": 100 }, "compId": 36 }, { "type": "ProgressBar", "props": { "y": 20, "x": 29, "var": "progressbar_TakePhoto", "value": 0.1, "skin": "gameui/main/progressBar2.png", "sizeGrid": "0,0,0,4" }, "compId": 76 }, { "type": "Label", "props": { "y": 67, "x": 0, "width": 126, "var": "Text_TakePhotoTime", "valign": "middle", "text": "00:00:00", "strokeColor": "#2b960a", "stroke": 2, "height": 24, "fontSize": 18, "color": "#ffffff", "align": "center" }, "compId": 77 }] }, { "type": "Image", "props": { "width": 110, "var": "btn_time_effect", "left": 506, "height": 110, "bottom": 463 }, "compId": 64 }, { "type": "Image", "props": { "width": 110, "var": "btn_time", "left": 506, "height": 110, "bottom": 463 }, "compId": 55, "child": [{ "type": "Image", "props": { "y": -57, "x": 5.5, "visible": false, "var": "goods_title_tips", "skin": "gameui/main/dslq.png" }, "compId": 60 }, { "type": "Box", "props": { "var": "btn_time_box" }, "compId": 63, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 110, "var": "btn_time_bg", "skin": "gameui/main/img-kaixiangzi1.png", "height": 110 }, "compId": 62 }, { "type": "Image", "props": { "y": 10, "x": 11, "width": 87, "var": "goods_item", "height": 87 }, "compId": 59 }] }, { "type": "ProgressBar", "props": { "y": 5, "x": 20, "var": "pro", "value": 1, "skin": "gameui/main/progressBar2.png", "sizeGrid": "0,0,0,4" }, "compId": 61, "child": [{ "type": "Label", "props": { "y": 48, "x": -29, "width": 126, "var": "backTime", "valign": "middle", "text": "00:00:00", "strokeColor": "#2b960a", "stroke": 2, "height": 24, "fontSize": 18, "color": "#ffffff", "align": "center" }, "compId": 58 }] }] }], "loadList": ["gameui/main/img_bg.png", "common/img_star.png", "common/img_gold.png", "gameui/main/set.png", "gameui/main/ranking.png", "gameui/main/treebag.png", "gameui/main/tujian.png", "gameui/main/qd.png", "gameui/main/Btn_advertising.png", "gameui/main/UI_xuanchuan_00.png", "gameui/main/progressBar.png", "gameui/main/Btn_AutoPickMoney.png", "gameui/main/progressBar2.png", "gameui/main/Btn_AutoTakePhoto.png", "gameui/main/dslq.png", "gameui/main/img-kaixiangzi1.png"], "loadList3D": [] };
                main.MainUIUI = MainUIUI;
                REG("ui.view.main.MainUIUI", MainUIUI);
            })(main = view.main || (view.main = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var rank;
            (function (rank) {
                class WXRankViewUI extends Laya.View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(WXRankViewUI.uiView);
                    }
                }
                WXRankViewUI.uiView = { "type": "View", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 163, "x": 33, "width": 574, "height": 810, "centerY": 0, "centerX": 0 }, "compId": 8 }, { "type": "WXOpenDataViewer", "props": { "width": 574, "var": "opendata", "iconSign": "wx", "height": 810, "centerY": 11, "centerX": 0, "runtime": "laya.ui.WXOpenDataViewer" }, "compId": 9 }, { "type": "Button", "props": { "var": "btn_click", "top": 186, "stateNum": 1, "skin": "gameui/close.png", "left": 508 }, "compId": 7 }], "loadList": ["gameui/close.png"], "loadList3D": [] };
                rank.WXRankViewUI = WXRankViewUI;
                REG("ui.view.rank.WXRankViewUI", WXRankViewUI);
            })(rank = view.rank || (view.rank = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var view;
        (function (view) {
            var unLock;
            (function (unLock) {
                class unLockUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(unLockUI.uiView);
                    }
                }
                unLockUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "bg", "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "mouseEnabled": true, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": 331, "x": 57, "width": 525, "skin": "gameui/img_chekedPotted_di.png", "sizeGrid": "175,285,172,239", "height": 474 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 43, "x": 170, "width": 166, "var": "title", "valign": "middle", "text": "解锁XXX", "height": 70, "fontSize": 30, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 5 }, { "type": "Image", "props": { "y": 156, "x": 54, "width": 154, "var": "item_img", "skin": "gameui/iconpen-1.png", "height": 102 }, "compId": 6 }, { "type": "Image", "props": { "y": 156, "x": 274, "width": 30, "skin": "gameui/flowerlock/suo.png", "height": 38 }, "compId": 10, "child": [{ "type": "Label", "props": { "var": "lock_num", "valign": "middle", "top": 10, "text": "解锁：999", "padding": "2,2,2,2", "left": 40, "fontSize": 24, "font": "Microsoft YaHei", "color": "#000000", "align": "center" }, "compId": 13 }] }, { "type": "Image", "props": { "y": 222, "x": 270, "width": 38, "skin": "gameui/main/img_gold.png", "height": 38 }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 0, "var": "money_num", "valign": "middle", "top": 10, "text": "解锁：999", "padding": "2,2,2,2", "left": 45, "fontSize": 24, "font": "Microsoft YaHei", "color": "#000000", "align": "center" }, "compId": 14 }] }, { "type": "Image", "props": { "y": 287, "x": 270, "width": 38, "skin": "gameui/main/img_star.png", "height": 38 }, "compId": 12, "child": [{ "type": "Label", "props": { "y": 0, "var": "star_num", "valign": "middle", "top": 10, "text": "解锁：999", "padding": "2,2,2,2", "left": 45, "fontSize": 24, "font": "Microsoft YaHei", "color": "#000000", "align": "center" }, "compId": 15 }] }] }, { "type": "Button", "props": { "y": 676, "x": 245, "width": 149, "var": "unLock_btn", "stateNum": 1, "skin": "gameui/zs/btn_unLock.png", "height": 70 }, "compId": 16 }], "loadList": ["gameui/img-heidi.png", "gameui/img_chekedPotted_di.png", "gameui/iconpen-1.png", "gameui/flowerlock/suo.png", "gameui/main/img_gold.png", "gameui/main/img_star.png", "gameui/zs/btn_unLock.png"], "loadList3D": [] };
                unLock.unLockUI = unLockUI;
                REG("ui.view.unLock.unLockUI", unLockUI);
                class unLockDialogUI extends Laya.Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.createView(unLockDialogUI.uiView);
                    }
                }
                unLockDialogUI.uiView = { "type": "Scene", "props": { "width": 640, "height": 1136 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 10, "x": 10, "var": "bg", "top": 0, "skin": "gameui/img-heidi.png", "right": 0, "mouseEnabled": true, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": 368, "x": 95, "width": 450, "skin": "gameui/zs/title_bg.png", "sizeGrid": "90,206,75,202", "height": 420 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 80, "x": 28, "width": 395, "skin": "gameui/flowerstate/tanchuanzhuangshi.png", "sizeGrid": "0,0,0,0", "height": 50 }, "compId": 22 }, { "type": "Label", "props": { "y": 80, "x": 29, "width": 392, "var": "title", "valign": "middle", "text": "种植点1", "height": 51, "fontSize": 25, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }, { "type": "Sprite", "props": { "y": 149, "x": 45, "width": 120, "texture": "gameui/zs/item_bg.png", "height": 120 }, "compId": 20, "child": [{ "type": "Image", "props": { "y": 15, "x": 15, "width": 90, "var": "item_img", "skin": "gameui/icon-5.png", "height": 90 }, "compId": 7 }] }, { "type": "Label", "props": { "y": 274, "x": 37, "wordWrap": true, "width": 169, "var": "preconditionTips", "text": "前置节点：种植点1未解锁，请前往解锁！", "padding": "2,2,2,2", "leading": 5, "height": 78, "fontSize": 18, "font": "Microsoft YaHei", "color": "#245d9d", "align": "left" }, "compId": 18 }, { "type": "Sprite", "props": { "y": 15, "x": 189.5, "texture": "gameui/zs/tip.png" }, "compId": 19 }] }, { "type": "Button", "props": { "y": 685, "x": 246, "width": 149, "var": "unLock_btn", "stateNum": 1, "skin": "gameui/zs/btn_unLock.png", "name": "unLock_btn", "height": 66 }, "compId": 5 }, { "type": "Button", "props": { "y": 382, "x": 481, "width": 53, "var": "close_btn", "stateNum": 1, "skin": "gameui/Rank/close.png", "name": "close_btn", "height": 53 }, "compId": 14 }, { "type": "Image", "props": { "y": 516, "x": 281, "width": 227, "skin": "gameui/zs/num_bg.png", "height": 40 }, "compId": 24, "child": [{ "type": "Image", "props": { "y": -1, "x": 15, "width": 40, "skin": "gameui/unlock.png", "height": 40 }, "compId": 8, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 10, "text": "解锁：", "padding": "2,2,2,2", "left": 43, "fontSize": 20, "font": "Microsoft YaHei", "color": "#296ecd", "align": "center" }, "compId": 15 }, { "type": "Label", "props": { "var": "lock_num", "valign": "middle", "top": 11, "text": "999", "padding": "2,2,2,2", "left": 100, "fontSize": 20, "font": "Microsoft YaHei", "color": "#fff", "align": "center" }, "compId": 9 }] }] }, { "type": "Image", "props": { "y": 565, "x": 281, "width": 227, "skin": "gameui/zs/num_bg.png", "height": 40 }, "compId": 29, "child": [{ "type": "Image", "props": { "y": -1, "x": 15, "width": 40, "skin": "gameui/main/img_gold.png", "height": 40 }, "compId": 30, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 10, "text": "金币：", "padding": "2,2,2,2", "left": 43, "fontSize": 20, "font": "Microsoft YaHei", "color": "#296ecd", "align": "center" }, "compId": 31 }, { "type": "Label", "props": { "var": "money_num", "valign": "middle", "top": 11, "text": "999", "padding": "2,2,2,2", "left": 100, "fontSize": 20, "font": "Microsoft YaHei", "color": "#fff", "align": "center" }, "compId": 32 }] }] }, { "type": "Image", "props": { "y": 613, "x": 281, "width": 227, "skin": "gameui/zs/num_bg.png", "height": 40 }, "compId": 33, "child": [{ "type": "Image", "props": { "y": 0, "x": 15, "width": 40, "skin": "gameui/main/img_star.png", "height": 40 }, "compId": 34, "child": [{ "type": "Label", "props": { "valign": "middle", "top": 11, "text": "评价：", "padding": "2,2,2,2", "left": 43, "fontSize": 20, "font": "Microsoft YaHei", "color": "#296ecd", "align": "center" }, "compId": 35 }, { "type": "Label", "props": { "var": "star_num", "valign": "middle", "top": 11, "text": "999", "padding": "2,2,2,2", "left": 100, "fontSize": 20, "font": "Microsoft YaHei", "color": "#fff", "align": "center" }, "compId": 36 }] }] }], "loadList": ["gameui/img-heidi.png", "gameui/zs/title_bg.png", "gameui/flowerstate/tanchuanzhuangshi.png", "gameui/zs/item_bg.png", "gameui/icon-5.png", "gameui/zs/tip.png", "gameui/zs/btn_unLock.png", "gameui/Rank/close.png", "gameui/zs/num_bg.png", "gameui/unlock.png", "gameui/main/img_gold.png", "gameui/main/img_star.png"], "loadList3D": [] };
                unLock.unLockDialogUI = unLockDialogUI;
                REG("ui.view.unLock.unLockDialogUI", unLockDialogUI);
            })(unLock = view.unLock || (view.unLock = {}));
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));

    class ConfigManager {
        constructor(callBack) {
            this._cfgData = {};
            this.Load(callBack);
        }
        Load(callBack) {
            Laya.loader.load("res/config/include.json", Laya.Handler.create(this, () => {
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
        Get(key) {
            if (!key) {
                return null;
            }
            let cfgName = "res/config/" + key + ".json";
            if (this._cfgData[cfgName]) {
                return this._cfgData[cfgName];
            }
            return Laya.loader.getRes(cfgName);
        }
        GetJsonToArray(json) {
            let array = [];
            for (const key in json) {
                if (Object.prototype.hasOwnProperty.call(json, key)) {
                    const element = json[key];
                    if (element) {
                        element.id = key;
                        array.push(element);
                    }
                }
            }
            return array;
        }
        Initialize() {
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
            Sceneeffect_Cfg = this.Get("sceneeffect_C");
        }
        getSucculentpointDispose(_obj, itemName) {
            let _succulentpoint = {};
            for (const key in _obj) {
                if (Object.prototype.hasOwnProperty.call(_obj, key)) {
                    const element = _obj[key];
                    let _indexStr = element[itemName];
                    _succulentpoint[_indexStr] = element;
                }
            }
            return _succulentpoint;
        }
    }
    let Tree_Cfg;
    let Succulent_Cfg;
    let DefaultStatue_Cfg;
    let Path_Cfg;
    let Statue_Cfg;
    let Npc_Cfg;
    let Drop_Cfg;
    let Sound_Cfg;
    let Action_Cfg;
    let Constant_Cfg;
    let Succulentpoint_Cfg;
    let Staff_Cfg;
    let Collection_station_Cfg;
    let Map_Cfg;
    let NewTip_Cfg;
    let Effect_Cfg;
    let guide_Cfg;
    let Land_Cfg;
    let gift_Cfg;
    let freeGuide_Cfg;
    let Share_Cfg;
    let Sceneeffect_Cfg;

    var DiyToolViewUI = ui.view.DiyToolSceneUI;
    class DiyToolView extends DiyToolViewUI {
        constructor() {
            super();
            this.vZoom = 0.05;
            this.vRotate = 2;
            this.nTime = 400;
            this.vZoomMax = 5;
            this.vZoomMin = 0.5;
            this._mouseY = 0;
            this.treeZoom = 1;
            this.isCreate = false;
            this.treeInitData = {
                _id: null,
                _scale: null,
                _pos: null,
                _rotate: null
            };
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.BindEvent();
            Laya.stage.event(CommonDefine.EVENT_EDIT, [true]);
        }
        setCurTree(_tree, isCreate) {
            this.curTree = _tree;
            this.isCreate = isCreate;
            this.treeZoom = this.curTree.getScale();
            this.vZoomMax = this.curTree.maxZoom;
            this.vZoomMin = this.curTree.minZoom;
            this.setTreeInitData();
            this.scrollbar.max = Tree_Cfg[this.curTree._id].zoommax;
            this.scrollbar.min = Tree_Cfg[this.curTree._id].zoommin;
            this.scrollbar.scrollSize = 0.1;
            this.scrollbar.value = this.scrollbar.max + this.scrollbar.min - this.curTree._scale;
            this.scrollbar.changeHandler = Laya.Handler.create(this, this.onChange, null, false);
        }
        setTreeInitData() {
            this.treeInitData = {
                _id: this.curTree._id,
                _scale: this.curTree.transform.scale.x,
                _pos: new Laya.Vector3(this.curTree.transform.position.x, this.curTree.transform.position.y, this.curTree.transform.position.z),
                _rotate: this.curTree.transform.localRotationEuler.y
            };
        }
        cancelAfter() {
            if (this.isCreate) {
                DIYScene.instance.RemoveTree();
                Laya.stage.event(CommonDefine.EVENT_DIYUI_REFRESH);
            }
            else {
                Laya.stage.event(CommonDefine.EVENT_DIY_RESET_TREE);
            }
        }
        setTool() {
            let v3 = new Laya.Vector3(this.curTree.transform.position.x, this.curTree.transform.position.y, this.curTree.transform.position.z);
            let v2 = Utils.worldToScreen(DIYScene.instance.camera, v3);
            this.pos(v2.x + 5, v2.y - 85);
            this.treeZoom = this.treeZoom * 0.9;
            if (this.treeZoom < 1)
                return;
            this.scale(this.treeZoom, this.treeZoom);
            for (let index = 0; index < this.numChildren; index++) {
                const _child = this.getChildAt(index);
                _child.scale(1 / (this.treeZoom), 1 / (this.treeZoom));
            }
        }
        onClosed() {
            Laya.stage.event(CommonDefine.EVENT_EDIT, [false]);
        }
        onDestroy() {
            this.left_btn.offAll();
            this.right_btn.offAll();
            this.cancel.offAll();
            this.save.offAll();
            this.big.offAll();
            this.little.offAll();
            this.scrollbar.offAll();
            DIYScene.instance.editorMode = false;
            Laya.stage.event(CommonDefine.EVENT_EDIT, [false]);
        }
        BindEvent() {
            this.left_btn.on(Laya.Event.CLICK, this, this.LeftEvent, [this]);
            this.right_btn.on(Laya.Event.CLICK, this, this.RightEvent, [this]);
            this.cancel.on(Laya.Event.CLICK, this, this.cancelEv);
            this.save.on(Laya.Event.CLICK, this, this.saveEv);
            this.left_btn.on(Laya.Event.MOUSE_DOWN, this, this.DContinueLeftEvent);
            this.right_btn.on(Laya.Event.MOUSE_DOWN, this, this.DContinueRightEvent);
            this.left_btn.on(Laya.Event.MOUSE_UP, this, this.ClearTime);
            this.right_btn.on(Laya.Event.MOUSE_UP, this, this.ClearTime);
            this.left_btn.on(Laya.Event.MOUSE_OUT, this, this.ClearTime);
            this.right_btn.on(Laya.Event.MOUSE_OUT, this, this.ClearTime);
        }
        onChange(value) {
            let n = this.scrollbar.max + this.scrollbar.min - value;
            this.curTree.setScale(n);
            GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 2);
        }
        saveEv() {
            GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 3);
            GameUIManager.getInstance().destroyUI(DiyToolView);
        }
        cancelEv() {
            this.cancelAfter();
            GameUIManager.getInstance().destroyUI(DiyToolView);
        }
        GoTime(state, callBack) {
            if (state) {
                Laya.timer.once(this.nTime, this, () => {
                    if (callBack) {
                        callBack();
                    }
                });
            }
            else {
                Laya.timer.clearAll(this);
            }
        }
        ClearTime() {
            this.GoTime(false);
        }
        RefershEvent(call) {
            Laya.timer.frameLoop(1, this, () => {
                call(this);
            });
        }
        DContinueRightEvent() {
            this.GoTime(true, () => {
                this.RefershEvent(this.RightEvent);
            });
        }
        DContinueLeftEvent() {
            this.GoTime(true, () => {
                this.RefershEvent(this.LeftEvent);
            });
        }
        RightEvent(self) {
            let _rotate = self.curTree.getRotate();
            self.curTree.setRotate(_rotate + self.vRotate);
        }
        LeftEvent(self) {
            let _rotate = self.curTree.getRotate();
            self.curTree.setRotate(_rotate - self.vRotate);
        }
    }

    class PottedStruct {
        constructor() {
            this.containerId = 0;
            this.GrowStartTime = 0;
            this.GrowTime = 0;
            this.State = PotState.None;
        }
        unPackData(data) {
            this.containerId = data.containerId;
            this.treeArray = data.treeArray;
            this.rotateY = data.rotateY;
            this.quality = data.quality;
            this.GrowStartTime = data.GrowStartTime;
            this.GrowTime = data.GrowTime;
            this.State = data.State;
        }
    }
    class TreeStruct {
        constructor() {
            this.treeId = 0;
            this.scale = null;
            this.rotate = null;
            this.isPlant = true;
        }
    }

    class Point$1 {
        constructor() {
            this.Name = "";
            this.UseIndex = 0;
            this.ExpansionNum = 0;
            this.PointDataList = {};
            this.PotList = {};
            this._num = 0;
        }
        initPoint(data, complate) {
            if (!data) {
                complate && complate.runWith(null);
                return;
            }
            this.Name = data.Name || "";
            this.UseIndex = data.UseIndex;
            this.ExpansionNum = data.ExpansionNum || 0;
            let tList = data.PointDataList || {};
            this.PointDataList = {};
            for (const key in tList) {
                var pottedStruct = new PottedStruct();
                pottedStruct.unPackData(tList[key]);
                this.PointDataList[key] = (pottedStruct);
            }
        }
        packData(PointData, index) {
            var point = {};
            point["Name"] = this.Name;
            point["UseIndex"] = this.UseIndex;
            point["ExpansionNum"] = this.ExpansionNum;
            point["PointDataList"] = {};
            for (const key in this.PotList) {
                if (this.PotList[key]) {
                    if (PointData && index == key) {
                        point["PointDataList"][key] = PointData;
                    }
                    else {
                        point["PointDataList"][key] = this.PotList[key].packData(this.Name);
                    }
                }
            }
            this.PointDataList = point["PointDataList"];
            SaveManager.getInstance().SetPointCache("point_" + this.Name, point);
        }
        GetPotMaxPost() {
            let tBasePost = Succulentpoint_Cfg[this.Name].ministorage || 0;
            return tBasePost + this.ExpansionNum;
        }
        DelPot(index) {
            if (!this.PotList[index])
                return;
            if (index == this.UseIndex) {
                this.UseIndex = -1;
            }
            this.PotList[index].destroy();
            delete this.PotList[index];
        }
        destroy(destroyChild) {
            this.destroy(destroyChild);
        }
    }

    class Time {
        static SetTimeDifference(time) {
            let serverDate = new Date(time * 1000);
            this._timeDifference = serverDate.getTime() - Date.now();
        }
        static get serverDate() {
            return new Date(this.serverMilliseconds);
        }
        static get serverSeconds() {
            return Math.floor((Date.now() + Time._timeDifference) / 1000);
        }
        static get serverMilliseconds() {
            return Math.floor(Date.now() + Time._timeDifference);
        }
        static get Seconds() {
            return Math.floor(Date.now() / 1000);
        }
        static get MilliSeconds() {
            return Date.now();
        }
        static get delta() {
            return Laya.timer.delta;
        }
        static get currTimer() {
            return Laya.timer.currTimer;
        }
        static get currFrame() {
            return Laya.timer.currFrame;
        }
        static get scale() {
            return Laya.timer.scale;
        }
        static set scale(scale) {
            Laya.timer.scale = scale;
        }
    }
    Time._timeDifference = 0;

    class DrawModel {
        constructor() {
            this._isDestroy = false;
            this.position = new Laya.Vector3(0, 0, 0);
            this.scale = 1;
            this.rotationEuler = new Laya.Vector3(0, 0, 0);
            this.bFlower = false;
            this.bEmptyBox = false;
            this.bEmptyPot = false;
        }
        Start(ui) {
            this._ui = ui;
            this._scene = new Laya.Scene3D();
            let light = new Laya.DirectionLight();
            light.color = new Laya.Vector3(1, 1, 1);
            var mat = light.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            light.transform.worldMatrix = mat;
            this._ui.addChild(this._scene);
            this._scene.addChild(light);
            this._ui.setChildIndex(this._scene, 0);
            if (this.bFlower) {
                this.LoadFlower(() => {
                    this.LoadCamera();
                });
            }
            else if (this.bEmptyBox) {
                this.LoadEmptyBox(() => {
                    this.LoadCamera();
                });
            }
            else if (this.bEmptyPot) {
                this.LoadEmptyPot(() => {
                    this.LoadCamera();
                });
            }
        }
        LoadFlower(callBack) {
            if (this.flowerData && this.flowerPotStruct) {
                let strName = "point_" + this.flowerData.Name;
                Potted.createByData(this.flowerPotStruct, Laya.Handler.create(this, function (name, potted, ang) {
                    potted.transform.rotationEuler = new Laya.Vector3(0, potted.transform.rotationEuler.y + ang, 0);
                    potted.transform.position = this.position;
                    this._scene.addChild(potted);
                    callBack();
                }, [strName]));
            }
        }
        LoadEmptyBox(callBack) {
            ResourceManager.getInstance().getResource("res/model/Succulent_pengzi_02.lh", Laya.Handler.create(this, function (ret11) {
                ret11.transform.position = this.position;
                ret11.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
                this._scene.addChild(ret11);
                callBack();
            }));
        }
        LoadEmptyPot(callBack) {
            ResourceManager.getInstance().getResource("res/plant/Succulent_pen_01_A.lh", Laya.Handler.create(this, function (ret11) {
                ret11.transform.position = this.position;
                ret11.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
                this._scene.addChild(ret11);
                callBack();
            }));
        }
        LoadCamera() {
            this._camera = new Laya.Camera();
            this._camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            this._camera.transform.translate(new Laya.Vector3(0, 0, 0), false);
            Laya.timer.once(100, this, () => {
                if (this._isDestroy || this._ui._destroyed)
                    return;
                let pos = this._ui.localToGlobal(new Laya.Point(0, 0));
                let width = this._ui.width;
                let height = this._ui.height;
                let offsetX = pos.x;
                let offsetY = pos.y;
                this._camera.viewport = new Laya.Viewport(offsetX, offsetY, width, height);
                this._scene.addChild(this._camera);
            });
        }
        Destroy() {
            Laya.timer.clearAll(this);
            if (this._scene)
                this._scene.destroy(true);
            this._isDestroy = true;
        }
    }

    class AvatarPool {
        constructor() {
            this._factoryLoadList = {};
            this._factoryLoadMapping = {};
            this._factoryObj = {};
        }
        static get Inst() {
            if (AvatarPool._inst == null)
                AvatarPool._inst = new AvatarPool();
            return AvatarPool._inst;
        }
        GetFactory(path, callBack) {
            let oTemplet = this._factoryObj[path];
            if (!oTemplet) {
                oTemplet = new Laya.Templet();
                oTemplet.loadAni(path);
                oTemplet.on(Laya.Event.COMPLETE, this, () => {
                    oTemplet.offAll();
                    if (this._factoryLoadList[path] != null) {
                        for (let fun of this._factoryLoadList[path]) {
                            fun.runWith(oTemplet);
                        }
                    }
                    this._factoryLoadList[path] = null;
                    callBack.runWith(oTemplet);
                    this._factoryLoadMapping[path] = true;
                });
                this._factoryObj[path] = oTemplet;
            }
            else {
                if (this._factoryLoadMapping[path] != true) {
                    if (this._factoryLoadList[path] == null) {
                        this._factoryLoadList[path] = [];
                    }
                    this._factoryLoadList[path].push(callBack);
                    return;
                }
                callBack.runWith(oTemplet);
            }
        }
    }
    class ImagePool {
        constructor() {
            this._ImageList = [];
        }
        static get Inst() {
            if (!this._Inst) {
                this._Inst = new ImagePool();
            }
            return this._Inst;
        }
        GetImage() {
            for (let i = 0; i < this._ImageList.length; i++) {
                let image = this._ImageList[i];
                if (image.destroyed) {
                    this._ImageList.splice(i, 1);
                }
                else if (image.visible == false) {
                    image.visible = true;
                    return image;
                }
            }
            let newImage = new Laya.Image();
            this._ImageList.push(newImage);
            return newImage;
        }
        Destroy(image) {
            if (!image)
                return;
            image.removeSelf();
            image.visible = false;
        }
    }
    ImagePool._Inst = null;
    class PointPool {
        constructor() {
            this._PointList = [];
        }
        static get Inst() {
            if (!this._inst) {
                this._inst = new PointPool();
            }
            return this._inst;
        }
        GetPoint(x, y) {
            x = x != null ? x : 0;
            y = y != null ? y : 0;
            for (let i = 0; i < this._PointList.length; i++) {
                let CurPoint = this._PointList[i];
                if (CurPoint.x == -5 && CurPoint.y == -5) {
                    CurPoint.x = x;
                    CurPoint.y = y;
                    return CurPoint;
                }
            }
            let TempPoint = new Laya.Point(x, y);
            this._PointList.push(TempPoint);
            return TempPoint;
        }
        RecyclePoint(point) {
            if (!point)
                return;
            point.x = -5;
            point.y = -5;
        }
    }
    PointPool._inst = null;

    var AvatarDirection;
    (function (AvatarDirection) {
        AvatarDirection[AvatarDirection["right"] = 1] = "right";
        AvatarDirection[AvatarDirection["left"] = -1] = "left";
    })(AvatarDirection || (AvatarDirection = {}));
    class AnimationName {
    }
    AnimationName.idle = "idle";
    AnimationName.hit = "hit";
    class Avatars {
        constructor(viewRoot) {
            this._posx = 0;
            this._posy = 0;
            this._curAniName = "";
            this._shadow = null;
            this._factory = null;
            this._armature = null;
            this._lightVal = 0;
            this._lighterFactory = null;
            this._lighterArmature = null;
            this._loadTrue = false;
            this._scale = 1;
            this._speed = 100;
            this._direction = AvatarDirection.right;
            this._loaded = false;
            this._shadow = ImagePool.Inst.GetImage();
            this._shadow.anchorX = 0.5;
            this._shadow.anchorY = 0.5;
            this.viewRoot = viewRoot;
        }
        get Armature() {
            return this._armature;
        }
        AddPendant(Obj) {
            if (!this._armature)
                return;
            this._armature.addChildAt(Obj, 0);
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        set scale(value) {
            if (this._armature == null || this._armature.destroyed)
                return;
            this._scale = value;
            this._armature.scale(this._scale * this._direction, this._scale);
            if (this._lighterArmature) {
                this._lighterArmature.scale(this._scale * this._direction, this._scale);
            }
        }
        get scale() {
            return this._scale;
        }
        set rotation(value) {
            if (this._armature == null || this._armature.destroyed)
                return;
            this._armature.rotation = value;
            if (this._lighterArmature) {
                this._lighterArmature.rotation = value;
            }
        }
        get rotation() {
            if (this._armature == null || this._armature.destroyed || this._armature.rotation == null)
                return;
            return this._armature.rotation;
        }
        set PosX(value) {
            this._posx = value;
            if (this._armature) {
                this._armature.x = this._posx;
                if (this._lighterArmature) {
                    this._lighterArmature.x = this._posx;
                }
            }
        }
        get PosX() {
            return this._posx;
        }
        set PosY(value) {
            this._posy = value;
            if (this._armature) {
                this._armature.y = this._posy;
                if (this._lighterArmature) {
                    this._lighterArmature.y = this._posy;
                }
            }
        }
        get PosY() {
            return this._posy;
        }
        set visible(value) {
            if (this._armature.visible != null)
                this._armature.visible = value;
            if (this._lighterArmature && !this._lighterArmature.destroyed) {
                this._lighterArmature.visible = value;
            }
        }
        get visible() {
            return this._armature.visible;
        }
        PlaySpeed(num) {
            if (!this._armature || this._armature.playbackRate == null)
                return;
            this._armature.playbackRate(num);
        }
        set speed(value) {
            this._speed = value;
        }
        get speed() {
            return this._speed;
        }
        set direction(value) {
            if (!this._armature || this._armature.destroyed)
                return;
            this._direction = value;
            this._armature.scale(this._scale * this._direction, this._scale);
            if (this._lighterArmature) {
                this._lighterArmature.scale(this._scale * this._direction, this._scale);
            }
        }
        get direction() {
            return this._direction;
        }
        get loaded() {
            return this._loaded;
        }
        Load(path, direction = 1, scale = 1, x = 0, y = 0, callBack, lightVal = 0) {
            if (this._loaded) {
                this.Destroy();
            }
            this._loadTrue = false;
            this._path = path;
            this._posx = x;
            this._posy = y;
            this._scale = scale;
            this._direction = direction;
            this._lightVal = lightVal;
            AvatarPool.Inst.GetFactory(path, Laya.Handler.create(this, (factory) => {
                this._factory = factory;
                this.LoadComplete1(callBack);
            }));
        }
        LoadComplete1(callBack) {
            this._armature = this._factory.buildArmature(0);
            this._armature.scale(this._scale * this._direction, this._scale);
            this._armature.x = this._posx;
            this._armature.y = this._posy;
            if (this.viewRoot != null) {
                this.viewRoot.addChild(this._armature);
            }
            else {
                Laya.stage.addChild(this._armature);
            }
            if (this._lightVal > 0) {
                this.LoadLighterAvatar(callBack);
            }
            else {
                this._loaded = true;
                if (callBack) {
                    callBack.run();
                }
            }
            this._loadTrue = true;
        }
        LoadLighterAvatar(callBack) {
            if (this._lighterFactory == null) {
                AvatarPool.Inst.GetFactory(this._path, Laya.Handler.create(this, (factory) => {
                    this._lighterFactory = factory;
                    this.LoadComplete2(callBack);
                }));
            }
            else {
                this.LoadComplete2(callBack);
            }
        }
        LoadComplete2(callBack) {
            this._lighterArmature = this._factory.buildArmature(0);
            this._lighterArmature.scale(this._scale * this._direction, this._scale);
            this._lighterArmature.x = this._posx;
            this._lighterArmature.y = this._posy;
            this._lighterArmature.blendMode = "lighter";
            if (this.viewRoot) {
                this.viewRoot.addChild(this._lighterArmature);
            }
            Laya.timer.frameLoop(1, this, () => {
                let value = Math.abs(Math.sin(Laya.timer.currTimer / 1000)) * 0.5;
                this._lighterArmature.alpha = value * this._lightVal;
            });
            this._loaded = true;
            if (callBack) {
                callBack.run();
            }
        }
        Shadow(scale, bMonster = false) {
            if (!this.viewRoot)
                return;
            function loop(self) {
                if (!self._armature || self._armature.destroyed)
                    return;
                let ret = self._armature.getBounds();
                if (ret.width > 0 || ret.height > 0) {
                    self._width = ret.width;
                    self._height = ret.height;
                    self._shadow.skin = "ui_common/img-yingzi.png";
                    self._shadow.scale(scale, scale);
                    if (bMonster) {
                        self._shadow.pos(self._posx, self._posy);
                    }
                    else {
                        self._shadow.pos(ret.x + ret.width * 0.5, ret.y + ret.height - 5);
                    }
                    self.viewRoot.addChildAt(self._shadow, 0);
                    Laya.timer.clear(self, loop);
                    return;
                }
            }
            Laya.timer.frameLoop(1, this, loop, [this]);
        }
        SetOrder(order) {
            if (this._armature) {
                this._armature.zOrder = order;
                this._armature.updateZOrder();
            }
            if (this._lighterArmature) {
                this._lighterArmature.zOrder = order;
                this._lighterArmature.updateZOrder();
            }
        }
        GetBoneTransform(boneName) {
            let ret = new Laya.Point();
            let arr = this._factory.mBoneArr;
            if (arr) {
                let bone = this._factory.boneSlotDic[boneName];
                if (bone) {
                    let tran = bone.currDisplayData.transform;
                    ret.x = tran.x;
                    ret.y = tran.y;
                }
            }
            return ret;
        }
        PlayOnce(nameOrIndex = null) {
            if (!nameOrIndex) {
                let start = this._path.lastIndexOf("/") + 1;
                let end = this._path.indexOf(".sk");
                nameOrIndex = this._path.substring(start, end);
            }
            if (this.Armature) {
                this.Armature.visible = true;
                this.Play(nameOrIndex, false, true, () => {
                    this.Armature.visible = false;
                });
            }
        }
        Play(nameOrIndex = null, loop = true, force, callBack, ones) {
            if (!this._armature || this._armature.destroyed)
                return;
            if (nameOrIndex == null) {
                let start = this._path.lastIndexOf("/") + 1;
                let end = this._path.indexOf(".sk");
                nameOrIndex = this._path.substring(start, end);
            }
            if (ones) {
                this._armature.play(nameOrIndex, loop, force, 1, 1);
                if (this._lighterArmature) {
                    this._lighterArmature.play(nameOrIndex, loop, force, 1, 1);
                }
                return;
            }
            if (nameOrIndex == this._curAniName && nameOrIndex == AnimationName.hit) {
                let index = this._armature["_currAniIndex"];
                let duration = this._factory.getAniDuration(index);
                this._armature.play(nameOrIndex, loop, force, duration / 2);
                if (this._lighterArmature) {
                    this._lighterArmature.play(nameOrIndex, loop, force, duration / 2);
                }
            }
            else {
                this._armature.play(nameOrIndex, loop, force);
                if (this._lighterArmature) {
                    this._lighterArmature.play(nameOrIndex, loop, force);
                }
            }
            this._curAniName = nameOrIndex;
            this._armature.offAll();
            this._armature.on(Laya.Event.STOPPED, this, () => {
                if (callBack != null) {
                    callBack();
                }
                if (this._armature) {
                    this._armature.offAll();
                }
            });
            if (this._lighterArmature) {
                this._lighterArmature.offAll();
                this._lighterArmature.on(Laya.Event.STOPPED, this, () => {
                    if (this._lighterArmature) {
                        this._lighterArmature.offAll();
                    }
                });
            }
        }
        GetAniDuration() {
            if (!this._armature || !this._factory)
                return;
            let index = this._armature["_currAniIndex"];
            let duration = this._factory.getAniDuration(index);
            return duration;
        }
        Stop() {
            this._armature.stop();
            this._armature.offAll();
            if (this._lighterArmature) {
                this._lighterArmature.stop();
                this._lighterArmature.offAll();
            }
        }
        Rotate(value) {
            if (!this._armature || this._armature.destroyed)
                return;
            this._armature.rotation = value;
            if (this._lighterArmature) {
                this._lighterArmature.rotation = value;
            }
        }
        Destroy() {
            Laya.timer.clearAll(this);
            if (this._shadow) {
                ImagePool.Inst.Destroy(this._shadow);
            }
            if (this._armature) {
                this._armature.offAll();
                this._armature.destroy(true);
                this._armature = null;
            }
            if (this._lighterArmature) {
                this._lighterArmature.offAll();
                this._lighterArmature.destroy(true);
                this._lighterArmature = null;
            }
            this._loaded = false;
        }
        setPostion(x, y) {
            if (!this._armature)
                return;
            this._armature.x = x;
            this._armature.y = y;
        }
        setShow(b) {
            if (!this._armature)
                return;
            this._armature.visible = b;
        }
    }
    class AnimationNames {
    }
    AnimationNames.idle = "idle";
    AnimationNames.hit = "hit";
    AnimationNames.attack = "attack";
    AnimationNames.die = "dead";

    class EffectManager extends Singleton {
        BtnEffect(box, scale = 1) {
            let eff = new Avatars(box);
            eff.Load(Effect_Cfg[5].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
                eff.Play(Effect_Cfg[5].straniname, false, true, () => {
                    eff.Destroy();
                    eff = null;
                });
            }));
        }
        PlayOnceEffect(box, id, scale, isloop, callback) {
            let eff = new Avatars(box);
            eff.Load(Effect_Cfg[id].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
                eff.Play(Effect_Cfg[id].straniname, isloop, true, callback);
            }));
            return eff;
        }
        PlayEffect(box, id, scale) {
            let eff = new Avatars(box);
            eff.Load(Effect_Cfg[id].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
                eff.PlayOnce(Effect_Cfg[id].straniname);
            }));
            return eff;
        }
    }

    class FlowerRipeTipsView extends ui.view.Flowerpot.FlowerRipeTipsViewUI {
        constructor() {
            super();
            this._pointName = "";
            this._pointIndex = 0;
            let data = PotManager.getInstance().PotRipeList.shift();
            if (!data) {
                this.onClose();
            }
            this._pointName = data[0];
            this._pointIndex = data[1];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.InitEvent();
            this.InitView();
        }
        onDisable() {
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(FlowerRipeTipsView);
        }
        InitEvent() {
            this.tBtn.on(Laya.Event.CLICK, this, this.OnSure);
        }
        InitView() {
            let tPoint = PotManager.getInstance().PotMap[this._pointName];
            let tPot = tPoint.PotList[this._pointIndex];
            if (tPot) {
                this.icon0.skin = tPot.GetQualityImg();
                this.condition1.text = String(tPot.quality);
                this.OnUpdateFlowerModel(this.img_pot);
            }
        }
        OnUpdateFlowerModel(ui) {
            if (this.flowerModel) {
                this.flowerModel.Destroy();
                this.flowerModel = null;
            }
            this.flowerModel = new DrawModel();
            this.flowerModel.flowerData = PotManager.getInstance().PotMap[this._pointName];
            this.flowerModel.flowerPotStruct = PotManager.getInstance().PotMap[this._pointName].PointDataList[this._pointIndex];
            this.flowerModel.bFlower = true;
            let pos = PotManager.getInstance().scaleInfo[Succulentpoint_Cfg[this._pointName].type];
            this.flowerModel.position = new Laya.Vector3(0, -pos[0], -pos[1]);
            this.flowerModel.Start(ui);
        }
        OnSure() {
            EffectManager.getInstance().BtnEffect(this.tBtn);
            PotManager.getInstance().PotRipeList.shift();
            this.onClose();
            if (PotManager.getInstance().PotRipeList.length > 0)
                GameUIManager.getInstance().showUI(FlowerRipeTipsView);
        }
    }

    class PotManager extends Singleton {
        constructor() {
            super();
            this.PotMap = {};
            this.PotRipeList = [];
            this.scaleInfo = { "1": [0.24, 1], "2": [0.3, 1.7], "3": [0.5, 1.9] };
            this.initData();
        }
        initData() {
            for (const key in ModelStorage) {
                let strName = ModelStorage[key];
                if (ModelStorage[key].indexOf("defaulsucculent") != -1) {
                    var _data = SaveManager.getInstance().GetCache(strName);
                    if (_data) {
                        let point = new Point$1();
                        point.initPoint(_data, null);
                        let pointName = strName.substr(6, strName.length - 1);
                        this.PotMap[pointName] = point;
                    }
                }
            }
        }
        AddPot(point, potid, pot) {
            if (!this.PotMap[point]) {
                this.PotMap[point] = new Point$1();
                let _data = {};
                _data["Name"] = point;
                _data["UseIndex"] = potid;
                this.PotMap[point].initPoint(_data, null);
            }
            pot.State = PotState.Grow;
            pot.GrowStartTime = Time.Seconds;
            pot.GrowTime = Constant_Cfg[8].value;
            this.PotMap[point].PotList[potid] = pot;
            this.PotMap[point].UseIndex = potid;
            this.PotMap[point].packData();
        }
        OnSpeedUp(point, index) {
            if (!this.PotMap[point] || !this.PotMap[point].PotList[index]) {
                return;
            }
            let pot = this.PotMap[point].PotList[index];
            pot.State = PotState.Ripe;
            pot.GrowStartTime = 0;
            pot.GrowTime = 0;
            this.PotMap[point].packData();
            GameScene.instance.createSceneBotany();
            this.PotRipeList.push([point, index]);
            if (this.PotMap[point].growProBar) {
                this.PotMap[point].growProBar.destroy();
            }
            GameUIManager.getInstance().showUI(FlowerRipeTipsView);
            GEvent.DispatchEvent(GacEvent.OnPlantRipe);
        }
        DelPot(point, index) {
            if (!this.PotMap[point]) {
                return;
            }
            let tPoint = this.PotMap[point];
            if (tPoint.UseIndex == index) {
                GameScene.instance.delPotted(tPoint, "point_" + tPoint.Name, index);
            }
            tPoint.DelPot(index);
            tPoint.packData();
        }
        GetPotMaxPost(point) {
            return Succulentpoint_Cfg[point].ministorage || 0 + (this.PotMap[point] ? this.PotMap[point].ExpansionNum : 0);
        }
        GetPointCurPotIndex(point) {
            if (!this.PotMap[point])
                return -1;
            return this.PotMap[point].UseIndex;
        }
        GetPointCurPot(point) {
            if (!this.PotMap[point] || !this.PotMap[point].PotList[this.PotMap[point].UseIndex])
                return;
            return this.PotMap[point].PotList[this.PotMap[point].UseIndex];
        }
        ReplaceCurUse(point, index) {
            if (!this.PotMap[point])
                return;
            let tPoint = this.PotMap[point];
            tPoint.UseIndex = index;
            tPoint.packData();
            GameScene.instance.createPotted(tPoint, "point_" + tPoint.Name, index);
        }
        UpdateScenePot(point, index) {
            if (!this.PotMap[point] || !this.PotMap[point].PointDataList[index])
                return;
            let tPoint = this.PotMap[point];
            tPoint.PointDataList[index].State = PotState.Ripe;
            tPoint.PointDataList[index].GrowStartTime = 0;
            tPoint.PointDataList[index].GrowTime = 0;
            tPoint.packData(tPoint.PointDataList[index], index);
            GameScene.instance.createPotted(tPoint, "point_" + tPoint.Name, index);
            this.PotRipeList.push([point, index]);
            GameUIManager.getInstance().showUI(FlowerRipeTipsView);
            GEvent.DispatchEvent(GacEvent.OnPlantRipe);
            let sp3d = GameScene.instance.getScene().getChildByName("point").getChildByName(tPoint.Name);
            GameScene.instance.playEffect(Sceneeffect_Cfg[1].streffect, sp3d.transform.position, 2000);
        }
        SavePot(point, potid, pot) {
            if (!this.PotMap[point] || !this.PotMap[point].PotList[potid]) {
                return;
            }
            this.PotMap[point].PotList[potid] = pot;
            this.PotMap[point].packData();
        }
        GetPottedQuiteImg() {
        }
        PackageData() {
            for (const key in this.PotMap) {
                this.PotMap[key].packData();
            }
        }
    }

    class BagSystem extends Singleton {
        constructor() {
            super();
            this.itemArr = new Array();
            var data = SaveManager.getInstance().GetCache(ModelStorage.bagsystem);
            if (!data) {
                for (const key in Constant_Cfg[17].value) {
                    if (Number(key) % 2 == 0)
                        continue;
                    this.addItem(Number(Constant_Cfg[17].value[key]), Number(Constant_Cfg[17].value[Number(key) + 1]));
                }
            }
            else {
                this.itemArr = JSON.parse(data);
            }
        }
        initBag(data) {
        }
        addItem(itemId, itemNumber) {
            if (itemNumber <= 0)
                return;
            var type = this.getItemType(itemId);
            this._add(type, itemId, itemNumber);
            this.packData();
        }
        delItem(itemId, itemNumber) {
            if (!this.canDel(itemId, itemNumber, true)) {
                console.log("背包中没有此物品");
            }
        }
        canDel(itemId, itemNumber, bDel) {
            var type = this.getItemType(itemId);
            for (var i = 0; i < this.itemArr[type].length; ++i) {
                if (this.itemArr[type][i].itemId == itemId) {
                    if (this.itemArr[type][i].itemNum < itemNumber)
                        return false;
                    if (bDel) {
                        if (this.itemArr[type][i].itemNum > itemNumber)
                            this.itemArr[type][i].itemNum -= itemNumber;
                        else
                            this.itemArr[type].splice(i, 1);
                        this.packData();
                    }
                    return true;
                }
            }
            return false;
        }
        getItemByType(type) {
            if (!this.itemArr[type])
                return null;
            return this.itemArr[type];
        }
        packData() {
            var d = JSON.stringify(this.itemArr);
            SaveManager.getInstance().SetBagSystemCache(d);
        }
        _add(type, itemId, itemNumber) {
            if (!this.itemArr[type])
                this.itemArr[type] = new Array();
            var haveItem = false;
            for (var i = 0; i < this.itemArr[type].length; ++i) {
                if (this.itemArr[type][i].itemId == itemId) {
                    this.itemArr[type][i].itemNum += itemNumber;
                    haveItem = true;
                }
            }
            if (!haveItem) {
                var itemObj = new item();
                itemObj.itemId = itemId;
                itemObj.itemNum = itemNumber;
                this.itemArr[type].push(itemObj);
            }
        }
        getItemType(itemId) {
            return Succulent_Cfg[itemId].type;
        }
    }
    class item {
    }

    var SwitchSceneUI = ui.view.SwitchSceneUI;
    var Event = Laya.Event;
    class SwitchScene extends SwitchSceneUI {
        onAwake() {
            super.onAwake();
            Laya.stage.on(CommonDefine.EVENT_BEGIN_ROLL, this, this.hideHand);
            Laya.stage.on(CommonDefine.EVENT_BEGIN_VIEW, this, this.hideUI);
            Laya.stage.on(CommonDefine.EVENT_END_VIEW, this, this.showUI);
        }
        onEnable() {
            this.leftbt.on(Event.MOUSE_UP, this, this.onLeftClick);
            this.rightbt.on(Event.MOUSE_UP, this, this.onRightClick);
            this.exitView.on(Event.MOUSE_UP, this, this.onExitView);
            this.hand_right.visible = false;
            this.hand_left.visible = false;
            this.exitView.visible = false;
            this.mouseThrough = true;
            super.onEnable();
            this.leftbt.visible = false;
            this.rightbt.visible = false;
        }
        onDisable() {
            super.onDisable();
            this.leftbt.off(Event.MOUSE_UP, this, this.onLeftClick);
            this.rightbt.off(Event.MOUSE_UP, this, this.onRightClick);
            this.exitView.off(Event.MOUSE_UP, this, this.onExitView);
        }
        onDestroy() {
            super.onDestroy();
            this.leftbt.off(Event.MOUSE_UP, this, this.onLeftClick);
            this.rightbt.off(Event.MOUSE_UP, this, this.onRightClick);
            this.exitView.off(Event.MOUSE_UP, this, this.onExitView);
        }
        onOpened(param) {
            super.onOpened(param);
        }
        onLeftClick(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", Global.gameCamera]);
        }
        onRightClick(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", Global.gameCamera]);
        }
        onExitView(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_BACK);
        }
        hideHand() {
            this.hand_left.visible = false;
        }
        hideUI() {
            this.leftbt.visible = false;
            this.rightbt.visible = false;
            this.exitView.visible = true;
        }
        showUI() {
            this.leftbt.visible = false;
            this.rightbt.visible = false;
            this.exitView.visible = false;
        }
    }

    var LoadingScene1UI = ui.view.LoadingSceneUI;
    class LoadingScenes1 extends LoadingScene1UI {
        onAwake() {
            super.onAwake();
        }
        onEnable() {
            this.ani1.stop();
            this.ani1.play();
            super.onEnable();
        }
        onDisable() {
            super.onDisable();
            this.ani1.stop();
        }
        onDestroy() {
            super.onDestroy();
        }
        onOpened(param) {
            super.onOpened(param);
        }
        onLeftClick(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", Global.gameCamera]);
        }
        onRightClick(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", Global.gameCamera]);
        }
        onExitView(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_BACK);
        }
    }

    class SceneManager extends Singleton {
        constructor() {
            super();
            this.gameLayer = LayerManager.getInstance().gameLayer;
        }
        openScene(cls, param = null, complate = null, closeOther = true) {
            cls.showScene(param, complate);
            this.gameLayer.addChild(cls);
            if (closeOther && this.currentDisplayScene) {
                this.currentDisplayScene.hideScene();
            }
            this.currentDisplayScene = cls;
        }
        loadScene(url, complate = null) {
            Laya.loader.create(url, complate);
        }
    }
    SceneManager._gameScene = null;
    SceneManager._viewScene = null;

    class TipViewScene extends ui.view.common.TipViewSceneUI {
        constructor(param) {
            super();
            this.isShowBtn = false;
            this._title = param[0] ? param[0] : "";
            this._content = param[1] ? param[1] : "";
            this.isShowBtn = param[2] ? param[2] : false;
            this._confirmCallBack = param[3] ? param[3] : null;
            this._cancelCallBack = param[4] ? param[4] : null;
            console.log("=======tip============", param);
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.bindEvent();
            this.initView();
            Global.sceneLock = true;
        }
        initView() {
            Laya.timer.clearAll(this);
            this.title.text = this._title;
            this.content.text = this._content;
            if (this.isShowBtn) {
                this.tBtn.visible = true;
                this.cBtn.visible = true;
            }
            else {
                this.tBtn.visible = false;
                this.cBtn.visible = false;
                Laya.timer.once(1000, this, () => {
                    GameUIManager.getInstance().destroyTopUI(TipViewScene);
                });
            }
        }
        bindEvent() {
            this.tBtn.on(Laya.Event.CLICK, this, this.confirmEv);
            this.cBtn.on(Laya.Event.CLICK, this, this.cancelEv);
            this.on(Laya.Event.CLICK, this, this.clickEvent);
        }
        clickEvent() {
            GameUIManager.getInstance().destroyUI(TipViewScene);
        }
        cancelEv() {
            EffectManager.getInstance().BtnEffect(this.cBtn);
            GameUIManager.getInstance().destroyUI(TipViewScene);
        }
        confirmEv() {
            EffectManager.getInstance().BtnEffect(this.tBtn);
            GameUIManager.getInstance().destroyUI(TipViewScene);
            if (this._confirmCallBack)
                this._confirmCallBack();
        }
        onDestroy() {
            this.tBtn.offAll();
            this.cBtn.offAll();
            Global.sceneLock = false;
            Laya.timer.clearAll(this);
        }
    }

    class GuideView {
        constructor(dMap, showbub, showarr) {
            this.root = new Laya.Sprite();
            this.root.name = "GuideRoot";
            Laya.stage.addChild(this.root);
            var gameContainer = new Laya.Sprite();
            gameContainer.x = 0;
            gameContainer.y = 0;
            gameContainer.width = Laya.stage.width;
            gameContainer.height = Laya.stage.height;
            gameContainer.mouseEnabled = false;
            this.root.addChild(gameContainer);
            this.guideContainer = new Laya.Box();
            this.guideContainer.width = Laya.stage.width;
            this.guideContainer.height = Laya.stage.height;
            this.guideContainer.cacheAs = "bitmap";
            this.root.addChild(this.guideContainer);
            var maskArea = new Laya.Sprite();
            maskArea.alpha = 0.5;
            maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            this.guideContainer.addChild(maskArea);
            this.interactionArea = new Laya.Sprite();
            this.interactionArea.blendMode = "destination-out";
            this.guideContainer.addChild(this.interactionArea);
            let x = Number(dMap.get("x"));
            let y = Number(dMap.get("y"));
            let width = Number(dMap.get("width"));
            let height = Number(dMap.get("height"));
            this.interactionArea.graphics.drawRect(x, y, width, height, "#ffffff");
            this.hitArea = new Laya.HitArea();
            this.hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            this.hitArea.unHit.drawRect(x, y, width, height, "#fffffff");
            this.guideContainer.hitArea = this.hitArea;
            this.guideContainer.mouseEnabled = true;
            this.guideContainer.on(Laya.Event.CLICK, this, function () {
            });
            if (showbub != null && showbub[0]) {
                this.ShowContent(showbub[1], showbub[2], showbub[4]);
            }
            if (showarr != null && showarr[0]) {
                this.ShowArrows(showarr[2], showarr[3]);
            }
        }
        DestroyUI() {
            Laya.timer.clearAll(this);
            this.root.destroy();
        }
        ShowContent(text, posdata, color) {
            var html = "";
            var htmlDiv = new Laya.Label();
            htmlDiv.pos(posdata.x, posdata.y);
            htmlDiv.fontSize = 35;
            if (text.indexOf("/n") != -1) {
                let texts = text.split('/n');
                let len = 0;
                for (let i = 0; i < texts.length; i++) {
                    html += texts[i] + "\n";
                    len = len > texts[i].length ? len : texts[i].length;
                }
                htmlDiv.width = len * 25;
                htmlDiv.height = 25 * texts.length;
            }
            else {
                htmlDiv.width = text.length * 25;
                htmlDiv.height = 25;
                html = text;
            }
            htmlDiv.text = html;
            htmlDiv.color = color;
            this.guideContainer.addChild(htmlDiv);
            Laya.timer.loop(150, this, function () {
                if (htmlDiv.alpha >= 1) {
                    this.isaddalpha = false;
                }
                if (htmlDiv.alpha <= 0.5) {
                    this.isaddalpha = true;
                }
                htmlDiv.alpha += this.isaddalpha ? 0.1 : -0.1;
            });
        }
        ShowArrows(pos, url) {
            Laya.loader.load("res/atlas/gameui/guide.atlas", Laya.Handler.create(this, function (aa) {
                let anim = new Laya.Animation();
                anim.name = "ani";
                anim.loadAnimation(url);
                anim.pos(pos.x, pos.y);
                this.guideContainer.addChild(anim);
                anim.play(0, true);
            }));
        }
    }
    class GuideLabel {
        constructor(str, color, pos) {
            this.isaddalpha = false;
            if (!Laya.stage.getChildByName("GuideLabel")) {
                this.root = new Laya.Sprite();
                this.root.name = "GuideLabel";
                Laya.stage.addChild(this.root);
            }
            var htmlDiv = new Laya.Label();
            htmlDiv.wordWrap = false;
            htmlDiv.fontSize = 35;
            htmlDiv.name = "txt";
            htmlDiv.alpha = 1;
            htmlDiv.color = color;
            htmlDiv.text = str;
            htmlDiv.pos(pos.x, pos.y);
            this.root.addChild(htmlDiv);
            Laya.timer.loop(150, this, function () {
                if (htmlDiv.alpha >= 1) {
                    this.isaddalpha = false;
                }
                if (htmlDiv.alpha <= 0.5) {
                    this.isaddalpha = true;
                }
                htmlDiv.alpha += this.isaddalpha ? 0.1 : -0.1;
            });
        }
        DestroyUI() {
            Laya.timer.clearAll(this);
            this.root.destroy();
        }
    }

    class GuideManager extends Singleton {
        constructor() {
            super(...arguments);
            this.curPage = 0;
            this._closeGuide = false;
            this._clickname = "";
            this._forceGuide = [];
            this._NotForceGuide = [];
            this._curid = -1;
            this._freecurid = -1;
        }
        get CurGuide() {
            return this._guide;
        }
        get CurFreeGuide() {
            return this._freeguide;
        }
        get CurID() {
            return this._curid;
        }
        set CurID(value) {
            this._curid = value;
            this._guide = null;
            this.guideView = null;
            if (this._curid == -1) {
                SaveManager.getInstance().SetGuideID(this._curid);
                return;
            }
            this._guide = new GuideInfo(guide_Cfg[this._curid], this._curid);
            if (this._guide._guidesavepoint == 1) {
                SaveManager.getInstance().SetGuideID(this._curid);
            }
        }
        get FreeCurID() {
            return this._freecurid;
        }
        set FreeCurID(value) {
            this._freecurid = value;
            this.freeGuideLabel = null;
            this._freeguide = null;
            if (this._freecurid == -1) {
                SaveManager.getInstance().SetFreeGuideID(this._freecurid);
                if (!SaveManager.getInstance().GetCache(ModelStorage.GuideID)) {
                    SaveManager.getInstance().SetGuideID(1);
                    this.CurID = 1;
                }
                else {
                    let id = SaveManager.getInstance().GetCache(ModelStorage.GuideID);
                    if (id == -1)
                        return;
                    if (id == 3) {
                        GEvent.DispatchEvent(GacEvent.GuideCreateBubInScene);
                    }
                    this.CurID = SaveManager.getInstance().GetCache(ModelStorage.GuideID);
                }
                return;
            }
            else {
                this._freeguide = new FreeGuideInfo(freeGuide_Cfg[this._freecurid], this._freecurid);
            }
        }
        OnStart() {
            if (Constant_Cfg[14].value == 0)
                return;
            if (!SaveManager.getInstance().GetCache(ModelStorage.FreeGuideID)) {
                SaveManager.getInstance().SetFreeGuideID(1);
                this.FreeCurID = 1;
            }
            else {
                let id = SaveManager.getInstance().GetCache(ModelStorage.FreeGuideID);
                if (id == -1) {
                    if (!SaveManager.getInstance().GetCache(ModelStorage.GuideID)) {
                        SaveManager.getInstance().SetGuideID(1);
                        this.CurID = 1;
                    }
                    else {
                        let id = SaveManager.getInstance().GetCache(ModelStorage.GuideID);
                        if (id == -1)
                            return;
                        if (id == 3) {
                            GEvent.DispatchEvent(GacEvent.GuideCreateBubInScene);
                        }
                        this.CurID = SaveManager.getInstance().GetCache(ModelStorage.GuideID);
                    }
                }
                else {
                    this.FreeCurID = SaveManager.getInstance().GetCache(ModelStorage.FreeGuideID);
                }
            }
            GEvent.RegistEvent(GacEvent.OnUpdate, Laya.Handler.create(this, this.OnUpdate));
            GEvent.RegistEvent(GacEvent.OnClickInSceneByGuide, Laya.Handler.create(this, this.OnClickInSceneByGuide));
            GEvent.RegistEvent(GacEvent.GuideChangePage, Laya.Handler.create(this, this.GuideChangePage));
            GEvent.RegistEvent(GacEvent.GuideDiyISOver, Laya.Handler.create(this, this.GuideDiyISOver));
            this.curPage = GameScene.instance.curRollIndex;
            Laya.stage.on(Laya.Event.GuideUIClick, this, this.UIClick);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.UIClickDown);
        }
        NextStep() {
            this.ShowNewUI();
            this.guideView.DestroyUI();
            if (this.CurID == 3) {
                GEvent.DispatchEvent(GacEvent.GuideCreateBubInScene);
            }
            this.CurID = this._guide._guideNextID;
        }
        FreeNextStep() {
            this.freeGuideLabel.DestroyUI();
            this.FreeCurID = this._freeguide._guideNextID;
        }
        OnClickInSceneByGuide(rat) {
            if (this._guide != null && this.guideView != null) {
                if (this._guide._guideClickPoint == rat.name) {
                    this.NextStep();
                }
            }
        }
        GuideChangePage(index) {
            this.curPage = index;
        }
        GuideDiyISOver(data) {
            if (this._freeguide != null && this.freeGuideLabel != null && data == 2 && this._freeguide._guideID == data) {
                this.FreeNextStep();
            }
            if (this._freeguide != null && this.freeGuideLabel != null && data == 3 && this._freeguide._guideID == data) {
                this.FreeNextStep();
            }
            if (this._freeguide != null && this.freeGuideLabel != null && data == 4 && this._freeguide._guideID == data) {
                this.FreeNextStep();
            }
            if (this._freeguide != null && this.freeGuideLabel != null && data == 1) {
                this.FreeNextStep();
            }
        }
        UIClick(params) {
            if (params.target.name == "")
                return;
            if (this._guide == null || this.guideView == null)
                return;
            if (params.target.name != this._clickname)
                return;
            let node = params.target;
            while (node) {
                if (node.name != this._guide._guideClickPoint) {
                    node = node.parent;
                }
                else {
                    console.log(node.name);
                    this.NextStep();
                    return;
                }
            }
            return console.log("点击错误");
        }
        UIClickDown(params) {
            this._clickname = params.target.name;
        }
        OnUpdate() {
            if (this._guide != null && this.guideView == null && !this._closeGuide) {
                for (let i in this._guide._guideActive) {
                    if (!this.JudgeCondition(Number(i), this._guide._guideActive[i]) && this._curid == this._guide._guideID) {
                        console.log(Number(i) + "   " + this.JudgeCondition(Number(i), this._guide._guideActive[i]));
                        return;
                    }
                }
                if (this._guide._guideCloseAllUI) {
                    ViewManager.getInstance().DestroyUIByHie(LayerManager.getInstance().topUILayer);
                }
                let point = new Laya.Point();
                switch (this._guide._guideClassType) {
                    case (ClassType.Scene):
                        let scene = GameScene.instance.scene3d;
                        if (scene == null)
                            return;
                        if (GameUIManager.getInstance().GetOtherUIShow())
                            return;
                        if (scene != null && scene.getChildByName(this._guide._guideNode[0])) {
                            try {
                                let node = this.FindNodeByDir(this._guide._guideNode);
                                let vec = Utils.worldToScreen(GameScene.instance.camera, node.transform.position);
                                point.x = vec.x - this._guide._guideSize.width / 2;
                                point.y = vec.y - this._guide._guideSize.height / 2;
                            }
                            catch (_a) {
                                console.log("节点未找到");
                                return;
                            }
                        }
                        break;
                    case (ClassType.UI):
                        if (this._guide._guideUIFindType == 1) {
                            let view = ViewManager.getInstance().GetViewByName(this._guide._guideNode[0]);
                            if (GameUIManager.getInstance().GetOtherUIShowTop(view.name))
                                return;
                            let node = this.FindNodeByDir2D(this._guide._guideNode, view, 1);
                            if (node == null) {
                                console.error("引导未找到节点");
                                return;
                            }
                            if (view != null && node) {
                                point = node.localToGlobal(new Laya.Point(0, 0));
                            }
                        }
                        else {
                            let node = this.FindNodeByDir2D(this._guide._guideNode, LayerManager.getInstance().root, 1);
                            if (node) {
                                point = node.localToGlobal(new Laya.Point(0, 0));
                            }
                        }
                        break;
                }
                if (point == null) {
                    console.error("节点查找错误");
                    return;
                }
                Laya.MouseManager.enabled = false;
                GameScene.instance.switchViewByIndex(this._guide._guideTab);
                if (this.curPage != this._guide._guideTab)
                    return;
                let map = new Map();
                map.set("x", point.x + this._guide._guideNodeOffset.x);
                map.set("y", point.y + this._guide._guideNodeOffset.y);
                map.set("width", this._guide._guideSize.width);
                map.set("height", this._guide._guideSize.height);
                let isshowbub = this.ISShowBub(point);
                let isshowbarr = this.ISShowArr(point);
                this.guideView = new GuideView(map, isshowbub, isshowbarr);
                Laya.MouseManager.enabled = true;
                this._closeGuide = false;
            }
            if (this._freeguide != null && this.freeGuideLabel == null) {
                for (let i in this._freeguide._guideOpen) {
                    if (!this.FreeJudgeCondition(Number(i), this._freeguide._guideOpen[i]) && this._freecurid == this._freeguide._guideID) {
                        return;
                    }
                }
                this.freeGuideLabel = new GuideLabel(this._freeguide._guidestrdeclare, this._freeguide._guideTxtColor, this._freeguide._guidestrpopoexcursion);
            }
            if (this._freeguide != null && this.freeGuideLabel != null) {
                for (let i in this._freeguide._guideOver) {
                    if (!this.FreeOverCondition(Number(i), this._freeguide._guideOver[i]) && this._freecurid == this._freeguide._guideID) {
                        return;
                    }
                }
                this.FreeNextStep();
            }
        }
        OnDestroy() {
        }
        JudgeCondition(index, value) {
            value = Number(value);
            switch (index) {
                case ActiveType.Stars:
                    return this.StarsIsEnough(value);
                case ActiveType.Glod:
                    return this.GlodIsEnough(value);
                case ActiveType.ConnNum:
                    return this.ConnNumIsEnough(value);
                case ActiveType.ActiveUI:
                    return this.UIIsVisiOfName(value);
                default:
                    {
                        console.log("老哥 程序这边没有你配的激活条件");
                        break;
                    }
            }
            return false;
        }
        FreeJudgeCondition(index, value) {
            switch (index) {
                case FreeGuideOpen.UI:
                    return this.UIISVis(value);
                case FreeGuideOpen.Scene:
                    return this.ConnNumIsEnough(value);
                case FreeGuideOpen.DiyNum:
                    return this.GetDIYNumber(value);
                default:
                    {
                        console.log("老哥 程序这边没有你配的开启条件");
                        break;
                    }
            }
            return false;
        }
        FreeOverCondition(index, value) {
            switch (index) {
                case FreeGuideOver.DiyNum:
                    return this.GetDIYNumber(value);
                case FreeGuideOver.Click:
                    return this.ConnNumIsEnough(value);
                default:
                    {
                        console.log("老哥 程序这边没有你配的开启条件");
                        break;
                    }
            }
            return false;
        }
        SplitToStr(str, sym) {
            return str.split(sym);
        }
        FindNodeByDir(list) {
            let root = GameScene.instance.scene3d;
            for (let i in list) {
                let node = root.getChildByName(list[i]);
                root = node;
                if (Number(i) == list.length - 1) {
                    return root;
                }
            }
            return null;
        }
        FindNodeByDir2D(list, view, index) {
            let node = null;
            while (index < list.length) {
                let name = list[index];
                node = view.getChildByName(name);
                view = node;
                index += 1;
            }
            return node;
        }
        ISShowBub(point) {
            let data1 = { x: point.x + this._guide._guideDecOffset.x, y: point.y + this._guide._guideDecOffset.y };
            let data = [false, this._guide._guideDec, data1, null, this._guide._guideTxtColor];
            if (this._guide._guideDec != "") {
                data[0] = true;
            }
            return data;
        }
        ISShowArr(point) {
            let data1 = { x: point.x + this._guide._guideAniOffset.x, y: point.y + this._guide._guideAniOffset.y };
            let data = [false, this._guide._guideAni, data1, this._guide._guideAni];
            if (this._guide._guideAni != "") {
                data[0] = true;
            }
            return data;
        }
        ShowNewUI() {
            if (this._guide._guideOpenUI.length > 0) {
                for (let i in this._guide._guideOpenUI) {
                    GEvent.DispatchEvent(GacEvent.OnShowUI_propagandist);
                }
            }
        }
        StarsIsEnough(starnum) {
            return Player.getInstance().nStar >= starnum ? true : false;
        }
        GlodIsEnough(glodnum) {
            return Player.getInstance().nGold >= glodnum ? true : false;
        }
        ConnNumIsEnough(connnum) {
            return SaveManager.getInstance().GetCache(ModelStorage.ConnNum) >= connnum ? true : false;
        }
        UIIsVisiOfName(id) {
            return this.curPage == id ? true : false;
        }
        GetDIYNumber(num) {
            if (num == DIYScene.instance.getPottedTreeNumber()) {
                return true;
            }
            return false;
        }
        UIISVis(name) {
            let view = ViewManager.getInstance().GetViewByName(name);
            if (view && view.visible) {
                return true;
            }
            return false;
        }
        GetGuideState() {
            if (Constant_Cfg[14].value == 0)
                return true;
            if (this._curid >= 3) {
                return true;
            }
            return false;
        }
    }
    var ActiveType;
    (function (ActiveType) {
        ActiveType[ActiveType["Stars"] = 0] = "Stars";
        ActiveType[ActiveType["Glod"] = 1] = "Glod";
        ActiveType[ActiveType["ConnNum"] = 2] = "ConnNum";
        ActiveType[ActiveType["ActiveUI"] = 3] = "ActiveUI";
    })(ActiveType || (ActiveType = {}));
    var ClassType;
    (function (ClassType) {
        ClassType[ClassType["Scene"] = 1] = "Scene";
        ClassType[ClassType["UI"] = 2] = "UI";
    })(ClassType || (ClassType = {}));
    class GuideInfo {
        constructor(parameters, ID) {
            this._guideID = 0;
            this._guideNode = [];
            this._guideSize = { width: 0, height: 0 };
            this._guideAniOffset = { x: 0, y: 0 };
            this._guideClassType = 1;
            this._guideType = 1;
            this._guideActive = {};
            this._guideCloseAllUI = false;
            this._guideDec = "";
            this._guideDecOffset = { x: 0, y: 0 };
            this._guideTab = 0;
            this._guideClickPoint = "";
            this._guidesavepoint = 0;
            this._guideNodeOffset = { x: 0, y: 0 };
            this._guideUIFindType = 1;
            this._guideTxtColor = "";
            this._guideOpenUI = [];
            this._guideID = ID;
            this._guideData = parameters;
            this._guideNode = [];
            if (this._guideData["strnode"].indexOf("/") != -1) {
                this._guideNode = this._guideData["strnode"].split("/");
            }
            else {
                this._guideNode.push(this._guideData["strnode"]);
            }
            let guidesize = this._guideData["strregion_size"].split("*");
            this._guideSize.width = Number(guidesize[0]);
            this._guideSize.height = Number(guidesize[1]);
            this._guideAni = this._guideData["strindicate"];
            let guideoffset = this._guideData["strexcursion"].split(",");
            this._guideAniOffset.x = Number(guideoffset[0]);
            this._guideAniOffset.y = Number(guideoffset[1]);
            this._guideClassType = this._guideData["object_type"];
            this._guideType = this._guideData["guide_type"];
            this._guideNextID = this._guideData["next"];
            this.SetGuideActiveInfo(this._guideData["strtouch_off"]);
            this._guideCloseAllUI = this._guideData["Close_all"] == 1 ? false : true;
            this.SetColor(this._guideData["strdeclare"]);
            let guidedecoffset = this._guideData["strpopoexcursion"].split(",");
            this._guideDecOffset.x = Number(guidedecoffset[0]);
            this._guideDecOffset.y = Number(guidedecoffset[1]);
            this._guideClickPoint = this._guideData["strClickPoint"];
            this._guideTab = this._guideData["paging"];
            this._guidesavepoint = this._guideData["save"];
            let guideNodeOffset = this._guideData["strNodeExcursion"].split(",");
            this._guideNodeOffset.x = Number(guideNodeOffset[0]);
            this._guideNodeOffset.y = Number(guideNodeOffset[1]);
            this._guideUIFindType = this._guideData["uifindtype"];
            if (this._guideData["stropen"].indexOf(",") != -1) {
                let data = this._guideData["stropen"].split(",");
                for (let i in data) {
                    this._guideOpenUI.push(data[i]);
                }
            }
            else {
                if (this._guideData["stropen"] != "") {
                    this._guideOpenUI.push(this._guideData["stropen"]);
                }
            }
        }
        SetGuideActiveInfo(str) {
            var first = str.indexOf("{");
            var end = str.indexOf("}");
            var alldata = str.substring(first + 1, end);
            var par = alldata.split(",");
            for (let i in par) {
                let evedata = par[i].split(":");
                this._guideActive[evedata[0]] = evedata[1];
            }
        }
        SetColor(str) {
            if (str.indexOf("[") != -1) {
                var first = str.indexOf("[");
                var end = str.indexOf("]");
                var alldata = str.substring(first + 1, end);
                this._guideTxtColor = alldata;
                let guidedecoffset = this._guideData["strdeclare"].split("]");
                this._guideDec = guidedecoffset[1];
            }
            else {
                this._guideTxtColor = "#FFFFFF";
                this._guideDec = str;
            }
        }
    }
    var FreeGuideOpen;
    (function (FreeGuideOpen) {
        FreeGuideOpen[FreeGuideOpen["UI"] = 1] = "UI";
        FreeGuideOpen[FreeGuideOpen["Scene"] = 2] = "Scene";
        FreeGuideOpen[FreeGuideOpen["DiyNum"] = 3] = "DiyNum";
    })(FreeGuideOpen || (FreeGuideOpen = {}));
    var FreeGuideOver;
    (function (FreeGuideOver) {
        FreeGuideOver[FreeGuideOver["DiyNum"] = 1] = "DiyNum";
        FreeGuideOver[FreeGuideOver["Click"] = 2] = "Click";
    })(FreeGuideOver || (FreeGuideOver = {}));
    class FreeGuideInfo {
        constructor(parameters, ID) {
            this._guideID = 0;
            this._guidesave = 0;
            this._guideClassType = 1;
            this._guideOpen = {};
            this._guideOver = {};
            this._guidestrpopoexcursion = { x: 0, y: 0 };
            this._guidestrdeclare = "";
            this._guideTxtColor = "";
            this._guideID = ID;
            this._guideData = parameters;
            this._guidesave = this._guideData["save"];
            this._guideClassType = this._guideData["object_type"];
            this._guideNextID = this._guideData["next"];
            this.SetGuideActiveInfo(this._guideData["strtouch_off"], this._guideOver);
            this.SetGuideActiveInfo(this._guideData["stropen"], this._guideOpen);
            let guidedecoffset = this._guideData["strpopoexcursion"].split(",");
            this._guidestrpopoexcursion.x = Number(guidedecoffset[0]);
            this._guidestrpopoexcursion.y = Number(guidedecoffset[1]);
            this.SetColor(this._guideData["strdeclare"]);
        }
        SetColor(str) {
            if (str.indexOf("[") != -1) {
                var first = str.indexOf("[");
                var end = str.indexOf("]");
                var alldata = str.substring(first + 1, end);
                this._guideTxtColor = alldata;
                let guidedecoffset = this._guideData["strdeclare"].split("]");
                this._guidestrdeclare = guidedecoffset[1];
            }
            else {
                this._guideTxtColor = "#FFFFFF";
                this._guidestrdeclare = str;
            }
        }
        SetGuideActiveInfo(str, cla) {
            var first = str.indexOf("{");
            var end = str.indexOf("}");
            var alldata = str.substring(first + 1, end);
            var par = alldata.split(",");
            for (let i in par) {
                let evedata = par[i].split(":");
                cla[evedata[0]] = evedata[1];
            }
        }
    }

    var DiyUI = ui.view.DiySceneUI;
    var URLS;
    (function (URLS) {
        URLS["json_Box_Item"] = "prefab/BoxItem.json";
        URLS["zuoanniu1"] = "gameui/btn-zuoanniu1.png";
        URLS["zuoanniu2"] = "gameui/btn-zuoanniu2.png";
        URLS["youanniu1"] = "gameui/btn-youanniu1.png";
        URLS["youanniu2"] = "gameui/btn-youanniu2.png";
    })(URLS || (URLS = {}));
    class DiyView extends DiyUI {
        constructor(data) {
            super();
            this.mouseState = false;
            this._caneraAngle = false;
            this.vRotation = 0;
            this.dMouseX = 0;
            this.curTreeData = null;
            this.followImg = null;
            this.maxPottedTreesNum = 9;
            this.editState = false;
            this.nTreeCreate = 550;
            this.nRoll = 300;
            this.hBG1 = 222;
            this.hBG2 = 360;
            this.hBtn2 = 315;
            this.hBtn1 = 176;
            this.sBtn1 = "gameui/list/kai.png";
            this.sBtn2 = "gameui/list/guan.png";
            this.hList1 = 113;
            this.hList2 = 260;
            if (GuideManager.getInstance().CurFreeGuide != null && GuideManager.getInstance().CurFreeGuide._guideID < 4) {
                this.back.visible = false;
            }
            else {
                this.back.visible = true;
            }
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.BtnEvent();
            this.dCreateList();
            this.zCreateList();
            this.refreshList();
            this.showTree();
            this.setPottedTreesNum();
        }
        onDestroy() {
            this.dBtn.offAll();
            this.zBtn.offAll();
            this.qBtn.offAll();
            this.back.offAll();
            this.finish.offAll();
            this.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            this.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            this.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
            this.back.off(Laya.Event.CLICK, this, this.Back);
            this.finish.off(Laya.Event.CLICK, this, this.OpenScorePanel);
            this.up_down.offAll();
            Laya.stage.off(CommonDefine.EVENT_CREATE_TREE_FINISH, this, this.createTreeFinish);
            Laya.stage.off(CommonDefine.EVENT_POTTED_CHANGE, this, this.setPottedTreesNum);
            Laya.stage.off(CommonDefine.EVENT_POT_INIT_FINISH, this, this.setPottedTreesNum);
            Laya.stage.off(CommonDefine.EVENT_EDIT, this, this.isEdit);
            Laya.stage.off(CommonDefine.EVENT_DIYUI_REFRESH, this, this.refreshList);
            SceneManager.getInstance().openScene(GameScene.instance);
            this.bottomTab.offAll();
        }
        BtnEvent() {
            this.dBtn.on(Laya.Event.CLICK, this, this.showTree);
            this.zBtn.on(Laya.Event.CLICK, this, this.decorate);
            this.qBtn.on(Laya.Event.CLICK, this, this.caneraAngle);
            this.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            this.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            this.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            this.back.on(Laya.Event.CLICK, this, this.Back);
            this.finish.on(Laya.Event.CLICK, this, this.OpenScorePanel);
            this.up_down.on(Laya.Event.CLICK, this, this.upDown);
            Laya.stage.on(CommonDefine.EVENT_CREATE_TREE_FINISH, this, this.createTreeFinish);
            Laya.stage.on(CommonDefine.EVENT_POTTED_CHANGE, this, this.setPottedTreesNum);
            Laya.stage.on(CommonDefine.EVENT_POT_INIT_FINISH, this, this.setPottedTreesNum);
            Laya.stage.on(CommonDefine.EVENT_EDIT, this, this.isEdit);
            Laya.stage.on(CommonDefine.EVENT_DIYUI_REFRESH, this, this.refreshList);
            this.bottomTab.on(Laya.Event.MOUSE_OVER, this, this.bottomTabOver);
            this.bottomTab.on(Laya.Event.MOUSE_OUT, this, this.bottomTabOut);
        }
        isEdit(state) {
            if (state) {
                this.joinEdit();
            }
            else {
                this.outEdit();
            }
        }
        setPottedTreesNum() {
            this.maxPottedTreesNum = DIYScene.instance.getPottedMaxNum() || 9;
            let _item = this.bottom_clip_box.getChildByName("item");
            let n = DIYScene.instance.getPottedTreeNumber();
            n = n || 0;
            let _n = n.toString();
            let _maxPottedTreesNum = this.maxPottedTreesNum.toString();
            _item.removeChildren();
            let nOffset = 0;
            nOffset = _n.length > 1 ? 80 : 102;
            for (let index = 0; index < _n.length; index++) {
                const element = _n[index];
                let _arr = [this.content.x + nOffset + index * 22, this.content.y + 6, element, "gameui/main/number.png", 10, 1];
                let img = Utils.getClipNum(_arr);
                img.scale(1.4, 1.4);
                _item.addChild(img);
            }
            for (let index = 0; index < _maxPottedTreesNum.length; index++) {
                const element = _maxPottedTreesNum[index];
                let _arr = [this.content.x + 150 + index * 22, this.content.y + 6, element, "gameui/main/number.png", 10, 1];
                let img = Utils.getClipNum(_arr);
                img.scale(1.4, 1.4);
                _item.addChild(img);
            }
            if (n >= this.maxPottedTreesNum) {
                this.listGrayState = true;
                this.toolState(true);
            }
            else {
                this.listGrayState = false;
                this.toolState(false);
            }
            if (n <= 0 || n > this.maxPottedTreesNum) {
                this.finish.disabled = true;
            }
            else {
                this.finish.disabled = false;
            }
        }
        OpenScorePanel() {
            DIYScene.instance.savePotted();
            EffectManager.getInstance().BtnEffect(this.finish);
            GameUIManager.getInstance().showUI(DIYFinishView);
            GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 4);
        }
        refreshList() {
            this.dToolList.array = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_DUOROU);
            this.zToolList.array = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_ZHUANGSHI);
            let tPot = DIYScene.instance.getPotted();
            if (tPot != null) {
                let data = tPot.GetNextTwoNode();
                this.second.skin = "gameui/flowerstate/potquality" + data[0] + ".png";
                this.trird.skin = "gameui/flowerstate/potquality" + data[1] + ".png";
                let va = tPot.quality / Constant_Cfg[9].value[data[1]];
                this.diyeva.value = va / 2 + 0.5;
                this.curfen.skin = tPot.GetQualityImg();
            }
        }
        dCreateList() {
            this.dToolList.array = [];
            this.dToolList.renderHandler = Laya.Handler.create(this, this.dToolListRender, null, false);
            this.dToolList.hScrollBarSkin = "";
        }
        zCreateList() {
            this.zToolList.array = [];
            this.zToolList.renderHandler = Laya.Handler.create(this, this.zCreateListRender, null, false);
            this.zToolList.hScrollBarSkin = "";
        }
        dToolListRender(cell) {
            let _item = cell.getChildByName("item");
            let _data = Succulent_Cfg[cell.dataSource.itemId];
            _data["id"] = cell.dataSource.itemId;
            _item.skin = _data.striconurl;
            this.addClipNum(cell);
            _item.offAll();
            _item.on(Laya.Event.MOUSE_DOWN, this, this.createListItemMouseDown, [_data, cell]);
            _item.on(Laya.Event.MOUSE_MOVE, this, this.createListItemMouseMove);
            _item.on(Laya.Event.MOUSE_OUT, this, this.createListItemMouseOut);
        }
        zCreateListRender(cell) {
            let _item = cell.getChildByName("item");
            let _data = Succulent_Cfg[cell.dataSource.itemId];
            _data["id"] = cell.dataSource.itemId;
            _item.skin = _data.striconurl;
            this.addClipNum(cell);
            _item.offAll();
            _item.on(Laya.Event.MOUSE_DOWN, this, this.createListItemMouseDown, [_data, cell]);
            _item.on(Laya.Event.MOUSE_MOVE, this, this.createListItemMouseMove);
            _item.on(Laya.Event.MOUSE_OUT, this, this.createListItemMouseOut);
        }
        addClipNum(cell) {
            let _clip_box = cell.getChildByName("clip_box");
            let _itemNum = cell.dataSource.itemNum.toString();
            let _num = cell.getChildByName("num");
            _clip_box.removeChildren();
            for (let index = 0; index < _itemNum.length; index++) {
                const element = _itemNum[index];
                let _arr = [_num.x + 60 + index * 16, _num.y, element, "gameui/main/number.png", 10, 1];
                let img = Utils.getClipNum(_arr);
                _clip_box.addChild(img);
            }
        }
        createListItemMouseUp() {
            this.mouseState = false;
            this.curTreeData = null;
            this.curItemPosX = 0;
            this.curItemPosY = 0;
            this.clearFollowImg();
            this.clearGray();
        }
        createListItemMouseDown(data, box) {
            if (this.editState || this.listGrayState || this.mouseState)
                return;
            this.mouseState = true;
            this.curTreeData = data;
            this.curCheckedBoxItem = box.getChildByName("item");
            this.curCheckedBoxBg = box.getChildByName("bg");
            this.setGray();
        }
        createListItemMouseOut() {
            if (!this.mouseState)
                return;
            this.mouseState = false;
        }
        createListItemMouseMove() {
            if (!this.curTreeData)
                return;
            let _y = Laya.stage.mouseY;
            if ((_y - this.curItemPosY) > 120) {
                this.setFollowImg(this.curTreeData.striconurl);
                this.dToolList.scrollBar.stopScroll();
                this.zToolList.scrollBar.stopScroll();
            }
            else {
                this.clearFollowImg();
            }
        }
        setFollowImg(imgUrl) {
            if (!this.followImg) {
                this.followImg = new Laya.Image(imgUrl);
                this.addChild(this.followImg);
                this.followImg.width = 140;
                this.followImg.height = 120;
                this.followImg.name = "0990";
            }
            if (this.followImg) {
                this.followImg.x = Laya.stage.mouseX - this.followImg.width / 2;
                this.followImg.y = Laya.stage.mouseY - this.followImg.height;
            }
        }
        clearFollowImg() {
            if (this.followImg) {
                this.followImg.destroy();
                this.followImg = null;
            }
        }
        createTreeFinish() {
            this.clearGray();
        }
        Finished(CLICK, arg1, Finished) {
            Debug.Log("完成");
            DIYScene.instance.savePoint();
            this.BackHome();
        }
        Back(CLICK, arg1, Back) {
            EffectManager.getInstance().BtnEffect(this.back);
            Debug.Log("退出");
            GameUIManager.getInstance().createUI(TipViewScene, [null, "是否放弃本次操作，当前修改会取消", true, this.BackHome]);
        }
        BackHome() {
            DIYScene.instance.potted && DIYScene.instance.potted.clearSelect();
            GameUIManager.getInstance().destroyUI(DiyView);
            GameUIManager.getInstance().destroyUI(DiyToolView);
            DIYScene.instance.payBack();
        }
        mouseDown(e) {
            this.dMouseX = e["stageX"];
            this.curItemPosX = Laya.stage.mouseX;
            this.curItemPosY = Laya.stage.mouseY;
        }
        mouseUp() {
            this.dMouseX = 0;
            this.curTreeData = null;
            this.clearFollowImg();
            this.clearGray();
        }
        mouseMove(e) {
            this.createListItemMouseMove();
            let _is = e["stageY"] < this.nTreeCreate ? true : false;
            if (!_is) {
                if (this.curTreeData) {
                    Laya.stage.event(CommonDefine.EVENT_CREATE_TREE, [this.curTreeData.id]);
                    this.curTreeData = null;
                    this.clearFollowImg();
                }
                return;
            }
        }
        curCircleRotation(v) {
            this.vRotation = v;
            this.curCircle.rotation = v;
        }
        toolsArrayItemRotation(target, v) {
            if (target) {
                for (let index = 0; index < target.numChildren; index++) {
                    const element = target.getChildAt(index);
                    element.rotation = -v;
                }
            }
        }
        caneraAngle() {
            EffectManager.getInstance().BtnEffect(this.qBtn);
            this._caneraAngle = !this._caneraAngle;
            DIYScene.instance.caneraAngle(this._caneraAngle);
        }
        decorate() {
            EffectManager.getInstance().BtnEffect(this.zBtn);
            this.clickTarget = 2;
            this.dToolList.visible = false;
            this.zToolList.visible = true;
            this.dBtn.skin = URLS.zuoanniu1;
            this.zBtn.skin = URLS.youanniu2;
            this.dBtn.getChildAt(0).color = "#8f5c2a";
            this.dBtn.getChildAt(0).strokeColor = "#fff";
            this.zBtn.getChildAt(0).color = "#fff";
            this.zBtn.getChildAt(0).strokeColor = "#8f5c2a";
            this.changeListBg(0);
            this.refreshList();
        }
        showTree() {
            EffectManager.getInstance().BtnEffect(this.dBtn);
            this.clickTarget = 1;
            this.dToolList.visible = true;
            this.zToolList.visible = false;
            this.dBtn.skin = URLS.zuoanniu2;
            this.zBtn.skin = URLS.youanniu1;
            this.dBtn.getChildAt(0).color = "#fff";
            this.dBtn.getChildAt(0).strokeColor = "#8f5c2a";
            this.zBtn.getChildAt(0).color = "#8f5c2a";
            this.zBtn.getChildAt(0).strokeColor = "#fff";
            this.changeListBg(0);
            this.refreshList();
        }
        setGray() {
            if (this.curCheckedBoxItem && this.curCheckedBoxBg) {
                this.curCheckedBoxItem.gray = true;
                this.curCheckedBoxBg.gray = true;
            }
        }
        clearGray() {
            if (this.curCheckedBoxItem && this.curCheckedBoxBg) {
                this.curCheckedBoxItem.gray = false;
                this.curCheckedBoxBg.gray = false;
            }
        }
        joinEdit() {
            this.back.disabled = true;
            this.finish.disabled = true;
            this.dBtn.disabled = true;
            this.zBtn.disabled = true;
            this.editState = true;
            this.toolState(true);
        }
        outEdit() {
            let n = DIYScene.instance.getPottedTreeNumber() || 0;
            let nMax = DIYScene.instance.getPottedMaxNum() || 9;
            this.back.disabled = false;
            this.finish.disabled = (n <= 0 || n > nMax) ? true : false;
            this.dBtn.disabled = false;
            this.zBtn.disabled = false;
            this.editState = false;
            if (this.listGrayState)
                return;
            this.toolState(false);
        }
        toolState(b) {
            for (let index = 0; index < this.dToolList.numChildren; index++) {
                const element = this.dToolList.getChildAt(index);
                element.disabled = b;
            }
            for (let index = 0; index < this.zToolList.numChildren; index++) {
                const element = this.zToolList.getChildAt(index);
                element.disabled = b;
            }
        }
        upDown() {
            if (this.img_bg.height == this.hBG1) {
                this.changeListBg(1);
                this.refreshList();
            }
            else {
                this.changeListBg(0);
                this.refreshList();
            }
        }
        changeListBg(state) {
            if (state == 1) {
                this.img_bg.height = this.hBG2;
                this.up_down.skin = this.sBtn2;
                this.up_down.y = this.hBtn2;
                if (this.zToolList.visible) {
                    this.zToolList.scrollBar.value = 0;
                    this.zToolList.repeatY = 2;
                    this.zToolList.height = this.hList2;
                }
                if (this.dToolList.visible) {
                    this.dToolList.scrollBar.value = 0;
                    this.dToolList.repeatY = 2;
                    this.dToolList.height = this.hList2;
                }
            }
            else {
                this.img_bg.height = this.hBG1;
                this.up_down.skin = this.sBtn1;
                this.up_down.y = this.hBtn1;
                if (this.zToolList.visible) {
                    this.zToolList.repeatY = 1;
                    this.zToolList.height = this.hList1;
                }
                if (this.dToolList.visible) {
                    this.dToolList.repeatY = 1;
                    this.dToolList.height = this.hList1;
                }
            }
        }
        bottomTabOver() {
            Global.sceneLock = true;
        }
        bottomTabOut() {
            Global.sceneLock = false;
        }
    }

    class DIYFinishView extends ui.view.DIYFinishViewUI {
        constructor(data) {
            super();
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.InitEvent();
            this.InitView();
        }
        onDisable() {
        }
        onDestroy() {
            this.makeSureBtn.offAll();
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(DIYFinishView);
        }
        InitEvent() {
        }
        InitView() {
            this.scorePanel.visible = true;
            this.scorePanel.mouseEnabled = true;
            let tPot = DIYScene.instance.getPotted();
            let id = 3;
            let scale = 1;
            let box = this.eff_bg;
            let eff = new Avatars(box);
            let isloop = false;
            let aniName = tPot ? tPot.GetQualityName() : "";
            eff.Load(Effect_Cfg[id].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
                eff.Play(aniName, isloop, true, () => {
                    this.makeSureBtn.visible = true;
                    this.makeSureBtn.on(Laya.Event.CLICK, this, this.Finished);
                });
            }));
            DIYScene.instance.savePoint();
            DIYScene.instance.potted && DIYScene.instance.potted.clearSelect();
            return eff;
        }
        Finished() {
            this.onClose();
            GameUIManager.getInstance().destroyUI(DiyView);
            GameUIManager.getInstance().destroyUI(DiyToolView);
        }
    }

    class FlowerpotSelView extends ui.view.Flowerpot.FlowerpotSelViewUI {
        constructor(pointName) {
            super();
            this._pointName = "";
            this._pointIndex = 0;
            this._potData = [];
            this._pointName = pointName[0];
            this._pointIndex = pointName[1];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.InitEvent();
            this.InitView();
        }
        onDisable() {
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(FlowerpotSelView);
        }
        InitEvent() {
            this.closeBtn.on(Laya.Event.CLICK, this, this.onClose);
        }
        InitView() {
            this.SetPotList();
        }
        UpdatePotData() {
            if (!this._pointName)
                return;
            let _data = Succulentpoint_Cfg[this._pointName].flowerpot;
            let _arr = [];
            if (Object.keys(_data).length > 0) {
                for (const key in _data) {
                    if (Object.prototype.hasOwnProperty.call(_data, key)) {
                        const element = _data[key];
                        let eItem = Succulent_Cfg[element];
                        eItem.id = element;
                        _arr.push(eItem);
                    }
                }
            }
            else {
                let eItem = Succulent_Cfg[_data];
                eItem.id = _data;
                _arr.push(eItem);
            }
            this._potData = _arr;
            function SortFun(tLeft, tRight) {
                let nleftLock = Player.getInstance().tPotData[tLeft.id] ? 1 : 0;
                let nRightLock = Player.getInstance().tPotData[tRight.id] ? 1 : 0;
                if (nleftLock != nRightLock)
                    return nleftLock > nRightLock ? -1 : 1;
                let nleftcan = (Player.getInstance().nStar >= Succulent_Cfg[tLeft.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tLeft.id].gold) ? 1 : 0;
                let nRightcan = (Player.getInstance().nStar >= Succulent_Cfg[tRight.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tRight.id].gold) ? 1 : 0;
                if (nleftcan != nRightcan)
                    return nleftcan > nRightcan ? -1 : 1;
                return tLeft.id < tRight.id ? -1 : 1;
            }
            this._potData.sort(SortFun);
        }
        SetPotList() {
            this.UpdatePotData();
            this.potList.array = this._potData;
            this.potList.renderHandler = new Laya.Handler(this, this.renderHandler);
            this.potList.vScrollBarSkin = "";
        }
        renderHandler(item, index) {
            let tPot = item.getChildByName("img_pot");
            let tVolume = item.getChildByName("la_volume");
            let tLockCon = item.getChildByName("la_lockcon");
            let tunLockCon = item.getChildByName("la_unlockcon");
            let tBg = item.getChildByName("img_bg");
            tPot.skin = this._potData[index].striconurl;
            tVolume.text = Utils.format("容量:{0}", this._potData[index].capacity || 0);
            tLockCon.visible = false;
            tunLockCon.visible = false;
            tPot.disabled = false;
            tBg.visible = index % 3 == 0;
            if (!(Player.getInstance().tPotData[this._potData[index].id])) {
                if (this.GetPotIsCanUnLock(this._potData[index].id)) {
                    tLockCon.visible = true;
                }
                else {
                    tPot.disabled = true;
                    tunLockCon.visible = true;
                }
            }
            item.on(Laya.Event.CLICK, this, this.OnClickPot, [index]);
        }
        OnClickPot(index) {
            let potId = this._potData[index].id;
            GameUIManager.getInstance().createUI(FlowerpotTipsView, [this._pointName, this._pointIndex, potId]);
        }
        GetPotIsCanUnLock(potId) {
            if (Player.getInstance().nStar < Succulent_Cfg[potId].unlockstar) {
                return false;
            }
            if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
                return false;
            }
            return true;
        }
    }

    class FlowerpotTipsView extends ui.view.Flowerpot.FlowerpotTipsViewUI {
        constructor(data) {
            super();
            this._pointName = "";
            this._pointIndex = 0;
            this._potData = [];
            this._pointName = data[0];
            this._pointIndex = data[1];
            this.curPottedId = data[2];
            this.callback = data[3];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.InitEvent();
            this.InitView();
        }
        onDisable() {
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(FlowerpotTipsView);
        }
        InitEvent() {
            this.cBtn.on(Laya.Event.CLICK, this, this.onClose);
            this.tBtn.on(Laya.Event.CLICK, this, this.OnSure);
        }
        InitView() {
            this.img_potbg.y = 66;
            if (Player.getInstance().tPotData[this.curPottedId]) {
                this.lockPanel.visible = false;
                this.title.text = Utils.format("使用{0}花盆", Succulent_Cfg[this.curPottedId].strname || "00");
                this.img_potbg.y = 86;
                this.useVolumePanel.visible = true;
                this.la_usevolume.text = Succulent_Cfg[this.curPottedId].capacity;
                this.img_sure.visible = true;
                this.img_money.visible = false;
                this.volumePanel.visible = false;
            }
            else {
                this.useVolumePanel.visible = false;
                this.condition0.text = Succulent_Cfg[this.curPottedId].unlockstar;
                if (Player.getInstance().nStar < Succulent_Cfg[this.curPottedId].unlockstar) {
                    this.tBtn.disabled = true;
                    this.condition0.color = "#FF0000";
                }
                this.condition1.text = Succulent_Cfg[this.curPottedId].givestar;
                this.condition2.text = Succulent_Cfg[this.curPottedId].gold;
                if (Player.getInstance().nGold < Succulent_Cfg[this.curPottedId].gold) {
                    this.condition2.color = "#FF0000";
                    this.tBtn.disabled = true;
                }
                this.condition2.visible = true;
                this.title.text = Utils.format("购买{0}花盆", Succulent_Cfg[this.curPottedId].strname || "00");
            }
            this.la_volume.text = Utils.format("容量：{0}", Succulent_Cfg[this.curPottedId].capacity);
            this.img_pot.skin = Succulent_Cfg[this.curPottedId].striconurl;
        }
        OnSure() {
            EffectManager.getInstance().BtnEffect(this.tBtn);
            if (!Player.getInstance().tPotData[this.curPottedId]) {
                if (Player.getInstance().nStar >= Succulent_Cfg[this.curPottedId].unlockstar &&
                    Player.getInstance().nGold >= Succulent_Cfg[this.curPottedId].gold) {
                    Player.getInstance().refreshGold(-Succulent_Cfg[this.curPottedId].gold);
                    Player.getInstance().refreshStar(+Succulent_Cfg[this.curPottedId].givestar);
                    Player.getInstance().refreshPotData(this.curPottedId, true);
                }
            }
            this.onClose();
            GameUIManager.getInstance().destroyUI(FlowerpotSelView);
            DIYScene.instance.checkedPooted(this.curPottedId);
            this.callback.run();
        }
    }

    class DiyChangePot extends ui.view.DiyChangePotUI {
        constructor(pointName) {
            super();
            this._potData = [];
            this._pointName = "";
            this._pointIndex = 0;
            this.curPotid = -1;
            this._pointName = pointName[0];
            this._pointIndex = pointName[1];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.InitEvent();
            this.SetPotList();
            DIYScene.instance.OpenDrag = false;
            if (PotManager.getInstance().PotMap[this._pointName] != null) {
                this.curpot = DIYScene.instance.getPotted();
                this.curPotid = PotManager.getInstance().PotMap[this._pointName].PointDataList[0].containerId;
                this.SetPotData(this.curPotid, 0, false);
                this.curpot.HideTree(false);
            }
            else {
                this.SetPotData(this.curPotid, 0, false, true);
            }
        }
        onDisable() {
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(DiyChangePot);
        }
        InitEvent() {
            this.btn_click.on(Laya.Event.CLICK, this, this.OpenDiyView);
        }
        OpenDiyView() {
            if (this.curPotid != -1) {
                this.curpot.HideTree(true);
                DIYScene.instance.OpenDrag = true;
                GameUIManager.getInstance().showUI(DiyView);
                GameUIManager.getInstance().destroyUI(DiyChangePot);
                GEvent.DispatchEvent(GacEvent.GuideDiyISOver, 1);
            }
        }
        SetPotList() {
            this.UpdatePotData();
            this.potList.array = this._potData;
            this.potList.renderHandler = new Laya.Handler(this, this.renderHandler);
            this.potList.vScrollBarSkin = "";
        }
        renderHandler(item, index) {
            let tPot = item.getChildByName("img_pot");
            let tVolume = item.getChildByName("la_volume");
            let tLockCon = item.getChildByName("la_lockcon");
            let tunLockCon = item.getChildByName("la_unlockcon");
            let tBg = item.getChildByName("img_bg");
            tPot.skin = this._potData[index].striconurl;
            tVolume.text = Utils.format("容量:{0}", this._potData[index].capacity || 0);
            tLockCon.visible = false;
            tunLockCon.visible = false;
            tPot.disabled = false;
            tBg.visible = index % 4 == 0;
            if (!(Player.getInstance().tPotData[this._potData[index].id])) {
                if (this.GetPotIsCanUnLock(this._potData[index].id)) {
                    tLockCon.visible = true;
                }
                else {
                    tPot.disabled = true;
                    tunLockCon.visible = true;
                }
            }
            item.on(Laya.Event.CLICK, this, this.OnClickPot, [index]);
        }
        UpdatePotData() {
            if (!this._pointName)
                return;
            let _data = Succulentpoint_Cfg[this._pointName].flowerpot;
            let _arr = [];
            if (Object.keys(_data).length > 0) {
                for (const key in _data) {
                    if (Object.prototype.hasOwnProperty.call(_data, key)) {
                        const element = _data[key];
                        let eItem = Succulent_Cfg[element];
                        eItem.id = element;
                        _arr.push(eItem);
                    }
                }
            }
            else {
                let eItem = Succulent_Cfg[_data];
                eItem.id = _data;
                _arr.push(eItem);
            }
            this._potData = _arr;
            function SortFun(tLeft, tRight) {
                let nleftLock = Player.getInstance().tPotData[tLeft.id] ? 1 : 0;
                let nRightLock = Player.getInstance().tPotData[tRight.id] ? 1 : 0;
                if (nleftLock != nRightLock)
                    return nleftLock > nRightLock ? -1 : 1;
                let nleftcan = (Player.getInstance().nStar >= Succulent_Cfg[tLeft.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tLeft.id].gold) ? 1 : 0;
                let nRightcan = (Player.getInstance().nStar >= Succulent_Cfg[tRight.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tRight.id].gold) ? 1 : 0;
                if (nleftcan != nRightcan)
                    return nleftcan > nRightcan ? -1 : 1;
                return tLeft.id < tRight.id ? -1 : 1;
            }
            this._potData.sort(SortFun);
        }
        SetPotData(curid, potId, isclick = false, ispot = false) {
            let curpotnum = this.state_ripe.getChildByName("curpotnum");
            let potnum = this.state_ripe.getChildByName("potnum");
            curpotnum.visible = true;
            let jiantou = this.state_ripe.getChildByName("jiantou");
            if (ispot) {
                curpotnum.visible = false;
                jiantou.visible = false;
                potnum.visible = false;
                return;
            }
            jiantou.visible = isclick;
            potnum.visible = isclick;
            if (isclick) {
                potnum.text = Succulent_Cfg[potId].capacity;
            }
            if (curid != -1) {
                curpotnum.text = Succulent_Cfg[curid].capacity;
            }
        }
        GetPotIsCanUnLock(potId) {
            if (Player.getInstance().nStar < Succulent_Cfg[potId].unlockstar) {
                return false;
            }
            if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
                return false;
            }
            return true;
        }
        OnClickPot(index) {
            let potId = this._potData[index].id;
            if (!(Player.getInstance().tPotData[this._potData[index].id])) {
                if (this.GetPotIsCanUnLock(this._potData[index].id)) {
                    this.ClickOk(potId);
                    return;
                }
                else {
                    this.ClickOk(potId);
                    return;
                }
            }
            DIYScene.instance.checkedPooted(potId);
            this.SetPotData(this.curPotid, potId, true);
        }
        ClickOk(potId) {
            GameUIManager.getInstance().createUI(FlowerpotTipsView, [this._pointName, this._pointIndex, potId, Laya.Handler.create(this, () => {
                    if (this.curPotid == -1) {
                        this.SetPotData(potId, this.curPotid, false);
                    }
                    else {
                        this.SetPotData(this.curPotid, potId, true);
                    }
                    this.curPotid = potId;
                    this.curpot = DIYScene.instance.getPotted();
                    this.potList.refresh();
                })]);
        }
    }

    var Handler$2 = Laya.Handler;
    var Vector3$2 = Laya.Vector3;
    var Event$1 = Laya.Event;
    var MouseManager$1 = Laya.MouseManager;
    var Point$2 = Laya.Point;
    var Vector2$2 = Laya.Vector2;
    var ShadowMode = Laya.ShadowMode;
    var Box = Laya.Box;
    var Button = Laya.Button;
    class DIYScene extends SceneBase {
        constructor() {
            super();
            this._dragTarget = null;
            this._editTarget = null;
            this.curCheckedTree = null;
            this.caneraAngleTime = 600;
            this.point = new Vector2$2();
            this.offset = new Vector2$2();
            this._touchPoint = new Point$2();
            this._closeDistance = 2;
            this._enterType = 0;
            this.isfirst = false;
            this._treeData = null;
            this.isopendrag = false;
        }
        set OpenDrag(value) {
            this.isopendrag = value;
            if (this.script3d != null) {
                if (value) {
                    this.script3d.rotateEnable = true;
                    this.script3d.moveEnable = false;
                    this.script3d.scaleEnable = true;
                }
                else {
                    this.script3d.rotateEnable = value;
                    this.script3d.moveEnable = value;
                    this.script3d.scaleEnable = value;
                }
            }
        }
        onEnable() {
            super.onEnable();
            Laya.stage.on(Event$1.MOUSE_DOWN, this, this.onDragBegin);
            Laya.stage.on(Event$1.MOUSE_MOVE, this, this.onDragMove);
            Laya.stage.on(Event$1.MOUSE_UP, this, this.onDragEnd);
            Laya.stage.on(CommonDefine.EVENT_CREATE_TREE, this, this.createTree);
            Laya.stage.on(CommonDefine.EVENT_CHECKED_POTTED, this, this.checkedPooted);
            Laya.stage.on(CommonDefine.EVENT_CHECKED_POTTED_FINISH, this, this.checkedPottedFinish);
            Laya.stage.on(CommonDefine.EVENT_DIY_RESET_TREE, this, this.cancelAfter);
            Laya.stage.on(CommonDefine.EVENT_POTTED_CHANGEED, this, this.initCameraData);
        }
        onDisable() {
            super.onDisable();
            Laya.stage.off(Event$1.MOUSE_DOWN, this, this.onDragBegin);
            Laya.stage.off(Event$1.MOUSE_MOVE, this, this.onDragMove);
            Laya.stage.off(Event$1.MOUSE_UP, this, this.onDragEnd);
            Laya.stage.off(CommonDefine.EVENT_CREATE_TREE, this, this.createTree);
            Laya.stage.off(CommonDefine.EVENT_CHECKED_POTTED, this, this.checkedPooted);
            Laya.stage.off(CommonDefine.EVENT_CHECKED_POTTED_FINISH, this, this.checkedPottedFinish);
            Laya.stage.off(CommonDefine.EVENT_DIY_RESET_TREE, this, this.cancelAfter);
            Laya.stage.off(CommonDefine.EVENT_POTTED_CHANGEED, this, this.initCameraData);
        }
        get editorMode() {
            return this._editorMode;
        }
        set editorMode(b) {
            this._editorMode = b;
            if (b) {
                this.potted.setSelect(this._editTarget);
                this._selectTarget = true;
                this.script3d.rotateEnable = false;
            }
            else {
                this._editTarget = null;
                this.potted.clearSelect();
                this.script3d.rotateEnable = true;
            }
        }
        set editTarget(tar) {
            this._editTarget = tar;
        }
        get getCurCheckedTree() {
            return this.curCheckedTree;
        }
        static get instance() {
            if (!DIYScene._instance)
                DIYScene._instance = new DIYScene();
            return DIYScene._instance;
        }
        showScene(param, handler) {
            super.showScene(param, handler);
            this._pointName = param[0];
            this._pointIndex = param[1];
            this._enterType = param[2] || 0;
            this._callback = handler;
            this.isfirst = param[3] != null ? param[3] : false;
            if (!this.scene3d) {
                Laya.loader.create("res/scene/viewscene/Scenes_duorou.ls", Handler$2.create(this, this.onSceneLoaded));
            }
            else {
                this.addChild(this.scene3d);
                this.checkCache(this._pointName);
                GameUIManager.getInstance().hideTopUI(LoadingScenes1);
                this._callback && this._callback.run();
                GameUIManager.getInstance().createUI(DiyChangePot, [this._pointName, 0]);
            }
            GameUIManager.getInstance().hideUI(SwitchScene);
        }
        onSceneLoaded(scene3d) {
            scene3d.getChildByName("Object").getChildByName("Particle System (1)").active = false;
            scene3d.fogStart = 4;
            this.scene3d = scene3d;
            this.addChild(scene3d);
            this.camera = scene3d._cameraPool[0];
            this.script3d = this.camera.addComponent(MouseController);
            this.script3d.rotateEnable = false;
            this.script3d.moveEnable = false;
            this.script3d.scaleEnable = false;
            Utils.createBloom(this.camera, { intensity: 4, threshold: 1.1, softKnee: 0.5, clamp: 65472, diffusion: 5, anamorphicRatio: 0.0, color: new Laya.Color(1, 0.84, 0, 1), fastMode: true });
            this.ground = scene3d.getChildByName("Object").getChildByName("dimian");
            this.light = scene3d.getChildByName("Spot Light (1)");
            this.ground.meshRenderer.receiveShadow = true;
            this.light.shadowMode = ShadowMode.SoftHigh;
            this.light.shadowDistance = 4;
            this.light.shadowResolution = 1024;
            this.light.shadowDepthBias = 1.0;
            this.light.shadowStrength = 0.6;
            this.light.shadowNearPlane = 0.001;
            this.checkCache(this._pointName);
            GameUIManager.getInstance().hideTopUI(LoadingScenes1);
            if (this._callback) {
                this._callback.run();
            }
            ResourceManager.getInstance().getResource("res/scene/mainscene/Scenes_huayuan.ls", null);
        }
        initCameraData(pottedId) {
            if (!Tree_Cfg[pottedId])
                return;
            this._size = Tree_Cfg[pottedId].big;
            var str = Tree_Cfg[pottedId].str1position;
            var arr = str.split(",");
            this._frontPos = new Vector3$2(Number(arr[0]), Number(arr[1]), Number(arr[2]));
            str = Tree_Cfg[pottedId].str1rotation;
            arr = str.split(",");
            this._frontRot = new Vector3$2(-Number(arr[0]), Number(arr[1]) - 180, Number(arr[2]));
            str = Tree_Cfg[pottedId].str2position;
            arr = str.split(",");
            this._topPos = new Vector3$2(Number(arr[0]), Number(arr[1]), Number(arr[2]));
            str = Tree_Cfg[pottedId].str2rotation;
            arr = str.split(",");
            this._topRot = new Vector3$2(-Number(arr[0]), Number(arr[1]) - 180, Number(arr[2]));
            this.camera.transform.position = this._frontPos;
            this.camera.transform.rotationEuler = this._frontRot;
        }
        checkCache(str) {
            this.clear();
            var localData = PotManager.getInstance().PotMap[str];
            if (localData) {
                this.loadPottedByData(localData.PointDataList[this._pointIndex]);
            }
            else {
                this.loadPottedDefault();
            }
        }
        loadPottedDefault() {
            GameUIManager.getInstance().createUI(DiyChangePot, [this._pointName, 0]);
        }
        set dragTarget(target) {
            this._dragTarget = target;
        }
        get dragTarget() {
            return this._dragTarget;
        }
        loadPottedById(id) {
            if (this.potted != null) {
                if (id != this.potted.containerId) {
                    this.potted.changePotted(id);
                    return;
                }
            }
            if (this.pottedDefult) {
                this.pottedDefult.destroy();
                this.pottedDefult = null;
            }
            if (this.potted) {
                this.potted.destroy();
                this.potted = null;
            }
            this.initCameraData(id);
            this.potted = new Potted();
            this.potted.initPotted(id, Handler$2.create(this, function () {
                this.scene3d.addChild(this.potted);
                this.potted.transform.position = new Vector3$2(0, 0, 0);
                this.script3d.setTarget(this.potted);
                Utils.setMeshCastShadow(this.potted, true);
            }));
        }
        loadPottedByData(data) {
            this.initCameraData(data.containerId);
            Potted.createByData(data, Handler$2.create(this, function (potted) {
                if (!potted)
                    return;
                this.potted = potted;
                potted.transform.rotationEuler = new Vector3$2(0, data.rotateY, 0);
                this.script3d.setTarget(this.potted);
                this.scene3d.addChild(potted);
                Utils.setMeshCastShadow(this.potted, true);
                GameUIManager.getInstance().createUI(DiyChangePot, [this._pointName, 0]);
            }));
        }
        onDragBegin(e) {
            if (e.target instanceof Button) {
                return;
            }
            let view = ViewManager.getInstance().GetViewByClass(DIYFinishView);
            if (view) {
                return;
            }
            if (e.target instanceof Box)
                return;
            if (e.target instanceof Button)
                return;
            if (!this.isopendrag)
                return;
            this.point.x = MouseManager$1.instance.mouseX;
            this.point.y = MouseManager$1.instance.mouseY;
            this._touchPoint.x = MouseManager$1.instance.mouseX;
            this._touchPoint.y = MouseManager$1.instance.mouseY;
            this.offset.x = 0;
            this.offset.y = 0;
            this._isMouseDown = true;
            var outHitResult = Utils.rayCastOne(this.point, this.scene3d, this.camera);
            if (outHitResult.succeeded) {
                console.log("碰撞到物体！！");
                if (outHitResult.collider.owner && outHitResult.collider.owner.parent instanceof Tree) {
                    this.script3d.rotateEnable = false;
                    var _tree = outHitResult.collider.owner.parent;
                    if (this._editTarget && this._editTarget.treeIndex != _tree.treeIndex) {
                        this._selectTarget = false;
                        return;
                    }
                    this.editTarget = _tree;
                    this.editorMode = true;
                    this._treeData = {
                        _id: _tree._id,
                        _scale: _tree.transform.scale.x,
                        _pos: new Laya.Vector3(_tree.transform.position.x, _tree.transform.position.y, _tree.transform.position.z),
                        _rotate: _tree.transform.localRotationEuler.y
                    };
                    var ox = MouseManager$1.instance.mouseX;
                    var oy = MouseManager$1.instance.mouseY;
                    var mx = Utils.worldToScreen(this.camera, this._editTarget.transform.position);
                    this.offset.x = mx.x - ox;
                    this.offset.y = mx.y - oy;
                }
            }
            else
                this._selectTarget = false;
            return;
            if (Global.sceneLock)
                return;
            this.isMove = false;
            this.point.x = MouseManager$1.instance.mouseX;
            this.point.y = MouseManager$1.instance.mouseY;
            this.offset.x = 0;
            this.offset.y = 0;
            var outHitResult = Utils.rayCastOne(this.point, this.scene3d, this.camera);
            if (outHitResult.succeeded) {
                console.log("碰撞到物体！！");
                if (outHitResult.collider.owner && outHitResult.collider.owner.parent instanceof Tree) {
                    this.dragTarget = outHitResult.collider.owner.parent;
                    if (this.editorMode && this.dragTarget.treeIndex == this._editTarget.treeIndex) {
                        this._editorTargetDown = true;
                    }
                }
            }
        }
        onDragMove(e) {
            if (!this._isMouseDown || !this._editTarget || !this.editorMode || !this._selectTarget) {
                return;
            }
            if (!this.isopendrag)
                return;
            var height = this.potted.getFloorHeight();
            this._editTarget.setPosition(Utils.screenToWorld(new Point$2(MouseManager$1.instance.mouseX + this.offset.x, MouseManager$1.instance.mouseY + this.offset.y), this.camera, height, 1.0));
            if (Math.abs(this._touchPoint.x - MouseManager$1.instance.mouseX) > this._closeDistance || Math.abs(this._touchPoint.y - MouseManager$1.instance.mouseY) > this._closeDistance)
                GameUIManager.getInstance().hideUI(DiyToolView);
            if (this._editTarget.isPlanted) {
                this.point.x = MouseManager$1.instance.mouseX + this.offset.x;
                this.point.y = MouseManager$1.instance.mouseY + this.offset.y;
                var arr = Utils.rayCastAll(this.point, this.scene3d, this.camera);
                var result = this.potted.canPut(arr);
                if (!result) {
                    this.potted.removeNotice(this._editTarget);
                }
                else {
                    this.potted.clearRemoveNotice(this._editTarget);
                }
            }
            return;
            if (this.editorMode) {
                this.script3d.rotateEnable = false;
                if (this._editorTargetDown) {
                    this._editTarget.setPosition(Utils.screenToWorld(new Point$2(MouseManager$1.instance.mouseX + this.offset.x, MouseManager$1.instance.mouseY + this.offset.y), this.camera, height, 1.0));
                    this.isMove = true;
                }
            }
            else {
                if (Global.sceneLock)
                    return;
                if (!this.dragTarget)
                    return;
                var height = this.potted.getFloorHeight();
                this.dragTarget.setPosition(Utils.screenToWorld(new Point$2(MouseManager$1.instance.mouseX + this.offset.x, MouseManager$1.instance.mouseY + this.offset.y), this.camera, height, 1.0));
                this.isMove = true;
                if (this.dragTarget.isPlanted) {
                    this.point.x = MouseManager$1.instance.mouseX + this.offset.x;
                    this.point.y = MouseManager$1.instance.mouseY + this.offset.y;
                    var arr = Utils.rayCastAll(this.point, this.scene3d, this.camera);
                    var result = this.potted.canPut(arr);
                    if (!result) {
                        this.potted.removeNotice(this.dragTarget);
                    }
                    else {
                        this.potted.clearRemoveNotice(this.dragTarget);
                    }
                }
                this.script3d.rotateEnable = false;
            }
        }
        onDragEnd(e) {
            this._isMouseDown = false;
            if (!this._editTarget || !this._selectTarget)
                return;
            if (!this.isopendrag)
                return;
            this._selectTarget = false;
            this.point.x = MouseManager$1.instance.mouseX + this.offset.x;
            this.point.y = MouseManager$1.instance.mouseY + this.offset.y;
            var arr = Utils.rayCastAll(this.point, this.scene3d, this.camera);
            var result = this.potted.canPut(arr);
            let isCreate = false;
            if (result) {
                if (this._editTarget.isPlanted) {
                    this._editTarget.setPosition(result);
                    isCreate = false;
                }
                else {
                    this._editTarget.isSave = false;
                    this.potted.addTreeByInstance(this._editTarget, result, true);
                    BagSystem.getInstance().delItem(this._editTarget.id, 1);
                    isCreate = true;
                    let data = { name: "diyClick" };
                    GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, data);
                }
                this.getTreeInPotted(this._editTarget, isCreate);
            }
            else {
                this.potted.delTree(this._editTarget);
                this.editTarget = null;
                this.editorMode = false;
            }
            Laya.stage.event(CommonDefine.EVENT_DIYUI_REFRESH);
            return;
        }
        clear() {
            this.pottedDefult = null;
            this.potted && this.potted.destroy();
            this.potted = null;
            this.dragTarget = null;
        }
        getTreeInPotted(_tree, isCreate) {
            if (_tree.isPlanted) {
                this.curCheckedTree = _tree;
                GameUIManager.getInstance().createUI(DiyToolView, [_tree], Laya.Handler.create(this, (view) => {
                    view.setCurTree(_tree, isCreate);
                }));
                Debug.Log(this.curCheckedTree);
            }
            else {
                Debug.LogError("花盆中没有这个植物");
            }
        }
        createTree(treeId) {
            let v3 = Utils.screenToWorld(new Point$2(MouseManager$1.instance.mouseX, MouseManager$1.instance.mouseY), this.camera, 0.4);
            var tree = new Tree(treeId);
            tree.setPosition(v3);
            this.scene3d.addChild(tree);
            this.editTarget = tree;
            this.editorMode = true;
        }
        savePotted() {
            if (this.potted) {
                PotManager.getInstance().SavePot(this._pointName, this._pointIndex, this.potted);
            }
        }
        RemoveTree() {
            if (!this._editTarget)
                return;
            this.potted.delTree(this._editTarget);
            this.editTarget = null;
            this.editorMode = false;
        }
        savePoint() {
            if (this.potted) {
                if (!PotManager.getInstance().PotMap[this._pointName] || !PotManager.getInstance().PotMap[this._pointName].PotList[this._pointIndex]) {
                    PotManager.getInstance().AddPot(this._pointName, this._pointIndex, this.potted);
                }
            }
        }
        resetPotted() {
            Potted.createByData(SaveManager.getInstance().GetCache(ModelStorage.plant), Handler$2.create(this, function (potted) {
                if (!potted)
                    return;
                this.potted = potted;
                this.script3d.setTarget(this.potted);
                this.scene3d.addChild(potted);
            }));
        }
        caneraAngle(state) {
            if (state) {
                let pos = this._topPos;
                let rot = this._topRot;
                Laya.Tween.to(this.camera.transform.position, {
                    x: pos.x, y: pos.y, z: pos.z, update: new Handler$2(this, function () {
                        this.camera.transform.position = this.camera.transform.position;
                    })
                }, this.caneraAngleTime);
                Laya.Tween.to(this.camera.transform.rotationEuler, {
                    x: rot.x, y: rot.y, z: rot.z, update: new Handler$2(this, function () {
                        this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                    })
                }, this.caneraAngleTime);
            }
            else {
                let pos = this._frontPos;
                let rot = this._frontRot;
                Laya.Tween.to(this.camera.transform.position, {
                    x: pos.x, y: pos.y, z: pos.z, update: new Handler$2(this, function () {
                        this.camera.transform.position = this.camera.transform.position;
                    })
                }, this.caneraAngleTime);
                Laya.Tween.to(this.camera.transform.rotationEuler, {
                    x: rot.x, y: rot.y, z: rot.z, update: new Handler$2(this, function () {
                        this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                    })
                }, this.caneraAngleTime);
            }
        }
        payBack() {
            this.potted && this.potted.payBack();
        }
        checkedPooted(_containerId) {
            this.loadPottedById(_containerId);
        }
        checkedPottedFinish() {
        }
        getPottedTreeNumber() {
            if (this.potted) {
                return this.potted._treeList.length;
            }
        }
        getPottedMaxNum() {
            if (this.potted && this.potted.containerId) {
                return Succulent_Cfg[this.potted.containerId].capacity;
            }
        }
        getPotted() {
            return this.potted;
        }
        cancelAfter() {
            if (this._editTarget && this._treeData) {
                this._editTarget.setScale(this._treeData._scale);
                this._editTarget.setPosition(this._treeData._pos);
                this._editTarget.setRotate(this._treeData._rotate);
            }
        }
    }
    DIYScene._instance = null;

    var Sprite3D$2 = Laya.Sprite3D;
    var Vector3$3 = Laya.Vector3;
    var Vector2$3 = Laya.Vector2;
    var Handler$3 = Laya.Handler;
    class Tree extends Sprite3D$2 {
        constructor(treeId, scale = 0, handler = null, bSave = true) {
            super();
            this._scale = null;
            this._rotate = null;
            this.isDrag = false;
            this.isPlanted = false;
            this.isSave = false;
            this.baseScale = 1;
            this.point = new Vector2$3();
            this._initZoom = 1;
            this.complate = handler;
            this.init(treeId, scale, bSave);
        }
        init(treeId, scale, bSave = true) {
            this._camera = DIYScene.instance.camera;
            this._scene3d = DIYScene.instance.scene3d;
            this._initZoom = Tree_Cfg[treeId].zoom;
            this.quality = Tree_Cfg[treeId].point;
            this._type = Tree_Cfg[treeId].type;
            this.isSave = bSave;
            this.baseScale = scale == 0 ? this._initZoom : scale;
            this.minZoom = Tree_Cfg[treeId].zoommin * this._initZoom;
            this.maxZoom = Tree_Cfg[treeId].zoommax * this._initZoom;
            if (scale > 0)
                this._initZoom = scale;
            this.setScale(this._initZoom);
            this.loadTree(treeId);
        }
        loadTree(treeId) {
            if (!Tree_Cfg || !Tree_Cfg[treeId]) {
                throw Error("tree is not found , id = " + treeId);
                return;
            }
            this._id = treeId;
            ResourceManager.getInstance().getResource(Tree_Cfg[treeId].strmodelurl, Handler$3.create(this, function (ret) {
                this.treeNode = ret;
                this.addChild(ret);
                this.setScale(this._initZoom);
                this._rotate = 0;
                this.complate && this.complate.runWith(this);
            }));
        }
        getTableId() {
            return this._id;
        }
        setScale(value) {
            value = Number(value.toFixed(1));
            if (this.transform)
                this.transform.setWorldLossyScale(new Vector3$3(value, value, value));
            this._scale = value;
        }
        SetVisible(val) {
            this.treeNode.active = false;
        }
        getScale() {
            return Number(this._scale.toFixed(1));
        }
        setRotate(value) {
            this.transform.localRotationEuler = new Vector3$3(this.transform.localRotationEulerX, value, this.transform.localRotationEulerZ);
            this._rotate = value;
        }
        getRotate() {
            return this._rotate;
        }
        setPosition(v3) {
            this.transform.position = v3;
        }
        getPosition() {
            var pos = new Vector3$3();
            pos.x = Number(this.transform.localPosition.x.toFixed(1));
            pos.y = Number(this.transform.localPosition.y.toFixed(1));
            pos.z = Number(this.transform.localPosition.z.toFixed(1));
            return pos;
        }
        getPayBackNumber() {
            if (this.isSave)
                return 0;
            if (this._scale <= this._initZoom)
                return 1;
            return 1;
            return (this._scale - this._initZoom) * 10;
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.treeNode = null;
        }
        removeSelf() {
            debugger;
            return super.removeSelf();
        }
    }

    var Sprite3D$3 = Laya.Sprite3D;
    var Vector3$4 = Laya.Vector3;
    var Handler$4 = Laya.Handler;
    var PhysicsCollider = Laya.PhysicsCollider;
    class Potted extends Sprite3D$3 {
        constructor() {
            super(...arguments);
            this._treeList = new Array();
            this._containerId = 20006;
            this._index = 0;
            this.GrowStartTime = 0;
            this.GrowTime = 0;
            this.State = PotState.None;
        }
        initPotted(containerId, complate = null) {
            if (!Tree_Cfg[containerId]) {
                throw Error("id = " + containerId + " not found");
                return;
            }
            if (containerId != CommonDefine.VALUE_ZERO) {
                if (this._potted) {
                    this._potted.destroy();
                    this._potted = null;
                }
                this._containerId = containerId;
                ResourceManager.getInstance().getResource(Tree_Cfg[containerId].strmodelurl, Handler$4.create(this, function (ret) {
                    this.addChild(ret);
                    this._potted = ret;
                    ret.transform.position = new Vector3$4(0, 0, 0);
                    this._plantPlan = ret.getChildByName("floor");
                    complate && complate.runWith(0);
                    Laya.stage.event(CommonDefine.EVENT_POT_INIT_FINISH);
                }));
            }
            else {
            }
            Laya.stage.event(CommonDefine.EVENT_CHECKED_POTTED_FINISH);
        }
        addTreeByInstance(tree, pos, shadow = false) {
            this._addTree(tree, pos, null, -this.transform.localRotationEulerY, shadow);
            Laya.stage.event(CommonDefine.EVENT_POTTED_CHANGE);
        }
        addTree(treeId, pos, scale = 1, rotate = 0, shadow = false, complate = null, enablePhysics = true, isSave = false) {
            new Tree(treeId, scale, Handler$4.create(this, function (tree) {
                this._addTree(tree, pos, scale, rotate, shadow, enablePhysics);
                complate && complate.run();
            }), isSave);
        }
        _addTree(tree, pos, scale, rotate, shadow = false, enablePhysics = true) {
            this.addChild(tree);
            if (rotate != null)
                tree.setRotate(rotate);
            tree.isPlanted = true;
            tree.treeIndex = this._index;
            tree.setPosition(pos);
            this._treeList.push(tree);
            this._index += 1;
            Utils.setMeshCastShadow(tree, shadow);
            var temp = tree.getChildAt(0);
            this.delayCall(temp, enablePhysics);
        }
        delayCall(node, bool) {
            if (!node) {
                Laya.timer.once(10, this, function () {
                    this.delayCall(node, bool);
                });
            }
            else {
                var d = node.getComponent(PhysicsCollider);
                d.enabled = bool;
            }
        }
        HideTree(val) {
            for (let i in this._treeList) {
                this._treeList[i].active = val;
            }
        }
        delTree(tree) {
            var inList = false;
            for (var i = 0; i < this._treeList.length; ++i) {
                if (this._treeList[i].treeIndex == tree.treeIndex) {
                    BagSystem.getInstance().addItem(tree.id, tree.getPayBackNumber());
                    this._treeList[i].destroy();
                    this._treeList.splice(i, 1);
                    inList = true;
                    break;
                }
            }
            if (!inList)
                tree.destroy();
            GameUIManager.getInstance().destroyUI(DiyToolView);
            this.clearSelect();
            Laya.stage.event(CommonDefine.EVENT_POTTED_CHANGE);
        }
        get quality() {
            return this.giveMark();
        }
        get gold() {
            let _gold = 0;
            this._treeList.forEach(tree => {
                _gold += Tree_Cfg[tree._id].goldProduce;
            });
            return _gold;
        }
        get containerId() {
            return (this._containerId);
        }
        get Volume() {
            return (this._index);
        }
        get Capacity() {
            return Tree_Cfg[this._containerId].capacity;
        }
        get TreeCount() {
            let treeNumber = 0;
            this._treeList.forEach(tree => {
                if (tree._type == 1)
                    treeNumber++;
            });
            return treeNumber;
        }
        ExtraPrefer() {
            return Tree_Cfg[this._containerId].extraPrefer = 0 ? 0 : Tree_Cfg[this._containerId].pointsPrefer / 100;
        }
        BorderMultiScore() {
            let treeNumber = 0;
            let adornNumber = 0;
            let borderMulti = Tree_Cfg[this._containerId].borderMulti;
            let _List = new Array();
            this._treeList.forEach(tree => {
                if (tree._type == 1)
                    _List.push(tree);
                else if (tree._type == 3)
                    adornNumber++;
            });
            let _Listtype = new Array();
            _List.forEach(ele => {
                let c = [ele._id, ele._type];
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
        clearSelect() {
            for (var i = 0; i < this._treeList.length; ++i) {
                Utils.setModelAlpha(this._treeList[i], 1);
                this.changeRenderMode(null);
                this.changeRenderModeTest();
            }
        }
        removeNotice(tree) {
            Utils.setModelAlpha(tree, 0.3);
        }
        clearRemoveNotice(tree) {
            Utils.setModelAlpha(tree, 1);
        }
        changeRenderMode(tree) {
            for (var i = 0; i < this._treeList.length; ++i) {
                if (tree && tree.treeIndex == this._treeList[i].treeIndex)
                    Utils.setRenderMode(this._treeList[i], 1);
                else
                    Utils.setRenderMode(this._treeList[i], 2);
            }
        }
        changeRenderModeTest() {
            for (var i = 0; i < this._treeList.length; ++i) {
                Utils.setRenderMode(this._treeList[i], 1);
            }
        }
        setSelect(tree) {
            for (var i = 0; i < this._treeList.length; ++i) {
                if (this._treeList[i].treeIndex == tree.treeIndex) {
                    Utils.setModelAlpha(this._treeList[i], 1);
                }
                else {
                    Utils.setModelAlpha(this._treeList[i], 0.3);
                }
            }
        }
        packData(name) {
            if (this._containerId == 0) {
                console.log("containerid is empty, need not save");
                return;
            }
            var pottedStruct = new PottedStruct();
            var treesArr = new Array();
            var treeObject;
            var treeStruct;
            for (var i = 0; i < this._treeList.length; ++i) {
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
            pottedStruct.GrowStartTime = this.GrowStartTime;
            pottedStruct.GrowTime = this.GrowTime;
            pottedStruct.State = this.State;
            return pottedStruct;
        }
        static createByData(data, complate, shadow = false, enablePhysics = true) {
            if (!data) {
                complate && complate.runWith(null);
                return;
            }
            var pottedStruct = new PottedStruct();
            pottedStruct.unPackData(data);
            var potted = new Potted();
            var loadedNum = 0;
            var maxLoaded = 0;
            potted.initPotted(pottedStruct.containerId, Handler$4.create(this, function () {
                var arr = pottedStruct.treeArray;
                maxLoaded = arr.length;
                potted.GrowStartTime = pottedStruct.GrowStartTime;
                potted.GrowTime = pottedStruct.GrowTime;
                potted.State = pottedStruct.State;
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length; ++i) {
                        potted.addTree(arr[i].treeId, new Vector3$4(arr[i].pos.x, arr[i].pos.y, arr[i].pos.z), arr[i].scale, arr[i].rotate, shadow, Handler$4.create(this, checkLoaded), enablePhysics, true);
                    }
                }
                else {
                    complate && complate.runWith([potted, pottedStruct.rotateY]);
                }
            }));
            function checkLoaded() {
                loadedNum += 1;
                if (loadedNum == maxLoaded) {
                    complate && complate.runWith([potted, pottedStruct.rotateY]);
                }
            }
        }
        getFloorHeight() {
            if (this._plantPlan && this._plantPlan.transform) {
                return this._plantPlan.transform.localPositionY;
            }
            return 0;
        }
        canPut(hitArray) {
            for (var i = 0; i < hitArray.length; ++i) {
                if (hitArray[i].collider.owner.name == this._plantPlan.name) {
                    return hitArray[i].point;
                }
            }
            return null;
        }
        GetQualityImg() {
            for (const key in Constant_Cfg[9].value) {
                if (this.quality < Constant_Cfg[9].value[key]) {
                    return "gameui/flowerstate/potquality" + (Number(key) - 1) + ".png";
                }
            }
            return "";
        }
        GetNextTwoNode() {
            let len = Utils.GetMapLength(Constant_Cfg[9].value);
            for (const key in Constant_Cfg[9].value) {
                if (this.quality < Constant_Cfg[9].value[key]) {
                    let k = Number(key);
                    return [k - 1, k];
                }
            }
            return [len - 1, len];
        }
        GetQualityName() {
            for (const key in Constant_Cfg[9].value) {
                if (this.quality < Constant_Cfg[9].value[key]) {
                    return Constant_Cfg[10].value[Number(key) - 1];
                }
            }
            return "";
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
        }
        changePotted(id) {
            if (this._potted) {
                if (this.containerId == id || id == CommonDefine.VALUE_ZERO)
                    return;
                this._potted.destroy();
                this._potted = null;
                ResourceManager.getInstance().getResource(Tree_Cfg[id].strmodelurl, Handler$4.create(this, function (ret) {
                    this._potted = ret;
                    this._containerId = id;
                    this.addChild(ret);
                    this._plantPlan = ret.getChildByName("floor");
                    Laya.stage.event(CommonDefine.EVENT_POTTED_CHANGEED, [id]);
                    var p = ret.getChildByName("switch_point");
                    if (!p)
                        return;
                    for (var i = 0; i < this._treeList.length; ++i) {
                        var n = p.getChildByName((i + 1).toString());
                        if (!n)
                            continue;
                        this._treeList[i].setPosition(n.transform.position);
                    }
                }));
            }
            else {
                console.log("no potted");
            }
        }
        payBack() {
            for (var i = 0; i < this._treeList.length; ++i) {
                BagSystem.getInstance().addItem(this._treeList[i].id, this._treeList[i].getPayBackNumber());
            }
        }
        giveReward() {
            let gold = this.takePhoto_outputGold() * Constant_Cfg[20].value;
            gold = Math.floor(gold);
            return gold;
        }
        takePhoto_outputGold() {
            let gold = this.gold;
            let borderMultiScore = this.BorderMultiScore();
            if (borderMultiScore < Constant_Cfg[19].value) {
                borderMultiScore = Constant_Cfg[19].value;
            }
            let addition = Math.sqrt(this.TreeCount / this.Capacity) + this.ExtraPrefer() + borderMultiScore;
            let getGold = Math.floor(gold * addition);
            return getGold;
        }
        giveMark() {
            let score = 0;
            score = Math.pow((this.takePhoto_outputGold() / 5), 0.47) * 2 * this.takePhoto_outputGold();
            score = Math.floor(score);
            console.log("score: " + score);
            return score;
        }
    }

    var Handler$5 = Laya.Handler;
    var Sprite3D$4 = Laya.Sprite3D;
    var Vector3$5 = Laya.Vector3;
    var Tween$1 = Laya.Tween;
    var Pool$1 = Laya.Pool;
    class SceneItem extends Sprite3D$4 {
        constructor() {
            super();
            this.itemModel = null;
            this._tableId = 0;
            this.index = 0;
        }
        init(tableId, position, handler, price = 1) {
            this._tableId = tableId;
            this._tableData = Drop_Cfg[tableId];
            this.pos = position;
            this.addGold = price;
            this._complate = handler;
            if (!this.itemModel) {
                this.loadModel();
            }
            else {
                this.doMove();
                handler();
            }
        }
        loadModel() {
            ResourceManager.getInstance().getResource(this._tableData.strmodel, Handler$5.create(this, this.onLoaded));
        }
        get tableId() {
            return this._tableId;
        }
        onClick() {
            Tween$1.to(this.transform.position, { y: this.transform.position.y + 2, update: new Handler$5(this, function () {
                    this.transform.position = this.transform.position;
                }) }, 200, null);
            Laya.timer.loop(50, this, this.onHide);
        }
        onHide() {
            this._alpha -= 0.1;
            Utils.setModelAlpha(this, this._alpha);
            if (this._alpha <= 0) {
                Laya.timer.clear(this, this.onHide);
                SceneItemCreater.getInstance().removeItem(this);
            }
        }
        recover() {
            Pool$1.recover("SceneItem" + this._tableId.toString(), this);
        }
        onLoaded(sp3d) {
            this.itemModel = sp3d;
            sp3d.transform.localPosition = new Vector3$5(0, 0.3, 0);
            this.addChild(sp3d);
            this.doMove();
            this._complate();
        }
        doMove() {
            this._alpha = 1;
            Utils.setModelAlpha(this, 1);
            this.transform.position = this.pos;
            var _x = this.transform.position.x;
            var _y = this.transform.position.y;
            GameScene.instance.scene3d.addChild(this);
            var offset = Math.random() * 0.8;
            offset = Number(offset.toFixed(1));
            Tween$1.to(this.transform.position, { x: _x - offset, y: _y + 1, update: new Handler$5(this, function () {
                    this.transform.position = this.transform.position;
                }) }, 200, null, Handler$5.create(this, function () {
                Tween$1.to(this.transform.position, { x: _x - offset * 2, y: _y, update: new Handler$5(this, function () {
                        this.transform.position = this.transform.position;
                    }) }, 200, null, Handler$5.create(this, function () {
                }));
            }));
        }
        destroy(destroyChild) {
            this.removeSelf();
            Pool$1.recover("SceneItem" + this._tableId.toString(), this);
        }
    }

    var Pool$2 = Laya.Pool;
    class ClassPool extends Singleton {
        constructor() {
            super(...arguments);
            this.poolChildren = {};
        }
        getItemByClass(sign, cls) {
            if (!this.poolChildren[sign])
                this.poolChildren[sign] = 1;
            return Pool$2.getItemByClass(sign, cls);
        }
        getPoolBySign(sign) {
            return Pool$2.getPoolBySign(sign);
        }
        clearPoolSign(sign) {
            return Pool$2.clearBySign(sign);
        }
        recover(sign, cls) {
            return Pool$2.recover(sign, cls);
        }
        recoverByClass(cls) {
            return Pool$2.recoverByClass(cls);
        }
        destroyAllPool() {
            var arr;
            for (var o in this.poolChildren) {
                arr = this.getPoolBySign(o);
                for (var i = 0; i < arr.length; ++i) {
                    arr[i].destroy();
                }
                this.clearPoolSign(o);
            }
        }
    }

    var Vector3$6 = Laya.Vector3;
    class SceneItemCreater extends Singleton {
        constructor() {
            super(...arguments);
            this._itemList = new Array();
            this._index = 0;
        }
        createItem(tableId, pos, price = 1) {
            var item = ClassPool.getInstance().getItemByClass("SceneItem" + tableId.toString(), SceneItem);
            item.init(tableId, pos, () => {
                this._itemList.push(item);
            }, price);
            item.index = this._index;
            this._index += 1;
            return item;
        }
        removeItem(item) {
            for (var i = 0; i < this._itemList.length; ++i) {
                if (this._itemList[i].index == item.index) {
                    this._itemList[i].destroy();
                    this._itemList.splice(i, 1);
                    break;
                }
            }
        }
        getNearItem(pos, range) {
            var distance = 1000;
            var curDis;
            var index = -1;
            for (var i = 0; i < this._itemList.length; ++i) {
                curDis = Vector3$6.distance(this._itemList[i].transform.position, pos);
                if (curDis < range && curDis < distance) {
                    distance = curDis;
                    index = i;
                }
            }
            return index == -1 ? null : this._itemList[index];
        }
        pickItemNearby(camera, item, range = 3) {
            var pos = item.transform.position;
            var curDis;
            var totalGold = 0;
            var totalStar = 0;
            for (var i = 0; i < this._itemList.length; ++i) {
                curDis = Vector3$6.distance(this._itemList[i].transform.position, pos);
                if (curDis < range) {
                    this._itemList[i].onClick();
                    if (this._itemList[i].tableId == 1)
                        totalGold += this._itemList[i].addGold;
                    if (this._itemList[i].tableId == 2)
                        totalStar += this._itemList[i].addGold;
                }
            }
            var v2 = Utils.worldToScreen(camera, item.transform.position);
            var delay = 0;
            if (totalGold > 0 && totalStar > 0) {
                delay = 100;
            }
            console.log("==============debug======", "totalGold:", totalGold, "item:", item);
            if (totalGold > 0) {
                Utils.createNumberText(Math.floor(totalGold).toString(), v2.x, v2.y, "+", false, Drop_Cfg[1].strfont_color);
                GameScene.instance.playEffect(Sceneeffect_Cfg[2].streffect, item.transform.position, 0, true, () => {
                    Player.getInstance().refreshGold(Math.floor(totalGold));
                });
            }
            if (totalStar > 0) {
                Laya.timer.once(delay, this, function () {
                    Utils.createNumberText(Math.floor(totalStar).toString(), v2.x, v2.y, "+", true, Drop_Cfg[1].strfont_color);
                    Player.getInstance().refreshStar(Math.floor(totalStar));
                });
            }
        }
    }

    var Sprite3D$5 = Laya.Sprite3D;
    var Vector3$7 = Laya.Vector3;
    var Handler$6 = Laya.Handler;
    var ShuriKenParticle3D = Laya.ShuriKenParticle3D;
    class Effect3D extends Sprite3D$5 {
        constructor() {
            super();
            this.pos = null;
        }
        createFollowEffect(url, parent, playTime = 3000, loop = false, offset = null) {
            this.addNode = parent;
            this.bLoop = loop;
            this.offset = offset;
            this.liveTime = playTime;
            ResourceManager.getInstance().getResource(url, Handler$6.create(this, this.onLoaded));
        }
        createSceneEffect(url, parent, position, playTime = 3000, loop = false, offset = null, callback = null) {
            this.addNode = parent;
            this.bLoop = loop;
            this.pos = position;
            this.offset = offset;
            this.liveTime = playTime;
            this.callback = callback;
            ResourceManager.getInstance().getResource(url, Handler$6.create(this, this.onLoaded));
        }
        onLoaded(effect) {
            this.effectNode = effect;
            this.addNode.addChild(effect);
            if (this.pos) {
                effect.transform.position = this.pos.clone();
            }
            if (this.offset) {
                Vector3$7.add(effect.transform.position, this.offset, this.pos);
                effect.transform.position = this.pos.clone();
            }
            if (this.liveTime > 0) {
                Laya.timer.once(this.liveTime, this, this.destroy);
            }
            this.setLoop(effect, this.bLoop);
            this.callback && this.callback(effect);
        }
        destroy(destroyChild) {
            this.effectNode.destroy();
            super.destroy(destroyChild);
        }
        setLoop(node, b) {
            for (var i = 0; i < node.numChildren; ++i) {
                var childs = node.getChildAt(i);
                if (childs instanceof ShuriKenParticle3D) {
                    childs.particleSystem.looping = b;
                }
                if (childs.numChildren > 0)
                    this.setLoop(childs, b);
            }
        }
    }

    var Sprite3D$6 = Laya.Sprite3D;
    var Handler$7 = Laya.Handler;
    class Decorate extends Sprite3D$6 {
        constructor() {
            super(...arguments);
            this.state = false;
            this.time = 0;
            this._rotateTime = 0;
            this._stopTime = 0;
            this._effect = null;
            this._effectUrl = "";
            this._indicateEffect = null;
            this._nT = 1000;
        }
        init(id) {
            var url = Statue_Cfg[id].strStatueModel;
            this._id = id;
            ResourceManager.getInstance().getResource(url, Handler$7.create(this, this.onDecorateLoaded));
        }
        setInfo(_data, rT, sT) {
            if (_data) {
                this.state = _data.state;
                this.time = _data.time ? _data.time : 0;
            }
            this._rotateTime = rT * 1000;
            this._stopTime = sT * 1000;
        }
        onChangeModel(id) {
            var url = Statue_Cfg[id].strStatueModel;
            this._id = id;
            Laya.timer.clearAll(this);
            ResourceManager.getInstance().getResource(url, Handler$7.create(this, this.onDecorateLoaded));
        }
        onDecorateLoaded(decorate) {
            this._model && this._model.destroy();
            this._model = null;
            this._model = decorate;
            this.addChild(decorate);
            this.behavior();
        }
        behavior() {
            Laya.timer.loop(this._nT, this, () => {
                if (isNaN(this.time)) {
                    this.time = 0;
                }
                if (this.time == 0) {
                    BottomCreater.getInstance().refreshData();
                }
                if (this.state) {
                    this.createEffect();
                    this.rotateBehavior();
                    return;
                }
                else {
                    Laya.Tween.clearAll(this);
                    this.stopState();
                    this.disableEffect();
                    return;
                }
            });
        }
        stopState() {
            this.time += this._nT;
            if (this.time >= this._stopTime) {
                this.state = true;
                this.time = 0;
            }
        }
        rotateBehavior() {
            this.time += this._nT;
            if (this.time >= this._rotateTime) {
                this.state = false;
                this.time = 0;
            }
            let rot = new Laya.Vector3(this._model.transform.rotationEuler.x, this._model.transform.rotationEuler.y + 20, this._model.transform.rotationEuler.z);
            Laya.Tween.to(this._model.transform.rotationEuler, {
                x: rot.x, y: rot.y, z: rot.z, update: new Handler$7(this, function () {
                    if (!this._model || !this._model.transform) {
                        Laya.Tween.clearAll(this);
                        return;
                    }
                    this._model.transform.rotationEuler = this._model.transform.rotationEuler;
                })
            }, 1000);
        }
        addEffect(url, indicateEffect) {
            this._effectUrl = url;
            this._indicateEffect = indicateEffect;
        }
        createEffect() {
            if (this._effect)
                return;
            this._effect = new Effect3D();
            this._effect.createSceneEffect(this._effectUrl, this, this._model.transform.position, 0, true, null);
            this._indicateEffect.active = true;
        }
        disableEffect() {
            if (!this._effect)
                return;
            this._effect.destroy();
            this._effect = null;
            this._indicateEffect.active = false;
        }
    }

    var Handler$8 = Laya.Handler;
    var Sprite3D$7 = Laya.Sprite3D;
    class Bottom extends Sprite3D$7 {
        constructor() {
            super(...arguments);
            this._data = null;
            this._level = 1;
            this._attraction = 0;
            this._star = 0;
            this._curDecorate = null;
            this._curDecorateId = null;
            this._unLockDecorates = [];
            this._sustain = 0;
            this._interval = 0;
            this._weight = 0;
            this._curDecorateInfo = null;
            this._zoom = 1;
            this._indicateEffect = null;
        }
        init(_data) {
            this._data = _data;
            this._bId = _data.bId;
            this._name = _data.parentName;
            this._level = _data.bLevel;
            this._attraction = _data.attraction;
            this._star = _data.star;
            this._curDecorateId = _data.curDecorateId;
            this._unLockDecorates = _data.unLockDecorates;
            this._curDecorateInfo = _data.curDecorateInfo;
            var url = Statue_Cfg[this._bId].strStatueModel;
            this._zoom = this.getZoom();
            ResourceManager.getInstance().getResource(url, Handler$8.create(this, this.onLoaded));
        }
        resetInifo() {
            this._sustain = Statue_Cfg[this._bId].sustain;
            this._interval = Statue_Cfg[this._bId].interval;
            this._weight = Statue_Cfg[this._bId].weight;
        }
        onLoaded(bottom) {
            this._model && this._model.destroy();
            this._model = null;
            let decorate = new Laya.Sprite3D();
            decorate.name = "decorate";
            this._model = bottom;
            this.addChild(bottom);
            bottom.transform.setWorldLossyScale(new Laya.Vector3(this._zoom, this._zoom, this._zoom));
            this._model.addChild(decorate);
            this.resetInifo();
            this._indicateEffect = GameScene.instance.scene3d.getChildByName("point").getChildByName(this._name + "_jiantou");
            this._indicateEffect.active = false;
            if (this._curDecorateId) {
                this.addDecorate();
            }
        }
        addDecorate() {
            let url = Statue_Cfg[this._bId].strEffect;
            var dec = new Decorate();
            dec.setInfo(this._curDecorateInfo, this._sustain, this._interval);
            dec.addEffect(url, this._indicateEffect);
            dec.onChangeModel(this._curDecorateId);
            this._curDecorateId = this._curDecorateId;
            this._curDecorate = dec;
            this._model.getChildByName("point").destroyChildren();
            this._model.getChildByName("point").addChild(dec);
        }
        onLevelUp(maxLv) {
            if (this._level >= maxLv)
                return;
            this._level += 1;
            this._bId = BottomCreater.getInstance().getStatueItemData(this._level).id;
            var url = Statue_Cfg[this._bId].strStatueModel;
            ResourceManager.getInstance().getResource(url, Handler$8.create(this, this.onLoaded));
        }
        unLockDecoratesById(_id) {
            this._unLockDecorates.push(_id);
        }
        addStar(v) {
            this._star += v;
        }
        addAttraction(v) {
            this._attraction += v;
        }
        getZoom() {
            let zoom;
            BottomCreater.getInstance().defaultStatueArray.forEach(element => {
                if (element.strNodeName == this._name) {
                    zoom = element.zoom;
                }
            });
            return zoom;
        }
        getWeight() {
            if (!this._curDecorateId || !this._curDecorate._effect) {
                return 0;
            }
            return this._weight;
        }
    }

    class DataLog extends Singleton {
        constructor() {
            super();
        }
        LogVideo_log(op_type) {
            console.log("==================打点====================", op_type);
            let tData = {};
            tData["openid"] = GameLink.inst.urlParams["openid"];
            tData["star"] = Player.getInstance().nStar;
            tData["op_type"] = op_type;
            RemoteCall.instance.HttpSend("onvideolog", tData, this);
        }
        LogAdvert_log(op_type) {
            let tData = {};
            tData["openid"] = GameLink.inst.urlParams["openid"];
            tData["star"] = Player.getInstance().nStar;
            tData["op_type"] = op_type;
            RemoteCall.instance.HttpSend("onadvertlog", tData, this);
        }
        LogPlant_log(plant_name) {
            let tData = {};
            tData["openid"] = GameLink.inst.urlParams["openid"];
            tData["star"] = Player.getInstance().nStar;
            tData["plant_name"] = plant_name;
            tData["params"] = tData;
            RemoteCall.instance.HttpSend("onplantlog", tData, this);
        }
        LogGuide_log(guide_type) {
            let tData = {};
            tData["openid"] = GameLink.inst.urlParams["openid"];
            tData["star"] = Player.getInstance().nStar;
            tData["guide_type"] = guide_type;
            RemoteCall.instance.HttpSend("onguidelog", tData, this);
        }
    }

    class PointFlowerStateView extends ui.view.Flowerpot.FlowerpotStateViewUI {
        constructor(pointName) {
            super();
            this.curPottedId = 0;
            this._pointName = "";
            this._potData = [];
            this._pointName = pointName[0];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.InitEvent();
            this.InitView();
            Global.sceneLock = true;
        }
        onDisable() {
            Laya.timer.clearAll(this);
        }
        onDestroy() {
            this.cBtn.offAll();
            GEvent.RemoveEvent(GacEvent.OnPlantRipe, Laya.Handler.create(this, this.UpdatePotList));
            Global.sceneLock = false;
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(PointFlowerStateView);
        }
        InitEvent() {
            this.cBtn.on(Laya.Event.CLICK, this, this.onClose);
            this.speedUpGrowBtn.on(Laya.Event.CLICK, this, this.OnSpeedUp);
            this.editBtn.on(Laya.Event.CLICK, this, this.OnGotoEditPot);
            Laya.timer.loop(1000, this, this.UpdateTime);
            GEvent.RegistEvent(GacEvent.OnPlantRipe, Laya.Handler.create(this, this.UpdatePotList));
        }
        InitView() {
            this.SetPotList();
        }
        UpdatePotData() {
            if (!this._pointName)
                return;
            let _data = Succulentpoint_Cfg[this._pointName].flowerpot;
            let _arr = [];
            if (Object.keys(_data).length > 0) {
                for (const key in _data) {
                    if (Object.prototype.hasOwnProperty.call(_data, key)) {
                        const element = _data[key];
                        let eItem = Succulent_Cfg[element];
                        eItem.id = element;
                        _arr.push(eItem);
                    }
                }
            }
            else {
                let eItem = Succulent_Cfg[_data];
                eItem.id = _data;
                _arr.push(eItem);
            }
            this._potData = _arr;
            function SortFun(tLeft, tRight) {
                let nleftLock = Player.getInstance().tPotData[tLeft.id] ? 1 : 0;
                let nRightLock = Player.getInstance().tPotData[tRight.id] ? 1 : 0;
                if (nleftLock != nRightLock)
                    return nleftLock > nRightLock ? -1 : 1;
                let nleftcan = (Player.getInstance().nStar >= Succulent_Cfg[tLeft.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tLeft.id].gold) ? 1 : 0;
                let nRightcan = (Player.getInstance().nStar >= Succulent_Cfg[tRight.id].unlockstar && Player.getInstance().nGold >= Succulent_Cfg[tRight.id].gold) ? 1 : 0;
                if (nleftcan != nRightcan)
                    return nleftcan > nRightcan ? -1 : 1;
                return tLeft.id < tRight.id ? -1 : 1;
            }
            this._potData.sort(SortFun);
        }
        UpdatePotList() {
            this.UpdatePotData();
            this.timeItme = null;
            let tPot = this.GetPotted(this.curPottedId);
            this.UpdateBtn(tPot ? tPot.State : null, this.curPottedId);
        }
        UpdateTime() {
            let tPot = this.GetPotted(this.curPottedId);
            if (tPot && this.timeItme && tPot.State == PotState.Grow) {
                let nPro = (Time.Seconds - tPot.GrowStartTime) / tPot.GrowTime;
                this.timeItmepro.value = nPro;
                let time = Utils.formatStandardTime(tPot.GrowTime - (Time.Seconds - tPot.GrowStartTime), false);
                this.timeItme.text = Utils.format("正在成长 {0}", time);
            }
        }
        SetPotList() {
            this.timeItme = null;
            this.UpdatePotData();
            let tPot = this.GetPotted(this.curPottedId);
            this.UpdateBtn(tPot ? tPot.State : null, this.curPottedId);
        }
        OnUpdateFlowerModel(ui, index) {
            if (this.flowerModel) {
                this.flowerModel.Destroy();
                this.flowerModel = null;
            }
            if (!PotManager.getInstance().PotMap[this._pointName] || !PotManager.getInstance().PotMap[this._pointName].PotList
                || !PotManager.getInstance().PotMap[this._pointName].PotList[index]) {
                this.flowerModel = new DrawModel();
                this.flowerModel.bEmptyPot = true;
                this.flowerModel.position = new Laya.Vector3(0, -0.3, -1.7);
                this.flowerModel.scale = 1;
                this.flowerModel.Start(ui);
                return;
            }
            let tPoint = PotManager.getInstance().PotMap[this._pointName].PotList[index];
            if (tPoint && tPoint.State == PotState.Grow) {
                this.flowerModel = new DrawModel();
                this.flowerModel.bEmptyBox = true;
                this.flowerModel.position = new Laya.Vector3(0, -1.8, -5);
                this.flowerModel.scale = 1;
                this.flowerModel.Start(ui);
                return;
            }
            this.flowerModel = new DrawModel();
            this.flowerModel.flowerData = PotManager.getInstance().PotMap[this._pointName];
            this.flowerModel.flowerPotStruct = PotManager.getInstance().PotMap[this._pointName].PointDataList[index];
            this.flowerModel.bFlower = true;
            let pos = PotManager.getInstance().scaleInfo[Succulentpoint_Cfg[this._pointName].type];
            this.flowerModel.position = new Laya.Vector3(0, -pos[0], -pos[1]);
            this.flowerModel.scale = 1.1;
            this.flowerModel.Start(ui);
        }
        GetPotted(index) {
            if (index < 0)
                return;
            let point = PotManager.getInstance().PotMap[this._pointName];
            if (!point)
                return;
            if (point.PotList[index])
                return point.PotList[index];
            return;
        }
        UpdateBtn(state, index) {
            let tPot = this.GetPotted(index);
            this.speedUpGrowBtn.visible = false;
            this.img_ripepot.visible = false;
            this.diystate.visible = false;
            this.state_grow.visible = false;
            this.state_ripe.visible = false;
            this.SetDuoRouData(state);
            this.SetDiyEvaData(tPot);
            if (!state) {
                console.error("花盆是空？？？？？？？？");
                return;
            }
            else if (state == PotState.Grow) {
                this.diystate.visible = true;
                this.state_grow.visible = true;
                this.speedUpGrowBtn.visible = true;
                this.img_ripepot.visible = true;
                this.OnUpdateFlowerModel(this.img_ripepot, index);
                this.editBtn.disabled = true;
            }
            else if (state == PotState.Ripe) {
                this.diystate.visible = true;
                this.state_ripe.visible = true;
                this.editBtn.disabled = false;
                this.img_ripepot.visible = true;
                this.OnUpdateFlowerModel(this.img_ripepot, index);
            }
        }
        OnGotoGrowView() {
        }
        OnSpeedUp() {
            if (Laya.Browser.onWeiXin) {
                let _that = this;
                MyPlayer.wxSDK.Share(Share_Cfg[1]["strtitle"], { title: Share_Cfg[1]["strdescribe"], imageUrl: Share_Cfg[1]["strpic"], query: "" }, {
                    successFn: function () {
                        let tPot = _that.GetPotted(_that.curPottedId);
                        if (tPot && tPot.State == PotState.Grow) {
                            PotManager.getInstance().OnSpeedUp(_that._pointName, _that.curPottedId);
                        }
                    },
                    failFn() {
                    }
                });
            }
            else {
                let tPot = this.GetPotted(this.curPottedId);
                if (tPot && tPot.State == PotState.Grow) {
                    PotManager.getInstance().OnSpeedUp(this._pointName, this.curPottedId);
                }
                this.UpdatePotList();
            }
            DataLog.getInstance().LogVideo_log(GamePoint.Ripe);
            this.onClose();
        }
        OnReplacePot() {
            PotManager.getInstance().ReplaceCurUse(this._pointName, this.curPottedId);
            this.onClose();
        }
        OnGotoEditPot() {
            EffectManager.getInstance().BtnEffect(this.editBtn);
            let tPot = this.GetPotted(this.curPottedId);
            this.onClose();
            GameUIManager.getInstance().showUI(LoadingScenes1);
            SceneManager.getInstance().openScene(DIYScene.instance, [this._pointName, this.curPottedId, 1], Laya.Handler.create(this, () => {
            }));
        }
        SetDuoRouData(sState) {
            if (sState == null)
                return;
            let tPot = this.GetPotted(0);
            if (tPot == null)
                return;
            if (sState == PotState.Grow) {
                let pro_grow = this.state_grow.getChildByName("pro_grow");
                let la_growtime = this.state_grow.getChildByName("la_growtime");
                let nPro = (Time.Seconds - tPot.GrowStartTime) / tPot.GrowTime;
                pro_grow.value = nPro;
                let time = Utils.formatStandardTime(tPot.GrowTime - (Time.Seconds - tPot.GrowStartTime), false);
                la_growtime.text = Utils.format("正在成长 {0}", time);
                this.timeItme = la_growtime;
                this.timeItmepro = pro_grow;
            }
            else if (sState == PotState.Ripe) {
                let potnum = this.state_ripe.getChildByName("potnum");
                let pottips = this.state_ripe.getChildByName("pottips");
                let num = tPot._treeList.length;
                potnum.text = num + "";
                pottips.visible = this.ISHaveLock();
            }
        }
        ISHaveLock() {
            function func(potId) {
                if (Player.getInstance().nStar < Succulent_Cfg[potId].unlockstar) {
                    return false;
                }
                if (Player.getInstance().nGold < Succulent_Cfg[potId].gold) {
                    return false;
                }
                return true;
            }
            for (let i in this._potData) {
                if (!(Player.getInstance().tPotData[this._potData[i].id])) {
                    if (func(this._potData[i].id)) {
                        return true;
                    }
                }
            }
            return false;
        }
        SetDiyEvaData(Pot) {
            this.moneynum.text = Pot.giveReward() + "";
            this.photonum.text = Pot.takePhoto_outputGold() + "";
            let tScore = this.DiyEva.getChildByName("img_score");
            tScore.skin = Pot.GetQualityImg();
            let bg = this.DiyEva.getChildByName("bg");
            let data = Pot.GetNextTwoNode();
            this.second.skin = "gameui/flowerstate/potquality" + data[0] + ".png";
            this.trird.skin = "gameui/flowerstate/potquality" + data[1] + ".png";
            let va = Pot.quality / Constant_Cfg[9].value[data[1]];
            this.diyeva.value = va / 2 + 0.5;
            bg.x = 55 + this.diyeva.value * 360;
        }
    }

    class unLockDialog extends ui.view.unLock.unLockDialogUI {
        constructor(param) {
            super();
            this.lockData = null;
            this.callBack = null;
            this.preconditionTitle = null;
            if (!param) {
                console.log("unLockDialog没有任何参数");
                return;
            }
            this.lockData = param[0] || null;
            this.callBack = param[1] || null;
            this.preconditionTitle = param[2] || null;
        }
        onEnable() {
            this.init();
            this.bindEvent();
        }
        onDestroy() {
            this.unLock_btn.offAll();
            this.close_btn.offAll();
        }
        init() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            let canLock = this.preconditionTitle == null;
            let isUnLock = canLock && this.lockData.gold <= Player.getInstance().nGold && this.lockData.unlockstar <= Player.getInstance().nStar;
            this.title.text = this.lockData.struiname;
            this.item_img.skin = this.lockData.stricon;
            this.lock_num.text = this.lockData.unlockstar.toString();
            this.lock_num.color = this.lockData.unlockstar > Player.getInstance().nStar ? "#ff0400" : "#000000";
            this.money_num.text = this.lockData.gold.toString();
            this.money_num.color = this.lockData.gold > Player.getInstance().nGold ? "#ff0400" : "#000000";
            this.star_num.text = this.lockData.star.toString();
            if (canLock) {
                this.preconditionTips.visible = false;
            }
            else {
                this.preconditionTips.text = "前置节点：\n" + this.preconditionTitle + "  未解锁\n请前往解锁!";
                this.preconditionTips.visible = true;
            }
            this.unLock_btn.disabled = !isUnLock;
        }
        bindEvent() {
            this.unLock_btn.on(Laya.Event.CLICK, this, this.unLockEv);
            this.close_btn.on(Laya.Event.CLICK, this, this.closeEv);
        }
        unLockEv() {
            EffectManager.getInstance().BtnEffect(this.unLock_btn);
            if (this.callBack) {
                this.callBack(this.lockData);
            }
            this.closeEv();
        }
        closeEv() {
            GameUIManager.getInstance().destroyUI(this);
        }
    }

    var Sprite$1 = Laya.Sprite;
    var Handler$9 = Laya.Handler;
    var Pool$3 = Laya.Pool;
    var Event$2 = Laya.Event;
    var Tween$2 = Laya.Tween;
    var BubbleType;
    (function (BubbleType) {
        BubbleType[BubbleType["Normal"] = 0] = "Normal";
        BubbleType[BubbleType["Wealthy"] = 1] = "Wealthy";
        BubbleType[BubbleType["pickMoney"] = 2] = "pickMoney";
        BubbleType[BubbleType["Noise"] = 3] = "Noise";
        BubbleType[BubbleType["Collect"] = 4] = "Collect";
    })(BubbleType || (BubbleType = {}));
    class Bubble extends Sprite$1 {
        init(tableId, camera, type, owner = null, handler = null) {
            this.sceneCamera = camera;
            this.owner = owner;
            this.bubble = new Sprite$1();
            this.type = type;
            this.callback = handler;
            this.mouseEnabled = true;
            this.bubble.mouseEnabled = true;
            this.bubble.name = "bubble";
            this.on(Event$2.MOUSE_UP, this, this.onClick);
            this.addChild(this.bubble);
            var str = Action_Cfg[tableId].stricon;
            if (!str)
                return;
            this.bubble.loadImage(str, Handler$9.create(this, function (ret) {
                this.bubble.pivotX = this.bubble.width / 2;
                this.bubble.pivotY = this.bubble.height;
                this.setPosition();
            }));
        }
        changeImage(url) {
            if (!url)
                return;
            this.off(Event$2.MOUSE_UP, this, this.onClick);
            this.bubble.loadImage(url, Handler$9.create(this, function (ret) {
                this.bubble.pivotX = this.bubble.width / 2;
                this.bubble.pivotY = this.bubble.height;
                this.setPosition();
            }));
        }
        RotationIcon() {
            var add = false;
            Laya.timer.loop(1, this, () => {
                if (!add) {
                    this.bubble.scaleX -= 0.2;
                    if (this.bubble.scaleX <= -1)
                        add = true;
                }
                else {
                    this.bubble.scaleX += 0.2;
                    if (this.bubble.scaleX >= 1)
                        add = false;
                }
            });
        }
        onClick(e) {
            this.scaleX = 1.1;
            this.scaleY = 1.1;
            Tween$2.to(this, { scaleX: 1, scaleY: 1 }, 50);
            this.callback && this.callback.run();
        }
        setPosition() {
            if (!this.owner)
                return;
            if (this.bubble == null || this.bubble == undefined)
                return;
            var v2 = Utils.worldToScreen(this.sceneCamera, this.owner.transform.position);
            this.pos(v2.x, v2.y - 80);
        }
        isMove() {
            return this.owner.isMove;
        }
        destroy(destroyChild) {
            this.off(Event$2.MOUSE_UP, this, this.onClick);
            this.bubble.destroy();
            this.bubble = null;
            this.removeSelf();
            Pool$3.recover("bubble", this);
            Laya.timer.clearAll(this);
        }
    }

    var Pool$4 = Laya.Pool;
    class BubbleCreater {
        constructor() {
            this._bubbleList = new Array();
            this.createIndex = 0;
        }
        static get instance() {
            if (!this._instance)
                this._instance = new BubbleCreater();
            return this._instance;
        }
        createBubble(tableId, camera, type, owner = null, handler = null) {
            var bubble = Pool$4.getItemByClass("bubble", Bubble);
            bubble.init(tableId, camera, type, owner, handler);
            bubble.createIndex = this.createIndex;
            bubble.name = "bubble";
            this._bubbleList.push(bubble);
            LayerManager.getInstance().downUILayer.addChild(bubble);
            if (!this.isInUpdate)
                Laya.timer.loop(10, this, this.onUpdate);
            this.isInUpdate = true;
            this.createIndex += 1;
            return bubble;
        }
        removeBubble(bubble) {
            for (var i = 0; i < this._bubbleList.length; ++i) {
                if (this._bubbleList[i].createIndex == bubble.createIndex) {
                    this._bubbleList[i].destroy();
                    this._bubbleList.splice(i, 1);
                    break;
                }
            }
            if (this._bubbleList.length == 0) {
                Laya.timer.clear(this, this.onUpdate);
                this.isInUpdate = false;
            }
        }
        GetTypewithNormal() {
            let b = null;
            this._bubbleList.forEach(element => {
                if (element.type == BubbleType.Normal) {
                    b = element;
                    return;
                }
            });
            return b;
        }
        onUpdate() {
            for (var i = 0; i < this._bubbleList.length; ++i) {
                this._bubbleList[i].setPosition();
            }
        }
    }

    class Dictionary {
        constructor() {
            this.items = {};
            this.count = 0;
        }
        has(key) {
            return this.items.hasOwnProperty(key);
        }
        set(key, val) {
            this.items[key] = val;
            this.count++;
        }
        delete(key) {
            if (this.has(key)) {
                delete this.items[key];
                this.count--;
            }
            return false;
        }
        get(key) {
            return this.has(key) ? this.items[key] : undefined;
        }
        clear() {
            this.items = {};
            this.count = 0;
        }
        Count() {
            return this.count;
        }
        values() {
            let values = [];
            for (let k in this.items) {
                if (this.has(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        }
        forEach(callback) {
            for (const key of Object.keys(this.items)) {
                if (this.items.hasOwnProperty(key)) {
                    callback.call(this, this.get(key));
                }
            }
        }
    }

    var Script3D = Laya.Script3D;
    var Animator = Laya.Animator;
    class AnimatorController extends Script3D {
        constructor() {
            super(...arguments);
            this._curAnimator = "";
        }
        onAwake() {
            super.onAwake();
        }
        onEnable() {
            super.onEnable();
            this.character = this.owner;
            this._animator = this.character.sprite3dNode.getComponent(Animator);
            if (this._curAnimator)
                this.play(this._curAnimator);
        }
        onDisable() {
            super.onDisable();
        }
        onDestroy() {
            super.onDestroy();
        }
        play(animatorName) {
            this._curAnimator = animatorName;
            this._animator && this._animator.play(animatorName);
        }
        initAnimator() {
            if (!this._animator)
                this._animator = this.character.getComponent(Animator);
        }
    }

    class GameData {
        static onInit() {
            this.LoadInfo();
        }
        onDestroy() { }
        static ChangUpGrade(tableID) {
            let data = this.GetRole(tableID);
            data.updateState = 1;
            data.updateTimeStamp = Time.serverSeconds;
            SaveManager.getInstance().SetStaffCache(this._roleInfo);
        }
        static upgrade(beforeId, laterId) {
            let data = this.GetRole(beforeId);
            if (data.id == beforeId) {
                data.id = laterId;
                data.updateState = 0;
                data.updateTimeStamp = 0;
                SaveManager.getInstance().SetStaffCache(this._roleInfo);
            }
        }
        static InitStaffID(id, dataIndex) {
            if (dataIndex != -1) {
                let array = this._roleInfo;
                array[dataIndex]["id"] = id;
                this._roleInfo = array;
                SaveManager.getInstance().SetStaffCache(array);
            }
        }
        static get RoleInfo() {
            return this._roleInfo;
        }
        static set RoleInfo(a) {
            this._roleInfo = a;
        }
        static GetRole(nID) {
            for (let i in this._roleInfo) {
                if (nID == this._roleInfo[i].id) {
                    return this._roleInfo[i];
                }
            }
        }
        static LoadInfo() {
            let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
            if (value) {
                this._roleInfo = value;
            }
            else {
                let idunm = Utils.GetTableLength(Staff_Cfg);
                let staffunm = Staff_Cfg[idunm].staffID;
                for (let i = 1; i <= staffunm; i++) {
                    for (let j = 1; j <= idunm; j++) {
                        if (Staff_Cfg[j]["staffID"] == i) {
                            let data = {
                                id: 0,
                                updateState: 0,
                                workState: 0,
                                updateTimeStamp: 0,
                                workTimeStamp: 0,
                                restTimeStamp: 0,
                                workOrRestTimeCD: 0
                            };
                            this._roleInfo.push(data);
                            break;
                        }
                    }
                }
                SaveManager.getInstance().SetStaffCache(this._roleInfo);
            }
            let da = SaveManager.getInstance().GetCache(ModelStorage.Tree);
            if (da) {
                this._treeInfo = da;
            }
        }
        static get ItemInfo() {
            return this._treeInfo;
        }
        static set ItemInfo(a) {
            this._treeInfo = a;
        }
        static GetItem(staffId) {
            return this._treeInfo[staffId];
        }
        static AddItem(staffId, itemId) {
            if (!staffId && !itemId) {
                return;
            }
            if (this._treeInfo && this._treeInfo[staffId]) {
                let array = this._treeInfo[staffId];
                for (const key in array) {
                    if (Object.prototype.hasOwnProperty.call(array, key)) {
                        const element = array[key];
                        if (element[1] == itemId) {
                            element[0] += 1;
                            this.SaveTree(this._treeInfo);
                            return;
                        }
                    }
                }
            }
            let array = this._treeInfo[staffId];
            if (array) {
                array.push([1, itemId]);
                this._treeInfo[staffId] = array;
            }
            else {
                let DataList = new Array();
                DataList.push([1, itemId]);
                this._treeInfo[staffId] = DataList;
            }
            this.SaveTree(this._treeInfo);
        }
        static ClearItem(staffID) {
            let array = this._treeInfo[staffID];
            if (array) {
                array.forEach(element => {
                    BagSystem.getInstance().addItem(element[1], element[0]);
                });
            }
            this._treeInfo[staffID] = null;
            this.SaveTree(this._treeInfo);
        }
        static SaveTree(array) {
            SaveManager.getInstance().SetTreeCache(array);
        }
    }
    GameData._roleInfo = [];
    GameData._treeInfo = {};

    var Sprite3D$8 = Laya.Sprite3D;
    var Pool$5 = Laya.Pool;
    class StaffBase extends Sprite3D$8 {
        constructor() {
            super();
            this._loadDone = false;
            this.upgradeing = false;
            this.upgradeTime = 0;
        }
        onLoad(tableId) {
            this.createById(tableId);
        }
        onStop() { }
        onUpdate() {
            if (this._loadDone) {
                if (this.upgradeing) {
                    this.upgradeTime = this.upgradeTime - Laya.timer.delta / 1000;
                    if (this.upgradeTime <= 0) {
                        this.upgradeing = false;
                        this.upgrade(this._id + 1);
                        GameData.upgrade(this._id - 1, this._id);
                    }
                }
            }
        }
        onDestroy() { }
        onClick() { }
        createById(tableId) {
            this._tableData = Staff_Cfg[tableId];
            if (!this._tableData) {
                console.log("員工表中没有id = " + tableId.toString());
                return;
            }
            this._id = tableId;
            this._lv = this._tableData.lv;
            this._type = this._tableData.jobID;
        }
        GetType() {
            return this._type;
        }
        GetId() {
            return this._id;
        }
        Getgrade() {
            return this._lv;
        }
        SetupgradeTime(time) {
            this.upgradeTime = time;
        }
        cloneThis(sp3d) {
            this.sprite3dNode = sp3d.clone();
            this._animator = this.addComponent(AnimatorController);
            this.addChild(this.sprite3dNode);
        }
        moveTo(path, complate) {
            if (this._moveController)
                this._moveController.moveTo(path, complate);
        }
        stopMove() {
            if (this._moveController)
                this._moveController.stopMove();
        }
        recover() {
            this.sprite3dNode.destroy();
            this.sprite3dNode = null;
            Pool$5.recover(this.clsName, this);
        }
        playAnimation(name) {
            this._animator.play(name);
        }
        upgrade(tableId) {
            this.upgradeing = false;
            this._id = tableId;
            this._tableData = Staff_Cfg[tableId];
            this._lv = this._tableData.lv;
            this._type = this._tableData.jobID;
            switch (this._type) {
                case 2:
                    GEvent.DispatchEvent(GacEvent.OnUpdata_dustmantime);
                    break;
                case 3:
                    GEvent.DispatchEvent(GacEvent.OnUpdata_cameramantime);
                    break;
            }
        }
        ChangUpGrade() {
            this.upgradeTime = Staff_Cfg[this._id].cd * 60;
            this.upgradeing = true;
        }
    }

    var Script3D$1 = Laya.Script3D;
    var Vector3$8 = Laya.Vector3;
    class MoveController extends Script3D$1 {
        constructor() {
            super();
            this.speed = 2;
            this._currentPathStep = 0;
            this._curDistance = 0;
            this._distance = 0;
            this._dirationX = 0;
            this._dirationZ = -1;
        }
        onAwake() {
            super.onAwake();
        }
        onEnable() {
            super.onEnable();
            this.character = this.owner;
        }
        onDisable() {
            super.onDisable();
        }
        onDestroy() {
            super.onDestroy();
        }
        get character() {
            if (!this._character)
                this.character = this.owner;
            return this._character;
        }
        set character(c) {
            this._character = c;
        }
        moveTo(wayPoint, complate = null, offset = 0) {
            wayPoint = wayPoint.concat();
            this._path = wayPoint;
            if (this._path.length <= 0) {
                complate && complate.run();
                return;
            }
            this._finishArgs = wayPoint.callback;
            this._offset = offset;
            this._complate = complate;
            this._currentPathStep = 0;
            if (!this.isMove) {
                this.isMove = true;
            }
            else {
                this._keepMove = true;
            }
            this._path.unshift(this.character.transform.position.clone());
            this._curDistance = 0;
            this._distance = 0;
            for (var a = 0; a < this._path.length - 1; a++) {
                this._distance += Vector3$8.distance(this._path[a], this._path[a + 1]);
            }
        }
        changSpeed(num) {
            if (this.speed == num)
                return;
            this.speed = num;
            this.isMove = this.isMove;
        }
        get isMove() {
            return this._isMove;
        }
        set isMove(bool) {
            if (bool) {
                Laya.timer.loop(1, this, this.update);
                this._isMove = true;
                if (this.speed <= Constant_Cfg[12].value) {
                    this.character.playAnimation(CommonDefine.ANIMATION_WAKL);
                }
                else if (this.speed > Constant_Cfg[12].value) {
                    this.character.playAnimation(CommonDefine.ANIMATION_Run);
                }
            }
            else {
                Laya.timer.clear(this, this.update);
                this._isMove = false;
                this.character.playAnimation(CommonDefine.ANIMATION_IDLE);
            }
        }
        stopMove() {
            if (!this._keepMove)
                this.isMove = false;
        }
        update() {
            if (!this._isMove)
                return;
            this._curDistance += this.speed * Laya.timer.delta / 1000;
            if (this._curDistance > this._distance) {
                this._curDistance = this._distance;
                this.isMove = false;
                this.character.transform.position = this._path[this._path.length - 1];
                this._complate && this._complate.run();
                return;
            }
            let lastPoint = 0;
            let dis = 0;
            for (var a = 0; a < this._path.length - 1; a++) {
                lastPoint = dis;
                dis += Vector3$8.distance(this._path[a], this._path[a + 1]);
                if (dis > this._curDistance) {
                    let section = this._curDistance - lastPoint;
                    let dir = new Vector3$8(0, 0, 0);
                    Vector3$8.subtract(this._path[a + 1], this._path[a], dir);
                    Vector3$8.normalize(dir, dir);
                    Vector3$8.scale(dir, section, dir);
                    var fin = new Vector3$8(0, 0, 0);
                    Vector3$8.add(this._path[a], dir, fin);
                    this.character.transform.position = fin;
                    this.calcOwnerAngleBySpeed(dir.x, dir.z);
                    break;
                }
            }
        }
        calcOwnerAngleBySpeed(disX, disZ) {
            let roleSpeed = 5;
            this._dirationX = this._dirationX + (disX - this._dirationX) * Laya.timer.delta / 1000 * roleSpeed;
            this._dirationZ = this._dirationZ + (disZ - this._dirationZ) * Laya.timer.delta / 1000 * roleSpeed;
            this.character.transform.localRotationEulerY = Math.atan2(this._dirationX, this._dirationZ) * 180 / Math.PI;
        }
    }
    MoveController.target = new Vector3$8();

    var Sprite3D$9 = Laya.Sprite3D;
    var Handler$a = Laya.Handler;
    var Pool$6 = Laya.Pool;
    var PhysicsCollider$1 = Laya.PhysicsCollider;
    class NpcBase extends Sprite3D$9 {
        constructor() {
            super();
            this._isHaveProgressBar = false;
            this.clickIndex = 0;
            this.pickUpMoneySpeed = 2000;
            this.Cruise_speed = 2;
            this.Fadeaway = false;
            this.alphaValue = 0.5;
        }
        onLoad() { }
        onMove() { }
        onStop() { }
        onUpdate() {
            if (this.state) {
                this.state.Update();
            }
        }
        onDestroy() { }
        createById(tableId) {
            this._tableData = Npc_Cfg[tableId];
            if (!this._tableData) {
                console.log("npc表中没有id = " + tableId.toString());
                return;
            }
            this.type = this._tableData.type;
            this.Cruise_speed = this._tableData.Cruise_speed;
        }
        cloneThis(sp3d) {
            this.sprite3dNode = sp3d.clone();
            this._moveController = this.addComponent(MoveController);
            this._animator = this.addComponent(AnimatorController);
            this.addChild(this.sprite3dNode);
        }
        recover() {
            this.sprite3dNode.destroy();
            this.sprite3dNode = null;
            Pool$6.recover(this.clsName, this);
        }
        playAnimation(name) {
            this._animator.play(name);
        }
        moveTo(path, complate) {
            if (this._moveController) {
                this._moveController.moveTo(path, complate);
            }
        }
        get isMove() {
            return !this._moveController ? false : this._moveController.isMove;
        }
        set isMove(b) {
            if (this._moveController) {
                this._moveController.isMove = b;
            }
        }
        onClick() {
        }
        isHaveProgressBar() {
            return false;
        }
        ChangeState(state) {
            if (this.state != null) {
                this.state.Exit();
            }
            this.state = state;
            if (this.state != null) {
                this.state.Enter();
            }
        }
        GetType() {
            if (this.state != null) {
                return this.state.GetType();
            }
        }
        GetCamera() { }
        set clickEnable(b) {
            if (this.sprite3dNode) {
                this.setClickEnable(b);
            }
        }
        setClickEnable(b) {
            var c = this.sprite3dNode.getComponent(PhysicsCollider$1);
            if (c)
                c.enabled = b;
            else
                console.log("角色没有碰撞盒");
        }
        GetstealGold(range = 1) {
            var nearItem = SceneItemCreater.getInstance().getNearItem(this.transform.position, range);
            if (nearItem == null || nearItem == undefined) {
                return false;
            }
            return true;
        }
        stealGold(range = 1, hander) {
            var nearItem = SceneItemCreater.getInstance().getNearItem(this.transform.position, range);
            if (!nearItem) {
                hander && hander.runWith(false);
                return;
            }
            this.moveTo([nearItem.transform.position], Handler$a.create(this, () => {
                this.playAnimation(CommonDefine.ANIMATION_PickMoney);
                Laya.timer.once(this.pickUpMoneySpeed, this, () => {
                    SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
                    var v2 = Utils.worldToScreen(GameScene.instance.camera, nearItem.pos);
                    Utils.createNumberText(nearItem.addGold.toString(), v2.x, v2.y, "-", false);
                    nearItem.onClick();
                    hander && hander.runWith(true);
                });
            }));
        }
        changMoveSpeed(speed) {
            this._moveController.changSpeed(speed);
        }
        LookAtPoint(pointName) {
            let point = GameScene.instance.scene3d.getChildByName("point").getChildByName(pointName);
            if (point == null) {
                Debug.Log("没有找到可以看向的多肉点！！！！！！！！！！！！！！");
                return;
            }
            let disX = point.transform.position.x - this.transform.position.x;
            let disZ = point.transform.position.z - this.transform.position.z;
            if (this.transform != null || this.transform != undefined) {
                this.transform.localRotationEulerY = Math.atan2(disX, disZ) * 180 / Math.PI;
            }
        }
        paymoneycallBack() {
            if (!this.sprite3dNode || this.sprite3dNode.destroyed)
                return;
            let offset = 0.5 / ((this._tableData.disappear_time / 0.5) + 1);
            this.SetModelAlpha(this.alphaValue - offset);
            if (this.alphaValue <= 0) {
                this.Fadeaway = false;
                Laya.timer.clear(this, this.paymoneycallBack);
                this._aiController.onStop();
            }
        }
        disappear() {
            this._moveController.changSpeed(this._tableData.disappear_speed);
            this.alphaValue = 0.5;
            this.paymoneycallBack();
            Laya.timer.loop(500, this, this.paymoneycallBack);
            this.Fadeaway = true;
        }
        escape(hander) { }
        ActionDone() { }
        changActionSite(id) { }
        GetActionSite() { return this.ActionSite; }
        SetModelAlpha(alphaValue) {
            this.alphaValue = alphaValue;
            Utils.setModelAlpha(this.sprite3dNode, this.alphaValue);
        }
    }

    var Script3D$2 = Laya.Script3D;
    class AIBase extends Script3D$2 {
        init(npc) {
            this.character = npc;
            GEvent.RegistEvent(GacEvent.OnUpdate, Laya.Handler.create(this, this.OnUpdate));
        }
        OnUpdate() { }
        isKeepUpMove() { }
        onMove() { }
        onPay(type) { }
        onStop() { }
        ClickTypeThreeNpc(index) { }
        ClickTypeFourNpc() { }
        goAwaryPath() { }
        ActionDonePath() { }
        isContainMarplot(pos) {
            return NpcManager.getInstance().isContainMarplot(pos);
        }
        LookAt(pointName) {
            this.character.LookAtPoint(pointName);
        }
        PlayAnimation(AniName) {
            this.character.playAnimation(AniName);
        }
    }

    var NpcStateType;
    (function (NpcStateType) {
        NpcStateType["None"] = "none";
        NpcStateType["Default"] = "default";
        NpcStateType["Move"] = "move";
        NpcStateType["Action"] = "action";
        NpcStateType["DriveAway"] = "driveaway";
        NpcStateType["Idle"] = "idle";
    })(NpcStateType || (NpcStateType = {}));
    class NpcBaseState {
        constructor(aiBase) {
            this._aiBase = aiBase;
        }
        Enter() { }
        Update() { }
        Exit() { }
        GetType() {
            return NpcStateType.None;
        }
    }

    var Handler$b = Laya.Handler;
    class NpcMoveState extends NpcBaseState {
        constructor(ai) {
            super(ai);
        }
        Enter() {
            super.Enter();
            this._aiBase.character.moveTo(this._aiBase.Currentpath, Handler$b.create(this, this.next));
        }
        Update() {
            super.Update();
        }
        Exit() {
            super.Exit();
        }
        GetType() {
            return NpcStateType.Move;
        }
        next() {
            if (this._aiBase.character.GetType() == NpcStateType.Move) {
                this._aiBase.isKeepUpMove();
            }
        }
    }

    class NpcActionState extends NpcBaseState {
        constructor(ai, ty) {
            super(ai);
            this.type = ty;
        }
        Enter() {
            super.Enter();
            this._aiBase.onPay(this.type);
        }
        Update() {
            super.Update();
        }
        Exit() {
            super.Exit();
        }
        GetType() {
            return NpcStateType.Action;
        }
    }

    class NpcDefaultState extends NpcBaseState {
        constructor(npc) {
            super(npc);
        }
        GetType() {
            return NpcStateType.Default;
        }
    }

    var Vector3$9 = Laya.Vector3;
    class PathManager extends Singleton {
        constructor() {
            super(...arguments);
            this.pathDic = new Dictionary();
            this.collectDIc = new Dictionary();
            this.collectIdleDIc = new Dictionary();
            this.collectPathDic = new Dictionary();
            this.collectArray = null;
            this.growSpecialArray = new Array();
            this.growCommonArray = new Array();
        }
        onInit() {
            this.initPath();
            this.initCollectIdle();
            this.initGrowPoint();
            this.initCollectPath();
        }
        onUpdata() {
        }
        onDestroy() {
        }
        initPath() {
            this.pathDic.clear();
            var childrenNode = GameScene.instance.scene3d.getChildByName("path");
            if (!childrenNode) {
                console.log("路径点为空");
                return;
            }
            var num = childrenNode.numChildren;
            for (var i = 0; i < num; ++i) {
                var childNode = childrenNode.getChildAt(i);
                var arrPath = new Array();
                for (var j = 0; j < childNode.numChildren; ++j) {
                    arrPath.push(childNode.getChildAt(j).transform.position);
                }
                this.pathDic.set(childNode.name, arrPath);
            }
        }
        initCollectPath() {
            this.collectPathDic.clear();
            var childrenNode = GameScene.instance.scene3d.getChildByName("scenes1_caijipoint");
            if (!childrenNode) {
                console.log("路径点为空");
                return;
            }
            var num = childrenNode.numChildren;
            for (var i = 0; i < 10; ++i) {
                var childNode = childrenNode.getChildAt(i);
                var arrPath = new Array();
                for (var j = 0; j < childNode.numChildren; ++j) {
                    arrPath.push(childNode.getChildAt(j).transform.position);
                }
                this.collectPathDic.set(childNode.name, arrPath);
            }
        }
        initCollect() {
            this.collectDIc.clear();
            var childrenNode = GameScene.instance.scene3d.getChildByName("caijipath").getChildByName("scene1");
            if (!childrenNode) {
                console.log("路径点为空");
                return;
            }
            var num = childrenNode.numChildren;
            for (var i = 0; i < num; ++i) {
                var childNode = childrenNode.getChildAt(i);
                this.collectDIc.set(childNode.name, childNode.transform.position);
            }
        }
        initGrowPoint() {
            for (var i = 1; i < 2; ++i) {
                var childrenNode = GameScene.instance.scene3d.getChildByName("scenes" + i.toString() + "_caijipoint");
                var pt = childrenNode.getChildByName("pt");
                var num = pt.numChildren;
                var arr = new Array();
                for (var j = 0; j < num; ++j) {
                    var arrPT = new Array();
                    var s = pt.getChildAt(j);
                    for (var k = 0; k < s.numChildren; ++k) {
                        arrPT.push(s.getChildAt(k).transform.position);
                    }
                    arr.push(arrPT);
                }
                this.growCommonArray[i] = arr;
                var ts = childrenNode.getChildByName("ts");
                var num = ts.numChildren;
                var arrTs = new Array();
                for (var j = 0; j < num; ++j) {
                    arrTs.push(ts.getChildAt(j).transform.position);
                }
                this.growSpecialArray[i] = arrTs;
            }
        }
        initCollectIdle() {
            this.collectIdleDIc.clear();
            var childrenNode = GameScene.instance.scene3d.getChildByName("rest area");
            if (!childrenNode) {
                console.log("路径点为空");
                return;
            }
            var num = childrenNode.numChildren;
            for (var i = 0; i < num; ++i) {
                var childNode = childrenNode.getChildAt(i);
                this.collectIdleDIc.set(childNode.name, [childNode.transform.position, false]);
            }
        }
        getPathByName(name) {
            return this.pathDic.has(name) ? this.pathDic.get(name) : [];
        }
        getCollectByName(name) {
            return this.collectDIc.has(name) ? this.collectDIc.get(name) : [];
        }
        getCollectPathByName(name) {
            name = "path" + name;
            return this.collectPathDic.has(name) ? this.collectPathDic.get(name) : [];
        }
        getCollectIdleByName(name) {
            if (this.collectIdleDIc.has(name.toString())) {
                let path = this.collectIdleDIc.get(name);
                if (path[1])
                    return this.getCollectIdleByName(name + 1);
                else {
                    path[1] = true;
                    return path[0];
                }
            }
            return null;
        }
        getCollectIdleClear(pos) {
            for (const key in this.collectIdleDIc.items) {
                if (this.collectIdleDIc.items.hasOwnProperty(key)) {
                    const element = this.collectIdleDIc.items[key];
                    if (Vector3$9.equals(element[0], pos)) {
                        element[1] = false;
                    }
                }
            }
        }
        getAllCollect() {
            if (!this.collectArray)
                this.collectArray = Utils.formatObject2Array(this.collectDIc.items);
            return this.collectArray;
        }
        getPathByDistance(pos) {
            var dis = 1000;
            var name;
            var _dis;
            var posPoint;
            for (const key of Object.keys(this.pathDic.items)) {
                if (this.pathDic.items.hasOwnProperty(key)) {
                    posPoint = this.getPathByName(key)[0];
                    _dis = Vector3$9.distance(pos, posPoint);
                    if (_dis < dis) {
                        dis = _dis;
                        name = key;
                    }
                }
            }
            return name;
        }
        getCollectByDistance(pos, list) {
            var dis = 1000;
            var name;
            var _dis;
            var posPoint;
            for (const key of Object.keys(this.collectDIc.items)) {
                if (list.indexOf(key) > -1)
                    continue;
                if (this.collectDIc.items.hasOwnProperty(key)) {
                    posPoint = this.getCollectByName(key);
                    _dis = Vector3$9.distance(pos, posPoint);
                    if (_dis < dis && _dis > 0.1) {
                        dis = _dis;
                        name = key;
                    }
                }
            }
            return name;
        }
        getCollectWallName() {
            return this.collectDIc.items;
        }
    }

    class NpcDriveAwayState extends NpcBaseState {
        constructor(ai) {
            super(ai);
        }
        Enter() {
            super.Enter();
            if (this._aiBase == null || this._aiBase == undefined)
                return;
            if (this._aiBase.character == null || this._aiBase.character == undefined)
                return;
            this._aiBase.character.changMoveSpeed(this._aiBase.character._tableData.harass_speed);
            this._aiBase.ActionDonePath();
        }
        Update() {
            super.Update();
        }
        Exit() {
            super.Exit();
        }
        GetType() {
            return NpcStateType.DriveAway;
        }
        goAwaryPath() {
            this._aiBase.goAwaryPath();
        }
    }

    var NpcStateType$1;
    (function (NpcStateType) {
        NpcStateType["None"] = "none";
        NpcStateType["Default"] = "default";
        NpcStateType["Move"] = "move";
        NpcStateType["Action"] = "action";
        NpcStateType["DriveAway"] = "driveaway";
        NpcStateType["Idle"] = "idle";
    })(NpcStateType$1 || (NpcStateType$1 = {}));
    class NpcBaseState$1 {
        constructor(aiBase) {
            this._aiBase = aiBase;
        }
        Enter() { }
        Update() { }
        Exit() { }
        GetType() {
            return NpcStateType$1.None;
        }
    }

    var Vector3$a = Laya.Vector3;
    var Handler$c = Laya.Handler;
    class NorVisitorAI extends AIBase {
        constructor() {
            super(...arguments);
            this.NorDic = {};
            this.CurrentPathId = 1;
            this.pickUpMoneyIndex = 0;
            this.delaytime = 10;
        }
        init(npc) {
            super.init(npc);
            this.initActionMap();
            let pathName = Path_Cfg[this.CurrentPathId].strPathName;
            this.Currentpath = PathManager.getInstance().getPathByName(pathName);
            if (this.character.isMove || this.character.GetType() == NpcStateType$1.Action)
                return;
            this.onMove();
        }
        initActionMap() {
            this.NorDic[1] = this.payMoney;
            this.NorDic[2] = this.creatBubble;
            this.NorDic[3] = this.creatMoreBubble;
            this.NorDic[4] = this.pickUpMoney;
            this.NorDic[5] = this.makeTrouble;
        }
        OnUpdate() {
            super.OnUpdate();
            if (this.character) {
                if (this.character.type == 1 || this.character.type == 2) {
                    if (NpcManager.getInstance().nordriveAwayVisitors(this.character.transform.position))
                        this.character.changMoveSpeed(this.character._tableData.harass_speed);
                    else
                        this.character.changMoveSpeed(this.character.Cruise_speed);
                }
            }
        }
        onMove() {
            super.onMove();
            let state = new NpcMoveState(this);
            this.character.ChangeState(state);
        }
        RangePath() {
            if (Path_Cfg[this.CurrentPathId].strLinkPathID == 0) {
                this.onStop();
                return;
            }
            this.GetNextPath();
            this.onMove();
        }
        RuntoStop() {
            let state = new NpcDefaultState(this);
            this.character.ChangeState(state);
            this.GetNextPath();
            let path = this.Currentpath;
            this.GetNextPath();
            path = path.concat(this.Currentpath);
            this.character.moveTo(path, null);
        }
        GetNextPath() {
            if (Path_Cfg[this.CurrentPathId].strLinkPathID == 0) {
                this.onStop();
                return;
            }
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this.character)
                    BubbleCreater.instance.removeBubble(element);
            });
            let content = Path_Cfg[this.CurrentPathId].strLinkPathID.split(",");
            let index;
            if (content.length == 2) {
                let strProb = Path_Cfg[this.CurrentPathId].strProb.split(",");
                if (strProb.length == 2) {
                    let bu = GameScene.instance.getBottomByName(Path_Cfg[this.CurrentPathId].strStatue);
                    let cost = 0;
                    if (bu) {
                        cost = bu.getWeight();
                    }
                    if (cost > 0)
                        index = content[1];
                    else
                        index = content[0];
                }
                this.CurrentPathId = index;
                this.Currentpath = PathManager.getInstance().getPathByName(Path_Cfg[this.CurrentPathId].strPathName);
            }
            else {
                this.CurrentPathId = Path_Cfg[this.CurrentPathId].strLinkPathID;
                let pathName = Path_Cfg[this.CurrentPathId].strPathName;
                this.Currentpath = PathManager.getInstance().getPathByName(pathName);
            }
        }
        RangeActionPath() {
            if (Path_Cfg[this.CurrentPathId].strLinkPathID == 0) {
                this.onStop();
                return;
            }
            this.CurrentPathId = Path_Cfg[this.CurrentPathId].strLinkPathID;
            let pathName = Path_Cfg[this.CurrentPathId].strPathName;
            this.Currentpath = PathManager.getInstance().getPathByName(pathName).concat();
            let minNum = 1;
            let maxNum = this.Currentpath.length - 1;
            let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
            let value_b = parseInt(value_a);
            this.ActionPointIndex = value_b;
            let vector3 = this.Currentpath[this.ActionPointIndex];
            this.Currentpath = [vector3];
            this.onMove();
        }
        ActionDonePath() {
            if (this.character.type != 1 && this.character.type != 2)
                return;
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this.character)
                    BubbleCreater.instance.removeBubble(element);
            });
            this.character.changMoveSpeed(this.character.Cruise_speed);
            this.RangePath();
        }
        isKeepUpMove() {
            super.isKeepUpMove();
            let type = Path_Cfg[this.CurrentPathId].next;
            if (type > 3) {
                this.SwitchAction(type);
            }
            else {
                switch (type) {
                    case -1:
                        this.onStop();
                        break;
                    case 1:
                        this.RangePath();
                        break;
                    case 2:
                        this.RangePath();
                        break;
                    case 3:
                        this.RangeActionPath();
                        break;
                }
            }
        }
        SwitchAction(type) {
            if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
                let isHave = GameScene.instance.getBottomByPoint(Path_Cfg[this.CurrentPathId].strsucculentpoint);
                if (isHave) {
                    let Marplot = this.isContainMarplot(this.character.transform.position);
                    if (Marplot && this.character.type != 4 && this.character.type != 3) {
                        if (this.character.GetType() != NpcStateType$1.DriveAway) {
                            let state = new NpcDriveAwayState(this);
                            this.character.ChangeState(state);
                        }
                    }
                    else {
                        if (this.character.type == 3) {
                            if (!this.character.GetstealGold(2)) {
                                this.RangePath();
                                return;
                            }
                        }
                        let state = new NpcActionState(this, type);
                        this.character.ChangeState(state);
                    }
                }
                else {
                    this.RangePath();
                    return;
                }
            }
        }
        onStop() {
            super.onStop();
            let state = new NpcDefaultState(this);
            this.character.ChangeState(state);
            this.character.onStop();
        }
        onPay(type) {
            super.onPay(type);
            let stractionIds = this.character._tableData.stractionId.split("|");
            let stractionProbs = this.character._tableData.stractionProb.split("|");
            let id = stractionIds[type - 4].split(",");
            let prob = stractionProbs[type - 4].split(",");
            let ageCount = 0;
            if (SaveManager.getInstance().GetCache(ModelStorage.AgeNpcCount))
                ageCount = SaveManager.getInstance().GetCache(ModelStorage.AgeNpcCount);
            if (type - 4 == 0 && ageCount < 10) {
                this.payMoney();
                SaveManager.getInstance().SetAgeNpcCountCache(ageCount + 1);
            }
            else {
                let index = Utils.getWeight(prob);
                if (parseInt(id[index]) == 0) {
                    this.RangePath();
                    return;
                }
                else {
                    this.CurrentActionId = parseInt(id[index]);
                    let handler = this.NorDic[this.CurrentActionId];
                    handler && handler.call(this);
                }
            }
            if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
                this.LookAt(Path_Cfg[this.CurrentPathId].strsucculentpoint);
            }
        }
        creatBubble() {
            let bubble = BubbleCreater.instance.createBubble(2, GameScene.instance.camera, BubbleType.Normal, this.character, Laya.Handler.create(this, () => {
                BubbleCreater.instance.removeBubble(bubble);
                this.CreatGold(2, true);
                this.PlayAnimation(CommonDefine.ANIMATION_TakePhoto);
                let camera = this.character.GetCamera();
                camera.active = true;
                SoundManager.getInstance().playSound(Sound_Cfg[4].strsound);
                this.StopAutoDoneAction();
                Laya.timer.once(6000, this, () => {
                    camera.active = false;
                    this.RangePath();
                });
            }));
            this.OpenAutoDoneAction(this.delaytime, [bubble], false, false);
        }
        creatMoreBubble() {
            this.character.clickEnable = true;
            let bubble = BubbleCreater.instance.createBubble(3, GameScene.instance.camera, BubbleType.Wealthy, this.character, Laya.Handler.create(this, () => {
                this.character.onClick();
                BubbleCreater.instance.removeBubble(bubble);
                this.StopAutoDoneAction();
            }, null, false));
            this.OpenAutoDoneAction(this.delaytime, [bubble], true, false);
        }
        payMoney() {
            this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
            SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
            Laya.timer.once(1000, this, () => {
                this.CreatGold(1, false);
            });
            Laya.timer.once(2000, this, this.RangePath);
        }
        pickUpMoney() {
            Utils.setModelAlpha(this.character.sprite3dNode, 1);
            let bubble = null;
            if (!this.character.isHaveProgressBar()) {
                bubble = BubbleCreater.instance.createBubble(4, GameScene.instance.camera, BubbleType.pickMoney, this.character, Laya.Handler.create(this, () => {
                    this.character.onClick();
                    BubbleCreater.instance.removeBubble(bubble);
                }));
            }
            this.Action_PickMoney(bubble);
        }
        Action_PickMoney(bubble) {
            if (this.character.clickIndex >= 10)
                return;
            let ok = this.character.GetstealGold(2);
            if (ok) {
                this.character.stealGold(2, Handler$c.create(this, (pick) => {
                    if (pick) {
                        this.pickUpMoneyIndex++;
                        if (this.pickUpMoneyIndex >= 10) {
                            if (bubble)
                                BubbleCreater.instance.removeBubble(bubble);
                            this.RuntoStop();
                            this.character.disappear();
                            return;
                        }
                        this.Action_PickMoney(bubble);
                        return;
                    }
                    else
                        this.tool_DeteleBubble(bubble);
                }));
            }
            else
                this.tool_DeteleBubble(bubble);
        }
        tool_DeteleBubble(bubble) {
            this.character.SetModelAlpha(0.2);
            if (bubble)
                BubbleCreater.instance.removeBubble(bubble);
            this.RangePath();
        }
        ClickTypeThreeNpc(index) {
            super.ClickTypeThreeNpc(index);
            this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
            SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
            Laya.timer.once(1000, this, () => {
                this.CreatGold(1, false);
            });
            this.StopAutoDoneAction();
            if (index >= 10) {
                this.character.clickEnable = false;
                this.RangePath();
                this.character.ActionDone();
                return;
            }
        }
        makeTrouble() {
            this.character.clickEnable = true;
            this.PlayAnimation(CommonDefine.ANIMATION_makeTrouble);
            SoundManager.getInstance().playSound(Sound_Cfg[3].strsound);
            let bubble = BubbleCreater.instance.createBubble(5, GameScene.instance.camera, BubbleType.Noise, this.character, Laya.Handler.create(this, () => {
                this.character.onClick();
                BubbleCreater.instance.removeBubble(bubble);
            }, null, false));
            this.OpenAutoDoneAction(Constant_Cfg[13].value, [bubble], false, true);
        }
        ClickTypeFourNpc() {
            super.ClickTypeFourNpc();
            this.StopAutoDoneAction();
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this.character)
                    BubbleCreater.instance.removeBubble(element);
            });
            this.RuntoStop();
        }
        CreatGold(cost_scale, isStar) {
            let offset = new Vector3$a(Math.random(), Math.random(), Math.random());
            Vector3$a.scale(offset, 0.8, offset);
            Vector3$a.add(offset, this.character.transform.position, offset);
            let Potted = GameScene.instance.getBottomByPoint(Path_Cfg[this.CurrentPathId].strsucculentpoint);
            if (Potted) {
                let getGold = 0;
                if (cost_scale == 1) {
                    let minNum = -Constant_Cfg[21].value * 10;
                    let maxNum = Constant_Cfg[21].value * 10;
                    let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
                    let value_b = Number(value_a) / 10;
                    getGold = Potted.giveReward() + Potted.giveReward() * value_b;
                }
                else {
                    let minNum = -Constant_Cfg[22].value * 10;
                    let maxNum = Constant_Cfg[22].value * 10;
                    let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
                    let value_b = Number(value_a) / 10;
                    getGold = Potted.takePhoto_outputGold() + Potted.takePhoto_outputGold() * value_b;
                }
                getGold = Math.floor(getGold);
                if (getGold != 0)
                    GameScene.instance.createSceneItem(1, offset, getGold);
                if (isStar)
                    GameScene.instance.createSceneItem(2, offset);
            }
        }
        OpenAutoDoneAction(delaytime, param1, param2, param3) {
            Laya.timer.once(delaytime * 1000, this, this.AutoDoneAction, [param1, param2, param3]);
        }
        StopAutoDoneAction() {
            Laya.timer.clear(this, this.AutoDoneAction);
        }
        AutoDoneAction(param1, param2, param3) {
            BubbleCreater.instance.removeBubble(param1);
            if (param2)
                this.character.clickEnable = false;
            if (param3) {
                this.ClickTypeFourNpc();
                this.character.disappear();
            }
            else
                this.RangePath();
        }
    }

    var Sprite$2 = Laya.Sprite;
    var Handler$d = Laya.Handler;
    var ProgressBar = Laya.ProgressBar;
    class VisitorProgressBar extends Sprite$2 {
        constructor() {
            super(...arguments);
            this.bubble = new Sprite$2();
        }
        init(camera, owner = null, handler = null) {
            this.sceneCamera = camera;
            this.owner = owner;
            this.callback = handler;
            if (!this.progress) {
                Laya.loader.load(["res/image/progressBar.png", "res/image/progressBar$bar.png"], Handler$d.create(this, function () {
                    this.progress = new ProgressBar("res/image/progressBar.png");
                    this.progress.width = 80;
                    this.progress.height = 20;
                    this.progress.sizeGrid = "5,5,5,5";
                    this.progress.pivot(this.progress.width / 2, this.progress.height);
                    this.addChild(this.progress);
                    this.setPosition();
                    Laya.timer.loop(10, this, this.setPosition);
                    LayerManager.getInstance().downUILayer.addChild(this);
                    this.callback && this.callback.run();
                }));
            }
            else {
                this.setProgress(0);
                Laya.timer.loop(10, this, this.setPosition);
                LayerManager.getInstance().uiLayer.addChild(this);
                this.callback && this.callback.run();
            }
        }
        setProgress(value) {
            if (this.progress)
                this.progress.value = value;
        }
        setPosition() {
            if (!this.owner)
                return;
            var v2 = Utils.worldToScreen(this.sceneCamera, this.owner.transform.position);
            this.pos(v2.x, v2.y - 90);
        }
        isMove() {
            return this.owner.isMove;
        }
        destroy(destroyChild) {
            this.removeSelf();
            Laya.timer.clear(this, this.setPosition);
        }
    }

    var Handler$e = Laya.Handler;
    class VisitorNpc extends NpcBase {
        constructor() {
            super();
            this.firstClick = false;
        }
        createById(tableId) {
            super.createById(tableId);
            this.clickIndex = 0;
            this.firstClick = false;
            this.loadModel();
        }
        loadModel() {
            ResourceManager.getInstance().getResource(this._tableData.strmodelurl, Handler$e.create(this, (node) => {
                if (!node) {
                    console.log("NPC模型没有加载完成！");
                }
                this.sprite3dNode = node;
                this.Camera = Utils.FindTransfrom(this.sprite3dNode, "Prop_xiangji");
                this._animator = this.addComponent(AnimatorController);
                this._moveController = this.addComponent(MoveController);
                Laya.timer.callLater(this, () => {
                    this._aiController = this.addComponent(NorVisitorAI);
                    this._aiController.init(this);
                    this._moveController.changSpeed(this.Cruise_speed);
                });
                this.clickEnable = Boolean(this._tableData.click);
                this.addChild(this.sprite3dNode);
                if (this.type == 3) {
                    this.SetModelAlpha(0.2);
                }
            }));
        }
        GetCamera() {
            super.GetCamera();
            return this.Camera;
        }
        onClick() {
            if (this.type == 1)
                return;
            if (this.type == 3 || this.type == 4 || this.type == 2) {
                super.onClick();
                this.clickIndex++;
                BubbleCreater.instance._bubbleList.forEach(element => {
                    if (element.owner == this)
                        BubbleCreater.instance.removeBubble(element);
                });
                if (!this.firstClick) {
                    this.CreatProgressBar();
                    return;
                }
                if (this._ProgressBar) {
                    this._ProgressBar.setProgress(this.clickIndex * 0.1);
                    if (this.clickIndex >= 10) {
                        this.clickEnable = false;
                        this._ProgressBar.destroy();
                        if (this.type == 3 || this.type == 4) {
                            this.disappear();
                            if (this.type == 4 && this._aiController != null)
                                this._aiController.ClickTypeFourNpc();
                        }
                    }
                    if (this.type == 2 && this._aiController != null) {
                        this._aiController.ClickTypeThreeNpc(this.clickIndex);
                    }
                }
            }
        }
        CreatProgressBar() {
            this.firstClick = true;
            if (this.type == 3) {
                this._moveController.changSpeed(5);
                this.pickUpMoneySpeed = 500;
            }
            this._ProgressBar = new VisitorProgressBar();
            this._ProgressBar.init(GameScene.instance.camera, this, Handler$e.create(this, function () {
                this._ProgressBar.setProgress(this.clickIndex * 0.1);
            }));
            if (this.type == 2 && this._aiController != null) {
                this._aiController.ClickTypeThreeNpc(this.clickIndex);
            }
        }
        ActionDone() {
            super.ActionDone();
            this.firstClick = false;
            this.clickIndex = 0;
        }
        isHaveProgressBar() {
            super.isHaveProgressBar();
            if (this._ProgressBar) {
                return true;
            }
            return false;
        }
        disappear() {
            super.disappear();
            this.clickEnable = false;
            this._ProgressBar && this._ProgressBar.destroy();
            this._ProgressBar = null;
        }
        clear() {
            this.sprite3dNode.destroy();
            this.removeSelf();
            this._animator.destroy();
            this._moveController.destroy();
            this._aiController.destroy();
            this._ProgressBar && this._ProgressBar.destroy();
            this._animator = null;
            this._moveController = null;
            this._aiController = null;
            this._ProgressBar = null;
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this)
                    BubbleCreater.instance.removeBubble(element);
            });
            Laya.timer.clearAll(this);
        }
        onMove() {
            super.onMove();
        }
        onStop() {
            super.onStop();
            this.clear();
            NpcManager.getInstance().recoverNpc("NpcBase", this);
        }
        onUpdate() {
            super.onUpdate();
        }
        onDestroy() { }
    }

    class NpcCreater {
        constructor() {
            this.stopCreater = true;
            this.stop = true;
            this.needCreate = true;
            this._Array = new Array();
            this.bool_init = false;
            this.CreatInterval = 10000;
            this.getLocalData();
            GEvent.RegistEvent(CommonDefine.EVENT_UNLOCK_PLANT, Laya.Handler.create(this, this.AddNpcKind));
        }
        initCreater() {
            if (!this.bool_init) {
                this.bool_init = true;
                this.createNpc();
                Laya.timer.loop(this.CreatInterval, this, this.createNpc);
            }
        }
        clearCreater() {
            Laya.timer.clear(this, this.createNpc);
            GEvent.RemoveEvent(CommonDefine.EVENT_UNLOCK_PLANT, Laya.Handler.create(this, this.AddNpcKind));
        }
        AddNpcKind(name) {
            switch (name) {
                case "defaulsucculent3":
                    this._Array.push(2);
                    GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                        view.Init(7);
                    }));
                    break;
                case "defaulsucculent4":
                    this._Array.push(3);
                    GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                        view.Init(8);
                    }));
                    break;
                case "defaulsucculent6":
                    this._Array.push(4);
                    GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                        view.Init(9);
                    }));
                    break;
            }
            SaveManager.getInstance().SetNpc(this._Array);
        }
        createNpc() {
            if (!this.stop)
                return;
            if (!this.stopCreater)
                return;
            if (!this.needCreate)
                return;
            this.needCreate = false;
            var f = Math.random() * (this._Array.length - 1);
            f = Math.round(f);
            f = this._Array[f];
            if (f == 4 || f == 3 || f == 2) {
                var e = Math.random();
                if (e >= 0.2) {
                    this.needCreate = true;
                    this.createNpc();
                    return;
                }
            }
            var npc = NpcManager.getInstance().createNpc(f);
            npc.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
            GameScene.instance.scene3d.addChild(npc);
            this.needCreate = true;
        }
        getLocalData() {
            let data = SaveManager.getInstance().GetCache(ModelStorage.NPC);
            if (data) {
                this._Array = data;
            }
            else {
                this._Array.push(1);
                this._Array.push(5);
                this._Array.push(6);
            }
        }
    }

    var Vector3$b = Laya.Vector3;
    var Handler$f = Laya.Handler;
    class GuideAI extends AIBase {
        constructor() {
            super(...arguments);
            this.NorDic = {};
            this.CurrentPathId = 1;
            this.pickUpMoneyIndex = 0;
        }
        initActionMap() {
            this.NorDic[1] = this.payMoney;
            this.NorDic[2] = this.creatBubble;
            this.NorDic[3] = this.creatMoreBubble;
            this.NorDic[4] = this.pickUpMoney;
            this.NorDic[5] = this.makeTrouble;
        }
        onEnable() {
            super.onEnable();
            this.initActionMap();
            this.CurrentPathId = 2;
            if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
                this.LookAt(Path_Cfg[this.CurrentPathId].strsucculentpoint);
            }
            GEvent.RegistEvent(GacEvent.GuideCreateBubInScene, Laya.Handler.create(this, this.payMoney));
        }
        onDisable() {
            super.onDisable();
            GEvent.RemoveEvent(GacEvent.GuideCreateBubInScene, Laya.Handler.create(this, this.payMoney));
        }
        onUpdate() {
            super.onUpdate();
            if (this.character) {
                if (this.character.type == 1 || this.character.type == 2) {
                    if (NpcManager.getInstance().nordriveAwayVisitors(this.character.transform.position))
                        this.character.changMoveSpeed(this.character._tableData.harass_speed);
                    else
                        this.character.changMoveSpeed(this.character.Cruise_speed);
                }
            }
        }
        onMove() {
            super.onMove();
            let state = new NpcMoveState(this);
            this.character.ChangeState(state);
        }
        RangePath() {
            if (Path_Cfg[this.CurrentPathId].strLinkPathID == 0) {
                this.onStop();
                return;
            }
            this.GetNextPath();
            this.onMove();
        }
        RuntoStop() {
            let state = new NpcDefaultState(this);
            this.character.ChangeState(state);
            this.GetNextPath();
            let path = this.Currentpath;
            this.GetNextPath();
            path = path.concat(this.Currentpath);
            this.character.moveTo(path, null);
        }
        GetNextPath() {
            if (Path_Cfg[this.CurrentPathId].strLinkPathID == 0) {
                this.onStop();
                return;
            }
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this.character)
                    BubbleCreater.instance.removeBubble(element);
            });
            let content = Path_Cfg[this.CurrentPathId].strLinkPathID.split(",");
            let index;
            if (content.length == 2) {
                let strProb = Path_Cfg[this.CurrentPathId].strProb.split(",");
                if (strProb.length == 2) {
                    let bu = GameScene.instance.getBottomByName(Path_Cfg[this.CurrentPathId].strStatue);
                    let cost = 0;
                    if (bu != null && bu != undefined) {
                        cost = bu.getWeight();
                    }
                    let num = parseInt(strProb[0]) + parseInt(strProb[1]) + cost;
                    let minNum = 1;
                    let maxNum = num;
                    let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
                    let value_b = parseInt(value_a);
                    if (value_b > (parseInt(strProb[0]) + cost))
                        index = content[1];
                    else
                        index = content[0];
                }
                this.CurrentPathId = index;
                this.Currentpath = PathManager.getInstance().getPathByName(Path_Cfg[this.CurrentPathId].strPathName);
            }
            else {
                this.CurrentPathId = Path_Cfg[this.CurrentPathId].strLinkPathID;
                let pathName = Path_Cfg[this.CurrentPathId].strPathName;
                this.Currentpath = PathManager.getInstance().getPathByName(pathName);
            }
        }
        RangeActionPath() {
            if (Path_Cfg[this.CurrentPathId].strLinkPathID == 0) {
                this.onStop();
                return;
            }
            this.CurrentPathId = Path_Cfg[this.CurrentPathId].strLinkPathID;
            let pathName = Path_Cfg[this.CurrentPathId].strPathName;
            this.Currentpath = PathManager.getInstance().getPathByName(pathName).concat();
            let minNum = 1;
            let maxNum = this.Currentpath.length - 1;
            let value_a = Math.random() * (maxNum - minNum + 1) + minNum + "";
            let value_b = parseInt(value_a);
            this.ActionPointIndex = value_b;
            let vector3 = this.Currentpath[this.ActionPointIndex];
            this.Currentpath = [vector3];
            this.onMove();
        }
        ActionDonePath() {
            if (this.character.type != 1 && this.character.type != 2)
                return;
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this.character)
                    BubbleCreater.instance.removeBubble(element);
            });
            this.character.changMoveSpeed(this.character.Cruise_speed);
            this.RangePath();
        }
        isKeepUpMove() {
            super.isKeepUpMove();
            let type = Path_Cfg[this.CurrentPathId].next;
            if (type > 3) {
                this.SwitchAction(type);
            }
            else {
                switch (type) {
                    case -1:
                        this.onStop();
                        break;
                    case 1:
                        this.RangePath();
                        break;
                    case 2:
                        this.RangePath();
                        break;
                    case 3:
                        this.RangeActionPath();
                        break;
                }
            }
        }
        SwitchAction(type) {
            if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
                let isHave = GameScene.instance.getBottomByPoint(Path_Cfg[this.CurrentPathId].strsucculentpoint);
                if (isHave) {
                    let Marplot = this.isContainMarplot(this.character.transform.position);
                    if (Marplot && this.character.type != 4 && this.character.type != 3) {
                        if (this.character.GetType() != NpcStateType$1.DriveAway) {
                            let state = new NpcDriveAwayState(this);
                            this.character.ChangeState(state);
                        }
                    }
                    else {
                        if (this.character.type == 3) {
                            if (!this.character.GetstealGold(2)) {
                                this.RangePath();
                                return;
                            }
                        }
                        let state = new NpcActionState(this, type);
                        this.character.ChangeState(state);
                    }
                }
                else {
                    this.RangePath();
                    return;
                }
            }
        }
        onStop() {
            super.onStop();
            let state = new NpcDefaultState(this);
            this.character.ChangeState(state);
            this.character.onStop();
        }
        onPay(type) {
            super.onPay(type);
            let stractionIds = this.character._tableData.stractionId.split("|");
            let stractionProbs = this.character._tableData.stractionProb.split("|");
            let id = stractionIds[type - 4].split(",");
            let prob = stractionProbs[type - 4].split(",");
            if (prob.length == 1 && prob[0] == "0") {
                this.RangePath();
                return;
            }
            else {
                let index = Utils.getWeight(prob);
                this.CurrentActionId = parseInt(id[index]);
                let handler = this.NorDic[this.CurrentActionId];
                handler && handler.call(this);
            }
            if (Path_Cfg[this.CurrentPathId].strsucculentpoint) {
                this.LookAt(Path_Cfg[this.CurrentPathId].strsucculentpoint);
            }
        }
        creatBubble() {
            let bubble = BubbleCreater.instance.createBubble(2, GameScene.instance.camera, BubbleType.Normal, this.character, Laya.Handler.create(this, () => {
                BubbleCreater.instance.removeBubble(bubble);
                this.CreatGold(Constant_Cfg[2].value, true);
                this.PlayAnimation(CommonDefine.ANIMATION_TakePhoto);
                let camera = this.character.GetCamera();
                camera.active = true;
                SoundManager.getInstance().playSound(Sound_Cfg[4].strsound);
                Laya.timer.once(6000, this, () => {
                    camera.active = false;
                    this.RangePath();
                });
            }));
        }
        creatMoreBubble() {
            this.character.clickEnable = true;
            let bubble = BubbleCreater.instance.createBubble(3, GameScene.instance.camera, BubbleType.Wealthy, this.character, Laya.Handler.create(this, () => {
                this.character.onClick();
                BubbleCreater.instance.removeBubble(bubble);
            }, null, false));
        }
        payMoney() {
            this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
            SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
            Laya.timer.once(1000, this, () => {
                this.CreatGold(Constant_Cfg[1].value, false);
            });
            Laya.timer.once(2000, this, this.RangePath);
        }
        pickUpMoney() {
            Utils.setModelAlpha(this.character.sprite3dNode, 1);
            let bubble = BubbleCreater.instance.createBubble(4, GameScene.instance.camera, BubbleType.pickMoney, this.character, Laya.Handler.create(this, () => {
                this.character.onClick();
                BubbleCreater.instance.removeBubble(bubble);
            }));
            this.Action_PickMoney(bubble);
        }
        Action_PickMoney(bubble) {
            if (this.character.clickIndex >= 10)
                return;
            let ok = this.character.GetstealGold(2);
            if (ok) {
                this.character.stealGold(2, Handler$f.create(this, (pick) => {
                    if (pick) {
                        this.pickUpMoneyIndex++;
                        if (this.pickUpMoneyIndex >= 10) {
                            BubbleCreater.instance.removeBubble(bubble);
                            this.RuntoStop();
                            this.character.disappear();
                            return;
                        }
                        this.Action_PickMoney(bubble);
                        return;
                    }
                    else {
                        this.character.SetModelAlpha(0.2);
                        BubbleCreater.instance.removeBubble(bubble);
                        this.RangePath();
                    }
                }));
            }
            else {
                this.character.SetModelAlpha(0.2);
                BubbleCreater.instance.removeBubble(bubble);
                this.RangePath();
            }
        }
        ClickTypeThreeNpc(index) {
            super.ClickTypeThreeNpc(index);
            this.PlayAnimation(CommonDefine.ANIMATION_PayMoney);
            SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
            Laya.timer.once(1000, this, () => {
                this.CreatGold(Constant_Cfg[3].value, false);
            });
            if (index >= 10) {
                this.character.clickEnable = false;
                this.RangePath();
                this.character.ActionDone();
                return;
            }
        }
        makeTrouble() {
            this.character.clickEnable = true;
            this.PlayAnimation(CommonDefine.ANIMATION_makeTrouble);
            SoundManager.getInstance().playSound(Sound_Cfg[3].strsound);
            let bubble = BubbleCreater.instance.createBubble(5, GameScene.instance.camera, BubbleType.Noise, this.character, Laya.Handler.create(this, () => {
                this.character.onClick();
                BubbleCreater.instance.removeBubble(bubble);
            }, null, false));
        }
        ClickTypeFourNpc() {
            super.ClickTypeFourNpc();
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this.character)
                    BubbleCreater.instance.removeBubble(element);
            });
            this.RuntoStop();
        }
        CreatGold(cost_scale, isStar) {
            let offset = new Vector3$b(Math.random(), Math.random(), Math.random());
            Vector3$b.scale(offset, 0.8, offset);
            Vector3$b.add(offset, this.character.transform.position, offset);
            let Potted = GameScene.instance.getBottomByPoint(Path_Cfg[this.CurrentPathId].strsucculentpoint);
            if (Potted) {
                let gold = Potted.gold;
                let addition = Math.sqrt(Potted.TreeCount / Potted.Capacity) + Potted.ExtraPrefer() + Potted.BorderMultiScore();
                let getGold = Math.floor(gold * addition);
                if (getGold != 0)
                    GameScene.instance.createSceneItem(1, offset, getGold);
                if (isStar)
                    GameScene.instance.createSceneItem(2, offset);
            }
        }
    }

    var Handler$g = Laya.Handler;
    class GuideNpc extends NpcBase {
        constructor() { super(); }
        createById(tableId) {
            super.createById(tableId);
            this.clickIndex = 0;
            this.loadModel();
        }
        loadModel() {
            ResourceManager.getInstance().getResource(this._tableData.strmodelurl, Handler$g.create(this, (node) => {
                if (!node) {
                    console.log("NPC模型没有加载完成！");
                }
                this.sprite3dNode = node;
                this.Camera = Utils.FindTransfrom(this.sprite3dNode, "Prop_xiangji");
                this._animator = this.addComponent(AnimatorController);
                this._moveController = this.addComponent(MoveController);
                Laya.timer.callLater(this, () => {
                    this._aiController = this.addComponent(GuideAI);
                    this._moveController.changSpeed(this.Cruise_speed);
                });
                this.clickEnable = false;
                this.addChild(this.sprite3dNode);
            }));
        }
        GetCamera() {
            super.GetCamera();
            return this.Camera;
        }
        ActionDone() {
            super.ActionDone();
            this.clickIndex = 0;
        }
        clear() {
            this.sprite3dNode.destroy();
            this.removeSelf();
            this._animator.destroy();
            this._moveController.destroy();
            this._aiController.destroy();
            this._animator = null;
            this._moveController = null;
            this._aiController = null;
            BubbleCreater.instance._bubbleList.forEach(element => {
                if (element.owner == this)
                    BubbleCreater.instance.removeBubble(element);
            });
            Laya.timer.clearAll(this);
        }
        onMove() {
            super.onMove();
        }
        onStop() {
            super.onStop();
            this.clear();
            NpcManager.getInstance().recoverNpc("NpcBase", this);
        }
        onUpdate() {
            super.onUpdate();
        }
        onDestroy() { }
    }

    var Pool$7 = Laya.Pool;
    var Vector3$c = Laya.Vector3;
    class NpcManager extends Singleton {
        constructor() {
            super(...arguments);
            this.NpcArray = new Array();
            this.MaxNpcCount = 30;
        }
        onInit() {
            this.npcCreater = new NpcCreater();
        }
        onUpdata() {
            if (this.NpcArray.length != null) {
                this.NpcArray.forEach(element => {
                    element.onUpdate();
                });
            }
            if (this.npcCreater)
                this.npcCreater.stopCreater = this.NpcArray.length >= this.MaxNpcCount ? false : true;
        }
        onDestroy() {
            if (!this.npcCreater)
                return;
            this.npcCreater.clearCreater();
            this.npcCreater = null;
        }
        initnpcCreater() {
            if (this.npcCreater) {
                this.npcCreater.initCreater();
                this.npcCreater.stop = true;
            }
        }
        destroynpcCreater() {
            if (!this.npcCreater)
                return;
            this.npcCreater.stop = false;
        }
        createNpc(tableId) {
            if (this.NpcArray.length >= this.MaxNpcCount) {
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "游客最多30个！", false]);
                return;
            }
            var npc = Pool$7.getItemByClass("NpcBase", VisitorNpc);
            npc.createById(tableId);
            this.NpcArray.push(npc);
            return npc;
        }
        createGuideNpc(tableId) {
            var npc = Pool$7.getItemByClass("NpcBase", GuideNpc);
            npc.createById(tableId);
            this.NpcArray.push(npc);
            return npc;
        }
        recoverNpc(clsName, cls) {
            Utils.remove(this.NpcArray, cls);
            Pool$7.recover(clsName, cls);
        }
        isContainMarplot(pos) {
            let hasElement = false;
            this.NpcArray.forEach(element => {
                if (element.type == 4) {
                    if (Vector3$c.distance(pos, element.transform.position) < Constant_Cfg[7].value) {
                        hasElement = true;
                        return true;
                    }
                }
            });
            return hasElement;
        }
        driveAwayVisitors(pos) {
            let array = new Array();
            this.NpcArray.forEach(element => {
                if (element.type != 4 && element.type != 3) {
                    if (Vector3$c.distance(pos, element.transform.position) < Constant_Cfg[7].value) {
                        array.push(element);
                    }
                }
            });
            return array;
        }
        nordriveAwayVisitors(pos) {
            for (let index = 0; index < this.NpcArray.length; index++) {
                const element = this.NpcArray[index];
                if (element.type == 4 && !element.Fadeaway) {
                    let dis = Vector3$c.distance(pos, element.transform.position);
                    if (dis < Constant_Cfg[7].value) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    var Handler$h = Laya.Handler;
    class Propagandist extends StaffBase {
        constructor() {
            super();
            this._creating = true;
            this.index = 0;
        }
        onLoad(tableId) {
            super.onLoad(tableId);
            ResourceManager.getInstance().getResource(this._tableData.strmodle, Handler$h.create(this, (node) => {
                this.sprite3dNode = node;
                this._animator = this.addComponent(AnimatorController);
                this.addChild(this.sprite3dNode);
                this._loadDone = true;
            }));
        }
        onStop() { }
        onDestroy() { }
        LoadRangeNpc() {
            var f = Math.random() * (NpcManager.getInstance().npcCreater._Array.length - 1);
            f = Math.round(f);
            f = NpcManager.getInstance().npcCreater._Array[f];
            var npc = NpcManager.getInstance().createNpc(f);
            if (!npc)
                return;
            npc.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
            GameScene.instance.scene3d.addChild(npc);
        }
        LoadRangetenNpc() {
            if (!this._creating)
                return;
            this._creating = false;
            NpcManager.getInstance().destroynpcCreater();
            Laya.timer.loop(500, this, this.AddVisitorNpc);
            let welcome = GameScene.instance.scene3d.getChildByName("Effect").getChildByName("welcome");
            welcome.active = true;
            Laya.timer.loop(3000, this, () => { welcome.active = false; });
            this.index = 0;
        }
        AddVisitorNpc() {
            this.index++;
            if (this.index > this._tableData.propaganda) {
                Laya.timer.clear(this, this.AddVisitorNpc);
                this.index = 0;
                this._creating = true;
                if (GuideManager.getInstance().GetGuideState()) {
                    NpcManager.getInstance().initnpcCreater();
                }
                return;
            }
            this.LoadRangeNpc();
        }
    }

    var Handler$i = Laya.Handler;
    class Dustman extends StaffBase {
        constructor() {
            super();
            this._pickMoneyTime = 0;
        }
        onLoad(tableId) {
            super.onLoad(tableId);
            this._pickMoneyTime = this._tableData.clean;
            ResourceManager.getInstance().getResource(this._tableData.strmodle, Handler$i.create(this, (node) => {
                this.sprite3dNode = node;
                this._animator = this.addComponent(AnimatorController);
                this.addChild(this.sprite3dNode);
                this._loadDone = true;
            }));
        }
        onStop() { }
        onDestroy() { }
        GetPickMoneyTime() {
            return this._tableData.clean;
        }
    }

    var Handler$j = Laya.Handler;
    class Cameraman extends StaffBase {
        constructor() {
            super();
            this._takePhotoTime = 0;
        }
        onLoad(tableId) {
            super.onLoad(tableId);
            this._takePhotoTime = this._tableData.takepicture;
            ResourceManager.getInstance().getResource(this._tableData.strmodle, Handler$j.create(this, (node) => {
                this.sprite3dNode = node;
                this._animator = this.addComponent(AnimatorController);
                this.addChild(this.sprite3dNode);
                this._loadDone = true;
            }));
        }
        onStop() { }
        onDestroy() { }
        GetTakePhotoTime() {
            return this._tableData.takepicture;
        }
    }

    class GrassManager extends Singleton {
        constructor() {
            super(...arguments);
            this._lv = 5;
            this._mapData = new Array();
        }
        onInit() {
        }
        onUpdata() {
        }
        onDestroy() {
        }
        GetCurrentLv() {
            return this._lv % 10;
        }
        Upgrade() {
        }
        getMapData(mapId) {
            var data = {};
            var _obj = Map_Cfg;
            for (const key in _obj) {
                if (Object.prototype.hasOwnProperty.call(_obj, key)) {
                    const element = _obj[key];
                    if (element.mapid == mapId)
                        data[element["mapLevel"]] = element;
                }
            }
            return data;
        }
        UnLockMap() {
        }
    }

    var Vector3$d = Laya.Vector3;
    var Handler$k = Laya.Handler;
    var CollectAIState;
    (function (CollectAIState) {
        CollectAIState[CollectAIState["defult"] = 0] = "defult";
        CollectAIState[CollectAIState["to"] = 1] = "to";
        CollectAIState[CollectAIState["find"] = 2] = "find";
    })(CollectAIState || (CollectAIState = {}));
    class CollectAI {
        constructor(ower) {
            this.curState = CollectAIState.defult;
            this.CurIndex = 0;
            this.character = ower;
            this.collectPath = new Array();
        }
        beginCollect() {
            this.WalkOn(1);
        }
        stopCollect() {
            this.character.stopMove();
            this.CurIndex = 0;
            Laya.timer.clearAll(this);
        }
        UpdateCollectPoint() {
            let data = this.character.getFindItemData();
            if (!data["area"] || !data["itemId"] || !data["pos"]) {
                this.WalkOn(this.getNextIndex(this.CurIndex));
                return;
            }
            if (this.CurIndex == data["area"]) {
                this.WalkToCollectPoint(data);
            }
            else {
                let path = new Array();
                for (let i = 0; i < 10; i++) {
                    this.CurIndex = this.getNextIndex(this.CurIndex);
                    let p = PathManager.getInstance().getCollectPathByName(this.CurIndex.toString());
                    path = path.concat(p);
                    if (this.CurIndex == data["area"])
                        break;
                }
                this.character.moveTo(path, Handler$k.create(this, () => {
                    this.WalkToCollectPoint(data);
                }));
            }
        }
        WalkToCollectPoint(data) {
            if (!data["itemId"] || !data["pos"]) {
                this.WalkOn(this.getNextIndex(this.CurIndex));
                debugger;
                return;
            }
            let tree = this.CreatTree(data["itemId"], data["pos"]);
            this.character.moveTo([data["pos"]], Handler$k.create(this, () => {
                this.character.playAnimation(CommonDefine.ANIMATION_caiji);
                Laya.timer.once(this.character.GetOnceCollectTime(), this, () => {
                    tree.destroy();
                    GameData.AddItem(Staff_Cfg[this.character.GetId()].staffID, data["itemId"]);
                    this.character.clearFindItemData();
                    this.WalkOn(this.getNextIndex(this.CurIndex));
                });
            }));
        }
        WalkCycle(path) {
            this.character.moveTo(path, Handler$k.create(this, () => {
                this.UpdateCollectPoint();
            }));
        }
        getNextIndex(curIndex) {
            if (curIndex >= 10)
                curIndex = 1;
            else
                curIndex++;
            return curIndex;
        }
        WalkOn(curIndex) {
            this.CurIndex = curIndex;
            this.collectPath = PathManager.getInstance().getCollectPathByName(this.CurIndex.toString());
            this.WalkCycle(this.collectPath);
        }
        ChangState(_state) {
            this.curState = _state;
            if (this.character && this.character.getState() == GatherStateType.Collecting) {
                switch (this.curState) {
                    case CollectAIState.defult:
                        break;
                    case CollectAIState.to:
                        this.moveTo();
                        break;
                    case CollectAIState.find:
                        this.moveFind();
                        break;
                }
            }
            else {
                if (this.curState != CollectAIState.defult) {
                    console.log("AI此处是有问题的！！！");
                }
            }
        }
        moveTo() {
            var pos = this.nextPoint();
            this.character.moveTo([pos], Handler$k.create(this, function () {
                this.character.playAnimation(CommonDefine.ANIMATION_chazhao);
                Laya.timer.once(this.sleepTime, this, function () {
                    this.ChangState(CollectAIState.find);
                });
            }));
        }
        moveFind() {
            let data = this.character.getFindItemData();
            if (data["itemId"] == null || data["itemId"] == undefined) {
                this.ChangState(CollectAIState.to);
                return;
            }
            if (data["pos"] == null || data["pos"] == undefined) {
                this.ChangState(CollectAIState.to);
                return;
            }
            let tree = this.CreatTree(Number(data["itemId"]), data["pos"]);
            this.character.moveTo([data["pos"]], Handler$k.create(this, function () {
                this.character.playAnimation(CommonDefine.ANIMATION_caiji);
                Laya.timer.once(this.character.GetOnceCollectTime(), this, () => {
                    tree.destroy();
                    GameData.AddItem(Staff_Cfg[this.character.GetId()].staffID, data["itemId"]);
                    this.character.clearFindItemData();
                    this.ChangState(CollectAIState.to);
                });
            }));
        }
        nextPoint() {
            let num = GrassManager.getInstance().GetCurrentLv();
            for (let index = 1; index < num + 1; index++) {
                this.collectPath.push(PathManager.getInstance().getCollectByName("collectpoint" + index));
            }
            var pos = this.collectPath[Math.floor(Math.random() * this.collectPath.length)];
            let minWidth = -1;
            let maxWidth = 1;
            let value_a = Math.random() * (maxWidth - minWidth + 1) + minWidth + "";
            let x = parseInt(value_a);
            let minhigh = -1;
            let maxhigh = 1;
            let value_b = Math.random() * (maxhigh - minhigh + 1) + minhigh + "";
            let z = parseInt(value_b);
            return new Vector3$d(pos.x + x, pos.y, pos.z + z);
        }
        CreatTree(id, pos) {
            let tree = new Tree(id);
            GameScene.instance.scene3d.addChild(tree);
            tree.transform.position = pos;
            tree.transform.setWorldLossyScale(new Vector3$d(0.1, 0.1, 0.1));
            Laya.Tween.to(tree.transform.scale, { x: 3, y: 3, z: 3, update: new Handler$k(this, function () {
                    tree.transform.setWorldLossyScale(tree.transform.getWorldLossyScale());
                }) }, 1000);
            return tree;
        }
    }

    class CollectCreater {
        constructor() {
            this.path = new Array();
            this.findData = {};
        }
        initCreater(mapId, staffId) {
            this.staffData = Staff_Cfg[staffId];
            this.mapData = Map_Cfg[mapId];
            if (!this.mapData || !this.staffData) {
                console.log("采集物品生成器创建失败");
                return;
            }
            this.createMinTime = this.mapData.minimumtime;
            this.createMaxTime = this.mapData.maxtime;
            this.randomCreateItem();
        }
        getFindItemData() {
            return Object.assign({}, this.findData);
        }
        clearFindItemData() {
            this.findData = {};
        }
        randomCreateItem() {
            var time = Math.random() * (this.createMaxTime - this.createMinTime) + this.createMinTime;
            Laya.timer.once(20 * 1000, this, this.onGetTree);
        }
        onGetTree() {
            this.randomCreateItem();
            if (this.findData == {})
                return;
            var _data = GrassManager.getInstance().getMapData(1);
            var curLevel = GrassManager.getInstance().GetCurrentLv();
            curLevel = curLevel == 0 ? 10 : curLevel;
            var rLevel = Math.floor(Math.random() * (curLevel + 1) + 1);
            rLevel = rLevel > curLevel ? curLevel : rLevel;
            this.mapData = _data[rLevel];
            var mapItem = this.mapData.strdrop + "|" + this.mapData.strSidgroup;
            var mapWeight = this.mapData.strCweight + "|" + this.mapData.strSweight;
            var arrItem = mapItem.split("|");
            var arrWeight = mapWeight.split("|");
            let nNum = Utils.getWeight(arrWeight);
            var itemId = (arrItem[nNum]);
            var area = this.checkArea(itemId, _data);
            var fPos;
            var fArea = area;
            if (area == -1) {
                var _area = Math.floor(Math.random() * 9) + 1;
                _area = _area == 10 ? 9 : _area;
                var arrGroup = PathManager.getInstance().growCommonArray[1];
                var arrPoint = arrGroup[_area];
                fArea = _area;
                if (arrPoint.length > 1) {
                    var _r = Math.floor(Math.random() * arrPoint.length);
                    _r = arrPoint.length == _r ? _r - 1 : _r;
                    fPos = arrPoint[_r];
                }
                else if (arrPoint.length == 1) {
                    fPos = arrPoint[0];
                }
            }
            else {
                var arrGroup = PathManager.getInstance().growSpecialArray[1];
                fPos = arrGroup[area];
            }
            this.findData["itemId"] = itemId;
            this.findData["pos"] = fPos;
            this.findData["area"] = fArea;
            this.findData["special"] = (area != -1);
        }
        checkArea(itemId, mapData) {
            for (var o in mapData) {
                if (mapData[o].unlockID == itemId)
                    return Number(o);
            }
            return -1;
        }
        clear() {
            Laya.timer.clear(this, this.onGetTree);
            this.mapData = null;
            this.staffData = null;
            this.findData = {};
        }
    }

    class Timer {
        static FrameLoop(delay, caller, method, args, coverBefore) {
            Laya.timer.frameLoop(delay, caller, method, args, coverBefore);
        }
        static FrameOnce(delay, caller, method, args, coverBefore) {
            Laya.timer.frameOnce(delay, caller, method, args, coverBefore);
        }
        static Loop(delay, caller, method, args, coverBefore, jumpFrame) {
            Laya.timer.loop(delay, caller, method, args, coverBefore, jumpFrame);
        }
        static Once(delay, caller, method, args, coverBefore) {
            Laya.timer.once(delay, caller, method, args, coverBefore);
        }
        static Clear(caller, method) {
            Laya.timer.clear(caller, method);
        }
        static ClearAll(caller) {
            Laya.timer.clearAll(caller);
        }
        static SpecialOnce(key, time, callBack) {
            if (!key || !time || !callBack) {
                return;
            }
            if (this._timeSpecial.indexOf(key) != -1) {
                return;
            }
            this._timeSpecial.push(key);
            this.Once(time, null, () => {
                callBack();
                this._timeSpecial.splice(this._timeSpecial.indexOf(key), 1);
            });
        }
    }
    Timer._timeSpecial = [];

    class StaffCommonView extends ui.view.StaffCommonViewUI {
        constructor() {
            super();
            this._goodIndex = 0;
            this.timeVoid = null;
            this.createView(Laya.loader.getRes("view/StaffCommonView.json"));
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.onInit();
            this.onEvent();
        }
        onDisable() {
            this.offAll();
            this.ui_sure_button.off(Laya.Event.CLICK, this, this.SureClick);
            this.ui_close_button.off(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(StaffCommonView);
            });
        }
        onInit() {
        }
        onEvent() {
            this.ui_sure_button.on(Laya.Event.CLICK, this, this.SureClick);
            this.ui_close_button.on(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(StaffCommonView);
            });
        }
        GetRoleMessageList() {
            this.ui_good_list.array = GameData.GetItem(Staff_Cfg[this._goodIndex]["staffID"]);
            this.ui_good_list.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
        }
        SetRoleMessageList(box, index) {
            let GoodPic = box.getChildByName("good_pic");
            let GoodNum = box.getChildByName("good_num");
            let GoodName = box.getChildByName("good_name");
            let array = GameData.GetItem(Staff_Cfg[this._goodIndex]["staffID"])[index];
            GoodPic.skin = Succulent_Cfg[array[1]]["striconurl"];
            GoodNum.text = "X" + array[0];
            GoodName.text = "" + Succulent_Cfg[array[1]]["strname"];
        }
        SetDataID(index = -1) {
            this._goodIndex = index;
            let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
            for (let i = 0; i < value.length; i++) {
                if (this._goodIndex == value[i]["id"]) {
                    if (value[i]["workState"] == 1 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                        this.ui_time_font.visible = true;
                        let time = StaffManager.getInstance().GetCollectTime(Staff_Cfg[value[i]["id"]]["staffID"]);
                        this.ui_time_font.text = "剩余采集时间：" + Utils.TimeToTimeFormat(time);
                        this.ui_tips_font.skin = "gameui/staffcommon/staffingfont.png";
                        this.ui_sure_button.visible = false;
                        this.UpdateTime();
                    }
                    else if (value[i]["workState"] == 3 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                        this.ui_time_font.visible = false;
                        this.ui_tips_font.skin = "gameui/staffcommon/stafffont.png";
                        this.ui_sure_button.visible = true;
                    }
                    break;
                }
            }
            this.GetRoleMessageList();
        }
        SureClick() {
            EffectManager.getInstance().BtnEffect(this.ui_sure_button);
            StaffManager.getInstance().ToRest(Staff_Cfg[this._goodIndex]["staffID"]);
            GEvent.DispatchEvent(GacEvent.RefreshGatherInfo);
            +GameUIManager.getInstance().hideUI(StaffCommonView);
        }
        UpdateTime() {
            if (this.timeVoid == null) {
                this.timeVoid = Timer.Loop(1000, this, this.UpdateTimeCD);
            }
        }
        UpdateTimeCD() {
            let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
            let bool = false;
            for (const key of value) {
                if (key["workState"] == 1) {
                    bool = true;
                    break;
                }
            }
            if (bool == false) {
                Timer.Clear(this, this.UpdateTimeCD);
                this.timeVoid = null;
                this.TimeRefresh();
            }
            else {
                this.TimeRefresh();
            }
        }
        TimeRefresh() {
            let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
            for (let i = 0; i < value.length; i++) {
                if (this._goodIndex == value[i]["id"]) {
                    if (value[i]["workState"] == 1 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                        this.ui_time_font.visible = true;
                        let time = StaffManager.getInstance().GetCollectTime(Staff_Cfg[value[i]["id"]]["staffID"]);
                        this.ui_time_font.text = "剩余采集时间：" + Utils.TimeToTimeFormat(time);
                        this.ui_tips_font.skin = "gameui/staffcommon/staffingfont.png";
                        this.ui_sure_button.visible = false;
                        this.UpdateTime();
                    }
                    else if (value[i]["workState"] == 3 && Staff_Cfg[value[i]["id"]]["jobID"] == 4) {
                        this.ui_time_font.visible = false;
                        this.ui_tips_font.skin = "gameui/staffcommon/stafffont.png";
                        this.ui_sure_button.visible = true;
                    }
                    break;
                }
            }
            this.ui_good_list.array = GameData.GetItem(Staff_Cfg[this._goodIndex]["staffID"]);
        }
    }
    ViewManager.getInstance().SaveViewResUrl(StaffCommonView, [
        { url: "view/StaffCommonView.json", type: Laya.Loader.JSON },
    ]);

    class CollectMapDataManager extends Singleton {
        constructor() {
            super();
            this._mapData = [];
            this._mapData[1] = [];
        }
        init(scene3d) {
            var str = SaveManager.getInstance().GetCache(ModelStorage.mapData);
            if (str) {
                var js = JSON.parse(str);
                var arr1 = new Array();
                for (var o in js) {
                    var tempArr = new Array();
                    if (js[o] instanceof Object) {
                        for (var i in js[o]) {
                            tempArr[i] = js[o][i];
                        }
                        arr1[Number(o)] = tempArr;
                    }
                    else {
                        arr1[Number(o)] = js[o];
                    }
                }
                this._mapData = arr1;
            }
            this._scene3d = scene3d;
            this.refreshMapData();
        }
        refreshMapData() {
            var node = this._scene3d;
            if (!node)
                return;
            var nodeName;
            var child;
            for (var i = 1; i < 11; ++i) {
                nodeName = "1_" + i.toString() + "_collectpoint";
                child = node.getChildByName(nodeName);
                if (!child)
                    continue;
                if (this._mapData[1][i]) {
                    this.setLockState(1, i, true);
                }
                else {
                    this.setLockState(1, i, false);
                }
            }
        }
        getMaxMapLevel(mapId) {
            if (!this._mapData[mapId])
                return 0;
            return this._mapData[mapId][this._mapData[mapId].length - 1];
        }
        unLockMapData(mapId, openArea) {
            if (!this._mapData[mapId])
                this._mapData[mapId] = [];
            this._mapData[mapId][openArea] = openArea;
            this.setLockState(mapId, openArea, true);
            this.saveData();
        }
        setLockState(mapId, area, bUnLock = false) {
            var nodeName = mapId.toString() + "_" + area.toString() + "_collectpoint";
            var child = this._scene3d.getChildByName(nodeName);
            if (!child)
                return;
            var lock = child.getChildByName("suo");
            if (!lock)
                return;
            if (!bUnLock) {
                Utils.setModelbrightness(child, 0.5);
                Utils.setModelbrightness(lock, 1);
            }
            else {
                lock.active = false;
                Utils.setModelbrightness(child, 1);
            }
        }
        getLock(name) {
            var mapId = Number(name.substr(0, name.indexOf("_")));
            var area = Number(name.substr(name.indexOf("_") + 1, name.lastIndexOf("_") - 2));
            if (!this._mapData[mapId] || !this._mapData[mapId][area])
                return false;
            return true;
        }
        saveData() {
            var arr = {};
            for (var o in this._mapData) {
                if (this._mapData[o]) {
                    if (this._mapData[o] instanceof Array) {
                        let oTemp = {};
                        for (var key in this._mapData[o]) {
                            oTemp[key] = this._mapData[o][key];
                        }
                        arr[o] = oTemp;
                    }
                    else {
                        arr[o] = this._mapData[o];
                    }
                }
            }
            let str = JSON.stringify(arr);
            SaveManager.getInstance().SetmapDataCache(str);
        }
    }

    class GatherView extends ui.view.GatherViewUI {
        constructor() {
            super();
            this._staffIndex = 0;
            this.lv = 1;
            this._timeVoid = null;
            this._staffRedVisible = false;
            this.createView(Laya.loader.getRes("view/GatherView.json"));
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.onInit();
            this.onEvent();
        }
        onEvent() {
            this.ui_update_button.on(Laya.Event.CLICK, this, this.UpdateClick);
            this.ui_staff_button.on(Laya.Event.CLICK, this, this.StaffClick);
            this.ui_close_button.on(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(GatherView);
            });
            this.ui_updategrade_button.on(Laya.Event.CLICK, this, this.UpdateLV);
            GEvent.RegistEvent(GacEvent.RefreshGatherInfo, Laya.Handler.create(this, this.Refresh));
        }
        onDisable() {
            this.offAll();
            this.ui_update_button.off(Laya.Event.CLICK, this, this.UpdateClick);
            this.ui_staff_button.off(Laya.Event.CLICK, this, this.StaffClick);
            this.ui_close_button.off(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(GatherView);
            });
            this.ui_updategrade_button.off(Laya.Event.CLICK, this, this.UpdateLV);
            GEvent.RemoveEvent(GacEvent.RefreshGatherInfo, Laya.Handler.create(this, this.Refresh));
        }
        set visible(b) {
            super.visible = b;
            if (b) {
                this.onEnable();
            }
        }
        onInit() {
            this.LoadInfo();
            this.GetRoleMessageList();
            this.Refresh();
            this.DataInit();
            this.ui_update_box.visible = true;
            this.ui_list_box.visible = false;
            this.ui_update_button.skin = "gameui/gather/updatebutton_light.png";
            this.ui_staff_button.skin = "gameui/gather/dispatch_choose.png";
            this.ui_introduce_font.visible = false;
            this.ui_update2_font.visible = false;
        }
        DataInit() {
            for (let i = 0; i < this._staffInfo.length; i++) {
                if (this._staffInfo[i]["workState"] > 0) {
                    this.UpdateTime();
                    break;
                }
            }
        }
        Refresh() {
            this.LoadInfo();
            if (this.lv > 9) {
                this.ui_grade_shi.visible = true;
                this.ui_grade_shi.index = Math.floor(this.lv / 10);
                this.ui_grade_ge.index = this.lv - Math.floor(this.lv / 10) * 10;
            }
            else {
                this.ui_grade_shi.visible = false;
                this.ui_grade_ge.index = this.lv;
            }
            this.ui_introduce_font.text = Collection_station_Cfg[this.lv]["strdiscribe"];
            let bool = Collection_station_Cfg[this.lv]["upgold"] > Player.getInstance().nGold;
            this.ui_updategrade_button.gray = bool;
            this.ui_red_button.visible = !bool;
            this.ui_update_red.visible = !bool;
            if (Collection_station_Cfg[this.lv]["lvup"] == this.lv) {
                this.ui_next_font.visible = false;
                this.ui_update_font.visible = false;
                this.ui_updategrade_button.visible = false;
                this.ui_maxgrade_font.visible = true;
            }
            else {
                this.ui_next_font.visible = true;
                this.ui_update_font.visible = true;
                this.ui_update_font.text = Collection_station_Cfg[this.lv]["strDec"];
                this.ui_updategrade_button.visible = true;
                this.ui_gold_font.text = Collection_station_Cfg[this.lv]["upgold"];
                this.ui_maxgrade_font.visible = false;
            }
            this._staffRedVisible = false;
            for (let i = 0; i < this._staffInfo.length; i++) {
                if (this._staffInfo[i]["workState"] == 3) {
                    this._staffRedVisible = true;
                    break;
                }
            }
            this.ui_staff_red.visible = this._staffRedVisible;
        }
        GetRoleMessageList() {
            this.emptyTips.visible = this._staffInfo.length <= 0;
            this.ui_staff_list.array = this._staffInfo;
            this.ui_staff_list.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
        }
        SetRoleMessageList(box, index) {
            let head = box.getChildByName("head");
            let name = box.getChildByName("name");
            let progress = box.getChildByName("progressBG");
            let progressValue = progress.getChildByName("progress");
            let gather_time = progress.getChildByName("gather_time");
            let button = box.getChildByName("buttonClick");
            let lv = box.getChildByName("la_id");
            let state = box.getChildByName("stateFont");
            let red = box.getChildByName("red");
            button.offAll();
            button.on(Laya.Event.CLICK, this, this.RoleChoose, [index]);
            button.visible = true;
            state.visible = false;
            progress.visible = true;
            red.visible = false;
            name.text = Staff_Cfg[this._staffInfo[index]["id"]]["strname"];
            if (Staff_Cfg[this._staffInfo[index]["id"]]) {
                lv.text = Staff_Cfg[this._staffInfo[index]["id"]]["lv"];
            }
            head.skin = Staff_Cfg[this._staffInfo[index]["id"]].stricon;
            if (this._staffInfo[index]["workState"] == 1) {
                let cdtime = (Time.serverSeconds - this._staffInfo[index]["workTimeStamp"]);
                let cd = this._staffInfo[index]["workOrRestTimeCD"];
                let value = cdtime / cd;
                value = value > 1 ? 1 : value;
                progressValue.width = progress.width * (value);
                gather_time.text = "" + Utils.formatStandardTime(StaffManager.getInstance().GetCollectTime(Staff_Cfg[this._staffInfo[index]["id"]]["staffID"]));
                button.skin = "gameui/gather/preview.png";
                state.visible = true;
                state.skin = "gameui/gather/staffing.png";
            }
            else if (this._staffInfo[index]["workState"] == 2) {
                let cdtime = (Time.serverSeconds - this._staffInfo[index]["restTimeStamp"]);
                let cd = this._staffInfo[index]["workOrRestTimeCD"];
                let value = cdtime / cd;
                value = value > 1 ? 1 : value;
                progressValue.width = progress.width * (value);
                gather_time.text = "" + Utils.formatStandardTime(StaffManager.getInstance().GetRestTime(Staff_Cfg[this._staffInfo[index]["id"]]["staffID"]));
                state.visible = true;
                state.skin = "gameui/gather/resting.png";
                button.skin = "gameui/gather/speedbutton.png";
            }
            else if (this._staffInfo[index]["workState"] == 3) {
                progress.visible = false;
                button.skin = "gameui/gather/harvestbutton.png";
                state.skin = "gameui/gather/caijiwancheng.png";
                red.visible = true;
            }
            else {
                progress.visible = false;
                state.visible = true;
                state.skin = "gameui/gather/rest.png";
                button.skin = "gameui/gather/staffend.png";
            }
        }
        showStaffTable() {
            this.ui_staff_button && this.ui_staff_button.event(Laya.Event.CLICK);
        }
        RoleChoose(index) {
            let box = this.ui_staff_list.getChildAt(0).getChildAt(index);
            let boxx = box.getChildByName("buttonClick");
            EffectManager.getInstance().BtnEffect(boxx);
            this._staffIndex = index;
            if (this._staffInfo[this._staffIndex]["workState"] == 1) {
                GameUIManager.getInstance().hideUI(GatherView);
                Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", GameScene.instance.camera]);
            }
            else if (this._staffInfo[this._staffIndex]["workState"] == 3) {
                GameUIManager.getInstance().createUI(StaffCommonView, [StaffCommonView], Laya.Handler.create(this, (view) => {
                    view.SetDataID(this._staffInfo[this._staffIndex]["id"]);
                }));
            }
            else if (this._staffInfo[this._staffIndex]["workState"] == 2) {
                DataLog.getInstance().LogVideo_log(GamePoint.Sleep);
                if (Laya.Browser.onWeiXin) {
                    let _that = this;
                    MyPlayer.wxSDK.Share(Share_Cfg[4]["strtitle"], { title: Share_Cfg[4]["strdescribe"], imageUrl: Share_Cfg[4]["strpic"], query: "" }, {
                        successFn: function () {
                            StaffManager.getInstance().ToStop(Staff_Cfg[_that._staffInfo[_that._staffIndex]["id"]]["staffID"]);
                        },
                        failFn() {
                        }
                    });
                }
                else {
                    StaffManager.getInstance().ToStop(Staff_Cfg[this._staffInfo[this._staffIndex]["id"]]["staffID"]);
                }
            }
            else if (this._staffInfo[this._staffIndex]["workState"] == 0) {
                GameUIManager.getInstance().hideUI(GatherView);
                Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", GameScene.instance.camera]);
            }
        }
        UpdateClick() {
            EffectManager.getInstance().BtnEffect(this.ui_update_button);
            this.ui_update_box.visible = true;
            this.ui_list_box.visible = false;
            this.ui_update_button.skin = "gameui/gather/updatebutton_light.png";
            this.ui_staff_button.skin = "gameui/gather/dispatch_choose.png";
        }
        StaffClick() {
            EffectManager.getInstance().BtnEffect(this.ui_staff_button);
            this.ui_update_box.visible = false;
            this.ui_list_box.visible = true;
            this.ui_update_button.skin = "gameui/gather/updatebutton_choose.png";
            this.ui_staff_button.skin = "gameui/gather/dispatch_bg.png";
        }
        UpdateLV() {
            EffectManager.getInstance().BtnEffect(this.ui_updategrade_button);
            if (this.lv < Collection_station_Cfg[this.lv]["lvup"]) {
                if (Collection_station_Cfg[this.lv]["upgold"] <= Player.getInstance().nGold) {
                    Player.getInstance().refreshGold(-Collection_station_Cfg[this.lv]["upgold"]);
                    this.lv = Collection_station_Cfg[this.lv]["lvup"];
                    let stra = Collection_station_Cfg[this.lv]["strunlockmap"];
                    let str = stra.split(",");
                    CollectMapDataManager.getInstance().unLockMapData((Number)((str[0])), (Number)(str[1]));
                    this.SaveInfo();
                    GameUIManager.getInstance().destroyTopUI(TipViewScene);
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "百草屋升级到" + this.lv + "级", false]);
                }
                else {
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
                }
            }
            this.Refresh();
        }
        UpdateTime() {
            if (this._timeVoid == null) {
                this._timeVoid = Timer.Loop(1000, this, this.UpdateTimeCD);
            }
        }
        UpdateTimeCD() {
            this.LoadInfo();
            let bool = false;
            for (const key of this._staffInfo) {
                if (key["workState"] > 0) {
                    bool = true;
                    break;
                }
            }
            if (bool == false) {
                Timer.Clear(this, this.UpdateTimeCD);
                this._timeVoid = null;
                this.TimeRefresh();
            }
            else {
                this.TimeRefresh();
            }
        }
        TimeRefresh() {
            this.ui_staff_list.array = this._staffInfo;
            this.emptyTips.visible = this._staffInfo.length <= 0;
            this.Refresh();
        }
        SaveInfo() {
            SaveManager.getInstance().SetGatherLvCache(this.lv);
        }
        LoadInfo() {
            this.lv = SaveManager.getInstance().GetCache(ModelStorage.GatherLV);
            if (this.lv == null) {
                this.lv = 1;
            }
            let _data = [];
            this._staffInfo = [];
            let value = GameData.RoleInfo;
            if (value) {
                _data = value;
            }
            if (_data != [] || _data != null) {
                for (let i = 0; i < _data.length; i++) {
                    if (_data[i]["id"] == 0)
                        continue;
                    if (Staff_Cfg[_data[i]["id"]]["jobID"] == 4
                        && Player.getInstance().nStar >= Staff_Cfg[_data[i]["id"]]["unlockstar"]) {
                        this._staffInfo.push(_data[i]);
                    }
                    else {
                        continue;
                    }
                }
            }
        }
    }
    ViewManager.getInstance().SaveViewResUrl(GatherView, [
        { url: "view/GatherView.json", type: Laya.Loader.JSON },
    ]);

    var Vector3$e = Laya.Vector3;
    var PhysicsCollider$2 = Laya.PhysicsCollider;
    var Handler$l = Laya.Handler;
    var GatherStateType;
    (function (GatherStateType) {
        GatherStateType[GatherStateType["Idle"] = 0] = "Idle";
        GatherStateType[GatherStateType["Collecting"] = 1] = "Collecting";
        GatherStateType[GatherStateType["Rest"] = 2] = "Rest";
        GatherStateType[GatherStateType["Receiving"] = 3] = "Receiving";
    })(GatherStateType || (GatherStateType = {}));
    class Gatherman extends StaffBase {
        constructor() {
            super(...arguments);
            this.OncecollectTime = 3600;
            this._collectTimeStamp = 0;
            this._restTimeStamp = 0;
            this._collectTime = 0;
            this._restTime = 0;
            this._state = GatherStateType.Idle;
            this._WorkCD = 0;
            this._seatId = 0;
        }
        onLoad(tableId) {
            super.onLoad(tableId);
            this._restTime = this._collectTime = this._tableData.collectime;
            ResourceManager.getInstance().getResource(this._tableData.strmodle, Handler$l.create(this, (node) => {
                this.sprite3dNode = node;
                this._animator = this.addComponent(AnimatorController);
                this._moveController = this.addComponent(MoveController);
                var c = this.sprite3dNode.getComponent(PhysicsCollider$2);
                c.enabled = true;
                this.addChild(this.sprite3dNode);
                this._loadDone = true;
                this.InitData(tableId);
            }));
            this._aiController = new CollectAI(this);
            this._Creater = new CollectCreater();
        }
        InitData(tableId) {
            let data = GameData.GetRole(tableId);
            this._collectTime = this._restTime = data.workOrRestTimeCD;
            this._WorkCD = data.workOrRestTimeCD;
            switch (data.workState) {
                case GatherStateType.Idle:
                    this.StopAI();
                    break;
                case GatherStateType.Collecting:
                    this._collectTimeStamp = data.workTimeStamp;
                    let cdtime = Time.serverSeconds - data.workTimeStamp;
                    if (data.workOrRestTimeCD - cdtime > 0) {
                        this._collectTime = data.workOrRestTimeCD - cdtime;
                        this.StartAI(false);
                    }
                    else
                        this.Receiving(false);
                    break;
                case GatherStateType.Rest:
                    this._restTimeStamp = data.restTimeStamp;
                    let cdtime1 = Time.serverSeconds - data.restTimeStamp;
                    if (data.workOrRestTimeCD - cdtime1 > 0) {
                        this._restTime = data.workOrRestTimeCD - cdtime1;
                        this.ToRest();
                    }
                    else
                        this.StopAI();
                    break;
                case GatherStateType.Receiving:
                    this.Receiving(false);
                    break;
            }
            if (data.updateState == 1) {
                let overTime = Time.serverSeconds - data.updateTimeStamp;
                let cd = this._tableData.cd * 60;
                if (cd - overTime > 0) {
                    this.ChangUpGrade();
                    this.SetupgradeTime(cd - overTime);
                }
                else {
                    this.upgrade(this.id + 1);
                    data.updateState = 0;
                    data.updateTimeStamp = 0;
                    GameData.RoleInfo = data;
                    SaveManager.getInstance().SetStaffCache(data);
                }
            }
        }
        onStop() { }
        onDestroy() {
        }
        onClick() {
            super.onClick();
            if (this._state == GatherStateType.Collecting) {
                GameUIManager.getInstance().showUI(StaffCommonView, Laya.Handler.create(this, (view) => {
                    view.SetDataID(this._id);
                }));
            }
        }
        StartAI(pos = true) {
            this.ChangState(GatherStateType.Collecting);
            if (this._collectTimeStamp == 0) {
                this._collectTimeStamp = Time.serverSeconds;
            }
            if (!pos) {
                this.transform.position = GameScene.instance.scene3d.getChildByName("stoppoint").getChildByName("stoppoint1").transform.position;
            }
            this._aiController.beginCollect();
            this._Creater.initCreater(1, this._id);
            Laya.timer.loop(1000, this, this.SubCollectTime);
            this.SaveInfo();
        }
        Receiving(pos = true) {
            this.ChangState(GatherStateType.Receiving);
            this._aiController.stopCollect();
            this._Creater.clear();
            let path = GameScene.instance.scene3d.getChildByName("stoppoint").getChildByName("stoppoint1").transform.position;
            if (!pos) {
                this.transform.position = path;
                this.creatBubble();
            }
            else {
                if (!Vector3$e.equals(this.transform.position, path)) {
                    this.moveTo([path], Handler$l.create(this, () => {
                        this.creatBubble();
                    }, null, false));
                }
                else
                    this.creatBubble();
            }
            this.SaveInfo();
        }
        StopAI() {
            this.ChangState(GatherStateType.Idle);
            Laya.timer.clear(this, this.SubRestTime);
            this._restTime = 0;
            PathManager.getInstance().getCollectIdleClear(this.transform.position);
            if (this._aiController != null && this._aiController != undefined) {
                this._aiController.stopCollect();
            }
            if (this._Creater != null && this._Creater != undefined) {
                this._Creater.clear();
            }
            GameScene.instance.carEditor.refreshStaff(this);
            this.playAnimation(CommonDefine.ANIMATION_chengkezuo);
            this.SaveInfo();
        }
        ToRest() {
            this.ChangState(GatherStateType.Rest);
            if (this._aiController) {
                this._aiController.stopCollect();
            }
            if (this._Creater) {
                this._Creater.clear();
            }
            if (this._bubble) {
                BubbleCreater.instance.removeBubble(this._bubble);
            }
            this.transform.position = GameScene.instance.scene3d.getChildByName("stoppoint").getChildByName("stoppoint1").transform.position;
            this.playAnimation(CommonDefine.ANIMATION_IDLE);
            Laya.timer.loop(1000, this, this.SubRestTime);
            if (this._restTimeStamp == 0) {
                this._restTimeStamp = Time.serverSeconds;
            }
            GameData.ClearItem(Staff_Cfg[this._id].staffID);
            this.SaveInfo();
        }
        Setseat(id) {
            this._seatId = id;
        }
        Getseat() {
            return this._seatId;
        }
        GetCollectTime() {
            return this._collectTime;
        }
        GetRestTime() {
            return this._restTime;
        }
        SetCollectTime(time) {
            this._collectTime = this._restTime = time;
            this._WorkCD = time;
            this.SaveInfo();
        }
        GetOnceCollectTime() {
            return this.OncecollectTime;
        }
        getFindItemData() {
            return this._Creater.getFindItemData();
        }
        clearFindItemData() {
            this._Creater.clearFindItemData();
        }
        getState() {
            return this._state;
        }
        creatBubble() {
            this.playAnimation(CommonDefine.ANIMATION_chengkezuo);
            this._bubble = BubbleCreater.instance.createBubble(6, GameScene.instance.camera, BubbleType.Collect, this, Laya.Handler.create(this, () => {
                if (GameScene.instance.curRollIndex == 1) {
                    Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", GameScene.instance.camera]);
                }
                GameUIManager.getInstance().createUI(GatherView, [1], Laya.Handler.create(this, (view) => {
                    view.showStaffTable && view.showStaffTable();
                }));
            }, null, false));
        }
        ChangState(state) {
            this._state = state;
        }
        SubCollectTime() {
            this._collectTime -= 1;
            if (this._collectTime <= 0) {
                Laya.timer.clear(this, this.SubCollectTime);
                this.Receiving();
            }
        }
        SubRestTime() {
            this._restTime -= 1;
            if (this._restTime <= 0)
                this.StopAI();
        }
        SaveInfo() {
            let array = GameData.RoleInfo;
            for (const key in array) {
                if (array.hasOwnProperty(key)) {
                    const info = array[key];
                    if (info.id == this._id) {
                        info.workState = this._state;
                        switch (this._state) {
                            case GatherStateType.Idle:
                                info.workTimeStamp = 0;
                                info.restTimeStamp = 0;
                                this._restTimeStamp = 0;
                                this._collectTimeStamp = 0;
                                break;
                            case GatherStateType.Collecting:
                                info.workTimeStamp = this._collectTimeStamp;
                                info.restTimeStamp = 0;
                                this._restTimeStamp = 0;
                                break;
                            case GatherStateType.Rest:
                                info.restTimeStamp = this._restTimeStamp;
                                info.workTimeStamp = 0;
                                this._collectTimeStamp = 0;
                                break;
                            case GatherStateType.Receiving:
                                info.workTimeStamp = 0;
                                info.restTimeStamp = 0;
                                this._restTimeStamp = 0;
                                this._collectTimeStamp = 0;
                                break;
                        }
                        info.workOrRestTimeCD = this._WorkCD;
                        GameData.RoleInfo = array;
                        SaveManager.getInstance().SetStaffCache(array);
                        break;
                    }
                }
            }
        }
    }

    var Vector3$f = Laya.Vector3;
    var StaffType;
    (function (StaffType) {
        StaffType[StaffType["Propagandist"] = 2] = "Propagandist";
        StaffType[StaffType["Dustman"] = 3] = "Dustman";
        StaffType[StaffType["Cameraman"] = 4] = "Cameraman";
    })(StaffType || (StaffType = {}));
    class StaffManager extends Singleton {
        constructor() {
            super(...arguments);
            this.StaffArray = new Array();
            this.StaffDic = new Dictionary();
            this._ispropagandist = false;
            this._isdustman = false;
            this._iscameraman = false;
        }
        onInit() {
            if (SaveManager.getInstance().GetCache(ModelStorage.ConnNum) == 1)
                this.Addpropagandist(7, 1);
            this.LoadInfo();
        }
        onUpdata() {
            if (this.StaffDic.Count() != 0) {
                this.StaffDic.forEach(element => {
                    element.onUpdate();
                });
            }
        }
        onDestroy() { }
        ChangUpGrade(tableID) {
            this.StaffDic.forEach(element => {
                if (element.GetId() == tableID) {
                    GameData.ChangUpGrade(tableID);
                    this.StaffDic.get(Staff_Cfg[tableID].staffID).ChangUpGrade();
                }
            });
        }
        upgrade(beforeId, laterId) {
            this.StaffDic.forEach(element => {
                if (element.GetId() == beforeId) {
                    element.upgrade(laterId);
                    GameData.upgrade(beforeId, laterId);
                }
            });
        }
        GetTakePhotoTimer() {
            return this.StaffDic.get(StaffType.Cameraman).GetTakePhotoTime();
        }
        GetPickMoneyTimer() {
            return this.StaffDic.get(StaffType.Dustman).GetPickMoneyTime();
        }
        SetCollectTime(staffID, time) {
            this.StaffDic.get(staffID).SetCollectTime(time);
        }
        GetCollectTime(staffID) {
            return this.StaffDic.get(staffID).GetCollectTime();
        }
        GetRestTime(staffID) {
            return this.StaffDic.get(staffID).GetRestTime();
        }
        Addpropagandist(id, dataIndex) {
            if (this.StaffDic.get(StaffType.Propagandist) != null || this.StaffDic.get(StaffType.Propagandist) != undefined) {
                if (Constant_Cfg[14].value == 0)
                    GEvent.DispatchEvent(GacEvent.OnShowUI_propagandist);
                return this.StaffDic.get(StaffType.Propagandist);
            }
            let npc = new Propagandist();
            this.InitStaffID(id, dataIndex);
            npc.onLoad(id);
            this.StaffDic.set(StaffType.Propagandist, npc);
            npc.transform.position = GameScene.instance.scene3d.getChildByName("staffpoint").getChildByName("xuanchuan").transform.position;
            GameScene.instance.scene3d.addChild(npc);
            if (Constant_Cfg[14].value == 0)
                GEvent.DispatchEvent(GacEvent.OnShowUI_propagandist);
            return npc;
        }
        AddDustman(id, dataIndex) {
            if (this.StaffDic.get(StaffType.Dustman) != null || this.StaffDic.get(StaffType.Dustman) != undefined) {
                GEvent.DispatchEvent(GacEvent.OnShowUI_dustman);
                return this.StaffDic.get(StaffType.Dustman);
            }
            let npc = new Dustman();
            this.InitStaffID(id, dataIndex);
            npc.onLoad(id);
            this.StaffDic.set(StaffType.Dustman, npc);
            npc.transform.position = GameScene.instance.scene3d.getChildByName("staffpoint").getChildByName("qingjie").transform.position;
            GameScene.instance.scene3d.addChild(npc);
            GEvent.DispatchEvent(GacEvent.OnShowUI_dustman);
            return npc;
        }
        AddCameraman(id, dataIndex) {
            if (this.StaffDic.get(StaffType.Cameraman) != null || this.StaffDic.get(StaffType.Cameraman) != undefined) {
                GEvent.DispatchEvent(GacEvent.OnShowUI_cameraman);
                return this.StaffDic.get(StaffType.Cameraman);
            }
            let npc = new Cameraman();
            this.InitStaffID(id, dataIndex);
            npc.onLoad(id);
            this.StaffDic.set(StaffType.Cameraman, npc);
            npc.transform.position = GameScene.instance.scene3d.getChildByName("staffpoint").getChildByName("zhaoxiang").transform.position;
            GameScene.instance.scene3d.addChild(npc);
            GEvent.DispatchEvent(GacEvent.OnShowUI_cameraman);
            return npc;
        }
        AddGather(id, dataIndex) {
            let npc = new Gatherman();
            this.InitStaffID(id, dataIndex);
            npc.onLoad(id);
            if (npc.parent == null) {
                GameScene.instance.scene3d.addChild(npc);
            }
            this.StaffDic.set(npc._tableData.staffID, npc);
            return npc;
        }
        InitStaffID(id, dataIndex) {
            GameData.InitStaffID(id, dataIndex);
        }
        StartAI(staffID, time) {
            let staff = this.StaffDic.get(staffID);
            staff.StartAI();
            this.SetCollectTime(staffID, time);
            Laya.stage.event("state_rest");
        }
        ToRest(staffID) {
            let staff = this.StaffDic.get(staffID);
            staff.ToRest();
            Laya.stage.event("state_rest");
        }
        ToStop(staffID) {
            let staff = this.StaffDic.get(staffID);
            staff.StopAI();
            Laya.stage.event("state_rest");
        }
        LoadRangeNpc() {
            if (this.StaffDic.get(StaffType.Propagandist)) {
                this.StaffDic.get(StaffType.Propagandist).LoadRangeNpc();
            }
        }
        LoadRangetenNpc() {
            if (this.StaffDic.get(StaffType.Propagandist)) {
                this.StaffDic.get(StaffType.Propagandist).LoadRangetenNpc();
            }
        }
        StartPickMoney() {
            this._SubMoney();
            Laya.timer.loop(2000, this, this._SubMoney);
        }
        StopPickMoney() {
            Laya.timer.clear(this, this._SubMoney);
        }
        StartTakePhoto() {
            this.AutoTakePhoto();
            Laya.timer.loop(2000, this, this.AutoTakePhoto);
        }
        StopTakePhoto() {
            Laya.timer.clear(this, this.AutoTakePhoto);
        }
        _SubMoney() {
            var nearItem = SceneItemCreater.getInstance().getNearItem(new Vector3$f(0, 0, 0), 1000);
            if (!nearItem)
                return;
            SoundManager.getInstance().playSound(Sound_Cfg[1].strsound);
            var v2 = Utils.worldToScreen(GameScene.instance.camera, nearItem.pos);
            Utils.createNumberText(nearItem.addGold.toString(), v2.x, v2.y, "+", false, "#ffea00");
            nearItem.onClick();
            if (nearItem.tableId == 1) {
                Player.getInstance().refreshGold(nearItem.addGold);
            }
            else if (nearItem.tableId == 2) {
                Player.getInstance().refreshStar(nearItem.addGold);
            }
        }
        AutoTakePhoto() {
            let b = BubbleCreater.instance.GetTypewithNormal();
            if (b != null) {
                b.changeImage("res/icon/sysicon.png");
                b.RotationIcon();
                Laya.timer.once(1000, this, () => {
                    b.onClick(null);
                });
            }
        }
        LoadInfo() {
            let value = GameData.RoleInfo;
            if (value) {
                value.forEach(element => {
                    if (element.id != 0 && Staff_Cfg[element.id].jobID == 4) {
                        this.AddGather(element.id, -1);
                    }
                });
            }
        }
    }

    class StaffView extends ui.view.StaffViewUI {
        constructor() {
            super();
            this._roleData = [];
            this._roleIndex = 0;
            this._roleInfo = [];
            this._starNum = 500;
            this.timeVoid = null;
            this.createView(Laya.loader.getRes("view/StaffView.json"));
            Laya.loader.getRes("res/atlas/gameui/staff.atlas");
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.onInit();
            this.onEvent();
        }
        onShow() {
            this.GetRoleMessageList();
        }
        onDisable() {
            this.offAll();
            this.ui_end_button.offAll();
            GEvent.RemoveEvent(GacEvent.RefreshUserInfo, Laya.Handler.create(this, this.GetRoleMessageList));
        }
        DataInit() {
            for (let i = 0; i < this._roleInfo.length; i++) {
                if (this._roleInfo[i]["updateState"] > 0) {
                    this.UpdateTime();
                    break;
                }
            }
        }
        onInit() {
            let idunm = Utils.GetTableLength(Staff_Cfg);
            let staffunm = Staff_Cfg[idunm].staffID;
            for (let i = 1; i <= staffunm; i++) {
                for (let j = 1; j <= idunm; j++) {
                    if (Staff_Cfg[j]["staffID"] == i) {
                        this._roleData.push(j);
                        break;
                    }
                }
            }
            this.LoadInfo();
            this.DataInit();
            this.GetRoleMessageList();
            this.TimeRefresh();
        }
        onEvent() {
            this.ui_end_button.on(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(StaffView);
                EffectManager.getInstance().BtnEffect(this.ui_end_button);
            });
            GEvent.RegistEvent(GacEvent.RefreshUserInfo, Laya.Handler.create(this, this.GetRoleMessageList));
        }
        GetRoleMessageList() {
            this.ui_user_list.array = this._roleData;
            this.ui_user_list.renderHandler = new Laya.Handler(this, this.SetRoleMessageList);
            this.ui_user_list.vScrollBarSkin = "";
            this.ui_user_list.selectedIndex = 0;
        }
        SetRoleMessageList(box, index) {
            let Name = box.getChildByName("user_name");
            let head = box.getChildByName("head");
            let Lv = box.getChildByName("la_id");
            let State = box.getChildByName("user_state");
            let StateTime = box.getChildByName("staff_time");
            let progress = box.getChildByName("ui_progress_bg");
            let progressValue = progress.getChildByName("ui_progress_value");
            let starImage = box.getChildByName("star_image");
            let starFont = starImage.getChildByName("star_font");
            let userInfo = box.getChildByName("ui_user_info");
            let userMessage = userInfo.getChildByName("ui_evaluate1_font");
            let userButton = userInfo.getChildByName("ui_use2_button");
            let userImg = userButton.getChildByName("ui_use2_img");
            let userFont = userButton.getChildByName("ui_use2_font");
            let goldImage = userButton.getChildByName("ui_user2_i");
            let goldLabel = goldImage.getChildByName("ui_user2_label");
            let red = userButton.getChildByName("ui_user2_red");
            if (!this._roleInfo[index])
                return;
            let data = this._roleInfo[index]["id"] > 0 ? this._roleInfo[index]["id"] : this._roleData[index];
            userButton.offAll();
            userButton.on(Laya.Event.CLICK, this, (index) => {
                EffectManager.getInstance().BtnEffect(userButton);
                this.SureClick(index);
            }, [index]);
            userMessage.text = "" + Staff_Cfg[data]["strdeclare"];
            if (index == 0) {
                box.width = 1000;
            }
            userButton.visible = true;
            starImage.visible = false;
            StateTime.visible = false;
            userFont.visible = true;
            goldImage.visible = true;
            userImg.y = 18;
            State.visible = true;
            progress.visible = false;
            Name.text = Staff_Cfg[data].strname;
            head.skin = Staff_Cfg[data].stricon;
            if (this._roleInfo[index] == null) {
                Debug.Log("");
            }
            if (this._roleInfo[index]["id"] == 0) {
                userFont.text = "" + Staff_Cfg[data]["hiregold"];
                let bool = Staff_Cfg[data]["hiregold"] > Player.getInstance().nGold;
                userButton.disabled = bool;
                red.visible = !bool;
                State.visible = !bool;
                if (Staff_Cfg[data]["unlockstar"] <= Player.getInstance().nStar) {
                    State.skin = "gameui/staff/keguyongfont.png";
                    userButton.skin = "gameui/staff/surepurplebutton.png";
                    goldLabel.color = "#4e006e";
                    userImg.skin = "gameui/staff/guyongfont.png";
                    Lv.text = Staff_Cfg[data]["lv"];
                }
                else {
                    State.visible = false;
                    starImage.visible = true;
                    starFont.text = Staff_Cfg[data]["unlockstar"];
                    userButton.visible = false;
                    userButton.skin = "gameui/staff/suregreenbutton.png";
                    goldLabel.color = "#226e00";
                    userImg.skin = "gameui/staff/guyongfont.png";
                    Lv.text = Staff_Cfg[data]["lv"];
                }
            }
            else {
                userFont.text = "" + Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"];
                if (this._roleInfo[index]["updateState"] == 1) {
                    let cdtime = (Time.serverSeconds - this._roleInfo[index]["updateTimeStamp"]);
                    let times = Staff_Cfg[this._roleInfo[index]["id"]]["cd"] * 60;
                    let value = cdtime / times;
                    value = value > 1 ? 1 : value;
                    State.visible = false;
                    State.skin = "gameui/staff/keguyongfont.png";
                    StateTime.visible = true;
                    StateTime.text = "" + Utils.TimeToTimeFormat(times - cdtime);
                    progress.visible = true;
                    progressValue.width = progress.width * (value);
                    Lv.text = Staff_Cfg[this._roleInfo[index]["id"]]["lv"];
                    userButton.gray = false;
                    red.visible = true;
                    userButton.skin = "gameui/staff/suregreenbutton.png";
                    goldLabel.color = "#226e00";
                    userImg.skin = "gameui/staff/speedfont.png";
                    userFont.visible = false;
                    userImg.y = 41;
                    goldImage.visible = false;
                }
                else {
                    Lv.text = Staff_Cfg[this._roleInfo[index]["id"]]["lv"];
                    if (Staff_Cfg[this._roleInfo[index]["id"]]["next"] > this._roleInfo[index]["id"]) {
                        let bool = Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] > Player.getInstance().nGold;
                        userButton.gray = bool;
                        red.visible = !bool;
                        State.visible = !bool;
                        if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] <= Player.getInstance().nGold) {
                            State.skin = "gameui/staff/keupdatefont.png";
                            userButton.skin = "gameui/staff/suregreenbutton.png";
                            goldLabel.color = "#226e00";
                            userImg.skin = "gameui/staff/updatefont.png";
                        }
                        else {
                            State.visible = false;
                            userImg.skin = "gameui/staff/updatefont.png";
                        }
                    }
                    else {
                        State.visible = false;
                        userButton.visible = false;
                    }
                }
            }
        }
        RefreshButtonState() {
            let data = SaveManager.getInstance().GetCache(ModelStorage.Staff);
            this._roleInfo = data == null ? this._roleInfo : data;
        }
        SureClick(index) {
            if (!this._roleInfo[index])
                return;
            if (this._roleInfo[index]["id"] == 0) {
                if (Staff_Cfg[this._roleData[index]]["unlockstar"] <= Player.getInstance().nStar
                    && Staff_Cfg[this._roleData[index]]["hiregold"] <= Player.getInstance().nGold) {
                    if (!Player.getInstance().canPayGold(Number(Staff_Cfg[this._roleData[index]]["hiregold"]))) {
                        GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
                        return;
                    }
                    Player.getInstance().refreshGold(-Number(Staff_Cfg[this._roleData[index]]["hiregold"]));
                    let fun = null;
                    switch (Staff_Cfg[this._roleData[index]]["jobID"]) {
                        case 1:
                            GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                                view.Init(3, this._roleData[index], index);
                            }));
                            break;
                        case 2:
                            GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                                view.Init(1, this._roleData[index], index);
                            }));
                            break;
                        case 3:
                            GameUIManager.getInstance().showUI(UnlockView, Laya.Handler.create(this, (view) => {
                                view.Init(2, this._roleData[index], index);
                            }));
                            break;
                        case 4:
                            StaffManager.getInstance().AddGather(this._roleData[index], index);
                            break;
                    }
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "员工雇佣成功", false]);
                }
                else if (Staff_Cfg[this._roleData[index]]["hiregold"] > Player.getInstance().nGold) {
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
                }
            }
            else {
                if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] <= Player.getInstance().nGold
                    && this._roleInfo[index]["updateState"] == 0) {
                    Player.getInstance().refreshGold(-Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"]);
                    StaffManager.getInstance().ChangUpGrade(this._roleInfo[index]["id"]);
                    this.UpdateTime();
                }
                else if (Staff_Cfg[this._roleInfo[index]["id"]]["Upgold"] > Player.getInstance().nGold) {
                    GameUIManager.getInstance().createTopUI(TipViewScene, [null, "金币不足", false]);
                }
                else if (this._roleInfo[index]["updateState"] == 1) {
                    if (Laya.Browser.onWeiXin) {
                        let _that = this;
                        MyPlayer.wxSDK.Share(Share_Cfg[3]["strtitle"], { title: Share_Cfg[3]["strdescribe"], imageUrl: Share_Cfg[3]["strpic"], query: "" }, {
                            successFn: function () {
                                if (_that._roleInfo[index]["id"] != 0) {
                                    StaffManager.getInstance().upgrade(_that._roleInfo[index]["id"], Staff_Cfg[_that._roleInfo[index]["id"]]["next"]);
                                    DataLog.getInstance().LogVideo_log(GamePoint.Seniority);
                                }
                            },
                            failFn() {
                            }
                        });
                    }
                    else {
                        if (this._roleInfo[index]["id"] != 0) {
                            StaffManager.getInstance().upgrade(this._roleInfo[index]["id"], Staff_Cfg[this._roleInfo[index]["id"]]["next"]);
                            DataLog.getInstance().LogVideo_log(GamePoint.Seniority);
                        }
                    }
                }
            }
            this.RefreshButtonState();
            this.ui_user_list.array = this._roleData;
        }
        UpdateTime() {
            if (this.timeVoid == null) {
                this.timeVoid = Timer.Loop(1000, this, this.UpdateTimeCD);
            }
        }
        UpdateTimeCD() {
            let bool = false;
            for (const key of this._roleInfo) {
                if (key["updateState"] > 0) {
                    bool = true;
                    break;
                }
            }
            if (bool == false) {
                Timer.Clear(this, this.UpdateTimeCD);
                this.timeVoid = null;
                this.TimeRefresh();
            }
            else {
                this.TimeRefresh();
            }
        }
        TimeRefresh() {
            this.ui_user_list.array = this._roleData;
            this.RefreshButtonState();
        }
        LoadInfo() {
            let value = GameData.RoleInfo;
            if (value) {
                this._roleInfo = value;
            }
        }
    }
    ViewManager.getInstance().SaveViewResUrl(StaffView, [
        { url: "view/StaffView.json", type: Laya.Loader.JSON },
        { url: "res/atlas/gameui/staff.atlas", type: Laya.Loader.ATLAS },
    ]);

    class UnlockView extends ui.view.UnLockViewUI {
        constructor() {
            super();
            this._dataID = -1;
            this._userID = -1;
            this._userDataID = -1;
            this._tipsEffect = null;
            this._lightEffect = null;
            this._function = null;
            this.createView(Laya.loader.getRes("view/UnLockView.json"));
            this.onEvent();
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
        }
        onEvent() {
            this.ui_sure_btn.on(Laya.Event.CLICK, this, this.SureClick);
            this.ui_close_btn.on(Laya.Event.CLICK, this, this.CloseClick);
        }
        onDisable() {
            this.offAll();
            this.ui_sure_btn.offAll();
            this.ui_close_btn.offAll();
            if (this._tipsEffect) {
                this._tipsEffect.Destroy();
            }
            if (this._lightEffect) {
                this._lightEffect.Destroy();
            }
        }
        Init(id, userID = -1, dataID = -1, fun) {
            this._dataID = id;
            this._userID = userID;
            this._userDataID = dataID;
            this._function = Laya.Handler.create(this, fun);
            this.fun_bg.visible = true;
            this.fun_icon.visible = false;
            this.Refresh();
            this.PlayEffect();
        }
        PlayEffect() {
            this._tipsEffect = EffectManager.getInstance().PlayOnceEffect(this.ui_tips_effect, 2, 1, false);
            this._lightEffect = EffectManager.getInstance().PlayOnceEffect(this.ui_light_effect, 4, 1, true);
        }
        onHide() {
            if (this._tipsEffect) {
                this._tipsEffect.Destroy();
                this._tipsEffect = null;
            }
            if (this._lightEffect) {
                this._lightEffect.Destroy();
                this._lightEffect = null;
            }
        }
        Refresh() {
            this.ui_fun_icon.skin = NewTip_Cfg[this._dataID]["strpicture"];
            this.ui_fun_pic.skin = NewTip_Cfg[this._dataID]["strpicture"];
            this.ui_tips_font.text = NewTip_Cfg[this._dataID]["strname"];
            this.ui_introduce_font.text = NewTip_Cfg[this._dataID]["strdeclare"];
            if (NewTip_Cfg[this._dataID]["share"] == 1) {
                this.ui_sure_btn.visible = true;
                this.ui_close_btn.visible = false;
            }
            else {
                this.ui_sure_btn.visible = false;
                this.ui_close_btn.visible = true;
            }
        }
        SureClick() {
            if (Laya.Browser.onWeiXin) {
                let _that = this;
                MyPlayer.wxSDK.Share(Share_Cfg[6]["strtitle"], { title: Share_Cfg[6]["strdescribe"], imageUrl: Share_Cfg[6]["strpic"], query: "" }, {
                    successFn: function () {
                        if (NewTip_Cfg[_that._dataID]["closeui"] == 1) {
                            GameUIManager.getInstance().hideUI(StaffView);
                        }
                        _that.PlayUnlockAnimation(_that._dataID);
                        if (NewTip_Cfg[_that._dataID]["skipID"] != -1) {
                            GameScene.instance.switchViewByIndex(NewTip_Cfg[_that._dataID]["skipID"]);
                        }
                    },
                    failFn() {
                    }
                });
            }
            else {
                if (NewTip_Cfg[this._dataID]["closeui"] == 1) {
                    GameUIManager.getInstance().hideUI(StaffView);
                }
                this.PlayUnlockAnimation(this._dataID);
                if (NewTip_Cfg[this._dataID]["skipID"] != -1) {
                    GameScene.instance.switchViewByIndex(NewTip_Cfg[this._dataID]["skipID"]);
                }
            }
        }
        CloseClick() {
            if (NewTip_Cfg[this._dataID]["closeui"] == 1) {
                GameUIManager.getInstance().hideUI(StaffView);
            }
            this.PlayUnlockAnimation(this._dataID);
            GameScene.instance.switchViewByIndex(NewTip_Cfg[this._dataID]["skipID"]);
        }
        PlayUnlockAnimation(num) {
            this.fun_bg.visible = false;
            this.fun_icon.visible = true;
            let fun = null;
            let ra = 0;
            let ba = 0;
            this.ui_fun_pic.right = 273;
            this.ui_fun_pic.bottom = 646;
            switch (num) {
                case 1:
                    ra = this.ui_money_box.right;
                    ba = this.ui_money_box.bottom;
                    fun = () => {
                        StaffManager.getInstance().AddDustman(this._userID, this._userDataID);
                    };
                    break;
                case 2:
                    ra = this.ui_photo_box.right;
                    ba = this.ui_photo_box.bottom;
                    fun = () => {
                        StaffManager.getInstance().AddCameraman(this._userID, this._userDataID);
                    };
                    break;
                case 3:
                    ra = this.ui_publicity_box.right;
                    ba = this.ui_publicity_box.bottom;
                    fun = () => {
                        StaffManager.getInstance().Addpropagandist(this._userID, this._userDataID);
                    };
                    break;
                default:
                    GameUIManager.getInstance().hideUI(UnlockView);
                    if (this._function)
                        this._function.run();
                    return;
            }
            this.AnimationMove(this.ui_fun_pic, ra, ba, Laya.Handler.create(this, () => {
                if (fun) {
                    fun();
                }
                GEvent.DispatchEvent(GacEvent.RefreshUserInfo);
                GameUIManager.getInstance().hideUI(UnlockView);
                if (this._function)
                    this._function.run();
            }));
        }
        AnimationMove(box, r, b, fun) {
            Laya.Tween.to(box, { right: r, bottom: b }, 600, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                fun.runWith(true);
            }));
        }
    }
    ViewManager.getInstance().SaveViewResUrl(UnlockView, [
        { url: "view/UnLockView.json", type: Laya.Loader.JSON },
    ]);

    class LandManager extends Singleton {
        constructor() {
            super();
            this._tempR = -15;
            this._reallyTime = 12;
            this._tipsDataList = [];
            this._unlockedBottomArr = [];
            this.initData();
        }
        initData() {
            this._tipsDataList = [];
            this._unlockedArr = Utils.getJSONFromLocal("landData");
            this._defaultLandJosnArr = ConfigManager.prototype.GetJsonToArray(Land_Cfg);
            if (!this._unlockedArr) {
                this._unlockedArr = new Array();
                this._unlockedArr.push("1");
            }
        }
        onInitState(camera) {
            this._camera = camera;
            let landItemData;
            let landPointData;
            for (let i = 0; i < this._defaultLandJosnArr.length; i++) {
                landItemData = this._defaultLandJosnArr[i];
                let isUnlocked = this._unlockedArr.indexOf(landItemData.id) != -1;
                if (landItemData.type == 3 && isUnlocked) {
                    this._camera.scene.getChildByName("map").getChildByName(landItemData.strname).active = false;
                    return;
                }
                landPointData = this.getLandPoint(landItemData.type, landItemData.strname);
                if (!isUnlocked && this._unlockedArr.indexOf(landItemData.preconditionID.toString()) != -1) {
                    this.setTipsData(landPointData.lockNode, landItemData);
                }
                else if (isUnlocked && landItemData.type == 2) {
                    this.createBottom(landItemData.strname);
                }
                landPointData.lockNode.active = !isUnlocked;
                landPointData.modelNode.active = isUnlocked;
            }
        }
        checkLandState(ratName) {
            let unlocklandDataArr = this._defaultLandJosnArr.filter((ele, index, array) => { return ele.strname == ratName; });
            let unlocklandData = unlocklandDataArr ? unlocklandDataArr[0] : null;
            if (!unlocklandData)
                return;
            if (this._unlockedArr.indexOf(unlocklandData.id) != -1) {
                if (unlocklandData.type == 1) {
                    this.OpenFlowerStateView(ratName);
                }
            }
            else if (unlocklandData.type == 3) {
                this.unlockMapPoint(unlocklandData);
                return;
            }
            else if (this._unlockedArr.indexOf(unlocklandData.preconditionID.toString()) != -1) {
                GameUIManager.getInstance().createUI(unLockDialog, [unlocklandData, this.unlockLandPoint.bind(this)]);
            }
            else {
                let precoditionDataArr = this._defaultLandJosnArr.filter((ele, index, array) => { return ele.id == unlocklandData.preconditionID; });
                GameUIManager.getInstance().createUI(unLockDialog, [unlocklandData, this.unlockLandPoint.bind(this), precoditionDataArr[0].struiname]);
            }
        }
        unlockMapPoint(unlockPointData) {
            if (unlockPointData.unlockstar > Player.getInstance().nStar) {
                Debug.Log("星星不够，无法解锁");
                return;
            }
            if (unlockPointData.gold > Player.getInstance().nGold) {
                Debug.Log("金币不够，无法解锁");
                return;
            }
            this._unlockedArr.push(unlockPointData.id);
            Player.getInstance().refreshGold(-unlockPointData.gold);
            Player.getInstance().refreshStar(unlockPointData.star);
            Utils.saveJSONToLocal("landData", this._unlockedArr);
            this._camera.scene.getChildByName("map").getChildByName(unlockPointData.strname).active = false;
        }
        unlockLandPoint(unlockPointData) {
            if (unlockPointData.unlockstar > Player.getInstance().nStar) {
                Debug.Log("星星不够，无法解锁");
                return;
            }
            if (unlockPointData.gold > Player.getInstance().nGold) {
                Debug.Log("金币不够，无法解锁");
                return;
            }
            this._unlockedArr.push(unlockPointData.id);
            this.unLockState(unlockPointData);
            Player.getInstance().refreshGold(-unlockPointData.gold);
            Player.getInstance().refreshStar(unlockPointData.star);
            Utils.saveJSONToLocal("landData", this._unlockedArr);
        }
        unLockState(data) {
            let lockData = this.getLandPoint(data.type, data.strname);
            if (data.type == 2) {
                this.createBottom(data.strname);
                GEvent.DispatchEvent(CommonDefine.EVENT_UNLOCK_PLANT, [data.strname]);
            }
            else if (data.type == 1) {
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
            let canUnlockArr = this._defaultLandJosnArr.filter((ele, index, array) => { return data.id == ele.preconditionID.toString(); });
            if (canUnlockArr && canUnlockArr.length > 0) {
                let canUnlockData = null;
                for (let i = 0; i < canUnlockArr.length; i++) {
                    canUnlockData = this.getLandPoint(canUnlockArr[i].type, canUnlockArr[i].strname);
                    this.setTipsData(canUnlockData.lockNode, canUnlockArr[i]);
                }
                canUnlockData = null;
            }
            lockData.modelNode.active = true;
            lockData.lockNode.active = false;
        }
        getLandPoint(type, strname) {
            let lockNodeData = { lockNode: null, modelNode: null };
            if (type == 1) {
                lockNodeData.lockNode = this._camera.scene.getChildByName("zhongzhidian");
                lockNodeData.lockNode = lockNodeData.lockNode.getChildByName(strname);
                lockNodeData.modelNode = lockNodeData.lockNode.getChildAt(1);
                lockNodeData.lockNode = lockNodeData.lockNode.getChildAt(0);
            }
            else if (type == 2) {
                lockNodeData.lockNode = this._camera.scene.getChildByName("zhuangshiwu");
                lockNodeData.lockNode = lockNodeData.lockNode.getChildByName(strname);
                lockNodeData.modelNode = lockNodeData.lockNode.getChildAt(0);
            }
            return lockNodeData;
        }
        setTipsData(lockNode, data) {
            if (this._tipsDataList.some((ele, index, array) => { return ele.tipsNode == lockNode; }))
                return;
            let tips = {
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
            let labImage = new Laya.Image("gameui/tipsBack_1.png");
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
        onUpdate() {
            if (this._reallyTime >= 25)
                this._reallyTime = 0;
            for (var i = 0; i < this._tipsDataList.length; ++i) {
                this.setTipsImagePos(this._tipsDataList[i], this._reallyTime);
            }
            this._reallyTime += 0.3;
        }
        setTipsImagePos(tips, deltaTime) {
            let v2 = Utils.worldToScreen(this._camera, tips.tipsNode.transform.position);
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
        createBottom(strname) {
            if (!this._unlockedBottomArr)
                this._unlockedBottomArr = new Array();
            this._unlockedBottomArr.push(strname);
            GameScene.instance.initSceneDecorates();
            this._camera.scene.getChildByName("point").getChildByName(strname).getComponent(Laya.PhysicsCollider).enabled = false;
        }
        getBottomUnlockedArr() {
            return this._unlockedBottomArr;
        }
        OpenFlowerStateView(name) {
            if (!name)
                return;
            let tPoint = PotManager.getInstance().PotMap[name];
            let potData = [];
            let nLength = 0;
            if (tPoint) {
                for (const key in tPoint.PotList) {
                    nLength++;
                }
            }
            if (nLength <= 0) {
                SceneManager.getInstance().openScene(DIYScene.instance, [name, 0]);
                return;
            }
            GameUIManager.getInstance().createUI(PointFlowerStateView, [name]);
        }
    }

    class BottomCreater extends Singleton {
        constructor() {
            super();
            this._bottomList = new Array();
            this._curSelectBottom = null;
            this.maxBottomUpLv = 0;
            Laya.stage.on(CommonDefine.EVENT_BOTTOM, this, this.createSceneDecorates);
            Laya.stage.on(CommonDefine.EVENT_BOTTOM_LEVEL_UP, this, this.bottomLevelUp);
            let _arr = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
            _arr.forEach(element => {
                if (element.StatueType == 1) {
                    this.maxBottomUpLv = element.lv;
                }
            });
            this.statueArray = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
            this.defaultStatueArray = ConfigManager.prototype.GetJsonToArray(DefaultStatue_Cfg);
        }
        curSelectBottom(b) {
            this._curSelectBottom = b;
        }
        clearSelectBottom() {
            this._curSelectBottom = null;
        }
        createBottom(data) {
            var bottom = new Bottom();
            bottom.init(data);
            this._bottomList.push(bottom);
            return bottom;
        }
        getDefaultData() {
            let nodeArr = LandManager.getInstance().getBottomUnlockedArr();
            let nCurDecorateId = this.getDefaulSelectDecorate();
            let defauleData = [];
            nodeArr.forEach(ele => {
                let statueData = this.getStatueItemData(1);
                let d = {
                    parentName: ele,
                    bLevel: 1,
                    bId: statueData.id,
                    attraction: statueData.attraction,
                    star: 0,
                    curDecorateId: nCurDecorateId,
                    curDecorateInfo: {
                        state: false,
                        time: 0
                    },
                    unLockDecorates: [nCurDecorateId]
                };
                defauleData.push(d);
            });
            return defauleData;
        }
        getDefaulSelectDecorate() {
            for (const key in Statue_Cfg) {
                if (Object.prototype.hasOwnProperty.call(Statue_Cfg, key)) {
                    const element = Statue_Cfg[key];
                    if (element.StatueType > 1) {
                        return element.id;
                    }
                }
            }
            console.log("err：===========表格中配置错误====方法：getDefaulSelectDecorate==========");
        }
        getStatueItemData(_lv) {
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
            sData = sData || (sData = []);
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
                        data.splice(index, 1);
                    }
                }
            });
            return data;
        }
        createByData(data, scene) {
            let arr = this.getPooledData(data);
            arr.forEach(element => {
                let _parent = scene.getChildByName("point").getChildByName(element.parentName);
                if (!_parent) {
                    Utils.clearLocalByKey(LocalStorage.Bottom);
                    Debug.Log("存在旧数据，已自动清除，请刷新");
                }
                else {
                    _parent.active = true;
                    let bottom = this.createBottom(element);
                    bottom.transform.rotationEuler = new Laya.Vector3(0, bottom.transform.rotationEuler.y + 180, 0);
                    _parent.destroyChildren();
                    _parent.addChild(bottom);
                }
            });
        }
        createSceneDecorates() {
            this._curSelectBottom.addDecorate();
            this.refreshData();
            Laya.stage.event(CommonDefine.EVENT_BOTTOM_REFRESH);
        }
        bottomLevelUp() {
            let parentName = this._curSelectBottom._name;
            for (let index = 0; index < this._bottomList.length; index++) {
                const e = this._bottomList[index];
                if (e._name == parentName) {
                    let cmp = Statue_Cfg[e._bId];
                    e.onLevelUp(this.maxBottomUpLv);
                    this.deductCost(cmp);
                    e.addStar(cmp.GiveStar);
                    e.addAttraction(cmp.attraction);
                    break;
                }
            }
            this.refreshData();
            Laya.stage.event(CommonDefine.EVENT_BOTTOM_REFRESH);
        }
        unLockDecorate(_id) {
            let cmp = Statue_Cfg[_id];
            this._curSelectBottom.unLockDecoratesById(_id);
            this._curSelectBottom.addStar(cmp.GiveStar);
            this._curSelectBottom.addAttraction(cmp.attraction);
            this.deductCost(cmp);
            this.refreshData();
            Laya.stage.event(CommonDefine.EVENT_BOTTOM_REFRESH);
        }
        deductCost(cmp) {
            Player.getInstance().refreshStar(cmp.GiveStar);
            Player.getInstance().refreshGold(-cmp.UnlockGold);
        }
        refreshData() {
            let _data = [];
            this._bottomList.forEach(_e => {
                let _curDecorateInfo = {};
                if (_e._curDecorate) {
                    _curDecorateInfo["state"] = _e._curDecorate.state;
                    _curDecorateInfo["time"] = _e._curDecorate.time;
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
            SaveManager.getInstance().SetBottomCache(_data);
        }
    }

    var contentTipUI = ui.view.common.ContentTipUI;
    class ContentTip extends contentTipUI {
        constructor(param) {
            super();
            this._comp = Collection_station_Cfg;
            this.sign = null;
            this.sign = param[0];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.bindEvent();
            this.onShowContent();
            Laya.timer.once(2000, this, this.onHideContent);
        }
        onDestroy() {
            this.off(Laya.Event.CLICK, this, this.onClick);
            Laya.timer.clearAll(this);
            GameUIManager.getInstance().destroyUI(TipViewScene);
        }
        bindEvent() {
            this.on(Laya.Event.CLICK, this, this.onClick);
        }
        onClick() {
            this.onHideContent();
        }
        onShowContent() {
            let content = this.getCompBySign(this.sign);
            if (content == "")
                return;
            this._title = this._title || "";
            GameUIManager.getInstance().destroyUI(TipViewScene);
            GameUIManager.getInstance().createTopUI(TipViewScene, [this._title, content, false]);
        }
        onHideContent() {
            GameUIManager.getInstance().destroyUI(ContentTip);
        }
        getCompBySign(sign) {
            if (CollectMapDataManager.getInstance().getLock(sign))
                return "";
            for (const key in this._comp) {
                if (Object.prototype.hasOwnProperty.call(this._comp, key)) {
                    const element = this._comp[key];
                    let arrUnlockmap = element.strunlockmap.split(",");
                    this.getMapName(arrUnlockmap[0], arrUnlockmap[1]);
                    let newTxt = element.strunlockmap.replace(",", "_") + "_collectpoint";
                    if (newTxt == sign) {
                        return element.strunlocktip;
                    }
                }
            }
        }
        getMapName(id, lv) {
            for (const key in Map_Cfg) {
                if (Object.prototype.hasOwnProperty.call(Map_Cfg, key)) {
                    const element = Map_Cfg[key];
                    if (Number(id) == element.mapid && Number(lv) == element.mapLevel) {
                        this._title = element.strDoc;
                        return;
                    }
                }
            }
        }
    }

    var IllustratedUI = ui.view.Illustrated.IllustratedUI;
    class Illustrated extends IllustratedUI {
        constructor(agms) {
            super();
            this._comp = null;
            this._initListArr = [];
            this._mapId = null;
            this._mapLv = null;
            this._mapId = agms[0] || 1;
            this._mapLv = agms[1] || 1;
        }
        onEnable() {
            this._comp = this.getComp();
            let oDrop = this.getUnRepetDrop(this._comp);
            this.setTitle();
            this.setListArr(oDrop);
            this.initList();
            this.refreshList();
            this.bindEvent();
        }
        onDestroy() {
            this.btn_close.off(Laya.Event.CLICK, this, this.closeEv);
            this.stage.off(CommonDefine.EVENT_ILLUSTRATED_REFRESH, this, this.refreshList);
        }
        bindEvent() {
            this.btn_close.on(Laya.Event.CLICK, this, this.closeEv);
            this.stage.on(CommonDefine.EVENT_ILLUSTRATED_REFRESH, this, this.refreshList);
        }
        closeEv() {
            GameUIManager.getInstance().destroyUI(Illustrated);
        }
        setTitle() {
            this.title_label.text = this._comp[1].strmapname;
        }
        setListArr(oDrop) {
            for (const key in oDrop) {
                if (Object.prototype.hasOwnProperty.call(oDrop, key)) {
                    const _element = oDrop[key];
                    let item = {};
                    item["id"] = key;
                    item["sComp"] = Succulent_Cfg[key];
                    for (const _key in _element) {
                        if (Object.prototype.hasOwnProperty.call(_element, _key)) {
                            const element = _element[_key];
                            item[_key] = element;
                        }
                    }
                    this._initListArr.push(item);
                }
            }
        }
        refreshList() {
            this.list.array = this._initListArr;
        }
        initList() {
            this.list.array = [];
            this.list.vScrollBarSkin = "";
            this.list.renderHandler = Laya.Handler.create(this, this.renderHandler, null, false);
            this.list.mouseHandler = Laya.Handler.create(this, this.mouseHandler, null, false);
        }
        renderHandler(cell) {
            let img = cell.getChildByName("list_item_img");
            let la_lockcon = cell.getChildByName("la_lockcon");
            img.skin = cell.dataSource.sComp.striconurl;
            if (cell.dataSource.mapLevel > this._mapLv) {
                img.gray = true;
                la_lockcon.skin = "gameui/lock.png";
            }
            else {
                img.gray = false;
                la_lockcon.skin = "gameui/cancollect.png";
            }
            cell.getChildByName("label_name").text = cell.dataSource.sComp.strname;
        }
        mouseHandler(e) {
            let dataSource = e.currentTarget.dataSource;
            let img = e.currentTarget.getChildByName("list_item_img");
            if (e.type == "click") {
                this.setTip(false);
                let text = "";
                let _pos = e.target.localToGlobal(new Laya.Point(img.x, img.y));
                let pos = _pos;
                if (img.gray) {
                    text = dataSource.sComp.strname + " 开放" + dataSource.strDoc + "区域解锁";
                }
                else {
                    text = dataSource.sComp.strname;
                }
                this.setTip(true, text, pos);
            }
        }
        getUnRepetDrop(dComp) {
            let dropMap = {};
            for (const key in dComp) {
                if (Object.prototype.hasOwnProperty.call(dComp, key)) {
                    const element = dComp[key];
                    let arrSidgroup = element.strSidgroup.split("|");
                    let strdrop = element.strdrop.split("|");
                    strdrop.forEach((e, i) => {
                        if (!dropMap[e]) {
                            dropMap[e] = element;
                        }
                    });
                    arrSidgroup.forEach((e, i) => {
                        if (!dropMap[e]) {
                            dropMap[e] = element;
                        }
                    });
                }
            }
            return dropMap;
        }
        getComp() {
            let _comp = {};
            for (const key in Map_Cfg) {
                if (Object.prototype.hasOwnProperty.call(Map_Cfg, key)) {
                    const element = Map_Cfg[key];
                    if (element.mapid == this._mapId) {
                        _comp[key] = element;
                    }
                }
            }
            return _comp;
        }
        setTip(isShow, text, pos) {
            this.tip.visible = isShow;
            if (isShow == false) {
                Laya.timer.clearAll(this);
                return;
            }
            this.tip.pos(pos.x - 50, pos.y - 60);
            this.tipTxt.text = text;
            Laya.timer.once(1500, this, () => {
                this.tip.visible = false;
            });
        }
    }

    class DecorateViewScene extends ui.view.decorate.decorateUIUI {
        constructor() {
            super();
            this.nUnLock = 0;
            this.selectSign = "gameui/zs/img_use.png";
        }
        onEnable() {
            this.init();
            this.initList();
            this.bindEvent();
            this.refresh(true);
            this.initListBg();
            SceneRayChecker.getInstance().disabledHit = true;
        }
        bindEvent() {
            this.btn_close.on(Laya.Event.CLICK, this, this.closeEv);
            this.select_view.getChildByName("selected").on(Laya.Event.CLICK, this, this.selectEv);
            this.need_view.getChildByName("selected").on(Laya.Event.CLICK, this, this.needEv);
            this.select_view.getChildByName("tip_close").on(Laya.Event.CLICK, this, this.tipClose);
            this.need_view.getChildByName("tip_close").on(Laya.Event.CLICK, this, this.tipClose);
            this.btn_up_level.on(Laya.Event.CLICK, this, this.upLevel);
            Laya.stage.on(CommonDefine.EVENT_BOTTOM_REFRESH, this, this.refresh);
        }
        refresh(isFirst = false) {
            if (!isFirst) {
                this.setTip();
            }
            this.nUnLock = 0;
            this.refreshBottom();
            this.refreshList();
            this.isOnDisableUpBtn();
            this.setHtmlText();
            this.setProValue();
            this.unLockNumberShow();
        }
        onDisable() {
            SceneRayChecker.getInstance().disabledHit = false;
            this.btn_close.offAll();
            this.select_view.getChildByName("selected").offAll();
            this.need_view.getChildByName("selected").offAll();
            this.select_view.getChildByName("tip_close").offAll();
            this.need_view.getChildByName("tip_close").offAll();
            Laya.stage.off(CommonDefine.EVENT_BOTTOM_REFRESH, this, this.refresh);
        }
        init() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.select_view.visible = false;
            this.need_view.visible = false;
            const GlowFilter = Laya.GlowFilter;
            this.glowFilter = new GlowFilter("#28cc0d", 6, 0, 0);
        }
        setTip() {
            let lv = this.label_level.text.replace("LV.", "");
            if (BottomCreater.getInstance()._curSelectBottom._level.toString() != lv) {
                GameUIManager.getInstance().createTopUI(TipViewScene, [null, "装饰底座升级成功", false]);
            }
        }
        refreshBottom() {
            let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
            this.label_level.text = "LV." + BottomCreater.getInstance()._curSelectBottom._level;
            this.miaoshu.text = cmp.strdescription;
            this.decorate_img.skin = cmp.strStatueIcon;
        }
        initListBg() {
            let aLength = Math.ceil(this.decorate_list.array.length / 4);
            let _arr = [];
            for (let index = 0; index < aLength; index++) {
                _arr[index] = index;
            }
            this.decorate_list_bg.array = _arr;
        }
        initList() {
            this.decorate_list.array = [];
            this.decorate_list.vScrollBarSkin = "";
            this.decorate_list.renderHandler = Laya.Handler.create(this, this.renderHandler, null, false);
            this.decorate_list.mouseHandler = Laya.Handler.create(this, this.mouseHandler, null, false);
        }
        refreshList() {
            let _array = ConfigManager.prototype.GetJsonToArray(Statue_Cfg);
            let _bArrray = [];
            _array.forEach(ele => {
                if (ele.StatueType == 2) {
                    if (BottomCreater.getInstance()._curSelectBottom) {
                        if (BottomCreater.getInstance()._curSelectBottom._unLockDecorates.indexOf(ele.id) != -1) {
                            ele.unLock = true;
                            this.nUnLock++;
                        }
                        else {
                            ele.unLock = false;
                        }
                        if (BottomCreater.getInstance()._curSelectBottom._curDecorateId == ele.id) {
                            ele.selected = true;
                        }
                        else {
                            ele.selected = false;
                        }
                        let vNum = 0;
                        if (ele.UnlockGold <= Player.getInstance().nGold)
                            vNum++;
                        if (ele.UnlockStar <= Player.getInstance().nStar)
                            vNum++;
                        if (ele.UnlockLv <= BottomCreater.getInstance()._curSelectBottom._level)
                            vNum++;
                        if (ele.unLock || vNum == 3) {
                            ele.isMeet = true;
                        }
                        else {
                            ele.isMeet = false;
                        }
                    }
                    _bArrray.push(ele);
                }
            });
            this.decorate_list.array = _bArrray;
        }
        mouseHandler(e) {
            if (e.type == "click") {
                let _box = e.currentTarget;
                if (_box.dataSource.unLock) {
                    this.selectViewInit(_box.dataSource);
                    this.select_view.visible = true;
                }
                else {
                    this.needViewInit(_box.dataSource);
                    this.need_view.visible = true;
                }
            }
        }
        renderHandler(cell) {
            let img = cell.getChildByName("decorate_item");
            img.width = 100;
            img.height = 100;
            let imgSelect = cell.getChildByName("sign_selected");
            let imgUplock = cell.getChildByName("sign_uplock");
            img.skin = cell.dataSource.strStatueIcon;
            img.disabled = (cell.dataSource.unLock == false) ? true : false;
            if (cell.dataSource.selected == false) {
                imgSelect.skin = "";
                if (!img.disabled) {
                    Utils.setGlowFilter(img, null);
                }
            }
            else {
                imgSelect.skin = this.selectSign;
                Utils.setGlowFilter(img, this.glowFilter);
            }
            if (cell.dataSource.isMeet && cell.dataSource.unLock == false) {
                imgUplock.visible = true;
                imgUplock.skin = "gameui/zs/img_upLock.png";
            }
            else if (!cell.dataSource.isMeet) {
                imgUplock.visible = true;
                imgUplock.skin = "gameui/lock.png";
            }
            else {
                imgUplock.visible = false;
            }
        }
        selectViewInit(data) {
            this.select_view.getChildByName("item").skin = data.strStatueIcon;
            this.selectedId = data.id;
        }
        needViewInit(data) {
            this.need_view.getChildByName("item").skin = data.strStatueIcon;
            this.need_view.getChildByName("need_gold").text = "" + data.UnlockGold;
            this.need_view.getChildByName("need_star").text = "" + data.UnlockStar;
            this.need_view.getChildByName("need_lv").text = "" + data.UnlockLv;
            if (data.UnlockGold > Player.getInstance().nGold) {
                this.need_view.getChildByName("need_gold").color = "#f00";
            }
            else {
                this.need_view.getChildByName("need_gold").color = "#fff";
            }
            if (data.UnlockStar > Player.getInstance().nStar) {
                this.need_view.getChildByName("need_star").color = "#f00";
            }
            else {
                this.need_view.getChildByName("need_star").color = "#fff";
            }
            if (data.UnlockLv > BottomCreater.getInstance()._curSelectBottom._level) {
                this.need_view.getChildByName("need_lv").color = "#f00";
            }
            else {
                this.need_view.getChildByName("need_lv").color = "#fff";
            }
            if (data.isMeet) {
                this.need_view.getChildByName("selected").disabled = false;
                this.unLockId = data.id;
            }
            else {
                this.need_view.getChildByName("selected").disabled = true;
                this.unLockId = null;
            }
        }
        upLevel() {
            EffectManager.getInstance().BtnEffect(this.btn_up_level);
            Laya.stage.event(CommonDefine.EVENT_BOTTOM_LEVEL_UP);
        }
        needEv() {
            if (this.unLockId) {
                BottomCreater.getInstance().unLockDecorate(this.unLockId);
                this.unLockId = null;
            }
            this.tipClose();
        }
        selectEv() {
            BottomCreater.getInstance()._curSelectBottom._curDecorateId = this.selectedId;
            this.selectedId = null;
            this.tipClose();
            Laya.stage.event(CommonDefine.EVENT_BOTTOM);
        }
        closeEv() {
            GameUIManager.getInstance().destroyUI(DecorateViewScene);
        }
        isOnDisableUpBtn() {
            let _is = false;
            if (BottomCreater.getInstance()._curSelectBottom._bId) {
                let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
                if (cmp.UnlockGold <= Player.getInstance().nGold && cmp.UnlockStar <= Player.getInstance().nStar && this.nUnLock >= cmp.UnlockLvNum) {
                    _is = false;
                }
                else {
                    _is = true;
                }
                if (BottomCreater.getInstance()._curSelectBottom._level >= BottomCreater.getInstance().maxBottomUpLv) {
                    _is = true;
                }
            }
            this.btn_up_level.disabled = _is;
        }
        setHtmlText() {
            let nAttraction = 0;
            let nStar = 0;
            let iCmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
            if (iCmp) {
                nAttraction = iCmp.attraction;
                nStar = iCmp.GiveStar;
            }
            this.htmlText.x = 0;
            this.htmlText.y = 0;
            this.htmlText.style.width = 514;
            this.htmlText.style.height = 81;
            this.htmlText.style.align = "center";
            this.htmlText.style.lineHeight = 30;
            this.htmlText.style.color = "#b0792b";
            this.htmlText.style.fontSize = 24;
            this.htmlText.style.padding = [10, 5, 10, 5];
            let strArr = Utils.getArrayBySplitString(iCmp.strdescription1, "\n");
            let html = "";
            strArr.forEach(element => {
                html += "<span>" + element + "</span><br/>";
            });
            this.htmlText.innerHTML = html;
        }
        setProValue() {
            if (!BottomCreater.getInstance()._curSelectBottom)
                return;
            let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
            if (Player.getInstance().nGold >= cmp.UnlockGold) {
                this.pro_value.value = 1;
                Utils.setGlowFilter(this.pro_value, this.glowFilter);
            }
            else {
                this.pro_value.value = Player.getInstance().nGold / cmp.UnlockGold;
                Utils.setGlowFilter(this.pro_value, null);
            }
            this.value_gold1.text = Player.getInstance().nGold + "";
            this.value_gold2.text = cmp.UnlockGold + "";
        }
        tipClose() {
            this.need_view.visible = false;
            this.select_view.visible = false;
        }
        unLockNumberShow() {
            let cmp = Statue_Cfg[BottomCreater.getInstance()._curSelectBottom._bId];
            this.unLockNumber1.text = "已解锁:" + this.nUnLock + "个";
            this.unLockNumber2.text = this.nUnLock + "/" + cmp.UnlockLvNum;
        }
    }

    var Event$3 = Laya.Event;
    var Vector2$4 = Laya.Vector2;
    var MouseManager$2 = Laya.MouseManager;
    var Vector3$g = Laya.Vector3;
    var Ray$1 = Laya.Ray;
    var HitResult$1 = Laya.HitResult;
    var Point$3 = Laya.Point;
    var Box$1 = Laya.Box;
    var Image = Laya.Image;
    var Button$1 = Laya.Button;
    class SceneRayChecker extends Singleton {
        constructor() {
            super(...arguments);
            this._target = null;
            this.point = new Vector2$4();
            this.disabledHit = false;
            this.ray = new Ray$1(new Vector3$g(0, 0, 0), new Vector3$g(0, 0, 0));
            this.pressPoint = new Point$3();
            this.touchDistance = 100;
            this.outHitResult = new HitResult$1();
        }
        initChecker(scene) {
            Laya.stage.on(Event$3.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Event$3.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.on(Event$3.MOUSE_UP, this, this.onMouseUp);
            this._sceneBase = scene;
            this._scene = scene.scene3d;
            this._camera = scene.camera;
        }
        clearChecker() {
            Laya.stage.off(Event$3.MOUSE_DOWN, this, this.onMouseDown);
            this._sceneBase = null;
            this._scene = null;
            this._camera = null;
        }
        onMouseUp(e) {
            GameScene.instance.carEditor.endDrag();
            if (e.target != Laya.stage)
                return;
            if (e.target.name == "bubble")
                return;
            if (this.disabledHit)
                return;
            this.point.x = MouseManager$2.instance.mouseX;
            this.point.y = MouseManager$2.instance.mouseY;
            if (this.pressPoint.x != -1 && this.pressPoint.y != -1) {
                if (e["stageX"] - this.pressPoint.x > this.touchDistance) {
                    Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", this._camera]);
                    return;
                }
                else if (this.pressPoint.x - e["stageX"] > this.touchDistance) {
                    Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", this._camera]);
                    return;
                }
            }
            this._camera.viewportPointToRay(this.point, this.ray);
            this._scene.physicsSimulation.rayCast(this.ray, this.outHitResult);
            if (this.outHitResult.succeeded) {
                this.execUpEvent(this.outHitResult.collider.owner);
            }
            this._target = null;
            this.pressPoint.x = -1;
            this.pressPoint.y = -1;
        }
        onMouseDown(e) {
            if (e.target != Laya.stage)
                return;
            this.pressPoint.x = -1;
            this.pressPoint.y = -1;
            if (e.target.name == "bubble")
                return;
            if (e.target instanceof Box$1)
                return;
            if (e.target instanceof Image)
                return;
            if (e.target instanceof Button$1)
                return;
            if (this.disabledHit)
                return;
            this.point.x = MouseManager$2.instance.mouseX;
            this.point.y = MouseManager$2.instance.mouseY;
            this._camera.viewportPointToRay(this.point, this.ray);
            this._scene.physicsSimulation.rayCast(this.ray, this.outHitResult);
            if (this.outHitResult.succeeded) {
                this.execDownEvent(this.outHitResult.collider.owner);
            }
            this.pressPoint.x = e["stageX"];
            this.pressPoint.y = e["stageX"];
        }
        onMouseMove(e) {
            if (e.target != Laya.stage)
                return;
            GameScene.instance.carEditor.onDragMove(e);
        }
        execDownEvent(rat) {
            if (rat.name.indexOf("defaulsucculent") != -1 || rat.name.indexOf("defaultStatueNode") != -1
                || rat.name.indexOf("mapNode") != -1) {
                this._target = rat;
            }
            if (rat.parent instanceof NpcBase) {
                rat.parent.onClick();
            }
            if (rat.parent instanceof StaffBase) {
                rat.parent.onClick();
                if (rat.parent instanceof Gatherman)
                    GameScene.instance.carEditor.beginDrag(rat.parent);
            }
            else if (rat.parent instanceof SceneItem) {
                SceneItemCreater.getInstance().pickItemNearby(this._camera, rat.parent);
                GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, rat);
            }
            else if (rat.parent instanceof Bottom) {
                let bottom = rat.parent;
                if (bottom instanceof Bottom) {
                    this._target = bottom;
                }
            }
            else if (rat.parent instanceof Decorate) {
                let bottom = rat.parent.parent.parent.parent;
                if (bottom instanceof Bottom) {
                    this._target = bottom;
                }
            }
            else if (rat.name.indexOf("_collectpoint") != -1) {
                this._target = rat;
            }
            else if (rat.parent && rat.parent.parent instanceof Potted) {
                this._target = rat.parent;
            }
            else if (rat.name == "HY_fangzi01" || rat.name == "HY_fangzi02" || rat.name.indexOf("gaoshipai_1") != -1) {
                this._target = rat;
            }
        }
        OpenFlowerStateView(name) {
            if (!name)
                return;
            let tPoint = PotManager.getInstance().PotMap[name];
            let potData = [];
            let nLength = 0;
            if (tPoint) {
                for (const key in tPoint.PotList) {
                    nLength++;
                }
            }
            if (nLength <= 0) {
                SceneManager.getInstance().openScene(DIYScene.instance, [name, 0]);
                return;
            }
            GameUIManager.getInstance().createUI(PointFlowerStateView, [name]);
        }
        execUpEvent(rat) {
            if ((rat.name.indexOf("defaulsucculent") != -1 || rat.name.indexOf("defaultStatueNode") != -1
                || rat.name.indexOf("mapNode") != -1) && this._target == rat) {
                LandManager.getInstance().checkLandState(rat.name);
            }
            else if (rat.parent instanceof Bottom) {
                let bottom = rat.parent;
                if (bottom instanceof Bottom && bottom == this._target) {
                    BottomCreater.getInstance().curSelectBottom(bottom);
                    GameUIManager.getInstance().showUI(DecorateViewScene);
                }
            }
            else if (rat.parent instanceof Decorate) {
                let bottom = rat.parent.parent.parent.parent;
                if (bottom instanceof Bottom && bottom == this._target) {
                    BottomCreater.getInstance().curSelectBottom(bottom);
                    GameUIManager.getInstance().showUI(DecorateViewScene);
                }
            }
            else if (rat.parent && rat.parent.parent instanceof Potted && rat.parent == this._target) {
                this.OpenFlowerStateView(rat.parent.parent.parent.name);
            }
            else if (rat.name.indexOf("_collectpoint") != -1) {
                if (this._target == rat) {
                    GameUIManager.getInstance().destroyUI(ContentTip);
                    GameUIManager.getInstance().createUI(ContentTip, [rat.name]);
                }
            }
            else if (rat.name == "HY_fangzi01") {
                if (this._target == rat) {
                    GameUIManager.getInstance().showUI(GatherView);
                }
            }
            else if (rat.name == "HY_fangzi02") {
                if (this._target == rat) {
                    GameUIManager.getInstance().showUI(StaffView);
                }
            }
            else if (rat.name.indexOf("gaoshipai_1") != -1) {
                if (this._target == rat) {
                    var name = rat.name;
                    var mapId = Number(name.substr(name.indexOf("_") + 1, name.length));
                    var mapLevel = CollectMapDataManager.getInstance().getMaxMapLevel(mapId);
                    GameUIManager.getInstance().createUI(Illustrated, [mapId, mapLevel]);
                }
            }
            GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, rat);
        }
    }

    class StaffInfo extends ui.view.common.StaffInfoUI {
        constructor(data) {
            super();
            this._data = data;
        }
        onEnable() {
            this.OnInit();
            this.OnEvent();
        }
        OnInit() {
            this.itemname.text = Succulent_Cfg[this._data.itemId].strname;
            this.good_pic.skin = Succulent_Cfg[this._data.itemId]["striconurl"];
            this.dec.text = Succulent_Cfg[this._data.itemId].strdescribe;
            let st = this._data.itemNum.toString();
            this.good_num.removeChildren();
            for (let index = 0; index < st.length; index++) {
                const str = Number(st[index]);
                let c = this.getCurClipNumer(this.good_num, str, index);
                this.good_num.addChild(c);
            }
        }
        getCurClipNumer(offsetTarget, n, index) {
            let clip = new Laya.Clip("gameui/main/number.png", 10, 1);
            clip.index = n;
            clip.pos(index * 16, 0);
            return clip;
        }
        onDisable() {
            this.offAll();
        }
        OnEvent() {
            this.bg.on(Laya.Event.CLICK, this, function () {
                GameUIManager.getInstance().destroyUI(StaffInfo);
            });
            this.btn_click.on(Laya.Event.CLICK, this, function () {
                GameUIManager.getInstance().destroyUI(StaffInfo);
            });
        }
    }

    class BackPackScene extends ui.view.BackPackSceneUI {
        constructor() {
            super();
            this._dArr = [];
            this._zArr = [];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.onInit();
            this.onEvent();
        }
        onDisable() {
            this.offAll();
            this.ui_close_button.off(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(BackPackScene);
            });
        }
        set visible(b) {
            super.visible = b;
            if (b)
                this.onEnable();
        }
        onInit() {
            let list = [];
            this._dArr = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_DUOROU);
            this._zArr = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_ZHUANGSHI);
            for (let i in this._dArr) {
                list.push(this._dArr[i]);
            }
            for (let i in this._zArr) {
                list.push(this._zArr[i]);
            }
            this.ui_good_list.array = list;
            this.ui_good_list.vScrollBarSkin = "";
            this.ui_good_list.renderHandler = new Laya.Handler(this, this.SetItemInfo);
            this.ui_good_list.selectEnable = true;
            this.ui_good_list.selectHandler = new Laya.Handler(this, this.ClickItem);
            this.decorate_list_bg.vScrollBarSkin = "";
            let delist = [];
            for (let i = 0; i < Math.ceil(list.length / 3); i++) {
                delist.push(i);
            }
        }
        onEvent() {
            this.ui_close_button.on(Laya.Event.CLICK, this, () => {
                GameUIManager.getInstance().hideUI(BackPackScene);
            });
        }
        SetItemInfo(box, index) {
            let GoodPic = box.getChildByName("good_pic");
            let GoodNum = box.getChildByName("good_num");
            let boxnum = box.getChildByName("boxnum");
            let name = box.getChildByName("label_name");
            let bg = box.getChildByName("bg");
            if (index % 3 == 0) {
                bg.visible = true;
            }
            let data = this.GetItemInfo(index);
            GoodPic.skin = Succulent_Cfg[data.itemId]["striconurl"];
            name.text = Succulent_Cfg[data.itemId]["strname"];
            GoodNum.text = data.itemNum;
            let st = GoodNum.text.length;
            boxnum.removeChildren();
            for (let index = 0; index < st; index++) {
                const str = Number(GoodNum.text[index]);
                let c = this.getCurClipNumer(boxnum, str, index);
                boxnum.addChild(c);
            }
        }
        getCurClipNumer(offsetTarget, n, index) {
            let clip = new Laya.Clip("gameui/main/number.png", 10, 1);
            clip.index = n;
            clip.pos(index * 16, 0);
            return clip;
        }
        ClickItem(index) {
            GameUIManager.getInstance().createUI(StaffInfo, this.GetItemInfo(index));
        }
        GetItemInfo(index) {
            let data = null;
            if (index < this._dArr.length) {
                data = this._dArr[index];
            }
            else {
                data = this._zArr[index - (this._dArr.length)];
            }
            return data;
        }
    }

    class ItemInfoView extends ui.view.common.ItemInfoViewUI {
        constructor(data) {
            super();
            this._data = data;
        }
        onEnable() {
            this.OnInit();
            this.OnEvent();
        }
        OnInit() {
            this.itemname.text = Succulent_Cfg[this._data].strname;
            this.good_pic.skin = Succulent_Cfg[this._data]["striconurl"];
            this.dec.text = Succulent_Cfg[this._data].strdescribe;
            this.condivalue.text = Succulent_Cfg[this._data].unlockstar;
            this.moneydec.text = Succulent_Cfg[this._data].gold;
            this.condi.visible = Number(Succulent_Cfg[this._data].unlockstar) == 0 ? false : true;
            this.money.visible = Number(Succulent_Cfg[this._data].gold) == 0 ? false : true;
        }
        getCurClipNumer(offsetTarget, n, index) {
            let clip = new Laya.Clip("gameui/main/number.png", 10, 1);
            clip.index = n;
            clip.pos(index * 16, 0);
            return clip;
        }
        onDisable() {
            this.offAll();
        }
        OnEvent() {
            this.btn_click.on(Laya.Event.CLICK, this, function () {
                GameUIManager.getInstance().destroyUI(ItemInfoView);
            });
            this.btn_share.on(Laya.Event.CLICK, this, function () {
                EffectManager.getInstance().BtnEffect(this.btn_share);
            });
        }
    }

    class HandBookView extends ui.view.HandBookViewUI {
        constructor() {
            super();
            this._dArr = [];
            this.Allarr = [];
            this.alltab = [1,];
            this.seletab = 0;
            this.curselect = 0;
            this._potData = [];
            this._duorouArr = [];
            this._zhuangshiArr = [];
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.itemlist.renderHandler = new Laya.Handler(this, this.SetItemInfo);
            this._duorouArr = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_DUOROU);
            this._zhuangshiArr = BagSystem.getInstance().getItemByType(CommonDefine.SUCCULENT_TYPE_ZHUANGSHI);
            this.Allarr = ConfigManager.prototype.GetJsonToArray(Succulent_Cfg);
            let curtype = 1;
            this.Allarr.forEach(element => {
                if (element.type != curtype) {
                    this.alltab.push(element.type);
                    curtype = element.type;
                }
            });
            this.SetButton(this.seletab);
            this.onInit();
            this.onEvent();
            this.itemlist.vScrollBarSkin = "";
        }
        onDisable() {
            this.offAll();
        }
        SetButton(index) {
            for (let i = 0; i < 3; i++) {
                let btn = this["btn" + i];
                if (i == index) {
                    btn.skin = "gameui/handbook/" + "tab" + i + "_2.png";
                }
                else {
                    btn.skin = "gameui/handbook/" + "tab" + i + "_1.png";
                }
            }
            this.seletab = index;
            this._dArr = [];
            this.Allarr.forEach(element => {
                if (element.type == this.alltab[index]) {
                    this._dArr.push(element.id);
                }
            });
            if (index == 0) {
                this.dec.text = "多肉";
            }
            else if (index == 1) {
                this.dec.text = "玩具";
            }
            else if (index == 2) {
                this.dec.text = "花盆";
            }
            this.itemlist.array = this._dArr;
        }
        onInit() {
        }
        onEvent() {
            for (let i = 0; i < 4; i++) {
                let btn = this["btn" + i];
                btn.on(Laya.Event.CLICK, this, this.SetButton, [i]);
            }
            this.btn_close.on(Laya.Event.CLICK, this, function () {
                GameUIManager.getInstance().hideUI(HandBookView);
            });
        }
        SetItemInfo(box, index) {
            let bg = box.getChildByName("bg");
            if (index % 4 == 0) {
                bg.visible = true;
            }
            let icon = box.getChildByName("good_pic");
            let name = box.getChildByName("label_name");
            let GoodNum = box.getChildByName("good_num");
            let boxnum = box.getChildByName("boxnum");
            icon.skin = Succulent_Cfg[this._dArr[index]]["striconurl"];
            icon.gray = true;
            let tempname = "???";
            let bparr = null;
            GoodNum.text = "";
            boxnum.removeChildren();
            if (this.seletab != 1) {
                bparr = BagSystem.getInstance().getItemByType(this.alltab[this.seletab]);
                for (let i in bparr) {
                    if (bparr[i].itemId == this._dArr[index]) {
                        tempname = Succulent_Cfg[this._dArr[index]]["strname"];
                        icon.gray = false;
                        GoodNum.text = bparr[i].itemNum;
                        let st = GoodNum.text.length;
                        for (let index = 0; index < st; index++) {
                            const str = Number(GoodNum.text[index]);
                            let c = this.getCurClipNumer(boxnum, str, index);
                            boxnum.addChild(c);
                        }
                    }
                }
            }
            else {
                bparr = Player.getInstance().tPotData;
                if (bparr) {
                    for (let j in bparr) {
                        if (j == this._dArr[index]) {
                            tempname = Succulent_Cfg[this._dArr[index]]["strname"];
                            icon.gray = false;
                        }
                    }
                }
            }
            name.text = tempname;
            box.on(Laya.Event.CLICK, this, this.ClickItem, [index]);
        }
        ClickItem(index) {
            this.curselect = index;
            GameUIManager.getInstance().createUI(ItemInfoView, this._dArr[index]);
        }
        getCurClipNumer(offsetTarget, n, index) {
            let clip = new Laya.Clip("gameui/main/number.png", 10, 1);
            clip.index = n;
            clip.pos(index * 16, 0);
            return clip;
        }
    }

    class WXRankView extends ui.view.rank.WXRankViewUI {
        constructor() {
            super();
        }
        onEnable() {
            this.OnInit();
            this.OnEvent();
        }
        OnEvent() {
            this.btn_click.on(Laya.Event.CLICK, this, this.Close);
        }
        OnInit() {
            this.opendata.size(this.width, this.height);
            let loadRes = [
                "res/atlas/gameui/Rank.atlas",
            ];
            ResourceManager.getInstance().LoadASyn(loadRes, Laya.Handler.create(this, (mapRetRes) => {
                this.opendata.postMsg({
                    openid: MyPlayer.wxSDK.openId,
                });
                Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/gameui/Rank.atlas");
            }));
        }
        Close() {
            this.opendata.postMsg("close");
            GameUIManager.getInstance().destroyUI(WXRankView);
        }
        onDisable() {
        }
        OnHide() {
        }
        OnDestroy() {
        }
    }

    class getGoods {
        constructor(pro) {
            this.storage_time = 0;
            this.eff = null;
            this.init();
            this._pro = pro;
        }
        init() {
            this.getStorage();
            this.goTime();
        }
        isGetGoods() {
            let _new_time = Laya.Browser.now() / 1000;
            let _dTime = _new_time - this.storage_time;
            let mm = this.curGoodsTime * 60;
            if (_dTime >= mm) {
                Laya.timer.clearAll(this);
                Laya.stage.event(CommonDefine.EVENT_MAIN_GOODS_EVENT, [true, 0, this.curGoodsId, this.curGoodsNum]);
            }
            else {
                Laya.stage.event(CommonDefine.EVENT_MAIN_GOODS_EVENT, [false, mm - _dTime, this.curGoodsId, this.curGoodsNum]);
            }
            return [_dTime, mm];
        }
        startTime() {
            let _d = gift_Cfg[this.curId + 1];
            this.curId = _d ? this.curId + 1 : this.curId;
            this.setTime();
            this.goTime();
        }
        goTime() {
            Laya.timer.loop(1000, this, () => {
                let arr = this.isGetGoods();
                this.setProValue(arr[0], arr[1]);
                if (arr[0] >= arr[1]) {
                    if (this.eff) {
                        this.eff.Destroy();
                        this.eff = null;
                    }
                    return;
                }
                let _x = this._pro.x + this._pro.width * this._pro.value;
                let _y = this._pro.y;
                if (!this.eff) {
                    this.eff = new Avatars(this._pro.parent);
                    this.eff.Load(Effect_Cfg[6].streffect, 1, 1, _x, _y, Laya.Handler.create(this, () => {
                        this.eff.Play(Effect_Cfg[6].straniname, true, true, null);
                    }));
                }
                else {
                    this.eff.setPostion(_x, _y);
                }
            });
        }
        setProValue(cTime, sTime) {
            let _vaule = cTime / sTime;
            this._pro.value = _vaule;
        }
        setTime() {
            let data = {
                time: Laya.Browser.now() / 1000,
                curId: this.curId,
            };
            SaveManager.getInstance().SetGoodsTime(data);
            this.getStorage();
        }
        getStorage() {
            let data = SaveManager.getInstance().GetCache(ModelStorage.SgoodsTime);
            if (data) {
                this.storage_time = data.time;
                this.curId = data.curId;
            }
            else {
                this.storage_time = Laya.Browser.now() / 1000;
                this.curId = 1;
                let data = {
                    time: this.storage_time,
                    curId: this.curId,
                };
                SaveManager.getInstance().SetGoodsTime(data);
            }
            this.curGoodsId = gift_Cfg[this.curId].itemID;
            this.curGoodsTime = gift_Cfg[this.curId].time;
            this.curGoodsNum = gift_Cfg[this.curId].num;
        }
    }

    class MainUIScene extends ui.view.main.MainUIUI {
        constructor() {
            super();
            this.TakePhotoing = true;
            this.PickMoneying = true;
            this.TakePhotoTime = 0;
            this.PickMoneyTime = 0;
            this._unlockX = 0;
            this._unlockY = 0;
            this.goodsInit = null;
            this.goodsEffect = null;
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            if (SaveManager.getInstance().GetCache(ModelStorage.Publicity))
                this.Panel_publicity.visible = true;
            else
                this.Panel_publicity.visible = false;
            this.progressbar_flyer.value = 0;
            this.Panel_TakePhoto.visible = false;
            this.Panel_pickMoney.visible = false;
            this.init();
            this.bindEvent();
            this.LoadLocalData();
            this.goodsInit = new getGoods(this.pro);
        }
        onDisable() {
            this.stage.off(CommonDefine.EVENT_MAIN_REFRESH, this, this.refresh);
            this.stage.off(CommonDefine.EVENT_MAIN_UI_SHOW, this, this.setMianBtnShow);
            this.stage.off(CommonDefine.EVENT_MAIN_GOODS_EVENT, this, this.setGoods);
            this.btn_time_bg.off(Laya.Event.CLICK, this, this.goodsClick);
            GEvent.RemoveEvent(GacEvent.OnShowUI_propagandist, Laya.Handler.create(this, this.StartFlyer));
            GEvent.RemoveEvent(GacEvent.OnShowUI_dustman, Laya.Handler.create(this, this.StartpickMoney));
            GEvent.RemoveEvent(GacEvent.OnShowUI_cameraman, Laya.Handler.create(this, this.StartTakePhoto));
            GEvent.RemoveEvent(GacEvent.OnUpdata_cameramantime, Laya.Handler.create(this, this.UpdateTakePhototime));
            GEvent.RemoveEvent(GacEvent.OnUpdata_dustmantime, Laya.Handler.create(this, this.UpdatepickMoneytime));
        }
        bindEvent() {
            this.stage.on(CommonDefine.EVENT_MAIN_REFRESH, this, this.refresh);
            this.stage.on(CommonDefine.EVENT_MAIN_UI_SHOW, this, this.setMianBtnShow);
            this.stage.on(CommonDefine.EVENT_MAIN_GOODS_EVENT, this, this.setGoods);
            this.btn_time_bg.on(Laya.Event.CLICK, this, this.goodsClick);
            this.btn_edit.on(Laya.Event.CLICK, this, this.edit);
            this.btn_rank.on(Laya.Event.CLICK, this, this.rank);
            this.btn_ad.on(Laya.Event.CLICK, this, this.Btn_Showadvertising);
            this.btn_flyer.on(Laya.Event.CLICK, this, this.Btn_SendFlyer);
            this.btn_pickMoney.on(Laya.Event.CLICK, this, this.Btn_PickMoney);
            this.btn_TakePhoto.on(Laya.Event.CLICK, this, this.Btn_TakePhoto);
            this.btn_backpack.on(Laya.Event.CLICK, this, this.OpenBackPackUI);
            this.btn_handbook.on(Laya.Event.CLICK, this, this.OpenHandBookUI);
            GEvent.RegistEvent(GacEvent.OnShowUI_propagandist, Laya.Handler.create(this, this.StartFlyer));
            GEvent.RegistEvent(GacEvent.OnShowUI_dustman, Laya.Handler.create(this, this.StartpickMoney));
            GEvent.RegistEvent(GacEvent.OnShowUI_cameraman, Laya.Handler.create(this, this.StartTakePhoto));
            GEvent.RegistEvent(GacEvent.OnUpdata_cameramantime, Laya.Handler.create(this, this.UpdateTakePhototime));
            GEvent.RegistEvent(GacEvent.OnUpdata_dustmantime, Laya.Handler.create(this, this.UpdatepickMoneytime));
        }
        init() {
            this.refresh();
        }
        refresh() {
            let strGold = Player.getInstance().nGold.toString();
            let strStar = Player.getInstance().nStar.toString();
            this.num_gold.removeChildren();
            this.num_star.removeChildren();
            MyPlayer.wxSDK.WxUpload("stars", Player.getInstance().nStar);
            for (let index = 0; index < strGold.length; index++) {
                const str = Number(strGold[index]);
                let arr = [this.num_gold.x + 45 + index * 16, 8, str, "gameui/main/number.png", 10, 1];
                let c = Utils.getClipNum(arr);
                this.num_gold.addChild(c);
            }
            for (let index = 0; index < strStar.length; index++) {
                const str = Number(strStar[index]);
                let arr = [this.num_gold.x + 45 + index * 16, 8, str, "gameui/main/number.png", 10, 1];
                let c = Utils.getClipNum(arr);
                this.num_star.addChild(c);
            }
        }
        zhuangshi() {
            this.showTip(true);
        }
        caiji() {
            this.showTip(true);
        }
        diy() {
            this.showTip(true);
        }
        rank() {
            EffectManager.getInstance().BtnEffect(this.btn_rank);
            GameUIManager.getInstance().showUI(WXRankView);
        }
        edit() {
            this.showTip(true);
        }
        Btn_Showadvertising() {
            EffectManager.getInstance().BtnEffect(this.btn_ad);
            if (Laya.Browser.onWeiXin) {
                MyPlayer.wxSDK.Share(Share_Cfg[2]["strtitle"], { title: Share_Cfg[2]["strdescribe"], imageUrl: Share_Cfg[2]["strpic"], query: "" }, {
                    successFn: function () {
                        console.log("是时候播放广告了！");
                        StaffManager.getInstance().LoadRangetenNpc();
                    },
                    failFn() {
                    }
                });
            }
            else {
                console.log("是时候播放广告了！");
                StaffManager.getInstance().LoadRangetenNpc();
            }
            DataLog.getInstance().LogVideo_log(GamePoint.Advertising);
        }
        Btn_SendFlyer() {
            EffectManager.getInstance().BtnEffect(this.btn_flyer);
            this.progressbar_flyer.value += 0.1;
            if (Math.ceil(this.progressbar_flyer.value * 10) >= 10) {
                EffectManager.getInstance().PlayEffect(this.btn_flyer, 1, 1);
                StaffManager.getInstance().LoadRangeNpc();
                this.progressbar_flyer.value = 0;
            }
        }
        Btn_TakePhoto() {
            EffectManager.getInstance().BtnEffect(this.btn_TakePhoto);
            if (Laya.Browser.onWeiXin) {
                let _that = this;
                MyPlayer.wxSDK.Share(Share_Cfg[8]["strtitle"], { title: Share_Cfg[8]["strdescribe"], imageUrl: Share_Cfg[8]["strpic"], query: "" }, {
                    successFn: function () {
                        _that.StartorContinue_TakePhoto();
                        _that.SaveInfo(3, GatherStateType.Collecting);
                    },
                    failFn() {
                    }
                });
            }
            else {
                this.StartorContinue_TakePhoto();
                this.SaveInfo(3, GatherStateType.Collecting);
            }
            DataLog.getInstance().LogVideo_log(GamePoint.PickUpMoney);
        }
        Btn_PickMoney() {
            EffectManager.getInstance().BtnEffect(this.btn_pickMoney);
            if (Laya.Browser.onWeiXin) {
                let _that = this;
                MyPlayer.wxSDK.Share(Share_Cfg[7]["strtitle"], { title: Share_Cfg[7]["strdescribe"], imageUrl: Share_Cfg[7]["strpic"], query: "" }, {
                    successFn: function () {
                        _that.StartorContinue_PickMoney();
                        _that.SaveInfo(2, GatherStateType.Collecting);
                    },
                    failFn() {
                    }
                });
            }
            else {
                this.StartorContinue_PickMoney();
                this.SaveInfo(2, GatherStateType.Collecting);
            }
            DataLog.getInstance().LogVideo_log(GamePoint.Photograph);
        }
        OpenBackPackUI() {
            EffectManager.getInstance().BtnEffect(this.btn_backpack);
            GameUIManager.getInstance().showUI(BackPackScene);
        }
        OpenHandBookUI() {
            EffectManager.getInstance().BtnEffect(this.btn_handbook);
            GameUIManager.getInstance().showUI(HandBookView);
        }
        SubTakePhotoTime() {
            this.TakePhotoTime -= 1;
            this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
            this.progressbar_TakePhoto.value = 1 - (this.TakePhotoTime / StaffManager.getInstance().GetTakePhotoTimer());
            if (this.TakePhotoTime <= 0) {
                StaffManager.getInstance().StopTakePhoto();
                this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
                this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
                this.progressbar_TakePhoto.value = 0;
                Laya.timer.clear(this, this.SubTakePhotoTime);
                this.TakePhotoing = true;
                this.SaveInfo(3, GatherStateType.Idle);
            }
        }
        SubpickMoneyTime() {
            this.PickMoneyTime -= 1;
            this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
            this.progressbar_pickMoney.value = 1 - (this.PickMoneyTime / StaffManager.getInstance().GetPickMoneyTimer());
            if (this.PickMoneyTime <= 0) {
                StaffManager.getInstance().StopPickMoney();
                this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
                this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
                this.progressbar_pickMoney.value = 0;
                Laya.timer.clear(this, this.SubpickMoneyTime);
                this.PickMoneying = true;
                this.SaveInfo(2, GatherStateType.Idle);
            }
        }
        StartFlyer() {
            this.Panel_publicity.visible = true;
            SaveManager.getInstance().SetPublicityCache(true);
        }
        StartTakePhoto() {
            this.Panel_TakePhoto.visible = true;
            this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
            this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
            this.progressbar_TakePhoto.value = 0;
            let tp = GameData.RoleInfo;
            if (tp != null) {
                for (let index = 0; index < tp.length; index++) {
                    const info = tp[index];
                    if (info.id != 0 && Staff_Cfg[info.id].jobID == 3 && info.workState == GatherStateType.Collecting) {
                        let t = StaffManager.getInstance().GetTakePhotoTimer() - (Time.serverSeconds - info.workTimeStamp);
                        if (t > 0) {
                            this.TakePhotoTime = t;
                            this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
                            this.progressbar_TakePhoto.value = 1 - (this.TakePhotoTime / StaffManager.getInstance().GetTakePhotoTimer());
                        }
                    }
                }
            }
        }
        StartpickMoney() {
            this.Panel_pickMoney.visible = true;
            this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
            this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
            this.progressbar_pickMoney.value = 0;
            let tp = GameData.RoleInfo;
            if (tp != null) {
                for (let index = 0; index < tp.length; index++) {
                    const info = tp[index];
                    if (info.id != 0 && Staff_Cfg[info.id].jobID == 2 && info.workState == GatherStateType.Collecting) {
                        let t = StaffManager.getInstance().GetPickMoneyTimer() - (Time.serverSeconds - info.workTimeStamp);
                        if (t > 0) {
                            this.PickMoneyTime = t;
                            this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
                            this.progressbar_pickMoney.value = 1 - (this.PickMoneyTime / StaffManager.getInstance().GetPickMoneyTimer());
                        }
                    }
                }
            }
        }
        UpdateTakePhototime() {
            if (this.TakePhotoing) {
                this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
                this.Text_TakePhotoTime.text = Utils.formatStandardTime(this.TakePhotoTime, false);
            }
        }
        UpdatepickMoneytime() {
            if (this.PickMoneying) {
                this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
                this.Text_pickMoneyTime.text = Utils.formatStandardTime(this.PickMoneyTime, false);
            }
        }
        showTip(t) {
            if (this.tishi.visible && t)
                return;
            this.tishi.visible = t;
            if (t) {
                Laya.timer.once(1000, this, () => {
                    this.tishi.visible = false;
                });
            }
        }
        StartorContinue_PickMoney() {
            if (this.PickMoneying) {
                this.PickMoneying = false;
                this.PickMoneyTime = StaffManager.getInstance().GetPickMoneyTimer();
                Laya.timer.loop(1000, this, this.SubpickMoneyTime);
                StaffManager.getInstance().StartPickMoney();
            }
        }
        StartorContinue_TakePhoto() {
            if (this.TakePhotoing) {
                this.TakePhotoing = false;
                this.TakePhotoTime = StaffManager.getInstance().GetTakePhotoTimer();
                Laya.timer.loop(1000, this, this.SubTakePhotoTime);
                StaffManager.getInstance().StartTakePhoto();
            }
        }
        LoadLocalData() {
            let tp = GameData.RoleInfo;
            if (tp != null) {
                for (let index = 0; index < tp.length; index++) {
                    const info = tp[index];
                    if (info.id != 0) {
                        switch (Staff_Cfg[info.id].jobID) {
                            case 1:
                                let propagandist = StaffManager.getInstance().Addpropagandist(info.id, -1);
                                this._isUpgrade(info, propagandist);
                                break;
                            case 2:
                                let Dustman = StaffManager.getInstance().AddDustman(info.id, -1);
                                switch (info.workState) {
                                    case GatherStateType.Idle:
                                        this.PickMoneying = true;
                                        break;
                                    case GatherStateType.Collecting:
                                        this.PickMoneying = false;
                                        Laya.timer.loop(1000, this, this.SubpickMoneyTime);
                                        StaffManager.getInstance().StartPickMoney();
                                        let t = StaffManager.getInstance().GetPickMoneyTimer() - (Time.serverSeconds - info.workTimeStamp);
                                        if (t > 0)
                                            this.PickMoneyTime = t;
                                        break;
                                }
                                this._isUpgrade(info, Dustman);
                                break;
                            case 3:
                                let Cameraman = StaffManager.getInstance().AddCameraman(info.id, -1);
                                switch (info.workState) {
                                    case GatherStateType.Idle:
                                        this.TakePhotoing = true;
                                        break;
                                    case GatherStateType.Collecting:
                                        this.TakePhotoing = false;
                                        Laya.timer.loop(1000, this, this.SubTakePhotoTime);
                                        StaffManager.getInstance().StartTakePhoto();
                                        let t = StaffManager.getInstance().GetTakePhotoTimer() - (Time.serverSeconds - info.workTimeStamp);
                                        if (t > 0)
                                            this.TakePhotoTime = t;
                                        break;
                                }
                                this._isUpgrade(info, Cameraman);
                                break;
                        }
                    }
                }
            }
        }
        _isUpgrade(data, staff) {
            if (data.updateState == 1) {
                let overTime = Time.serverSeconds - data.updateTimeStamp;
                let cd = staff._tableData.cd * 60;
                if (cd - overTime > 0) {
                    staff.ChangUpGrade();
                    staff.SetupgradeTime(cd - overTime);
                }
                else {
                    staff.upgrade(staff.GetId() + 1);
                    data.updateState = 0;
                    data.updateTimeStamp = 0;
                    GameData.RoleInfo = data;
                    SaveManager.getInstance().SetStaffCache(data);
                }
            }
        }
        SaveInfo(type, state) {
            let array = GameData.RoleInfo;
            for (const key in array) {
                if (array.hasOwnProperty(key)) {
                    const info = array[key];
                    if (info.id != 0) {
                        if (Staff_Cfg[info.id].jobID == type) {
                            info.workState = state;
                            switch (state) {
                                case GatherStateType.Idle:
                                    info.workTimeStamp = 0;
                                    break;
                                case GatherStateType.Collecting:
                                    info.workTimeStamp = Time.serverSeconds;
                                    break;
                            }
                            GameData.RoleInfo = array;
                            SaveManager.getInstance().SetStaffCache(array);
                        }
                    }
                }
            }
        }
        setMianBtnShow(b) {
            this.num_star.visible = b;
            this.num_star_img.visible = b;
            this.num_gold.visible = b;
            this.num_gold_img.visible = b;
            this.btn_rank.visible = b;
            this.btn_handbook.visible = b;
            this.btn_time.visible = b;
            if (this.goodsEffect) {
                this.goodsEffect.setShow(b);
            }
        }
        setGoods(b, time, goodsId, goodsNum) {
            this.btn_time_bg.skin = "gameui/main/img-kaixiangzi1.png";
            this.goods_title_tips.skin = "";
            this.goods_item.visible = false;
            if (b) {
                this.goods_item.disabled = false;
                this.btn_time_bg.disabled = false;
                this.goodsEffect = EffectManager.getInstance().PlayOnceEffect(this.btn_time_effect, 7, 1, true);
                GameScene.instance.eventMainUIShow();
            }
            else {
                this.goods_item.disabled = true;
                this.btn_time_bg.disabled = true;
                this.goodsEffect && this.goodsEffect.Destroy();
            }
            if (goodsId) {
                this.goods_item.skin = Succulent_Cfg[goodsId].striconurl;
                this.curGetGoodsId = goodsId;
                this.curGetGoodsNum = goodsNum;
            }
            if (time) {
                this.backTime.text = Utils.TimeToTimeFormat(time);
            }
        }
        goodsClick() {
            EffectManager.getInstance().BtnEffect(this.btn_time_bg);
            if (Laya.Browser.onWeiXin) {
                let _that = this;
                MyPlayer.wxSDK.Share(Share_Cfg[5]["strtitle"], { title: Share_Cfg[5]["strdescribe"], imageUrl: Share_Cfg[5]["strpic"], query: "" }, {
                    successFn: function () {
                        _that.setGoods(false);
                        _that.goodTween1();
                    },
                    failFn() {
                    }
                });
            }
            else {
                this.setGoods(false);
                this.goodTween1();
            }
            DataLog.getInstance().LogVideo_log(GamePoint.Get);
        }
        goodTween1() {
            let img = new Laya.Image(this.goods_item.skin);
            let point = this.goods_item.parent.localToGlobal(new Laya.Point(this.goods_item.x, this.goods_item.y));
            img.x = point.x;
            img.y = point.y;
            img.width = this.goods_item.width;
            img.height = this.goods_item.height;
            Laya.stage.addChild(img);
            Laya.Tween.to(img, {
                y: img.y - 60
            }, 100, Laya.Ease.elasticInOut, Laya.Handler.create(this, this.goodTween1Finish, [img]));
        }
        goodTween1Finish(target) {
            Laya.timer.once(500, this, () => {
                this.goodTween2(target);
            });
        }
        goodTween2(target) {
            let target_point = new Laya.Point(this.btn_backpack.x, this.btn_backpack.y);
            Laya.Tween.to(target, {
                x: target_point.x, y: target_point.y
            }, 300, null, Laya.Handler.create(this, this.goodTween2Finish, [target]));
        }
        goodTween2Finish(target) {
            target.visible = false;
            target.destroy();
            this.goodsInit.startTime();
            BagSystem.getInstance().addItem(this.curGetGoodsId, this.curGetGoodsNum);
        }
    }

    class StaffTimeView extends ui.view.StaffTimeViewUI {
        constructor() {
            super();
            this._goodData = [];
            this._goodIndex = 0;
            this.timeVoid = null;
            this.createView(Laya.loader.getRes("view/StaffTimeView.json"));
        }
        onEnable() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.onInit();
            this.onEvent();
        }
        onDisable() {
            this.offAll();
            this.ui_start_button.off(Laya.Event.CLICK, this, this.SureClick);
        }
        onInit() {
        }
        onEvent() {
            this.ui_start_button.on(Laya.Event.CLICK, this, this.SureClick);
        }
        SetScrollBar() {
            this.ui_stafftime_scroll.changeHandler = new Laya.Handler(this, this.onChange);
        }
        onChange() {
            this.ui_stafftime_font.text = "采集" + Math.floor(this.ui_stafftime_scroll.value) * Constant_Cfg[11]["value"] + "分钟";
        }
        SetDataID(index = -1) {
            if (index == -1)
                return;
            this._goodIndex = index;
            let time = 0;
            switch (Staff_Cfg[index]["jobID"]) {
                case 1:
                    time = Staff_Cfg[index]["propaganda"];
                    break;
                case 2:
                    time = Staff_Cfg[index]["clean"];
                    break;
                case 3:
                    time = Staff_Cfg[index]["takepicture"];
                    break;
                case 4:
                    time = Staff_Cfg[index]["collectime"];
                    break;
            }
            this.ui_stafftime_scroll.max = time / Constant_Cfg[11]["value"];
            this.ui_stafftime_scroll.min = 1;
            this.ui_stafftime_scroll.value = 1;
            this.ui_stafftime_scroll.tick = 1;
            this.ui_min_time.text = Constant_Cfg[11]["value"] + "分钟";
            this.ui_max_time.text = time / Constant_Cfg[11]["value"] * Constant_Cfg[11]["value"] + "分钟";
            this.ui_staff_image.skin = Staff_Cfg[index].stricon;
            this.la_id.text = Staff_Cfg[index]["lv"];
            this.SetScrollBar();
            this.onChange();
        }
        SureClick() {
            EffectManager.getInstance().BtnEffect(this.ui_start_button);
            StaffManager.getInstance().StartAI(Staff_Cfg[this._goodIndex]["staffID"], this.ui_stafftime_scroll.value * Constant_Cfg[11]["value"] * 60);
            GameUIManager.getInstance().hideUI(StaffTimeView);
        }
    }
    ViewManager.getInstance().SaveViewResUrl(StaffTimeView, [
        { url: "view/StaffTimeView.json", type: Laya.Loader.JSON },
    ]);

    var Sprite3D$a = Laya.Sprite3D;
    var Tween$3 = Laya.Tween;
    var Handler$m = Laya.Handler;
    var Vector3$h = Laya.Vector3;
    var Point$4 = Laya.Point;
    var MouseManager$3 = Laya.MouseManager;
    var Ease = Laya.Ease;
    class CarEditor {
        constructor(scene3d) {
            this._staffList = new Array();
            this._t = null;
            this._seat = new Array();
            this._car = scene3d.getChildByName("bashiche_01");
            this._curPosX = this._car.transform.localPositionX;
            this._door = this._car.getChildByName("bashiche_02");
            this._door.active = false;
            this._camera = scene3d._cameraPool[0];
            this._scene = scene3d;
            for (let index = 1; index < 5; index++) {
                this._seat.push([index, false]);
            }
            return;
        }
        refreshStaff(testcar) {
            this._car.addChild(testcar);
            for (let index = 0; index < this._seat.length; index++) {
                const element = this._seat[index];
                if (!element[1]) {
                    testcar.transform.localMatrix = this._car.getChildByName("point" + element[0]).transform.localMatrix;
                    element[1] = true;
                    testcar.Setseat(element[0]);
                    break;
                }
            }
            testcar.transform.localRotationEulerY = 90;
        }
        InitPos() {
            return this._car.getChildByName("point1").transform.position;
        }
        screenMove(bHome, end) {
            if (this._t) {
                this._t.clear();
            }
            if (this._curPosX > end) {
                this._car.transform.scale = new Vector3$h(-1, 1, 1);
                this._door.transform.scale = new Vector3$h(-1, 1, 1);
            }
            else {
                this._car.transform.scale = new Vector3$h(1, 1, 1);
                this._door.transform.scale = new Vector3$h(1, 1, 1);
            }
            this._door.active = true;
            this._t = Tween$3.to(this._car.transform, { localPositionX: end }, 1000, Ease.cubicOut, Handler$m.create(this, function () {
                this._door.active = false;
                this._t = null;
                if (!bHome) {
                    this._t = null;
                }
            }));
            this._curPosX = end;
        }
        tweenMove() {
            var t;
            t.complete();
        }
        beginDrag(target) {
            if (target.parent instanceof Sprite3D$a && GameScene.instance.curRollIndex == 1) {
                this._dragTarget = target;
                target.playAnimation(CommonDefine.ANIMATION_tuozhuai);
                target.transform.localRotationEulerY = 180;
            }
        }
        endDrag() {
            if (!this._dragTarget)
                return;
            var pos = (this._dragTarget).transform.position;
            this._scene.addChild(this._dragTarget);
            let dataid = this._dragTarget.GetId();
            GameUIManager.getInstance().showUI(StaffTimeView, Laya.Handler.create(this, (view) => {
                view.SetDataID(dataid);
            }));
            this._dragTarget.playAnimation(CommonDefine.ANIMATION_IDLE);
            let id = this._dragTarget.Getseat();
            for (let index = 0; index < this._seat.length; index++) {
                const e = this._seat[index];
                if (e[0] == id) {
                    e[1] = false;
                    break;
                }
            }
            this._dragTarget = null;
            let check = { name: "point1" };
            GEvent.DispatchEvent(GacEvent.OnClickInSceneByGuide, check);
        }
        onDragMove(e) {
            if (!this._dragTarget)
                return;
            var pos = (Utils.screenToWorld(new Point$4(MouseManager$3.instance.mouseX, MouseManager$3.instance.mouseY), this._camera, 0, 88.0));
            (this._dragTarget).transform.position = pos;
        }
        canMove() {
            return this._dragTarget == null;
        }
    }

    var Sprite$3 = Laya.Sprite;
    var Handler$n = Laya.Handler;
    var ProgressBar$1 = Laya.ProgressBar;
    class TreeGrowProgressBar extends Sprite$3 {
        constructor() {
            super(...arguments);
            this.GrowStartTime = 0;
            this.GrowTime = 0;
        }
        init(camera, owner = null, data, handler = null) {
            this.sceneCamera = camera;
            this.owner = owner;
            this.callback = handler;
            this.GrowStartTime = data.startTime;
            this.GrowTime = data.growTime;
            this.pointName = data.pointName;
            this.index = data.index;
            if (!this.progress) {
                Laya.loader.load(["gameui/flowerstate/progress.png", "gameui/flowerstate/progress$bar.png"], Handler$n.create(this, function () {
                    this.progress = new ProgressBar$1("gameui/flowerstate/progress.png");
                    this.progress.width = 160;
                    this.progress.height = 26;
                    this.progress.sizeGrid = "0,18,0,18";
                    this.progress.pivot(this.progress.width / 2, this.progress.height / 2);
                    this.addChild(this.progress);
                    this.timeLabel = new Laya.Label(Utils.formatStandardTime(this.GrowTime - (Time.Seconds - this.GrowStartTime), false));
                    this.timeLabel.fontSize = 18;
                    this.timeLabel.align = "center";
                    this.timeLabel.color = "#8d4e10";
                    this.timeLabel.pivot(this.timeLabel.width / 2, this.timeLabel.height);
                    this.addChild(this.timeLabel);
                    this.setPosition();
                    Laya.timer.loop(10, this, this.setPosition);
                    LayerManager.getInstance().downUILayer.addChild(this);
                    this.callback && this.callback.run();
                }));
            }
            else {
                this.setProgress(0);
                Laya.timer.loop(10, this, this.setPosition);
                LayerManager.getInstance().uiLayer.addChild(this);
                this.callback && this.callback.run();
            }
        }
        setProgress(value) {
            this.progress.value = value;
        }
        UpdateProgress() {
            let nPro = (Time.Seconds - this.GrowStartTime) / this.GrowTime;
            this.progress.value = nPro;
            this.timeLabel.text = Utils.format("正在成长 {0}", Utils.formatStandardTime(this.GrowTime - (Time.Seconds - this.GrowStartTime), false));
            this.timeLabel.pivot(this.timeLabel.width / 2, this.timeLabel.height / 2);
            if ((1 - nPro) <= 0) {
                Laya.timer.clear(this, this.setPosition);
                this.destroy(true);
                PotManager.getInstance().UpdateScenePot(this.pointName, this.index);
            }
        }
        setPosition() {
            if (!this.owner)
                return;
            var v2 = Utils.worldToScreen(this.sceneCamera, this.owner.transform.position);
            this.pos(v2.x, v2.y - 90);
            this.UpdateProgress();
        }
        isMove() {
            return this.owner.isMove;
        }
        destroy(destroyChild) {
            this.removeSelf();
            Laya.timer.clear(this, this.setPosition);
        }
    }

    class CheckRed extends Singleton {
        constructor() {
            super();
            this._Time = 0;
            this.CheckList = [
                GatherView,
                StaffView
            ];
            GEvent.RegistEvent(GacEvent.OnUpdate, Laya.Handler.create(this, this.OnUpdate));
        }
        OnUpdate() {
            if (this._Time + Time.delta > 1000) {
                GameScene.instance.oArrow[0].active = this.CheckGather();
                GameScene.instance.oArrow[1].active = this.CheckStaff();
            }
            else {
                this._Time += Time.delta;
            }
        }
        CheckStaff() {
            let _value = [];
            let idunm = Utils.GetTableLength(Staff_Cfg);
            let staffunm = Staff_Cfg[idunm].staffID;
            for (let i = 1; i <= staffunm; i++) {
                for (let j = 1; j <= idunm; j++) {
                    if (Staff_Cfg[j]["staffID"] == i) {
                        _value.push(j);
                        break;
                    }
                }
            }
            let value = GameData.RoleInfo;
            if (value) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["id"] == 0) {
                        if (Staff_Cfg[_value[i]]["unlockstar"] <= Player.getInstance().nStar
                            && Staff_Cfg[_value[i]]["hiregold"] <= Player.getInstance().nGold) {
                            return true;
                        }
                    }
                    else {
                        if (value[i]["updateState"] == 0
                            && Staff_Cfg[value[i]["id"]]["Upgold"] <= Player.getInstance().nGold) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        CheckGather() {
            let values = GameData.RoleInfo;
            let lv = SaveManager.getInstance().GetCache(ModelStorage.GatherLV);
            if (lv == null) {
                lv = 1;
            }
            if (values && lv) {
                if (lv < Collection_station_Cfg[lv]["lvup"]
                    && Collection_station_Cfg[lv]["upgold"] <= Player.getInstance().nGold) {
                    return true;
                }
            }
            return false;
        }
    }

    var Handler$o = Laya.Handler;
    var Vector3$i = Laya.Vector3;
    var MouseManager$4 = Laya.MouseManager;
    var Vector2$5 = Laya.Vector2;
    var PhysicsCollider$3 = Laya.PhysicsCollider;
    var Tween$4 = Laya.Tween;
    class GameScene extends SceneBase {
        constructor() {
            super();
            this.curSceneIndex = 0;
            this.rollVector = [59, 40.04, 23.36, 7.68, -8, -23.68];
            this.homeIndex = 3;
            this.curRollIndex = 3;
            this.worldRollIndex = 2;
            this.oArrow = [];
            this.playEffectCallback = null;
        }
        static get instance() {
            if (!GameScene._instance)
                GameScene._instance = new GameScene();
            return GameScene._instance;
        }
        onEnable() {
            super.onEnable();
            LayerManager.getInstance().downUILayer.visible = true;
            LayerManager.getInstance().topUILayer.visible = true;
            Laya.stage.on(CommonDefine.EVENT_ROLL_SCREEN, this, this.rollScreen);
            GEvent.RegistEvent(CommonDefine.EVENT_UNLOCK_PLANT, Laya.Handler.create(this, this.unlockPlant));
        }
        onDisable() {
            super.onDisable();
            BottomCreater.getInstance().clearSelectBottom();
            LayerManager.getInstance().downUILayer.visible = false;
            LayerManager.getInstance().topUILayer.visible = false;
            Laya.stage.off(CommonDefine.EVENT_ROLL_SCREEN, this, this.rollScreen);
        }
        switchViewByIndex(index) {
            if (index < 0)
                return;
            if (index >= this.rollVector.length)
                return;
            if (this.curRollIndex == index)
                return;
            if (this.curRollIndex > index) {
                this.curRollIndex = index - 1;
                this.rollScreen("left");
            }
            else {
                this.curRollIndex = index + 1;
                this.rollScreen("right");
            }
        }
        getBottomByPoint(name) {
            var tar = PotManager.getInstance().GetPointCurPot(name);
            if (!tar)
                return null;
            if (tar.State != PotState.Ripe)
                return null;
            return tar;
        }
        onDragBegin() {
            var outHitResult = Utils.rayCastOne(new Vector2$5(MouseManager$4.instance.mouseX, MouseManager$4.instance.mouseY), this.scene3d, this.camera);
            if (outHitResult.succeeded) {
                GameUIManager.getInstance().showUI(LoadingScenes1);
                SceneManager.getInstance().openScene(DIYScene.instance);
            }
        }
        onDragMove() {
        }
        onDragUp() {
        }
        showScene(param, handler) {
            super.showScene(param, handler);
            if (!this.scene3d) {
                Laya.loader.create("res/scene/mainscene/Scenes_huayuan.ls", Handler$o.create(this, this.onSceneLoaded, [handler]));
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
        hideScene() {
            super.hideScene();
            GameUIManager.getInstance().hideUI(MainUIScene);
        }
        AddArrow() {
            let oPoint = this.scene3d.getChildAt(0).getChildAt(0).clone();
            this.scene3d.getChildAt(4).getChildAt(4).addChild(oPoint);
            oPoint.transform.localPosition = new Laya.Vector3(0, 0, 0);
            oPoint.transform.localPositionY = 8;
            oPoint.active = false;
            oPoint.transform.localScaleX = 0.03;
            oPoint.transform.localScaleY = 0.03;
            oPoint.transform.localScaleZ = 0.03;
            this.oArrow.push(oPoint);
            let oPoint1 = this.scene3d.getChildAt(0).getChildAt(0).clone();
            this.scene3d.getChildAt(4).getChildAt(3).addChild(oPoint1);
            oPoint1.transform.localPosition = new Laya.Vector3(0, 0, 0);
            oPoint1.transform.localPositionY = 7;
            oPoint1.active = false;
            oPoint1.transform.localScaleX = 0.02;
            oPoint1.transform.localScaleY = 0.02;
            oPoint1.transform.localScaleZ = 0.02;
            this.oArrow.push(oPoint1);
        }
        onSceneLoaded(handler, scene3d) {
            this.addChild(scene3d);
            this.scene3d = scene3d;
            this.AddArrow();
            if (!this.camera) {
                this.camera = scene3d.getChildByName("Main Camera (1)");
                this.addBloom();
                this.camera.orthographicVerticalSize = this.camera.orthographicVerticalSize + 5;
                CollectMapDataManager.getInstance().init(scene3d);
                CollectMapDataManager.getInstance().unLockMapData(1, 1);
                BagSystem.getInstance();
                CheckRed.getInstance();
                this.script3d = this.camera.addComponent(MouseController);
                this.script3d.rotateEnable = false;
                this.script3d.moveEnable = true;
                this.script3d.scaleEnable = false;
                Global.gameCamera = this.camera;
                this.loadPlant();
                this.carEditor = new CarEditor(scene3d);
                GameUIManager.getInstance().showUI(SwitchScene);
                GameUIManager.getInstance().hideTopUI(LoadingScenes1);
            }
            SceneRayChecker.getInstance().initChecker(GameScene.instance);
            Laya.timer.once(1000, this, function () {
                this.createSceneBotany();
            });
            this.OnInit();
            LandManager.getInstance().onInitState(this.camera);
            this.initSceneDecorates();
            GameUIManager.getInstance().showUI(MainUIScene);
        }
        OnInit() {
            PathManager.getInstance().onInit();
            GameData.onInit();
            NpcManager.getInstance().onInit();
            StaffManager.getInstance().onInit();
            Laya.timer.loop(1, this, this.OnUpdate);
            NpcManager.getInstance().initnpcCreater();
        }
        OnUpdate() {
            PathManager.getInstance().onUpdata();
            NpcManager.getInstance().onUpdata();
            StaffManager.getInstance().onUpdata();
        }
        onDestroy() {
            super.onDestroy();
            PathManager.getInstance().onDestroy();
            NpcManager.getInstance().onDestroy();
            StaffManager.getInstance().onDestroy();
        }
        rollScreen(type) {
            if (!this.carEditor.canMove())
                return;
            Laya.stage.event(CommonDefine.EVENT_BEGIN_ROLL);
            var temp;
            if (type == "left") {
                if (this.curRollIndex == this.rollVector.length - 1)
                    return;
                if (this.curRollIndex < 2)
                    this.carEditor.screenMove(this.curRollIndex == this.homeIndex, this.rollVector[this.curRollIndex + 1]);
                this.curRollIndex += 1;
            }
            else {
                if (this.curRollIndex == 0)
                    return;
                if (this.curRollIndex <= 3)
                    this.carEditor.screenMove(this.curRollIndex == this.homeIndex, this.rollVector[this.curRollIndex - 1]);
                this.curRollIndex -= 1;
            }
            console.log("屏幕左右移动", this.curRollIndex, this.worldRollIndex);
            this.eventMainUIShow();
            Tween$4.to(this.camera.transform.position, {
                x: this.rollVector[this.curRollIndex], update: new Handler$o(this, function () {
                    this.camera.transform.position = this.camera.transform.position;
                })
            }, 200, null, Handler$o.create(this, function () {
                GEvent.DispatchEvent(GacEvent.GuideChangePage, this.curRollIndex);
            }));
        }
        eventMainUIShow() {
            if (this.curRollIndex <= this.worldRollIndex - 1) {
                Laya.stage.event(CommonDefine.EVENT_MAIN_UI_SHOW, false);
            }
            else {
                Laya.stage.event(CommonDefine.EVENT_MAIN_UI_SHOW, true);
            }
        }
        createSceneBotany() {
            let potMap = PotManager.getInstance().PotMap;
            for (const key in potMap) {
                var strName = key;
                var tPoint = potMap[key];
                for (const key in tPoint.PointDataList) {
                    this.createPotted(tPoint, "point_" + strName, Number(key));
                }
            }
        }
        createPotted(tPoint, strName, index) {
            if (tPoint && tPoint.PointDataList[index]) {
                let _data = tPoint.PointDataList[index];
                Potted.createByData(_data, Handler$o.create(this, function (name, potted, ang) {
                    potted.transform.rotationEuler = new Vector3$i(0, ang + 180, 0);
                    if (tPoint.PointDataList[index].State == PotState.Ripe && index == tPoint.UseIndex) {
                        var node = this.scene3d.getChildByName("zhongzhidian").getChildByName(name.substr(6, name.length - 1));
                        node.active = false;
                        var node = this.scene3d.getChildByName("point").getChildByName(name.substr(6, name.length - 1));
                        var child = node.getChildAt(0);
                        if (child)
                            child.removeSelf();
                        node.addChild(potted);
                        var boxCollider = node.getComponent(PhysicsCollider$3);
                        if (boxCollider)
                            boxCollider.enabled = false;
                    }
                    if (PotManager.getInstance().PotMap[tPoint.Name].PotList[index]) {
                        PotManager.getInstance().PotMap[tPoint.Name].PotList[index].destroy();
                    }
                    PotManager.getInstance().PotMap[tPoint.Name].PotList[index] = potted;
                    if (tPoint.PointDataList[index].State == PotState.Grow &&
                        index == tPoint.UseIndex) {
                        let nPro = 1 - (Time.Seconds - tPoint.PointDataList[index].GrowStartTime) / tPoint.PointDataList[index].GrowTime;
                        var node = this.scene3d.getChildByName("zhongzhidian").getChildByName(name.substr(6, name.length - 1));
                        node.active = false;
                        if (nPro <= 0) {
                            PotManager.getInstance().UpdateScenePot(tPoint.Name, index);
                            return;
                        }
                        ResourceManager.getInstance().getResource("res/model/Succulent_pengzi_02.lh", Handler$o.create(this, function (ret11) {
                            ret11.transform.rotationEuler = new Vector3$i(0, ret11.transform.rotationEuler.y, 0);
                            var node = this.scene3d.getChildByName("point").getChildByName(strName.substr(6, strName.length - 1));
                            var child = node.getChildAt(0);
                            if (child)
                                child.removeSelf();
                            node.addChild(ret11);
                            var boxCollider = node.getComponent(PhysicsCollider$3);
                            if (boxCollider)
                                boxCollider.enabled = true;
                            let type = strName.substr(21, strName.length - 1);
                            let scale = Constant_Cfg[18].value;
                            ret11.transform.setWorldLossyScale(new Vector3$i(scale[type], scale[type], scale[type]));
                            let data = {};
                            data["startTime"] = tPoint.PointDataList[index].GrowStartTime;
                            data["growTime"] = tPoint.PointDataList[index].GrowTime;
                            data["pointName"] = tPoint.Name;
                            data["index"] = index;
                            let _ProgressBar = new TreeGrowProgressBar();
                            _ProgressBar.init(GameScene.instance.camera, node, data, Handler$o.create(this, function () {
                            }));
                            PotManager.getInstance().PotMap[tPoint.Name].growProBar = _ProgressBar;
                        }));
                    }
                }, [strName]));
            }
        }
        delPotted(tPoint, strName, index) {
            if (tPoint && tPoint.PointDataList[index]) {
                var node = this.scene3d.getChildByName("point").getChildByName(strName.substr(6, strName.length - 1));
                var child = node.getChildAt(0);
                if (child)
                    child.destroy();
                var boxCollider = node.getComponent(PhysicsCollider$3);
                if (boxCollider)
                    boxCollider.enabled = true;
                var node = this.scene3d.getChildByName("zhongzhidian").getChildByName(strName.substr(6, strName.length - 1));
                node.active = true;
            }
        }
        createSceneItem(tableId, pos, price = 1) {
            var item = SceneItemCreater.getInstance().createItem(tableId, pos, price);
        }
        addBloom() {
            Utils.createBloom(this.camera, { intensity: 4, threshold: 1.1, softKnee: 0.5, clamp: 65472, diffusion: 5, anamorphicRatio: 0.0, color: new Laya.Color(1, 0.84, 0, 1), fastMode: true });
        }
        loadPlant() {
            return;
            ResourceManager.getInstance().getResource("res/plant/Succulent_zu01.lh", Handler$o.create(this, function (sp3d) {
                var plantNode = this.scene3d.getChildByName("Duorou_zy_01");
                sp3d.transform.position = plantNode.transform.position;
                sp3d.transform.rotate(new Vector3$i(0, 180, 0), true, false);
                this.scene3d.addChild(sp3d);
                this.script3d.setCameraCenter(sp3d);
            }));
        }
        getScene() {
            return this.scene3d;
        }
        canMove(direction) {
            if (direction == "right") {
                if (this.curSceneIndex > 0) {
                    this.curSceneIndex -= 1;
                    return true;
                }
                else
                    return false;
            }
            else if (direction == "left") {
                if (this.curSceneIndex > 0)
                    return false;
                else {
                    this.curSceneIndex += 1;
                    return true;
                }
            }
            return false;
        }
        get path() {
            return [];
        }
        initSceneDecorates() {
            let arr = BottomCreater.getInstance().getDefaultData();
            BottomCreater.getInstance().createByData(arr, this.scene3d);
            console.log("==============初始化场景装饰==========");
        }
        getBottomByName(strName) {
            let _bottom = this.scene3d.getChildByName("point").getChildByName(strName).getChildAt(0);
            if (_bottom instanceof Bottom) {
                return _bottom;
            }
        }
        unlockPlant(strName) {
            let obj = this.scene3d.getChildByName("point").getChildByName(strName);
            this.playEffect(Sceneeffect_Cfg[1].streffect, obj.transform.position, 2000, false);
        }
        playEffect(url, point, time = 2000, loop = false, _playEffectCallback) {
            let _effect = new Effect3D();
            if (time > 0) {
                _effect.createSceneEffect(url, this.scene3d, point, time, loop, null);
            }
            else {
                _effect.createSceneEffect(url, this.scene3d, point, time, loop, null, (_e) => {
                    this.playFinish(_e);
                });
            }
            this.playEffectCallback = _playEffectCallback;
        }
        playFinish(_effect) {
            let point = Utils.screenToWorld(new Laya.Point(210, 260), this.camera, 10);
            console.log("=============playFinish==============", _effect, point);
            Laya.Tween.to(_effect.transform.position, {
                x: point.x, y: point.y, z: point.z, update: new Laya.Handler(this, () => {
                    if (_effect.transform) {
                        _effect.transform.position = _effect.transform.position;
                    }
                })
            }, 1000, null, Laya.Handler.create(this, this.destroyEffect, [_effect]));
        }
        destroyEffect(_effect) {
            Laya.Tween.clearAll(this);
            _effect.destroy();
            _effect = null;
            this.playEffectCallback && this.playEffectCallback();
        }
    }
    GameScene._instance = null;

    var LoadingSceneUI = ui.view.LoadingSceneUI;
    class LoadingScenes extends LoadingSceneUI {
        onAwake() {
            super.onAwake();
        }
        onEnable() {
            this.ani1.stop();
            this.ani1.play();
            super.onEnable();
        }
        onDisable() {
            super.onDisable();
            this.ani1.stop();
        }
        onDestroy() {
            super.onDestroy();
        }
        onOpened(param) {
            super.onOpened(param);
        }
        onLeftClick(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["right", Global.gameCamera]);
        }
        onRightClick(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_SCREEN, ["left", Global.gameCamera]);
        }
        onExitView(e) {
            Laya.stage.event(CommonDefine.EVENT_ROLL_BACK);
        }
    }

    var PottedListUI = ui.view.PottedListUI;
    class PottedListViewScene extends PottedListUI {
        constructor(pointName) {
            super();
            this._pointName = "";
            this._pointName = pointName;
        }
        onEnable() {
            this.init();
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            Global.sceneLock = true;
        }
        onDisable() {
            Global.sceneLock = false;
        }
        onClose() {
            GameUIManager.getInstance().destroyUI(PottedListViewScene);
        }
        init() {
            this.getListArray();
            this.initList();
            this.bindEvent();
        }
        getListArray() {
            if (!this._pointName)
                return;
            let _data = Succulentpoint_Cfg[this._pointName].flowerpot;
            let _arr = [];
            if (Object.keys(_data).length > 0) {
                for (const key in _data) {
                    if (Object.prototype.hasOwnProperty.call(_data, key)) {
                        const element = _data[key];
                        let eItem = Succulent_Cfg[element];
                        eItem.id = element;
                        _arr.push(eItem);
                    }
                }
            }
            else {
                let eItem = Succulent_Cfg[_data];
                eItem.id = _data;
                _arr.push(eItem);
            }
            this.pottedList.array = _arr;
        }
        bindEvent() {
            this.btn_close.on(Laya.Event.CLICK, this, this.onClose);
        }
        initList() {
            this.pottedList.vScrollBarSkin = "";
            this.pottedList.mouseHandler = Laya.Handler.create(this, this.mouseHandler, null, false);
            this.pottedList.renderHandler = Laya.Handler.create(this, this.renderHandler, null, false);
        }
        renderHandler(cell) {
            let _item = cell.getChildByName("pottedItem");
            _item.skin = cell.dataSource.striconurl;
        }
        mouseHandler(e) {
            if (e.type == Laya.Event.CLICK) {
                this.curPottedId = e.target.dataSource.id;
                Laya.stage.event(CommonDefine.EVENT_CHECKED_POTTED, [this.curPottedId]);
                this.onClose();
            }
        }
    }

    class Debug$1 {
        static Log(msg) {
            if (Debug$1._logLevel >= LogLevel.Log) {
                if (Debug$1._onLog != null) {
                    Debug$1._onLog.setTo(Debug$1._onLog.caller, Debug$1._onLog.method, [msg], false);
                    Debug$1._onLog.run();
                }
            }
        }
        static LogWarning(msg) {
            if (Debug$1._logLevel >= LogLevel.Warning) {
                if (Debug$1._onLogWarning != null) {
                    Debug$1._onLogWarning.setTo(Debug$1._onLogWarning.caller, Debug$1._onLogWarning.method, [msg], false);
                    Debug$1._onLogWarning.run();
                }
            }
        }
        static LogError(msg) {
            if (Debug$1._logLevel >= LogLevel.Error) {
                if (Debug$1._onLogError != null) {
                    Debug$1._onLogError.setTo(Debug$1._onLogError.caller, Debug$1._onLogError.method, [msg], false);
                    Debug$1._onLogError.run();
                }
            }
        }
        static Assert(condition, msg = "") {
            if (Debug$1._onAssert != null) {
                Debug$1._onLogError.setTo(Debug$1._onLogError.caller, Debug$1._onLogError.method, [condition, msg], false);
                Debug$1._onLogError.run();
            }
        }
    }
    Debug$1._logLevel = 100;
    Debug$1.isLock = true;
    Debug$1._onLog = Laya.Handler.create(null, (msg) => {
        if (Debug$1.isLock) {
            console.log(msg);
        }
    });

    class Timer$1 {
        static FrameLoop(delay, caller, method, args, coverBefore) {
            Laya.timer.frameLoop(delay, caller, method, args, coverBefore);
        }
        static FrameOnce(delay, caller, method, args, coverBefore) {
            Laya.timer.frameOnce(delay, caller, method, args, coverBefore);
        }
        static Loop(delay, caller, method, args, coverBefore, jumpFrame) {
            Laya.timer.loop(delay, caller, method, args, coverBefore, jumpFrame);
        }
        static Once(delay, caller, method, args, coverBefore) {
            Laya.timer.once(delay, caller, method, args, coverBefore);
        }
        static Clear(caller, method) {
            Laya.timer.clear(caller, method);
        }
        static ClearAll(caller) {
            Laya.timer.clearAll(caller);
        }
        static SpecialOnce(key, time, callBack) {
            if (!key || !time || !callBack) {
                return;
            }
            if (this._timeSpecial.indexOf(key) != -1) {
                return;
            }
            this._timeSpecial.push(key);
            this.Once(time, null, () => {
                callBack();
                this._timeSpecial.splice(this._timeSpecial.indexOf(key), 1);
            });
        }
    }
    Timer$1._timeSpecial = [];

    let ResUrl;
    let Wx;
    let ShareTitle;
    let ShareUrl;
    let adUnitId_Banner;
    let adUnitId_Excitation;
    let LoginIcon = "";
    let LoginBtnTop = 0;
    let LoginBtnWidth = 0;
    let LoginBtnHight = 0;
    let GameID = "";
    class WxCfgData {
        constructor(cls) {
            this.Initialize(cls);
        }
        Initialize(cls) {
            ResUrl = cls['ResUrl'] || 'https://ssjxzh5-wb-login.gyyx.cn/PHP/wxsdk_duorou.php';
            Wx = window['wx'];
            ShareTitle = cls['ShareTitle'] || '这是小游戏吗？简直不敢相信自己的眼睛！太华丽了!';
            ShareUrl = cls['ShareUrl'] || 'https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/wxsharepicture.jpg';
            adUnitId_Banner = cls['AdUnitId_Banner'];
            adUnitId_Excitation = cls['AdUnitId_Excitation'];
            LoginIcon = cls['LoginIcon'] || "https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/btn_login.png";
            LoginBtnTop = cls['LoginBtnTop'] || 0;
            LoginBtnWidth = cls['LoginBtnWidth'] || 0;
            LoginBtnHight = cls['LoginBtnHight'] || 0;
            GameID = cls['GameID'] || "plant";
        }
    }

    let bannerAd;
    let GameClubButton;
    class WxSDKBase {
        constructor() {
        }
        get getShareTicket() {
            return this._shareTicket;
        }
        Login(cb) {
            Wx.login({
                fail: function (res) {
                    console.log("Get Login Code Fail");
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        Request(url, failCb, successCb, method, data) {
            Wx.request({
                url: url,
                method: method,
                data: data,
                fail: function (res) {
                    failCb && failCb();
                },
                success: function (res) {
                    successCb && successCb(res);
                }
            });
        }
        Share(param, cb) {
            Wx.shareAppMessage({
                title: param['title'] + '',
                imageUrl: param['imageUrl'] + '',
                query: param['query'] + '',
                success(res) {
                    console.log(res);
                    this._shareTicket = res.shareTicket[0];
                    cb.successFn && cb.successFn(res);
                },
                fail(res) {
                    console.log("Try To Share Fail");
                    cb.failFn && cb.failFn();
                }
            });
        }
        updateShareMenu() {
            Wx.updateShareMenu({
                withShareTicket: true,
                success: (res) => { },
                fail: (res) => { },
                complete: (res) => {
                }
            });
        }
        ShowShareMenu(param, cb) {
            Wx.showShareMenu({
                withShareTicket: param['withShareTicket'] || false,
                success() {
                    cb.successFn && cb.successFn();
                },
                fail() {
                    cb.failFn && cb.failFn();
                }
            });
        }
        HideShareMenu(cb) {
            Wx.hideShareMenu({
                success() {
                    cb.successFn && cb.successFn();
                },
                fail() {
                    cb.failFn && cb.failFn();
                }
            });
        }
        GetUserInfo(param, cb) {
            Wx.getUserInfo({
                withShareTicket: param['withShareTicket'] || false,
                lang: param['lang'] || 'en',
                success(res) {
                    cb.successFn && cb.successFn(res);
                },
                fail() {
                    cb.failFn && cb.failFn();
                }
            });
        }
        GetSetting(cb) {
            Wx.getSetting({
                fail: function (res) {
                    console.log('Get User Setting fail');
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        ChooseLocation(cb) {
            Wx.chooseLocation({
                fail: function (res) {
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        ChooseAddress(cb) {
            Wx.chooseAddress({
                fail: function (res) {
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        OpenSetting(cb) {
            Wx.openSetting({
                fail: function (res) {
                    console.log('Open User Setting fail');
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        Authorize(scope, cb) {
            Wx.authorize({
                scope: scope,
                fail: function (res) {
                    console.log('Open User Setting fail');
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        GetLocation(cb) {
            Wx.getLocation({
                fail: function () {
                    console.log('GetLocation fail');
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        SaveImageToPhotosAlbum(filePath, cb) {
            Wx.saveImageToPhotosAlbum({
                filePath: filePath,
                fail: function () {
                    console.log('SaveImageToPhotosAlbum fail');
                    cb.failFn && cb.failFn();
                },
                success: (res) => {
                    cb.successFn && cb.successFn(res);
                }
            });
        }
        WxUpload(key, value, cb) {
            Wx.setUserCloudStorage({
                KVDataList: [{ key: "" + key, value: "" + value }],
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function () {
                    cb.failFn && cb.failFn();
                }
            });
        }
        SendMsgToSub(strData, cb) {
            if (Laya.Browser.onMiniGame) {
                Wx.getOpenDataContext().postMessage({
                    message: strData,
                    success(res) {
                        console.log("错误2  底层成功返回错误");
                        cb.successFn && cb.successFn(res);
                    },
                    fail: function () {
                        cb.failFn && cb.failFn();
                    }
                });
            }
        }
        QR_Code(access_token, cb) {
            let param = {
                access_token: access_token
            };
            Wx.request({
                url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit",
                method: 'POST',
                data: 'access_token=' + param,
                fail: function (res) {
                    cb && cb.failFn(res);
                },
                success: function (res) {
                    console.log("二维码的返回值");
                    console.log(res);
                    cb && cb.successFn(res);
                }
            });
        }
        RemoveData(key, cb) {
            Wx.removeUserCloudStorage({
                keyList: [key],
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function (res) {
                    cb.failFn && cb.failFn(res);
                }
            });
        }
        Establish(adUnitId, width, cb) {
            this.DeleteBanner();
            let screenWidth = Wx.getSystemInfoSync();
            let screenHeight = Wx.getSystemInfoSync();
            bannerAd = Wx.createBannerAd({
                adUnitId: adUnitId || adUnitId_Banner,
                style: {
                    left: 0,
                    top: 0,
                    width: 200,
                    height: 0
                },
                success(res) {
                    cb.successFn && cb.successFn(res);
                }
            });
            bannerAd.onError(res => {
                console.log(res);
                bannerAd.offError();
                cb.errorFn && cb.errorFn(res);
            });
            bannerAd.onResize(res => {
                console.log(res.width, res.height);
                console.log(bannerAd.style.realWidth, bannerAd.style.realHeight);
                bannerAd.style.left = (screenWidth - bannerAd.style.realWidth) / 2;
                bannerAd.style.top = screenHeight - bannerAd.style.realHeight;
            });
            bannerAd.show();
        }
        DeleteBanner() {
            if (bannerAd) {
                bannerAd.destroy();
            }
            console.log("销毁");
        }
        CreateExcitation(adUnitId, cb) {
            this.DeleteBanner();
            let videoAd = Wx.createRewardedVideoAd({
                adUnitId: adUnitId
            });
            videoAd.load()
                .then(() => videoAd.show())
                .catch(err => console.log(err.errMsg));
            videoAd.onLoad((res) => {
                console.log("激励广告 广告加载成功");
                videoAd.offLoad();
            });
            videoAd.onError(res => {
                console.log(res);
                videoAd.offError();
                cb.errorFn && cb.errorFn(res);
            });
            videoAd.onClose(res => {
                if (res && res.isEnded || res == undefined) {
                    cb.successFn && cb.successFn(res);
                }
                else {
                    cb.failFn && cb.failFn(res);
                }
                videoAd.offClose();
            });
        }
        payment(cb) {
            Wx.requestMidasPayment({
                mode: 'game',
                env: "1",
                offerId: '1450016739',
                currencyType: "CNY",
                buyQuantity: 10,
                zoneId: 1,
                platform: "android",
                success() {
                    console.log("支付成功");
                    cb.success && cb.success();
                },
                fail() {
                    console.log("支付失败");
                    cb.fail && cb.fail();
                }
            });
        }
        GetLaunchOptionsSync() {
            return Wx.getLaunchOptionsSync();
        }
        OnShow(cb) {
            Wx.onShow(cb);
        }
        GetSystemInfo(cb) {
            Wx.getSystemInfo({
                success(res) {
                    cb.successFn && cb.successFn(res);
                },
                fail() {
                    cb.failFn && cb.failFn();
                }
            });
        }
        NavigateToMiniProgram(appid, path, extraData, cb) {
            Wx.navigateToMiniProgram({
                appId: appid,
                path: path,
                extraData: extraData,
                success(res) {
                    cb.successFn && cb.successFn(res);
                },
                fail() {
                    cb.failFn && cb.failFn();
                }
            });
        }
        CreateGameClubButtonShow(data) {
            GameClubButton = Wx.createGameClubButton(data);
            GameClubButton.show();
        }
        CreateGameClubButtonHide() {
            GameClubButton.hide();
        }
        CreateGameClubButtonDestroy() {
            GameClubButton.destroy();
        }
    }

    class WxSDKManager {
        constructor(cls) {
            this._openId = '';
            this._sessionKey = '';
            this._settingData = {};
            this._userInfo = null;
            this._location = {};
            this._access_token = '';
            this._allUserData = {
                session_key: '',
                openId: '',
                encryptedData: '',
                iv: '',
                signature: '',
                rawData: ''
            };
            this._supportFunction = {
                "pay": true,
                "share": true,
                "ad": true
            };
            let init = new WxCfgData(cls);
            this._wxSDKBase = new WxSDKBase();
        }
        Login(cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let that = this;
                let loginCallBack = {
                    successFn: function (res) {
                        let urlParam = '?code=' + res.code + '&gameId=' + GameID;
                        that._wxSDKBase.Request(ResUrl + urlParam, () => {
                            cb.failFn && cb.failFn();
                        }, (res) => {
                            res = res['data'];
                            if (res['status'] != 0) {
                                cb.failFn && cb.failFn();
                            }
                            else {
                                that._openId = res['openid'];
                                that._sessionKey = res['session_key'];
                                that._allUserData['openId'] = res['openid'];
                                that._allUserData['session_key'] = res['session_key'];
                                cb.successFn && cb.successFn(res);
                            }
                        }, 'Get', {});
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.Login(loginCallBack);
            }
        }
        Authorize_UserInfo(location, cb) {
            this.GetSetting({
                successFn: (res) => {
                    let w = this._systemInfo.windowWidth || 750;
                    let h = this._systemInfo.windowHeight || 1334;
                    var authSetting = res.authSetting;
                    if (authSetting['scope.userInfo'] == true) {
                        let getUserInfoCallBack = {
                            successFn: function (res) {
                                cb.success && cb.success();
                            },
                            failFn: function () {
                                cb.failFn && cb.failFn();
                            }
                        };
                        let param = {
                            withCredentials: true,
                            lang: ""
                        };
                        this.GetUserInfo(param, getUserInfoCallBack);
                    }
                    else {
                        let userInfoBtn = Laya.Browser.window.wx.createUserInfoButton({
                            type: "text",
                            text: "",
                            style: {
                                left: 0,
                                top: 0,
                                width: Laya.Browser.window.wx.getSystemInfoSync().screenWidth,
                                height: Laya.Browser.window.wx.getSystemInfoSync().screenHeight,
                                lineHeight: 40,
                                backgroundColor: '#00000000',
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 16,
                                borderRadius: 4
                            }
                        });
                        userInfoBtn.onTap((res => {
                            if (res.errMsg == "getUserInfo:ok") {
                                let param = {
                                    withCredentials: true,
                                    lang: ""
                                };
                                let userInfoCallBack = {
                                    successFn: function (res) {
                                        cb.success && cb.success();
                                    },
                                    failFn: function () {
                                        cb.failFn && cb.failFn();
                                    }
                                };
                                this.GetUserInfo(param, userInfoCallBack);
                                userInfoBtn.destroy();
                            }
                            else {
                                console.log("");
                                cb.failFn && cb.failFn();
                                userInfoBtn.destroy();
                            }
                        }));
                    }
                }
            });
        }
        Share(play_name, param, cb) {
            if (Laya.Browser.window.wx) {
                param = param || {
                    title: ShareTitle,
                    imageUrl: ShareUrl
                };
                cb = cb || {};
                let shareCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.Share(param, shareCallBack);
                Laya.timer.once(500, this, function () {
                    cb.successFn && cb.successFn();
                });
            }
            MyPlayer.ReqPlayLog("分享", play_name);
        }
        ShowShareMenu(param, cb) {
            if (Laya.Browser.window.wx) {
                param = param || {};
                cb = cb || {};
                let showShareCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.ShowShareMenu(param, showShareCallBack);
            }
        }
        HideShareMenu(cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let hideShareCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.HideShareMenu(hideShareCallBack);
            }
        }
        GetUserInfo(param, cb) {
            if (this._userInfo != undefined && this._userInfo != null) {
                return this._userInfo;
            }
            if (Laya.Browser.window.wx) {
                param = param || {};
                cb = cb || {};
                let that = this;
                let getUserInfoCallBack = {
                    successFn: function (res) {
                        that._userInfo = res.userInfo;
                        that._allUserData['encryptedData'] = res['encryptedData'];
                        that._allUserData['rawData'] = res['rawData'];
                        that._allUserData['signature'] = res['signature'];
                        that._allUserData['iv'] = res['iv'];
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                return this._wxSDKBase.GetUserInfo(param, getUserInfoCallBack);
            }
            else {
                return {};
            }
        }
        GetSetting(cb) {
            if (Laya.Browser.window.wx) {
                let that = this;
                cb = cb || {};
                let getSettingCallBack = {
                    successFn: function (res) {
                        that._settingData = res['authSetting'];
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.GetSetting(getSettingCallBack);
            }
        }
        ChooseLocation(cb) {
            if (Laya.Browser.window.wx) {
                let that = this;
                cb = cb || {};
                let getSettingCallBack = {
                    successFn: function (res) {
                        that._settingData = res['authSetting'];
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.ChooseLocation(getSettingCallBack);
            }
        }
        OpenSetting(cb) {
            if (Laya.Browser.window.wx) {
                let that = this;
                cb = cb || {};
                let openSettingCallBack = {
                    successFn: function (res) {
                        that._settingData = res;
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.OpenSetting(openSettingCallBack);
            }
        }
        Authorize(scope, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let authorizeCallBack = {
                    successFn: function () {
                        cb.successFn && cb.successFn();
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.Authorize(scope, authorizeCallBack);
            }
        }
        GetLocation(cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let that = this;
                let getLocationCallBack = {
                    successFn: function (res) {
                        that._location = res;
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.GetLocation(getLocationCallBack);
            }
        }
        ChooseAddress(cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let that = this;
                let getLocationCallBack = {
                    successFn: function (res) {
                        that._location = res;
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.GetLocation(getLocationCallBack);
            }
        }
        SaveImageToPhotosAlbum(filePath, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.SaveImageToPhotosAlbum(filePath, saveImageCallBack);
            }
        }
        GetSettingStatus(str) {
            return this._settingData[str] || false;
        }
        WxUpload(key, value, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.WxUpload(key, value, saveImageCallBack);
            }
        }
        SendMsgToSub(strData, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        console.log("错误1  包装成功返回错误");
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.SendMsgToSub(strData, saveImageCallBack);
            }
        }
        CheckData(cb) {
            if (Laya.Browser.window.wx) {
                let that = this;
                let obj = {
                    rawData: this._allUserData["rawData"],
                    signature: this._allUserData["signature"],
                    encryptedData: this._allUserData["encryptedData"],
                    iv: this._allUserData["iv"],
                    session_key: this._allUserData['session_key'],
                    gameId: ""
                };
                this._wxSDKBase.Request(ResUrl, () => {
                    cb.failFn && cb.failFn();
                }, (res) => {
                    if (res.data.status == 0) {
                        that._access_token = JSON.parse('' + res.data.access_token).access_token;
                        console.log('---------CheckData success--------------------', that._access_token);
                    }
                    else {
                        console.log(res.data.msg);
                        cb.failFn && cb.failFn();
                    }
                }, 'Get', obj);
            }
        }
        Qr_Code(cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.QR_Code(this.access_token, saveImageCallBack);
            }
        }
        RemoveData(key, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                this._wxSDKBase.RemoveData(key, cb);
            }
        }
        WxBanner(adUnitId, width, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    },
                };
                this._wxSDKBase.Establish(adUnitId, width, cb);
            }
        }
        DeleteBanner() {
            this._wxSDKBase.DeleteBanner();
        }
        CreateExcitation(adUnitId, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                let saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    },
                    errorFn: function () {
                        cb.errorFn && cb.errorFn();
                    }
                };
                this._wxSDKBase.CreateExcitation(adUnitId, saveImageCallBack);
            }
        }
        WxPayment(data, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                this._wxSDKBase.payment(cb);
            }
        }
        GetLaunchOptionsSync() {
            if (Laya.Browser.window.wx) {
                return this._wxSDKBase.GetLaunchOptionsSync();
            }
        }
        OnShow(cb) {
            this._wxSDKBase.OnShow(cb);
        }
        GetSystemInfo(cb) {
            if (Laya.Browser.window.wx) {
                let that = this;
                let getSystemInfoCallBack = {
                    successFn: function (res) {
                        that._systemInfo = res;
                        if (cb != null)
                            cb.successFn && cb.successFn();
                    }
                };
                this._wxSDKBase.GetSystemInfo(getSystemInfoCallBack);
            }
        }
        get openId() {
            return this._openId || '';
        }
        get userInfo() {
            return this._userInfo || {};
        }
        get location() {
            return this._location || {};
        }
        get access_token() {
            return this._access_token || '';
        }
        get systemInfo() {
            return this._systemInfo;
        }
        NavigateToMiniProgram(appid, path, extraData, cb) {
            let getJumpCallBack = {
                successFn: function (res) {
                },
                failFn: function () {
                }
            };
            this._wxSDKBase.NavigateToMiniProgram(appid, path, extraData, getJumpCallBack);
        }
        GetSupport(i_strFunc) {
            return this._supportFunction[i_strFunc] || false;
        }
        CreateGameClubButtonShow(data) {
            this._wxSDKBase.CreateGameClubButtonShow(data);
        }
        CreateGameClubButtonHide() {
            this._wxSDKBase.CreateGameClubButtonHide();
        }
        CreateGameClubButtonDestroy() {
            this._wxSDKBase.CreateGameClubButtonDestroy();
        }
    }

    class LoginLogic {
        static get inst() {
            if (this._class == null) {
                this._class = new this();
            }
            return this._class;
        }
        OnStart() {
            GEvent.RegistEvent("OnConnecting", Laya.Handler.create(this, this.OnConnecting));
            GEvent.RegistEvent("OnConnected", Laya.Handler.create(this, this.OnConnected));
            GEvent.RegistEvent("OnConnectFail", Laya.Handler.create(this, this.OnConnectFail));
            GEvent.RegistEvent("OnConnectClose", Laya.Handler.create(this, this.OnConnectClose));
            GEvent.RegistEvent("WxEventOnShow", Laya.Handler.create(null, () => {
                Timer$1.Once(2000, this, () => {
                    LoginLogic.inst.OnReConnect();
                });
            }));
        }
        OnDestroy() {
            GEvent.RemoveEvent("OnConnecting", Laya.Handler.create(this, this.OnConnectFail));
            GEvent.RemoveEvent("OnConnected", Laya.Handler.create(this, this.OnConnected));
            GEvent.RemoveEvent("OnConnectFail", Laya.Handler.create(this, this.OnConnectFail));
            GEvent.RemoveEvent("OnConnectClose", Laya.Handler.create(this, this.OnConnectClose));
        }
        StartLogin() {
            let cls = {
                ResUrl: "https://ssjxzh5-wb-login.gyyx.cn/PHP/wxsdk_duorou.php",
                GameID: "plant",
            };
            MyPlayer.wxSDK = new WxSDKManager(cls);
            MyPlayer.wxSDK.ShowShareMenu({ withShareTicket: true });
            if (Laya.Browser.onWeiXin) {
                let loginCallBack = {
                    successFn: function (res) {
                        GameLink.inst.WxCheckServerIp(res["appVersion"]);
                        LoginLogic.inst.Login(MyPlayer.wxSDK.openId);
                    },
                    failFn: function () {
                        Debug$1.Log("登录失败");
                    }
                };
                let userInfoCallBack = {
                    success: function () {
                        Debug$1.Log("授权成功");
                        GEvent.DispatchEvent("WXGetAuthor", true);
                    },
                    failFn: function () {
                        Debug$1.Log("授权失败");
                        GEvent.DispatchEvent("WXGetAuthor", false);
                    }
                };
                MyPlayer.wxSDK.Login(loginCallBack);
                if (MyPlayer.wxSDK.userInfo != null) {
                    MyPlayer.wxSDK.GetSystemInfo();
                    MyPlayer.wxSDK.Authorize_UserInfo({ x: 0, y: 0 }, userInfoCallBack);
                }
            }
            else {
                ViewManager.getInstance().OnStart();
                GameUIManager.getInstance().showUI(Login);
            }
        }
        OnReConnect() {
            RemoteCall.instance.Connect(GameLink.inst.urlParams['selServerIP'], GameLink.inst.urlParams['selServerPort']);
        }
        OnConnecting() {
        }
        OnConnected() {
            this.GWHandShakeRequest();
        }
        OnConnectFail() {
        }
        OnConnectClose() {
        }
        Login(accountName) {
            this._accountName = accountName;
            GameLink.inst.urlParams["openid"] = accountName;
            GameUIManager.getInstance().destroyUI(Login);
            SaveManager.getInstance().InitCache();
            RemoteCall.instance.HttpSend("getservertime", null, this, (data) => {
                Time.SetTimeDifference(data);
            });
        }
        LoadCharListMsg(data) {
            if (data[0] == 1) {
                RemoteCall.instance.Send("K_PlayerCreate");
            }
            else {
                RemoteCall.instance.Send("K_CreateCharReqMsg", this._accountName, 1, 1);
            }
        }
        CreateCharResMsg(code) {
            if (code == 1) {
                Debug$1.LogError("名字重复！");
            }
        }
        GWHandShakeRequest() {
            let str = "tgw_l7_forward\r\nHost:%s\r\n\r\n\0";
            let strTGW = str.replace("%s", GameLink.inst.urlParams['selServerIP'] + ":" + GameLink.inst.urlParams['selServerPort']);
            let byte = new Laya.Byte();
            byte.endian = Laya.Byte.getSystemEndian();
            byte.writeUTFBytes(strTGW);
            RemoteCall.instance.TGW(byte.buffer);
            GameLink.inst.urlParams['openid'] = this._accountName;
            RemoteCall.instance.Send("K_EnterKSReqMsg", GameLink.inst.urlParams, false);
        }
    }
    LoginLogic._class = null;

    var Handler$p = Laya.Handler;
    class Login extends ui.view.Login.LoginViewUI {
        constructor(param) {
            super();
        }
        onEnable() {
            this.init();
            this.bindEvent();
        }
        onDestroy() {
            this.loginBtn.offAll();
        }
        init() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this.loginInput.text = "";
        }
        bindEvent() {
            this.loginBtn.on(Laya.Event.CLICK, this, this.onLoginBtnClick);
        }
        onLoginBtnClick() {
            let _t = this.loginInput.text;
            var sdk = new WxSDKManager({});
            sdk.Login({ successFn: Handler$p.create(this, function (ret) {
                    debugger;
                    LoginLogic.inst.Login(ret.openid);
                }) });
            if (_t == "") {
                return;
            }
            LoginLogic.inst.Login(this.loginInput.text);
        }
    }

    class ClassRegister {
        constructor() {
            this.regClass();
        }
        static get instance() {
            if (!this._instance)
                this._instance = new ClassRegister();
            return this._instance;
        }
        regClass() {
            Laya.ClassUtils.regClass("SwitchScene", SwitchScene);
            Laya.ClassUtils.regClass("LoadingScene", LoadingScenes);
            Laya.ClassUtils.regClass("LoadingScene1", LoadingScenes1);
            Laya.ClassUtils.regClass("DiyView", DiyView);
            Laya.ClassUtils.regClass("DiyToolView", DiyToolView);
            Laya.ClassUtils.regClass("PottedListViewScene", PottedListViewScene);
            Laya.ClassUtils.regClass("TipViewScene", TipViewScene);
            Laya.ClassUtils.regClass("DecorateViewScene", DecorateViewScene);
            Laya.ClassUtils.regClass("MainUIScene", MainUIScene);
            Laya.ClassUtils.regClass("StaffView", StaffView);
            Laya.ClassUtils.regClass("PointFlowerStateView", PointFlowerStateView);
            Laya.ClassUtils.regClass("FlowerpotTipsView", FlowerpotTipsView);
            Laya.ClassUtils.regClass("FlowerpotSelView", FlowerpotSelView);
            Laya.ClassUtils.regClass("GatherView", GatherView);
            Laya.ClassUtils.regClass("StaffCommonView", StaffCommonView);
            Laya.ClassUtils.regClass("StaffTimeView", StaffTimeView);
            Laya.ClassUtils.regClass("DrawModel", DrawModel);
            Laya.ClassUtils.regClass("FlowerRipeTipsView", FlowerRipeTipsView);
            Laya.ClassUtils.regClass("ContentTip", ContentTip);
            Laya.ClassUtils.regClass("BackPackScene", BackPackScene);
            Laya.ClassUtils.regClass("StaffInfo", StaffInfo);
            Laya.ClassUtils.regClass("Illustrated", Illustrated);
            Laya.ClassUtils.regClass("DIYFinishView", DIYFinishView);
            Laya.ClassUtils.regClass("Login", Login);
            Laya.ClassUtils.regClass("HandBookView", HandBookView);
            Laya.ClassUtils.regClass("ItemInfoView", ItemInfoView);
            Laya.ClassUtils.regClass("WXRankView", WXRankView);
            Laya.ClassUtils.regClass("unLockDialog", unLockDialog);
        }
    }

    var Shader3D = Laya.Shader3D;
    class ShaderPreCompile {
        static shaderCompile() {
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 2048, 8716833);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 8716834);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 8716833);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 2048, 25231393);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073741824, 8651280);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 25231393);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 65569);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 12648481);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 16842785);
            Shader3D.compileShader("PARTICLESHURIKEN", 0, 0, 1073743872, 12582913);
        }
    }

    class PreloadManager extends Singleton {
        constructor() {
            super(...arguments);
            this._list = new Array();
        }
        init(callBack) {
            this.preloadSprite3D();
            Laya.loader.load("res/config/preload.json", Laya.Handler.create(this, () => {
                let res = Laya.loader.getRes("res/config/preload.json");
                if (!res || res.data.length == 0) {
                    return;
                }
                Laya.loader.load(res.data, Laya.Handler.create(this, () => {
                    callBack && callBack.run();
                }));
            }));
        }
        preloadSprite3D() {
            Laya.loader.load("res/config/preload3D.json", Laya.Handler.create(this, () => {
                let res = Laya.loader.getRes("res/config/preload3D.json");
                if (!res || res.data.length == 0) {
                    return;
                }
                ResourceManager.getInstance().getResource(res.data, null);
            }));
        }
    }

    class GasToGac {
        static get inst() {
            if (this._class == null) {
                this._class = new this();
            }
            return this._class;
        }
        C_LastError(data) {
            RemoteCall.instance.LastError(data);
        }
        C_ServerTime(data) {
            Time.SetTimeDifference(data[0]);
        }
        C_LoadCharListMsg(data) {
            LoginLogic.inst.LoadCharListMsg(data);
        }
        C_CreateCharResMsg(code) {
            LoginLogic.inst.CreateCharResMsg(code);
        }
        C_EnterMap() {
        }
        C_HeartBeat() {
            RemoteCall.instance.C_HeartBeat();
        }
        OnStart() {
            RemoteCall.instance.RegisterProtocol("C_LastError", this);
            RemoteCall.instance.RegisterProtocol("C_ServerTime", this);
            RemoteCall.instance.RegisterProtocol("C_LoadCharListMsg", this);
            RemoteCall.instance.RegisterProtocol("C_CreateCharResMsg", this);
            RemoteCall.instance.RegisterProtocol("C_SyncPlayerInfoMsg", this);
            RemoteCall.instance.RegisterProtocol("C_EnterMap", this);
            RemoteCall.instance.RegisterProtocol("C_HeartBeat", this);
        }
        OnDestroy() {
            RemoteCall.instance.UnRegisterProtocol("C_LastError", this);
            RemoteCall.instance.UnRegisterProtocol("C_ServerTime", this);
            RemoteCall.instance.UnRegisterProtocol("C_LoadCharListMsg", this);
            RemoteCall.instance.UnRegisterProtocol("C_CreateCharResMsg", this);
            RemoteCall.instance.UnRegisterProtocol("C_SyncPlayerInfoMsg", this);
            RemoteCall.instance.UnRegisterProtocol("C_EnterMap", this);
            RemoteCall.instance.UnRegisterProtocol("C_HeartBeat", this);
        }
    }
    GasToGac._class = null;

    var Handler$q = Laya.Handler;
    class Application extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            ClassRegister.instance;
            ViewManager.getInstance().OnStart();
        }
        onStart() {
            this.LogicStart();
            this.starApp();
        }
        onUpdate() {
            GEvent.DispatchEvent(GacEvent.OnUpdate);
        }
        onLateUpdate() {
        }
        onDestroy() {
            this.LogicDestroy();
        }
        static onLoading() {
            GameUIManager.getInstance().showTopUI(LoadingScenes1);
            Application.joinScene();
        }
        starApp() {
            Laya.stage.frameRate = "slow";
            Laya.loader.load("res/image/loading.jpg", Handler$q.create(this, function () {
                LoginLogic.inst.StartLogin();
            }));
        }
        static joinScene() {
            PreloadManager.getInstance().init(Handler$q.create(this, function () {
                new ConfigManager(Handler$q.create(this, function () {
                    ShaderPreCompile.shaderCompile();
                    GuideManager.getInstance().OnStart();
                    if (GuideManager.getInstance().FreeCurID != -1) {
                        SceneManager.getInstance().openScene(DIYScene.instance, ["defaulsucculent1", 0, 0, true], Handler$q.create(this, function () {
                        }));
                    }
                    else {
                        SceneManager.getInstance().openScene(GameScene.instance);
                    }
                }));
            }));
            return;
        }
        onSceneLoaded(scene3d) {
        }
        LogicStart() {
            GameLink.inst.OnStart();
            RemoteCall.instance.OnStart();
            GasToGac.inst.OnStart();
            LoginLogic.inst.OnStart();
            MyPlayer.OnStart();
            SaveManager.getInstance().OnStart();
        }
        LogicDestroy() {
            GameLink.inst.OnDestroy();
            RemoteCall.instance.OnDestroy();
            GasToGac.inst.OnDestroy();
            LoginLogic.inst.OnDestroy();
            MyPlayer.OnDestroy();
            SaveManager.getInstance().OnDestroy();
            GuideManager.getInstance().OnDestroy();
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("common/Application.ts", Application);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "MainScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var Event$4 = Laya.Event;
    var Keyboard = Laya.Keyboard;
    var Vector3$j = Laya.Vector3;
    class KeyboardTest {
        constructor() {
            Laya.stage.on(Event$4.KEY_DOWN, this, this.onKeyDown);
        }
        onKeyDown(e) {
            switch (e.keyCode) {
                case Keyboard.T:
                    var fff = new Effect3D();
                    fff.createSceneEffect("res/sceneeffect/Effect_plant_unlock.lh", GameScene.instance.scene3d, new Vector3$j(0, 0, 0));
                    break;
                case Keyboard.U:
                    GameScene.instance.switchViewByIndex(2);
                    break;
                case Keyboard.I:
                    var d = GameScene.instance.scene3d.getChildByName("defaulsucculent12");
                    debugger;
                    break;
                case Keyboard.O:
                    break;
                case Keyboard.Q:
                    break;
                case Keyboard.W:
                    break;
                case Keyboard.E:
                    break;
                case Keyboard.R:
                    break;
                case Keyboard.F1:
                    Player.getInstance().refreshGold(99999999);
                    break;
                case Keyboard.F2:
                    Player.getInstance().refreshStar(99999999);
                    break;
                case Keyboard.L:
                    break;
            }
        }
    }

    var Handler$r = Laya.Handler;
    var Vector3$k = Laya.Vector3;
    var ShadowMode$1 = Laya.ShadowMode;
    class ViewScene extends SceneBase {
        constructor() {
            super();
        }
        static get instance() {
            if (!ViewScene._instance)
                ViewScene._instance = new ViewScene();
            return ViewScene._instance;
        }
        showScene(param, handler) {
            super.showScene(param, handler);
            if (!this.scene3d || !this.sceneLoaded) {
                Laya.loader.create("res/scene/viewscene/Scenes_duorou.ls", Handler$r.create(this, this.onSceneLoaded, [handler]));
            }
            else {
                this.addChild(this.scene3d);
            }
        }
        onSceneLoaded(handler, scene3d) {
            this.addChild(scene3d);
            if (!this.camera) {
                this.light = scene3d.getChildByName("Spot Light (1)");
                this.ground = scene3d.getChildByName("Object").getChildByName("dimian");
                this.ground.meshRenderer.receiveShadow = true;
                this.camera = scene3d._cameraPool[0];
                this.script3d = this.camera.addComponent(MouseController);
                this.scene3d = scene3d;
                this.script3d.rotateEnable = true;
                this.script3d.moveEnable = false;
                this.script3d.scaleEnable = true;
                Utils.createBloom(this.camera, { intensity: 4, threshold: 1.1, softKnee: 0.5, clamp: 65472, diffusion: 5, anamorphicRatio: 0.0, color: new Laya.Color(1, 0.84, 0, 1), fastMode: true });
                this.loadPlant();
            }
            else {
                Laya.timer.once(2000, this, function () {
                    GameUIManager.getInstance().hideUI(LoadingScenes);
                });
            }
        }
        loadPlant() {
            Laya.loader.create("res/plant/Succulent_zu01.lh", Handler$r.create(this, function (sp3d) {
                sp3d = sp3d.clone();
                sp3d.transform.position = new Vector3$k(0, -0.2, 0);
                sp3d.transform.rotationEuler = new Vector3$k(0, 0, 0);
                this.scene3d.addChild(sp3d);
                Utils.setMeshCastShadow(sp3d, true);
                this.script3d.setCameraCenter(sp3d);
                this.script3d.setTarget(sp3d);
                this.light.shadowMode = ShadowMode$1.Hard;
                this.light.shadowDistance = 4;
                this.light.shadowResolution = 1024;
                this.light.shadowDepthBias = 1.0;
                this.light.shadowStrength = 0.6;
                this.light.shadowNearPlane = 0.001;
                Laya.timer.once(2000, this, function () {
                    GameUIManager.getInstance().hideUI(LoadingScenes);
                    GameUIManager.getInstance().showUI(DiyChangePot);
                });
            }));
        }
    }
    ViewScene._instance = null;

    var Tween$5 = Laya.Tween;
    var Handler$s = Laya.Handler;
    class CameraAnimation {
        constructor() {
            this.inView = false;
            this.durationTime = 600;
            Laya.stage.on(CommonDefine.EVENT_CLICK_TARGET, this, this.beginView);
            Laya.stage.on(CommonDefine.EVENT_ROLL_BACK, this, this.endView);
        }
        beginView() {
            GameUIManager.getInstance().showUI(LoadingScenes);
            SceneManager.getInstance().openScene(ViewScene.instance);
            Laya.stage.event(CommonDefine.EVENT_BEGIN_VIEW);
            return;
            if (this.isMoving || this.nearView)
                return;
            console.log("beginview!!");
            Laya.stage.event(CommonDefine.EVENT_BEGIN_VIEW);
            this.isMoving = true;
            var camera = GameScene.instance.camera;
            this.mouseScript = camera.getComponent(MouseController);
            this.mouseScript.moveEnable = false;
            this.mouseScript.rotateEnable = true;
            this.mouseScript.scaleEnable = true;
            this.position = camera.transform.position.clone();
            this.test = camera.transform.rotation.clone();
            this.camera = camera;
            console.log("--position");
            console.log(this.position);
            console.log("--parent rotation");
            console.log(this.rotation);
            console.log("--rotation");
            console.log(this.test);
            this.qu = camera.transform.worldMatrix.clone();
            var cameraNode = GameScene.instance.getScene().getChildByName("Camera_node");
            var pos = cameraNode.transform.position.clone();
            var rot = cameraNode.transform.rotationEuler.clone();
            this.size = camera.orthographicVerticalSize;
            Tween$5.to(this.camera.transform.position, {
                x: pos.x, y: pos.y, z: pos.z, update: new Handler$s(this, function () {
                    this.camera.transform.position = this.camera.transform.position;
                })
            }, this.durationTime);
            Tween$5.to(this.camera.parent.transform.rotationEuler, {
                x: rot.x, y: rot.y, z: rot.z, update: new Handler$s(this, function () {
                    this.camera.transform.rotationEuler = this.camera.transform.rotationEuler;
                })
            }, this.durationTime);
            Tween$5.to(this.camera, { orthographicVerticalSize: 5 }, this.durationTime, null, new Handler$s(this, function () {
                this.nearView = true;
                this.isMoving = false;
            }));
        }
        endView() {
            SceneManager.getInstance().openScene(GameScene.instance);
            Laya.stage.event(CommonDefine.EVENT_END_VIEW);
            return;
            if (this.isMoving)
                return;
            Laya.stage.event(CommonDefine.EVENT_END_VIEW);
            this.isMoving = true;
            this.mouseScript.moveEnable = true;
            this.mouseScript.rotateEnable = false;
            this.mouseScript.scaleEnable = false;
            Tween$5.to(this.camera.transform.position, {
                x: this.position.x, y: this.position.y, z: this.position.z, update: new Handler$s(this, function () {
                    this.camera.transform.position = this.camera.transform.position;
                })
            }, this.durationTime, null, Handler$s.create(this, function () {
                console.log("position");
                console.log(this.camera.transform.position);
            }));
            if (this.camera.parent.transform.rotation.x != this.rotation.x || this.camera.parent.transform.rotation.y != this.rotation.y ||
                this.camera.parent.transform.rotation.z != this.rotation.z || this.camera.parent.transform.rotation.w != this.rotation.w) {
                Tween$5.to(this.camera.parent.transform.rotation, {
                    x: this.rotation.x, y: this.rotation.y, z: this.rotation.z, w: this.rotation.w, update: new Handler$s(this, function () {
                        this.camera.parent.transform.rotation = this.camera.parent.transform.rotation;
                    })
                }, this.durationTime, null, Handler$s.create(this, function () {
                    console.log("parent rotation");
                    console.log(this.camera.parent.transform.rotation);
                }));
                Tween$5.to(this.camera.transform.rotation, {
                    x: this.test.x, y: this.test.y, z: this.test.z, w: this.test.w, update: new Handler$s(this, function () {
                        this.camera.transform.rotation = this.camera.transform.rotation;
                    })
                }, this.durationTime, null, Handler$s.create(this, function () {
                    console.log("rotation");
                    console.log(this.camera.transform.rotation);
                }));
            }
            Tween$5.to(this.camera, { orthographicVerticalSize: this.size }, this.durationTime, null, new Handler$s(this, function () {
                this.nearView = false;
                this.isMoving = false;
                console.log("---------------  orthographicVerticalSize");
                console.log(this.camera.orthographicVerticalSize);
            }));
        }
        rollScreen(direction, camera) {
            if (SceneRayChecker.getInstance().disabledHit)
                return;
            if (direction == "right" && GameScene.instance.canMove("right")) {
                Tween$5.to(camera.transform.position, {
                    x: 9.89, update: new Handler$s(this, function () {
                        camera.transform.position = camera.transform.position;
                    })
                }, 200);
            }
            else if (direction == "left" && GameScene.instance.canMove("left")) {
                Laya.stage.event(CommonDefine.EVENT_BEGIN_ROLL);
                Tween$5.to(camera.transform.position, {
                    x: -7.76, update: new Handler$s(this, function () {
                        camera.transform.position = camera.transform.position;
                    })
                }, 200);
            }
        }
    }

    var URL = Laya.URL;
    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (Laya.Browser.onWeiXin)
                URL.basePath = "https://game-yxy.gyyx.cn/plant/wx_develop/v0.5.4.3/";
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            new CameraAnimation();
            new KeyboardTest();
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map
