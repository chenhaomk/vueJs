require(['config'],function(){
    require(['angle','gaode'],function () {

    	window.area_id;
    	window.member_id = $.fn.getCookie("member_id");
    	window.meInfo;

    	var citysearch = new AMap.CitySearch(),
    		pageInfo = ((window.location.href).substring(6)).split("/");

    	$(".pageMain").css("min-height",$("body").height()-$(".head").height()-$(".footer").height()-1+"px");
    	$(".footer").show();

        citysearch.getLocalCity(function(status, result) {
            $(".head .cen .address").text(result.city);
            area_id = result.adcode;
            $.fn.setCookie('lng', result.rectangle.split(';')[0].split(',')[0]);
            $.fn.setCookie('lat', result.rectangle.split(';')[0].split(',')[1]);
            if(member_id){
                $.fn.getData({
                    url : "/member/getPersonCenterInfo",
                    data : {
                        member_id : member_id
                    },
                    result : function(data){
                        meInfo = data.data;
                        $("#userinfo .info").show().find('img').attr("src",meInfo.head_portrait)
                            .next().text(meInfo.nick_name);
                        $("#loginOut").prompt({
                            c : function(){

                            },
                            r : function(){
                                $.fn.delCookie("member_id");
                                $.fn.delCookie("mobile");
                                $.fn.delCookie("token");
                                window.open("/views/user/login.html","_self");
                            }
                        });
                    }
                });

                $.fn.getData({
	                url : '/member/getMemberExpanderInfo',
	                data : {
	                    member_id : member_id
	                },
	                result : function(data){
	                    
	                    if(data.status == "success"){
	                        $(".apply,.applyf").click(function(event) {
	                            window.open("/views/personal/myCard.html","_self");
	                        });
	                        meInfo = data.data;
	                    }else{
	                        $(".apply,.applyf").applyPeople();
	                    }
	                }
	            });
            }else{
                $("#userinfo .log").show();
                $(".apply,.applyf").click(function(event) {
	                window.open("/views/user/login.html","_self");
	            });
            }

            $.fn.getData({
                url : "/home/getHistoryAndHotSearch",
                data : {
                    member_id : member_id,
                    area_id : area_id
                },
                result : function(data){
                    data = data.data;
                    for(var i=0;i<data.hot_search.length;i++){
                        $("#hotSearch").append('<a href="/views/shop/list.html?text='+encodeURI(encodeURI(data.hot_search[i].hot_business_name))+'">'+data.hot_search[i].hot_business_name+'</a>');
                    }
                }
            });

            if(pageInfo[pageInfo.length-1] == ""){
	    		$(".pageMain").load("/views/index.html",function() {
	    			
	    		});
	    	}else{

	    	}
        });

        window.onpopstate = function (e) {
    		
		}

        $.fn.getData({
            url : "/business/getAllIndustry",
            data : {},
            result : function(data){
                data = data.data;
                for(var i=0;i<data.industry_list.length;i++){
                    $("#couponsType").append('<a href="/views/coupon/list.html?industry_id='+data.industry_list[i].industry_id+'">'+data.industry_list[i].name+'</a>')
                }
            }
        });

    	$(".se_btn").click(function(event) {
            var val = $("#name").val();
            if(val.length != 0){
                window.open("/views/shop/list.html?text="+encodeURI(encodeURI(val)),"_self");
            }
        });

    });
});