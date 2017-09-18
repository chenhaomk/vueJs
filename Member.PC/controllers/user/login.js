require(['config'],function(){
    require(['angle'],function () {
        
        $('.tab').tab();

        $("#getYzm").getYzm({
        	valDom : $("#tel1"),
        	sms_type : "0001",
        	errorDom : $("#prompt1")
        });

        $("#log1").click(function(event) {

            event.preventDefault(); 

            if($("#yzm1").val().length == 0 || $("#yzm1").val().length == 0){
                $("#prompt1").text("手机号或验证码不能为空！");
                return;
            }

            $.fn.getData({
                url : "/passport/fastLogin",
                data : {
                    mobile : $("#tel1").val(),
                    verification_code : $("#yzm1").val()
                },
                result : function(data){
                    if(data.status == "error"){
                        $("#prompt1").text(data.msg);
                    }else if(data.status == "success"){
                        data = data.data;
                        $.fn.setCookie("member_id",data.member_id);
                        $.fn.setCookie("mobile",data.mobile);
                        $.fn.setCookie("token",data.token);

                        if(data.business_id == ""){
                            window.open("/","_self");
                        }else{
                            window.open("/views/shop/index.html?id="+data.business_id,"_self");
                        }
                    }
                }
            });
        });

        $("#log2").click(function(event) {

            event.preventDefault(); 

            if($("#tel2").val().length == 0 || $("#pwd").val().length == 0){
                $("#prompt2").text("手机号或密码不能为空！");
                return;
            }

            $.fn.getData({
                url : "/passport/login",
                data : {
                    mobile : $("#tel2").val(),
                    password : $("#pwd").val()
                },
                result : function(data){
                    if(data.status == "error"){
                        $("#prompt2").text(data.msg);
                    }else if(data.status == "success"){
                        data = data.data;
                        $.fn.setCookie("member_id",data.member_id);
                        $.fn.setCookie("mobile",data.mobile);
                        $.fn.setCookie("token",data.token);
                        if(data.business_id == ""){
                            window.open("/","_self");
                        }else{
                            window.open("/views/shop/index.html?id="+data.business_id,"_self");
                        }
                    }
                }
            });
        });

    });
});