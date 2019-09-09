import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//事件總線,用於非父子組件間傳遞信息
Vue.prototype.$bus = new Vue()

//安裝toast插件
Vue.use(toast)

//解決移動端300ms延遲
FastClick.attach(document.body)

//使用圖片懶加載的插件
Vue.use(VueLazyLoad,{
    loading:require('./assets/img/common/placeholder.png')
})


new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
