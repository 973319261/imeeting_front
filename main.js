import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import i18n from './lang/index' 
Vue.prototype._i18n = i18n
const system_info = uni.getStorageSync('system_info');
if(system_info.language!=undefined){//默认为中文
	uni.setStorageSync('system_info','zh_CN')
	uni.setStorageSync('languageIndex','0')
}

const app = new Vue({
    i18n,
    ...App
})
app.$mount()
