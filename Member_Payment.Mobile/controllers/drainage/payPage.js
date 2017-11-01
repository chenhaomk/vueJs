require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var baseURL = 'http://192.168.0.119:8084/v1.0/';
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
    				payFn(browserType,payObj,baseURL,pageAlert)
                    function pageAlert() {
                        alert("支付成功")
                    }
    			}
    		}
    	})
        
        var payObj = {
            amount:0.1,
            member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
            business_id: '2c92f9245f5d0d46015f5d0e00f40002',
            
        }
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
                                console.log(res)
                                if (res.data.code == 200) {
                                    //调用官方公众号接口
                                    var configObj = {
                                        debug:true,
                                        appId:res.data.data.appId,
                                        timestamp:res.data.data.timeStamp,
                                        nonceStr:res.data.data.nonceStr,
                                        signature:res.data.data.paySign,
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
                                        timestamp:res.data.data.timeStamp,
                                        nonceStr:res.data.data.nonceStr,
                                        package:res.data.data.package,
                                        signType:res.data.data.signType,
                                        paySign:res.data.data.paySign,
                                        success:function (res) {
                                            callBack()
                                        }
                                    })
                                }
                                // main.prompt(res.data.data)
                            });
                        });
                        return;
                    }
                }else {
                    location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=http://store.nat300.top/views/newDrainage/payPage.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
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
                            data.pay_way ='alipay_web'
                            main.post(baseURL + "pay/create_pay",data , function (res) {
                                if (res.data.code == 200) {
                                    //调用官方公众号接口
                                    var tradeNo = res.data.data.tradeNO;
                                    main.setSession("tradeNO", tradeNo);
                                   alert(1);
                                   AlipayJSBridge.call("tradePay",{
                                              tradeNO: main.getSession("tradeNO")
                                            }, function(result){
                                              alert("支付成功");
                                            });
                                    
                                }
                            });
                        });
                        return;
                    }
                } else {
                    location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=http://wxstore.natapp1.cc/views/newDrainage/payPage.html" 
                }
            }else {//普通浏览器扫码进入
                main.prompt("请登录微信app或者支付宝app扫码支付!");
                console.log("H5支付")
                // main.post(baseURL + "pay/create_pay", {
    //                    amount: 0.1,
    //                    member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
    //                    business_id: '2c92f9245f5d0d46015f5d0e00f40002',
    //                    pay_way: 'wechat_wap'
    //                }, function (res) {
    //                    console.log(res)
    //                    if (res.data.code == 200) {
    //                        location.href = res.data.data;
    //                    }
    //                });
            }
        }
 function ready(callback) {
                                        // 如果jsbridge已经注入则直接调用
                                        if (window.AlipayJSBridge) {
                                            callback && callback(); 
                                        } else {
                                            // 如果没有注入则监听注入的事件
                                            document.addEventListener('AlipayJSBridgeReady', callback, false);
                                        }
                                    }
                                     ready(function () {
                                        document.querySelector('.tradeno').addEventListener('click', function(){
                                            AlipayJSBridge.call("tradePay",{
                                              tradeNO: main.getSession("tradeNO")
                                            }, function(result){
                                              alert("支付成功");
                                            });
                                          });
                                    });
        //  function ready(callback) {
        //     // 如果jsbridge已经注入则直接调用
        //     if (window.AlipayJSBridge) {
        //         callback && callback(); 
        //     } else {
        //         // 如果没有注入则监听注入的事件
        //         document.addEventListener('AlipayJSBridgeReady', callback, false);
        //     }
        // }
        // ready(function () {
        //     document.querySelector('.tradeno').addEventListener('click', function(){
        //         AlipayJSBridge.call("tradePay",{
        //           tradeNO: main.getSession("tradeNO")
        //         }, function(result){
        //           alert(JSON.stringify(result));
        //         });
        //       });
        // });








    })
 })   