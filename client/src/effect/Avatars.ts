import { ImagePool, AvatarPool } from "./ResourcePool";

/**模型方向 */
enum AvatarDirection {
    right = 1,
    left = -1,
}
/**动画名称类 */
export class AnimationName {
    public static idle: string = "idle";
    public static hit: string = "hit";
}
/**模型类 */
export class Avatars {
    private viewRoot: Laya.Box;
    private _path: string;
    private _posx: number = 0;
    private _posy: number = 0;
    private _curAniName: string = "";
    private _shadow: Laya.Image = null;
    private _width: number;
    private _height: number;

    private _factory: Laya.Templet = null;
    private _armature: Laya.Skeleton = null;

    /** 闪光亮度 */
    private _lightVal: number = 0
    private _lighterFactory: Laya.Templet = null;
    private _lighterArmature: Laya.Skeleton = null;

    /**加载成功 */
    private _loadTrue: boolean = false;
    public get Armature() {
        return this._armature;
    }

    public AddPendant(Obj: any): void {
        if (!this._armature) return;
        this._armature.addChildAt(Obj, 0);
    }

    constructor(viewRoot) {
        this._shadow = ImagePool.Inst.GetImage();
        this._shadow.anchorX = 0.5;
        this._shadow.anchorY = 0.5;
        this.viewRoot = viewRoot;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    /**大小 */
    private _scale: number = 1;
    public set scale(value: number) {
        if (this._armature == null || this._armature.destroyed) return;
        this._scale = value;
        this._armature.scale(this._scale * this._direction, this._scale);
        if (this._lighterArmature) {
            this._lighterArmature.scale(this._scale * this._direction, this._scale);
        }
    }

    public get scale(): number {
        return this._scale;
    }

    public set rotation(value: number) {
        if (this._armature == null || this._armature.destroyed) return;
        this._armature.rotation = value;
        if (this._lighterArmature) {
            this._lighterArmature.rotation = value;
        }
    }
    public get rotation() {
        if (this._armature == null || this._armature.destroyed || this._armature.rotation == null) return;
        return this._armature.rotation;
    }

    /**x坐标 */
    public set PosX(value: number) {
        this._posx = value;
        if (this._armature) {
            this._armature.x = this._posx;
            if (this._lighterArmature) {
                this._lighterArmature.x = this._posx;
            }
        }
    }

    public get PosX(): number {
        return this._posx;
    }

    /**y坐标 */
    public set PosY(value: number) {
        this._posy = value;
        if (this._armature) {
            this._armature.y = this._posy;
            if (this._lighterArmature) {
                this._lighterArmature.y = this._posy;
            }
        }
    }

    public get PosY(): number {
        return this._posy;
    }

    /** 显示隐藏 */
    public set visible(value: boolean) {
        if (this._armature.visible != null) this._armature.visible = value;

        if (this._lighterArmature && !this._lighterArmature.destroyed) {
            this._lighterArmature.visible = value;
        }
    }

    public get visible(): boolean {
        return this._armature.visible
    }
    /**播放速度 1为正常速率 */
    public PlaySpeed(num: number) {
        if (!this._armature || this._armature.playbackRate == null) return;
        this._armature.playbackRate(num);
    }

    /**移动速度 */
    private _speed: number = 100;
    public set speed(value: number) {
        this._speed = value;
    }

    public get speed(): number {
        return this._speed;
    }

    /**方向 */
    private _direction: AvatarDirection = AvatarDirection.right;
    public set direction(value: AvatarDirection) {
        if (!this._armature || this._armature.destroyed) return;
        this._direction = value;
        this._armature.scale(this._scale * this._direction, this._scale);
        if (this._lighterArmature) {
            this._lighterArmature.scale(this._scale * this._direction, this._scale);
        }
    }

    public get direction(): AvatarDirection {
        return this._direction;
    }

    /**是否加载完成 */
    private _loaded: boolean = false;
    public get loaded(): boolean {
        return this._loaded;
    }

    /**
     * 加载模型
     * @param path 路径
     * @param direction 方向（右：1，左：-1）
     * @param scale 出生大小
     * @param x 出生点坐标x
     * @param y 出生点坐标y
     * @param callBack 回调函数
     * @param bUseLight 是否发光
     */
    public Load(path: string, direction: AvatarDirection = 1, scale: number = 1, x: number = 0, y: number = 0, callBack?: Laya.Handler, lightVal: number = 0) {
        if (this._loaded) {
            this.Destroy();
        }
        this._loadTrue = false;
        this._path = path;
        this._posx = x;
        this._posy = y;
        this._scale = scale;
        this._direction = direction;
        this._lightVal = lightVal
        //加载常规模型
        AvatarPool.Inst.GetFactory(path, Laya.Handler.create(this, (factory) => {
            this._factory = factory;
            this.LoadComplete1(callBack);
        }))
    }

    /**
     * 加载完成
     * @param callBack 回调函数
     */
    private LoadComplete1(callBack: Laya.Handler) {
        this._armature = this._factory.buildArmature(0);
        this._armature.scale(this._scale * this._direction, this._scale);
        this._armature.x = this._posx;
        this._armature.y = this._posy;
        if (this.viewRoot != null) {
            this.viewRoot.addChild(this._armature);
        }
        else {
            Laya.stage.addChild(this._armature);
        }
        if (this._lightVal > 0) {
            this.LoadLighterAvatar(callBack);
        } else {
            this._loaded = true;
            if (callBack) {
                callBack.run();
            }
        }
        this._loadTrue = true;
    }

    /**加载发光模型 */
    private LoadLighterAvatar(callBack: Laya.Handler) {
        if (this._lighterFactory == null) {
            AvatarPool.Inst.GetFactory(this._path, Laya.Handler.create(this, (factory) => {
                this._lighterFactory = factory
                this.LoadComplete2(callBack);
            }));
        } else {
            this.LoadComplete2(callBack)
        }
    }

    /**加载完成 */
    private LoadComplete2(callBack: Laya.Handler) {
        this._lighterArmature = this._factory.buildArmature(0);
        this._lighterArmature.scale(this._scale * this._direction, this._scale);
        this._lighterArmature.x = this._posx;
        this._lighterArmature.y = this._posy;
        this._lighterArmature.blendMode = "lighter";
        if (this.viewRoot) {
            this.viewRoot.addChild(this._lighterArmature);
        }
        Laya.timer.frameLoop(1, this, () => {
            let value = Math.abs(Math.sin(Laya.timer.currTimer / 1000)) * 0.5;
            this._lighterArmature.alpha = value * this._lightVal;
        });
        this._loaded = true;
        if (callBack) {
            callBack.run();
        }
    }

    /**
     * 加载阴影
     *
     **/
    public Shadow(scale: number, bMonster: boolean = false): void {
        if (!this.viewRoot) return;
        function loop(self) {
            if (!self._armature || self._armature.destroyed) return;
            let ret = self._armature.getBounds();
            if (ret.width > 0 || ret.height > 0) {
                self._width = ret.width;
                self._height = ret.height;
                self._shadow.skin = "ui_common/img-yingzi.png";
                self._shadow.scale(scale, scale);
                if (bMonster) {
                    self._shadow.pos(self._posx, self._posy);
                }
                else {
                    self._shadow.pos(ret.x + ret.width * 0.5, ret.y + ret.height - 5);
                }
                self.viewRoot.addChildAt(self._shadow, 0);
                Laya.timer.clear(self, loop);
                return;
            }
        }
        Laya.timer.frameLoop(1, this, loop, [this]);
    }

    /**设置层级顺序 */
    public SetOrder(order: number): void {
        if (this._armature) {
            this._armature.zOrder = order;
            this._armature.updateZOrder();
        }
        if (this._lighterArmature) {
            this._lighterArmature.zOrder = order;
            this._lighterArmature.updateZOrder();
        }
    }

    /**获取骨骼点位置信息 */
    public GetBoneTransform(boneName: string): Laya.Point {
        let ret = new Laya.Point();
        let arr = this._factory.mBoneArr;
        if (arr) {
            let bone = this._factory.boneSlotDic[boneName] as Laya.BoneSlot;
            if (bone) {
                let tran = bone.currDisplayData.transform;
                ret.x = tran.x;
                ret.y = tran.y;
            }
        }
        return ret;
    }


    /**
     * 播放一次，播放后隐藏
     */
    public PlayOnce(nameOrIndex: any = null): void {
        if (!nameOrIndex) {
            let start: number = this._path.lastIndexOf("/") + 1;
            let end: number = this._path.indexOf(".sk");
            nameOrIndex = this._path.substring(start, end);
        }
        if (this.Armature) {
            this.Armature.visible = true;
            this.Play(nameOrIndex, false, true, () => {
                this.Armature.visible = false;
            });
        }
    }

    /**
     * 播放动画
     * @param nameOrIndex 动画名字或者索引,默认动画名称
     * @param loop 是否循环播放
     * @param force false,如果要播的动画跟上一个相同就不生效,true,强制生效
     * @param callBack 播放完成回调
     */
    public Play(nameOrIndex: any = null, loop: boolean = true, force?: boolean, callBack?: Function, ones?: boolean) {
        if (!this._armature || this._armature.destroyed) return;
        if (nameOrIndex == null) {
            let start: number = this._path.lastIndexOf("/") + 1;
            let end: number = this._path.indexOf(".sk");
            nameOrIndex = this._path.substring(start, end);
        }
        //只播放第一帧
        if (ones) {
            this._armature.play(nameOrIndex, loop, force, 1, 1);
            if (this._lighterArmature) {
                this._lighterArmature.play(nameOrIndex, loop, force, 1, 1);
            }
            return;
        }
        //如果是hit动作则不从头播放直接播放后半部分动画
        if (nameOrIndex == this._curAniName && nameOrIndex == AnimationName.hit) {
            let index = this._armature["_currAniIndex"];
            let duration = this._factory.getAniDuration(index);
            this._armature.play(nameOrIndex, loop, force, duration / 2);
            if (this._lighterArmature) {
                this._lighterArmature.play(nameOrIndex, loop, force, duration / 2);
            }
        }
        else {
            this._armature.play(nameOrIndex, loop, force);
            if (this._lighterArmature) {
                this._lighterArmature.play(nameOrIndex, loop, force);
            }
        }
        this._curAniName = nameOrIndex;
        //动画播放完成
        this._armature.offAll();
        this._armature.on(Laya.Event.STOPPED, this, () => {
            if (callBack != null) {
                callBack();
            }
            if (this._armature) {
                this._armature.offAll();
            }
        });
        if (this._lighterArmature) {
            this._lighterArmature.offAll();
            this._lighterArmature.on(Laya.Event.STOPPED, this, () => {
                if (this._lighterArmature) {
                    this._lighterArmature.offAll();
                }
            });
        }
    }

    /**获取动画时间 */
    public GetAniDuration(): number {
        if (!this._armature || !this._factory) return;
        let index = this._armature["_currAniIndex"];
        let duration: number = this._factory.getAniDuration(index);
        return duration;
    }

    /**停止播放动画 */
    public Stop() {
        this._armature.stop();
        this._armature.offAll();
        if (this._lighterArmature) {
            this._lighterArmature.stop();
            this._lighterArmature.offAll();
        }
    }

    public Rotate(value: number): void {
        if (!this._armature || this._armature.destroyed) return;
        this._armature.rotation = value;
        if (this._lighterArmature) {
            this._lighterArmature.rotation = value;
        }
    }

    /**销毁 */
    public Destroy() {
        Laya.timer.clearAll(this);
        if (this._shadow) {
            ImagePool.Inst.Destroy(this._shadow);
        }
        if (this._armature) {
            this._armature.offAll();
            this._armature.destroy(true)
            this._armature = null;
        }
        if (this._lighterArmature) {
            this._lighterArmature.offAll();
            this._lighterArmature.destroy(true)
            this._lighterArmature = null;
        }
        this._loaded = false;
    }

    /**设置位置 */
    setPostion(x, y) {
        if (!this._armature) return
        this._armature.x = x;
        this._armature.y = y;
    }

    setShow(b) {
        if (!this._armature) return
        this._armature.visible = b;
    }

}

/**动画名称类 */
export class AnimationNames {
    /**待机动作 */
    public static idle: string = "idle";
    /**受伤（被击）动作 */
    public static hit: string = "hit";
    /**攻击动作 */
    public static attack: string = "attack";
    /**死亡动作 */
    public static die: string = "dead";
}
