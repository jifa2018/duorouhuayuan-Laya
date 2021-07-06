import Sprite3D = Laya.Sprite3D;
import MeshSprite3D = Laya.MeshSprite3D;
import SkinnedMeshSprite3D = Laya.SkinnedMeshSprite3D;
import PostProcess = Laya.PostProcess;
import Camera = Laya.Camera;
import Point = Laya.Point;
import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;
import LocalStorage = Laya.LocalStorage;
import Ray = Laya.Ray;
import HitResult = Laya.HitResult;
import Scene3D = Laya.Scene3D;
import Vector2 = Laya.Vector2;
import Text = Laya.Text;
import { LayerManager } from "../manager/LayerManager";
import Tween = Laya.Tween;
import Pool = Laya.Pool;
import Handler = Laya.Handler;
import { SceneItem } from "../game/item/SceneItem";
import { ClassPool } from "../manager/ClassPool";
import PBRStandardMaterial = Laya.PBRStandardMaterial;
import { BubbleType } from "../game/ui/Bubble/Bubble";
import { Succulent_Cfg } from "../manager/ConfigManager";
import { Tree } from "../game/item/Tree";
import GameConfig from "../GameConfig";

export class Utils {
    public static rayDirection: Vector3 = new Vector3();
    public static ray;
    public static outHitResult;
    public static outHitResultArr: Array<HitResult>;

    /**
     * 设置mesh是否接收光照
     * @param sprite3d
     * @param bool
     */
    public static setMeshCastShadow(sprite3d: Sprite3D, bool: boolean): void {
        let childNum: number = sprite3d.numChildren;
        for (let i: number = 0; i < childNum; ++i) {
            var node = sprite3d.getChildAt(i) as any;
            if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D) {
                // @ts-ignore
                if (node.meshRenderer) {
                    // @ts-ignore
                    node.meshRenderer.castShadow = bool;
                    // @ts-ignore
                    node.meshRenderer.receiveShadow = bool;
                }
                // @ts-ignore
                if (node.skinnedMeshRenderer) {
                    // @ts-ignore
                    node.skinnedMeshRenderer.castShadow = bool;
                    // @ts-ignore
                    node.skinnedMeshRenderer.receiveShadow = bool;
                }
            }
            if (node.numChildren > 0)
                Utils.setMeshCastShadow(node, bool)
        }
    }

    /**
     * 获取mesh
     * @param sprite3d
     */
    public static getShaderMesh(sprite3d: any): any {
        if (sprite3d instanceof MeshSprite3D || sprite3d instanceof SkinnedMeshSprite3D) {
            if (sprite3d.meshFilter && sprite3d.meshFilter.sharedMesh) {
                return sprite3d.meshFilter.sharedMesh;
            }
        }
        let childNum: number = sprite3d.numChildren;
        for (let i: number = 0; i < childNum; ++i) {
            var d = Utils.getShaderMesh(sprite3d.getChildAt(i));
            if (d) return d;
        }
    }

    /**
     * 设置模型透明状态
     * @param sprite3d     模型
     * @param alpha        透明度  0-1
     */
    public static setModelAlpha(sprite3d: Sprite3D, alpha: number): void {
        var childNum: number = sprite3d.numChildren;
        for (let i: number = 0; i < childNum; ++i) {
            var node = sprite3d.getChildAt(i) as any;
            if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D) {
                // @ts-ignore
                if (node.meshRenderer) {
                    // @ts-ignore
                    if ((node as MeshSprite3D).meshRenderer.material) {
                        // @ts-ignore
                        node.meshRenderer.material.renderMode = 2;
                        // @ts-ignore
                        node.meshRenderer.material.albedoColor = new Vector4(node.meshRenderer.material.albedoColor.x, node.meshRenderer.material.albedoColor.y, node.meshRenderer.material.albedoColor.z, alpha);
                    }
                }
                // @ts-ignore
                if (node.skinnedMeshRenderer) {
                    // @ts-ignore
                    if ((node as MeshSprite3D).skinnedMeshRenderer.material) {
                        // @ts-ignore
                        node.skinnedMeshRenderer.material.renderMode = 2;
                        // @ts-ignore
                        node.skinnedMeshRenderer.material.albedoColor = new Vector4(node.skinnedMeshRenderer.material.albedoColor.x, node.skinnedMeshRenderer.material.albedoColor.y, node.skinnedMeshRenderer.material.albedoColor.z, alpha);
                    }
                }
            }
            if (node.numChildren > 0)
                Utils.setModelAlpha(node, alpha)
        }
    }

    public static setModelbrightness(sprite3d: Sprite3D, val: number): void {
        var childNum: number = sprite3d.numChildren;
        for (let i: number = 0; i < childNum; ++i) {
            var node = sprite3d.getChildAt(i) as any;
            if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D) {
                // @ts-ignore
                if (node.meshRenderer) {
                    // @ts-ignore
                    if ((node as MeshSprite3D).meshRenderer.material) {
                        if ((node as MeshSprite3D).meshRenderer.material instanceof PBRStandardMaterial)
                            ((node as MeshSprite3D).meshRenderer.material as PBRStandardMaterial).metallic = 1 - val;
                        else
                            // @ts-ignore
                            node.meshRenderer.material.albedoIntensity = val;
                    }
                }
                // // @ts-ignore
                // if (node.skinnedMeshRenderer) {
                //     // @ts-ignore
                //     if ((node as MeshSprite3D).skinnedMeshRenderer.material) {
                //         // @ts-ignore
                //         node.meshRenderer.material.albedoIntensity = val;
                //     }
                // }
            }
            if (node.numChildren > 0)
                Utils.setModelAlpha(node, val)
        }
    }

    public static setRenderMode(sprite3d: Sprite3D, val: number): void {
        var childNum: number = sprite3d.numChildren;
        for (let i: number = 0; i < childNum; ++i) {
            var node = sprite3d.getChildAt(i) as any;
            if (node instanceof MeshSprite3D || node instanceof SkinnedMeshSprite3D || node instanceof Sprite3D) {
                // @ts-ignore
                if (node.meshRenderer) {
                    // @ts-ignore
                    if ((node as MeshSprite3D).meshRenderer.material) {
                        // @ts-ignore
                        node.meshRenderer.material.renderMode = val;
                    }
                }
                // @ts-ignore
                if (node.skinnedMeshRenderer) {
                    // @ts-ignore
                    if ((node as MeshSprite3D).skinnedMeshRenderer.material) {
                        // @ts-ignore
                        node.skinnedMeshRenderer.material.renderMode = val;
                    }
                }
            }
            if (node.numChildren > 0)
                Utils.setRenderMode(node, val)
        }
    }

    /**
     * 创建朦胧特效
     * @param camera
     * @param param
     */
    public static createBloom(camera: Camera, param: Object): PostProcess {
        var postProcess = new Laya.PostProcess();
        var bloom = new Laya.BloomEffect();
        postProcess.addEffect(bloom);
        for (var o in param) {
            bloom[o] = param[o];
        }
        Laya.Texture2D.load("res/image/DR_shitou.png", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            bloom.dirtTexture = tex;
            bloom.dirtIntensity = 2.0;

            camera.postProcess = postProcess;
        }));
        return postProcess;
    }

    /***
     * 世界坐标转屏幕坐标
     * @param camera
     * @param pos
     */
    public static worldToScreen(camera: Camera, pos: Vector3): Vector2 {
        var outPos: Vector4 = new Vector4();
        camera.viewport.project(pos, camera.projectionViewMatrix, outPos);
        return new Vector2(outPos.x / Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
    }

    /***
     * 屏幕转世界坐标
     * @param mousePos  点击位置
     * @param camera    摄像机对象
     * @param distance  限制移动距离  默认不限制
     */
    public static screenToWorld(mousePos: Point, camera: Camera, height: number = 0.3, distance: number = -1) {
        function getLowerLeft(transform, distance, width, height) {
            // 相机在 distance距离的截面左下角世界坐标位置
            // LowerLeft
            var lowerLeft = new Laya.Vector3();
            // lowerLeft = transform.position - (transform.right * width);
            var right = new Laya.Vector3();
            transform.getRight(right);
            Laya.Vector3.normalize(right, right);
            var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
            Laya.Vector3.add(transform.position, xx, lowerLeft);

            // lowerLeft -= transform.up * height;
            var up = new Laya.Vector3();
            transform.getUp(up);
            Laya.Vector3.normalize(up, up);
            var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
            Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);

            // lowerLeft += transform.forward * distance;
            var forward = new Laya.Vector3();
            transform.getForward(forward);
            Laya.Vector3.normalize(forward, forward);
            var zz = new Laya.Vector3(forward.x * distance, forward.y * distance, forward.z * distance);
            Laya.Vector3.subtract(lowerLeft, zz, lowerLeft);
            return lowerLeft;
        }

        function getScreenScale(width, height) {
            var v = new Laya.Vector3();
            v.x = Laya.stage.width / width / 2;
            v.y = Laya.stage.height / height / 2;
            return v;
        }

        function inverseTransformPoint(origin, point) {
            var xx = new Laya.Vector3();
            origin.getRight(xx);
            var yy = new Laya.Vector3();
            origin.getUp(yy);
            var zz = new Laya.Vector3();
            origin.getForward(zz);
            var zz1 = new Laya.Vector3(-zz.x, -zz.y, -zz.z);
            var x = projectDistance(point, origin.position, xx);
            var y = projectDistance(point, origin.position, yy);
            var z = projectDistance(point, origin.position, zz1);
            var value = new Laya.Vector3(x, y, z);
            return value;
        }

        function transformPoint(origin, point) {
            var value = new Laya.Vector3();
            Laya.Vector3.transformQuat(point, origin.rotation, value);
            Laya.Vector3.add(value, origin.position, value);
            return value;
        }

        function projectDistance(A, C, B) {
            var CA = new Laya.Vector3();
            Laya.Vector3.subtract(A, C, CA);
            var angle = angle2(CA, B) * Math.PI / 180;
            var distance = Laya.Vector3.distance(A, C);
            distance *= Math.cos(angle);
            return distance;
        }

        function angle2(ma, mb) {
            var v1 = (ma.x * mb.x) + (ma.y * mb.y) + (ma.z * mb.z);
            var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y + ma.z * ma.z);
            var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y + mb.z * mb.z);
            var cosM = v1 / (ma_val * mb_val);

            if (cosM < -1) cosM = -1;
            if (cosM > 1) cosM = 1;

            var angleAMB = Math.acos(cosM) * 180 / Math.PI;
            return angleAMB;
        }

        function intersectWithLineANdPlane(linePoint: Vector3, lineDirection: Vector3, planeNormal: Vector3, planePoint: Vector3): Vector3 {
            var v1: Vector3 = new Vector3();
            Vector3.subtract(planePoint, linePoint, v1);
            var d: number = Vector3.dot(v1, planeNormal)
                / Vector3.dot(lineDirection, planeNormal);
            var v2: Vector3 = new Vector3();
            Vector3.scale(lineDirection, d, v2);
            var v3: Vector3 = new Vector3();
            Vector3.add(linePoint, v2, v3)
            return v3;
        }

        function getPos(camera, screenPos) {
            var halfFOV = (camera.fieldOfView * 0.5) * Math.PI / 180;
            let height = screenPos.z * Math.tan(halfFOV);
            let width = height * camera.aspectRatio;
            let lowerLeft = getLowerLeft(camera.transform, screenPos.z, width, height);
            let v = getScreenScale(width, height);

            // 放到同一坐标系（相机坐标系）上计算相对位置
            var value = new Vector3();
            var lowerLeftA = inverseTransformPoint(camera.transform, lowerLeft);
            value = new Vector3(-screenPos.x / v.x, screenPos.y / v.y, 0);
            Laya.Vector3.add(lowerLeftA, value, value);
            // 转回世界坐标系
            value = transformPoint(camera.transform, value);
            return value;
        }
        var screenPosition = new Vector3(mousePos.x, mousePos.y, 1);
        var worldPostion: Vector3 = getPos(camera, screenPosition);
        Vector3.subtract(worldPostion, camera.transform.position, Utils.rayDirection);
        Vector3.normalize(Utils.rayDirection, Utils.rayDirection);
        var myPosition: Vector3 = intersectWithLineANdPlane(camera.transform.position
            , Utils.rayDirection
            , new Vector3(0, 1, 0)
            , new Vector3(0, height, 0));

        if (distance != -1) {
            var myPosition2: Vector3 = new Vector3(myPosition.x, 0, myPosition.z);
            var length: number = Vector3.scalarLengthSquared(myPosition2);
            var maxLength: number = distance;
            if (length > maxLength * maxLength) {
                var myPosition3: Vector3 = new Vector3();
                Vector3.normalize(myPosition2, myPosition3);
                var myPosition4: Vector3 = new Vector3();
                Vector3.scale(myPosition3, maxLength, myPosition3);
                myPosition = new Vector3(myPosition3.x, myPosition.y, myPosition3.z);
            }
        }
        return myPosition;
    }

    public static formatObject2Array(object: any): Array<any> {
        var arr: Array<any> = new Array<any>();

        for (const key in object) {
            arr.push(object[key]);
        }
        return arr;
    }

    /***
     * 权重随机
     * @param arrWeight 权重数组
     */
    public static getWeight(arrWeight): number {
        var t = [];
        var nMax = 0;

        for (var i = 0; i < arrWeight.length; i++) {
            if (!t[i - 1]) {
                t[i - 1] = 0;
            }
            t[i] = t[i - 1] + Number(arrWeight[i]);
            nMax += Number(arrWeight[i]);
        }

        var r = Math.random() * nMax;
        for (var i = 0; i < t.length; i++) {
            if (r < t[i]) {
                return i;
            }
        }
        return null;
    }

    public static getInputParam(param: string): string {
        return Laya.Utils.getQueryString(param);
    }

    /***
     * 射线检测, 返回第一个物体
     * @param point
     * @param scene3d
     * @param camera
     */
    public static rayCastOne(point: Vector2, scene3d: Scene3D, camera: Camera): HitResult {
        if (!Utils.outHitResult)
            Utils.outHitResult = new HitResult();
        if (!Utils.ray)
            Utils.ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
        //产生射线
        camera.viewportPointToRay(point, Utils.ray);
        //拿到射线碰撞的物体
        scene3d.physicsSimulation.rayCast(Utils.ray, Utils.outHitResult);
        return Utils.outHitResult;
    }

    /***
     * 射线检测, 返回所有物体
     * @param point
     * @param scene3d
     * @param camera
     */
    public static rayCastAll(point: Vector2, scene3d: Scene3D, camera: Camera): any {
        if (!Utils.outHitResultArr)
            Utils.outHitResultArr = new Array<HitResult>();
        if (!Utils.ray)
            Utils.ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
        //产生射线
        camera.viewportPointToRay(point, Utils.ray);
        //拿到射线碰撞的物体
        scene3d.physicsSimulation.rayCastAll(Utils.ray, Utils.outHitResultArr);
        return Utils.outHitResultArr;
    }

    /**
     * 飘字
     * @param value
     * @param posX
     * @param posY
     */
    public static createNumberText(value: string, posX: number, posY: number, operation: string = "+", left: boolean = false, color: string = "#ff0000"): void {
        this.createNumberImage(value, posX, posY, operation, left, color);
        return;
        //var txt:Text = new Text();
        var txt: Text = Pool.getItemByClass("goldTxt", Text);
        txt.text = operation + value;
        //设置宽度，高度自动匹配
        txt.alpha = 1;
        txt.width = 50;
        txt.align = "center";
        txt.fontSize = 40;
        txt.font = "Microsoft YaHei";
        txt.color = color;
        txt.bold = true;
        txt.leading = 5;

        txt.stroke = 2;
        txt.strokeColor = "#0e0f1c";

        txt.x = posX
        txt.y = posY;
        LayerManager.getInstance().topUILayer.addChild(txt);
        var offX: number = left ? -50 : 50;
        Tween.to(txt, { alpha: 0.3, y: txt.y - 100 }, 500, null, Handler.create(this, function () {
            txt.removeSelf();
            Pool.recover("goldTxt", txt)
        }))
    }

    public static createNumberImage(value: string, posX: number, posY: number, operation: string = "+", left: boolean = false, color: string = "#ff0000") {
        //var txt:Text = new Text();
        let txt: Text = Pool.getItemByClass("goldTxt", Text);
        txt.text = operation + value;
        //设置宽度，高度自动匹配
        txt.alpha = 1;
        txt.width = 50;
        txt.align = "center";
        txt.fontSize = 40;
        txt.font = "Microsoft YaHei";
        txt.color = color;
        txt.bold = true;
        txt.leading = 5;

        txt.stroke = 2;
        txt.strokeColor = "#0e0f1c";

        txt.x = posX
        txt.y = posY;
        LayerManager.getInstance().topUILayer.addChild(txt);

        let imageName = left ? "img_star" : "img_gold";
        let img: Laya.Image = Pool.getItemByClass(imageName, Laya.Image);
        img.skin = "gameui/main/" + imageName + ".png";
        txt.addChild(img);
        img.pos(-img.width, -10);

        var offX: number = left ? -50 : 50;
        Tween.to(txt, { alpha: 0.3, y: txt.y - 100 }, 500, null, Handler.create(this, function () {
            img.removeSelf();
            Pool.recover(imageName, img);
            txt.removeSelf();
            Pool.recover("goldTxt", txt);
        }))
    }

    public static getJsonByArray2(array: any): any {
        var arr = {};
        for (var o in array) {
            if (array) {

                if (array instanceof Array) {
                    let oTemp = {};
                    for (var key in array) {
                        oTemp[key] = array;
                    }
                    arr[o] = oTemp;
                } else {
                    arr[o] = array;
                }
            }
        }

        let str = JSON.stringify(arr);
        return str;
    }

    public static getArray2ByJson(str: any): any {
        var js = JSON.parse(str);
        var arr1: Array<any> = new Array<any>();
        for (var o in js) {
            var tempArr: Array<any> = new Array<any>();
            if (js[o] instanceof Object) {

                for (var i in js[o]) {
                    tempArr[i] = js[o][i];
                }
                arr1[Number(o)] = tempArr;
            } else {
                arr1[Number(o)] = js[o];
            }
        }
        return arr1;
    }
    /** 获取map的长度 */
    public static GetMapLength(cfg: any): number {
        let _length = 0;
        for (const key in cfg) {
            _length++;
        }
        return _length;
    }
    /**
     * 本地存储字符串
     * @param key
     * @param value
     */
    public static saveStringToLocal(key: string, value: string): void {
        LocalStorage.setItem(key, value);
    }

    /**
     * 本地读取字符串
     * @param key
     */
    public static getStringFromLocal(key: string): string {
        return LocalStorage.getItem(key);
    }

    /**
     * 本地存储JSON
     * @param key
     * @param value
     */
    public static saveJSONToLocal(key: string, value: any): void {
        LocalStorage.setJSON(key, value);
    }

    /**
     * 本地读取JSON
     * @param key
     */
    public static getJSONFromLocal(key: string): any {
        return LocalStorage.getJSON(key);
    }

    /***
     * 模糊查找返回全部相似节点
     * @param key
     */
    public static getAllFormLocalByKey(key: string): Array<string> {
        var arrKey: Array<string> = new Array<string>();
        for (var i: number = 0; i < LocalStorage.items.length; ++i) {
            var name: string = LocalStorage.items.key(i);
            if (name.indexOf(key) != -1) {
                arrKey.push(name);
            }
        }
        return arrKey;
    }

    /**
     * 根据key删除本地缓存
     * @param key
     */
    public static clearLocalByKey(key: string): void {
        LocalStorage.removeItem(key);
    }

    /**
     * 清空本地缓存
     */
    public static clearLocal(): void {
        LocalStorage.clear();
    }

    /**设置发光效果 */
    public static setGlowFilter(target: Laya.Sprite, glowFilter: Laya.GlowFilter): void {
        if (glowFilter) {
            // 设置滤镜集合为发光滤镜
            target.filters = [glowFilter];
        } else {
            target.filters = null;
        }

    }

    /**
      * 删除数组元素
      * @param dataArray
      * @return 返回之前的元素下标，若元素不存在则返回-1
      */
    public static remove<T>(dataArray: T[], element: T): number {
        let index: number = dataArray.indexOf(element);
        if (index !== -1) {
            dataArray.splice(index, 1);
        }
        return index;
    }

    /**截取字符串特殊字符 */
    public static getArrayBySplitString(str: string, sign: string) {
        return str.split(sign);
    }

    public static formatStandardTime(seconds: number, showHours: boolean = true,): string {
        let hours = this.lpad(String(Math.floor(seconds / 3600) % 24), 2, 0);
        let mins = this.lpad(String(Math.floor(seconds / 60) % 60), 2, 0);
        let secs = this.lpad(String(Math.floor(seconds) % 60), 2, 0);
        if (showHours) {
            if (hours === "00") {
                return this.format("{0}:{1}", mins, secs);
            }
            return this.format("{0}:{1}:{2}", hours, mins, secs);
        }
        return this.format("{0}:{1}", mins, secs);
    }

    public static format(content: string, ...rest: Array<string | number | Array<string | number>>): string {
        let args: Array<string | number> = [];
        rest.forEach(value => {
            if (value instanceof Array) {
                value.forEach(v => {
                    args.push(v);
                });
            } else {
                args.push(value);
            }
        });
        args.forEach((value, index) => {
            content = content.replace(`{${index}}`, value as string);
        });
        return content;
    }


    public static lpad(content: string, len: number, value: (string | number)): string {
        if (content.length >= len) {
            return content;
        }
        let num = len - content.length;
        for (let n = 0; n < num; n++) {
            content = value + content;
        }
        return content;
    }

    /**转换时间为 00::00:00
     * @param time 秒数
     */
    public static TimeToTimeFormat(time: number) {
        let hour = Math.floor(time / 3600)
        let min = Math.floor((time - 3600 * hour) / 60);
        let sec = Math.floor(time - 3600 * hour - min * 60);
        let str: string = "";
        if (hour > 0) {
            str = (hour >= 10 && hour || '0' + hour) + ':' + (min >= 10 && min || '0' + min) + ':' + (sec >= 10 && sec || '0' + sec);
        }
        else {
            str = (min >= 10 && min || '0' + min) + ':' + (sec >= 10 && sec || '0' + sec);
        }

        return str
    }

    public static GetTableLength(table: any): number {
        let length = 0;
        for (const key of Object.keys(table)) {
            if (table.hasOwnProperty(key)) {
                length++;
            }
        }
        return length;
    }

    /**
     * 图片剪切数字
     *
     */
    public static getClipNum(param) {
        let _x = param[0];          //坐标x
        let _y = param[1];          //坐标y
        let _n = param[2];          //数字
        let _url = param[3];        //图片路径
        let _len = param[4];        //切图长度
        let _once = param[5];       //单位

        let clip = new Laya.Clip(_url, _len, _once);
        clip.index = _n;
        clip.pos(_x, _y);
        return clip;
    }

    /**
     * 查找子节点
     * @param secs 
     */
    public static FindTransfrom(Root: Sprite3D, name: string): any {
        let tran = null;
        tran = Root.getChildByName(name);
        if (tran != null) return tran;
        let go = null;
        for (let i = 0; i < Root.numChildren; i++) {
            go = Utils.FindTransfrom(Root.getChildAt(i) as Sprite3D, name);
            if (go != null) {
                return go;
            }
        }
        return null;
    }

    /**
     * 获取屏幕缩放比例
     */
    public static getStageScal() {
        let _scal = {}
        _scal["w"] = GameConfig.width / Laya.stage.width;
        _scal["h"] = GameConfig.height / Laya.stage.height;
        return _scal
    }






}



/**
 * 格式化字符串（替换%s）
 * @param value 字符串
 * @param args 替换的参数
 */
export function Format(str: string, ...args): string {
    let params: Array<string> = [...args];
    let index = 0;
    while (str.search("%S") != -1) {
        str = str.replace('%S', "%s");
    }
    while (str.search("%s") != -1) {
        str = str.replace('%s', params[index]);
        ++index;
    }
    return str;
}

/**
 * 根据秒数返回XX天YY小时 XX小时YY分钟 XX分钟YY秒
 * @param secs 
 */
export function GetFormatTime(secs: number): string {
    secs = Number(secs.toString().split(".")[0]);
    let day: number = Math.floor(secs / 86400);
    let hour: number = Math.floor((secs - day * 86400) / 3600);
    let min: number = Math.floor((secs - hour * 3600) / 60);
    let sec: number = secs - hour * 3600 - min * 60;
    let str: string = '';
    if (day > 0) {
        str = (day >= 10 ? day : '0' + day) + '天' + (hour >= 10 ? hour : '0' + hour) + '时';
    }
    else if (hour > 0) {
        str = (hour >= 10 ? hour : '0' + hour) + '时' + (min >= 10 ? min : '0' + min) + '分';
    }
    else if (min > 0) {
        str = (min >= 10 ? min : '0' + min) + '分' + (sec >= 10 ? sec : '0' + sec) + '秒';
    }
    else {
        str = (min >= 10 ? min : '0' + min) + '分' + (sec >= 10 ? sec : '0' + sec) + '秒';
    }
    return str;
}







