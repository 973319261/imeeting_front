<template>
	<view class="content">
		<div class="login-hd">
      <img src="/static/img/left1.svg" />
      <h2>{{i18n.exhibitor_login}}</h2>
    </div>
		<!-- <view class="tab_box flex">
			   <view @click="tabClick(key)" :class="{'tab_item': true, 'tab_active': key == tabIndex}" v-for="(item,key) in tabs" :key="key">
				 {{item}}
			   </view>
		     </view> -->
		
		<view class="login_list">
			<view >
				<image src="/static/login/phone.png" mode="" style="width: 42rpx;height: 42rpx;"/>
			</view>
			<view style="flex-grow: 1;margin-left: 8px;font-size: 15px;">
				<input id="mobile" name="mobile" type="number" :placeholder="i18n.mobile_login_phone_hine"  style="font-size: 15px;" maxlength="11" @input="bindInputBlur"/> 
			</view>
		</view>
		
		<view class="login_list" v-if="tabIndex==0">
			<view >
				<image src="/static/login/lock.png" mode="widthFix" style="width: 42rpx;height: 42rpx;"/>
			</view>
			<view style="flex-grow: 1;margin-left: 8px;font-size: 15px;">
				<input id="psw" name="psw" type="text" password="password" :placeholder="i18n.mobile_login_password_hine"  style="font-size: 15px;" maxlength="11" @input="bindInputBlur"/>
			</view>
		</view>
		
		<view class="login_list" v-if="tabIndex==1">
			<view >
				<image src="/static/login/code.png" mode="widthFix" style="width: 42rpx;height: 42rpx;"/>
			</view>
			<view style="flex-grow: 1;margin-left: 8px;font-size: 15px;">
				<input id="code" name="code" type="number" value="" maxlength="6" :placeholder="i18n.mobile_login_sms_hine"  style="font-size: 15px;" @input="bindInputBlur"/>
			</view>
			<view>
				<text style="color: #FF8833;font-size: 13px;" @tap="sendCode" :disabled="disabled">{{send}}</text>
			</view>
		</view>
		
		
		
		<view style="margin: 20px;padding-top: 30rpx;">
			<button type="default" @tap="submitForm" style="background-color: #3CC51F;color: white;border: 0;font-size: 16px;">{{i18n.mobile_login_submit}}</button>
		</view>
		
		<view style="display: flex;margin: 10px;width: 90%;margin: 0 auto;">
			
			<view  style="width: 50%;text-align: right;font-size: 13px;color: #333333;display:  ;">
				<!-- 忘记密码？ -->
			</view>
			<view style="width: 50%;text-align: right;font-size: 13px;color: #333333;" @click="reg">
				{{i18n.mobile_login_hine}}
			</view>
		</view>
		
		<view style="margin: 20px;">
			<view style="font-size: 12px;color: #999999;">
				<!-- 登录即代表您已阅读并同意<text style="color: #F1242C;" @click="goRules">《平台用户协议与隐私政策》</text> -->
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabs:[],//验证码登录
			tabIndex: 0,
			disabled:false,
			send:'',
			mobile:'',
			psw:'', 
			code:'',
      meetingId: ''
		};  
	},
	onLoad(options) {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.mobile_login
		});
		this.$data.send=this.i18n.get_code;
		this.$data.tabs=[this.i18n.mobile_login]
	  this.meetingId = options.meetingId;
	},
	computed: {
	  i18n () {
	    return this.$t('index')
	  },
	},
	methods:{
		bindInputBlur: function (e) {
			console.log(e.target);
			if(e.target.id=='mobile'){this.mobile=e.target.value;}
			if(e.target.id=='psw'){this.psw=e.target.value;}
			if(e.target.id=='code'){this.code=e.target.value;}
		},
		goRules(){
			uni.navigateTo({
				url:'/pages/user/content?id=1'
			}) 
		},
		tabClick(arg){
			this.tabIndex=arg;
		},
		
		reg(){
			uni.navigateTo({
				url: '/pages/my/reg?meetingId=' + this.meetingId
			})
		},
		seeDetail(){
			uni.navigateTo({
				url: '/pages/detail/detail?type=1'
			})
		},
		submitForm(){
			let that = this
			//判断是否输入手机号
			if(that.mobile==''){
				uni.showToast({
					title: this.i18n.mobile_login_phone_hine,
					icon: 'none'
				});
				return;
			}
			var checkMobile=RegExp(/^1[3456789]\d{9}$/).test(that.mobile);
			if(!checkMobile){
				uni.showToast({title: this.i18n.phone_format,icon: 'none'});
				return;
			}
			var formdata={
				username:this.mobile,
				password:this.psw,
			}
			console.log(JSON.stringify(formdata));
			uni.request({
				url: getApp().globalData.apiurl+'/rest/login',
				header: {
					Authorization: uni.getStorageSync('token')
				},
				data: {
					username:this.mobile,
					password:this.psw,
					// verfiycode:this.code,
				},
				success: (res) => {
				  uni.setStorageSync('isLogin', true);
          uni.setStorageSync('loginToken', res.data.data);
					uni.request({
            url: getApp().globalData.apiurl + '/smallMeeting/listMyMeeting',
            header: {
              'content-Type': 'application/json;charset=UTF-8',
              'Authorization': res.data.data
            },
            method: 'GET',
            success: function(res) {
              uni.setStorageSync('loginData', res.data.data);
            }
          });
				  if(res.data.success){
						uni.showToast({
							title: this.i18n.login_successfully,
							icon: 'none'
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1500)
					}else{
						uni.showToast({
							title: this.i18n.login_failure,
							icon: 'none'
						});
					}
				}
			});
		},
		submitRegForm(){
		},
		sendCode(){
			let that = this
			if(that.disabled){
				return;
			}
			//判断是否输入手机号
			if(that.mobile==''){
				uni.showToast({
					title: this.i18n.mobile_login_phone_hine,
					icon: 'none'
				});
				return;
			}
			
			var checkMobile=RegExp(/^1[345678]\d{9}$/).test(that.mobile);
			if(!checkMobile){
				uni.showToast({title: this.i18n.phone_format,icon: 'none'});
				return;
			}
			
			//获取验证码
			uni.request({
				url: getApp().globalData.apiurl+'/user/smscode',
				data: {
					phone:this.mobile,
				}, 
				success: (res) => {
				  console.log(res.data);
				  if(res.data.errno==0){
						uni.showToast({
							title:this.i18n.sms_successfully,
							icon: 'none'
						});
						
					}else{
						uni.showToast({
							title: this.i18n.sms_failure,
							icon: 'none'
						});
					}
				}
			});
			
			//验证码
			that.disabled = true;
			var time = 60;                //时间为10s，可以按情况更改 
			var timer = setInterval(fun, 1000);  //设置定时器 
			function fun() { 
				time--; 
				if(time>=0) { 
					that.send = time + "s"+this.i18n.resend_after; 
				}else if(time<0){ 
					that.send = this.i18n.afresh; 
					that.disabled = false;  //倒计时结束能够重新点击发送的按钮 
					clearInterval(timer);  //清除定时器 
					time = 10;  //设置循环重新开始条件 
				} 
			} 
		},
	}
}
</script>

<style scoped lang="less">
.tab_box{
	display: flex;margin-top: 96rpx;justify-content: left;align-items: center;
	.tab_item{
		padding-left: 45rpx;
		width: 50%;text-align: left;  
		// text-align: left;
		font-size: 18px;color: #CCCCCC;
		&.tab_active{
			color: #000000;
			font-weight: bold;font-size: 24px;
		}
	}
}

.login_list {
	display: flex;height: 50px;border-bottom:1rpx solid #DDDDDD;
	justify-content: center;align-items: center;margin: 20px;
}
.login-hd {
  text-align: center;
  margin-top: 30rpx;
}
.login-hd img {
  width: 100rpx;
  height: 100rpx;
}
</style>
