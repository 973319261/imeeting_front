<template>
  <!--pages/user/user.wxml-->
  <view class="user">
    <!-- 头部 -->
    <view class="user-wrap">
      <view class="info">
        <div class="img-content">
          <image class="avatar" mode="aspectFill" :src="userInfo.avatar"></image>
          <span v-if="userInfo.isCorp === 1" class="invite-icon">{{i18n.participate}}</span>
        </div>
        <view class="nickname">{{userInfo.name}}</view>
      </view>
    </view>

    <!-- 用户功能 -->
    <view class="com-item">
      <view class="com-wrap">
        <view class="cell" @click="toEdit">
          <view class="cell-left">
            <image class="cell-icon" src="/static/img/user/ic_user_info.png" mode="aspectFill"></image>
            <view class="cell-text">{{i18n.personal}}</view>
          </view>
          <view class="iconfont iconmore1"></view>
        </view>
        <view class="cell" @click="toMyMeeting">
          <view class="cell-left">
            <image class="cell-icon" src="/static/img/user/ic_attention.png" mode="aspectFill"></image>
            <view class="cell-text">{{i18n.conference}}</view>
          </view>
          <view class="iconfont iconmore1"></view>
        </view>
        <view class="cell">
          <view class="cell-left" @click="toMyTalk">
            <image class="cell-icon" src="/static/img/user/ic_daily.png" mode="aspectFill"></image>
            <view class="cell-text">{{i18n.negotiation}}</view>
          </view>
          <view class="iconfont iconmore1"></view>
        </view>
        <view class="cell">
          <picker @change="changeLanguage" class="pickerBox" :value="index"  :range="language" >
            <view class="cell-left">
              <image class="cell-icon" src="/static/img/user/ic_multilingual.png" mode="aspectFill"></image>
              <view class="cell-text">{{i18n.multilingual}}</view>
              <view class="picker">

                {{language[index]}}
              </view>
            </view>
          </picker>
          <view class="iconfont iconmore1"></view>
        </view>
      </view>
      <button type="primary"  style="margin-top: 100rpx;" @click="loginOut">{{i18n.logout}}</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return{
      userInfo: {},
      language:["中文","English","日本語","한국어"],
      index: uni.getStorageSync("languageIndex")==""?0:uni.getStorageSync("languageIndex"),
      system_lenguage:'',
    }

  },
  onShow() {
    this.getUserInfo();
  },
  onLoad() {
    const system_info = uni.getStorageSync('system_info')
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    uni.setTabBarItem({index: 0,text: this.i18n.tabBar.home});
    uni.setTabBarItem({index: 1,text: this.i18n.tabBar.message});
    uni.setTabBarItem({index: 2,text: this.i18n.tabBar.my});
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.i18n.tabBar.my
    })
  },
  computed: {
    i18n () {
      return this.$t('index')
    },
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    toMyMeeting() {
      uni.navigateTo({
        url: '/pages/index/myMeeting'
      });
    },
    toMyTalk() {
      uni.navigateTo({
        url: '/pages/index/myTalk'
      });
    },
    toEdit() {
      uni.navigateTo({
        url: '/pages/index/editMe'
      });
    },
    getUserInfo() {
      this.userInfo = uni.getStorageSync('userInfo');
    },
    loginOut() {
      uni.setStorageSync('userInfo', null);
    },
    //多语言
    changeLanguage(e){
      let index =e.detail.value;//索引
      this.$data.index=index;
      let system_info = uni.getStorageSync('system_info');
      this.$data.system_lenguage = system_info;
      if( index == 0){//中文
        system_info = this._i18n.locale = 'zh_CN'
      }else if( index == 1){//英语
        system_info = this._i18n.locale = 'en'
      }else if( index == 2){//日语
        system_info = this._i18n.locale = 'ja'
      }else if( index == 3){//韩语
        system_info = this._i18n.locale = 'kr'
      }

      uni.setStorageSync('system_info', system_info);
      uni.setStorageSync('languageIndex', index);
      uni.setTabBarItem({index: 0,text: this.i18n.tabBar.home});
      uni.setTabBarItem({index: 1,text: this.i18n.tabBar.message});
      uni.setTabBarItem({index: 2,text: this.i18n.tabBar.my});
      // 设置导航栏标题
      uni.setNavigationBarTitle({
        title: this.i18n.tabBar.my
      })
      /* uni.reLaunch({
         url: 'meeting'
         }) */
    }
  }
}
</script>

<style scoped>
/* pages/user/user.wxss */
page {
  background: #f2f2f2;
}
.btn-hover {
  background: #f2f2f2 !important;
}
.user .user-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vw;
  padding: 30rpx;
  z-index: 9;
  background: #fff;
  background-size: cover;
}
.user .user-wrap .setting {
  color: #666;
  position: absolute;
  top: 60rpx;
  font-size: 50rpx;
}
.user .user-wrap .setting .info {
  position: absolute;
  text-align: center;
}
.info {
  text-align: center;
}
.info .avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
}
.info .nickname {
  color: #666;
  text-align: center;
  font-size: 28rpx;
}
.order-status {
  padding: 0 20rpx;
  margin-top: -10vw;
}
.order-status .status-wrap {
  border-radius: 25rpx;
  overflow: hidden;
}
.order-status .status-wrap .status-list {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: #fff;
  padding-top: 30rpx;
  padding-bottom: 30rpx;
}
.order-status .status-wrap .status-list .status-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.order-status .status-wrap .status-list .status-item .item-icon {
  line-height: 1;
  font-size: 65rpx;
  color: #bbb;
}
.item-text {
  font-size: 28rpx;
  color: #666;
  margin-top: 5rpx;
}
.com-item {
  padding-left: 20rpx;
  padding-right: 20rpx;
  margin-top: 20rpx;
}
.com-wrap {
  border-radius: 25rpx;
  overflow: hidden;
}
.cell {
  width: 95%;
  height: 100rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f8f8f8;
}
.pickerBox{
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}
.pickerBox .picker{
  font-size: 25rpx;
  position: absolute;
  color: rgb(43, 42, 42);
  width: 100%;
  text-align: end;
  z-index: 0;
}
/* :active {
   background: #f2f2f2;
   } */
:last-child {
  border-bottom: none !important;
}
.cell-left {
  display: flex;
  width: 100%;
  align-items: center;
}
.cell-icon {
  width: 50rpx;
  height: 50rpx;
  z-index: 100;
}
.cell-text {
  color: #666;
  font-size: 28rpx;
  margin-left: 20rpx;
  z-index: 100;
}
.iconfont {
  font-size: 40rpx;
  color: rgb(43, 42, 42);
}
.img-content {
  position: relative;
}
.invite-icon {
  position: absolute;
  display: inine-block;
  font-size: 20rpx;
  width: 100rpx;
  height: 40rpx;
  line-height: 40rpx;
  border-radius: 10rpx;
  color: #fff;
  background-color: #33a3ff;
  top: 60rpx;
  left: 180rpx;
}
</style>
