<template>
    <div id="cart">
        <nav-bar class="nav-bar">
            <div slot="center">购物车({{cartLength}})</div>
        </nav-bar>
        <!--商品列表-->
        <cart-list class="cart-list"/>
        <!--底部總價計算欄 -->
        <cart-bottom-bar/>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import CartList from './childComps/CartList'
    import CartBottomBar from './childComps/CartBottomBar'

    import {mapGetters} from 'vuex'

    export default {
        name: "Cart",
        components: {
            NavBar,
            CartList,
            CartBottomBar
        },
        computed: {
            ...mapGetters(['cartLength', 'cartList'])//使用vuex中的getters中的函數
            //用法2
            // ...mapGetters({
            //     length:'cartLength',
            //     list:'cartList'
            // })
        }
    }
</script>

<style scoped>
    #cart {
        /*position: relative;*/
        height: 100vh;
    }

    .nav-bar {
        background-color: var(--color-tint);
        font-weight: 700;
        color: #fff;
    }

    .cart-list {
        position: absolute;
        top: 44px;
        bottom: 49px;
        width: 100%;
        overflow: hidden;
    }
</style>
