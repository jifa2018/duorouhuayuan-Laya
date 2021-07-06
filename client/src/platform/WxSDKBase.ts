/**
*  微信SDK底层类
*/
import { Wx, adUnitId_Banner } from "./WxCfgData"

let bannerAd;
let GameClubButton;
//let videoAd = 
export class WxSDKBase {
	private _shareTicket: string;
	public get getShareTicket(): string {
		return this._shareTicket;
	}

	constructor() {

	}

	/**
	 * 登录
	 * @param cb 回调函数
	 */
	public Login(cb: any): void {
		//调用接口wx.login() 获取临时登录凭证（code）
		Wx.login({
			fail: function (res) {
				console.log("Get Login Code Fail");
				cb.failFn && cb.failFn();
			},
			success: function (res) {
				cb.successFn && cb.successFn(res);
			}
		});
	}

	/**
	 * 微信网络请求
	 * @param url 请求地址
	 * @param failCb 失败回调
	 * @param successCb 成功回调
	 * @param method Get Post
	 */
	public Request(url, failCb, successCb, method, data) {
		Wx.request({
			url: url,
			method: method,
			data: data,
			fail: function (res) {
				failCb && failCb();
			},
			success: function (res) {
				successCb && successCb(res);
			}
		});
	}

	/**
	 * 分享
	 * @param param 分享的参数设置 {content: '', image: '', query: {}} 参数不能出现空字符串
	 * @param cb 分享回调，微信API没有明确标出回调，有可能收不到
	 */
	public Share(param: any, cb: any) {
		Wx.shareAppMessage({
			title: param['title'] + '',//内容
			imageUrl: param['imageUrl'] + '',//图片
			query: param['query'] + '',//查询字符串
			success(res) {
				console.log(res);
				this._shareTicket = res.shareTicket[0]
				cb.successFn && cb.successFn(res);
			},
			fail(res) {
				console.log("Try To Share Fail");
				cb.failFn && cb.failFn();
			}
		});
	}
	/**更新转发属性 */
	public updateShareMenu() {
		Wx.updateShareMenu({
			withShareTicket: true,
			success: (res) => { },
			fail: (res) => { },
			complete: (res) => {

			}
		})
	}
	/**
	 * 显示转发按钮
	 * @param param 附加参数 {withShareTicket: false}
	 * @param cb 回调函数
	 */
	public ShowShareMenu(param: any, cb: any) {
		Wx.showShareMenu({
			withShareTicket: param['withShareTicket'] || false,
			success() {
				cb.successFn && cb.successFn();
			},
			fail() {
				cb.failFn && cb.failFn();
			}
		});
	}

	/**
	 * 隐藏转发按钮
	 * @param cb 回调函数
	 */
	public HideShareMenu(cb: any) {
		Wx.hideShareMenu({
			success() {
				cb.successFn && cb.successFn();
			},
			fail() {
				cb.failFn && cb.failFn();
			}
		});
	}

	/**
	 * 获取用户信息
	 * @param param 附加参数 {withShareTicket: false}
	 * @param cb 回调函数
	 */
	public GetUserInfo(param: any, cb: any): any {
		Wx.getUserInfo({
			withShareTicket: param['withShareTicket'] || false,
			lang: param['lang'] || 'en',
			success(res) {
				cb.successFn && cb.successFn(res);
			},
			fail() {
				cb.failFn && cb.failFn();
			}
		})

	}

	/**
	 * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
	 * @param cb 回调函数
	 */
	public GetSetting(cb: any) {
		Wx.getSetting({
			fail: function (res) {
				console.log('Get User Setting fail');
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		});
	}

	/**
	 * 打开地图选择位置。
	 * @param cb 回调函数
	 */
	public ChooseLocation(cb: any) {
		Wx.chooseLocation({
			fail: function (res) {
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		});
	}

	/**
	 * 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
	 * @param cb 回调函数
	 */
	public ChooseAddress(cb: any) {
		Wx.chooseAddress({
			fail: function (res) {
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		});
	}

	/**
	 * 调起客户端小程序设置界面 (成功时返回用户授权结果authSetting)
	 * @param cb 回调函数
	 */
	public OpenSetting(cb: any) {
		Wx.openSetting({
			fail: function (res) {
				console.log('Open User Setting fail');
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		});
	}

	/**
	 * 向用户发起授权请求,重复获取某一权限将不能吊起授权界面
	 * @param scope 授权列表('scope.userLocation', 'scope.werun', 'scope.writePhotosAlbum')
	 * @param cb 回调函数
	 */
	public Authorize(scope: string, cb: any) {
		Wx.authorize({
			scope: scope,
			fail: function (res) {
				console.log('Open User Setting fail');
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		})
	}

	/**
	 * 此处需要特殊处理scope.userInfo授权请求
	 */

	/**
	 * 获取当前的地理位置、速度, 调用前需要用户授权('scope.userLocation')
	 * @param param 附加参数
	 * @param cb 回调函数
	 */
	public GetLocation(cb: any) {
		Wx.getLocation({
			fail: function () {
				console.log('GetLocation fail');
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		})
	}

	/**
	 * 保存图片到系统相册，需要用户授权('scope.writePhotosAlbum')
	 * @param filePath 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
	 * @param cb 回调函数
	 */
	public SaveImageToPhotosAlbum(filePath: string, cb: any) {
		Wx.saveImageToPhotosAlbum({
			filePath: filePath,
			fail: function () {
				console.log('SaveImageToPhotosAlbum fail');
				cb.failFn && cb.failFn();
			},
			success: (res) => {
				cb.successFn && cb.successFn(res);
			}
		})
	}

	/**
	 * 上传微信所需要保存的数据，例如分数等,  
	 * @param key
	 * @param value 
	 * @param cb 回调函数
	 */
	public WxUpload(key: string, value: any, cb?: any): void {
		Wx.setUserCloudStorage({
			KVDataList: [{ key: "" + key, value: "" + value }],
			success: function (res) {
				cb.successFn && cb.successFn(res);
			},
			fail: function () {
				cb.failFn && cb.failFn();
			}
		});

	}

	/**
	* 发信息到子域
	* @param strData 需要转成json字符串的形式 
	*/
	public SendMsgToSub(strData: string, cb?: any) {
		if (Laya.Browser.onMiniGame) {
			Wx.getOpenDataContext().postMessage({
				message: strData,
				success(res) {
					console.log("错误2  底层成功返回错误");
					cb.successFn && cb.successFn(res);
				},
				fail: function () {
					cb.failFn && cb.failFn();
				}
			})
		}
	}

	/**
	 * 生成二维码 
	*/
	public QR_Code(access_token: any, cb?: any) {
		let param = {
			access_token: access_token
		}
		Wx.request({
			url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit",
			method: 'POST',
			data: 'access_token=' + param,
			fail: function (res) {
				cb && cb.failFn(res);
			},
			success: function (res) {
				console.log("二维码的返回值");
				console.log(res);

				cb && cb.successFn(res);
			}
		});
	}
	/**删除用户托管的数据 */
	public RemoveData(key: string, cb?: any) {
		Wx.removeUserCloudStorage({
			keyList: [key],
			success: function (res) {
				cb.successFn && cb.successFn(res);
			},
			fail: function (res) {
				cb.failFn && cb.failFn(res);
			}
		});
	}

	/**Banner广告 */
	public Establish(adUnitId?: string, width?: number, cb?: any) {
		this.DeleteBanner();
		/**获取实际的宽高 */
		let screenWidth = Wx.getSystemInfoSync();
		let screenHeight = Wx.getSystemInfoSync();
		bannerAd = Wx.createBannerAd({
			adUnitId: adUnitId || adUnitId_Banner,
			style: {
				left: 0,
				top: 0,
				width: 200,
				height: 0
			},
			success(res) {
				cb.successFn && cb.successFn(res);
			}
		})
		bannerAd.onError(res => {
			console.log(res);
			bannerAd.offError();
			cb.errorFn && cb.errorFn(res);
		});
		bannerAd.onResize(res => {
			console.log(res.width, res.height)
			console.log(bannerAd.style.realWidth, bannerAd.style.realHeight)
			bannerAd.style.left = (screenWidth - bannerAd.style.realWidth) / 2;
			bannerAd.style.top = screenHeight - bannerAd.style.realHeight;
			//bannerAd.style.height = 120;
		})
		// bannerAd.onResize()

		bannerAd.show();
	}
	/**销毁Banner广告 */
	public DeleteBanner() {
		if (bannerAd) {
			bannerAd.destroy();
		}
		console.log("销毁");

	}
	/**激励视频 */
	public CreateExcitation(adUnitId?: string, cb?: any) {
		this.DeleteBanner();
		let videoAd = Wx.createRewardedVideoAd({
			adUnitId: adUnitId
		})
		videoAd.load()
			.then(() => videoAd.show())
			.catch(err => console.log(err.errMsg))
		videoAd.onLoad((res) => {
			console.log("激励广告 广告加载成功");
			videoAd.offLoad();
		})
		// videoAd.show((res) => {
		// 	console.log("激励视频 广告显示");
		// })
		videoAd.onError(res => {
			console.log(res);
			videoAd.offError();
			cb.errorFn && cb.errorFn(res);
		});
		videoAd.onClose(res => {
			//用户点击关闭按钮 没有看完视频点击关闭
			if (res && res.isEnded || res == undefined) {
				// 正常播放结束，可以下发游戏奖励
				cb.successFn && cb.successFn(res);
			}
			else {
				// 播放中途退出，不下发游戏奖励
				cb.failFn && cb.failFn(res);
			}
			videoAd.offClose()
		})
	}
	/**拉起支付 */
	public payment(cb?: any): void {
		Wx.requestMidasPayment({
			mode: 'game',
			env: "1",
			offerId: '1450016739',
			currencyType: "CNY",
			buyQuantity: 10,
			zoneId: 1,
			platform: "android",
			success() {
				// 支付成功
				console.log("支付成功");
				cb.success && cb.success();
			},
			fail() {
				// 支付失败
				console.log("支付失败");
				cb.fail && cb.fail();

			}
		})
	}

	/**
	 * 小游戏初始参数
	 */
	public GetLaunchOptionsSync(): any {
		return Wx.getLaunchOptionsSync();
	}

	/**
	 * 监听小游戏回到前台的事件
	 */
	public OnShow(cb: any): void {
		Wx.onShow(cb)
	}
	/**
	 * 获取系统信息
	 */
	public GetSystemInfo(cb) {
		Wx.getSystemInfo({
			success(res) {
				cb.successFn && cb.successFn(res);
			},
			fail() {
				cb.failFn && cb.failFn();
			}
		})
	}

	/**
	 * 跳转另一个小程序
		*/
	public NavigateToMiniProgram(appid: string, path: string, extraData: any, cb: any) {
		Wx.navigateToMiniProgram({
			appId: appid,
			path: path,
			extraData: extraData,
			success(res) {
				cb.successFn && cb.successFn(res);
			},
			fail() {
				cb.failFn && cb.failFn();
			}
		})
	}

	/**
	 * 打开游戏圈
	 */
	public CreateGameClubButtonShow(data: any): void {
		//游戏圈按钮
		GameClubButton = Wx.createGameClubButton(data)
		GameClubButton.show();
	}

	/**
		  * 隐藏游戏圈
	  */
	public CreateGameClubButtonHide(): void {
		GameClubButton.hide();
	}

	/**
		  * 销毁游戏圈
	  */
	public CreateGameClubButtonDestroy(): void {
		GameClubButton.destroy();
	}
}