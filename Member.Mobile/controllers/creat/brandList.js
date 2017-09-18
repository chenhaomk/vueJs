require(['config'], function () {
    require(['vue', 'main', 'imgup', 'city-picker'], function (Vue, ygg, OSS) {
        var vm = new Vue({
            el: "#app",
            data: {
                isSelected: 'none',
                searchName: "",
                ck: "",
                selectName: "",
                selectID: "",
                btn_next: "",
                brandList: [],
                param: {
                    brand_name: "",
                    page: 1,
                    size: 10
                },
                scrollIsShow: true,
            },
            methods: {
                clearSearch: function () {
                    this.searchName = "";
                },
                selectBrand: function (id, name) {
                    event.preventDefault();
                    window.event.returnValue = false;
                    console.log(name)
                    this.id = id;
                    this.selectName = name;
                    this.isSelected = 'inline';
                },
                checkbox: function () {
                    this.ck == "" ? this.$set(this, "ck", "none") : this.$set(this, "ck", "");
                },
                bindBrand: function () {
                    event.preventDefault();
                    window.event.returnValue = false;
                    if (this.ck == "none")
                        return;
                    bind();
                },
                cacenlBrand: function () {
                    this.selectName = "";
                    this.isSelected = 'none';
                }
            },
            watch: {
                searchName: function (newVal, oldVal) {
                    if (newVal == null || newVal == "") {
                        this.brandList = [];
                        return;
                    }
                    getBrandInfo(function (d) {
                        vm.$set(vm, "brandList", d);
                    });
                    vm.param.page = 1;
                    vm.param.brand_name = newVal;
                }
            }
        });

        var bussiness_id = ygg.getCookie("business_check_id"),
            height = document.getElementsByClassName('height')[0].clientHeight,
            flag = false;
        if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
            window.open("register.html", "_self");
        var bussiness_id = ygg.getCookie("business_check_id");

        window.onscroll = function (e) {
            if (e.target.scrollingElement.scrollTop + height + 5.5 * rem >= e.target.scrollingElement.clientHeight) {
                if (flag) return;
                flag = true;
                vm.param.page++;
                getBrandInfo(function (data) {
                    vm.$set(vm, "brandList", vm.brandList.concat(data));
                    flag = false;
                });
            }
        }

        function getBrandInfo(cb) {
            ygg.ajax("/business/getBrandList",
                vm.param,
                function (data) {
                    data = data.data;
                    if (vm.param.page > data.pages && data.pages != 0) {
                        vm.$set(vm, "scrollIsShow", false);
                        return;
                    } else if (data.pages <= 1) {
                        vm.$set(vm, "scrollIsShow", false);
                    }
                    cb(data.brand_list);
                });
        }

        function bind() {
            var id = vm.id,
                bussiness_id = ygg.getCookie("business_check_id");
            if (id == null || id == "") {
                ygg.prompt("数据异常，请稍后再试！");
                return;
            }
            ygg.ajax("/business/bindBrandById", {
                    brand_id: id,
                    business_check_id: bussiness_id
                },
                function (data) {
                    if (data.status == "error") {
                        ygg.prompt(data.msg);
                    } else if (data.status == "success") {
                        location.href = "createBrand.html";
                    }
                });
        }
    });
});