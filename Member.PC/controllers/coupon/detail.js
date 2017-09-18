require(['config'],function(){
    require(['angle'],function () {

        var id = $.fn.getQueryString("id");

        if(!id)window.open("list.html","_self");

        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(3)").addClass('active');

            $.fn.getData({
                url : '/coupon/getCouponDetails',
                data : {
                    coupon_id : id,
                    member_id : $.fn.getCookie("member_id")
                },
                result : function(data){
                    data = data.data;
                    $("#b_d,#fshop").attr("href","/views/shop/detail.html?id="+data.business_id).text(data.business_name);
                    $("#tImg").attr("src",data.img_path);
                    var tt = "专属";
                    if(data.is_share)tt="共享";
                    if(data.type == 2){
                        $("#t .title").append('<span>'+data.discount+'元抵扣券</span>');
                        $("#t .old_price").html(data.discount+"<span>原价(元)</span>");
                        if((data.price+"").indexOf(".") != -1){
                            $("#t .buy").html("￥"+(data.price+"").split(".")[0]+".<span>"+(data.price+"").split(".")[1]+"</span> 立即抢购");
                        }else{
                            $("#t .buy").html("￥"+data.price+".<span>00</span> 立即抢购");
                        }
                        $(".buy").pay(data.price,'/assets/images/icon/ewm.png');
                    }else{
                        if(data.type == 0){
                            $("#t .title").append('<span>'+data.discount+'</span><span class="t">元'+tt+'代金券</span>');
                        }else{
                            $("#t .title").append('<span>'+data.rate*10+'</span><span class="t">折'+tt+'折扣券</span>');
                        }
                        if(data.already_get){
                            $("#t .buy").addClass('buy_coupon').addClass('ylql').attr("data-id",data.coupon_id).html("已领取");
                        }else{
                            $("#t .buy").addClass('buy_coupon').attr("data-id",data.coupon_id).html("免费领取");
                        }
                    }

                    if(data.is_share){
                        $("#t .explain").text("所有店铺通用");
                    }else{
                        $("#t .explain").text("只能用于"+data.business_name);
                    }
                    
                    $("#stime").text($.fn.getd("Y.m.d",data.begin_date / 1000) + "-" + $.fn.getd("Y.m.d",data.end_date / 1000));
                    $("#tj2").text('满'+data.min_price+"可用");
                    $("#introduction").text(data.introduction||"");
                    $(".bot_rig h3").text(data.business_name);
                    $(".bot_rig .phone").text(data.business_phone);
                    $(".bot_rig .star").star(data.business_star);
                    $(".bot_rig .address").star(data.business_address);

                    var map = new BMap.Map("map");
                    var point = new BMap.Point(data.lng,data.lat);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                }
            });
        });

    });
});