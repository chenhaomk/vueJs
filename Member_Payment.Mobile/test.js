require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (axio, vue, mock, mockApi, main) {
        var baseURL = 'http://192.168.0.119:8084/v1.0/';
        var vm = new vue({
            el: "#app",
            data: {

            },
            methods: {
            }
        });

        function init() { //公众号支付
            // if (location.href.indexOf("code") >= 0) {
            //     var code = main.getQueryString("code");
            //     if (code != null && code != "") {
            //         //alert(main.getQueryString("code"));
            //         main.setSession("code");

            //         main.post(baseURL + "pay/getOpenId", {
            //             code: code
            //         }, function (res) {
            //             if (res.data.code != 200) {
            //                 main.prompt("支付失败");
            //                 return;
            //             }
            //             var openID = res.data.data.openid;
            //             alert(openID);
            //             main.post(baseURL + "pay/create_pay", {
            //                 amount: 0.1,
            //                 member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
            //                 business_id: '2c92f9245f5d0d46015f5d0e00f40002',
            //                 pay_way: 'wechat_csb',
            //                 open_id: openID
            //             }, function (res) {
            //                 alert(res.data.status);
            //                 if (res.data.code == 200) {
            //                     //调用官方公众号接口
            //                 }
            //                 // main.prompt(res.data.data)
            //             });
            //         });
            //         return;
            //     }
            if (location.href.indexOf("auth_code") >= 0) {
               
                var code = main.getQueryString("auth_code");
                if (code != null && code != "") {
                    //alert(main.getQueryString("code"));
                    main.setSession("auth_code");
                    main.post(baseURL + "pay/getBuyerId", {
                        code: code
                    }, function (res) {
                        if (res.data.code != 200) {
                            main.prompt("支付失败");
                            return;
                        }
                        var buyer_id = res.data.data.buyer_id;
                        alert(openID);
                        main.post(baseURL + "pay/create_pay", {
                            amount: 0.1,
                            member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
                            business_id: '2c92f9245f5d0d46015f5d0e00f40002',
                            pay_way: 'alipay_web',
                            buyer_id: buyer_id
                        }, function (res) {
                            alert(res.data.status);
                            if (res.data.code == 200) {
                                //调用官方公众号接口
                                var tradeNo = res.data.data.tradeNo;
                                window.al
                            }
                            // main.prompt(res.data.data)
                        });
                    });
                    return;
                }
            } else {

                //location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://store.nat300.top/index.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=http://wxstore.natapp1.cc/index.html";
            }
        }
        init();

        // function ready(callback) {
        //     // 如果jsbridge已经注入则直接调用
        //     if (window.AlipayJSBridge) {
        //         callback && callback();
        //     } else {
        //         // 如果没有注入则监听注入的事件
        //         document.addEventListener('AlipayJSBridgeReady', callback, false);
        //     }
        // }
        // ready(function () {
        //     AlipayJSBridge.call('toast', {
        //         content: 'hello'
        //     });
        // });
    });
});