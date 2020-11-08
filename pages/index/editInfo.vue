<template>
  <div class="edit-profile">
	  <!-- 修改-->
     <view class="data_info">
		<textarea v-model="input_data" @input="onInput" />
		<div class="op">
		  <button id="btn" type="primary" :disabled="isDisabled" @click="modifyUserInfo"> {{i18n.confirm}}</button>
		</div>
	</view>
	
  </div>
</template>

<script>
export default {
  data() {
    return {
		userInfo: {},
		index: 0,
		input_data:'',
		isDisabled:false,
    }
  },
  onLoad:function(option){
  	const system_info = uni.getStorageSync('system_info')
  	this.$data.system_lenguage = system_info;
  	this._i18n.locale = system_info;
  	// 设置导航栏标题
  	 uni.setNavigationBarTitle({
  	  title: option.label
  	})
  	this.$data.index = option.index;
  	this.userInfo = uni.getStorageSync('userInfo');//获取本地数据
  	if(this.index==0){
		 this.$data.input_data = this.userInfo.name;
  	}else if(this.index==1){
		this.$data.input_data = this.userInfo.corpUserName;
  	}else if(this.index==2){
		this.$data.input_data = this.userInfo.phone;
  	}else if(this.index==3){
		this.$data.input_data = this.userInfo.email;
  	}else if(this.index==4){
		this.$data.input_data = this.userInfo.corpNeeds;
  	}else if(this.index==5){
		this.$data.input_data = this.userInfo.corpInfo;
  	}else if(this.index==6){
		this.$data.input_data = this.userInfo.productInfo;
  	}
	let len=this.input_data.length;
	console.log(len)
	if(len>0){
	   this.isDisabled=false;
	}else{
	   this.isDisabled=true;
	}
  },
   computed: {  
       i18n () {  
        return this.$t('index')  
    },
  },
  methods:{
	  modifyUserInfo() {
	    const that = this;
		if(this.index==0){
			 this.userInfo.name=this.input_data;
		}else if(this.index==1){
			this.userInfo.corpUserName=this.input_data;
		}else if(this.index==2){
			this.userInfo.phone=this.input_data;
		}else if(this.index==3){
			this.userInfo.email=this.input_data;
		}else if(this.index==4){
			this.userInfo.corpNeeds=this.input_data;
		}else if(this.index==5){
			this.userInfo.corpInfo=this.input_data;
		}else if(this.index==6){
			this.userInfo.productInfo=this.input_data;
		}
	    uni.request({
	      url: getApp().globalData.apiurl + '/rest/modifyUserInfo',
	      data: {
	        corpUserName: that.userInfo.corpUserName,
	        phone: that.userInfo.phone,
	        email: that.userInfo.email,
	        address: that.userInfo.address,
	        name: that.userInfo.name,
	        productInfo: that.userInfo.productInfo,
	        corpInfo: that.userInfo.corpInfo,
	        corpNeeds: that.userInfo.corpNeeds
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
				uni.navigateBack();
	          }
	        });
	      }
	    });
	  },
	  onInput(e) {
		 let len=e.detail.cursor;
		 if(len>0){
			 this.isDisabled=false;
		 }else{
			 this.isDisabled=true;
		 }
	  }
  }
 
}
</script>

<style scoped>
.data_info textarea{
	width: 92%;
	margin: 20rpx;
	padding: 20rpx;
	border-bottom: 1rpx solid #f8f8f8;
}
.op button {
  width: 700rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  margin-top: 50rpx;
  background-color: #33a3ff;
}
.op {
  padding-bottom: 50rpx;
}
</style>
