<template>
	<view class="">
		<view class="banner" v-for="(item, key) in lists" :key="key">
			<view class="lists" @click="goUrl(item)">
				<swiper class="swiper swiper_plus">
					<swiper-item><image :src="item.coverPicture" mode="scaleToFill" class="img"></image></swiper-item>
				</swiper>
				<view class="font_text">{{ item.meetingName }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			page: 0,
			keyword: '',
			lists: []
		};
	},
	onLoad() {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this.i18n.locale = system_info;
		uni.setTabBarItem({index: 0,text: this.i18n.tabBar.home});
		uni.setTabBarItem({index: 1,text: this.i18n.tabBar.message});
		uni.setTabBarItem({index: 2,text: this.i18n.tabBar.my});
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.tabBar.home
		})
		this.getDataList();
	},
	computed: {
	  i18n () {
	    return this.$t('index')
	  },
	},
	onPullDownRefresh() {
		this.page = 0;
		this.lists = [];
		this.getDataList();
	},
	onShow() {
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.tabBar.home
		})
	},
	onShareAppMessage(res) {
		return {
			title: this.i18n.convention ,
			path: '/pages/index/meeting?p_userid=' + uni.getStorageSync('user_id')
		};
	},
	onReachBottom() {
		this.getDataList();
	},
	methods: {
		gomeetinglist() {
			uni.navigateTo({
				url: '/pages/index/meeting'
			});
		},
		goUrl(item) {
      const userInfo = uni.getStorageSync('userInfo');
      uni.setStorageSync('authMeeting', item);
      if (userInfo && userInfo.isCorp !== '') {
        uni.navigateTo({
					url: '/pages/index/lists?id=' + item.id
				});
      } else {
        uni.navigateTo({
				  url: '/pages/my/auth?id=' + item.id
			  });
      }
		},
		getDataList() {
			var that = this;
			that.page++;

			uni.request({
				url: getApp().globalData.apiurl + '/onlineMeeting/list',
				header: {
					'Authorization': uni.getStorageSync('token')
				},
        data: {
          opened: true,
        },
				method: 'get',
				success: function(res) {
					console.log('onlineMeeting/list:');
					console.log(res.data);
					var l = [];
					that.lists = res.data.data;
					/* for (var i = 0; i < list.length; i++) {
						 list[i].coverPicture = list[i].coverPicture;
						 that.lists.push(list[i]);
					   }
					   if (list.length == 0) {
						 that.contentText = this.i18n.no_more_data;
						 uni.showToast({ title: this.i18n.no_more_data, icon: 'none' });
					   }*/
				}
			});
		}
	}
};
</script>

<style scoped lang="less">
.banner {
	width: 100%;
	height: 180rpx;
	margin-bottom: 60rpx;
}

.lists {
	position: relative;
	.img {
		width: 100%;
		height: 220rpx;
	}
	.swiper_plus {
		height: 220rpx;
		background-color: #f8f8f8;
	}
	.font_text {
		position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.45);
		color: white;
		font-weight: bold;
		font-size: 35rpx;
    display: flex;
    align-items: center;
	}
}

.model {
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.45);
	top: 0;
	left: 0;
	.center {
		width: 90%;
		// height: 90%;
		position: fixed;
		background-color: white;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		.img-box {
			position: relative;
			width: 100%;
			.img {
				width: 100%;
			}
			.center-box {
				position: absolute;
				bottom: 60rpx;
				left: 0;
				width: 100%;
				.day {
					text-align: center;
					font-size: 32rpx;
					color: #414249;
				}
				.integral {
					padding: 18rpx 0;
					text-align: center;
					color: #f41f21;
					.text {
						color: #f41f21;
						font-size: 48rpx;
						font-weight: bold;
					}
				}
				.btn-box {
					text-align: center;
					.btn {
						width: 60%;
						display: inline-block;
						background-color: #f41f21;
						color: white;
						font-size: 36rpx;
						border-radius: 40rpx;
						padding: 16rpx 0;
					}
				}
			}
		}
	}
}
</style>
