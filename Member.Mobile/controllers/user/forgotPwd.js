require(['config'],function(){
    require(['axio','vue','mock','mock-api','main'],function (axio,Vue,Mock,mockApi,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                active : 0,
                phone : "",
                vercode : "",
                userId : "",
                pwd : "",
                dpwd : ""
            },
            methods : {
                submit : function(e){
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if(that.userId.length == 0 || that.pwd.length == 0 || that.dpwd.length == 0 || that.vercode.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }

                    if(that.pwd != that.dpwd){
                        ygg.prompt("两次密码不一致！");
                        return;   
                    }

                    ygg.ajax('/member/forgotPassword',{
                        mobile : that.userId,
                        password : that.pwd,
                        verification_code : that.vercode
                    },function(data){
                        if(data.status == "error"){
                            ygg.prompt(data.msg);
                        }else if(data.status == "success"){
                            data = data.data;
                            ygg.setCookie("member_id",data.member_id);
                            ygg.setCookie("mobile",data.mobile);
                            ygg.setCookie("token",data.token);
                            window.open("/index11.html","_self");
                        }
                    });
                },
                blurTip : function(s,t,r){
                    ygg.verify(s,t,r);
                }
            },
            components : {
                getVercode : ygg.template.getVercode 
            }
        });


    });
});