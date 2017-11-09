require(['config'],function(){
    require(['vue','main'],function (Vue,main) {
        function browserType() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return "weixin"
            } else if(ua.match(/Alipay/i)=="alipay"){
                return "alipay";
            }else {
                return "other"
            }
        }
        if(browserType() == "weixin") {
            if (location.href.indexOf("code") == -1) { 
                var b_id = main.getSession("b_id")
                var u = navigator.userAgent;
                if(u.indexOf('iPhone') > -1) {
                    location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payGroupTic.html?b_id="+b_id+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                }else {
                    location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payGroupTic.html?b_id="+b_id+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                }
                
            }
        }else if( browserType()== "alipay") {
            if(location.href.indexOf("auth_code") == -1){
                var b_id = main.getSession("b_id")
                location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payGroupTic.html?b_id="+b_id 
            }
        }else {

        }
        var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        var ticketId = window.location.search.split("&")[0].split("=")[1] //团购券id
        var bid = window.location.search.split("&")[1].split("=")[1] //商家id
    	var vm = new Vue({
            el : "#app",
            data : {
                detail:{},
                total:1,
                toPrice:0,
                price:0,
            },
            methods : {
                back:function () {
                    window.history.go(-1);
                },
                del:function () {
                    if(this.total >1) {
                        this.total--
                    }
                    this.toPrice = (this.total*this.price).toFixed(2)
                },
                add:function () {
                    this.total++
                    this.toPrice = (this.total*this.price).toFixed(2)
                },
                input:function () {
                    if(this.total==1){
                        this.total=this.total.replace(/[^1-9]/g,'')
                    }else if(this.total==0){
                        this.total = 1
                    }else {
                        this.total=this.total.replace(/\D/g,'')
                    }
                    this.toPrice = (this.total*this.price).toFixed(2)
                },
                checkPay:function () {

                    if(main.getSession("token") != null && main.getSession("token") != undefined && main.getSession("token") != "null") {//ch-use;判断用户是否登录过
                        // location.href = "../../views/payment/payChangeTic.html";
                        var data = {//优惠券下单接口参数
                            coupon_activity_id:ticketId,
                            member_id:main.getSession("m_id"),
                            count:this.total
                        }
                        main.post(baseURL+'pay/create_coupon_order',data,function(res){
                            console.log(res)
                            if(res.data.code == 200) {

                                var data = {}
                                data.order_id = res.data.data.id;
                                payFn(browserType,data,baseURL,ck)
                                function ck() {
                                    alert(66)
                                    // location.href = "../../views/newDrainage/paySucc.html";
                                }
                            }else {
                                main.prompt(res.data.msg)
                            }
                            
                        });
                    }else {
                        var str = window.location.search
                        window.location.href = "../../views/user/login.html"+str;
                    }
                }
            }
        })
        getTicketDetil() //获取团购券详情
        function getTicketDetil() {
            // main.loading(true);
            main.post(baseURL+'coupon/getCouponDetails',{
                coupon_id:ticketId,
            },function(data){
                data = data.data.data;
                console.log(data)
                vm.price = data.price
                vm.toPrice = (vm.total*vm.price).toFixed(2)
                if ((data.price+"").indexOf(".") == -1) {
                    data.zs = data.price
                    data.xs = "00"
                }else {
                    data.price = data.price.toFixed(2)
                    data.zs = data.price.toString().split(".")[0]
                    data.xs = data.price.toString().split(".")[1]
                }

                data.stime = main.getd("Y.m.d ", data.begin_date / 1000) + '-' + main.getd("Y.m.d ", data.end_date / 1000);
                vm.$set(vm, 'detail', data);
                vm.$set(vm, 'ttIsShow', true);
                // main.loading(false);
            });
        }
        function payFn(browserType,data,baseURL,callBack) {//browserType为判断浏览器函数，data为支付接口参数对象,baseURL,callBack支付后的回调
            if(browserType() =="weixin") {//微信浏览器内
                // if (location.href.indexOf("code") >= 0) {
                    var code = main.getQueryString("code");
                    if (code != null && code != "") {
                        main.setSession("code");
                        main.post(baseURL + "pay/getOpenId", {
                            code: code
                        }, function (res) {
                            if (res.data.code != 200) {
                                main.prompt("支付失败");
                                return;
                            }
                            var openID = res.data.data.openid;
                            data.open_id = openID
                            data.pay_way = 'wechat_csb' //支付方式
                            main.post(baseURL + "/pay/coupon_pay",data , function (res) {
                               
                                if (res.data.code == 200) {
                                    //调用官方公众号接口
                                    var configObj = {
                                        debug:false,
                                        appId:res.data.data.appId,
                                        timestamp:res.data.data.timeStamp,
                                        nonceStr:res.data.data.nonceStr,
                                        signature:res.data.data.paySign,
                                        jsApiList:["chooseWXPay"]
                                    }
                                    wx.config(configObj);
                                    wx.ready(function () {
                                        // console.log("微信js接口已准备")

                                    })
                                    wx.chooseWXPay({
                                        timestamp:res.data.data.timeStamp,
                                        nonceStr:res.data.data.nonceStr,
                                        package:res.data.data.package,
                                        signType:res.data.data.signType,
                                        paySign:res.data.data.paySign,
                                        success:function (res) {
                                            main.setSession("amount", data.amount);
                                            main.setSession("business_id", main.getQueryString("b_id"));
                                            callBack()
                                        }
                                    })
                                }
                            });
                        });
                        return;
                    }
                // }else {
                //     var b_id = main.getQueryString("b_id")
                //     location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://pay.yingegou.com/payment/views/newDrainage/payPage.html?b_id="+b_id+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                // }
            }else if(browserType() =="alipay") {//支付宝扫码进入

                // if (location.href.indexOf("auth_code") >= 0) {    
                    var code = main.getQueryString("auth_code");
                    if (code != null && code != "") {
                        main.setSession("auth_code");
                        main.post(baseURL + "pay/getBuyerId", {
                            code: code
                        }, function (res) {
                            if (res.data.code != 200) {
                                main.prompt("支付失败");
                                return;
                            }
                            var buyer_id = res.data.data;
                            data.buyer_id = buyer_id
                            data.pay_way ='alipay_csb'
                            main.post(baseURL + "/pay/coupon_pay",data , function (res) {
                                if (res.data.code == 200) {
                                    //调用官方公众号接口
                                    var tradeNo = res.data.data.tradeNO;
                                    main.setSession("tradeNO", tradeNo);
                                    AlipayJSBridge.call("tradePay",{
                                        tradeNO: main.getSession("tradeNO")
                                    }, function(result){
                                        if(result.resultCode == 9000) {
                                            main.setSession("amount", data.amount);
                                            main.setSession("business_id", main.getQueryString("b_id"));
                                            callBack()
                                        }else {
                                            alert("支付异常!")
                                        }
                                    });
                                    
                                }
                            });
                        });
                        return;
                    }
                // } else {
                //     var b_id = main.getQueryString("b_id")
                //     location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=http://pay.yingegou.com/payment/views/newDrainage/payPage.html?b_id="+b_id 
                // }
            }else {//普通浏览器扫码进入
                data.pay_way = 'alipay_web';
                main.post( baseURL+"/pay/coupon_pay",
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
                            main.setSession("amount", data.amount);
                            main.setSession("business_id", main.getQueryString("b_id"));
                            // debugger
                            main.setSession("sn", data.orderNo);
                            // main.setSession("paySuccObj", paySuccObj);//传值支付成功的引流页面
                            var url = data.credential.alipay_web.orderInfo;
                            location.href = url

                        }
                });
            }
        }
    });
});