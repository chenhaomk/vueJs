require(['config'], function () {
    require(['vue', 'main', 'imgup', 'axio', 'city-picker-area'], function (Vue, ygg, OSS, axio) {

        var vm = new Vue({
                el: "#app",
                data: {
                    menu: ['全部', '待使用', '已使用'],
                    ind: 0,
                    list: [],
                    city: "锦江区",
                    filterShop: "请选择行业",
                    filterAddress: "请选择商圈",
                    name: "",
                    area_id: "510104",
                    area_name: "",
                    business_circle_id: "",
                    business_circle_name: "",
                    commissioner_id: "",
                    address: "",
                    industry_id: "",
                    industry_name: "",
                    inner_imgs: [],
                    face_img: [],
                    logo_img: [],
                    mobile: "",
                    inner: [],
                    face: [],
                    logo: [],
                    filterAddressCols0: [],
                    filterAddressCols1: [],
                    inner_imgs_list: [],
                    face_img_list: [],
                    logo_img_list: [],
                    isComShow: true,
                    lat: "",
                    lng: "",
                    member_id: ""
                },
                methods: {
                    goToMap: function (event) {
                        event.preventDefault();
                        var shopDetil = {
                            name: this.name,
                            area_id: this.area_id,
                            area_name: this.area_name,
                            business_circle_id: this.business_circle_id,
                            business_circle_name: this.business_circle_name,
                            commissioner_id: this.commissioner_id,
                            address: this.address,
                            industry_id: this.industry_id,
                            industry_name: this.industry_name,
                            inner: this.inner,
                            face: this.face,
                            logo: this.logo,
                            mobile: this.mobile,
                            member_id: "",
                            lat: "",
                            lng: "",
                            inner_imgs: this.inner_imgs,
                            inner_imgs_list: this.inner_imgs_list,
                            face_img: this.face_img,
                            face_img_list: this.face_img_list,
                            logo_img: this.logo_img,
                            logo_img_list: this.logo_img_list,
                            city: this.city
                        }
                        sessionStorage.removeItem("shopDetil");
                        sessionStorage.setItem("shopDetil", JSON.stringify(shopDetil));
                        window.location.href = "map.html"
                    },
                    getDataDoor: function (a, src, isDel) {
                        this.$set(this, 'face', a);
                        if ((src != null || src != "" || src != undefined) && isDel == 0)
                            this.$set(this, 'face_img', src);
                        else if (isDel == 1) {
                            this.face_img_list = "";
                            this.face_img = "";
                        }
                        su = false;
                    },
                    getDataInner: function (a, src, isDel) {
                        if (this.inner_imgs == undefined)
                            this.inner_imgs = [];
                        this.$set(this, 'inner', a);
                        if ((src != null || src != "" || src != undefined) && isDel == 0) {
                            this.inner_imgs.push(src);
                        } else {
                            if (typeof src == 'object')
                                src = src[0];
                            this.inner_imgs.remove(src);
                            this.inner_imgs_list.remove(src.replace("https://img.yingougou.com/", ""));
                        }
                        su = false;
                    },
                    getDataLogo: function (a, src, isDel) {
                        this.$set(this, 'logo', a);
                        if ((src != null || src != "" || src != undefined) && isDel == 0)
                            this.$set(this, 'logo_img', src);
                        else if (isDel == 1) {
                            this.logo_img_list = "";
                            this.logo_img = "";
                        }
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
                        if (that.business_circle_id.length == 0) {
                            ygg.prompt("请您选择所在商圈！");
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
                        if (!(/^((0\d{2,3}-\d{7,8})|(0\d{2,3}\d{7,8})|(1(([34578][0-9]))\d{8}))$/.test(that.mobile))) {
                            ygg.prompt("请输入合理电话号码,座机号请输入区号");
                            return;
                        }
                        if (that.industry_id.length == 0) {
                            ygg.prompt("请您选择所属行业！");
                            return;
                        }
                        if (that.inner_imgs.length <= 0 || that.logo_img.length <= 0 || that.face_img.length <= 0) {
                            ygg.prompt("请您上传所需图片！");
                            return;
                        }
                        ygg.loading(true);
                        if (su) {
                            submit();
                            return;
                        }
                        if (that.face.length > 0 && that.logo.length > 0 && that.inner.length > 0) {
                            ygg.uploadImg(that.face, function (face) {
                                that.face_img_list = face[0];
                                ygg.uploadImg(that.logo, function (logo) {
                                    that.logo_img_list = logo[0];
                                    ygg.uploadImg(that.inner, function (inner) {
                                        that.inner_imgs_list = inner[0];
                                        submit();
                                    });
                                });
                            });
                        } else if (that.face.length > 0 && that.logo.length > 0) {
                            ygg.uploadImg(that.face, function (face) {
                                that.face_img_list = face[0];
                                ygg.uploadImg(that.logo, function (logo) {
                                    that.logo_img_list = logo[0];
                                    submit();
                                });
                            });
                        } else if (that.face.length > 0 && that.inner.length > 0) {
                            ygg.uploadImg(that.face, function (face) {
                                that.face_img_list = face[0]
                                ygg.uploadImg(that.inner, function (inner) {
                                    that.inner_imgs_list = inner[0];
                                    submit();
                                });
                            });
                        } else if (that.logo.length > 0 && that.inner.length > 0) {
                            ygg.uploadImg(that.logo, function (logo) {
                                that.logo_img_list = logo[0];
                                ygg.uploadImg(that.inner, function (inner) {
                                    that.inner_imgs_list = inner[0];
                                    submit();
                                });
                            });
                        } else if (that.logo.length > 0) {
                            ygg.uploadImg(that.logo, function (logo) {
                                that.logo_img_list = logo[0];
                                submit();
                            });
                        } else if (that.face.length > 0) {
                            ygg.uploadImg(that.face, function (face) {
                                that.face_img_list = face[0];
                                submit();
                            });
                        } else if (that.inner.length > 0) {
                            ygg.uploadImg(that.inner, function (inner) {
                                that.inner_imgs_list.push(inner);
                                submit();
                            });
                        } else {
                            submit();
                            ygg.loading(false);
                        }
                    }
                },
                components: {
                    uploader: ygg.template.uploader
                }
            }),
            su = true,
            bussiness_id = ygg.getCookie("business_check_id");
        // if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
        //     window.open("register.html", "_self");
        ygg.getClient(OSS);


        firstOpen = true,
            filterData = {
                member_id: ygg.getCookie('member_id'),
                page: 1,
                area_id: "510104",
                size: 99
            };

        var citysearch = new AMap.CitySearch();
        citysearch.getLocalCity(function (status, result) {
            $("#city-picker").val(result.province + " " + result.city + " " + vm.city);
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
            filterData.area_id = getCityId(result.province + "省", result.city + "市");

            if (ygg.getCookie("business_check_id") == null || ygg.getCookie("business_check_id") == "")
                getFilter();
            else
                getShopInfo(ygg.getCookie("business_check_id"));
        });





        var isin = false;
        var iscl = false;

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

                        if ((vm.industry_id != null || vm.industry_id != "") && !isin) {
                            p.cols[0].setValue(vm.industry_name);
                            isin = true;
                        }
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
                    vm.filterAddressCols1.push(data.area_circle_list[i].area_name);
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
                        if ((vm.business_circle_id != null || vm.business_circle_id != "") && !iscl) {
                            p.cols[0].setValue(vm.business_circle_name);
                            iscl = true;
                        }
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
            var shopDetil = JSON.parse(sessionStorage.getItem("shopDetil"));
            var param = {};
            var id = ygg.getCookie("business_check_id");
            var inner = "";
            var face = "";
            var logo = "";
            if (!su && typeof vm.inner_imgs_list != 'string') {
                if (vm.inner_imgs_list.length > 0) {
                    for (var i = 0; i < vm.inner_imgs_list.length; i++) {
                        if (inner != "")
                            inner += ",";
                        inner += vm.inner_imgs_list[i];
                    }
                }
            } else {
                inner = vm.inner_imgs_list;
            }
            // else
            //     {
            //         ygg.prompt("图片异常，请稍后重试！");
            //     }
            if (id != undefined && id != "undefined")
                param.business_check_id = id;
            param.name = vm.name;
            param.area_id = vm.area_id;
            param.business_circle_id = vm.business_circle_id;
            param.address = vm.address;
            param.phone = vm.mobile;
            param.industry_id = vm.industry_id;
            if (!su) {
                param.inner_imgs = inner;

            }
            param.face_img = vm.face_img_list;
            param.logo = vm.logo_img_list;
            if (vm.commissioner_id.length > 0)
                param.commissioner_id = vm.commissioner_id;
            if (vm.lat == null || vm.lat == "") {
                ygg.prompt("请选择地图坐标");
                return;
            }
            if (vm.lng == null || vm.lng == "") {
                ygg.prompt("请选择地图坐标");
                return;
            }
            param.lat = vm.lat;
            param.lng = vm.lng;
            axio.defaults.headers.admin_id = vm.admin_id;
            ygg.ajax("/business/addBusinessCheckTwo", param, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    debugger;
                    su = true;
                    ygg.setCookie("business_check_id", data.data.business_check_id);
                    //ygg.prompt("商家创建成功！");
                    location.href = "createBrand.html";
                    shopDetil = null;
                    sessionStorage.removeItem("shopDetil");
                }

                ygg.loading(false);
            });
        }

        function getShopInfo(checkId) {
            if (checkId != "undefined") {
                ygg.ajax("/business/getBusinessCheckDetails", {
                    business_check_id: checkId
                }, function (data) {
                    if (data.status == "error") {
                        ygg.prompt(data.msg);
                    } else if (data.status == "success") {
                        var that = data.data;
                        vm.name = that.name;
                        vm.area_id = that.area_id == null ? 510104 : that.area_id;
                        vm.area_name = that.area_name;
                        vm.business_circle_id = that.business_circle_id;
                        vm.business_circle_name = that.business_circle_name;
                        vm.address = that.address;
                        vm.mobile = that.phone;
                        vm.industry_id = that.industry_id;
                        vm.industry_name = that.industry_name;
                        vm.inner_imgs = that.inner_imgs;
                        vm.commissioner_id = that.commissioner_id;
                        for (var i = 0; i < that.inner_imgs.length; i++) {
                            vm.inner_imgs_list.push(that.inner_imgs[i].replace("https://img.yingougou.com/", ""));
                        }
                        vm.face_img = that.face_img;
                        vm.face_img_list = that.face_img.replace("https://img.yingougou.com/", "");
                        vm.logo_img = that.logo;
                        vm.logo_img_list = that.logo.replace("https://img.yingougou.com/", "");
                        filterData.area_id = vm.area_id;

                        getFilter();
                    }
                });
            } else {
                var shopDetil = JSON.parse(sessionStorage.getItem("shopDetil"));
                console.log(shopDetil)
                if (shopDetil != null) {
                    var that = shopDetil.data;
                    vm.name = shopDetil.name;
                    vm.area_id = shopDetil.area_id == null ? 510104 : shopDetil.area_id;
                    vm.area_name = shopDetil.area_name;
                    vm.business_circle_id = shopDetil.business_circle_id;
                    vm.business_circle_name = shopDetil.business_circle_name;
                    vm.address = shopDetil.address;
                    vm.mobile = shopDetil.mobile;
                    vm.industry_id = shopDetil.industry_id;
                    vm.industry_name = shopDetil.industry_name;
                    vm.inner_imgs = shopDetil.inner_imgs;
                    vm.commissioner_id = shopDetil.commissioner_id;
                    if (shopDetil.inner_imgs != undefined) {
                        for (var i = 0; i < shopDetil.inner_imgs.length; i++) {
                            vm.inner_imgs_list.push(shopDetil.inner_imgs[i].replace("https://img.yingougou.com/", ""));
                        }
                    }
                    vm.face_img = shopDetil.face_img;
                    if (shopDetil.face_img != undefined && shopDetil.face_img.length > 0) {
                        vm.face_img_list = shopDetil.face_img.replace("https://img.yingougou.com/", "");
                    }
                    vm.logo_img = shopDetil.logo_img;
                    if (shopDetil.logo_img != undefined && shopDetil.logo_img.length > 0) {
                        // vm.logo_img_list = shopDetil.logo.replace("https://img.yingougou.com/", "");
                         vm.logo_img_list = shopDetil.logo_img.replace("https://img.yingougou.com/", "");
                    }
                    vm.lat = shopDetil.lat;
                    vm.lng = shopDetil.lng;
                    filterData.area_id = vm.area_id;
                    getFilter();
                    shopDetil = null;
                    sessionStorage.removeItem("shopDetil");
                }
                getFilter();
            }
        }

        //业务员业务无法重复获得
        var mid = ygg.getCookie("member_id");
        if (mid != null && mid != undefined)
            isComShow = false;
    });
});