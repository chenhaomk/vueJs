require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	// var baseURL = 'http://192.168.0.228:8084/v1.0/';
        var baseURL = "http://pay.yingegou.com:9000/v1.0/"
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

    	if(browserType()) {
            
    	}else {
            
    	}
    	var vm = new vue({
    		el:"#app",
    		data:{
    			totalMoney:"",
    			url:""
    		},
    		methods:{
    			pay:function() {
                    var payObj = {
                        amount:0.01,
                        member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
                        business_id: '2c92f9245f5d0d46015f5d0e00f40002',

                    }
    				payFn(browserType,payObj,baseURL,ck)
                    function ck() {
                        location.href = "../../views/newDrainage/paySucc.html";
                    }
    			}
    		}
    	})
        function payFn(browserType,data,baseURL,callBack) {//browserType为判断浏览器函数，data为支付接口参数对象,baseURL,callBack支付后的回调
            if(browserType() =="weixin") {//微信浏览器内
                if (location.href.indexOf("code") >= 0) {
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
                                            main.setSession("business_id", data.business_id);
                                            callBack()
                                        }
                                    })
                                }
                            });
                        });
                        return;
                    }
                }else {
                    location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://pay.yingegou.com/payment/views/newDrainage/payPage.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                }
            }else if(browserType() =="alipay") {//支付宝扫码进入

                if (location.href.indexOf("auth_code") >= 0) {    
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
                                            main.setSession("business_id", data.business_id);
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
                } else {
                    location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=http://pay.yingegou.com/payment/views/newDrainage/payPage.html" 
                }
            }else {//普通浏览器扫码进入
                data.pay_way = 'alipay_web';
                main.post( baseURL+"pay/create_pay",
                        data,
                    function (res) {
                        // alert(JSON.stringify(res))
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
                            main.setSession("business_id", data.business_id);
                            main.setSession("sn", data.orderNo);
                            // main.setSession("paySuccObj", paySuccObj);//传值支付成功的引流页面
                            var url = data.credential.alipay_web.orderInfo;
                            console.log(url)
                            // location.href = url
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
                                    location.href = "../../views/newDrainage/paySucc.html";
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
            }
        }
    })
 })   