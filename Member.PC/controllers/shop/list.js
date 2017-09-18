require(['config'],function(){
    require(['angle',"citys"],function () {

    	var text = decodeURI($.fn.getQueryString("text")),
    		industry_id = $.fn.getQueryString("industry_id"),
    		url = '/home/getHotBusiness';

        var filterData = {
            area_id : $.fn.getCookie("area_id"),
            page : 1,
            size : 9
        },
        industry_id = $.fn.getQueryString("industry_id");

        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(2)").addClass('active');

            if(text != null && text != "null"){
            	url = '/home/getSearchResult';
            	filterData = {
            		member_id : $.fn.getCookie("member_id"),
		            area_id : $.fn.getCookie("area_id"),
		            business_name : text,
		            page : 1,
		            size : 9
		        };
                $("#name").val(text);
	    	}else if(industry_id){
	    		url = '/home/getHotBusiness';
            	filterData = {
		            area_id : $.fn.getCookie("area_id"),
		            industry_id : industry_id,
		            page : 1,
		            size : 9
		        }
	    	}

            $.fn.getData({
                url : '/business/getAllIndustry',
                data : {},
                result : function(data){
                    data = data.data;

                    if(data.industry_list.length != 0){
                        for(var i=0;i<data.industry_list.length;i++){
                        	$(".tags").append('\
                        		<a href="list.html?industry_id='+data.industry_list[i].industry_id+'" data-id="'+data.industry_list[i].industry_id+'">'+data.industry_list[i].name+'</a>\
                        	');
                        }
                    }

                    $('.tags [data-id="'+industry_id+'"]').addClass('active');

                }
            });
            
            getList(function(pages){
                $(".paging").pages(pages,function(i){
                    if(i == "next"){
                        filterData.page++;
                    }else if(i == "prev"){
                        filterData.page--;
                    }else{
                        filterData.page = i;
                    }
                    getList();
                });
            });
        });

        function getList(cb){
            $("#list").html("");
            $.fn.getData({
                url : url,
                data : filterData,
                result : function(data){
                    data = data.data;
                    if(data.pages>=1 && cb)cb(data.pages);

                    if(data.businessArr.length != 0){
                        var tt = encodeURI(encodeURI($('.tags [data-id="'+industry_id+'"]').text()));
                        for(var i=0;i<data.businessArr.length;i++){
                        	$("#list").append('\
                        		<a href="detail.html?id='+data.businessArr[i].business_id+'&industry_id='+industry_id+'&name='+tt+'"><div class="group">\
					                <div class="img"><img src="'+data.businessArr[i].inner_imgs+'" alt=""></div>\
					                <div class="text">\
					                    <p>'+data.businessArr[i].name+'</p>\
					                    <div class="star"></div>\
					                </div>\
					            </div></a>\
                        	');
                            if(data.businessArr[i].inner_imgs == "")$("#list>a:last .img").addClass('noImg');
                            $("#list>a:last .star").star(data.businessArr[i].star);
                        }
                    }else{
                        $("#list").addClass('empty');
                    }

                }
            });
        }

    });
});