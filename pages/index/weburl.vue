<template>
	<!-- #ifdef MP-WEIXIN -->
	<view>
		<web-view :webview-styles="webviewStyles" :src="urlsrc"></web-view>
	</view>
	<!-- #endif -->

	<!-- #ifdef H5 -->
	 
	<div>
		<iframe id="mainFrame" name="mainFrame" allowtransparency="true" frameborder="0" width="100%" height="5000" scrolling="no"  src=""></iframe>
	</div>
	 
	<!-- #endif -->
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				urlsrc:'',
			}
		},
		onLoad(options) {
			const system_info = uni.getStorageSync('system_info')
			this.$data.system_lenguage = system_info;
			this._i18n.locale = system_info;
			// 设置导航栏标题
			 uni.setNavigationBarTitle({
			  title: this.i18n.livemeeting
			})
			console.log('urlsrc====='+options.urlsrc);
			this.urlsrc=options.urlsrc;
			// alert(this.urlsrc); 
			// #ifdef H5
				window.open(this.urlsrc)
			// #endif
		},
		 computed: {  
		     i18n () {  
		      return this.$t('index')  
		  },
		},
	}
</script>

<style>
</style>