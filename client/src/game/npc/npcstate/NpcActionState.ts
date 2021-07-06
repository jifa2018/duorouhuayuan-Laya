import {NpcBaseState, NpcStateType} from "./NpcBaseState";

export class NpcActionState extends NpcBaseState
{
   private type:number;
    constructor(ai,ty) {
        super(ai);
        this.type = ty;
    }

    public Enter()
    {
        super.Enter();
        //调用执行行为的方法
        this._aiBase.onPay(this.type);
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
        return NpcStateType.Action

    }
}

