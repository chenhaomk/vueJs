require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var merchantllogInfo = [];
        var vm = new vue({
            el: "#app",
            data: {
                isActive: "",
                user_inner: main.getSession("h_t"),
                userPhone: main.getSession("m_n"),
                actual: 0,
                trueMoney: "",
                merchantllogInfo: [],
                b_n: main.getSession("b_n"),
                isbussiness: true
            },
            methods: {
                selectedDiscountType: function (typeID, dNum, isbussiness) {
                    var payDom = document.getElementById("kind_d_" + typeID);
                    if (payDom == null)
                        return;
                    var paySelectDom = document.getElementsByClassName("discountKind");
                    for (var i = 0; i < paySelectDom.length; i++) {
                        paySelectDom[i].className = "discountKind";
                    }
                    payDom.className = "discountKind active";
                    vm.discountKindID = typeID;
                    try {
                        if (vm.merchantPay.trueMoney <= 0) {
                            vm.merchantPay.actual = 0;
                            return;
                        }
                        vm.merchantPay.actual = vm.merchantPay.trueMoney - dNum;
                        if (vm.merchantPay.actual <= 0)
                            vm.merchantPay.actual = 0;
                        return;
                    } catch (error) {
                        main.prompt("计算错误，请重试");
                        return;
                    }
                },
                changeMoney: function () {
                    var trueMoney = document.getElementsByClassName("trueMoney")[0];
                    if (trueMoney.getAttribute("readonly")) {
                        trueMoney.removeAttribute("readonly");
                        trueMoney.focus();
                    }
                },
                payment: function () {
                    if (vm.trueMoney == null || vm.trueMoney == "")
                        return;
                    var data = {};
                    if (vm.isActive != "" && !vm.isbussiness)
                        data.coupon_id = vm.isActive;
                    if (vm.isActive != "" && vm.isbussiness)
                        data.coupon_activity_id = vm.isActive;
                    if (main.getSession("m_id") != null)
                        data.member_id = main.getSession("m_id");
                    data.amount = vm.trueMoney;
                    data.business_id = main.getSession("b_id");
                    data.pay_way = 'alipay_web';
                    main.post("thirdPay/create_pay",
                        data,
                        function (res) {
                            if (res.code == 2001) {
                                location.href = "../../views/drainage/drainagenologin.html";
                                main.clearSessionItem("sn");
                                return;
                            }
                            if (res.status == 200) {
                                var data = res.data.data;

                                if (data == null || data == "") {
                                    main.prompt("支付异常");
                                    return;
                                }
                                main.clearSessionItem("isBusiness");
                                main.clearSessionItem("couponID");
                                main.clearSessionItem("price");
                                main.clearSessionItem("calculate_discount");
                                vm.merchantllogInfo = [];
                                vm.trueMoney = "";
                                vm.actual = 0;
                                main.setSession("sn", data.orderNo);
                                var url = data.credential.alipay_web.orderInfo;
                                // window.open()
                                location.href = url;
                            }
                        });


                },
                moneyBlur: function () {
                    var trueMoney = document.getElementsByClassName("trueMoney")[0];
                    if (!trueMoney.getAttribute("readonly")) {
                        trueMoney.setAttribute("readonly", "readonly");
                        if (isNaN(vm.trueMoney) || vm.trueMoney == null || vm.trueMoney == "" || vm.trueMoney <= 0) {
                            vm.trueMoney = 0;
                            return;
                        }

                        var bid = main.getSession("b_id");
                        main.post("member/getPayRecommendCoupon", {
                                member_id: main.getSession("m_id"),
                                business_id: bid,
                                price: vm.trueMoney
                            },
                            function (res) {
                                if (res.errCode < 0)
                                    main.prompt(res.errMsg);
                                var data = res.data.data;
                                if (res.data == null || res.data.code != 200) {
                                    main.prompt("数据有误"); //此类提示较为后台化，可根据实际情况修改与用户的会话
                                    return;
                                }
                                vm.merchantllogInfo = [];
                                if (data.maximum_discount_list.length <= 0) {
                                    vm.merchantllogInfo = [];
                                    vm.actual = vm.trueMoney;
                                    return;
                                }
                                for (var i = 0; i < data.maximum_discount_list.length; i++) {
                                    if (i == 0)
                                        vm.merchantllogInfo[i] = data.maximum_discount_list[i];
                                }
                                for (var i = 0; i < vm.merchantllogInfo.length; i++) {
                                    if (vm.merchantllogInfo[i].is_from_business)
                                        vm.merchantllogInfo[i].id = vm.merchantllogInfo[i].coupon_id;
                                    else
                                        vm.merchantllogInfo[i].id = vm.merchantllogInfo[i].coupon_activity_id;
                                }
                                if (vm.merchantllogInfo.length > 0) {
                                    main.setSession("isBusiness", vm.merchantllogInfo[0].is_from_business);
                                    main.setSession("couponID", vm.merchantllogInfo[0].id);
                                    vm.isActive = vm.merchantllogInfo[0].id;
                                    vm.actual = vm.trueMoney - vm.merchantllogInfo[0].calculate_discount;
                                } else
                                    vm.actual = vm.trueMoney;
                            });
                    }
                },
                jumpToList: function () {
                    var isBusiness = main.getSession("isBusiness");
                    var couponID = main.getSession("couponID");
                    main.setSession("price", vm.trueMoney);
                    if (isBusiness == null || isBusiness == "" || couponID == null || couponID == "") {
                        main.prompt("当前无其他优惠");
                        return;
                    } else if (main.getSession("price") == null || main.getSession("price") == ""|| main.getSession("price") == "null") {
                        main.prompt("请输入应付金额");
                        return;
                    } else {
                        location.href = "availablecoupons.html";
                    }
                }
            }
        });

        function init() {
            var couponID = vm.isActive = main.getSession("couponID");
            if (couponID != null || couponID != "") {
                vm.isbussiness = main.getSession("isBusiness");
                vm.trueMoney = main.getSession("price");
                vm.merchantllogInfo.push({
                    calculate_discount: main.getSession("calculate_discount"),
                    id: main.getSession("couponID")

                });
                vm.actual = vm.trueMoney - vm.merchantllogInfo[0].calculate_discount;
            }
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