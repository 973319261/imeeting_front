<template>
	<view class="content">
		
		<view>
			<view class="flex" style="height: 260rpx;">
				<view style="width: 20%;padding-left: 10rpx;text-align: center;">
					<image src="/static/img/left1.svg"  style="width: 120rpx;height: 120rpx;border-radius: 50%;overflow: hidden;border: 3rpx solid #FFFFFF;" v-if="!content.avatar"></image>
          <image :src="content.avatar"  style="width: 120rpx;height: 120rpx;border-radius: 50%;overflow: hidden;border: 3rpx solid #FFFFFF;" v-else></image>
				</view>
				<view style="padding-left: 20rpx;font-size: 30rpx;">
					<view>{{content.name}}</view>
					<view style="font-size: 26rpx;color: #2C405A;">{{i18n.indus}}：<text>{{content.industry}}</text></view>
				</view>
			</view>
		</view>
		
		<view style="height: 20rpx;background-color: #f7f7f7;">
		</view>
		
		<view>
			<view style="font-size: 30rpx;padding: 20rpx;border-bottom:1px solid  #f7f7f7 ;">{{i18n.exhibitors_introduce}}</view>
			<view class="des" style="padding: 20rpx;font-size: 28rpx;">
				{{content.corpInfo}}
			</view>
		</view>
		
		<view style="margin-top: 30rpx;margin-bottom: 30rpx;padding: 20rpx;">
			<view style="margin: 0 auto;">
				<button type="default"
                v-if="!disabled"
                @click="toInvite"
                style="background-color: #f1972c;color: white;font-size: 30rpx;">
          {{i18n.exhibitors_invite}}
        </button>
        <button type="default"
                @click="showError"
                v-else
                style="fot-size: 30rpx;">
          {{i18n.exhibitors_invite}}
        </button>
			</view>
		</view>

    <view class="model" style="" v-show="showPop" >
      <div class="center">
		    <div class="talk-form">
          <!-- <p class="label">请选择会议类型：</p>
               <div class="choose-type">
               <span class="type-btn"
               @click="type = 0"
               :class="{'active': type === 0}">{{i18n.offline}}</span>
               <span class="type-btn online"
               @click="type = 1"
               :class="{'active': type === 1}">{{i18n.online}}</span>
               </div> -->
          <div class="talk-tip">
            <p>{{i18n.negotiation_process}}：</p>
            <p>{{i18n.negotiation_process_hine}}</p>
            <p>{{i18n.after_acceptance}}</p>
            <p>{{i18n.negotiation_remark}}</p>
            <p>{{i18n.friendly_reminder}}：</p>
            <p>{{i18n.negotiation_zoom}}</p>
            <p>zoom：https://zoom.us/download</p>
            <p>{{i18n.tencent_conference}}：https://cloud.tencent.com/act/event/tencentmeeting_free</p>
          </div>
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
            <label>{{i18n.intention_description}}</label>
            <textarea v-model="meetingIntent"
                      :placeholder="i18n.intention_description"
                      class="meeting-intent-field" />
          </div>
        </div>
        <div class="op">
          <button type="default" size="mini" class="cancel" @click="showPop=false">{{i18n.cancel}}</button>
          <button type="primary" size="mini" class="confirm" @click="invite">{{i18n.confirm}}</button>
        </div>
      </div>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex:0,
			content:{},
			tab: [],
      showPop: false,
      startDate: '2020-10-20',
      endDate: '2020-10-20',
      startTime: '9:00',
      endTime: '10:00',
      meetingIntent: '',
      type: 0,
      myMeeting: null,
      disabled: false,
      dateRange: ['2020-10-20', '2020-10-21'],
      dateIndex: 0,
      timeIndex: 0,
      timeRange: ['9:00 ~ 10:00', '10:00 ~ 11:00', '11:00 ~ 12:00', '12:00 ~ 13:00','13:00 ~ 14:00', '14:00 ~ 15:00', '15:00 ~ 16:00', '16:00 ~ 17:00', '17:00 ~ 18:00', '18:00 ~ 19:00', '19:00 ~ 20:00']
		};
	},
	onLoad() {
		const system_info = uni.getStorageSync('system_info')
		this.$data.system_lenguage = system_info;
		this._i18n.locale = system_info;
		// 设置导航栏标题
		uni.setNavigationBarTitle({
		  title: this.i18n.exhibitors
		});
		this.$data.tab= [this.i18n.online_negotiation, this.i18n.offline_negotiation];
		this.goContent();
    this.getMyMetting();
	},
	computed: {
	  i18n () {
	    return this.$t('index')
	  },
	},
	methods: {
    toInvite() {
      uni.navigateTo({
        url: '/pages/index/invite?type=' + this.myMeeting.type
      })
    },
    showError() {
	  var that=this;
      if (!this.myMeeting) {
        uni.showToast({
				  title: that.i18n.not_exhibitors,
				  icon: 'none'
			  });
        return;
      }
      const userInfo = uni.getStorageSync('userInfo');
      let text = that.i18n.meeting_mode;
      if (this.myMeeting.status !== 1) {
        text = that.i18n.registration_audit;
      }
      if (userInfo.isCorp !== 1) {
        text = that.i18n.not_exhibitors;
      }
      uni.showToast({
				title: text,
				icon: 'none'
			});
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
          const myMeeting = res.data.data.filter(_ => _.meetingId === parseInt(that.content.meetingId));
          if (myMeeting.length > 0) {
            that.myMeeting = myMeeting[0];
            console.log('myMeeting=======>', that.myMeeting);
            const userInfo = uni.getStorageSync('userInfo');
            if (that.myMeeting.status !== 1 || that.myMeeting.type !== that.content.type || userInfo.isCorp !== 1) {
              that.disabled = true;
            }
          } else {
            that.disabled = true;
          }
        }
      });
    },
	  goContent(){
		  var content=uni.getStorageSync('goContent');
		  this.content = content;
      console.log('=======>', content);
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
				  type: that.myMeeting.type,
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
				  console.log(res.data);
          that.showPop = false;
          uni.showToast({
					  title: this.i18n.invite_successful,
					  icon: 'none'
				  });
			  }
		  });
    }
  }
};
</script>

<style scoped lang="less">
.des {
	word-wrap: break-word;word-break: break-all;white-space: pre-line;
}
.model {
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.45);
	top: 0;
	left: 0;
}
.uni-list-cell {
  display: flex;
  border-bottom: 1rpx solid #dfdfdf;
  margin-top: 10rpx;
  padding: 15rpx 0rpx;
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
.type-btn {
  padding: 15rpx 20rpx;;
  color: white;
  width: 100rpx;border: 1rpx solid #338bca;
  color: #338bca;
  border-radius: 10rpx;
  font-size: 24rpx;
}

.type-btn.active {
  background-color: #338bca;
  color: #fff;
}
.center {
	width: 90%;
	height: 90%;
	position: fixed;
	background-color: white;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
  padding: 20rpx 10rpx;
  border-radius: 10rpx;
}
.label {
  color: #666;
  font-size: 28rpx;
}
.choose-type {
  margin-top: 30rpx;
}
.online {
  margin-left: 40rpx;
}
.choose-type {
  border-bottom: 1rpx solid #dfdfdf;
  padding-bottom: 40rpx;
}
.meeting-intent {
  padding: 20rpx 0rpx;
}
.meeting-intent-field {
  border: 1rpx solid #dfdfdf;
  border-radius: 10rpx;
  margin-top: 10rpx;
  padding: 15rpx;
  box-sizing: border-box;
}
.op {
  margin-top: 20rpx;
}
.confirm {
  margin-left: 30rpx;
}
.talk-tip {
  font-size: 24rpx;
}
</style>
