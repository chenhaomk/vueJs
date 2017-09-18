require(['config'],function(){
    require(['angle','idcode'],function () {

        var pageIndex = 1;

        var verifyCode = new GVerify("codeImg");

        $("#getYzm").getYzm({
            valDom : $("#phone"),
            sms_type : "0006",
            errorDom : $(".prompt")
        });

        $(".btn").click(function(event) {
        	if(pageIndex == 1){
        		var phone = $("#phone").val();
        		if(phone.length == 0){
        			$(".prompt1").text("手机号不能为空！");
        			return;
        		}
        		if(!(/^1[34578]\d{9}$/.test(phone))){
        			$(".prompt1").text("请输入正确的手机号！");
        			return;
        		}
        		if(!verifyCode.validate($("#Txtidcode").val())){
        			$(".prompt1").text("错误的验证码！");
        			return;
        		}
	            phone = phone.substring(0,3) + "****" + phone.substring(7);
        		$("#ph span").text(phone);
        	}else if(pageIndex == 2){
        		if($("#pwd").val().length == 0 || $("#rpwd").val().length == 0 || $("#yzm").val().length == 0){
	                $("#prompt3").text("密码或验证码不能为空！");
	                return;
	            }

	            if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z`~!@#$%^&*()_+=-]{8,16}$/.test($("#pwd").val()))){
	                $("#prompt3").text("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
	                return;
	            }

	            if($("#pwd").val().length != $("#pwd").val().length){
	                $("#prompt3").text("两次密码不一致！");
	                return;
	            }
	            $.fn.getData({
	                url : "/passport/forgotPassword",
	                async : false,
	                data : {
	                    mobile : $("#phone").val(),
	                    verification_code : $("#yzm").val(),
	                    password : $("#pwd").val()
	                },
	                result : function(data){
	                    if(data.status == "error"){
	                        $(".prompt2").text(data.msg);
	                        return;
	                    }else if(data.status == "success"){
	                        
	                    }
	                }
	            });
        	}
        	$(".fp_group .group").eq(pageIndex).show().siblings().hide();
        	pageIndex++;
        });

    });
});