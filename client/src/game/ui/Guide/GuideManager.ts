import { Singleton } from "../../../common/Singleton";
import { GEvent } from "../../../common/GEvent";
import { GacEvent } from "../../../common/GacEvent";
import { guide_Cfg, Constant_Cfg, freeGuide_Cfg } from "../../../manager/ConfigManager";
import { Debug } from "../../../common/Debug";
import { Player } from "../../player/Player";
import { SaveManager, ModelStorage } from "../../../manager/SaveManager";
import { GameUIManager } from "../../../manager/GameUIManager";
import { GuideView, GuideLabel } from "./GuideView";
import { LayerManager } from "../../../manager/LayerManager";
import GameScene from "../../scene/GameScene";
import { Utils } from "../../../utils/Utils";
import { ViewManager } from "../../../manager/ViewManager";
import { ClassRegister } from "../../../common/ClassRegister";
import { RemoteCall } from "../../net/RemoteCall";
import { ResUrl } from "../../../platform/WxCfgData";
import { DIYScene } from "../../scene/DIYScene";
import value from "*.glsl";

export class GuideManager extends Singleton
{
    private guideView :GuideView
    private freeGuideLabel :GuideLabel
    private curPage = 0
    private _closeGuide = false

    private _clickname = ""

    /** 当前强制引导 */
    private _guide : GuideInfo
    public get CurGuide()
    {
        return this._guide
    }
    /** 当前非强制引导 */
    private _freeguide: FreeGuideInfo
    public get CurFreeGuide()
    {
        return this._freeguide
    }

    /** 当前强制引导id */
    private _curid = -1;
    public get CurID():number
    {
        return this._curid
    }
    public set CurID(value:number)
    {
        this._curid = value
        this._guide = null
        this.guideView = null
        if(this._curid == -1)
        {
            SaveManager.getInstance().SetGuideID(this._curid)
            return
        }
        // if(this._curid == 3)
        // {
        //     GEvent.DispatchEvent(GacEvent.GuideOver,true)
        // }
        this._guide = new GuideInfo(guide_Cfg[this._curid],this._curid)
        if(this._guide._guidesavepoint == 1)
        {
            SaveManager.getInstance().SetGuideID(this._curid)
        }
    }
    /** 当前非强制引导id */
    private _freecurid = -1
    public get FreeCurID():number
    {
        return this._freecurid
    }
    public set FreeCurID(value:number)
    {
        this._freecurid = value
        this.freeGuideLabel = null
        this._freeguide = null
        if(this._freecurid == -1)
        {
            SaveManager.getInstance().SetFreeGuideID(this._freecurid)
            //开启强制引导 先这么写
            //读取强制引导进度
            if(!SaveManager.getInstance().GetCache(ModelStorage.GuideID))
            {
                SaveManager.getInstance().SetGuideID(1)
                this.CurID = 1
            }
            else
            {
                let id = SaveManager.getInstance().GetCache(ModelStorage.GuideID)
                if(id == -1)
                    return
                if(id== 3)
                {
                    GEvent.DispatchEvent(GacEvent.GuideCreateBubInScene)
                }
                this.CurID = SaveManager.getInstance().GetCache(ModelStorage.GuideID)
            }
            return
        }
        else
        {
            this._freeguide = new FreeGuideInfo(freeGuide_Cfg[this._freecurid],this._freecurid)
        }
        
    }

    public OnStart() {
        //初始化
        if(Constant_Cfg[14].value == 1)
            return
        GEvent.RegistEvent(GacEvent.OnUpdate,Laya.Handler.create(this,this.OnUpdate))
        GEvent.RegistEvent(GacEvent.OnClickInSceneByGuide,Laya.Handler.create(this,this.OnClickInSceneByGuide))
        GEvent.RegistEvent(GacEvent.GuideChangePage,Laya.Handler.create(this,this.GuideChangePage))
        GEvent.RegistEvent(GacEvent.GuideDiyISOver,Laya.Handler.create(this,this.GuideDiyISOver))
        this.curPage = GameScene.instance.curRollIndex
        Laya.stage.on(Laya.Event.GuideUIClick,this,this.UIClick)
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.UIClickDown)
        this.OpenFreeGuide()
    }
    /** 
     * 开启强制引导
     * 强制引导的开启改为手动调用
     */
    private OpenGuide()
    {
        //读取强制引导进度
        if(!SaveManager.getInstance().GetCache(ModelStorage.GuideID))
        {
            SaveManager.getInstance().SetGuideID(1)
            this.CurID = 1
        }
        else
        {
            let id = SaveManager.getInstance().GetCache(ModelStorage.GuideID)
            if(id == -1)
                return
            if(id== 3)
            {
                GEvent.DispatchEvent(GacEvent.GuideCreateBubInScene)
            }
            this.CurID = SaveManager.getInstance().GetCache(ModelStorage.GuideID)
        }
    }
    /**
     * 开启非强制引导
     */
    private OpenFreeGuide()
    {
        //读取非强制引导进度
        if(!SaveManager.getInstance().GetCache(ModelStorage.FreeGuideID))
        {
            SaveManager.getInstance().SetFreeGuideID(1)
            this.FreeCurID = 1
        }
        else
        {
            let id = SaveManager.getInstance().GetCache(ModelStorage.FreeGuideID)
            if(id == -1)
            {
                this.OpenGuide()
            }
            else
            {
                this.FreeCurID = SaveManager.getInstance().GetCache(ModelStorage.FreeGuideID)
            }
            
        }
    }
    /** 强制引导下一步 */
    private NextStep()
    {
        this.ShowNewUI()
        this.guideView.DestroyUI()
        /**特殊处理 12 引导NPC创建气泡 */
        if(this.CurID == 3)
        {
           GEvent.DispatchEvent(GacEvent.GuideCreateBubInScene)
        }
        this.CurID = this._guide._guideNextID
    }
    /** 非强制引导下一步 */
    private FreeNextStep()
    {
        this.freeGuideLabel.DestroyUI()
        this.FreeCurID = this._freeguide._guideNextID
    }
    /** 监听场景中的点击事件 */
    private OnClickInSceneByGuide(rat:any)
    {
        if(this._guide != null && this.guideView != null)
        {
            if(this._guide._guideClickPoint == rat.name)
            {
                this.NextStep()
            }
        }
    }
    /** GuideChangePage */
    private GuideChangePage(index:number)
    {
        this.curPage = index
    }
    /**写死 Diy引导 */
    private GuideDiyISOver(data:any)
    {
        if(this._freeguide != null && this.freeGuideLabel != null && data == 2 && this._freeguide._guideID==data)
        {
            this.FreeNextStep()
        }
        if(this._freeguide != null && this.freeGuideLabel != null && data == 3 && this._freeguide._guideID==data)
        {
            this.FreeNextStep()
        }
        if(this._freeguide != null && this.freeGuideLabel != null && data == 4 && this._freeguide._guideID==data)
        {
            this.FreeNextStep()
        }
        if(this._freeguide != null && this.freeGuideLabel != null && data == 1)
        {
            this.FreeNextStep()
        }
    }
    /** 监听UI中的点击事件 */
    private UIClick(params)
    {
        if(params.target.name == "")return

        if(this._guide == null || this.guideView == null)return

        if(params.target.name != this._clickname) return
        let node = params.target
        while(node)
        {
            if(node.name !=this._guide._guideClickPoint)
            {
                node = node.parent
            }
            else
            {
                console.log(node.name)
                this.NextStep()
                return
            }
        }

        return console.log("点击错误")
    }
    private UIClickDown(params)
    {
        this._clickname = params.target.name
    }

    public OnUpdate()
    {
        //强制引导
        if(this._guide != null && this.guideView == null && !this._closeGuide)
        {
            //检测当前强制引导开启条件是否满足
            for(let i in this._guide._guideActive)
            {
                if(!this.JudgeCondition(Number(i),this._guide._guideActive[i]) && this._curid==this._guide._guideID)
                {
                    console.log(Number(i)+"   "+this.JudgeCondition(Number(i),this._guide._guideActive[i]))
                    return 
                }
            }
            
            //第三步 判断是否需要关闭Top层界面
            if(this._guide._guideCloseAllUI)
            {
                ViewManager.getInstance().DestroyUIByHie(LayerManager.getInstance().topUILayer)
            }
            //第四步 ............慢慢补充

            //最后一步 判断对象类型 锁定目标
            let point = new Laya.Point();
            switch(this._guide._guideClassType)
            {
                case(ClassType.Scene):
                    let scene = GameScene.instance.scene3d
                    if(scene==null)
                        return

                    if(GameUIManager.getInstance().GetOtherUIShow())return

                    if(scene!=null && scene.getChildByName(this._guide._guideNode[0]))
                    {
                        try{
                            let node = this.FindNodeByDir(this._guide._guideNode)
                            let vec =  Utils.worldToScreen(GameScene.instance.camera,node.transform.position)
                            point.x = vec.x - this._guide._guideSize.width/2
                            point.y = vec.y - this._guide._guideSize.height/2
                        }
                        catch
                        {
                            console.log("节点未找到")
                            // Laya.MouseManager.enabled = true
                            // this._closeGuide = true
                            return
                        }

                    }
                    break;

                case(ClassType.UI):
                    //此处涉及到laya的加载模式  目前为内嵌模式
                    if(this._guide._guideUIFindType == 1)
                    {
                        let view = ViewManager.getInstance().GetViewByName(this._guide._guideNode[0])
                        
                        if(GameUIManager.getInstance().GetOtherUIShowTop(view.name))
                        {
                            console.error("引导未找到此UI")
                            return
                        }


                        let node = this.FindNodeByDir2D(this._guide._guideNode,view,1)
                        if(node==null)
                        {
                            console.error("引导未找到节点")
                            return
                        }
                        if(view!=null && node)
                        {
                            point = node.localToGlobal(new Laya.Point(0,0))
                        }
                       
                    }
                    else
                    {
                        let node = this.FindNodeByDir2D(this._guide._guideNode,LayerManager.getInstance().root,1)
                        if(node)
                        {
                            point = node.localToGlobal(new Laya.Point(0,0))
                        }
                    }
                    break;
            }
            if(point== null) //此处判断有问题 先放着
            {
                console.error("节点查找错误")
                return
            }
            //第一步 限制点击 防止乱八七糟的点击
            Laya.MouseManager.enabled = false
            //第二步 翻页 到达指定页签
            GameScene.instance.switchViewByIndex(this._guide._guideTab)
            if(this.curPage!=this._guide._guideTab)
                return
            //条件满足  展示UI
            let map = new Map();
            map.set("x", point.x+this._guide._guideNodeOffset.x);
            map.set("y", point.y+this._guide._guideNodeOffset.y);
            map.set("width", this._guide._guideSize.width);
            map.set("height", this._guide._guideSize.height);
            let isshowbub = this.ISShowBub(point)
            let isshowbarr = this.ISShowArr(point)
            this.guideView = new GuideView(map,isshowbub,isshowbarr);
            Laya.MouseManager.enabled = true;
            this._closeGuide = false
        }

        //非强制引导
        //第一步引导 玩家进入游戏直接打开GIY界面 并开启引导
        if(this._freeguide != null  && this.freeGuideLabel == null)
        {
            for(let i in this._freeguide._guideOpen)
            {
                if(!this.FreeJudgeCondition(Number(i),this._freeguide._guideOpen[i]) && this._freecurid==this._freeguide._guideID)
                {
                    //console.log("非强制引导有条件未满足")
                    return 
                }
            }
            //展示文本
            this.freeGuideLabel = new GuideLabel(this._freeguide._guidestrdeclare,this._freeguide._guideTxtColor,this._freeguide._guideStrokColor,this._freeguide._guidestrpopoexcursion)
        }
        //Update 监控当前非强制引导的完成条件
        if(this._freeguide != null && this.freeGuideLabel != null )
        {
            for(let i in this._freeguide._guideOver)
            {
                if(!this.FreeOverCondition(Number(i),this._freeguide._guideOver[i]) && this._freecurid==this._freeguide._guideID)
                {
                    return 
                }
            }
            this.FreeNextStep()
        }

    }
    public OnDestroy() {
        
    }
    /** 
     * 判断激活条件
     * @param index 类型索引
     * @param value 参数
     *  */
    private JudgeCondition(index:number,value:any)
    {
        value = Number(value)
        switch(index)
        {
            case ActiveType.Stars:
                return this.StarsIsEnough(value)
            case ActiveType.Glod:
                return this.GlodIsEnough(value)
            case ActiveType.ConnNum:
                return this.ConnNumIsEnough(value)
            case ActiveType.ActiveUI:
                return this.UIIsVisiOfName(value)
            default:
            {
                console.log("老哥 程序这边没有你配的激活条件")
                break;
            }
        }
        return false
    }
    /** 
     * 判断非强制引导开启条件
     * @param index 类型索引
     * @param value 参数
     *  */
    private FreeJudgeCondition(index:number,value:any)
    {
        switch(index)
        {
            case FreeGuideOpen.UI:
                return this.UIISVis(value)
            case FreeGuideOpen.Scene:
                return this.ConnNumIsEnough(value)
            case FreeGuideOpen.DiyNum:
                return this.GetDIYNumber(value)
            default:
            {
                console.log("老哥 程序这边没有你配的开启条件")
                break;
            }
        }
        return false
    }
    /** 
     * 判断非强制引导完成条件
     * @param index 类型索引
     * @param value 参数
     *  */
    private FreeOverCondition(index:number,value:any)
    {
        switch(index)
        {
            case FreeGuideOver.DiyNum:
                return this.GetDIYNumber(value)
            case FreeGuideOver.Click:
                return this.ConnNumIsEnough(value)
            default:
            {
                console.log("老哥 程序这边没有你配的开启条件")
                break;
            }
        }
        return false
    }
    /**字符串转数组 */
    private SplitToStr(str:string,sym:string)
    {
        return str.split(sym)
    }
    /** 3D遍历节点 */
    private FindNodeByDir(list:Array<number>)
    {
        let root = GameScene.instance.scene3d
        for(let i in list)
        {
            let node = root.getChildByName(list[i])
            root = node
            if(Number(i) == list.length-1)
            {
                return root
            }
        }
        return null
    }
    /** 2D遍历节点 */
    private FindNodeByDir2D(list:Array<number>,view:any,index:number)
    {
        let node=null
        while(index<list.length)
        {
            let name = list[index]
            node = view.getChildByName(name) as Laya.Box
            view = node 
            index +=1
        }
        return node
    }
    /** 判断是否展示聊天气泡 */
    private ISShowBub(point:Laya.Point)
    {
        let data1 ={x:point.x+this._guide._guideDecOffset.x,y:point.y+this._guide._guideDecOffset.y}
        let data=[false,this._guide._guideDec,data1,null,this._guide._guideTxtColor,this._guide._guideStrokColor]
        if(this._guide._guideDec != "")
        {
            data[0] = true
        }
        return data
    }
    /** 判断是否展示箭头 */
    private ISShowArr(point:Laya.Point)
    {
        let data1 ={x:point.x+this._guide._guideAniOffset.x,y:point.y+this._guide._guideAniOffset.y}
        let data=[false,this._guide._guideAni,data1,this._guide._guideAni]
        if(this._guide._guideAni != "")
        {
            data[0] = true
        }
        return data
    }
    /** 引导完成开启功能 */
    private ShowNewUI()
    {
        if(this._guide._guideOpenUI.length>0)
        {
            for(let i in this._guide._guideOpenUI)
            {
                GEvent.DispatchEvent(GacEvent.OnShowUI_propagandist); 
            }
        }
    }


    /*****************************激活条件判断****************************** */
    /**判断星星是否满足条件 */
    private StarsIsEnough(starnum:number)
    {
        return Player.getInstance().nStar >= starnum ? true : false
    }

    /** 判断金币是否满足条件 */
    private GlodIsEnough(glodnum:number)
    {
        return Player.getInstance().nGold >= glodnum ? true : false
    }
    
    /** 判断登陆次数 */
    private ConnNumIsEnough(connnum:number)
    {
        return SaveManager.getInstance().GetCache(ModelStorage.ConnNum) >= connnum ? true : false
    }

    /** 触发页面 */
    private UIIsVisiOfName(id:number)
    {
        return this.curPage == id ? true :false
    }
    /** Diy数量是否满足 */
    private GetDIYNumber(num:number)
    {
        if(num==DIYScene.instance.getPottedTreeNumber())
        {
            return true
        }
        return false
    }

    /** 判断UI是否开启 */
    private UIISVis(name:string)
    {
        let view = ViewManager.getInstance().GetViewByName(name)
        if(view && view.visible)
        {
            return true
        }
        return false
    }

    /***********************************对外接口************************** */

    /** 判断NPC流程是否可以正常开启 */
    public GetGuideState()
    {
        if(Constant_Cfg[14].value == 0)
            return true
        
        if(this._curid>= 3)
        {
            return true
        }
        return false
    }

}
/**激活条件类型 */
enum ActiveType
{
    Stars =  0, //评星
    Glod = 1, //金币
    ConnNum = 2, //登陆次数
    ActiveUI = 3, //触发页面
}
/** 对象类型 */
enum ClassType
{
    Scene = 1,  //场景
    UI = 2,     //UI
}
class GuideInfo 
{
    /** 引导ID */
    public _guideID = 0
    /** 引导信息 */
    public _guideData:any
    /**节点 这个东西可以是数组 也可以是 字符串*/
    public _guideNode:Array<number>=[]
    /**触发区域大小 */
    public _guideSize = { width : 0, height : 0}
    /** 指示引导*/
    public _guideAni:string
    /** 指示引导偏移量 */
    public _guideAniOffset = { x : 0, y : 0}
    /** 对象类型 1：3D场景,2:2dUI*/
    public _guideClassType = 1
    /** 引导类型 1:强制引导,2：非强制引导*/
    public _guideType = 1
    /** 下一级引导（强制引导） */
    public _guideNextID:number
    /** 激活条件*/
    public _guideActive : { [index: string]: any } = {};
    /** 是否关闭所有界面 1:开启，0:关闭*/
    public _guideCloseAllUI = false
    /** 引导气泡说明文本 */
    public _guideDec = ""
    /** 引导气泡偏移 */
    public _guideDecOffset ={ x : 0, y : 0}
    /** 引导所在页签 */
    public _guideTab = 0
    /** 引导结束触发点 */
    public _guideClickPoint=""
    /** 引导存盘点 */
    public _guidesavepoint = 0
    /** 节点偏移 */
    public _guideNodeOffset = { x : 0, y : 0}
    /** UI节点的查找方式 1:脚本查找 2：全局查找 */
    public _guideUIFindType = 1
    /** 描述颜色 */
    public _guideTxtColor=""
    /** 描述描边颜色 */
    public _guideStrokColor=""
    /** 开启UI功能 */
    public _guideOpenUI = []
    constructor(parameters,ID) 
    {
        this._guideID = ID
        this._guideData = parameters
        this._guideNode=[]
        if(this._guideData["strnode"].indexOf("/") != -1)
        {
            this._guideNode = this._guideData["strnode"].split("/")
        }
        else
        {
            this._guideNode.push(this._guideData["strnode"])
        }
        let guidesize = this._guideData["strregion_size"].split("*")
        this._guideSize.width = Number(guidesize[0])
        this._guideSize.height = Number(guidesize[1])
        this._guideAni = this._guideData["strindicate"]
        let guideoffset = this._guideData["strexcursion"].split(",")
        this._guideAniOffset.x = Number(guideoffset[0])
        this._guideAniOffset.y = Number(guideoffset[1])
        this._guideClassType = this._guideData["object_type"]
        this._guideType = this._guideData["guide_type"]
        this._guideNextID = this._guideData["next"]
        SetGuideActiveInfo(this._guideData["stropen"],this._guideActive)
        this._guideCloseAllUI = this._guideData["Close_all"] == 1 ? false : true

        let txtdata = SplitColorInTsr(this._guideData["strdeclare"])
        this._guideTxtColor = txtdata[0]
        this._guideStrokColor = txtdata[1]
        this._guideDec = txtdata[2]
        
        let guidedecoffset = this._guideData["strpopoexcursion"].split(",")
        this._guideDecOffset.x = Number(guidedecoffset[0])
        this._guideDecOffset.y = Number(guidedecoffset[1])
        this._guideClickPoint = this._guideData["strClickPoint"]
        this._guideTab = this._guideData["paging"]
        this._guidesavepoint = this._guideData["save"]
        let guideNodeOffset = this._guideData["strNodeExcursion"].split(",")
        this._guideNodeOffset.x  = Number(guideNodeOffset[0])
        this._guideNodeOffset.y  = Number(guideNodeOffset[1])
        this._guideUIFindType = this._guideData["uifindtype"]

        if(this._guideData["stropen"].indexOf(",")!=-1)
        {
            let data = this._guideData["stropen"].split(",")
            for(let i in data)
            {
                this._guideOpenUI.push(data[i])
            }
        }
        else
        {
            if(this._guideData["stropen"]!="")
            {
                this._guideOpenUI.push(this._guideData["stropen"])
            }
        }
        
    }
}

/** 非强制引导开启条件 */
enum FreeGuideOpen
{
    UI = 1,//在哪个UI上
    Scene = 2,//在第几个场景上
    DiyNum = 3,//种植数量
    SceneMoney = 4,//场景中显示金币
    ScenePhoto = 5,//场景中显示拍照
    UITime = 6, //UI计时礼包
}
/** 非强制引导完成条件 */
enum FreeGuideOver
{
    DiyNum = 1,//种植数量
    Click = 2,//触发点
}
class FreeGuideInfo
{
    public _guideID = 0
    public _guideData;
    public _guidesave = 0
    /** 对象类型 1：3D场景,2:2dUI*/
    public _guideClassType = 1
    /** 下一级引导 */
    public _guideNextID:number
    /** 引导开启条件 */
    public _guideOpen: { [index: string]: any } = {};
    /** 完成条件 */
    public _guideOver: { [index: string]: any } = {};
    /** 文本偏移 */
    public _guidestrpopoexcursion={ x : 0, y : 0}
    /** 文本 */
    public _guidestrdeclare=""
    /** 文本颜色 */
    public _guideTxtColor=""
    public _guideStrokColor = ""
    constructor(parameters,ID)
    {
        this._guideID = ID
        this._guideData = parameters
        this._guidesave = this._guideData["save"]
        this._guideClassType = this._guideData["object_type"]
        this._guideNextID = this._guideData["next"]
        SetGuideActiveInfo(this._guideData["strtouch_off"],this._guideOver)
        SetGuideActiveInfo(this._guideData["stropen"],this._guideOpen)
        let guidedecoffset = this._guideData["strpopoexcursion"].split(",")
        this._guidestrpopoexcursion.x = Number(guidedecoffset[0])
        this._guidestrpopoexcursion.y = Number(guidedecoffset[1])
        let txtdata = SplitColorInTsr(this._guideData["strdeclare"])
        this._guideTxtColor = txtdata[0]
        this._guideStrokColor = txtdata[1]
        this._guidestrdeclare = txtdata[2]
    }
}
/**************************************工具函数************************************************ */
/**
 * 分割颜色
 * @param str 
 */
export function SplitColorInTsr(str:string)
{
    let list = []
    if(str.indexOf("[")!=-1)
    {
        //先分割
        let otherstrList = str.split("]")

        //文本颜色
        list[0] = otherstrList[0].split("[")[1]
        list[1] = ""
        //描述颜色
        if(otherstrList[1].indexOf("[")!=-1)
        {
            list[1] = otherstrList[1].split("[")[1]
            list[2] = otherstrList[2]
        }
        else
        {
            list[2] = otherstrList[1]
        }
    }
    else
    {
        list[0] = "#FFFFFF"
        list[1] = ""
        list[2] = str
    }
    return list

}
//获取事件
export function SetGuideActiveInfo(str:string,cla:any)
{
    //{1:5000,2:1}
    var first = str.indexOf("{")
    var end = str.indexOf("}")
    var alldata = str.substring(first+1,end)
    var par = alldata.split(",")
    for(let i in par)
    {
        let evedata = par[i].split(":")
        cla[evedata[0]] = evedata[1]
    }
}