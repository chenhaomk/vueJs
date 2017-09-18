require(['config'], function () {
    require(['axio', 'vue', 'main'], function (axio, Vue, ygg) {

        var vm = new Vue({
            el: "#app",
            data: {
                active: 0,
                phone: "",
                vercode: "",
                userId: "",
                pwd: "",
                cs: 0,
                ver: "",
                vshow: false,
                reason: "",
                state: "",
                brandState: "绑定品牌",
            },
            methods: {
                brandurl: function () {
                    if (this.brandState == "绑定品牌")
                        location.href = "createBrand.html";
                    else
                        dropBrand();
                },
                jumpnet: function () {
                    if (jumpnet == null || jumpnet == "")
                        return;
                    location.href = "www.baidu.com";
                },
                login1: function (e) {
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if (that.phone.length == 0 || that.vercode.length == 0) {
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }
                    ygg.ajax('/business/businessFastLogin', {
                        mobile: that.phone,
                        verification_code: that.vercode
                    }, function (data) {
                        if (data.status == "error") {
                            ygg.prompt(data.msg);
                        } else if (data.status == "success") {
                            data = data.data;
                            ygg.setCookie("business_check_id", data.business_check_id);
                            that.reason = data.reason;
                            that.state = data.state;
                            switch (that.state) {
                                case 0: //资料等待提交
                                    ygg.prompt("上次信息还未提交，请完善并提交资料！");
                                    //location.href = "https://www.yingegou.com/views/enter/login.html";
                                    location.href = "creatShopB.html";
                                    break;
                                default:
                                    that.active = that.state;
                                    if (that.state == 2)
                                        getInfo();
                                    break;
                            }

                            //that.active = 1;
                        }
                    });
                },
                blurTip: function (s, t, r) {
                    ygg.verify(s, t, r);
                },
                yzm: function () {

                },
                close: function () {
                    this.vshow = false;
                }
            },
            components: {
                getVercode: ygg.template.getVercode
            }
        });

        function getInfo() {
            var id = ygg.getCookie("business_check_id");
            ygg.ajax("/business/getBusinessCheckDetails", {
                business_check_id: id
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    data = data.data;
                    if (data.brand_id != null && data.brand_id != "")
                        vm.brandState = "解绑品牌";

                }
            });
        }

        function dropBrand() {
            var id = ygg.getCookie("business_check_id");
            ygg.ajax("/business/bindBrandById", {
                business_check_id: id,
                brand_id: null
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    data = data.data;
                    ygg.prompt("品牌解绑成功！");
                    vm.brandState == "绑定品牌"
                }
            });
        }

        function init() {
            //判断分辨率，是否进入PC。
            if (window.screen.width >= 1000) {
                location.href = "https://www.yingegou.com/views/enter/register.html";
                return;
            }
            var mid = ygg.getQueryString("m_id");
            if (mid != null && mid != "") {
                ygg.setCookie("member_id", mid);
            }
        }
        init();
    });
});