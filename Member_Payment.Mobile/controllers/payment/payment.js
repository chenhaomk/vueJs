require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        window.addEventListener('load', function() {
          FastClick.attach(document.body);
        }, false);
        var imgurl = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%3A", ":");
        if (imgurl.indexOf("https") < 0)
            imgurl = "https://img.yingougou.com/" + imgurl;
        if (main.getQueryString("img") != null && main.getSession("img") == null)
            main.setSession("img", "https://img.yingougou.com/" + decodeURI(main.getSession("img")));
        main.setSession("a_n", main.getQueryString("a_n") == null ? main.getSession("a_n") : main.getQueryString("a_n"));
        main.setSession("c_n", main.getQueryString("c_n") == null ? main.getSession("c_n") : main.getQueryString("c_n"));
        var vm = new vue({
            el: "#app",
            data: {
                isActive: false,
                payNum: "",
                payKind: 0,
                merchant_name: main.getSession("sn") ==null?main.getQueryString("b_n"):main.getSession("sn")
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
                keyWordsFunc: function (num,event) {
                    event.preventDefault();
                    var payNum = vm.payNum;
                    if (isNaN(num))
                        return;
                    if (num == null)
                        return;
                    if (num == -1) {
                        payNum = payNum.substring(0, payNum.length - 1);
                        vm.payNum = payNum;
                        return;
                    }
                    // if (num == 0 && payNum.length == 0) {
                    //     vm.payNum = "0";
                    //     return;
                    // }
                    // if (num == 0 && payNum == "")
                    //     return;

                    // if (payNum.indexOf('0.') < 0 && payNum.length >= 1 && num < 0)
                    //     return;
                    // if (num == 11 && payNum.indexOf(".") > 0)
                    //     return;

                    if (num == 11 && payNum.indexOf('.') < 0) {
                        if (payNum == "") {
                            vm.payNum += "0.";
                            return;
                        }
                        vm.payNum += ".";
                        return;
                    }
                    if (num == 11)
                        return;
                    if (isNaN(vm.payNum)) {
                        if (vm.payNum == '.')
                            vm.payNum = "0.";
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
                        // var paySuccObj = {} //支付成功后，在成功页面需要的obj
                        // paySuccObj.amount = payNum ;
                        // paySuccObj.business_id = main.getSession("b_id");
                        main.setSession("amount", payNum);
                        main.setSession("business_id", main.getSession("b_id"));
                        main.post("/thirdPay/create_pay",
                            data,
                            function (res) {
                                if (res.code == 2001) {
                                    location.href = "../../views/newDrainage/paySucc.html";
                                    // main.clearSessionItem("sn");
                                    return;
                                }
                                if (res.status == 200) {
                                    var data = res.data.data;
                                    if (res == null) {
                                        main.prompt("支付异常");
                                        return;
                                    }
                                    main.setSession("sn", data.orderNo);
                                    // main.setSession("paySuccObj", paySuccObj);//传值支付成功的引流页面
                                    var url = data.credential.alipay_web.orderInfo;
                                    location.href = url
                                }
                            });
                        return;
                    }
                    vm.payNum += num;
                    if (payNum.substring(0, 1) == '0' && payNum.indexOf('0.') < 0)
                        vm.payNum = vm.payNum.substring(1, vm.payNum.length);
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
                    alert(res.status)
                    if (res.status == 200) {
                        var data = res.data.data;
                        if (res == null) {
                            main.prompt("支付异常");
                            return;
                        }
                        if (status == 1) {
                            //支付成功，引流
                            location.href = "../../views/newDrainage/paySucc.html";
                            // main.clearSessionItem("sn");
                            return;
                        } else {
                            //支付失败
                            // main.clearSessionItem("sn");
                            main.prompt("支付失败");
                            return;
                        }
                    }
                });
        }
        init();
    });
});