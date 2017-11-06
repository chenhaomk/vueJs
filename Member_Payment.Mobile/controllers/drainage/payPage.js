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
    	// var baseURL = 'http://192.168.0.228:8084/v1.0/';


        var baseURL = "https://api.yingougou.com/v1.0/"
                //判断是否在微信浏览器
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
                location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
            }
        }else if( browserType()== "alipay") {
            if(location.href.indexOf("auth_code") == -1){
                var b_id = main.getSession("b_id")
                location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id 
            }
        }else {

        }



    	var vm = new vue({
    		el:"#app",
    		data:{
    			isActive: false,
                payNum: "",
                payKind: 0,
                merchant_name: "",
    		},
    		methods:{
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
                        // if (main.getSession("m_id") != null)
                            // data.member_id =  "0e5868ef81364eba95f4823d4538d241"//main.getSession("m_id");
                        data.amount = payNum;
                        main.setSession("b_id",main.getSession("b_id"))
                        data.business_id = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");
                        main.setSession("amount", payNum);
                        main.setSession("business_id", data.business_id);
                        payFn(browserType,data,baseURL,ck)
                        function ck() {
                            location.href = "../../views/newDrainage/paySucc.html";
                        }
                        return;
                    }
                    vm.payNum += num;
                    if (payNum.substring(0, 1) == '0' && payNum.indexOf('0.') < 0)
                        vm.payNum = vm.payNum.substring(1, vm.payNum.length);
                }
    		}
    	})
        main.post(baseURL +"/business/getBusinessDetails",{business_id:main.getSession("b_id")} , function (res) {
            vm.merchant_name = res.data.data.business_details.name
            main.setSession("b_n",vm.merchant_name)
        })
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
                            main.post(baseURL + "pay/create_pay",data , function (res) {
                               
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
                            main.post(baseURL + "pay/create_pay",data , function (res) {
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
                main.post( baseURL+"pay/create_pay",
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
    })
 })   