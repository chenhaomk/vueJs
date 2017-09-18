require(['config'],function(){
    require(['angle'],function () {

        var business_id = $.fn.getQueryString("id");

        if(!business_id)window.open("/","_self");

        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(2)").addClass('active');
            $(".head .cen,.head .bot,.head .top .btns a:eq(0),.head .top .btns b,.t_m").hide();

            $.fn.getData({
                url : '/business/getBusinessDetails',
                data : {
                    business_id : business_id
                },
                result : function(data){
                    data = data.data;

                    $("#info .title").text(data.business_details.name);
                    $("#info .address").text(data.business_details.address);
                    $("#info .phone").text(data.business_details.phone);
                    $("#info .b_logo").attr("src",data.business_details.logo);
                    $("#info .shop_star").star(data.business_details.star);
                    $(".new_com").before("<img class='ban' src='"+data.business_details.inner_imgs+"'>");

                    if(data.coupons.length == 0){
                        $(".coupon_list").addClass('empty');
                    }else{
                        for(var i=0;i<data.coupons.length;i++){
                            data.coupons[i].business_name = data.business_details.name;
                        }
                        $(".coupon_list").setCoupons(data.coupons);
                    }

                    $("#ct").text('相关优惠('+data.coupons.length+')');
                    $("#cmp").text("评价("+data.comments.length+")");

                    for(var i=0;i<data.business_details.detail_imgs.length;i++){
                        $("#content").append('<p><img src="'+data.business_details.detail_imgs[i]+'"></p>')
                    }

                    if(data.comments.length == 0){
                        $(".bot .tab_group").addClass('empty');
                    }else{
                        for(var i=0;i<data.comments.length;i++){
                            $(".comment ul").append('\
                                <li>\
                                    <div class="stop">\
                                        <p class="time">'+$.fn.getd('Y.m.d H:i',data.comments[i].create_date / 1000)+'</p>\
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

                    console.dir(data)


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

        $(".comment .star").each(function(index, el) {
            $(this).star(4.3);
        });

        $(".tab").tab();
        $.fn.rTop();

    });
});

