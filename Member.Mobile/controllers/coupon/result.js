require(['config'], function () {
    require(['vue', 'main'], function (Vue, ygg) {

        var vm = new Vue({
                el: "#app",
                data: {
                    r: {},
                    amount : ygg.getQueryString("amount"),
                    time_paid : ygg.getd("Y.m.d H:i",ygg.getQueryString("time_paid") / 1000)
                }
            }),
            order_no = ygg.getQueryString("order_no"),
            return_url = ygg.getQueryString("return_url");

        if (!order_no) window.open("/", "_self");

        ygg.ajax('/coupon/getPayBusiness', {
            order_no: order_no
        }, function (data) {
            data = data.data;
            vm.$set(vm, 'r', data);
        });
    });
});