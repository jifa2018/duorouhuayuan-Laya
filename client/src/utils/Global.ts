import Camera = Laya.Camera;

export class Global
{
    public static tempVector3:Laya.Vector3 = new Laya.Vector3();
    public static gameCamera:Camera;

    public static sceneLock:boolean = false;
}