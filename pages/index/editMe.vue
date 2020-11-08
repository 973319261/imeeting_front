<template>
  <div class="edit-profile">
    <!-- 企业头像-->
    <ul class="user-info" v-if="userInfo.isCorp === 1">
      <li class="avatar-field">
        <span class="label">{{i18n.enterprise_image}}</span>
        <img :src="userInfo.avatar" mode="widthFix" class="avatar" />
      </li>
      <li @click="goEditPage(0,i18n.company_name)">
        <view class="right-box">
          <span class="label">
            {{i18n.company_name}}
          </span>
          <view class="view_data">{{name}}</view>
          <view class="iconfont iconmore1"></view>
        </view>
      </li>
      <li>
        <view class="right-box" style=" border-bottom: none">
          <picker @change="bindPickerChange" :value="index" :range="addresslist" style="position: absolute;top: 0rpx;left: 0rpx;width: 100%;">
            <span class="label" style="float: left;margin-left: 10rpx;"> {{i18n.countries}}</span>
            <view style="position: absolute;top: 0rpx;right: 16rpx;">
              <input style="text-align: right;display: inline-block;padding-top: 32rpx;" class="right-select" name="address" :value="address" type="text" disabled="disabled" :placeholder="i18n.countries_hine" />
              <view style="float: right;" class="iconfont iconmore1"></view>
            </view>

          </picker>
        </view>
      </li>
    </ul>
    <ul v-else class="user-info">
      <li class="avatar-field">
        <span class="label">{{i18n.enterprise_image}}</span>
        <img :src="userInfo.avatar" mode="widthFix" class="avatar" />
      </li>
      <li>
        <view class="right-box">
          <span class="label">
            {{i18n.name}}
          </span>
          <div>
            <input :placeholder="i18n.unfilled" v-model="corpUserName" />
          </div>
        </view>
      </li>
      <li>
        <view class="right-box">
          <span class="label">{{i18n.sex}}</span>
          <picker @change="changeSex" :value="sexIndex" :range="sexList">
            <span v-if="sex === 'F'">{{i18n.man}}</span>
            <span v-else>{{i18n.woman}}</span>
          </picker>
        </view>
      </li>
      <li>
        <view class="right-box">
          <span class="label">
            {{i18n.company_name}}
          </span>
          <div>
            <input :placeholder="i18n.unfilled" v-model="name" />
          </div>
        </view>
      </li>
      <li v-if="!userInfo.isCorp">
        <view class="right-box">
          <span class="label">
            {{i18n.position}}
          </span>
          <div>
            <input :placeholder="i18n.unfilled" v-model="positions" />
          </div>
        </view>
      </li>
    </ul>


    <!-- 联系方式 -->
    <!-- 标题 -->
    <!-- 内容 -->
    <ul class="user-info">
      <!-- 企业联系人 -->
      <li v-if="userInfo.isCorp === 1">
        <view class="right-box">
          <span class="label">
            {{i18n.contacts}}
          </span>
          <div>
            <input :placeholder="i18n.unfilled" v-model="corpUserName" />
          </div>
        </view>
      </li>
      <!-- 手机号 -->
      <li>
        <view class="right-box">
          <span class="label">
            {{i18n.phone}}
          </span>
          <div>
            <input :placeholder="i18n.unfilled" v-model="phone" />
          </div>
        </view>
      </li>
      <li v-if="!userInfo.isCorp">
        <view class="right-box">
          <span class="label">
            {{i18n.wechat_id}}
          </span>
          <div class="wx-no">
            <input :placeholder="i18n.unfilled" v-model="wxCode" />
          </div>
        </view>
      </li>
      <!-- email -->
      <li>
        <view class="right-box">
          <span class="label">
            {{i18n.email}}
          </span>
          <div>
            <input :placeholder="i18n.unfilled" v-model="email" />
          </div>
        </view>
      </li>
    </ul>



    <!-- 企业需求 -->
    <!-- 标题 -->
    <div v-if="userInfo.isCorp === 1">
      <p class="tip">{{i18n.enterprise}}</p>
      <!-- 内容 -->
      <div>
        <textarea class="des" :placeholder="i18n.unfilled" v-model="corpNeeds" />
      </div>


      <!-- 公司简介 -->
      <!-- 标题 -->
      <p class="tip">{{i18n.company}}</p>
      <!-- 内容 -->
      <div>
        <textarea class="des" :placeholder="i18n.unfilled" v-model="corpInfo" />
      </div>


      <!-- 产品简介 -->
      <!-- 标题 -->
      <p class="tip">{{i18n.product}}</p>
      <!-- 内容 -->
      <div>
        <textarea class="des" :placeholder="i18n.unfilled" v-model="productInfo" />
      </div>
    </div>


    <div class="op">
      <button type="primary" @click="modifyUserInfo"> {{i18n.sure_update}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      index: '',
      sexIndex: '',
      //addresslist: ['中国','美国','欧盟','日本','韩国','其他地区'],
      addresslist: [],
      corpUserName: '',
      phone: '',
      email: '',
      address: '',
      name: '',
      corpNeeds: '',
      corpInfo: '',
      productInfo: '',
      sex: 'F',
      sexList: ['男', '女'],
      joinedMeeting: '',
      wxCode: '',
      positions: '',
      meetingId: null
    }
  },
  onLoad(options) {
    const system_info = uni.getStorageSync('system_info')
    if (options) {
      this.meetingId = options.meetingId;
    }
    this.$data.system_lenguage = system_info;
    this._i18n.locale = system_info;
    // 设置导航栏标题
    uni.setNavigationBarTitle({
      title: this.i18n.update_info
    });
    this.$data.addresslist= [this.i18n.china, this.i18n.america,
                             this.i18n.eu, this.i18n.japan,this.i18n.korea, this.i18n.other_regions];
    this.getUserInfo();
  },
  computed: {
    i18n () {
      return this.$t('index')
    },
  },
  methods: {
    changeSex(e) {
      this.sexIndex = e.target.value;
      if (this.sexIndex) {
        this.sex = 'M';
      } else {
        this.sex = 'F';
      }
    },
    getUserInfo() {
      this.userInfo = uni.getStorageSync('userInfo');
      this.corpUserName = this.userInfo.corpUserName;
      this.phone = this.userInfo.phone;
      this.email = this.userInfo.email;
      this.address = this.userInfo.address;
      this.name = this.userInfo.name;
      this.productInfo = this.userInfo.productInfo;
      this.corpInfo = this.userInfo.corpInfo;
      this.corpNeeds = this.userInfo.corpNeeds;
      this.joinedMeeting = this.userInfo.joinedMeeting;
      this.sex = this.userInfo.sex;
      this.wxCode = this.userInfo.wxCode;
      this.positions = this.userInfo.positions;
    },
    goEditPage(index,label){
      uni.navigateTo({
        url: '/pages/index/editInfo?index='+index+'&label='+label
      });
    },
    bindPickerChange(e) {
      this.index = e.target.value;
      this.address = this.addresslist[this.index];
    },
    modifyUserInfo() {
		const that = this;
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({
          title: that.i18n.phone_format,
          icon: 'none'
        });
        return;
      }
      if (!this.name) {
        uni.showToast({
          title: that.i18n.company_no_empty,
          icon: 'none'
        });
        return;
      }
      if (!this.userInfo.isCorp) {
        if (!this.positions) {
          uni.showToast({
            title: that.i18n.position_no_empty,
            icon: 'none'
          });
          return;
        }
        if (!this.corpUserName) {
          uni.showToast({
            title: that.i18n.name_no_empty,
            icon: 'none'
          });
          return;
        }
      }
      
      uni.request({
        url: getApp().globalData.apiurl + '/rest/modifyUserInfo',
        data: {
          corpUserName: that.corpUserName,
          phone: that.phone,
          email: that.email,
          address: that.address,
          name: that.name,
          productInfo: that.productInfo,
          corpInfo: that.corpInfo,
          corpNeeds: that.corpNeeds,
          joinedMeeting: that.joinedMeeting,
          sex: that.sex,
          wxCode: that.wxCode,
          positions: that.positions
        },
        header: {
          'Authorization': uni.getStorageSync('token')
        },
        success: function(res) {
          uni.request({
            url: getApp().globalData.apiurl + '/rest/getUserInfo',
            header: {
              'content-Type': 'application/json;charset=UTF-8',
              'Authorization': uni.getStorageSync('token')
            },
            method: 'GET',
            success: function(res) {
              uni.setStorageSync('userInfo', res.data.data);
              that.getUserInfo();
              if (!that.meetingId) {
                uni.switchTab({
                  url: '/pages/index/me'
                });
              } else {
                uni.navigateBack();
              }
            }
          });
        }
      });
    }
  },
  onShow() {
    this.getUserInfo();
  }
}
</script>

<style scoped>
.right-box {
  display: flex;
  position: relative;
  width: 100%;
  height: 110rpx;
  line-height: 110rpx;
  box-sizing: border-box;
  padding-right: 10rpx;
  padding-left: 10rpx;
  text-align: left;
  align-items: center;
  justify-content: space-between;
  font-size: 30rpx;
  border-bottom: 0.5rpx solid #f8f8f8;
}
.right-select{
  padding-right: 35rpx;
  border-bottom: 0.5rpx solid #eee;
}
.right-box .view_data{
  display: flex;
  position: absolute;
  right: 50rpx;
  text-align: right;
  color: #333;
}
.user-info{
  padding:0rpx 20rpx;
  border-bottom: 20rpx solid #f8f8f8;
}
.user-info li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right-select{
  font-size: 30rpx;
  text-align: center;
  /* position: absolute;
     right: -110rpx;
     top: 35rpx; */
  color: #333;
}
.right-box .title,
.user-info li .label {
  text-align: right;
  font-size: 30rpx;
  color: #000;
}

.user-info li input {
  font-size: 25rpx;
  text-align: right;
}
.avatar-field {
  height: 120rpx;
  line-height: 120rpx;
  padding: 10rpx;
  border-bottom: 1rpx solid #eee;
}
.avatar {
  width: 80rpx;
  border-radius: 50%;
}
.tip {
  padding: 20rpx;
  font-size: 30rpx;
  margin-left: 10rpx;
  position: relative;
}
.tip .iconfont{
  position: absolute;
  right: 30rpx;
  top: 25rpx;
}
.item_box {
  border-top: 15rpx solid #dfdfdf;
}
.item_box .title {
  padding: 20rpx;
}
.op button {
  width: 700rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  margin-top: 50rpx;
}
.op {
  padding-bottom: 50rpx;
}
.wx-no input {
  min-width: 300rpx;
}
.iconfont {
  font-size: 40rpx;
  color: rgb(43, 42, 42);
  display: flex;
}
.cover-view{
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-line;
  padding: 10rpx 0rpx 40rpx;
  color: #000;
  font-weight: 300;
  font-size: 30rpx;
}
.area_div{
  border-bottom: 1rpx solid #eee;
  margin: 0 30rpx;
}
</style>
