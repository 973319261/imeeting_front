<template>
  <div class="content">
    <p class="status" v-if="!showButton">{{i18n.signed_up}}</p>
    <div class="meeting-detail">
      <image
        :src="detail.coverPicture"
        mode="scaleToFill" class="img"></image>
      <rich-text :nodes="detail.content"></rich-text>
    </div>
    <view style="margin-top: 30rpx;margin-bottom: 30rpx;" v-if="showButton">
      <button type="default" style="background-color: #f1972c;color: white;font-size: 30rpx;" @click="setShow">{{i18n.apply}}</button></view>
    <view class="model" style="" v-if="show" >
      <view class="center" style="padding: 30rpx;border-radius: 15rpx;">
        <view class="flex">
          <view style="font-size: 32rpx;font-weight: bold;flex-grow: 1;">{{i18n.explain_negotiation}}</view>
          <view style="font-size: 26rpx;padding-right: 20rpx;">{{i18n.for_details}}</view>
        </view>
        <!-- <view style="min-height: 160rpx;padding: 20rpx;font-size: 30rpx;color: #3F536E;">洽谈时间: {{head_meeting.meetingStartTime}} ~ {{head_meeting.meetingEndTime}}</view> -->

        <view style="font-size: 30rpx;">{{i18n.explain_hine}}</view>

        <view class="flex" style="text-align: center;height: 140rpx;">
          <view style="flex-grow: 1;" @click="this.type = 1">
            <text class="c_btn_active" v-if="type==1">{{i18n.online_negotiation}}</text>
            <text class="c_btn" v-else >{{i18n.online_negotiation}}</text>
          </view>
          <view style="flex-grow: 1;" @click="this.type = 0">
            <text class="c_btn_active" v-if="type==0">{{i18n.offline_negotiation}}</text>
            <text class="c_btn" v-else >{{i18n.offline_negotiation}}</text>
          </view>
        </view>

        <view style="padding: 40rpx 10rpx 10rpx;font-size: 30rpx;">
          {{i18n.explain_negot}}
          <text style="font-size: 30rpx;color: #777777;">{{i18n.explain_optional}}</text>
        </view>
        <view><textarea value=""
                        style="border-radius: 10rpx;border: 1rpx solid #DADADA;margin: 0 auto;width: 98%;" /></view>

        <view style="margin: 30rpx;">
          <button type="default"
                  style="background-color: #f1972c;color: white;font-size: 30rpx;"
                  @click="getJoinMeeting">{{i18n.register_submit}}</button>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      id: null,
      show: false,
      type: 1,
      showButton: false,
      userInfo: {}
    }
  },
  onLoad(options) {
    const system_info = uni.getStorageSync('system_info')
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.i18n.meeting_details
    })
    this.id = options.id;
    this.getMyMetting();
    this.getDetail();
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
    setShow() {
      if (this.userInfo.isCorp === 1) {
        this.show = true;
      } else {
        uni.navigateTo({
          url: '/pages/my/login'
        })
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
        }
      });
    },
    getDetail() {
      var that = this;
      uni.request({
        url: getApp().globalData.apiurl + '/onlineMeeting/detail',
        data: {
          id: parseInt(that.id),
        },
        dataType: 'json',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        success: function(res) {
          that.detail = res.data.data;
        }
      });
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
          uni.showToast({
            title: this.i18n.registration_success,
            icon: 'none'
          });
          that.show = false;
          that.showButton = false;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
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
.img {
  width: 100%;
  height: 320rpx;
}
</style>
