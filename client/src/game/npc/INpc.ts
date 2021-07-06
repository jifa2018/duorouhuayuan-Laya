export interface INpc
{
    onLoad():void;
    onMove():void;
    onStop():void;
    onUpdate():void;
    onDestroy():void;
    changMoveSpeed(speed:number):void

}