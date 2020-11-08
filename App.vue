<script>
	
export default {
  globalData: {
    text: 'text', //getApp().globalData.text = 'test'
               apiurl1: 'https://api.meeting.sc-ipe.com/api', //记得跨域问题
               apiurl: 'https://api.meeting.sc-ipe.com/api',
    imgurl: 'https://api.meeting.sc-ipe.com',
    payurl: '',
    uploadurl: '',
    userinfo: '',
    uid: 0,
    uuid: 0,
    ttid: 0,
    appflag: 'weixin' //toutiao weixin
  },
  onLaunch: function() {

  
    var that = this;

  
    uni.login({
      provider: that.globalData.appflag,
      success: function(loginRes) {
        let code = loginRes.code;
        let openid = '';
        console.log('code=====' + code);
        uni.request({
          url: that.globalData.apiurl + '/rest/wxLogin',
          data: {
            code: loginRes.code
          },
                     method: 'GET',
                     header: {
                       'content-type': 'application/json',
                       'Authorization': uni.getStorageSync('token')
                     },
                     success: res => {
                       console.log(res.data.data.sessionKey);
                       let token = res.data.data.token;
                       uni.setStorageSync('token', token);
                       let session_key = res.data.data.sessionKey;
                       uni.setStorageSync('session_key', session_key);
                       openid = res.data.data.openId;
                       uni.setStorageSync('openid', openid);
                       uni.request({
                         url: that.globalData.apiurl + '/rest/getUserInfo',
                         header: {
                           'content-Type': 'application/json;charset=UTF-8',
                           'Authorization': uni.getStorageSync('token')
                         },
                         method: 'GET',
                         success: function(res) {
                           uni.setStorageSync('userInfo', res.data.data);
                         }
                       });
                     }
        });
      }
    });
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style lang="less">
@import './common/iconfont.css';
.content {
  // padding-top: 20rpx;
  overflow-x: hidden;
}
.flex1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  
}
.container {
  width: calc(100%);
  margin: 0 auto;
}
.overhide {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.overhidemore {
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; //设置 需要显示的行数
}
/*每个页面公共css */

.font_right {
  width: 16rpx;
  height: 16rpx;
  display: inline-block;
  border-top: 4rpx solid #000;
  border-right: 4rpx solid #000;
  transform: rotateZ(45deg);
}

.btn {
  background-color: #609fe0;
  color: white;
  margin: 40rpx 10rpx;
  text-align: center;
  height: 80rpx;
  font-size: 32rpx;
  line-height: 80rpx;
}
</style>
