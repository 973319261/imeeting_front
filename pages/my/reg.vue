<template>
	<view>
		<!-- 文本框 -->
		<ul class="user-info">
			<!-- 电话 -->
			<li>
			  <view class="right-box">
			    <span class="label">
			      {{i18n.phone}}
			    </span>
			    <div>
			      <input type="number" class="input" v-model="mobile" :placeholder="i18n.phone_hine" />
			    </div>
			  </view>
			</li>

			<!-- 公司名称 -->
			<li>
			  <view class="right-box">
			    <span class="label">
			      {{i18n.company_name}}
			    </span>
			    <div>
			      <input type="text" class="input" v-model="name" :placeholder="i18n.company_name_hint" />
			    </div>
			  </view>
			</li>

			<!-- 企业联系人 -->
			<li>
			  <view class="right-box">
			    <span class="label">
			      {{i18n.contacts}}
			    </span>
			    <div>
			      <input type="text" class="input" v-model="corpUserName" :placeholder="i18n.contacts_hine" />
			    </div>
			  </view>
			</li>

			<!-- 邮箱 -->
			<li>
			  <view class="right-box">
			    <span class="label">
			      {{i18n.email}}
			    </span>
			    <div>
			      <input type="text" class="input" v-model="email" :placeholder="i18n.email_hine" />
			    </div>
			  </view>
			</li>

			<!-- 所属行业 -->
			<li>
			  <view class="right-box">
			    <span class="label">
			      {{i18n.industry}}
			    </span>
			    <div>
			      <input type="text" class="input" v-model="industry" :placeholder="i18n.industry_hine" />
			    </div>
			  </view>
			</li>

			<!-- 国家和地区 -->
			<li>
				<view class="right-box">
				  <picker @change="bindPickerChange" :value="index" :range="addresslist" style="width: 100%;">
				  <span class="label"> {{i18n.countries}}</span>
					<input class="right-select" name="address" :value="addresslist[index]" type="text" disabled="disabled" :placeholder="i18n.countries_hine" />
				  </picker>
				  <view class="iconfont iconmore1"></view>
				</view>
			</li>


		</ul>

		<!-- 文本域 -->
		<div>
			<!-- 公司简介 -->
			<!-- 标题 -->
			<p class="tip">{{i18n.company}}</p>
			<!-- 内容 -->
			<div>
			   <textarea class="des" :placeholder="i18n.company_hint" v-model="corpInfo" />
			</div>

			<!-- 产品简介 -->
			<!-- 标题 -->
			<p class="tip">{{i18n.product}}</p>
			<!-- 内容 -->
			<div>
			   <textarea class="des" :placeholder="i18n.product_hint" v-model="productInfo" />
			</div>

			<!-- 企业需求 -->
			<p class="tip">{{i18n.enterprise}}</p>
			<div>
			   <textarea class="des" :placeholder="i18n.enterprise_hint" v-model="corpNeeds" />
			</div>

		</div>


		<!-- 按钮 -->
		<div class="op">
		  <button type="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo"
						withCredentials="true"> {{i18n.register_submit}}</button>
		</div>
	</view>

</template>

<script>
import upfile from '@/components/upfile.vue';

export default {
	components: {
		upfile
	},
	data() {
		return {
			index: '',
			oksubmit: true,
			name: '',
			industry: '',
			address: '',
			corpInfo: '',
			productInfo: '',
			corpNeeds: '',
			bank: '',
			addresslist: [],
      mobile: '',
      email: '',
      avatar: '',
		};
	},
	onLoad(options) {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.register
		});
		this.$data.addresslist= [this.i18n.china, this.i18n.america,
		                         this.i18n.eu, this.i18n.japan,this.i18n.korea, this.i18n.other_regions];
		this.meetingId = options.meetingId;
	},
	computed: {
	  i18n () {
	    return this.$t('index')
	  },
	},
	onShow() {},
	methods: {
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
				success: function(infoRes) {
					console.log(JSON.stringify(infoRes));
					uni.setStorageSync('userInfo', JSON.stringify(infoRes));
					that.nickName=infoRes.userInfo.nickName;
					that.avatarUrl=infoRes.userInfo.avatarUrl;
					let nickName = infoRes.userInfo.nickName;
					let avatarUrl = infoRes.userInfo.avatarUrl;
          that.avatar = avatarUrl;
					uni.setStorageSync('avatarUrl', avatarUrl);
					uni.request({
						url: getApp().globalData.apiurl + '/rest/bindUser',
						data: {
							avatarUrl: avatarUrl,
							nickName: nickName,
							phone: that.mobile,
						},
						header: {
							Authorization: uni.getStorageSync('token')
						},
						method: 'GET',
						success: res => {
              that.formSubmit();
              uni.setStorageSync('isLogin', true);
              uni.setStorageSync('hasAuth', true);
							uni.setStorageSync('userinfo', JSON.stringify(res.data.data));
						}
					});
				}
			});
		},
    bindPickerChange(e) {
      this.index = e.target.value;
    },
		formSubmit() {
      const that = this;
			var name = this.name;
			if (name == '') {
				uni.showToast({
					title: this.i18n.company_name_failure,
					icon: 'none'
				});
				return;
			}
			var mobile = this.mobile;
			if (mobile == '' || mobile.length != 11) {
			  uni.showToast({
			    title: this.i18n.phone_format,
			    icon: 'none'
			  });
			  return;
			}

			uni.request({
				url: getApp().globalData.apiurl + '/meetingCorp/registCorp',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          Authorization: uni.getStorageSync('token')
        },
				data: {
					address: this.address,
					name: this.name,
          mobile: this.mobile,
          industry: this.industry,
          corpInfo: this.corpInfo,
          productInfo: this.productInfo,
          corpNeeds: this.corpNeeds,
          email: this.email,
          avatar: this.avatar,
					ttid: getApp().globalData.ttid,
					token: uni.getStorageSync('token'),
					userid: uni.getStorageSync('user_id'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					console.log(res.data);
					if (!res.data.success && res.data.msg) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					} else if (res.data.success) {
            uni.showToast({
							title: this.i18n.registered_successfully,
							icon: 'none'
						});
						uni.request({
              url: getApp().globalData.apiurl + '/rest/getUserInfo',
              header: {
                'content-Type': 'application/json;charset=UTF-8',
                'Authorization': uni.getStorageSync('token')
              },
              method: 'GET',
              success: function(res) {
                uni.setStorageSync('userInfo', res.data.data)
                uni.navigateBack({delta: 2});
              }
            });
					} else {
						uni.showToast({
							title: this.i18n.submit_failure,
							icon: 'none'
						});
					}
				}
			});
		}
	}
};
</script>

<style scoped lang="less">


.right-box {
 display: flex;
 position: relative;
 width: 100%;
 height: 110rpx;
 line-height: 110rpx;
 box-sizing: border-box;
 padding-right: 10rpx;
 padding-left: 10rpx;
 text-align: left;
 align-items: center;
 justify-content: space-between;
 font-size: 30rpx;
 border-bottom: 0.5rpx solid #eee;
}
.right-select{
  font-size: 30rpx;
  text-align: center;
  position: absolute;
  right: 50rpx;
  top: 35rpx;
  color: #333;
}
.user-info{
	padding:0 20rpx;
}
.user-info li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-info li .label {
 text-align: right;
  font-size: 30rpx;
  color: #000;
}

.user-info li input {
	width: 350rpx;
    font-size: 30rpx;
	text-align: right;
}
.des {
  border: 1rpx solid #eee;
  width: 89%;
  border-radius: 5rpx;
  padding: 10rpx;
  margin:10rpx 30rpx 10rpx 30rpx;
  font-size: 28rpx;
}
.tip {
  margin-left: 30rpx;
  padding: 20rpx 0rpx 10rpx 0rpx;
  font-size: 35rpx;
}
.op button {
  width: 700rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  margin-top: 50rpx;
  background-color: #2196f3;
}
.op {
  padding-bottom: 50rpx;
}
.iconfont {
	font-size: 50rpx;
	color: rgb(43, 42, 42);
	display: flex;
}
</style>
