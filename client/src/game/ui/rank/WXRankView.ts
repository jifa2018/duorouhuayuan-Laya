import { ui } from "../../../ui/layaMaxUI";
import { GameUIManager } from "../../../manager/GameUIManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { MyPlayer } from "../../MyPlayer";
import { Debug } from "../../../common/Debug";

export class WXRankView extends ui.view.rank.WXRankViewUI {
    constructor() {
        super();
       
    }
    onEnable() {
        this.OnInit()
        this.OnEvent()
    }
    public OnEvent()
    {
        this.btn_click.on(Laya.Event.CLICK, this, this.Close);
    }
    public OnInit()
    {
        this.opendata.size(this.width, this.height)
        let loadRes = [
            "res/atlas/gameui/Rank.atlas",
        ]
        ResourceManager.getInstance().LoadASyn(loadRes, Laya.Handler.create(this, (mapRetRes: Map<string, any>) => {
            this.opendata.postMsg({
                openid:MyPlayer.wxSDK.openId,
            })
            //加载完成
            //使用接口将图集透传到子域
            Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/gameui/Rank.atlas");
        }))
    }
    public Close(){
        this.opendata.postMsg("close");
        GameUIManager.getInstance().destroyUI(WXRankView);
    }
    onDisable() {

    }
    private OnHide()
    {
        
    }
    private OnDestroy()
    {
        
    }
}