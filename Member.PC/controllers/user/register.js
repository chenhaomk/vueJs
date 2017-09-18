require(['config'],function(){
    require(['angle'],function () {

        $('.tab').tab();

        $("#getYzm1").getYzm({
        	valDom : $("#tel1"),
            sms_type : "0002",
            errorDom : $("#prompt1")
        });

        $("#getYzm2").getYzm({
        	valDom : $("#tel2"),
            sms_type : "0003",
            errorDom : $("#prompt2")
        });

        $("#c1").change(function(event) {
            if($(this).prop("checked")){
                $("#register1").removeClass('no');
            }else{
                $("#register1").addClass('no');
            }
        });

        $("#c2").change(function(event) {
            if($(this).prop("checked")){
                $("#register2").removeClass('no');
            }else{
                $("#register2").addClass('no');
            }
        });

        $("#register1").click(function(event) {
            event.preventDefault();
            window.event.returnValue = false;
            if($(this).hasClass('no'))return;

            if($("#tel1").val().length == 0 || $("#yzm1").val().length == 0){
                $("#prompt1").text("手机号或验证码不能为空！");
                return;
            }

            $.fn.getData({
                url : "/passport/fastRegister",
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
                        window.open("/index.html","_self");
                    }
                }
            });
        });

        $("#register2").click(function(event) {
            event.preventDefault(); 
            window.event.returnValue = false;
            if($(this).hasClass('no'))return;

            if($("#tel2").val().length == 0 || $("#yzm2").val().length == 0 || $("#pwd").val().length == 0 || $("#repwd").val().length == 0){
                $("#prompt2").text("请您仔细填写信息，不能有空哦！");
                return;
            }

            if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z`~!@#$%^&*()_+=-]{8,16}$/.test($("#pwd").val()))){
                $("#prompt2").text("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
                return;
            }

            if($("#pwd").val() != $("#repwd").val()){
                $("#prompt2").text("两次密码不一致！");
                return;   
            }

            $.fn.getData({
                url : "/passport/register",
                data : {
                    mobile : $("#tel2").val(),
                    password : $("#pwd").val(),
                    verification_code : $("#yzm2").val()
                },
                result : function(data){
                    if(data.status == "error"){
                        $("#prompt2").text(data.msg);
                    }else if(data.status == "success"){
                        data = data.data;
                        $.fn.setCookie("member_id",data.member_id);
                        $.fn.setCookie("mobile",data.mobile);
                        $.fn.setCookie("token",data.token);
                        window.open("/index.html","_self");
                    }
                }
            });
        });

    });
});