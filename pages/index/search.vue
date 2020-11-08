<template>
	<view class="" style="background-color: #f2f2f4;">
		<view style="width: 100%;padding-top: 10rpx;background-color: white;position: fixed;z-index: 9999;top: 0rpx;">
			<view style="width: 95%;font-size: 28rpx;text-align: center;border-radius: 90rpx;line-height: 70rpx;background-color: #edeeef;height: 70rpx;margin: 0 auto;">
				<view class="flex" style="padding-left: 10rpx;height: 80rpx;line-height: 100rpx;vertical-align: middle;">
					<image src="/static/img/sousuo.png" mode="widthFix" style="width: 30rpx;height: 30rpx;margin-left: 10rpx;margin-top: -5px;"></image>
					<input
						id="keywords"
						name="keywords"
            v-model="keywords"
						    @confirm="startSearch"
            @input="reload"
						type="text"
					      style="padding-left: 15rpx;text-align: left;font-size: 28rpx;height: 20rpx;margin-top: -10rpx; width: 100%;"
						    value=""
						    :placeholder="i18n.exhibitor_name_hine"
					/>
				</view>
			</view>

			<view class="tab_box flex1">
				<block v-for="(item, key) in tab" :key="key">
					<text @click="changeTab(key)" :class="{ text: true, active: key == tabIndex }">{{ item }}</text>
				</block>
			</view>
		</view>

		<view style="margin-top: 180rpx;background-color: #f2f2f4;padding-top: 10rpx;">
			<view
				class="flex"
				style="width: 92%;background-color: white;margin: 15rpx auto;border-radius: 15rpx;padding: 30rpx 10rpx 30rpx 10rpx;"
				v-for="(item, key) in dataList"
				:key="key"
				@click="goContent(item)" 
			>
				<view style="padding: 15rpx;"><image style="width: 160rpx;" src="../../static/img/left1.svg" mode="widthFix"></image></view>
				<view style="flex-grow: 1;">
					<view style="font-size: 30rpx;font-weight: bold;">{{item.name}}</view>
					<!-- <view style="font-size: 24rpx;color: #C0C0C0;padding-top: 6rpx; padding-bottom: 15rpx;">已报名线上洽谈</view> -->
					<view class="flex" style="font-size: 24rpx;height: 60rpx;vertical-align: top;margin-top: 10rpx;">
						<view style="width: 150rpx;font-size: 24rpx;color: #C0C0C0;">{{i18n.explain_negot}}</view>
						<view class="" style="width: 90%;color: #000000;overflow: hidden;padding-left: 10rpx;">
							{{item.remark}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			meetingId: 2,
			page:1,
			tabIndex: 0,
			tab: [],
			keywords:'',
			dataList: []
		};
	},
	components: {},
	onLoad(options) {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		 uni.setNavigationBarTitle({
		 title: this.i18n.participate
		})
		this.$data.tab= [this.i18n.online_negotiation, this.i18n.offline_negotiation];
		this.meetingId = options.id;
		this.getDataList();
	},
	computed: {  
		 i18n () {  
		  return this.$t('index')  
	  },
	},
	onReachBottom() {},
	onShareAppMessage(res) {
		return {
			title: '！',
			path: '/pages/index/meeting?p_userid=' + uni.getStorageSync('user_id')
		};
	},
	onShow() {
		
	},
	methods: {
    reload() {
      if (this.keywords === '') {
        this.getDataList();
      }
    },
		changeTab(val){
			this.tabIndex=val;
			this.dataList=[];
			this.page=1;
			this.getDataList();
		},
    startSearch() {
      this.getDataList();
    },
		getDataList() {
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/meetingCorp/getCorpList',
				data: {
					meetingId: that.meetingId,
					type: that.tabIndex ? 0 : 1,
					name: that.keywords
				},
				header: {
					'Authorization': uni.getStorageSync('token')
				},
				method: 'GET',
				success: function(res) {
					console.log('meetingCorp/getCorpList');
					console.log(res.data);
					that.dataList = res.data.data;
					/* var l = [];
					   var list = res.data.data;
					   for (var i = 0; i < list.length; i++) {
						 that.dataList.push(list[i]);
					   }
					   console.log(list[0]); */
				}
			});
		},
		goContent(item) {
			uni.setStorageSync('goContent',item);
			uni.navigateTo({
				url: '/pages/index/content'
			});
		}
	}
};
</script>

<style scoped lang="less">
.tab_box {
	width: calc(100% - 60rpx);
	margin: 20rpx auto 0 auto;
	flex-wrap: wrap;
	.text {
		box-sizing: border-box;
		width: 280rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		margin-right: 28rpx;
		border-radius: 10rpx;
		background-color: white;
		font-size: 30rpx;
		color: #101010;
		margin-bottom: 15rpx;
		border: 1px solid #535688;
		border-radius: 10rpx;
		color: #535688;
		&:nth-child(3n) {
			margin-right: 0;
		}
	}
	.active {
		color: white;
		background-color: #535688;
	}
}
</style>
