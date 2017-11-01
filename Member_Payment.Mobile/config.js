define(function () {
    require.config({
        baseUrl: 'plugins',
        paths: {
            "vue": ["../../../plugins/vue/vue.min"],
            'vue-router': ['../../../plugins/vue/vue-router.min'],
            'mock': ['../../../plugins/mock/mock-min'],
            'mockApi': ['../../../plugins/mock/mock-test'],
            'axio': ['../../../plugins/axios/axios.min'],
            'main': ['../../../assets/js/main'],
        },
        shim: {

        }
    });
});
