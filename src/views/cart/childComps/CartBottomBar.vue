<template>
    <div class="bottom-menu">
        <check-button class="select-all"
                      :value="isSelectAll"
                      @click.native="checkClick">

        </check-button>

        <span>全选</span>
        <span class="total-price">合计: ¥{{totalPrice}}</span>
        <span class="buy-product" @click="calcClick">去计算({{checkLength}})</span>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    import CheckButton from 'components/content/checkButton/CheckButton'

    export default {
        name: "CartButtonBar",
        components: {
            CheckButton
        },
        computed: {
            ...mapGetters(['cartList',]),
            totalPrice() {
                const cartList = this.cartList;
                return cartList.filter(item => {
                    return item.checked
                }).reduce((preValue, item) => {
                    return preValue + item.count * item.price
                }, 0).toFixed(2)
            },
            checkLength() {
                return this.cartList.filter(item => item.checked).length
            },
            isSelectAll() {
                if (this.cartList.length === 0) return false
                //找到有一個沒選中
                return !this.cartList.find(item => !item.checked)
            }

        },
        methods: {
            checkClick() {
                if (this.isSelectAll) {//全部選中
                    this.cartList.forEach(item => item.checked = false)
                } else {//有部分或全部不選中
                    this.cartList.forEach(item => item.checked = true)
                }
            },
            calcClick() {
                if (!this.checkLength) {
                    this.$toast.show("請選擇購買的商品")
                }
            }
        }
    }
</script>

<style scoped>
    .bottom-menu {
        width: 100%;
        height: 44px;
        background-color: #eee;
        position: fixed;
        bottom: 50px;
        left: 0;
        box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
        font-size: 14px;
        color: #888;
        line-height: 44px;
        padding-left: 35px;
        box-sizing: border-box;
    }

    .bottom-menu .select-all {
        position: absolute;
        line-height: 0;
        left: 12px;
        top: 13px;
    }

    .bottom-menu .total-price {
        margin-left: 15px;
        font-size: 16px;
        color: #666;
    }

    .bottom-menu .buy-product {
        background-color: orangered;
        color: #fff;
        width: 100px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        float: right;
    }
</style>