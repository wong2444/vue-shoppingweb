<template>
    <div>
        <grid-view :cols="3" :lineSpace="15" :v-margin="20" v-if="subcategories.list">
            <div class="item" v-for="(item, index) in subcategories.list" :key="index">
                <a :href="item.link">
                    <img class="item-img" :src="item.image" alt="" @load="imgLoad">
                    <div class="item-text">{{item.title}}</div>
                </a>
            </div>
        </grid-view>
    </div>
</template>

<script>
    import GridView from 'components/common/gridView/GridView'

    export default {
        name: "TabContentCategory",
        components: {
            GridView
        },
        props: {
            subcategories: {
                type: Object,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                counter: 0,
                imagesLength: 0
            }
        },
        methods: {
            imgLoad() {
                // 判断, 所有的图片都加载完了, 那么进行一次回调就可以了.
                if (++this.counter === this.imagesLength) {
                    this.$emit('imageLoad')
                }
            }
        },
        watch: {
            detailInfo() {
                // 获取图片的个数
                this.imagesLength = this.subcategories.list.length
            }
        }
    }
</script>

<style scoped>
    .panel img {
        width: 100%;
    }

    .item {
        text-align: center;
        font-size: 12px;
    }

    .item-img {
        width: 80%;
    }

    .item-text {
        margin-top: 15px;
    }
</style>
