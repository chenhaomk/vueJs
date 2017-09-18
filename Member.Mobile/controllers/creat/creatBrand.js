require(['config'], function () {
    require(['vue', 'main', 'imgup', 'city-picker'], function (Vue, ygg, OSS) {
        var vm = new Vue({
            el: "#app",
            data: {
                btn_next: "跳过",
                brand: {},
                isbrand: false
            },
            methods: {
                jumpToList: function () {
                    location.href = "brandList.html";
                    getBrandBind();
                }
            }
        });

        var bussiness_id = ygg.getCookie("business_check_id");
        if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
            window.open("register.html", "_self");
        var bussiness_id = ygg.getCookie("business_check_id");
        getBrandBind();

        function getBrandBind() {
            ygg.ajax("/business/getBindBrandInfoById", {
                    business_check_id: bussiness_id
                },
                function (data) {
                    if (data.status == "error") {
                        ygg.prompt(data.msg);
                    } else if (data.status == "success") {
                        var that = data.data;
                        vm.brand = that;
                        vm.isbrand = that.brand_id ? true : false;
                        if (that != null)
                            vm.$set(vm, "btn_next", "下一步");
                    }
                });
        }

    });
});