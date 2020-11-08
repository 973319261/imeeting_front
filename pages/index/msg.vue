<template>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				
			};
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
			  title: this.i18n.tabBar.message
			})
			this.getDataList();
		},
		computed: {
		     i18n () {  
		      return this.$t('index')  
		  },
		},
		onShow(){
			// 设置导航栏标题
			 uni.setNavigationBarTitle({
			  title: this.i18n.tabBar.message
			})
		},
		
}
</script>

<style>
</style>
