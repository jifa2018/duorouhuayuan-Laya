import { Avatars } from "./Avatars";
import { Singleton } from "../common/Singleton";
import { Effect_Cfg } from "../manager/ConfigManager";

/**特效管理 */
export class EffectManager extends Singleton {

    /**通用按钮点击特效
     * @param box UI容器
     * @param scale 缩放大小
     */
    public BtnEffect(box: any, scale: number = 1) {
        let eff: Avatars = new Avatars(box);
        eff.Load(Effect_Cfg[5].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
            eff.Play(Effect_Cfg[5].straniname, false, true, () => {
                eff.Destroy();
                eff = null;
            });
        }));
    }

    /**一次性特效入口
     * @param box UI容器
     * @param id 特效表中id
     * @param scale 特效大小
     * @param isloop 是否循环
     * @param callback 回调
     */
    public PlayOnceEffect(box: any, id: number, scale: number, isloop: boolean, callback?: Function) {
        //倒计时音效
        let eff: Avatars = new Avatars(box);
        eff.Load(Effect_Cfg[id].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
            eff.Play(Effect_Cfg[id].straniname, isloop, true, callback);
        }));
        return eff;
    }

    /**一次性特效入口
     * @param box UI容器
     * @param id 特效表中id
     * @param scale 特效大小
     */
    public PlayEffect(box: any, id: number, scale: number) {
        //倒计时音效
        let eff: Avatars = new Avatars(box);
        eff.Load(Effect_Cfg[id].streffect, 1, scale, box.width / 2, box.height / 2, Laya.Handler.create(this, () => {
            eff.PlayOnce(Effect_Cfg[id].straniname);
        }));
        return eff;
    }

}
