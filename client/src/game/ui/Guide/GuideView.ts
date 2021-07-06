import { LayerManager } from "../../../manager/LayerManager";
import { GuideManager } from "./GuideManager";
import { Point } from "../../item/Point";
import { GuideBubView } from "../Common/GuideBubView";
import { GameUIManager } from "../../../manager/GameUIManager";

export class GuideView
{
    private root :Laya.Sprite
    private guideContainer:Laya.Sprite
    private interactionArea:Laya.Sprite
    private hitArea:Laya.HitArea
    private tipContainer:Laya.Sprite
    /**
     *  初始化UI
     * @param dMap 抠图的信息 x,y,width,height
     * @param showbub 是否展示气泡
     * @param showarr 是否展示箭头
     */
    constructor(dMap: Map<any, any>,showbub : any,showarr :any)
    {
        this.root = new Laya.Sprite();
        this.root.name="GuideRoot"
        Laya.stage.addChild(this.root)
        //绘制一个蓝色方块，不被抠图
        var gameContainer:Laya.Sprite = new Laya.Sprite();
        gameContainer.x = 0;
        gameContainer.y = 0;
        gameContainer.width = Laya.stage.width;
        gameContainer.height = Laya.stage.height;
        gameContainer.mouseEnabled = false
        //gameContainer.loadImage("../../res/guide/crazy_snowball.png");
        this.root.addChild(gameContainer)
        
        // 引导所在容器
        this.guideContainer = new Laya.Box();
        this.guideContainer.width = Laya.stage.width
        this.guideContainer.height = Laya.stage.height
        // 设置容器为画布缓存
        this.guideContainer.cacheAs = "bitmap";
        this.root.addChild(this.guideContainer);
        
        //绘制遮罩区，含透明度，可见游戏背景
        var maskArea:Laya.Sprite = new Laya.Sprite();
        maskArea.alpha = 0.5;
        maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        this.guideContainer.addChild(maskArea);
        
        //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        this.interactionArea = new Laya.Sprite();
        //设置叠加模式
        this.interactionArea.blendMode = "destination-out";
        this.guideContainer.addChild(this.interactionArea);
        let x: number = Number(dMap.get("x"))
        let y: number = Number(dMap.get("y"))
        let width: number = Number(dMap.get("width"))
        let height: number = Number(dMap.get("height"))
        this.interactionArea.graphics.drawRect(x, y, width, height, "#ffffff");

        this.hitArea = new Laya.HitArea();
        this.hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        this.hitArea.unHit.drawRect(x, y, width, height, "#fffffff");

        this.guideContainer.hitArea = this.hitArea;
        this.guideContainer.mouseEnabled = true;

        //别删
        this.guideContainer.on(Laya.Event.CLICK,this,function()
        {
            
        })
    
        if(showbub!=null &&  showbub[0])
        {
            this.ShowContent(showbub[1],showbub[2],showbub[4],showbub[5])
        }
        if(showarr!=null && showarr[0])
        {
            this.ShowArrows(showarr[2],showarr[3])
        }
    }
    public DestroyUI()
    {
        Laya.timer.clearAll(this)
        this.root.destroy()
    }
    /**显示文字内容 */
    ShowContent(text: string, posdata: any,color:any,strcolor:string) {
        //底板0
        // let imgbg: Laya.Image = new Laya.Image();
        // imgbg.sizeGrid="20,29,34,49,0"
        // imgbg.skin = "gameui/guide/bubbg.png";
        // imgbg.anchorX = 0.5
        // imgbg.anchorY = 0.5
        // imgbg.x = Number(posdata.x);
        // imgbg.y = Number(posdata.y);
        //this.guideContainer.addChild(imgbg);

        var html: string =""
        var htmlDiv: Laya.Label= new Laya.Label();
        htmlDiv.pos(posdata.x,posdata.y)
        htmlDiv.fontSize = 35
        if(strcolor!="")
        {
            htmlDiv.stroke = 2
            htmlDiv.strokeColor = strcolor
        }
        //htmlDiv.bold = true
        if(text.indexOf("/n")!=-1)
        {
            let texts = text.split('/n')
            let len = 0
            for(let i=0;i<texts.length;i++)
            {
                html += texts[i]+"\n"
                len = len>texts[i].length?len:texts[i].length
            }
            htmlDiv.width = len*25
            htmlDiv.height = 25*texts.length
        }
        else
        {
            htmlDiv.width = text.length*25
            htmlDiv.height = 25 
            html = text
        }
        //imgbg.width = htmlDiv.width+40
        //imgbg.height = htmlDiv.height+70
        htmlDiv.text = html
        htmlDiv.color = color
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

    /**箭头显示 */
    ShowArrows(pos?: any, url?: string): any {
        Laya.loader.load("res/atlas/gameui/guide.atlas", Laya.Handler.create(this, function (aa) 
        {
            let anim = new Laya.Animation();
            anim.name = "ani"
            anim.loadAnimation(url);
            anim.pos(pos.x,pos.y)
            this.guideContainer.addChild(anim);
            anim.play(0, true);
        }))
        
    }
}

export class GuideLabel
{
    private root :Laya.Sprite
    private isaddalpha = false
    constructor(str:string,color:string,strcolor:string,pos:any)
    {
        if(!Laya.stage.getChildByName("GuideLabel"))
        {
            this.root = new Laya.Sprite();
            this.root.name="GuideLabel"
            Laya.stage.addChild(this.root)
        }
        var htmlDiv: Laya.Label= new Laya.Label();
        htmlDiv.wordWrap = false
        htmlDiv.fontSize = 35
       // htmlDiv.bold = true
        if(strcolor!="")
        {
            htmlDiv.stroke = 2
            htmlDiv.strokeColor = strcolor
        }
        htmlDiv.name = "txt"
        htmlDiv.alpha = 1
        htmlDiv.color = color
        htmlDiv.text = str
        htmlDiv.pos(pos.x,pos.y)
        this.root.addChild(htmlDiv)

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

    public DestroyUI()
    {
        Laya.timer.clearAll(this)
        this.root.destroy()
    }
}