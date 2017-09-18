require(['config'],function(){
    require(['angle'],function () {

    	var business_check_id=$.fn.getCookie("business_check_id"),
            status = $.fn.getQueryString("s");
        if(!business_check_id)window.open('login.html',"_self");

        if(status == "3"){
            var text = $.fn.getQueryString("t");
        	$(".error.status").show().siblings(".status").hide();
            $(".error .cont").html("抱歉！您的审核被驳回，驳回原因：<br>"+text);
        }else if(status == "2"){
        	$(".success.status").show().siblings(".status").hide();
        }

    });
});