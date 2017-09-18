require(['config'],function(){
    require(['angle'],function () {

        $(".ck").click(function(event) {
        	$(this).toggleClass("active");
        	if($(this).hasClass('active')){
        		$("#register").removeClass('no');
        	}else{
        		$("#register").addClass('no');
        	}
        });

        $("#getYzm").getYzm({
            valDom : $("#tel"),
            sms_type : "0005",
            errorDom : $(".prompt")
        });

        $("#register").click(function(event) {
            event.preventDefault(); 
            window.event.returnValue = false;

            if($(this).hasClass('no'))return;

            if($("#tel").val().length == 0 || $("#yzm").val().length == 0){
                $(".prompt").text("请您仔细填写信息，不能有空哦！");
                return;
            }

            if(!(/^1[34578]\d{9}$/.test($("#tel").val()))){
    			$(".prompt").text("请输入正确的手机号！");
    			return;
    		}

    		if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($("#email").val())) && $("#email").val().length != 0){
    			$(".prompt").text("请输入正确邮箱！");
    			return;
    		}

    		$.fn.getData({
                url : "/business/addBusinessCheckOne",
                data : {
                    mobile : $("#tel").val(),
                    verification_code : $("#yzm").val(),
                    email : $("#email").val()
                },
                result : function(data){
                    if(data.status == "error"){
                        $(".prompt").text(data.msg);
                    }else if(data.status == "success"){
                        data = data.data;
                        $.fn.setCookie("business_check_id",data.business_check_id);
                        $.fn.setCookie("account",data.account);
                        window.open("apply.html","_self");
                    }
                }
            });
        	
        });

    });
});