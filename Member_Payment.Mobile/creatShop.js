require(['config'], function () {
    require(['vue', 'main', 'imgup', 'city-picker'], function (Vue, ygg, OSS) {
        var vm = new Vue({
                el: "#app",
                data: {
                    menu: ['全部', '待使用', '已使用'],
                    img_show: true,
                    ind: 0,
                    list: [],
                    city: "锦江区",
                    filterShop: "请选择行业",
                    filterAddress: "请选择商圈",
                    name: "",
                    area_id: "510104",
                    business_circle_id: "",
                    address: "",
                    industry_id: "",
                    inner_imgs: [],
                    face_img: [],
                    logo_img: [],
                    mobile: "",
                    inner: [],
                    face: [],
                    logo: [],
                    filterAddressCols0: [],
                    inner_imgs_list: [],
                    face_img_list: [],
                    logo_img_list: [],
                },
                methods: {
                    getDataDoor: function (a) {
                        this.$set(this, 'face', a);
                        su = false;
                    },
                    getDataInner: function (a) {
                        this.$set(this, 'inner', a);
                        su = false;
                    },
                    getDataLogo: function (a) {
                        this.$set(this, 'logo', a);
                        su = false;
                    },
                    blurTip: function (s, t, r) {
                        ygg.verify(s, t, r);
                    },
                    next: function () {
                        event.preventDefault();
                        window.event.returnValue = false;
                        var that = this;
                        if (that.name.length == 0) {
                            ygg.prompt("请您填写商铺名称！");
                            return;
                        }
                        if (that.area_id.length == 0) {
                            ygg.prompt("请您选择商铺地区！");
                            return;
                        }
                        if (that.address.length == 0) {
                            ygg.prompt("请您填写详细地址！");
                            return;
                        }
                        if (that.mobile.length == 0) {
                            ygg.prompt("请您填写联系方式！");
                            return;
                        }
                        if (!(/^((0\d{2,3}-\d{7,8})|(1(([34578][0-9]))\d{8}))$/.test(that.mobile))) {
                            ygg.prompt("请输入合理电话号码,座机号请输入区号，并且带‘-’");
                            return;
                        }
                        if (that.industry_id.length == 0) {
                            ygg.prompt("请您选择所属行业！");
                            return;
                        }
                        // if (that.inner_imgs.length == 0 || that.logo_img.length == 0 || that.face_img.length == 0) {
                        //     ygg.prompt("请您上传所需图片！");
                        //     return;
                        // }
                        if (!vm.img_show) {
                            submit();
                            return;
                        }
                        ygg.uploadImg(that.face, function (face) {
                            su = true;
                            that.face_img_list = face;
                            ygg.uploadImg(that.logo, function (logo) {
                                that.logo_img_list = logo;
                                ygg.uploadImg(that.inner, function (inner) {
                                    that.inner_imgs_list = inner;
                                    submit();
                                });
                            });
                        });
                    }
                },
                components: {
                    uploader: ygg.template.uploader
                }
            }),
            su = false,
            bussiness_id = ygg.getCookie("business_check_id");
        if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
            window.open("register.html", "_self");
        ygg.getClient(OSS);
        firstOpen = true,
            filterData = {
                member_id: ygg.getCookie('member_id'),
                page: 1,
                area_id: "",
                size: 10
            };

        ygg.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function () {
            $("#city-picker").val("四川省 成都市 " + vm.city)
            $("#city-picker").cityPicker({
                toolbarTemplate: '<header class="bar bar-nav">\
                <button class="button button-link pull-right close-picker">确定</button>\
                <h1 class="title">选择地址</h1>\
                </header>',
                onOpen: function (p) {
                    vm.openShadow = "show";
                    if (firstOpen) {
                        p.cols[2].setValue(vm.city, "all 0s");
                        firstOpen = false;
                    }
                },
                onClose: function (p) {
                    vm.openShadow = "";
                    //$(".text-sl").text((p.cols[1].value).replace("市", ""));
                    filterData.area_id = getCityId(p.cols[0].value, p.cols[1].value);
                    vm.city = p.cols[2].value;
                    vm.area_id = getAreaId(p.cols[0].value, p.cols[1].value, p.cols[2].value);
                    vm.filterAddress = "请选择商圈";
                    vm.business_circle_id = "";
                    getFilter();
                }
            });

            filterData.area_id = getCityId(remote_ip_info.province + "省", remote_ip_info.city + "市");
            getFilter();
            getShopInfo(ygg.getCookie("business_check_id"));
        });

        function getFilter() {
            ygg.ajax('/home/getHomeCenter', {
                area_id: filterData.area_id
            }, function (data) {
                data = data.data;
                var filterShopList = [];
                for (var i = 0; i < data.industry_list.length; i++) {
                    filterShopList.push(data.industry_list[i].name);
                    if (vm.industry_id != "" && vm.industry_id == data.industry_list[i].industry_id) {
                        vm.filterShop = data.industry_list[i].name;
                    }
                }

                $("#filter_shop").picker({
                    toolbarTemplate: '<header class="bar bar-nav">\
                    <button class="button button-link pull-right close-picker">确定</button>\
                    <h1 class="title">选择行业</h1>\
                    </header>',
                    cols: [{
                        textAlign: 'center',
                        values: filterShopList
                    }],
                    onOpen: function (p) {
                        vm.openShadow = "show";
                    },
                    onClose: function (p) {
                        vm.openShadow = "";
                        vm.$set(vm, "filterShop", p.cols[0].value);
                        p.cols[0].activeIndex == 0 ? filterData.industry_id = "" : filterData.industry_id = data.industry_list[p.cols[0].activeIndex - 1].industry_id;
                        if (data.industry_list.length > 0) {
                            vm.industry_id = data.industry_list[p.cols[0].activeIndex].industry_id;
                        }
                    }
                });
                vm.filterAddressCols0 = [];
                list = [];
                for (var i = 0; i < data.area_circle_list.length; i++) {
                    if (vm.area_id != "" && vm.area_id == data.area_circle_list[i].area_id) {
                        list.push(data.area_circle_list[i].circle_list);
                        vm.city = data.area_circle_list[i].area_name;
                    }
                }
                if (list.length > 0) {
                    for (var j = 0; j < list[0].length; j++) {
                        vm.filterAddressCols0.push(list[0][j].circle_name)
                        if (vm.business_circle_id == list[0][j].circle_id)
                            vm.filterAddress = list[0][j].circle_name;
                    }
                }
                $("#filter_address").picker({
                    toolbarTemplate: '<header class="bar bar-nav">\
                    <button class="button button-link pull-right close-picker">确定</button>\
                    <h1 class="title">选择商圈</h1>\
                    </header>',
                    cols: [{
                        textAlign: 'center',
                        values: vm.filterAddressCols0
                    }],
                    onOpen: function (p) {
                        p.cols[0].replaceValues(vm.filterAddressCols0);
                        p.updateValue();
                        vm.openShadow = "show";
                    },
                    onClose: function (p) {
                        vm.openShadow = "";
                        vm.$set(vm, "filterAddress", p.cols[0].value);
                        if (list[0].length > 0) {
                            vm.business_circle_id = list[0][p.cols[0].activeIndex].circle_id;
                        }
                    }
                });


            });
        }


        function getCityId(b, c) {
            var ct = $.smConfig.rawCitiesData;
            for (var i = 0; i < ct.length; i++) {
                if (ct[i].name == b) {
                    for (var j = 0; j < ct[i]['sub'].length; j++) {
                        if (ct[i]['sub'][j].name == c) {
                            return ct[i]['sub'][j].id;
                        }
                    }
                }
            }
        }

        function getAreaId(b, c, d) {
            var ct = $.smConfig.rawCitiesData;
            for (var i = 0; i < ct.length; i++) {
                if (ct[i].name == b) {
                    for (var j = 0; j < ct[i]['sub'].length; j++) {
                        if (ct[i]['sub'][j].name == c) {
                            for (var index = 0; index < ct[i]['sub'][j]['sub'].length; index++) {
                                if (ct[i]['sub'][j]['sub'][index].name == d)
                                    return ct[i]['sub'][j]['sub'][index].id;
                            }

                        }
                    }
                }
            }
        }

        function getTopData(bid) {
            ygg.ajax('/home/getHomeTop', {
                area_id: filterData.area_id,
                business_id: bid
            }, function (data) {
                data = data.data;
                vm.$set(vm, "banner", data.adverts);

                vm.$set(vm, "shop", data.hot_business);

                if (data.from_business) {
                    vm.$set(vm, "business", data.from_business);
                } else {
                    vm.$set(vm, "business", "none");
                }
            });
        }

        function submit() {
            var id = ygg.getCookie("business_check_id");
            var inner = "";
            var face = "";
            var logo = "";
            if (vm.inner_imgs_list.length > 0) {
                for (var i = 0; i < vm.inner_imgs_list.length; i++) {
                    if (inner != "")
                        inner += ",";
                    inner += vm.inner_imgs_list[i];
                }
            }
            if (vm.face_img_list.length > 0) {
                for (var i = 0; i < vm.face_img_list.length; i++) {
                    if (face != "")
                        face += ",";
                    face += vm.face_img_list[i];
                }
            }
            if (vm.logo_img_list.length > 0) {
                for (var i = 0; i < vm.logo_img_list.length; i++) {
                    if (logo != "")
                        logo += ",";
                    logo += vm.logo_img_list[i];
                }
            }
            ygg.ajax("/business/addBusinessCheckTwo", {
                business_check_id: id,
                name: vm.name,
                area_id: vm.area_id,
                business_circle_id: vm.business_circle_id,
                address: vm.address,
                phone: vm.mobile,
                industry_id: vm.industry_id,
                inner_imgs: inner,
                face_img: face,
                logo: logo
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    ygg.setCookie("business_check_id", data.data.business_check_id);
                    //ygg.prompt("商家创建成功！");
                    location.href = "createBrand.html";
                }
            });
        }

        function getShopInfo(checkId) {
            ygg.ajax("/business/getBusinessCheckDetails", {
                business_check_id: checkId
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    vm.img_show = false;
                    var that = data.data;
                    console.log(that.business_check_id);
                    vm.name = that.name;
                    vm.area_id = that.area_id == null ? 510104 : that.area_id;
                    vm.business_circle_id = that.business_circle_id;
                    vm.address = that.address;
                    vm.mobile = that.phone;
                    vm.industry_id = that.industry_id;
                    vm.inner_imgs_list = vm.inner_imgs = that.inner_imgs;
                    vm.face_img_list = vm.face_img = that.face_img;
                    vm.logo_img_list = vm.logo_img = that.logo;


                }
            });
        }
    });
});