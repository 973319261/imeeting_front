<template>
 <div class="detail">
    <p class="status">{{statusText[status]}}</p>
    <div class="detail-info">
      <div class="acceptor">
        {{getInviName()}}
      </div>
      <ul class="info-list">
        <li>
          <label class="label">{{i18n.meeting_name}}：</label>
          <span class="text">{{talk.meetingName}}</span>
        </li>
        <li>
          <label class="label">{{i18n.meeting_type}}：</label>
          <span class="text">{{typeText[talk.type]}}</span>
        </li>
        <li style="border-bottom: 1rpx solid #f8f8f8;">
          <label class="label">{{i18n.meeting_time}}：</label>
          <span class="text">{{getTime(talk)}}</span>
        </li>
        <li>
          <label class="label">{{i18n.meeting_link}}：</label>
          <span class="text"  style="color: #33a3ff;">{{talk.meetingUrl}}</span>
        </li>
        <li>
          <label class="label">{{i18n.meeting_remark}}：</label>
          <span class="text">{{talk.remark}}</span>
        </li>
		<li style="padding:0rpx 20rpx;border-bottom: 20rpx solid #f8f8f8;"></li>
      </ul>
      <div class="apply-text">
        <label class="label">{{i18n.application}}</label>
        <div class="apply-text-content">
          {{talk.meetingIntent}}
        </div>
      </div>
    </div>
    <div class="op" v-if="talk.inviteerId === userInfo.userId && status === 0">
      <button class="reject" type="default"  @click="reject">{{i18n.reject}}</button>
      <button class="accept" type="primary"  @click="accept">{{i18n.receive}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      talk: {},
      userInfo: {},
      statusText: [],
      typeText: [],
      status: -1,
    }
  },
  onLoad() {
    this.init();
    const system_info = uni.getStorageSync('system_info')
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.i18n.negotiation
    });
	this.$data.statusText= [this.i18n.be_confirmed, this.i18n.confirmed,
	this.i18n.refused, this.i18n.arrangements];
	this.$data.typeText= [this.i18n.offline, this.i18n.offline];
  },
  computed: {
    i18n () {
      return this.$t('index')
    },
  },
  methods: {
    getTime(item) {
      const date = item.startTime.replace('-', '.').replace('-', '.').substring(0, 10)
      const startTime = item.startTime.substring(11, 16);
      const endTime = item.endTime.substring(11, 16);
      return `${date} ${startTime} ~ ${endTime}`;
    },
    init() {
      this.talk = uni.getStorageSync('currentTalk');
      this.userInfo = uni.getStorageSync('userInfo');
      this.status = this.talk.status;
    },
   /* getInviName() {
      if (this.talk.inviteerId === this.userInfo.userId) {
        return this.talk.inviterName;
      } else {
        return this.talk.inviteerName;
      }
    }, */
    accept() {
      const that = this;
      uni.request({
        url: getApp().globalData.apiurl + '/smallMeeting/agree',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        data: {
          id: this.talk.id
        },
        success: function(res) {
          if (res.data.success) {
            uni.showToast({
              title: that.i18n.agree_invitation,
              icon: 'none'
            });
            that.status = 1;
          }
        }
      });
    },
    reject() {
      const that = this;
      uni.request({
        url: getApp().globalData.apiurl + '/smallMeeting/reject',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        data: {
          id: this.talk.id
        },
        success: function(res) {
          if (res.data.success) {
            uni.showToast({
              title: that.i18n.rejected_invitation,
              icon: 'none'
            });
            that.status = 2;
          }
        }
      });
    },
    getInviName() {
      // inviteerId 被邀请
      // inviterId 邀请
      if (this.talk.inviteerId === this.userInfo.userId) {
        return this.i18n.sender+'：${this.talk.inviterName}';
      } else {
        return this.i18n.receiver+`：${this.talk.inviteerName}`;
      }
    },
  }
}
</script>

<style scoped>
.status {
  height: 90rpx;
  line-height: 90rpx;
  color: #fff;
  background-color: #33a3ff;
  padding-left: 30rpx;
  box-sizing: border-box;
}
.acceptor {
  color: #000;
  font-weight: bold;
  border-bottom: 1rpx solid #f8f8f8;
  font-size: 30rpx;
  padding: 30rpx;
  box-sizing: border-box
}
.label {
  display: inline-block;
  width: 150rpx;
  text-align: right;
  color: #666;
}
.info-list {
  padding: 0rpx 10rpx;
  padding-bottom: 20rpx;
}
.info-list li {
  padding: 20rpx 10rpx;
  font-size: 30rpx;
  color: #000;
}
.text {
  display: inline-block;
  color: #000;
  margin-left: 10rpx;
}
.apply-text {
  padding:0 25rpx;
}
.apply-text .label {
  width: 200rpx;
  font-size: 28rpx;
  text-align: left;
}
.apply-text-content {
  font-size: 28rpx;
  margin-top: 15rpx;
}
.op {
  text-align: center;
  margin-top: 100rpx;
}
.op button{
	width: 44%;
	display: inline-block;
}
.accept {
  margin-left: 30rpx;
   background-color: #33a3ff;
}
</style>
