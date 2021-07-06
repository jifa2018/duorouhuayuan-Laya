import {NpcBaseState, NpcStateType} from "./NpcBaseState";
import Handler = Laya.Handler;
export class NpcMoveState extends NpcBaseState
{
    constructor(ai) {
        super(ai);
    }

    public Enter()
    {
        super.Enter();

        this._aiBase.character.moveTo(this._aiBase.Currentpath, Handler.create(this, this.next));
    }

    public Update()
    {
        super.Update();
    }

    public Exit()
    {
        super.Exit();
    }

    public GetType():string
    {
        return NpcStateType.Move
    }

    public next(): void 
    {
        if (this._aiBase.character.GetType() == NpcStateType.Move) 
        {
            //Debug.Log("走完一段路了！");
            this._aiBase.isKeepUpMove();
        } 
    } 
}