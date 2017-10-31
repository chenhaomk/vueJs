require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (axio, vue, mock, mockApi, main) {
        var baseURL = 'http://192.168.0.229:8082/v1.0/';
        var vm = new vue({
            el: "#app",
            data: {

            },
            methods: {
                payment: function () {
                    // main.post(baseURL + "pay/getCode", function (res) {
                    //     alert(1);
                    //     main.post(baseURL + "pay/create_pay", {
                    //         amount: 0.1,
                    //         member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
                    //         business_id: '2c92f9245f5d0d46015f5d0e00f40002',
                    //         pay_way: 'wechat_csb'
                    //     }, function (res) {
                    //         alert(2)
                    //         // main.prompt(res.data.data)
                    //     });
                    // });


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

        function init() { //公众号支付
            // debugger;
            if (location.href.indexOf("code") >= 0) {
                var code = main.getQueryString("code");
                if (code != null && code != "") {
                    //alert(main.getQueryString("code"));
                    main.setSession("code");

                    main.post(baseURL + "pay/getOpenId", {
                        code: code
                    }, function (res) {
                        if (res.data.code != 200) {
                            main.prompt("支付失败");
                            return;
                        }
                        var openID = res.data.data.openid;
                        alert(openID);
                        main.post(baseURL + "pay/create_pay", {
                            amount: 0.1,
                            member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
                            business_id: '2c92f9245f5d0d46015f5d0e00f40002',
                            pay_way: 'wechat_csb',
                            open_id: openID
                        }, function (res) {
                            alert(res.data.status);
                            if (res.data.code == 200) {
                                //调用官方公众号接口
                                console.log(res)
                                var configObj = {
                                    debug:true,
                                    appId:res.data.appId,
                                    timestamp:res.data.timeStamp,
                                    nonceStr:res.data.nonceStr,
                                    signature:res.data.paySign,
                                    jsApiList:["chooseWXPay"]
                                }
                                wx.config(configObj);
                                wx.ready(function () {
                                    console.log("微信js接口已准备")
                                })
                                // wx.checkJsApi({ //判断当前客户端是否支持该接口
                                //     jsApiList: ['chooseWXPay'], 
                                //     success: function(res) {
                                //         console.log(res)
                                //     }
                                // });
                                wx.chooseWXPay({
                                    timestamp:res.data.timeStamp,
                                    nonceStr:res.data.nonceStr,
                                    package:res.data.package,
                                    signType:res.data.signType,
                                    paySign:res.data.paySign,
                                    success:function (res) {
                                        console.log(111)
                                    }
                                })
                            }
                            // main.prompt(res.data.data)
                        });
                    });
                    return;
                }

            } else {
                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://store.nat300.top/index.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
            }
        }
        init();
    });
});