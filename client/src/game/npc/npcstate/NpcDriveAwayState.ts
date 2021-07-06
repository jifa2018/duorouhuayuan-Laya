import {NpcBaseState, NpcStateType} from "./NpcBaseState";
import Handler = Laya.Handler;

export class NpcDriveAwayState extends NpcBaseState
{
    constructor(ai) {
        super(ai);
    }

    public Enter()
    {
        super.Enter();
        if (this._aiBase == null  || this._aiBase == undefined) return;
        if (this._aiBase.character == null  || this._aiBase.character == undefined) return;
        this._aiBase.character.changMoveSpeed(this._aiBase.character._tableData.harass_speed);
        this._aiBase.ActionDonePath();
        //this._aiBase.character.escape(Handler.create(this, this.goAwaryPath));
        //console.log("乱跑！！！！！！！！！！！！！！！！！！！！！！！");
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
        return NpcStateType.DriveAway;
    }

    private goAwaryPath():void
    {
        this._aiBase.goAwaryPath();
    }

  
}