<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"/>
        <scroll class="content"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info ref="params" :param-info="paramInfo"/>
            <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
            <detail-Recommend-info ref="recommend" :recommend-list="recommendList"/>
        </scroll>
        <!-- @click.native監聽組件的點擊事件 -->
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
        <detail-bottom-bar @addToCart="addToCart"/>
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailRecommendInfo from './childComps/DetailRecommendInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'

    import Scroll from 'components/common/scroll/Scroll'

    import {debounce} from "common/utils";
    import {itemListenerMixin, backTopMixin} from "common/mixin";
    import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";

    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailRecommendInfo,
            DetailBottomBar,

            Scroll,
        },
        mixins: [itemListenerMixin, backTopMixin],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommendList: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0
            }
        },
        mounted() {

        },
        created() {
            // 1.保存传入的iid
            this.iid = this.$route.params.iid
            // 2.根据iid请求详情数据
            getDetail(this.iid).then(res => {
                // 1.获取顶部的图片轮播数据
                console.log(res);
                const data = res.result;
                this.topImages = data.itemInfo.topImages

                // 2.获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
                // 3.创建店铺信息的对象
                this.shop = new Shop(data.shopInfo)
                // 4.保存商品的详情数据
                this.detailInfo = data.detailInfo;
                // 5.获取参数的信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
                // 2.7.保存评论信息
                if (data.rate.list) {
                    this.commentInfo = data.rate.list[0];
                }
                this.$nextTick(() => {
                    //此方法在所有DOM渲染後執行,不包含圖片

                })
            })

            getRecommend().then(res => {
                this.recommendList = res.data.list
                console.log("recommendList", this.recommendList)
            })
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = []
                this.themeTopYs.push(0)
                this.themeTopYs.push(this.$refs.params.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)

            }, 100)

        },
        updated() {

        },
        destroyed() {
            //取消全局監聽事件
            this.$bus.$off('itemImgLoad', this.itemImgListener)
            console.log("取消全局監聽事件")
        },
        methods: {
            imageLoad() {
                this.$refs.scroll.refresh()
                this.getThemeTopY()

            },
            titleClick(index) {
                console.log("this.themeTopYs[index]", this.themeTopYs[index])
                // this.$refs.scroll.scrollTo(0, this.saveY, 0)
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
            },
            contentScroll(position) {
                const positionY = -position.y
                let length = this.themeTopYs.length;
                //決定導航條的高亮位置
                for (let i = 0; i < length - 1; i++) {

                    if (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
                        if (this.currentIndex !== i) {
                            this.currentIndex = i;
                            this.$refs.nav.currentIndex = this.currentIndex//改導航條文字顏色
                            console.log("currentIndex", this.currentIndex)

                        }
                        break

                    }
                }
                // 1.判断BackTop是否显示
                // this.isShowBackTop = (-position.y) > 1000
                this.listenShowBackTop(position)


            },
            backClick() {
                this.backTop()
                // this.$refs.scroll.scrollTo(0, 0)
            },

            addToCart() {
                // 1.獲取購物車需要展示的信息
                const product = {}
                product.image = this.topImages[0]
                product.title = this.goods.title
                product.desc = this.goods.desc
                product.price = this.goods.realPrice
                product.iid = this.iid

                //2.添加物品入購物車
                // this.$store.commit('addCart',product)
                this.$store.dispatch('addCart', product).then(res => {
                    this.$toast.show("加入購物車成功")
                })
            }
        }
    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }

    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }

    .content {
        height: calc(100% - 44px - 58px);
    }
</style>