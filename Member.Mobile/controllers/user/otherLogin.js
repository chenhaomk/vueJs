require(['config'],function(){
    require(['axio','vue','main'],function (axio,Vue,ygg) {
                // var baseUrl = "https://api.yingegou.com/v1.0/";
        //var baseUrl = "http://api.yingougou.com/v1.0";
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
        var bType = browserType() //判断浏览器
        var vm = new Vue({
            el : "#app",
            data : {
                // active : 0,
                // phone : "",
                // vercode : "",
                // userId : "",
                // pwd : "",
                // cs : 0,
                // ver : "",
                // vshow : false
            },
            methods : {
                //微信登录
                wechatLogin : function(e){
                    e.preventDefault();
                    if(bType == 'weixin') {//在微信浏览器内用微信公众号授权登录
                        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                    }else if(bType == 'alipay') {
                        window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb8605b32e044c45b&redirect_uri=https%3a%2f%2fm.yingougou.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
                    }else {//第三方浏览器点击微信登录时用微信开放平台授权登录'wxb8605b32e044c45b'
                        window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb8605b32e044c45b&redirect_uri=https%3a%2f%2fm.yingougou.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
                    }
                },
                //支付宝登录
                alipayLogin : function(e){
                    e.preventDefault();
                    window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_uri%3Dhttps%3A%2F%2Fm.yingougou.com'
                },
                blurTip : function(s,t,r){
                    ygg.verify(s,t,r);
                },
                yzm : function(){

                },
                close : function(){
                    this.vshow = false;
                }
            },
            components : {
                getVercode : ygg.template.getVercode 
            }
        });


    });
});