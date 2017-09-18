require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var imgurl = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%3A",":");
        if (imgurl.indexOf("https") < 0)
            imgurl = "https://img.yingegou.com/" + imgurl;
        if (main.getQueryString("img") != null&& main.getSession("img") == null)
            main.setSession("img", "https://img.yingegou.com/" + decodeURI(main.getSession("img")));
        main.setSession("a_n", main.getQueryString("a_n") == null ? main.getSession("a_n") : main.getQueryString("a_n"));
        main.setSession("c_n", main.getQueryString("c_n") == null ? main.getSession("c_n") : main.getQueryString("c_n"));

        var vm = new vue({
            el: "#app",
            data: {
                isActive: false,
                payNum: "",
                payKind: 0,
                merchant_name: main.getSession("b_n")
            },
            methods: {
                selectedPayType: function (type) {
                    if (type == 0)
                        vm.isActive = true;
                    else
                        vm.isActive = false;
                    vm.payKind = type;
                },
                loginByPhone: function () {
                    //手机号登陆
                    location.href = "../../views/user/login.html";
                    return;
                },
                keyWordsFunc: function (num) {
                    var payNum = vm.payNum;
                    if (isNaN(num))
                        return;
                    if (num == null)
                        return;
                    if (num == 0 && payNum == "")
                        return;
                    if (num == 11 && payNum.indexOf(".") > 0)
                        return;
                    if (num == 11 && payNum == "") {
                        vm.payNum = "0.";
                        return;
                    }
                    if (num == 11) {
                        vm.payNum += ".";
                        return;
                    }
                    if (num == -1) {
                        payNum = payNum.substring(0, payNum.length - 1);
                        vm.payNum = payNum;
                        return;
                    }

                    if (payNum.indexOf(".") > 0 && payNum.split('.')[1].length > 1 && num != 10)
                        return;
                    if (num == 10) {
                        if (vm.payNum == "" || vm.payNum == 0)
                            return;
                        var data = {};
                        if (main.getSession("c_id") != null)
                            data.coupon_id = main.getSession("c_id");
                        if (main.getSession("c_a_id") != null)
                            data.coupon_activity_id = main.getSession("c_a_id");
                        if (main.getSession("m_id") != null)
                            data.member_id = main.getSession("m_id");
                        data.amount = payNum;
                        data.business_id = main.getSession("b_id");
                        data.pay_way = 'alipay_web';
                        main.post("/thirdPay/create_pay",
                            data,
                            function (res) {
                                if (res.status == 200) {
                                    var data = res.data.data;
                                    if (res == null) {
                                        main.prompt("支付异常");
                                        return;
                                    }
                                    main.setSession("sn", data.orderNo);
                                    var url = data.credential.alipay_web.orderInfo;
                                    // window.open()
                                    location.href = url;
                                }
                            });
                        return;
                    }
                    vm.payNum += num;
                }
            }
        });

        function init() {
            if (main.getSession("sn") == null)
                return;
            main.post("common/getOrdersStatus", {
                    sn: main.getSession("sn")
                },
                function (res) {
                    if (res.status == 200) {
                        var data = res.data.data;
                        if (res == null) {
                            main.prompt("支付异常");
                            return;
                        }
                        if (status == 1) {
                            //支付成功，引流
                            location.href = "../../views/drainage/drainagenologin.html";
                            main.clearSessionItem("sn");
                            return;
                        } else {
                            //支付失败
                            main.clearSessionItem("sn");
                            main.prompt("支付失败");
                            return;
                        }
                    }
                });
        }
        init();
    });
});