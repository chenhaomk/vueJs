require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (axio, vue, mock, mockApi, main) {
        var baseURL = 'http://192.168.0.229:8081/v1.0/';
        var vm = new vue({
            el: "#app",
            data: {

            },
            methods: {
                payment: function () {//微信H5支付
                        main.post(baseURL + "pay/create_pay", {
                            amount: 0.1,
                            member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
                            business_id: '2c92f9245f5d0d46015f5d0e00f40002',
                            pay_way: 'wechat_wap'
                        }, function (res) {
                            if (res.data.code == 200) {
                                location.href = res.data.data;
                            }
                        });
                },
                paymentget: function () {
                    // axio.get('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://store.nat300.top/v1.0/pay/getOpenId&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect')
                    //     .then(function (response) {
                    //         console.log(response);
                    //     })
                    //     .catch(function (error) {
                    //         console.log(error);
                    //     });


                    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://store.nat300.top/v1.0/pay/getOpenId&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';

                    axio.get(url)
                        .then(function (response) {
                            alert(1);
                        })
                        .catch(function (error) {
                            alert(error.message);
                        });

                }

            }
        });


    });
});