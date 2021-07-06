import { WxSDKBase } from "./WxSDKBase"
import { WxCfgData } from "./WxCfgData"
import { ResUrl, LoginIcon, LoginBtnWidth, LoginBtnHight, ShareTitle, ShareUrl, GameID } from "./WxCfgData"
import { MyPlayer } from "../game/MyPlayer";


/**
* 微信SDK对外接口 
*/
export  class WxSDKManager {
	private _wxSDKBase: WxSDKBase;
	/**小游戏openId */
	private _openId: string = '';
	/**小游戏session_key */
	private _sessionKey: string = '';
	/**小游戏已请求过的权限信息 */
	private _settingData: any = {};
	/**获取到的玩家数据 */
	private _userInfo: any = null;
	/**获取玩家的地理位置信息 */
	private _location: any = {};
	/**token信息 */
	private _access_token: string = '';
	/**玩家所有数据 */
	private _allUserData = {
		session_key: '',
		openId: '',
		encryptedData: '',
		iv: '',
		signature: '',
		rawData: ''
	}
	/**系统信息 */
	private _systemInfo: any;

	private _supportFunction = {
		"pay": true,   //支付
		"share": true,    //分享
		"ad": true   //广告
	}

	/**微信SDK的初始化 */
	constructor(cls: any) {
		let init = new WxCfgData(cls);
		this._wxSDKBase = new WxSDKBase();
	}

	/**
	 * 玩家登陆
	 * @param cb 回调函数
	 */
	public Login(cb?: any): void {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let that = this;
			let loginCallBack = {
				successFn: function (res) {
					let urlParam = '?code=' + res.code + '&gameId=' + GameID
					that._wxSDKBase.Request(ResUrl + urlParam, () => {
						cb.failFn && cb.failFn();
					}, (res) => {
						res = res['data'];
						if (res['status'] != 0) {
							cb.failFn && cb.failFn();
						} else {
							that._openId = res['openid'];
							that._sessionKey = res['session_key'];
							that._allUserData['openId'] = res['openid'];
							that._allUserData['session_key'] = res['session_key'];
							// that.CheckData(cb);
							cb.successFn && cb.successFn(res);
						}
					}, 'Get', {})
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}

			//调用登录
			this._wxSDKBase.Login(loginCallBack)
		}
	}

	/**
	 *  向用户发起授权请求
	 * @param location x:number,y:number
	 * @param cb 回调函数
	 */
	public Authorize_UserInfo(location?: any, cb?: any) {
		// 先获取用户是否授权
		this.GetSetting({
			successFn: (res) => {
				let w = this._systemInfo.windowWidth || 750;
				let h = this._systemInfo.windowHeight || 1334;
				var authSetting = res.authSetting;
				if (authSetting['scope.userInfo'] == true) {
					// 用户已经授权
					let getUserInfoCallBack = {
						successFn: function (res) {
							//已授权
							cb.success && cb.success();
						},
						failFn: function () {
							cb.failFn && cb.failFn();
						}
					}
					// 获取UserInfo
					let param = {
						withCredentials: true,
						lang: ""
					}
					this.GetUserInfo(param, getUserInfoCallBack);
				}
				else {
					// 用户没有授权的情况下创建按钮获取用户个人信息授权
					let userInfoBtn = Laya.Browser.window.wx.createUserInfoButton({
						type: "text",
						text: "",
						style: {
							left: 0,
							top: 0,
							width: Laya.Browser.window.wx.getSystemInfoSync().screenWidth,
							height: Laya.Browser.window.wx.getSystemInfoSync().screenHeight,
							lineHeight: 40,
							backgroundColor: '#00000000',
							color: '#ffffff',
							textAlign: 'center',
							fontSize: 16,
							borderRadius: 4
						}
					})

					userInfoBtn.onTap((res => {
						if (res.errMsg == "getUserInfo:ok") {//如果点击了确定登陆
							// 获取用户登录信息
							let param = {
								withCredentials: true,
								lang: ""
							}
							let userInfoCallBack = {
								successFn: function (res) {
									//已授权
									cb.success && cb.success();
								},
								failFn: function () {
									cb.failFn && cb.failFn();
								}
							}
							this.GetUserInfo(param,userInfoCallBack);
							userInfoBtn.destroy();//销毁按钮
						} else {
							console.log("");
							cb.failFn && cb.failFn();
							userInfoBtn.destroy();//销毁按钮
						}
					}));
				}
			}
		})
	}

	/**
	 * 分享
	 * @param param 分享的参数设置 {title: '', imageUrl: '', query: ''}
	 * @param content 分享内容
	 * @param imageUrl 分享的图标
	 * @param cb 分享回调，微信API没有明确标出回调，有可能收不到
	 */
	public Share(play_name: string,param?: any, cb?: any) {
		if (Laya.Browser.window.wx) {
			param = param || {
				title: ShareTitle,
				imageUrl: ShareUrl
			};
			cb = cb || {};
			let shareCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.Share(param, shareCallBack);
			//todo 需要添加分享成功或者失败的规则
			Laya.timer.once(500, this, function () {
				cb.successFn && cb.successFn();
			})

		}
		
        MyPlayer.ReqPlayLog("分享", play_name)
	}

	/**
	 * 显示转发按钮
	 * @param param 附加参数 {withShareTicket: false}
	 * @param cb 回调函数
	 */
	public ShowShareMenu(param?: any, cb?: any) {
		if (Laya.Browser.window.wx) {
			param = param || {};
			cb = cb || {};
			let showShareCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.ShowShareMenu(param, showShareCallBack);
		}
	}

	/**
	 * 隐藏转发按钮
	 * @param cb 回调函数
	 */
	public HideShareMenu(cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let hideShareCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.HideShareMenu(hideShareCallBack);
		}
	}

	/**
	 * 获取用户信息
	 * @param param 附加参数 {withShareTicket: false, lang: 'en'}
	 * @param cb 回调函数
	 */
	public GetUserInfo(param?: any, cb?: any): any {
		if (this._userInfo != undefined && this._userInfo != null) {
			return this._userInfo;
		}
		if (Laya.Browser.window.wx) {
			param = param || {};
			cb = cb || {};
			let that = this;
			let getUserInfoCallBack = {
				successFn: function (res) {
					that._userInfo = res.userInfo;
					that._allUserData['encryptedData'] = res['encryptedData'];
					that._allUserData['rawData'] = res['rawData'];
					that._allUserData['signature'] = res['signature'];
					that._allUserData['iv'] = res['iv'];
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			return this._wxSDKBase.GetUserInfo(param, getUserInfoCallBack);
		}
		else {
			return {};
		}
	}

	/**
	 * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
	 * @param cb 回调函数
	 */
	public GetSetting(cb?: any) {
		if (Laya.Browser.window.wx) {
			let that = this;
			cb = cb || {};
			let getSettingCallBack = {
				successFn: function (res) {
					that._settingData = res['authSetting'];
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.GetSetting(getSettingCallBack);
		}
	}

	/**
	 * 打开地图选择位置。
	 * @param cb 回调函数
	 */
	public ChooseLocation(cb?: any) {
		if (Laya.Browser.window.wx) {
			let that = this;
			cb = cb || {};
			let getSettingCallBack = {
				successFn: function (res) {
					that._settingData = res['authSetting'];
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.ChooseLocation(getSettingCallBack);
		}
	}

	/**
	 * 调起客户端小程序设置界面 (成功时返回用户授权结果authSetting)
	 * @param cb 回调函数
	 */
	public OpenSetting(cb?: any) {
		if (Laya.Browser.window.wx) {
			let that = this;
			cb = cb || {};
			let openSettingCallBack = {
				successFn: function (res) {
					that._settingData = res;
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.OpenSetting(openSettingCallBack);
		}
	}

	/**
	 * 向用户发起授权请求
	 * @param scope 授权列表('scope.userLocation', 'scope.werun', 'scope.writePhotosAlbum')
	 * @param cb 回调函数
	 */
	public Authorize(scope: string, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let authorizeCallBack = {
				successFn: function () {
					cb.successFn && cb.successFn();
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.Authorize(scope, authorizeCallBack);
		}
	}

	/**
	 * 获取当前的地理位置、速度, 调用前需要用户授权('scope.userLocation')
	 * @param cb 回调函数
	 */
	public GetLocation(cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let that = this;
			let getLocationCallBack = {
				successFn: function (res) {
					that._location = res;
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.GetLocation(getLocationCallBack);
		}
	}

	/**
	 * 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
	 * @param cb 回调函数
	 */
	public ChooseAddress(cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let that = this;
			let getLocationCallBack = {
				successFn: function (res) {
					that._location = res;
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.GetLocation(getLocationCallBack);
		}
	}

	/**
	 * 保存图片到系统相册，需要用户授权('scope.writePhotosAlbum')
	 * @param filePath 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
	 * @param cb 回调函数
	 */
	public SaveImageToPhotosAlbum(filePath: string, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.SaveImageToPhotosAlbum(filePath, saveImageCallBack);
		}
	}

	/**获取当前小游戏的权限信息 */
	public GetSettingStatus(str: string): boolean {
		return this._settingData[str] || false;
	}



	/**
	 * 上传微信所需要保存的数据，例如分数等,  
	 * @param key
	 * @param value 
	 * @param cb 回调函数
	 */
	public WxUpload(key: string, value: any, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.WxUpload(key, value, saveImageCallBack);
		}
	}

	/**
	 * 发信息到子域
	 * @param strData 需要转成json字符串的形式 
	 */
	public SendMsgToSub(strData: string, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					console.log("错误1  包装成功返回错误");

					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.SendMsgToSub(strData, saveImageCallBack);
		}
	}

	/**
	 * 验证玩家数据
	 */
	public CheckData(cb: any) {
		if (Laya.Browser.window.wx) {
			let that = this;
			let obj = {
				rawData: this._allUserData["rawData"],
				signature: this._allUserData["signature"],
				encryptedData: this._allUserData["encryptedData"],
				iv: this._allUserData["iv"],
				session_key: this._allUserData['session_key'],
				gameId: ""
			}
			this._wxSDKBase.Request(ResUrl, () => {
				cb.failFn && cb.failFn();
			}, (res) => {
				if (res.data.status == 0) {
					that._access_token = JSON.parse('' + res.data.access_token).access_token;
					console.log('---------CheckData success--------------------', that._access_token);
				} else {
					console.log(res.data.msg);
					cb.failFn && cb.failFn();
				}
			}, 'Get', obj)
		}
	}

	/**
	  * 生成二维码
	  */
	public Qr_Code(cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.QR_Code(this.access_token, saveImageCallBack);
		}
	}
	/**删除某一个key的数据*/
	public RemoveData(key: string, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				}
			}
			this._wxSDKBase.RemoveData(key, cb);
		}
	}
	/**拉起Banner广告 */
	public WxBanner(adUnitId?: string, width?: number, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				},
				// errorFn function () {
				// 	cb.errorFn && cb.errorFn();
				// }
			}
			this._wxSDKBase.Establish(adUnitId, width, cb);
		}
	}
	/**销毁Banner广告*/
	public DeleteBanner() {
		this._wxSDKBase.DeleteBanner();
	}
	/**拉起激励广告 */
	public CreateExcitation(adUnitId?: string, cb?: any) {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			let saveImageCallBack = {
				successFn: function (res) {
					cb.successFn && cb.successFn(res);
				},
				failFn: function () {
					cb.failFn && cb.failFn();
				},
				errorFn: function () {
					cb.errorFn && cb.errorFn();
				}
			}
			this._wxSDKBase.CreateExcitation(adUnitId, saveImageCallBack);
		}
	}
	/**拉起支付 */
	public WxPayment(data: any, cb?: any): void {
		if (Laya.Browser.window.wx) {
			cb = cb || {};
			this._wxSDKBase.payment(cb);
		}

	}

	/**小游戏初始参数，邀请用 */
	public GetLaunchOptionsSync(): any {
		if (Laya.Browser.window.wx) {
			return this._wxSDKBase.GetLaunchOptionsSync();
		}
	}

	/**监听小游戏回到前台的事件 */
	public OnShow(cb: any): void {
		this._wxSDKBase.OnShow(cb);
	}
	/**
	 * 获取系统信息
	 */
	public GetSystemInfo(cb?: any) {
		if (Laya.Browser.window.wx) {
			let that = this;
			let getSystemInfoCallBack = {
				successFn: function (res) {
					that._systemInfo = res;
					if(cb!=null)
					cb.successFn && cb.successFn();
				}
			}
			this._wxSDKBase.GetSystemInfo(getSystemInfoCallBack);
		}
	}

	/**获取openId */
	public get openId(): string {
		return this._openId || '';
	}

	/**获取用户信息
	 * string nickName 用户昵称
	 * string avatarUrl 用户头像图片的 URL
	 * number gender 用户性别 0未知 1男性 2女性
	 * string country 用户所在国家
	 * string province 用户所在省份
	 * string city 用户所在城市
	 * string language 显示 country，province，city 所用的语言 en英文 zh_CN简体中文 zh_TW繁体中文
	 */
	public get userInfo(): any {
		return this._userInfo || {};
	}

	/**
	 * 获取到地理位置信息
	 * latitude	number	纬度，范围为 -90~90，负数表示南纬
	 * longitude	number	经度，范围为 -180~180，负数表示西经	
	 * speed	number	速度，单位 m/s	
	 * accuracy	number	位置的精确度	
	 * 	altitude	number	高度，单位 m	>= 1.2.0
	 * verticalAccuracy	number	垂直精度，单位 m（Android 无法获取，返回 0）	>= 1.2.0
	 * horizontalAccuracy	number	水平精度，单位 m	>= 1.2.0
	 */
	public get location(): any {
		return this._location || {};
	}

	public get access_token(): string {
		return this._access_token || '';
	}

	/**
	 * 获取到系统信息
	 * brand	string	手机品牌	1.5.0
	 * model	string	手机型号	
	 * pixelRatio	number	设备像素比
	 * screenWidth	number	屏幕宽度
	 * screenHeight	number	屏幕高度
	 * windowWidth	number	可使用窗口宽度
	 * windowHeight	number	可使用窗口高度
	 * statusBarHeight	number	状态栏的高度
	 * language	string	微信设置的语言
	 * version	string	微信版本号
	 * system	string	操作系统版本
	 * platform	string	客户端平台
	 * fontSizeSetting	number	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。
	 * SDKVersion	string	客户端基础库版本
	 * benchmarkLevel	number	(仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50)
	 */
	public get systemInfo(): any {
		return this._systemInfo
	}
	/**
	  * 跳转另一个程序
	  */
	public NavigateToMiniProgram(appid: string, path: string, extraData: any, cb: any) {
		let getJumpCallBack = {
			successFn: function (res) {

			},
			failFn: function () {

			}
		}
		this._wxSDKBase.NavigateToMiniProgram(appid, path, extraData, getJumpCallBack);
	}

	/**是否支持某项操作 */
	public GetSupport(i_strFunc: string): boolean {
		return this._supportFunction[i_strFunc] || false;
	}

	/**打开游戏圈 */
	public CreateGameClubButtonShow(data: any): void {
		this._wxSDKBase.CreateGameClubButtonShow(data);
	}
	/**隐藏游戏圈 */
	public CreateGameClubButtonHide(): void {
		this._wxSDKBase.CreateGameClubButtonHide();
	}
	/**销毁游戏圈 */
	public CreateGameClubButtonDestroy(): void {
		this._wxSDKBase.CreateGameClubButtonDestroy();
	}
}