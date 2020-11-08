<template>
  <div class="my-talk">
    <ul class="talk-list" v-if="list.length > 0">
      <li class="talk-item"
          @click="toDetail(item)"
          v-for="item in list"
          :key="item.id">
        <div class="info-content">
          <image style="width: 100rpx;" src="../../static/img/left1.svg" mode="widthFix"></image>
          <div class="info">
           <p class="name">{{getInviName(item)}}</p>
            <p class="time"><image style="" class="time_date" src="../../static/img/ic_date.png" mode="widthFix"></image><span>{{getTime(item)}}</span></p>
          </div>
        </div>
        <div class="op">
          <p class="type">{{typeText[item.type]}}</p>
           <p class="status"  :style="{background: `${background[item.status]}`}">{{statusText[item.status]}}</p>
        </div>
      </li>
    </ul>
    <div class="empty" v-if="list.length === 0 && isLoad">
      {{i18n.not_data}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      typeText: [],
      statusText: [],
      userInfo: {},
      isLoad: false,
	  background:[ '#33a3ff','#ffa726','#e53935','#4caf50'],
    }
  },
  onLoad() {
    const system_info = uni.getStorageSync('system_info')
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.i18n.negotiation
    })
	 this.$data.typeText= [this.i18n.offline_negotiation, this.i18n.online_negotiation];
	  this.$data.statusText= [this.i18n.be_confirmed, this.i18n.confirmed,
	  this.i18n.refused, this.i18n.arrangements];
    this.listTalk();
    this.userInfo = uni.getStorageSync('userInfo');
  },
  computed: {
    i18n () {
      return this.$t('index')
    },
  },
  methods: {
    listTalk() {
      var that = this;
     uni.request({
        url: getApp().globalData.apiurl + '/smallMeeting/list',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        success: function(res) {
          that.isLoad = true;
          console.log(res.data.data);
          that.list = res.data.data;
        }
      });
    },
    toDetail(item) {
      uni.setStorageSync('currentTalk', item);
      uni.navigateTo({
        url: '/pages/index/myTalkDetail'
      });
    },
    getInviName(item) {
      if (item.inviteerId === this.userInfo.userId) {
        return item.inviterName;
      } else {
        return item.inviteerName;
      }
    },
    getTime(item) {
      const date = item.startTime.replace('-', '.').replace('-', '.').substring(0, 10)
      const startTime = item.startTime.substring(11, 16);
      const endTime = item.endTime.substring(11, 16);
      return `${date} ${startTime} ~ ${endTime}`;
    }
  },
}
</script>

<style scoped>
.talk-item {
  border-bottom: 1rpx solid #f8f8f8;
  display: flex;
  font-size: 24rpx;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 20rpx;
  box-sizing: border-box;
}
.avatar {
  width: 100rpx;
}
.name {
  color: #000;
  font-size: 32rpx;
  font-weight: bold;
}
.time{
	height: 50prx;
	line-height: 50rpx;
	display: block;
	align-items: center;
	font-size: 28rpx;
}
.time, .status {
  margin-top: 10rpx;
}
.time span{
	float: right;
	margin-left: 10rpx;
	position: relative;
	bottom: 8rpx;
}
.time_date{
	width: 35rpx;
}
.type{
	text-align: center;
}
.status {
  padding: 2rpx 15rpx;
  font-size: 20rpx;
  border-radius: 50rpx;
  text-align: center;
  color: #FFFFFF;
}
.empty {
  text-align: center;
  color: #dfdfdf;
  margin-top: 100rpx;
}
.info {
  margin-left: 10rpx;
}
.info-content {
  display: flex;
  align-items: center;
}
</style>
