import { PathManager } from "../../manager/PathManager";
import Vector3 = Laya.Vector3;
import Handler = Laya.Handler;
import { CommonDefine } from "../../common/CommonDefine";
import { GrassManager } from "../../manager/GrassManager";
import { Tree } from "../item/Tree";
import GameScene from "../scene/GameScene";
import { GameData } from "../data/GameData";
import { Staff_Cfg } from "../../manager/ConfigManager";

export enum CollectAIState{
     defult,
     to,
     find
}

export enum GatherStateType {
    Idle,      //闲置
    Collecting,      //工作
    Rest,       //休息去了
    Receiving,   //待收货
}

export class CollectAI //extends Script3D 
{
    private character:any;
    private collectPath:Array<Vector3>;
    private curState:CollectAIState = CollectAIState.defult; 
    private CurIndex:number = 0;
    
    constructor(ower:any) 
    {
        this.character = ower;
        this.collectPath = new Array<Vector3>();
    }

    public beginCollect():void
    {
        //this.ChangState(CollectAIState.to);
        this.WalkOn(1);
    }

    public stopCollect():void
    {
        //this.ChangState(CollectAIState.defult);
        this.character.stopMove();
        this.CurIndex = 0;
        Laya.timer.clearAll(this);
    }

    private UpdateCollectPoint():void
    {
        let data = this.character.getFindItemData();
        if (!data["area"] || !data["itemId"]  ||  !data["pos"] ) 
        {
            this.WalkOn(this.getNextIndex(this.CurIndex));
            return; 
        }

        if (this.CurIndex == data["area"]) 
        {
            this.WalkToCollectPoint(data);   
        }
        else
        {
            let path:Array<Vector3> = new Array<Vector3>();
            for (let i = 0; i < 10; i++) 
            {
                this.CurIndex = this.getNextIndex(this.CurIndex);
                let p = PathManager.getInstance().getCollectPathByName(this.CurIndex.toString());
                path=path.concat(p);    
                if (this.CurIndex == data["area"]) 
                    break;
            }
            this.character.moveTo(path, Handler.create(this, ()=> {
                this.WalkToCollectPoint(data);  
            })) 
        }     
    }

    /**
     * 走到采集点采集  采集完继续走
     * @param data 
     */
    private WalkToCollectPoint(data:any):void
    {
        if (!data["itemId"]  ||  !data["pos"] ) 
        {
            this.WalkOn(this.getNextIndex(this.CurIndex));
            debugger;
            return; 
        }
        let tree = this.CreatTree(data["itemId"],data["pos"]);
        this.character.moveTo([data["pos"]], Handler.create(this, ()=> {
            this.character.playAnimation(CommonDefine.ANIMATION_caiji);
            Laya.timer.once(this.character.GetOnceCollectTime(),this,()=>{ 
                tree.destroy();
                GameData.AddItem(Staff_Cfg[this.character.GetId()].staffID,data["itemId"]);
                this.character.clearFindItemData();
                this.WalkOn(this.getNextIndex(this.CurIndex));
            });
        }))   
    }

    /**
     * 循环走
     */
    private WalkCycle(path:Array<Vector3>):void
    {
        this.character.moveTo(path, Handler.create(this, ()=>{
            this.UpdateCollectPoint();
        }));
    }

    private getNextIndex(curIndex:number):number
    {
        if (curIndex>=10) 
            curIndex = 1;
        else
            curIndex++;

        return curIndex;
    }

    /**
     * 继续走
     * @param curIndex 当前要走的Index
     */
    private WalkOn(curIndex:number):void
    {
        this.CurIndex = curIndex;
        this.collectPath = PathManager.getInstance().getCollectPathByName(this.CurIndex.toString());
        this.WalkCycle(this.collectPath);
    }

    private ChangState(_state:CollectAIState)
    {
        this.curState = _state;
        if (this.character && this.character.getState() == GatherStateType.Collecting) 
        {
            switch (this.curState) 
            {
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
        else
        {
            if (this.curState != CollectAIState.defult) {
                console.log("AI此处是有问题的！！！");
            }
        }
        
    }

    /***
     * 移动状态
     */
    private moveTo():void
    {
        var pos:Vector3 = this.nextPoint();
        this.character.moveTo([pos], Handler.create(this, function () {
            this.character.playAnimation(CommonDefine.ANIMATION_chazhao);
            Laya.timer.once(this.sleepTime, this, function () {
                this.ChangState(CollectAIState.find);
            })
        }))
    }

    /***
     * 采集状态
     */
    private moveFind():void
    {
        let data = this.character.getFindItemData();
        if (data["itemId"] == null || data["itemId"] == undefined ) {
            this.ChangState(CollectAIState.to);
            return;
        }
        if (data["pos"] == null || data["pos"] == undefined ) {
            this.ChangState(CollectAIState.to);
            return;
        }
        let tree =  this.CreatTree(Number(data["itemId"]),data["pos"]);
        this.character.moveTo([data["pos"]], Handler.create(this, function () {
            this.character.playAnimation(CommonDefine.ANIMATION_caiji);
            Laya.timer.once(this.character.GetOnceCollectTime(),this,()=>{ 
                tree.destroy();
                //this.character.AddItem(data["itemId"]);
                GameData.AddItem(Staff_Cfg[this.character.GetId()].staffID,data["itemId"]);
                this.character.clearFindItemData();
                this.ChangState(CollectAIState.to);
            });
        }))
    }

    private nextPoint():Vector3
    {
        let num = GrassManager.getInstance().GetCurrentLv();
        for (let index = 1; index < num+1; index++) 
        {
            this.collectPath.push(PathManager.getInstance().getCollectByName("collectpoint"+index));
        }
        var pos:Vector3 = this.collectPath[Math.floor(Math.random() * this.collectPath.length)];
        let minWidth = -1;  let maxWidth = 1;
        let value_a = Math.random() * (maxWidth - minWidth + 1) + minWidth + "";
        let x = parseInt(value_a);
        let minhigh = -1;   let maxhigh = 1;
        let value_b = Math.random() * (maxhigh - minhigh + 1) + minhigh + "";
        let z = parseInt(value_b);
        return new Vector3(pos.x+x,pos.y,pos.z+z);
    }  

    private CreatTree(id:number,pos:Vector3):Tree
    {
        let tree = new Tree(id);
        GameScene.instance.scene3d.addChild(tree);
        tree.transform.position = pos;
        tree.transform.setWorldLossyScale(new Vector3(0.1,0.1,0.1));// = new Vector3(0.1,0.1,0.1);
        Laya.Tween.to(tree.transform.scale, {x:3,y:3,z:3, update:new Handler(this, function()
            {
                tree.transform.setWorldLossyScale(tree.transform.getWorldLossyScale());// = tree.transform.scale;
            })},1000);

        return  tree;
    }
}