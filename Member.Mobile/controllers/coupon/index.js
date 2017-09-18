require(['config'], function () {
    require(['vue', 'main'], function (Vue, ygg) {

        var vm = new Vue({
                el: "#app",
                data: {
                    detail: {},
                    returnUrl: "",
                    couponId: "",
                    gz: "全平台商户共享使用",
                    money: [1, 2],
                    btnIsShow: true,
                    ttIsShow : false
                },
                components: {
                    star: ygg.template.star
                },
                methods: {
                    getCounpn: function () {
                        var that = this;
                        ygg.ajax('/thirdPay/create_coupon_order', {
                            coupon_id: coupon_id,
                            member_id: ygg.getCookie("member_id")
                        }, function (data) {

                            if (data.status == 'error') {
                                ygg.prompt(data.msg);
                            } else if (data.status == 'success') {
                                that.btnIsShow = false;
                                ygg.prompt("领取成功");
                            }

                        });
                    },
                    buyCoupon: function () {
                        //sdf-立即抢购
                        //判断是否可以下单
                        if(!ygg.getCookie("member_id"))window.open("/views/user/login.html","_self");
                        ygg.loading(true);
                        var that = this;
                        ygg.ajax('/thirdPay/create_coupon_order', {
                            coupon_id: coupon_id,
                            member_id: ygg.getCookie("member_id")
                        }, function (data) {
                            if (data.status == 'error') {
                                ygg.prompt(data.msg);
                            } else if (data.status == 'success') {
                                data = data.data;
                                if (data.id == null || data.id == "") {
                                    ygg.prompt("订单生成失败，请稍后再试!");
                                }
                                var orderID = data.id;
                                ygg.ajax('/thirdPay/coupon_pay', {
                                    order_id: orderID,
                                    pay_way: "alipay_web",
                                }, function (data) {
                                    if (data.status == 'error') {
                                        ygg.prompt(data.msg);
                                    } else if (data.status == 'success') {
                                        data = data.data;
                                        if (data.credential == null) {
                                            ygg.prompt("订单生成失败，请稍后再试!");
                                            return;
                                        }
                                        location.href = data.credential.alipay_web.orderInfo;
                                        //ygg.prompt("领取成功");
                                    }

                                });

                            }
                            ygg.loading(false);
                        });
                    }
                }
            }),
            coupon_id = ygg.getQueryString("id"),
            bid = ygg.getQueryString("bid"),
            returnUrl = ygg.getQueryString("returnUrl");

        if (!coupon_id || !returnUrl) window.open("/", "_self");

        if (returnUrl != '/') {
            returnUrl += "?returnUrl=/&id=" + bid;
        }

        vm.$set(vm, 'couponId', coupon_id);
        vm.$set(vm, 'returnUrl', returnUrl);

        ygg.ajax('/coupon/getCouponDetails', {
            coupon_id: coupon_id,
            member_id: ygg.getCookie("member_id")
        }, function (data) {
            data = data.data;

            if (!data.is_share) {
                vm.$set(vm, 'gz', "只能用于" + data.business_name);
            }
            data.stime = ygg.getd("Y.m.d H:i", data.begin_date / 1000) + '-' + ygg.getd("Y.m.d H:i", data.end_date / 1000);
            vm.$set(vm, 'detail', data);
            vm.$set(vm, 'ttIsShow', true);
            if (data.type == 2) {
                var m = data.price + "";
                if (m.indexOf(".") !== -1) {
                    vm.$set(vm, 'money', m.split("."));
                } else {
                    vm.$set(vm, 'money', [m, "00"]);
                }
            }
        });

    });
});