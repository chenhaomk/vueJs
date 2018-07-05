require(['config'],function(){
    require(['angle'],function () {

        var business_id = $.fn.getQueryString("id"),
            industry_id = $.fn.getQueryString("industry_id"),
            industry_name = decodeURI($.fn.getQueryString("name"));

        if(!business_id)window.open("list.html","_self");

        if(industry_name != null && industry_name != "null" && industry_name != ""){
            $(".t_m").append('\
                <img src="/assets/images/icon/icon_tm.png" alt=""><a href="list.html?industry_id='+industry_id+'">'+industry_name+'</a>\
            ');
        }

        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(2)").addClass('active');

            $.fn.getData({
                url : '/business/getBusinessDetails',
                data : {
                    business_id : business_id,
                    member_id : $.fn.getCookie("member_id")
                },
                result : function(data){
                    data = data.data;
                    // console.log(data)

                    $("#info .title").text(data.business_details.name);
                    $(".t_m").append('\
                        <img src="/assets/images/icon/icon_tm.png" alt="">'+data.business_details.name+'\
                    ');
                    $("#info .address").text(data.business_details.address);
                    $("#info .phone").text(data.business_details.phone);
                    $("#info .b_logo").attr("src",data.business_details.logo);
                    $("#info .shop_star").star(data.business_details.star);
                    $(".new_com").before("<img src='"+data.business_details.inner_imgs+"'>");

                    if(data.coupons.length == 0){
                        $(".coupon_list").addClass('empty');
                    }else{
                        for(var i=0;i<data.coupons.length;i++){
                            data.coupons[i].business_name = data.business_details.name;
                        }
                        $(".coupon_list").setCoupons(data.coupons);
                    }

                    $("#ct").text('相关优惠('+data.coupons.length+')');
                    // $("#cmp").text("评价("+data.business_details.comment_count+")");

                    for(var i=0;i<data.business_details.detail_imgs.length;i++){
                        $("#content").append('<p><img src="'+data.business_details.detail_imgs[i]+'"></p>')
                    }

                    /*
                        <div class="group">
                            <p>
                                <img src="/assets/images/index/1.png" alt="">
                                <span>5</span><b></b>
                                超级好吃的说~已经第三次来啦~
                            </p>
                        </div>
                        <div class="group">
                            <p>
                                <img src="/assets/images/index/1.png" alt="">
                                <span>5</span><b></b>
                                超级好吃的说~已经第三次来啦~
                            </p>
                        </div>
                        <div class="group">
                            <p>
                                <img src="/assets/images/index/1.png" alt="">
                                <span>5</span><b></b>
                                超级好吃的说~已经第三次来啦~
                            </p>
                        </div>  
                    */
                }
            });
        });
        
        var isOne = true,
            filterData = {
                business_id : business_id,
                page : 1,
                size : 10
            };
        $(".tab").tab(function(index){
            if(index == 1 && isOne){
                isOne = false;
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
            }
        });
        $.fn.rTop();

        function getList(cb){
            $.fn.loading(true);
            $.fn.getData({
                url : "/business/getComments",
                data : filterData,
                result : function(data){
                    data = data.data;
                    // console.log(data)
                    if(data.pages>=1 && cb)cb(data.pages);
                    $.fn.loading(false);

                    $(".comment ul").html("");
                    if(data.comments.length == 0){
                        $(".bot .tab_group").addClass('empty');
                    }else{
                        $(".bot .tab_group").removeClass('empty');
                        for(var i=0;i<data.comments.length;i++){
                            $(".comment ul").append('\
                                <li>\
                                    <div class="stop">\
                                        <p class="time">'+$.fn.getd("Y.m.d H:i",data.comments[i].create_date / 1000)+'</p>\
                                        <img src="'+data.comments[i].head_portrait+'" alt="">\
                                        <div class="text">\
                                            <p class="name">'+data.comments[i].nick_name+'</p>\
                                            <div class="star"></div>\
                                        </div>\
                                        <div class="conte">\
                                            '+data.comments[i].content+'\
                                        </div>\
                                    </div>\
                                </li>\
                            ')
                            $(".comment ul li:last .star").star(data.comments[i].star);
                        }
                    }
                    $("#cmp").text('评价('+data.comments.length+')');

                }
            });
        }
        getList();

    });
});