import Event = Laya.Event;
import Keyboard = Laya.Keyboard;
import {SceneManager} from "./manager/SceneManager";
import ViewScene from "./game/scene/ViewScene";
import {Global} from "./utils/Global";
import GameScene from "./game/scene/GameScene";
import Vector3 = Laya.Vector3;
import Scene = Laya.Scene;
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import {SwitchScene} from "./game/ui/SwitchScene";
import {ui} from "./ui/layaMaxUI";
import SwitchSceneUI = ui.view.SwitchSceneUI;
import {GameUIManager} from "./manager/GameUIManager";
import {SceneItem} from "./game/item/SceneItem";
import {SaunterNpc} from "./game/npc/SaunterNpc";
import {Effect3D} from "./effect/Effect3D";
import {DIYScene} from "./game/scene/DIYScene";
import { NpcManager } from "./manager/NpcManager";
import {Utils} from "./utils/Utils";
import { VisitorNpc } from "./game/npc/VisitorNpc";
import {Bubble} from "./game/ui/Bubble/Bubble";
import {BubbleCreater} from "./game/ui/Bubble/BubbleCreater";
import {VisitorProgressBar} from "./game/ui/ProgressBar/VisitorProgressBar";
import { Debug } from "./common/Debug";
import { StaffManager } from "./manager/StaffManager";
import { CommonDefine } from "./common/CommonDefine";
import {Player} from "./game/player/Player";
import { StaffNewView } from "./game/ui/Staff/StaffNewView";


export class KeyboardTest
{
    private _npc:any;
    constructor()
    {
        Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDown);
    }

    public onKeyDown(e:Event)
    {
        switch (e.keyCode)
        {
            case Keyboard.T:
                 GameScene.instance.switchViewByIndex(0);
                // var qq = GameScene.instance.getBottomQualityByPoint("defaulsucculent13");
                // debugger;
                //Utils.createNumberText("55555", 400,400);
                //DIYScene.instance.potted.packData();
                // new SceneItem().setPosition(new Vector3(-5,0,0));
                //Laya.stage.event("clickTarget");
                //SceneManager.instance.openScene(ViewScene.instance);
                //GameScene.instance.test();
               // GameScene.instance.testtttt.moveTo([new Vector3(-5,0,5), new Vector3(-8,0,6)],null);
                break; 
            case Keyboard.U:
                GameScene.instance.switchViewByIndex(2);
                 // var f = new SwitchScene();
                 // SceneManager.uiLayer.addChild(f);
                //GameUIManager.instance.openUI("SwitchScene");
                // GameScene.instance.createSceneItem(1, new Vector3(2,0,0));
                //var b:Bubble = new Bubble();
                //b.init(1, null);
                //Laya.stage.addChild(b);
                break;
            case  Keyboard.I:
                //this._npc.stealGold(null, 5);
                //var d = GameScene.instance.scene3d.getChildByName("defaulsucculent12");
                debugger;
                break;
            case Keyboard.O:
                //
                // let npc33 = NpcManager.getInstance().testCreateNpc(2);
                // npc33.transform.position = GameScene.instance.scene3d.getChildByName("collectmap1").getChildByName("1").transform.position;
                // GameScene.instance.scene3d.addChild(npc33);
                break;
            case  Keyboard.Q:
                // let npc1 = NpcManager.getInstance().createNpc(1);
                // npc1.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
                // GameScene.instance.scene3d.addChild(npc1);
                //npc1.transform.lookAt(GameScene.instance.plantpoint_1.transform.position,new Vector3(0,1,0),true);  //TODO
                break;   
            case  Keyboard.W:
                // let npc2 = NpcManager.getInstance().createNpc(2);
                // npc2.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
                // GameScene.instance.scene3d.addChild(npc2);
                break;  
            case  Keyboard.E:
                // let npc3 = NpcManager.getInstance().createNpc(3);
                // npc3.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
                // GameScene.instance.scene3d.addChild(npc3);
                break;  
            case Keyboard.R:
                //var d = new SaunterNpc();
                //d.addComponent(RandomMove);
                //GameScene.instance.scene3d.addChild(d);
                //Laya.stage.event("rollBack");
                //SceneManager.instance.openScene(GameScene.instance);
                // let npc4 = NpcManager.getInstance().createNpc(4);
                // npc4.transform.position = GameScene.instance.scene3d.getChildByName("path").getChildByName("path_1").getChildAt(0).transform.position;
                // GameScene.instance.scene3d.addChild(npc4);
                 //this._npc = npc;

                // var d = new VisitorProgressBar();
                // d.init(GameScene.instance.camera, npc);
                // var s:number = 0;
                // Laya.timer.loop(10, this, function () {
                //     s+=0.01;
                //     if(s > 1)
                //         s = 0;
                //     d.setProgress(s)
                // })
                break;        
            case Keyboard.F1:
                Player.getInstance().refreshGold(99999999);
                break;
            case Keyboard.F2:
                Player.getInstance().refreshStar(99999999);
                break;
                case Keyboard.L:  
                 Player.getInstance().refreshStar(1000);
                 Player.getInstance().refreshGold(1000);
                break; 
                case Keyboard.M:   
                 GameUIManager.getInstance().showUI(StaffNewView);
                break; 
                case Keyboard.N:  
                GameUIManager.getInstance().hideUI(StaffNewView);
                break; 
            }
    }
}