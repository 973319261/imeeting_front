<template>
	<view class="content">
    <image
      :src="authMeeting.coverPicture"
      mode="scaleToFill" class="img"></image>
		<view style="margin-top: 12rpx;padding-right: 60rpx;padding-left: 60rpx;">
			<button v-if="nickName" @click="loginReg"
				      style="line-height:1.6;border-radius: 40rpx;text-align: center;height: 80rpx;background-color: #3CC51F;"
			>
				<text style="padding-top: 18rpx;height: 40rpx;color: white;font-size: 32rpx;text-align: center;display: inline-block;">{{i18n.authorized}}</text>
			</button>
			<button v-else
				      open-type="getUserInfo"
				      @getuserinfo="bindGetUserInfo"
				      withCredentials="true"
				      style="line-height:1.6;border-radius: 40rpx;text-align: center;height: 80rpx;background-color: #3CC51F;"
			>
				<text style="padding-top: 18rpx;height: 40rpx;color: white;font-size: 32rpx;text-align: center;display: inline-block;">{{i18n.wx_login}}</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nickName:'',
			avatarUrl:'',
			phone:'',
			imgsrc: '',
      meetingId: '',
      authMeeting: {}
		};
	},
	onLoad(options) {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.login
		})
    this.meetingId = options.id;
		uni.setStorageSync('user_id', 0);
		uni.setStorageSync('needAuth', 2);
    this.authMeeting = uni.getStorageSync('authMeeting');
	},
	computed: {
	  i18n () {  
	    return this.$t('index')  
	  },
	},
	methods: {
		onGetPhoneNumber(e) {
			let that = this;
			console.log("onGetPhoneNumber", e);
			console.log(e.detail.errMsg);
			console.log(e.detail.iv);
			console.log(e.detail.encryptedData);
			let session_key=uni.getStorageSync('session_key');
			uni.request({
				url:getApp().globalData.apiurl+'/rest/getPhoneNumber',
				data: {
					sessionKey:session_key,
					iv:e.detail.iv,
					encryptedData: e.detail.encryptedData,
				}, 
				header: {
					Authorization: uni.getStorageSync('token')
				}, 
				success: (res) => {
					console.log(res.data);
					let data1=JSON.parse(res.data.data);
					console.log(data1.phoneNumber);
					that.phone=data1.phoneNumber;
				}
			});
		},
		loginReg() {
			uni.redirectTo({
				url: '/pages/my/login?meetingId=' + this.meetingId
			});
		},
		userAgree() {
			console.log('userAgree:');
			uni.navigateTo({
				url: './help/helpview?cid=2'
			});
		},
		userPrivacy() {
			console.log('userPrivacy:');
			uni.navigateTo({
				url: './help/helpview?cid=3'
			});
		},
		userType() {
			uni.setStorageSync('role', 'guest');
			uni.setStorageSync('fristAuth', 'one');
			uni.navigateBack();
		},
		bindGetUserInfo() {
			var that=this;

			//防止重复授权 如果已授权
			var isAuthorize = uni.getStorageSync('isAuthorize');
			if (isAuthorize) {
				uni.openSetting({
					success(res) {
						console.log(res.authSetting);
					}
				});
			}
			uni.getUserInfo({
				provider: getApp().globalData.appflag,
				fail: function(infoRes) {
				},
				success: function(infoRes) {
					that.nickName=infoRes.userInfo.nickName;
					that.avatarUrl=infoRes.userInfo.avatarUrl;
					let nickName = infoRes.userInfo.nickName;
					let avatarUrl = infoRes.userInfo.avatarUrl;
					uni.setStorageSync('avatarUrl', avatarUrl);
					uni.request({
						url: getApp().globalData.apiurl + '/rest/bindUser',
						data: {
							avatarUrl: avatarUrl,
							nickName: nickName,
							phone: ''
						},
						header: {
							Authorization: uni.getStorageSync('token')
						},
						method: 'GET',
						success: res => {
              uni.request({
                url: getApp().globalData.apiurl + '/rest/getUserInfo',
                header: {
                  'content-Type': 'application/json;charset=UTF-8',
                  'Authorization': uni.getStorageSync('token')
                },
                method: 'GET',
                success: function(res) {
                  uni.setStorageSync('userInfo', res.data.data);
                  uni.showToast({
								    title:that.i18n.authorized_success,
								    icon: 'none'
							    });
                  /* uni.navigateBack(); */
                  uni.navigateTo({
					          url: '/pages/index/lists?id=' + that.meetingId
				          });
                }
              });
						}
					});
				}
			});
		}
	}
};
</script>

<style>
.content {
	padding-top: 20rpx;
	box-sizing: border-box;
	/* text-align: center; */
	/* background-color: #007AFF; */
}
.img {
  width: 100%;
  height: 320rpx;
  border-radius: 5rpx;
  margin: 0 auto;
}
</style>
