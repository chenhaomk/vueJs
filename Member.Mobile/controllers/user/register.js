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
                dpwd : "",
                rvercode : "",
                ck : "",
                isOk : false,
                sso : false
            },
            methods : {
                tab : function(index){
                    this.active = index;
                },
                register1 : function(e){
                    event.preventDefault();
                    window.event.returnValue = false;
                    if(this.ck == "none")return;
                    var that = this;
                    if(that.phone.length == 0 || that.vercode.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }
                    ygg.ajax('/passport/fastRegister',{
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
                            window.open("/index.html","_self");
                        }
                    });
                },
                register2 : function(e){
                    event.preventDefault();
                    window.event.returnValue = false;
                    if(this.ck == "none")return;
                    var that = this;
                    if(that.userId.length == 0 || that.pwd.length == 0 || that.dpwd.length == 0 || that.rvercode.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }

                    if(that.pwd != that.dpwd){
                        ygg.prompt("两次密码不一致！");
                        return;   
                    }

                    if(this.isOk){
                        ygg.prompt("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
                        return;
                    }

                    ygg.ajax('/passport/register',{
                        mobile : that.userId,
                        password : that.pwd,
                        verification_code : that.rvercode
                    },function(data){
                        if(data.status == "error"){
                            ygg.prompt(data.msg);
                        }else if(data.status == "success"){
                            data = data.data;
                            ygg.setCookie("member_id",data.member_id);
                            ygg.setCookie("mobile",data.mobile);
                            ygg.setCookie("token",data.token);
                            window.open("/index.html","_self");
                        }
                    });
                },
                checkbox : function(){
                    this.ck == ""?this.$set(this,"ck","none"):this.$set(this,"ck","");
                },
                blurTip : function(s,t,r){
                    this.isOk = ygg.verify(s,t,r);
                }
            },
            components : {
                getVercode : ygg.template.getVercode 
            }
        });


    });
});