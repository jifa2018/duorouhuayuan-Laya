export class AvatarPool {
    private static _inst: AvatarPool;
    public static get Inst() {
        if (AvatarPool._inst == null)
            AvatarPool._inst = new AvatarPool();
        return AvatarPool._inst;
    }


    /** 加载延迟 */
    private _factoryLoadList = {}
    /** 加载标记 */
    private _factoryLoadMapping = {}

    private _factoryObj = {}
    public GetFactory(path: string, callBack: Laya.Handler) {
        let oTemplet: Laya.Templet = this._factoryObj[path]
        if (!oTemplet) {
            oTemplet = new Laya.Templet();
            oTemplet.loadAni(path);
            oTemplet.on(Laya.Event.COMPLETE, this, () => {
                oTemplet.offAll();
                if (this._factoryLoadList[path] != null) {
                    for (let fun of this._factoryLoadList[path]) {
                        fun.runWith(oTemplet)
                    }
                }
                this._factoryLoadList[path] = null
                callBack.runWith(oTemplet);
                this._factoryLoadMapping[path] = true
            });
            this._factoryObj[path] = oTemplet
        }
        else {
            if (this._factoryLoadMapping[path] != true) {
                if (this._factoryLoadList[path] == null) {
                    this._factoryLoadList[path] = []
                }
                this._factoryLoadList[path].push(callBack)
                return
            }
            callBack.runWith(oTemplet);
        }
    }
}


/**
 * Image缓存池，注意，从池里拿出去的image要么隐藏，要么调用池的销毁函数，切勿自己调用destroy
 */
export class ImagePool {
    private static _Inst: ImagePool = null;
    public static get Inst() {
        if(!this._Inst) {
            this._Inst = new ImagePool();
        }
        return this._Inst;
    }

    private _ImageList: Array<Laya.Image> =[];

    public GetImage() {
        for(let i = 0; i < this._ImageList.length; i++) {
            let image = this._ImageList[i];
            if(image.destroyed) {
                this._ImageList.splice(i,1);
            } else if (image.visible == false) {
                image.visible = true;
                return image;
            }
        }
        let newImage = new Laya.Image();
        this._ImageList.push(newImage);
        return newImage;
    }

    public Destroy(image: Laya.Image) {
        if(!image) return;
        image.removeSelf();
        image.visible = false;
    }
}

export class PointPool {
    private static _inst: PointPool = null;
    public static get Inst() {
        if(!this._inst) {
            this._inst = new PointPool();
        }
        return this._inst;
    }

    private _PointList: Array<Laya.Point> = [];

    public GetPoint(x?:number, y?:number) {
        x = x != null ? x : 0;
        y = y != null ? y : 0;
        for (let i: number = 0; i < this._PointList.length; i++) {
            let CurPoint = this._PointList[i];
            //使用-5保证坐标点不在地图内
            if(CurPoint.x == -5 && CurPoint.y == -5) {
                CurPoint.x = x;
                CurPoint.y = y;
                return CurPoint;
            }
        }
        let TempPoint = new Laya.Point(x, y);
        this._PointList.push(TempPoint);
        return TempPoint;
    }

    public RecyclePoint(point: Laya.Point) {
        if(!point) return;
        point.x = -5;
        point.y = -5;
    }
}
