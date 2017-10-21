define(function(){
    require.config({
        baseUrl: '/plugins',
        paths: {
            "vue": ["vue/vue.min"],
            'vue-router': ['vue/vue-router.min'],
            'mock': ['mock/mock-min'],
            'mock-api': ['mock/mock-test'],
            'axio': ['axios/axios.min'],
            'swiper': ['swiper/swiper.min'],
            'main': ['../assets/js/main'],
            'sui': ['sui/sm.min'],
            'city-picker': ['sui/city-picker'],
            'city-picker-area': ['sui/city-picker-area'],
            'zepto' : ['zepto/zepto'],
            'gaode' : ["https://webapi.amap.com/maps?v=1.3&key=a9506f1b1e66b4e85d7e15c8461ca4d4&plugin=AMap.CitySearch"],
            'imgup' : ["https://gosspublic.alicdn.com/aliyun-oss-sdk-4.3.0.min"],
            "qrcode" : ['qrcode'],
        },
        shim : {
            'city-picker' : {
                deps : ['zepto','sui']
            },
             'city-picker-area' : {
                deps : ['zepto','sui']
            }
        }
    });
});