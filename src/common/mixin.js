import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
    data(){
      return {
          itemImgListener:null
      }
    },
    mounted() {
        // 1.图片加载完成的事件监听
        let refresh = debounce(this.$refs.scroll.refresh, 50)
        //對監聽事件進行保存
        this.itemImgListener = () => {
            refresh()
        }
        this.$bus.$on('itemImageLoad', this.itemImgListener)
        console.log('我是混入內容')
    }
}

export const backTopMixin = {
    data: function () {
        return {
            isShowBackTop: false
        }
    },
    components:{
        BackTop
    },
    methods: {
        backTop: function () {
            this.$refs.scroll.scrollTo(0, 0, 300);
        },
        listenShowBackTop(position){

            this.isShowBackTop = (-position.y) > 1000

        }
    }
}



export const tabControlMixin = {
    data: function () {
        return {
            currentType: 'pop'
        }
    },
    methods: {
        tabClick(index) {
            switch (index) {
                case 0:
                    this.currentType = 'pop'
                    break
                case 1:
                    this.currentType = 'new'
                    break
                case 2:
                    this.currentType = 'sell'
                    break
            }
            console.log(this.currentType);
        }
    }
}
