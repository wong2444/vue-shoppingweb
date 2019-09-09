<template>
    <scroll  ref="scroll">
        <div class="cart-list">
            <cart-list-item v-for="(item,index) in cartList"
                            :product="item" :key="index"/>
        </div>
    </scroll>
</template>

<script>
    import {mapGetters} from 'vuex'

    import CartListItem from './CartListItem'

    import Scroll from 'components/common/scroll/Scroll'

    export default {
        name: "CartList",
        components: {
            CartListItem,
            Scroll,
        },
        computed: {
            ...mapGetters(['cartList'])
        },
        activated() {
            this.$refs.scroll.refresh()
        }

    }
</script>

<style scoped>

</style>