<template>
	<view class="content">
		<view class="head">
			<view class="title">{{ head_meeting.meetingName }}</view>
			<image :src="head_meeting.coverPicture" mode="scaleToFill" class="img"></image>
			<view class="flex" style="background-color: #F8F8F8;padding: 10rpx;">
				<view class="flex box ">
					<view class="v_img"><image src="/static/img/date_icon.png" mode="widthFix" class="img"></image></view>
					<view class="v_right">{{ head_meeting.meetingStartTime }}</view>
				</view>

				<view class="flex box ">
					<view class="v_img"><image src="../../static/img/address_icon.png" mode="widthFix" class="img"></image></view>
					<view class="v_right">{{ head_meeting.meetingAddress }}</view>
				</view>
			</view>
		</view>

		<view style="margin-top: 15rpx;background: #FFFFFF;margin: 20rpx;">
			<view class="meeting_title" @click="gomeetinglist">{{i18n.livemeeting}}</view>

			<view class="flex meeting " v-for="(item, key) in live_meeting" :key="key">
				<view class="shop_img_box"><image src="/static/img/left1.png" mode="widthFix" class="img"></image></view>
				<view class="shop_des">
					<view class="shop_name overhidemore">{{ item.liveName }}</view>
					<view class="price_number flex"><text class="price"></text></view>
				</view>
			</view>
		</view>

		<view style="margin-top: 15rpx;background: #FFFFFF;margin: 20rpx;">
			<view class="meeting_title">{{i18n.participate}}</view>

		<view class="tabbox flex1" style="">
				<view class="img_view" v-for="(item, key) in 5" :key="key" @click="goAct(item)">
					<image src="/static/img/left1.png" mode="widthFix" style="width: 100%;"></image>
					<view style="font-size: 28rpx;padding-bottom: 10rpx;color: #999999;"></view>
				</view>
		</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: 'Hello',
			head_meeting: {},
			live_meeting: []
		};
	},
	onLoad() {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		 uni.setNavigationBarTitle({
		  title: this.i18n.meeting
		})
		this.getDataList();
		this.getliveMeetingList();
	},
	 computed: {  
	     i18n () {  
	      return this.$t('index')  
	  },
	},
	methods: {
		gomeetinglist(){
			uni.navigateTo({
				url: '/pages/index/meeting'
			})
		},
		getliveMeetingList() {
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/liveOnline/list',
				data: {
					token: uni.getStorageSync('token')
				},
				method: 'get',
				success: function(res) {
					console.log('getDataL00ist:');
					console.log(res.data);

					// that.lists=res.data.data;
					var l = [];
					var list = res.data.data;
					var list = res.data.data;
					for (var i = 0; i < list.length; i++) {
						list[i].coverImage = getApp().globalData.imgurl + list[i].coverImage;
						that.live_meeting.push(list[i]);
					}
				}
			});
		},
		getDataList() {
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/onlineMeeting/list',
				data: {
					token: uni.getStorageSync('token')
				},
				method: 'get',
				success: function(res) {
					console.log(res.data);

					// that.lists=res.data.data;
					var l = [];
					var list = res.data.data;
					var list = res.data.data;
					for (var i = 0; i < list.length; i++) {
						list[i].coverPicture = getApp().globalData.imgurl + list[i].coverPicture;
					}
					that.head_meeting = list[0];
					console.log(list[0]);
				}
			});
		}
	}
};
</script>

<style scoped lang="less">
.content{
		background: #f2f2f2;
	}
	.head{
		background-color:#FFFFFF;margin:20rpx 20rpx 0rpx 20rpx; border-radius:10rpx;
	}
.head .title {
  font-size: 40rpx;
  font-weight: bold;
  color: #716ead;
  padding: 30rpx;
}
.head .box{
  margin-left: 15rpx;
  color: #333333;
  width: 50%;
  padding:5rpx;
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
}
.head .box .v_img {
	border: 1rpx solid #ededed;
	border-radius: 10rpx;
	width: 110rpx;
	height: 75rpx;
	text-align: center;
}
.head .box .v_img .img {
  margin-top: 15rpx;
  width: 45rpx;
  height: 45rpx;
}
.head .box .v_right {
  width: 90%;
  height: 70rpx;
  text-align: left;
  font-size: 24rpx;
  padding: 30rpx;
}
.head .box .img{
  width: 60rpx;
  height: 60rpx;
}
.img {
  width: 100%;
  height: 320rpx;
  border-radius: 5rpx;
}
.meeting_title{
  padding: 30rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #716ead;
}
.meeting {
  border-bottom: 1rpx solid #ededed;
  padding:0rpx 30rpx 30rpx 30rpx;
}
.meeting .shop_img_box {
  -webkit-flex-shrink: 0;
          flex-shrink: 0;
  overflow: hidden;
  width: 218rpx;
  height: 125rpx;
}
.meeting .shop_img_box .img {
  width: 100%;
  height: 100%;
}
.meeting .shop_des {
  height: 125rpx;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
          justify-content: space-between;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
          flex-direction: column;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
          align-items: flex-start;
  width: 100%;
  margin-left: 30rpx;
}
.meeting .shop_des .shop_name {
  line-height: 40rpx;
  font-size: 28rpx;
  color: #2a3442;
}
.tabbox {
  width: calc(100% - 90rpx);
  margin: 0rpx auto 10rpx 30rpx;
  -webkit-flex-wrap: wrap;
          flex-wrap: wrap;
  text-align: left;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
          justify-content: space-between;
}
.tabbox .img_view {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  width: calc((100% / 4) - 30rpx);
  position: relative;
}
</style>
