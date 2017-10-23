require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var merchantllogInfo = [];
        var vm = new vue({
            el: "#app",
            data: {
                isActive: "",
                discountKindID: "",
                user_inner: main.getSession("h_t"),
                userPhone: main.getSession("m_n"),
                actual: 0,
                trueMoney: "",
                merchantllogInfo: [],
                b_n: main.getSession("b_n"),
                isbussiness: true
            },
            methods: {
                selectedDiscountType: function (typeID, dNum) {

                    vm.isActive = typeID;
                    vm.discountKindID = typeID;
                    try {
                        if (vm.trueMoney <= 0) {
                            vm.actual = 0;
                            return;
                        }
                        vm.actual = vm.trueMoney - dNum;
                        if (vm.actual <= 0)
                            vm.actual = 0;
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
                    main.post("/thirdPay/create_pay",
                        data,
                        function (res) {
                            if (res.code == 2001) {
                                location.href = "../../views/newDrainage/drainageLogin.html";
                                main.clearSessionItem("sn");
                                return;
                            }
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
                },
                moneyBlur: function () {
                    var trueMoney = document.getElementsByClassName("trueMoney")[0];
                    if (!trueMoney.getAttribute("readonly")) {
                        trueMoney.setAttribute("readonly", "readonly");
                        if (isNaN(vm.trueMoney) || vm.trueMoney == null || vm.trueMoney == "" || vm.trueMoney <= 0) {
                            vm.trueMoney = 0;
                            return;
                        }
                        vm.actual = vm.trueMoney;
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
                                    // main.prompt("数据有误"); //此类提示较为后台化，可根据实际情况修改与用户的会话
                                    return;
                                }
                                if (data.maximum_discount_list.length <= 0) {
                                    vm.merchantllogInfo = [];
                                    return;
                                }

                                vm.merchantllogInfo = data.maximum_discount_list;
                                for (var i = 0; i < vm.merchantllogInfo.length; i++) {
                                    if (vm.merchantllogInfo[i].is_from_business)
                                        vm.merchantllogInfo[i].id = vm.merchantllogInfo[i].coupon_id;
                                    else
                                        vm.merchantllogInfo[i].id = vm.merchantllogInfo[i].coupon_activity_id;
                                }
                            });

                    }
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
                            location.href = "../../views/newDrainage/drainageLogin.html";
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