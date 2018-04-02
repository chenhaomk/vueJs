require(['config'],function(){
    require(['axio','vue','main'],function (axio,Vue,ygg) {
                var baseUrl = "https://api.yingegou.com/v1.1/";
        // var baseUrl = "http://119.23.10.30:9000/ygg_dev_201803081529_1.5.2/v1.0";
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
                tab : function(index){
                    this.active = index;
                },
                login1 : function(e){
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if(that.phone.length == 0 || that.vercode.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }
                    if (!(/^1[34578]\d{9}$/.test(that.phone))){
                        ygg.prompt("请输入合理的手机号码！");
                        return
                    }
                    ygg.ajax(baseUrl+'/passport/fastLogin',{
                        mobile : that.phone,
                        verification_code : that.vercode
                    },function(data){
                        if(data.status == "error"){
                            ygg.prompt(data.msg);
                        }else if(data.status == "success"){
                            data = data.data;
                            ygg.setCookie("member_id",data.member_id);
                            ygg.setCookie("mobile",data.mobile);
                            ygg.setCookie("token",data.token);
                            if(data.wx_openid == ''   || data.zfb_openid  == '' ) {
                                window.open("/views/user/bindUser.html","_self");
                            }else {
                                window.open("/index.html","_self");
                            }
                        }
                    });
                },
                login2 : function(e){
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if(that.userId.length == 0 || that.pwd.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }

                    /*if(this.cs >= 3){
                        this.vshow = true;
                        return;
                    }*/

                    if(this.vshow)return;

                    ygg.ajax(baseUrl+'/passport/login',{
                        mobile : that.userId,
                        password : that.pwd
                    },function(data){
                        if(data.status == "error"){
                            ygg.prompt(data.msg);
                            if(data.code == "1001"){
                                that.cs++;
                            }
                        }else if(data.status == "success"){
                            data = data.data;
                            ygg.setCookie("member_id",data.member_id);
                            ygg.setCookie("mobile",data.mobile);
                            ygg.setCookie("token",data.token);
                            if(data.wx_openid == ''   || data.zfb_openid  == '' ) {
                                window.open("/views/user/userinfo.html","_self");
                            }else {
                                window.open("/index.html","_self");
                            }
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
                },
                back :function () {
                    window.history.go(-1)
                }
            },
            components : {
                getVercode : ygg.template.getVercode 
            }
        });


    });
});