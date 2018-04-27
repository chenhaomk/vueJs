require(['config'],function(){
    require(['angle'],function () {

    	var filterData = {},industry_id=$.fn.getQueryString("industry_id");
    	 
    	window.onpopstate = function (e) {
    		location.reload();
		}
        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(3)").addClass('active');

            filterData = {
	            member_id : $("#userinfo").attr("data-id"),
	            page:1,
	            area_id:$.fn.getCookie("area_id"),
	            size:10,
	            industry_id : industry_id
	        };

	        // getFilter();

	        getc();

        });

        $("#industry").on('click', 'a', function(event) {
        	event.preventDefault();
        	if($(this).hasClass('active'))return;
        	$(this).addClass('active').siblings().removeClass('active');
        	filterData.industry_id = $(this).attr("data-id");
        	$("#ss_st").show().html("").append('<img src="/assets/images/icon/arrow.png" alt=""><a>'+$(this).text()+'<b class="remove_hy"></b></a>');
        	getc();
        	window.history.pushState(filterData, "title", "?industry_id="+filterData.industry_id);
        });

        $(".top").on('click', '.remove_hy', function(event) {
        	event.preventDefault();
        	$(this).parent().parent().hide();
        	$("#industry .active").removeClass('active');
        	filterData.industry_id = "";
            window.history.pushState(filterData, "title", "?industry_id="+filterData.industry_id+"&circle_id="+filterData.circle_id);
        	getc();
        });

        $("#sq").on('click', 'a', function(event) {
        	event.preventDefault();
        	if($(this).hasClass('active'))return;
        	$(this).addClass('active').siblings().removeClass('active');
        	filterData.circle_id = $(this).attr("data-id");
            window.history.pushState(filterData, "title", "?industry_id="+filterData.industry_id+"&circle_id="+filterData.circle_id);
        	$("#ss_sq").show().html("").append('<img src="/assets/images/icon/arrow.png" alt=""><a>'+$(this).text()+'<b class="remove_sq"></b></a>');
        	getc();
        });

        $(".top").on('click', '.remove_sq', function(event) {
        	event.preventDefault();
            $(this).parent().parent().hide();
        	$("#sq .active").removeClass('active');
        	filterData.circle_id = "";
            window.history.pushState(filterData, "title", "?industry_id="+filterData.industry_id+"&circle_id="+filterData.circle_id);
        	getc();
        });

        var area_circle_list;

        $("#area").on('click', 'a', function(event) {
        	event.preventDefault();
        	if($(this).hasClass('active'))return;
        	$(this).addClass('active').siblings().removeClass('active');
        	
        	setSq(area_circle_list[$(this).index()].circle_list);
        });

        $(".sort").on('click', 'a', function(event) {
        	event.preventDefault();
        	if($(this).hasClass('checkbox')){
        		var index = $(this).index();
	        	if($(this).hasClass('checked')){
	        		$(this).removeClass('checked');
	        		if(index == 3){
						if($(this).siblings('.checkbox').hasClass('checked')){
							filterData.coupon_type = 0;
						}else{
							filterData.coupon_type = "";
						}
	        		}else{
	        			if($(this).siblings('.checkbox').hasClass('checked')){
							filterData.coupon_type = 1;
						}else{
							filterData.coupon_type = "";
						}
	        		}
	        	}else{
	        		$(this).addClass('checked');
	        		if(index == 3){
						if($(this).siblings('.checkbox').hasClass('checked')){
							filterData.coupon_type = "";
						}else{
							filterData.coupon_type = 1;
						}
	        		}else{
	        			if($(this).siblings('.checkbox').hasClass('checked')){
							filterData.coupon_type = "";
						}else{
							filterData.coupon_type = 0;
						}
	        		}
	        	}
        	}else{
        		if($(this).hasClass('active'))return;
        		$(this).addClass('active').siblings().removeClass('active');
	        	if($(this).hasClass('zn')){
	        		filterData.plzg = "";
	        		filterData.xlzg = "";
	        	}else if($(this).hasClass('xl')){
	        		filterData.xlzg = 1;
	        		filterData.plzg = "";
	        	}else{
	        		filterData.plzg = 1;
	        		filterData.xlzg = "";
	        	}
        	}
        	getc();
        });

        function getFilter(){
        	$.fn.getData({
                url : "/home/getHomeCenter",
                data : {
                	area_id : filterData.area_id
                },
                result : function(data){
                	data = data.data;

                	for(var i=0;i<data.industry_list.length;i++){
                		$("#industry").append('<a data-id="'+data.industry_list[i].industry_id+'">'+data.industry_list[i].name+'</a>')
                		if(data.industry_list[i].industry_id == industry_id){
                			$("#industry a:last").addClass('active');
                			$("#ss_st").show().html("").append('<img src="/assets/images/icon/arrow.png" alt=""><a>'+data.industry_list[i].name+'<b class="remove_hy"></b></a>');
                		}
                	}

                	area_circle_list = data.area_circle_list;

                	for(var i=0;i<data.area_circle_list.length;i++){
                		$("#area").append('<a data-id="'+data.area_circle_list[i].area_id+'">'+data.area_circle_list[i].area_name+'</a>')
                	}
                	
                }
            });
        }

        function setSq(data){
        	$("#sq").html("").parent().show();
            $(".req .group").removeClass('last');
        	for(var i=0;i<data.length;i++){
        		$("#sq").append('<a data-id="'+data[i].circle_id+'">'+data[i].circle_name+'</a>')
        	}
        }

        function getc(){
            $.fn.loading(true);
        	$(".coupon_list").getCoupons({
	        	filterData : filterData,
	        	returnPages : function(pages){
                    $.fn.loading(false);
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
        }

    });
});