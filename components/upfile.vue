<template>
	<view class="upfile_box flex">
		<view class="file_list" v-for="(item,key) in imgList" :key="key" @click="viewImg(key)">
			<image :src="item" class="img" mode="aspectFit"></image>
			<view @click.stop="remove(key)" class="close">删除</view>
		</view>
		
		<view class="file_list add_box flex" v-if="imgList.length < limit" @click="addImg">
			<image src="/static/img/add.png" mode="widthFix" class="addimg"></image>
		</view>
		 
	</view> 
</template>

<script>
export default {
	props:['limit','imgList1','imgUploadList1','imgtype'],
	created() {
		console.log("created"+JSON.stringify(this.imgList1));
		
		this.showMarquee();
	},
	
	data() {
		return {
			imgList: [],
			imgUploadList: [],
		};
	},
	methods:{
		remove(key){
			console.log("remove:"+JSON.stringify(this.imgList1));
			
			this.imgList.splice(key,1);
			
			this.change(this.imgList,this.imgUploadList);
			this.delimg(key);
		},
		viewImg(key){
			uni.previewImage({
				current: key,
				urls: this.imgList,
			});
		},
		change(data,data1){
			console.log("change=="+JSON.stringify(data));
			
			this.$emit('fileChange', data,data1)
		},
		showMarquee(){

			let _this = this;
			
			if(!_this.imgList1) return;
			
			uni.showLoading({
				title: '加载中,请稍等！'
			});
			
			setTimeout(function() {
				console.log("showMarquee");
				console.log("showMarquee"+JSON.stringify(_this.imgList1));
				
				_this.imgList=_this.imgList1;
				_this.imgUploadList=_this.imgUploadList1;
				
				if(_this.imgList){
					uni.hideLoading();
				}
			}, 1500)
		},
		delimg(key){
			this.imgUploadList.splice(key,1);
		},
		addImg(){
			var that=this;
			uni.chooseImage({
				count: that.limit, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				// sourceType: ['album'], //从相册选择
				success: (res)=> {						
					// this.imgList = res.tempFilePaths
					for (var i=0;i<res.tempFilePaths.length;i++) {
						this.imgList.push(res.tempFilePaths[i]);
						uni.showLoading({
							title: '上传中'
						});
						uni.hideLoading();
						// this.listImg.push(res.tempFilePaths[i]);
						uni.uploadFile({
							url: 'http://47.93.232.72:9666/system/upload',
							filePath: res.tempFilePaths[i],
							name: 'file',
							formData: {
								openid:uni.getStorageSync('openid'),
								idvalue:uni.getStorageSync('daikan_id'),
								type:that.imgtype,
							},
							success: (uploadFileRes) => {
								console.log('uploadImg');
								console.log(uploadFileRes.data);
								var datas=JSON.parse(uploadFileRes.data);
								// datas=datas['data'];
								// console.log(datas.data);
								this.imgUploadList.push(datas.data);
								// that.isupload='ok';
								this.change(this.imgList)
								uni.hideLoading();
							}
						});
					}
				}
			});
		}
		
	}
}
</script>

<style scoped lang="less">
	 .upfile_box{
	 		justify-content: flex-start;
	 		flex-wrap: wrap;
	 		.add_box{
	 			justify-content: center;
	 			background-color: #F2F2F2;
	 			border-radius: 12rpx;
	 			overflow: hidden;
	 			.addimg{
	 				width: 105rpx;
	 				height: 105rpx;
	 			}
	 		}
	 		.file_list{
	 			background-color: #F2F2F2;
	 			margin-right: 30rpx;
	 			margin-bottom: 30rpx;
	 			position: relative;
	 			width: 210rpx;
	 			height: 210rpx;
	 			.img{
	 				width: 100%;
	 				height: 100%;
	 			}
	 			.close{
	 				z-index: 100;
	 				position: absolute;
	 				top: 4rpx;
	 				right: 4rpx;
	 				width: 35rpx;
	 				height: 35rpx;
	 			}
	 			&:nth-child(3n){
	 				margin-right: 0;
	 			}
	 		}
	 	}
</style>
