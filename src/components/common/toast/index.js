import Toast from './Toast'

const obj = {}

obj.install = function (Vue) {

    //1.創建組件構造器
    const toastContrustor = Vue.extend(Toast)

    //2.new的方式,根據組件構造器,可以創建出來一個組件對象
    const toast = new toastContrustor()
    //3.將組件對象,手動挂載到一個元素上
    toast.$mount(document.createElement('div'))
    //4.toast.$el對應的就是div
    document.body.appendChild(toast.$el)

    Vue.prototype.$toast = toast
}

export default obj