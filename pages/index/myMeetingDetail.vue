<template>
  <div class="my-meeting-detail">
    <view class="head">
      <view class="title">{{ meeting.meetingName }}</view>
      <image
        :src="coverPicture"
        @click="toMeeting"
        mode="scaleToFill" class="meeting-img"></image>
      <view class="flex" style="background-color: #FFFFFF;padding: 10rpx;">
        <view class="flex box ">
          <view class="v_img"><image src="/static/img/date_icon.png" mode="widthFix" class="img"></image></view>
          <view class="v_right">
            {{ startTime }}
            <!-- Oct 29,2020 18:30 PM -->
          </view>
        </view>

        <view class="flex box ">
          <view class="v_img"><image src="../../static/img/address_icon.png" mode="widthFix" class="img"></image></view>
          <view class="v_right">{{ meetingAddress }}</view>
        </view>
      </view>
    </view>
    <!-- <img
         :src="coverPicture"
         mode="scaleToFill"
         @click="toMeeting"
         class="meeting-img" />
         <div class="info-content">
         <div class="time-box box">
         <view class="v_img"><image src="/static/img/date_icon.png" mode="widthFix" class="img"></image></view>
         <view class="v_right">
         <span class="start-time">{{startTime}}</span>
         </view>
         </div>
         <div class="store-box box">
         <view class="v_img"><image src="../../static/img/address_icon.png" mode="widthFix" class="img"></image></view>
         <view class="v_right">{{meetingAddress}}</view>
         </div>
         </div> -->
    <div class="info">
      <ul>
        <li>
          {{i18n.explain_state}}
          <span class="status">{{statusText[meeting.status]}}</span>
        </li>
        <li>
          <span>{{i18n.explain_way}}</span>
          <!-- <view class="iconfont iconmore1"></view>
               <picker @change="changeType" class="status" :value="index" :range="types" >
               <view class="picker">
               {{types[index]}}
               </view>
               </picker> -->
          <span class="status">{{typeText[meeting.type]}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meeting: {},
      statusText: [],
      typeText: [],
      meetingAddress: '',
      startTime: '',
      endTime: '',
      coverPicture: '',
      index: 0
    }
  },
  onLoad() {
    const system_info = uni.getStorageSync('system_info')
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.i18n.conference
    });
    this.$data.statusText= [this.i18n.check_pending, this.i18n.already_passed];
    this.$data.typeText= [this.i18n.offline, this.i18n.online];
    this.meeting = uni.getStorageSync('myMeetingDetail');
    this.getMeeting();
    this.index = this.meeting.type;
  },
  computed: {
    i18n () {
      return this.$t('index')
    },
  },
  methods: {
    toMeeting() {
      console.log(12344555);
      uni.navigateTo({
        url: '/pages/index/lists?id=' + this.meeting.meetingId
      })
    },
    changeType(e) {
      var that = this;
      this.index = e.detail.value;
      uni.request({
        url: getApp().globalData.apiurl + '/meetingCorp/joinMeeting',
        data: {
          meetingId: that.meeting.meetingId,//id会议的id
          type:e.detail.value,
        },
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        success: function(res) {
          console.log('======>', res);
        }
      });
    },
    getMeeting() {
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
          const detail = res.data.data.filter(_ => _.id === that.meeting.meetingId);
          if (detail.length > 0) {
            that.meetingAddress = detail[0].meetingAddress;
            that.startTime = detail[0].meetingStartTime;
            that.endTime = detail[0].meetingEndTime;
            that.coverPicture = detail[0].coverPicture;
          }
        }
      });
    }
  }
}
</script>

<style scoped>
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
.meeting-img {
  width: 100%;
  height: 320rpx;
}
.img {
  margin-top: 15rpx;
  width: 45rpx;
  height: 45rpx;
}
/* .v_right {
   width: 90%;
   height: 70rpx;
   line-height: 70rpx;
   text-align: left;
   font-size: 24rpx;
   padding: 10rpx;
   margin-left: 10rpx;
   } */
.info {
  border-top: 10rpx solid #dfdfdf;
}
li {
  height: 95rpx;
  line-height: 95rpx;
  border-bottom: 1rpx solid #ddd;
  padding: 0px 20rpx;
  box-sizing: border-box;
}
.iconmore1,
.status {
  float: right;
  font-size: 24rpx;
}
.box {
  display: flex;
  align-items: center;
}
.info {
  font-size: 28rpx;
}
.info-content {
  display: flex;
  justify-content: space-between;
}
</style>
