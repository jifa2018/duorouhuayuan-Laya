import {NpcBaseState, NpcStateType} from "./NpcBaseState";

export class NpcDefaultState extends NpcBaseState
{
    constructor(npc) {
        super(npc);
    }

    // public Enter()
    // {
    //     super.Enter();
    // }

    // public Exit()
    // {
    //     super.Exit();
    // }

    public GetType():string
    {
        return NpcStateType.Default
    } 
}

