module.exports = {
    plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport": {
            viewportWidth: 375,//視窗的寬度,對應的是我們設計稿的寬度(iphone6)
            viewportHeight: 667,//視窗的高度,對應的是我們設計稿的高度,也可以不設置
            unitPrecision: 5,//指定`px`轉換為視窗單位值的小數位(很多時間無法整除)
            viewportUnit: 'vw',//指定需要轉換成視窗單位,建議使用vm
            //指定不需要轉換的類
            selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'],
            minPixelValue: 1,//小於或等於`1px`不轉換為視窗單位
            mediaQuery: false//允許在媒體查詢中轉換`px`

        }

    }
}
