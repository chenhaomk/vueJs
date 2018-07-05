require(['config'],function(){
    require(['angle'],function () {
    	// debugger
    	var filterData = {};
    	$.fn.loadHeadFooter(function(){
    		$(".nav>a:eq(0)").addClass('active');
            $(".all_dis .list").addClass('show');
            filterData = {
	            member_id : $("#userinfo").attr("data-id"),
	            page:1,
	            area_id : $.fn.getCookie("area_id"),
	            size:10,
				member_id : $.fn.getCookie("member_id"),
				lng:$.fn.getCookie("lng"),
				lat:$.fn.getCookie("lat")
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
					business_id : $("#userinfo").attr("data-bid"),
					longitude:filterData.lng,
					latitude:filterData.lat,
	            },
	            result : function(data){
					data = data.data;
					console.log(data)
					if(!data) {
						return
					}
	                for(var i=0;i<data.adverts.length;i++){
	                	$("#banner .list").append('<img src="'+data.adverts[i].img_path+'">');
	                }
	                $("#banner").banner();


                    // if(data.hot_business){
                    //     $("#fromBusiness").append('\
                    //     	<a href="/views/shop/detail.html?id='+data.from_business.business_id+'&returnUrl=index"><img src="'+data.from_business.inner_imgs+'" class="fn-left" alt=""></a>\
                    //        <div class="info fn-left">\
                    //            <p class="logo">\
                    //            </p>\
                    //            <p class="title_h">\
                    //                '+data.from_business.name+'\
                    //            </p>\
                    //            <p class="content">'+data.from_business.address+'</p>\
                    //        </div>\
                    //     ');
                    // }else{
                    // }

                    // 热门商家
	                for(var i=0;i<data.hot_business.length;i++){
                        if (i==0) {
                            $("#fromBusiness").append('\
								<a href="/views/shop/detail.html?id=' + data.hot_business[0].business_id + '&returnUrl=index"><img src="' + data.hot_business[0].inner_imgs + '" class="fn-left" alt=""></a>\
							   <div class="info fn-left">\
								   <p class="logo">\
								   </p>\
								   <p class="title_h">\
									   ' + data.hot_business[0].name + '\
								   </p>\
								   <p class="content">' + data.hot_business[0].address + '</p>\
							   </div>\
							');
                        }
						if (i!==0) {
                            $("#hotBusiness").append('\
							<a href="/views/shop/detail.html?id='+data.hot_business[i].business_id+'&returnUrl=index"><div class="group">\
	                            <img src="'+data.hot_business[i].inner_imgs+'" alt="">\
	                            <p>'+data.hot_business[i].name+'</p>\
	                        </div></a>\
	                	');
						}
	                }
                	$("#hotBusiness").cqh({
                		leftBtn : $('.lbtn'),
                		rightBtn : $('.rbtn')
                	});
	                if(data.hot_business.length<=3){
	                	$('.lbtn,.rbtn').hide();
	                }

                    // 行业分类
                    for (var i=0; i<data.industry_list.length;i++){
						$("#classify").append('\
							<a href="/views/coupon/list.html?industry_id='+data.industry_list[i].industry_id+'">\
								<span>'+data.industry_list[i].name+'</span>\
							</a>\
						');
                    }
                    // if (data.industry_list) {
                    //     $("#classify").append('\
                    //     	<a href="/views/coupon/list.html?industry_id='+data.industry_list[i].industry_id+'">\
                    //     		<span>'+data.industry_list[i].name+'</span>\
                    //     		 <img src="assets/images/index/1.png"/>\
                    //     	</a>\
                    //     ')
                    // }
	            }
        	});
        }

    });
});