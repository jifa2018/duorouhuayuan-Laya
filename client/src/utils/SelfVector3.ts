import Vector3 = Laya.Vector3;

export class SelfVector3 extends Vector3
{
    public static one:Vector3 = new Vector3(1,1,1);
    public static zero:Vector3 = new Vector3(0,0,0);


    public static add(a:Vector3,b:Vector3):Vector3
    {
        let z:Vector3;
        Vector3.add(a,b,z)
        return z;
    }


}