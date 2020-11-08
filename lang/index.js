import LangEn from './en_US.js'
import LangCn from './zh_CN.js'
import LangJa from './ja.js'
import LangKr from './kr.js'
import Vue from 'vue'
import VueI18n from './vue-i18n'
Vue.use(VueI18n)
const system_info = uni.getStorageSync('system_info')
if (!system_info) {
	// 获取设备信息
	uni.getSystemInfo({
		success: function (res) {
			console.log('设备信息'+res)
			uni.setStorageSync('system_info', res);
		}
	})
}
	const cur_lang = system_info.language == 'en' ? 'en' : 'zh_CN'
	const i18n = new VueI18n({
		locale: cur_lang || 'zh_CN',  // 默认选择的语言
		messages: {  
				'en': LangEn,
				'zh_CN': LangCn,
				'ja': LangJa,
				'kr': LangKr
			}
	})
	export default i18n