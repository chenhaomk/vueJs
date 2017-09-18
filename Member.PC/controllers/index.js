require(['config'],function(){
    require(['angle'],function () {
    	
    	var filterData = {};
    	$.fn.loadHeadFooter(function(){
    		$(".nav>a:eq(0)").addClass('active');
            $(".all_dis .list").addClass('show');
            filterData = {
	            member_id : $("#userinfo").attr("data-id"),
	            page:1,
	            area_id : $.fn.getCookie("area_id"),
	            size:10,
	            member_id : $.fn.getCookie("member_id")
	        };
            getTopData();

	        $(".coupon_list").getCoupons({
	        	filterData : filterData,
	        	returnPages : function(pages){
	        		$(".paging").pages(pages,function(i){
	        			if(i == "next"){
	        				filterData.page++;
	        			}else if(i == "prev"){
	        				filterData.page--;
	        			}else{
	        				filterData.page = i;
	        			}
	        			$(".coupon_list").getCoupons({
				        	filterData : filterData
				        });
	        		});
	        	}
	        });

    	});

    	$("#btns a:not(.ck)").click(function(event) {

    		if($(this).hasClass('active'))return;
    		$(this).addClass('active').siblings().removeClass('active');
			
			var index = $(this).index();
			if(index == 0){
				filterData.xlzg = "";
				filterData.plzg = "";
			}else if(index == 1){
				filterData.xlzg = 1;
				filterData.plzg = "";
			}else{
				filterData.xlzg = "";
				filterData.plzg = 1;
			}
    		
    		$(".coupon_list").getCoupons({
	        	filterData : filterData,
	        	returnPages : function(pages){
	        		$(".paging").pages(pages,function(i){
	        			if(i == "next"){
	        				filterData.page++;
	        			}else if(i == "prev"){
	        				filterData.page--;
	        			}else{
	        				filterData.page = i;
	        			}
	        			$(".coupon_list").getCoupons({
				        	filterData : filterData
				        });
	        		});
	        	}
	        });
    	});

    	$("#btns a.ck").click(function(event) {

			if($(this).hasClass('active2')){
    			$(this).removeClass('active2');
    		}else{
    			$(this).addClass('active2');
    		}

    		if($("#btns a.active2").length == 0 || $("#btns a.active2").length == 2){
    			filterData.coupon_type = "";
    		}else{
    			if($("#btns a.active2").index() == 3){
					filterData.coupon_type = 1;
				}else{
					filterData.coupon_type = 0;
				}
    		}
    		
    		$(".coupon_list").getCoupons({
	        	filterData : filterData,
	        	returnPages : function(pages){
	        		$(".paging").pages(pages,function(i){
	        			if(i == "next"){
	        				filterData.page++;
	        			}else if(i == "prev"){
	        				filterData.page--;
	        			}else{
	        				filterData.page = i;
	        			}
	        			$(".coupon_list").getCoupons({
				        	filterData : filterData
				        });
	        		});
	        	}
	        });
    	});


        function getTopData(bid){
        	$.fn.getData({
        		url : '/home/getHomeTop',
        		data : {
	                area_id : filterData.area_id,
	                business_id : $("#userinfo").attr("data-bid")
	            },
	            result : function(data){
	            	data = data.data;

	                for(var i=0;i<data.adverts.length;i++){
	                	$("#banner .list").append('<img src="'+data.adverts[i].img_path+'">');
	                }
	                $("#banner").banner();

	                if(data.from_business){
	                    $("#fromBusiness").append('\
	                    	<a href="/views/shop/detail.html?id='+data.from_business.business_id+'&returnUrl=index"><img src="'+data.from_business.inner_imgs+'" class="fn-left" alt=""></a>\
			                <div class="info fn-left">\
			                    <p class="logo">\
			                        <img src="'+data.from_business.logo+'" alt="">\
			                    </p>\
			                    <p class="title_h">\
			                        '+data.from_business.name+'\
			                    </p>\
			                </div>\
	                    ');
	                    //<p class="content">这里可以加上商户的一句话简介 地址或活动信息 四川电视台推荐鸡抓抓啥的 商家自己编</p>
	                }else{
	                    
	                }

	                for(var i=0;i<data.hot_business.length;i++){
	                	$("#hotBusiness").append('\
							<a href="/views/shop/detail.html?id='+data.hot_business[i].business_id+'&returnUrl=index"><div class="group">\
	                            <img src="'+data.hot_business[i].inner_imgs+'" alt="">\
	                            <p>'+data.hot_business[i].name+'</p>\
	                        </div></a>\
	                	');
	                }
                	$("#hotBusiness").cqh({
                		leftBtn : $('.lbtn'),
                		rightBtn : $('.rbtn')
                	});
	                if(data.hot_business.length<=3){
	                	$('.lbtn,.rbtn').hide();
	                }
	            }
        	});

        }

    });
});