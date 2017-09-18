require(['config'],function(){
    require(['angle'],function () {

        var filterData = {
            member_id : $.fn.getCookie("member_id"),
            order_status : 0,
            page : 1,
            size : 10
        };
        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(0)").addClass('active');
            $(".sidebar").load("sidebar.html",function(){
                $("#sidebar .ord").addClass('active');
            });
            
            getOrder(function(pages){
                $(".paging").pages(pages,function(i){
                    if(i == "next"){
                        filterData.page++;
                    }else if(i == "prev"){
                        filterData.page--;
                    }else{
                        filterData.page = i;
                    }
                    getOrder();
                });
            });
        });

        if(!filterData.member_id){
            window.open('http://'+window.location.host,"_self");
        }

        $(".tab_menu a").click(function(event) {
            if($(this).hasClass('active'))return;
            $(this).index() == 0?filterData.order_status=0:$(this).index() == 1?filterData.order_status=2:$(this).index() == 2?filterData.order_status=3:filterData.order_status=4;
            $(this).addClass('active').siblings().removeClass('active');
            filterData.page = 1;
            getOrder();
        });

        $("table").on('click', '.s_detail', function(event) {
            $.fn.getData({
                url : '/member/getMemberOrder',
                data : filterData,
                result : function(data){
                    data = data.data;
                    console.dir(data);
                }
            });
            $(".detail").show().siblings('.cont').hide();
        });

        function getOrder(cb){
            $("tbody tr").remove();
            $.fn.getData({
                url : '/member/getMemberOrder',
                data : filterData,
                result : function(data){
                    data = data.data;
                    if(data.pages>1 && cb)cb(data.pages);
                    $(".tab_menu a").eq(0).text("全部("+data.all_total+")");
                    $(".tab_menu a").eq(1).text("待使用("+data.need_use_total+")");
                    $(".tab_menu a").eq(2).text("已使用("+data.already_use_total+")");
                    $(".tab_menu a").eq(3).text("已过期("+data.expired_total+")");

                    if(data.order_list.length != 0){
                        $("table").show();
                        for(var i=0;i<data.order_list.length;i++){
                            var a = '<a class="s_detail" data-id="'+data.order_list[i].coupon_id+'">查看详情</a>',
                                type="专属券",
                                status="待使用",
                                p = '<p>'+data.order_list[i].price+'元'+type+' '+data.order_list[i].price+'元抵扣'+data.order_list[i].discount+'元</p>',
                                className = "";
                            if(data.order_list[i].is_share)type="共享券";
                            if(data.order_list[i].status == 0){
                                p += '<p class="stime">'+$.fn.djs(data.order_list[i].end_date,data.now)+'后过期</p>';
                            }else{
                                if(data.order_list[i].status == 1){
                                    status = "已使用";
                                    className = "expired";
                                    a+='<br><a href="/views/coupon/detail.html?id='+data.order_list[i].coupon_activity_id+'&returnUrl=/views/personal/order.html">再来一张</a>';
                                }else{
                                    status = "待支付";
                                }
                            }
                            if(filterData.order_status == 4)status = "已过期";
                            $("tbody").append('\
                                <tr class="'+className+'">\
                                    <td class="first">\
                                        '+p+'\
                                    </td>\
                                    <td class="sname"><p>'+data.order_list[i].use_business_name+'</p></td>\
                                    <td>'+$.fn.getd('Y.m.d H:i',data.order_list[i].create_date/1000)+'</td>\
                                    <td>￥'+data.order_list[i].price+'</td>\
                                    <td>'+status+'</td>\
                                    <td class="btns">'+a+'</td>\
                                </tr>\
                            ');
                        }
                    }else{
                        $(".cont").addClass('empty');
                    }

                }
            });
        }

    });
});