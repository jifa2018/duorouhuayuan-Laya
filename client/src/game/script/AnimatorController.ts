import {NpcBase} from "../npc/NpcBase";
import Script3D = Laya.Script3D;
import Sprite3D = Laya.Sprite3D;
import Animator = Laya.Animator;

export class AnimatorController extends Script3D
{
    /*插件控制的实例*/
    private character:NpcBase;
    private _animator:Animator;
    private _curAnimator:string = "";
    public onAwake()
    {
        super.onAwake();
    }

    public onEnable()
    {
        super.onEnable();
        this.character = this.owner as NpcBase;
        this._animator = this.character.sprite3dNode.getComponent(Animator);
        if(this._curAnimator)
            this.play(this._curAnimator);
    }

    public onDisable()
    {
        super.onDisable();
    }

    public onDestroy()
    {
        super.onDestroy();
    }

    public play(animatorName:string):void
    {
        this._curAnimator = animatorName;
        this._animator && this._animator.play(animatorName);
    }

    private initAnimator():void
    {
        if(!this._animator)
            this._animator = this.character.getComponent(Animator);
    }
}