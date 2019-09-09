<template>
    <div id="home">
        <nav-bar class="home-nav">
            <div slot="center">首頁</div>
        </nav-bar>
        <!--頂部分類導航條-->
        <tab-control :titles="['流行', '新款', '精选']"
                     @tabClick="tabClick"
                     ref="tabControl1"
                     class="tab-control" v-show="isTabFixed"/>
        <scroll class="content" ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="loadMore">
            <!--輪播圖-->
            <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
            <!--圓圈圖-->
            <recommend-view :recommends="recommends"></recommend-view>
            <feature-view/>
            <!--正常的分類導航條-->
            <tab-control class="tab-control"
                         :titles="['流行', '新款', '精选']"
                         @tabClick="tabClick"
                         ref="tabControl2"
            >

            </tab-control>
            <good-list :goods="showGoods"/>

        </scroll>
        <!-- @click.native監聽組件的點擊事件 -->
        <back-top @click.native="backClick" v-show="isShowBackTop" ></back-top>
    </div>
</template>

<script>
    import HomeSwiper from './childComps/HomeSwiper'
    import RecommendView from './childComps/RecommendView'
    import FeatureView from './childComps/FeatureView'


    import NavBar from 'components/common/navbar/NavBar'
    import TabControl from 'components/content/tabControl/TabControl'
    import GoodList from 'components/content/goods/GoodsList'
    import Scroll from 'components/common/scroll/Scroll'
    // import BackTop from 'components/content/backTop/BackTop'

    import {getHomeMutidata, getHomeGoods} from "../../network/home";
    import {debounce} from "common/utils";
    import {itemListenerMixin,backTopMixin} from "common/mixin";


    export default {
        name: "Home",
        components: {
            HomeSwiper,
            RecommendView,
            FeatureView,

            NavBar,
            TabControl,
            GoodList,
            Scroll,
            // BackTop,
        },
        mixins:[itemListenerMixin,backTopMixin],
        data() {
            return {
                banners: [],
                recommends: [],
                goods: {
                    'pop': {page: 0, list: []},
                    'new': {page: 0, list: []},
                    'sell': {page: 0, list: []}
                },
                currentType: 'pop',
                // isShowBackTop: false,
                tabOffsetTop: 0,
                isTabFixed: false,
                saveY: 0
            }
        },
        created() {
            this.getHomeMutidata()
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')

        },
        mounted() {
            // 1.图片加载完成的事件监听
            // const refresh = debounce(this.$refs.scroll.refresh, 50)
            // this.$bus.$on('itemImageLoad', () => {
            //     //監聽圖片加載的事件總線事件
            //     refresh()
            // })
        },
        activated() {
            //頁面恢復
            this.$refs.scroll.scrollTo(0, this.saveY, 0)
            this.$refs.scroll.refresh()
        },
        deactivated() {
            //取消全局監聽事件
            console.log("取消全局監聽事件")
            this.$bus.$off('itemImgLoad', this.itemImgListener)
            //保存頁面離開前的位置
            this.saveY = this.$refs.scroll.getScrollY()
        },

        methods: {
            /**
             * 事件监听相关的方法
             */
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
                //同步頂部導航條和正常導航條的狀態
                this.$refs.tabControl1.currentIndex = index;
                this.$refs.tabControl2.currentIndex = index;
            },
            backClick() {
                this.backTop()
                // this.$refs.scroll.scrollTo(0, 0)
            },
            contentScroll(position) {
                // 1.判断BackTop是否显示
                // this.isShowBackTop = (-position.y) > 1000
                this.listenShowBackTop(position)
                // 2.决定tabControl是否吸顶(position: fixed)
                this.isTabFixed = (-position.y) > this.tabOffsetTop
            },
            loadMore() {

                this.getHomeGoods(this.currentType)
            },
            swiperImageLoad() {
                //HTMLElement.offsetTop 为只读属性，它返回当前元素相对于其 offsetParent 元素的顶部的距离。
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
                // console.log("tabOffset",this.tabOffsetTop)
            },
            /**
             *网络请求相关的方法
             */
            getHomeMutidata() {
                getHomeMutidata().then(res => {
                    console.log(res)
                    this.banners = res.data.banner.list
                    this.recommends = res.data.recommend.list

                })
            },
            getHomeGoods(type) {
                const page = this.goods[type].page + 1
                getHomeGoods(type, page).then(res => {
                    this.goods[type].list.push(...res.data.list)
                    this.goods[type].page += 1
                    this.$refs.scroll.finishPullUp()
                })
            }

        },
        computed: {
            showGoods() {
                console.log("showGoods")
                return this.goods[this.currentType].list
            }
        },

    }
</script>

<style scoped>
    #home {
        /*padding-top: 44px;*/
        height: 100vh;
        position: relative;
    }

    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
        /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
        /*position: fixed;*/
        /*left: 0;*/
        /*right: 0;*/
        /*top: 0;*/
        /*z-index: 9;*/
    }

    .tab-control {
        /*當tab-bar去到44PX時,定位會變為FIXED,他會固定在頂部
        只對原生滾動條有效
        */
        /*position: sticky;*/
        /*top: 44px;*/
        position: relative;
        z-index: 9;
    }

    .content {
        overflow: hidden;
        position: absolute;
        /*只有內容可滾動*/
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }
</style>
