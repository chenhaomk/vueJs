require(['config'],function(){
    require(['axio','vue','main'],function (axio,Vue,ygg) {
                // var baseUrl = "https://api.yingegou.com/v1.0/";
        //var baseUrl = "http://api.yingougou.com/v1.0";
        var baseUrl = "http://192.168.0.110:8082/v1.0";
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
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    var param=location.href.split("?")[1];
                    var url=encodeURIComponent("https://api.yingougou.com?"+param);
                    ygg.ajax(baseUrl+'/passport/thirdWxLogin',{
                        wx_openid:'wx123456',
                        nick_name:'ttt'
                    },function(data){
                        console.log(data)
                        if(data.status == "error"){
                            ygg.prompt(data.msg);
                        }else if(data.status == "success"){
                            // window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx123456&redirect_uri="+
                            //     url+"&response_type=code&scope=snsapi_userinfo&"+param+"#wechat_redirect";


                        }
                    });

                },



                //支付宝登录
                alipayLogin : function(e){
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    ygg.ajax(baseUrl+'/passport/thirdZfbLoginGetUrl',{
                        zfb_openid:that.zfb_openid,
                        nick_name:that.nick_name
                    },function(data){
                        // console.log(data)
                        var url = data.data.url
                        // console.log(url);
                        if(data.status == "error"){
                            ygg.prompt(data.msg);
                        }else if(data.status == "success"){
                            window.location.href=url;
                        }
                    });


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