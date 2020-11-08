<template>
  <div class="invite-form">
	  <div class="talk-tip">
	  		 <p><span>{{i18n.negotiation_process}}：</span>{{i18n.negotiation_process_hine}}{{i18n.after_acceptance}};</p>
	  		 <p>{{i18n.negotiation_remark}}</p>
	  		 <p>{{i18n.friendly_reminder}}：{{i18n.negotiation_zoom}}</p>
	  		 <p>zoom：https://zoom.us/download</p>
	  		 <p>{{i18n.tencent_conference}}：https://cloud.tencent.com/act/event/tencentmeeting_free</p>
	    </div>
    <div class="talk-form">
     <view class="uni-list-cell">
        <label>{{i18n.select_date}}：</label>
        <view class="uni-list-cell-db">
          <picker @change="bindDateChange" :value="dateIndex" :range="dateRange">
            <view class="uni-input">{{startDate}}</view>
          </picker>
          <view class="iconfont iconmore1"></view>
        </view>
      </view>
      <view class="uni-list-cell">
        <label>{{i18n.select_time_period}}：</label>
        <view class="uni-list-cell-db">
          <picker @change="bindTimeChange" :value="timeIndex" :range="timeRange">
            <view class="uni-input">{{startTime}} ~ {{endTime}}</view>
          </picker>
          <view class="iconfont iconmore1"></view>
        </view>
      </view>
      <div class="meeting-intent">
        <label >{{i18n.intention_description}}</label>
        <textarea v-model="meetingIntent"
                  class="meeting-intent-field" />
      </div>
    </div>
	 
	<div class="op">
      <button type="primary" class="confirm" @click="invite">{{i18n.send_invitations}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content:{},
      startDate: '2020-10-20',
      endDate: '2020-10-20',
      startTime: '9:00',
      endTime: '10:00',
      meetingIntent: '',
      type: 0,
      myMeeting: null,
      dateRange: ['2020-10-20', '2020-10-21'],
      dateIndex: 0,
      timeIndex: 0,
      timeRange: ['9:00 ~ 10:00', '10:00 ~ 11:00', '11:00 ~ 12:00','13:00 ~ 14:00', '14:00 ~ 15:00', '15:00 ~ 16:00', '16:00 ~ 17:00', '17:00 ~ 18:00', '18:00 ~ 19:00', '19:00 ~ 20:00'],
      type: 0,
    }
  },
  onLoad(options) {
    this.type = options.type;
    const system_info = uni.getStorageSync('system_info')
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    this.goContent();
  },
  computed: {
    i18n () {
      return this.$t('index')
    },
  },
  methods: {
    goContent(){
      var content=uni.getStorageSync('goContent');
      this.content = content;
    },
    bindTimeChange(e) {
      this.timeIndex = e.target.value
      const times = this.timeRange[this.timeIndex].split('~');
      this.startTime = times[0].replace(' ', '');
      this.endTime = times[1].replace(' ', '');
    },
    bindDateChange(e) {
      this.dateIndex = e.target.value
      this.startDate = this.dateRange[this.dateIndex];
      this.endDate = this.dateRange[this.dateIndex];
    },
    invite() {
      var that = this;
      const userInfo = uni.getStorageSync('userInfo');
      uni.request({
        url: getApp().globalData.apiurl + '/smallMeeting/invite',
        data: {
          meetingId: that.content.meetingId + '',
          type: that.type,
          inviteerId: that.content.sysUserId,
          inviterId: userInfo.userId,
          meetingIntent: that.meetingIntent,
          startTime: that.startDate + ' ' + that.startTime,
          endTime: that.endDate + ' ' + that.endTime
        },
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        success: function(res) {
          uni.showToast({
            title: that.i18n.invite_successful,
            icon: 'none'
          });
          setTimeout(function() {
            uni.navigateTo({
              url: '/pages/index/content'
            })
          }, 1500);
        }
      });
    }
  }
}
</script>

<style scoped>
.uni-list-cell {
  display: flex;
  border-bottom: 1rpx solid #f8f8f8;
  margin-top: 10rpx;
  padding:25rpx;
  justify-content: space-between;
  align-items: center;
}
.uni-list-cell-db {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 26rpx;
}
.meeting-intent {
  padding:30rpx 25rpx;
}
.meeting-intent-field {
  border: 1rpx solid #f8f8f8;
  width: 100%;
  height: 200rpx;
  border-radius: 10rpx;
  margin-top: 30rpx;
  padding: 15rpx;
  box-sizing: border-box;
}
.talk-tip {
  padding: 20rpx;
  font-size: 28rpx;
  word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
.talk-tip p{
	line-height: 50rpx;
}
.confirm {
  width: 90%;
  margin-top:100rpx;
  margin-bottom: 100rpx;
}
</style>
