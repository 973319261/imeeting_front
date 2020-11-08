<template>
	<view class="content">
    <p class="status" v-if="!showButton">{{i18n.signed_up}}</p>
		<view class="head">
			<view class="title">{{ head_meeting.meetingName }}</view>
			<image
        :src="head_meeting.coverPicture"
        @click="goMeeting"
        mode="scaleToFill" class="img"></image>
			<view class="flex" style="background-color: #FFFFFF;padding: 10rpx;">
				<view class="flex box ">
					<view class="v_img"><image src="/static/img/date_icon.png" mode="widthFix" class="img"></image></view>
					<view class="v_right">
						{{ head_meeting.meetingStartTime }}
						<!-- Oct 29,2020 18:30 PM -->
					</view>
				</view>

				<view class="flex box ">
					<view class="v_img"><image src="../../static/img/address_icon.png" mode="widthFix" class="img"></image></view>
					<view class="v_right">{{ head_meeting.meetingAddress }}</view>
				</view>
			</view>
		</view>

		<view class="" style="height: 8rpx;background-color: #F5F5F5;"></view>

		<view style="margin-top: 15rpx;background: #FFFFFF;margin: 20rpx;" v-if="live_meeting.length > 0">
			<view class="meeting_title">{{i18n.livemeeting}}</view>

			<view class="live-meeting" v-for="(item, key) in live_meeting" :key="key" @click="goLiveMeeting(item)">
				<view class="shop_img_box">
          <image src="/static/img/live.svg" mode="widthFix" class="img"></image>
        </view>
				<view class="live-name">
					{{ item.liveName }}
				</view>
			</view>
		</view>

		<view class="" style="height: 8rpx;background-color: #F5F5F5;"></view>

		<view style="margin-top: 15rpx;background: #FFFFFF;margin: 20rpx;">
			<view class="meeting_title">
				{{i18n.participate}}
				<text style="position: absolute;right: 30rpx;border: 1px solid  #535688;padding: 5rpx 10rpx;font-size: 20rpx;" @click="goJionUser" v-if="corpList.length > 0">{{i18n.for_more}}</text>
			</view>

			<view class="tabbox flex1" style="">
				<view class="img_view" v-for="(item, key) in corpList" :key="key" @click="goAct(item)">
					<image src="/static/img/left1.svg" mode="widthFix" style="width: 100%;"></image>
					<view style="font-size: 22rpx;padding-bottom: 10rpx;color: #999999;height: 60rpx;overflow: hidden;">{{ item.name }}</view>
				</view>
        <view v-if="corpList.length === 0" style="color: #666;margin-bottom: 15rpx;">
          {{i18n.not_data}}
        </view>
			</view>
		</view>
    <view style="margin-top: 30rpx;margin-bottom: 30rpx;" v-if="showButton">
      <div class="apply-btns" v-if="showBtns">
        <button type="default" @click="audApply">{{i18n.event_registration}}</button>
        <button type="default" @click="setShow">{{i18n.apply}}</button>
        <button type="default" @click="showBtns = false" class="cancel-btn">{{i18n.cancel}}</button>
      </div>
      <button type="default"
              style="background-color: #f1972c;
                    color: white;
                    font-size: 30rpx;
                    width: 100%;
                    position: fixed;
                    bottom: 40rpx;
                    left: 0;
                    border-radius: 0"
              @click="showBtns = true">{{i18n.registration}}</button>
    </view>
    <view class="model" style="" v-if="show" >
      <view class="center" style="padding: 30rpx;border-radius: 15rpx;">
       
        <!-- <view style="min-height: 160rpx;padding: 20rpx;font-size: 30rpx;color: #3F536E;">洽谈时间: {{head_meeting.meetingStartTime}} ~ {{head_meeting.meetingEndTime}}</view> -->

        <view style="font-size: 30rpx;">{{i18n.explain_hine}}</view>

        <view class="flex" style="text-align: center;height: 140rpx;">
          <view style="flex-grow: 0;" @click="this.type = 1">
            <text class="c_btn_active" v-if="type==1">{{i18n.online_negotiation}}</text>
            <text class="c_btn" v-else >{{i18n.online_negotiation}}</text>
          </view>
          <view style="flex-grow: 50;" @click="this.type = 0">
            <text class="c_btn_active" v-if="type==0">{{i18n.offline_negotiation}}</text>
            <text class="c_btn" v-else >{{i18n.offline_negotiation}}</text>
          </view>
        </view>

        <view style="padding: 10rpx 10rpx 10rpx;font-size: 30rpx;">
          {{i18n.explain_negot}}
          <text style="font-size: 30rpx;color: #777777;">{{i18n.explain_optional}}</text>
        </view>
        <view><textarea value=""
                        style="border-radius: 10rpx;border: 1rpx solid #f8f8f8;margin: 0 auto;width: 98%;height: 200rpx;" /></view>

        <view style="margin-top: 30rpx;margin-bottom: 30rpx;">
          <button type="default"
                  style="background-color: #f1972c;color: white;font-size: 30rpx;"
                  @click="getJoinMeeting">{{i18n.register_submit}}</button>
          <button type="default"
                  style="font-size: 30rpx; margin-top: 15rpx;"
                  @click="show = false">{{i18n.cancel}}</button>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: 0,
			type:1,
			title: 'Hello',
			head_meeting: {},
			live_meeting: [],
			corpList: [],
      show: false,
      showButton: false,
      userInfo: {},
      showBtns: false,
		};
	},
	onLoad(options) {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.meeting_index
		})
		this.id = options.id;
		//获取在线直播
    this.getMyMetting();
		this.getDataList();
		//meetingCorp/getCorpList
		this.getCorpList();
	},
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo');
  },
	computed: {
	  i18n () {
	    return this.$t('index')
	  },
	},
	methods: {
    audApply() {
      const that = this;
      if (!this.userInfo.phone) {
        uni.showModal({
          title: that.i18n.hint,
          content: that.i18n.consummate,
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/index/editMe?meetingId=' + that.id
              });
            }
          }
        });
      } else {
        this.showBtns = false;
        uni.showModal({
          title: that.i18n.registration_success,
          content:that.i18n.participation+"："+that.i18n.audience,
          showCancel: false,
        })
      }
    },
    setShow() {
      if (this.userInfo.isCorp === 1) {
        this.showBtns = false;
        this.show = true;
      } else {
        const that = this;
        uni.showModal({
          title: that.i18n.hint,
          content: that.i18n.consummate,
          confirmText: that.i18n.mobile_login_submit,
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/my/login?meetingId=' + that.id
              })
            } else if (res.cancel) {

            }
          }
        });
      }
    },
    getMyMetting() {
      const that = this;
      uni.request({
        url: getApp().globalData.apiurl + '/smallMeeting/listMyMeeting',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        method: 'GET',
        success: function(res) {
          const meetingIds = res.data.data.map(_ => _.meetingId);
          that.showButton = !meetingIds.includes(parseInt(that.id));
          const myMeeting = res.data.data.filter(_ => _.meetingId === parseInt(that.id))
          if (myMeeting.length > 0) {
            uni.setStorageSync('myMeeting', myMeeting[0]);
          } else {
            uni.setStorageSync('myMeeting', null);
          }
        }
      });
    },
    goAct(item) {
      uni.setStorageSync('goContent', item);
      uni.navigateTo({
				url: '/pages/index/content?id=' + item.id
			});
    },
    goMeeting() {
      uni.navigateTo({
				url: '/pages/index/meetingDetail?id=' + this.head_meeting.id
			});
    },
		join(val){
			this.type=val;
			this.getJoinMeeting();
		},
		getJoinMeeting() {
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/meetingCorp/joinMeeting',
				data: {
					meetingId: that.id,//id会议的id
					type:that.type,
				},
				header: {
					'content-Type': 'application/json;charset=UTF-8',
					'Authorization': uni.getStorageSync('token')
				},
				success: function(res) {
          uni.showModal({
            title: that.i18n.registration_submitted,
            content: that.i18n.participation+"："+that.i18n.participate,
            showCancel: false,
          })
          that.show = false;
          that.showButton = false;
				}
			});
		},
		closeAdv() {
			this.showPop = false;
		},
		getCorpList() {
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/meetingCorp/getCorpList',
				data: {
					meetingId: that.id ,
				},
				header: {
					'content-Type': 'application/json;charset=UTF-8',
					Authorization: uni.getStorageSync('token')
				},
				success: function(res) {
					console.log('getCorpList:');
					console.log(res.data);
					that.corpList = res.data.data.slice(0, 8);
				}
			});
		},
		goLiveMeeting(item) {
			//获取直播源
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/liveOnline/sourceList',
				data: {
					liveId: item.id //id会议的id
				},
				header: {
					'content-Type': 'application/json;charset=UTF-8',
					Authorization: uni.getStorageSync('token')
				},
				success: function(res) {
					var list = res.data.data;
					if (list.length > 0) {
						uni.navigateTo({
							url: '/pages/index/weburl?urlsrc=' + list[0].source
						});
					} else {
						uni.showToast({ title: that.i18n.no_live_meeting, icon: 'none' });
					}
				}
			});
		},
		gomeetinglist() {
			uni.navigateTo({
				url: '/pages/index/meeting'
			});
		},
		goJionUser() {
			uni.navigateTo({
				url: '/pages/index/search?id=' + this.head_meeting.id
			});
		},
		getDataList() {
			var that = this;
			uni.request({
				url: getApp().globalData.apiurl + '/onlineMeeting/list',
				data: {
					liveId: that.id
				},
				header: {
					'content-Type': 'application/json;charset=UTF-8',
					Authorization: uni.getStorageSync('token')
				},
				success: function(res) {
					console.log('onlineMeeting/list:');
					console.log(res.data);

					// that.lists=res.data.data;
					var l = [];
					var list = res.data.data;
					for (var i = 0; i < list.length; i++) {
						if (that.id == list[i].id) {
							list[i].coverPicture = list[i].coverPicture;
							that.head_meeting = list[i];
							break;
						}
					}
				}
			});

			//获取在线直播列表
			uni.request({
				url: getApp().globalData.apiurl + '/liveOnline/listByMeeting',
				data: {
					id: that.id
				},
				header: {
					'content-Type': 'application/json;charset=UTF-8',
					Authorization: uni.getStorageSync('token')
				},
				method: 'GET',
				success: function(res) {
					console.log('list:');
					console.log(res.data);

					// that.lists=res.data.data;
					var l = [];
					var list = res.data.data;
					for (var i = 0; i < list.length; i++) {
						that.live_meeting.push(list[i]);
					}

					console.log(list[0]);
				}
			});
		}
	}
};
</script>

<style scoped lang="less">
.content {
  padding-bottom: 100rpx;
}
.status {
  height: 90rpx;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  font-size: 24rpx;
  background-color: #33a3ff;
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

.c_btn {
	padding: 15rpx;color: white;width: 100rpx;border: 1rpx solid #338bca;color: #338bca;font-weight: bold;border-radius: 10rpx;font-size: 30rpx;
}

.c_btn_active {
	background-color: #338bca;padding: 15rpx;color: white;width: 100rpx;font-weight: bold;border-radius: 10rpx;font-size: 30rpx;
}
page{
	background: #f2f2f2;
}
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
.shop_img_box {
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  overflow: hidden;
  width: 80rpx;
  height: 80rpx;
}
.shop_img_box .img {
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
  width: calc((100% / 4) - 25rpx);
  position: relative;
}
.live-meeting {
  display: flex;
  align-items: center;
}
.apply-btns {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 2;
}
.apply-btns button {
  font-size: 28rpx;
  background-color: #fff;
  color: #5683df;
  border-width: 0px;
  border-bottom: 5rpx solid #f7f7f7;
  border-radius: 0rpx;
  font-weight: bold;
  padding: 10rpx 0;
}
.apply-btns button:after {
  content: "";
  border-width: 0px;
}
.apply-btns button.cancel-btn {
  color: #000;
  padding-bottom: 40rpx;
}
.live-meeting {
  padding: 30rpx;
}
.live-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-left: 20rpx;
}
</style>
