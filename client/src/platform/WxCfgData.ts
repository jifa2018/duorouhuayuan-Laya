/**
* 微信SDK配置数据管理 
*/
/**服务器DNS域名 */
export let ResUrl;
/**全局wx对象 */
export let Wx;
/**分享标题 */
export let ShareTitle;
/**分享图片资源路径 */
export let ShareUrl;
/**banner 的广告位ID*/
export let adUnitId_Banner;
/**激励广告的广告位ID */
export let adUnitId_Excitation
/**登陆时获取授权的按钮图片地址 */
export let LoginIcon = "";
/**登陆时获取授权的按钮top值 */
export let LoginBtnTop = 0;
/**登陆时获取授权的按钮width值 */
export let LoginBtnWidth = 0;
/**登陆时获取授权的按钮Hight值 */
export let LoginBtnHight = 0;
/**GameID*/
export let GameID = "";

/**配置数据管理 */
export class WxCfgData {
	constructor(cls: any) {
		this.Initialize(cls);
	}

	/**初始化配置数据 */
	private Initialize(cls: any) {
		// ResUrl = cls['ResUrl'] || 'https://ssjxzh5-cdn-test.gyyx.cn/PHP/wxSDK.php';
		ResUrl = cls['ResUrl'] || 'https://ssjxzh5-wb-login.gyyx.cn/PHP/wxsdk_duorou.php';
		Wx = window['wx'];
		ShareTitle = cls['ShareTitle'] || '这是小游戏吗？简直不敢相信自己的眼睛！太华丽了!';
		ShareUrl = cls['ShareUrl'] || 'https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/wxsharepicture.jpg';
		adUnitId_Banner = cls['AdUnitId_Banner'];
		adUnitId_Excitation = cls['AdUnitId_Excitation'];
		LoginIcon = cls['LoginIcon'] || "https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/btn_login.png";
		LoginBtnTop = cls['LoginBtnTop'] || 0;
		LoginBtnWidth = cls['LoginBtnWidth'] || 0;
		LoginBtnHight = cls['LoginBtnHight'] || 0;
		GameID = cls['GameID'] || "plant"
	}
}