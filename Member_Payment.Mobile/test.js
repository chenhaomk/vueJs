require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var baseURL = 'http://192.168.1.130:8082/v1.0/';
        var vm = new vue({
            el: "#app",
            data: {

            },
            methods: {
                payment: function () {
                    main.post(baseURL + "common/getOrdersStatus", {
                        sn: '950985900900557220522'
                    }, function (res) {
                        if (res.status == 200) {
                            var data = res.data.data;
                            if (res == null) {
                                main.prompt("支付异常");
                                return;
                            }

                            var url = data.credential.alipay_web.orderInfo;
                            // window.open()
                            location.href=url;
                        }
                    });
                },

            }
        });
    });
});