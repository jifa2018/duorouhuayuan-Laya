import { Singleton } from "../common/Singleton";

/**
 * 音效管理类
 */
export class SoundManager extends Singleton
{
    public OnStart() {

    }

    public OnDestroy() {

    }

    /**
     * 播放背景音乐
     * @param soundId 音效ID
     * @param loop 循环次数,true表示无限循环。
     */
    public playMusic(url: string, loop: boolean = true): void {
        if (url != null) {
            Laya.SoundManager.playMusic(url, loop == true ? 0 : 1);
        }
    }

    /**
     * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）
     * @param volume 音量。初始值为1。音量范围从 0（静音）至 1（最大音量）
     */
    public setMusicVolume(volume: number): void {
        Laya.SoundManager.setMusicVolume(volume);
    }

    /**
     * 停止播放背景音乐（不包括音效）
     */
    public stopMusic(): void {
        Laya.SoundManager.stopMusic();
    }

    /**
     * 播放音效。音效可以同时播放多个
     * @param soundId 音效ID
     * @param loop 循环次数,true表示无限循环。
     */
    public playSound(url: string, loop: boolean = false): void {
        if (url != null) {
            Laya.SoundManager.playSound(url, loop == true ? 0 : 1);
        }
    }

    /**
     * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量
     * @param volume 音量。初始值为1。音量范围从 0（静音）至 1（最大音量）
     * @param soundId 音效ID
     */
    public setSoundVolume(volume: number, url?: string): void {
        if (url != null) {
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        else {
            Laya.SoundManager.setSoundVolume(volume);
        }
    }

    /**
     * 停止声音播放。此方法能够停止任意声音的播放（包括背景音乐和音效），只需传入对应的声音播放地址
     * @param soundId  音效ID
     */
    public stopSound(url: string): void {
        if (url != null) {
            Laya.SoundManager.stopSound(url);
        }
    }

    /**
     * 停止播放所有音效（不包括背景音乐）
     */
    public stopAllSound(): void {
        Laya.SoundManager.stopAllSound();
    }

    /**
     * 停止播放所有声音（包括背景音乐和音效）
     */
    public StopAll(): void {
        Laya.SoundManager.stopAll();
    }
}

 // // 单例
    // private static _class = null;
    // public static get instance():SoundManager{
    //     if (this._class == null) {
    //         this._class = new this();
    //     }
    //     return this._class;
    // }