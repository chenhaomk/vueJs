require(['config'],function(){
    require(['axio','vue','main'],function (axio,Vue,ygg) {
                // var baseUrl = "https://api.yingegou.com/v1.0/";
        var baseUrl = "http://119.23.10.30:9000/v1.0";
        var vm = new Vue({
            el : "#app",
            data : {
                active : 0,
                phone : "",
                vercode : "",
                userId : "",
                pwd : "",
                cs : 0,
                ver : "",
                vshow : false
            },
            methods : {
                //微信登录
                wechatLogin : function(e){
                    alert(111)
                    event.preventDefault();
                    window.event.returnValue = false;

                },

                //支付宝登录
                alipayLogin : function(e){
                    alert(222)
                    event.preventDefault();
                    window.event.returnValue = false;

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