require(['config'],function(){
    require(['angle'],function () {

        var filterData = {
            member_id : $.fn.getCookie("member_id"),
            coupon_type : 1,
            overdue : 0,
            page : 1,
            size : 1000
        };

        if(!filterData.member_id){
            window.open('http://'+window.location.host,"_self");
        }
        
        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(0)").addClass('active');
            $(".sidebar").load("sidebar.html",function(){
                $("#sidebar .dis").addClass('active');
            });
            
            getCoupons();
        });

        $(".tab_menu a").click(function(event) {
            if($(this).hasClass('active'))return;
            $(this).index() == 0?filterData.coupon_type=1:filterData.coupon_type=0;
            $(this).addClass('active').siblings().removeClass('active');
            getCoupons();
        });

        $(".tab_group").on("click",".more",function(event) {
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                $(".no").hide();
            }else{
                $(this).addClass('active');
                $(".discount.no").show();
            }
        });

        function getCoupons(){
            $("#list .discount").remove();
            filterData.overdue = 0;
            $.fn.getData({
                url : '/member/getMemberCoupon',
                data : filterData,
                result : function(data){
                    data = data.data;
                    if(data.coupons.length != 0){
                        for(var i=0;i<data.coupons.length;i++){
                            getc(data.coupons[i],"");
                            $(".tab_group .group.active").removeClass('empty');
                        }
                    }
                    $(".tab_menu a").eq(0).text("共享券("+data.share_coupon_total+")");
                    $(".tab_menu a").eq(1).text("商家专属券("+data.exclusive_coupon_total+")");
                    $(".tab_menu a").eq(2).text("团购券("+data.group_coupon_total+")");

                    filterData.overdue = 1;
                    $.fn.getData({
                        url : '/member/getMemberCoupon',
                        data : filterData,
                        result : function(data){
                            data = data.data;

                            if(data.coupons.length == 0 && $("#list .discount").length == 0){
                                $(".tab_group .group.active").addClass('empty');
                            }else if(data.coupons.length == 0){
                                $("#list .more").hide();
                                $(".tab_group .group.active").removeClass('empty');
                            }else{
                                $("#list .more").show();
                                $(".tab_group .group.active").removeClass('empty');
                                for(var i=0;i<data.coupons.length;i++){
                                    getc(data.coupons[i],'no');
                                }
                            }
                        }
                    });

                }
            });
        }

        function getc(data,igGq){
            var span,status="待使用";
            if(data.type==0){
                if(data.is_share){
                    span = '<span>'+data.discount+'</span><span class="pt">元共享券</span>';
                }else{
                    span = '<span class="p">'+data.discount+'</span><span class="pt">元商家专属券</span>';
                }
            }else if(data.type==1){
                if(data.is_share){
                    span = '<span class="p">'+data.rate*10+'</span><span class="pt">折共享券</span>';
                }else{
                    span = '<span class="p">'+data.rate*10+'</span><span class="pt">折专属券</span>';
                }
            }else{
                if(data.is_share){
                    span = '<span class="p">'+data.price+'</span><span class="pt">元抵'+data.discount+'元共享券</span>';
                }else{
                    span = '<span class="p">'+data.price+'</span><span class="pt">元抵'+data.discount+'元专属券</span>';
                }
            }
            if(igGq == 'no'){
                status="已过期";
            }
            $("#list .more").before('\
                <div class="discount '+igGq+'">\
                    <div class="left">\
                        <img src="'+data.img_path+'" alt="">\
                        <p class="status">'+status+'</p>\
                    </div>\
                    <div class="right">\
                        <p class="title">\
                            '+span+'\
                        </p>\
                        <p class="name">'+data.name+'</p>\
                        <p class="tanc">满'+data.min_price+'可用</p>\
                    </div>\
                </div>\
            ');
        }

    });
});