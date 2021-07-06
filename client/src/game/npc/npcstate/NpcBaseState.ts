import Pool = Laya.Pool;
import { AIBase } from "../../ai/AIBase";
export enum NpcStateType{

     None = "none",
     Default = "default",
     Move = "move",
     Action = "action",
     DriveAway = "driveaway",
     Idle  = "idle",
 }


export class NpcBaseState
{
    protected _aiBase:AIBase;
    
    constructor(aiBase:AIBase) {
        this._aiBase = aiBase;
    }

    public Enter(){}

    public Update(){}

    public Exit(){}

    public GetType():string
    {
        return NpcStateType.None
    }
}