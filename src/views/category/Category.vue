<template>
    <div id="category">
        <nav-bar class="category-nav nav-bar">
            <div slot="center">商品分类</div>
        </nav-bar>

        <div class="content">
            <tab-menu :categories="categories"
                      @selectItem="selectItem"></tab-menu>

            <scroll id="tab-content" ref="scroll">
                <div>
                    <tab-content-category :subcategories="showSubcategory"
                                          @imageLoad="imageLoad"></tab-content-category>
                    <tab-control :titles="['综合', '新品', '销量']"
                                 @tabClick="tabClick"></tab-control>

                    <!--<tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail>-->
                    <good-list :goods="showCategoryDetail"/>
                </div>
            </scroll>
        </div>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'

    import TabMenu from './childComps/TabMenu'
    import TabControl from 'components/content/tabControl/TabControl'
    import Scroll from 'components/common/scroll/Scroll'

    import TabContentCategory from './childComps/TabContentCategory'
    // import TabContentDetail from './childComps/TabContentDetail'
    import GoodList from 'components/content/goods/GoodsList'

    import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
    // import {POP, SELL, NEW} from "@/common/const";
    import {itemListenerMixin, tabControlMixin} from "common/mixin";

    export default {
        name: "Category",
        components: {
            NavBar,
            TabMenu,
            TabControl,
            Scroll,
            TabContentCategory,
            // TabContentDetail,
            GoodList,
        },
        mixins: [itemListenerMixin, tabControlMixin],
        data() {
            return {
                categories: [],
                categoryData: {},
                currentIndex: -1,
                saveY: 0
            }
        },
        created() {
            // 1.请求分类数据
            this._getCategory()
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

        computed: {
            showSubcategory() {
                if (this.currentIndex === -1) return {}
                return this.categoryData[this.currentIndex].subcategories
            },
            showCategoryDetail() {

                if (this.currentIndex === -1) return []
                // console.log("this.categoryData",this.categoryData)
                return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
            }
        },
        methods: {
            _getCategory() {
                getCategory().then(res => {
                    console.log(res)
                    // 1.获取分类数据
                    this.categories = res.data.category.list//拿到目錄
                    // 2.初始化每个类别的子数据
                    for (let i = 0; i < this.categories.length; i++) {
                        this.categoryData[i] = {
                            subcategories: {},
                            categoryDetail: {
                                'pop': [],
                                'new': [],
                                'sell': []
                            }
                        }
                    }
                    // 3.请求第一个分类的数据
                    this._getSubcategories(0)
                })
            },
            _getSubcategories(index) {
                this.currentIndex = index;
                const mailKey = this.categories[index].maitKey;
                getSubcategory(mailKey).then(res => {
                    console.log("getSubcategory",res)
                    this.categoryData[index].subcategories = res.data//具體的子分類
                    this.categoryData = {...this.categoryData}
                    this._getCategoryDetail('pop')
                    this._getCategoryDetail('new')
                    this._getCategoryDetail('sell')
                })
            },
            _getCategoryDetail(type) {
                // 1.获取请求的miniWallkey
                const miniWallkey = this.categories[this.currentIndex].miniWallkey;
                // 2.发送请求,传入miniWallkey和type
                getCategoryDetail(miniWallkey, type).then(res => {
                    // 3.将获取的数据保存下来
                    console.log("getCategoryDetail",res)
                    this.categoryData[this.currentIndex].categoryDetail[type] = res//詳細的商品資料
                    this.categoryData = {...this.categoryData}
                })
            },
            /**
             * 事件响应相关的方法
             */
            selectItem(index) {
                this._getSubcategories(index)
            },
            imageLoad() {
                this.$refs.scroll.refresh()
                // this.getThemeTopY()

            },

        }
    }
</script>

<style scoped>
    #category {
        height: 100vh;
        position: relative;
    }

    .nav-bar {
        background-color: var(--color-tint);
        font-weight: 700;
        color: #fff;
    }

    .content {
        position: absolute;
        left: 0;
        right: 0;
        top: 44px;
        bottom: 49px;

        display: flex;
        overflow: hidden;
    }

    #tab-content {
        height: 100% ;
        flex: 1;
        overflow: hidden;
        /*position: absolute;*/
        /*!*只有內容可滾動*!*/
        /*top: 44px;*/
        /*bottom: 49px;*/
        /*left: 0;*/
        /*right: 0;*/
    }


</style>
