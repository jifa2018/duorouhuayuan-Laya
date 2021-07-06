import { SwitchScene } from "../game/ui/SwitchScene";
import { LoadingScenes } from "../game/ui/LoadingScenes";
import { DiyView } from "../game/ui/DiyView/DiyView";
import { DiyToolView } from "../game/ui/DiyView/DiyToolView";
import { PottedListViewScene } from "../game/ui/PottedListViewScene";
import { TipViewScene } from "../game/ui/Common/TipViewScene";
import { LoadingScenes1 } from "../game/ui/LoadingScenes1";
import { DecorateViewScene } from "../game/ui/Decorate/DecorateVIew";
import { MainUIScene } from "../game/ui/Main/MainUIScene";
import { StaffView } from "../game/ui/Staff/StaffView";
import { PointFlowerStateView } from "../game/ui/FlowerState/PointFlowerStateView";
import { FlowerpotTipsView } from "../game/ui/Flowerpot/FlowerpotTipsView";
import { FlowerpotSelView } from "../game/ui/Flowerpot/FlowerpotSelView";
import { GatherView } from "../game/ui/Gather/GatherView";
import { StaffCommonView } from "../game/ui/Staff/StaffCommonView";
import { StaffTimeView } from "../game/ui/Staff/StaffTimeView";
import { DrawModel } from "../game/ui/DrawModel";
import { FlowerRipeTipsView } from "../game/ui/FlowerState/FlowerRipeTipsView";
import { ContentTip } from "../game/ui/ContentTip/ContentTip";
// import { BackPackScene } from "../game/ui/BackPack/BackPackScene";
import { StaffInfo } from "../game/ui/Common/StaffInfo";
import { Illustrated } from "../game/ui/Illustrated/Illustrated";
import { DIYFinishView } from "../game/ui/DiyView/DIYFinishView";
import { BackPackScene } from "../game/ui/BackPack/BackPackScene";
import { Login } from "../game/ui/Login/Login";
import { HandBookView } from "../game/ui/HandBook/HandBookView";
import { ItemInfoView } from "../game/ui/Common/ItemInfoView";
import { WXRankView } from "../game/ui/rank/WXRankView";
import { unLockDialog } from "../game/ui/Unlock/unLockDialog";
import { IndexDecorateView } from "../game/ui/Decorate/IndexDecorateView";
import { UnlockView } from "../game/ui/Unlock/UnlockView";


export class ClassRegister {

    private static _instance: ClassRegister;

    constructor() {
        this.regClass();
    }

    public static get instance(): ClassRegister {
        if (!this._instance)
            this._instance = new ClassRegister();
        return this._instance;
    }

    private regClass() {
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
        Laya.ClassUtils.regClass("IndexDecorateView", IndexDecorateView);
        Laya.ClassUtils.regClass("UnlockView", UnlockView);
    }

}