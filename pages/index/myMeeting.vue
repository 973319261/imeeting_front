<template>
  <div class="my-meeting">
    <div class="meeting-list" v-if="list.length > 0">
      <div class="right-box" v-for="item in list" @click="toDetail(item)">
        <div class="meeting-name">{{item.meetingName}}</div>
        <div class="status_box">
			<span class="status"  :style="{background: `${background[item.status]}`}">{{statusText[item.status]}}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      {{i18n.not_data}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      statusText: [],
	  background:[ '#ffa726','#4caf50'],
    }
  },
  onLoad() {
	  const system_info = uni.getStorageSync('system_info')
	  this.$data.system_lenguage = system_info;
	  this._i18n.locale = system_info;
	  // 设置导航栏标题
	   uni.setNavigationBarTitle({
				title: this.i18n.conference
	  })
	   this.$data.statusText= [this.i18n.in_review, this.i18n.already_passed];
    this.listMyMeeting();
  },
  	computed: {  
  		 i18n () {  
  		  return this.$t('index')  
  	  },
  	},
  methods: {
    listMyMeeting() {
      var that = this;
     uni.request({
        url: getApp().globalData.apiurl + '/smallMeeting/listMyMeeting',
        header: {
          'content-Type': 'application/json;charset=UTF-8',
          'Authorization': uni.getStorageSync('token')
        },
        success: function(res) {
          that.list = res.data.data;
        }
      });
    },
    toDetail(item) {
      uni.setStorageSync('myMeetingDetail', item);
      uni.navigateTo({
        url: '/pages/index/myMeetingDetail'
      });
    }
  }
}
</script>

<style scoped>
.right-box {
  position: relative;
  height: 110rpx;
  line-height: 110rpx;
  width: 100%;
  box-sizing: border-box;
  padding-right: 80rpx;
  padding-left: 30rpx;
  text-align: left;
  border-bottom:1rpx solid #f8f8f8;
}
.right-box::after {
  content: '';
  width: 22rpx;
  height: 22rpx;
  display: inline-block;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;
  position: absolute;
  right: 40rpx;
  top: 50%;
  transform: translateY(-50%) rotateZ(-45deg);
}
.status {
  padding: 2rpx 15rpx;
  font-size: 20rpx;
  border-radius: 50rpx;
  text-align: center;
  color: #FFFFFF;
}
.yellow {
   border: 1rpx solid #F0AD4E;
}
.green {
   border: 1rpx solid #008000;
}
.status_box{
	height: 50rpx;
	float: right;
}
.meeting-name {
  display: inline-block;
  width: 500rpx;
  height: 110rpx;
  line-height: 110rpx;
  overflow: hidden;
  font-size: 28rpx;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.empty {
  text-align: center;
  color: #dfdfdf;
  margin-top: 100rpx;
}
</style>
