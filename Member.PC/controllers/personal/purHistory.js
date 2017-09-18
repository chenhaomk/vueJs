require(['config'],function(){
    require(['angle'],function () {

        var filterData = {
            member_id : $.fn.getCookie("member_id"),
            page : 1,
            size : 10
        };
        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(0)").addClass('active');
            $(".sidebar").load("sidebar.html",function(){
                $("#sidebar .his").addClass('active');
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

        $("table").on('click', '.s_detail', function(event) {
            $.fn.getData({
                url : '/member/getPayRecord',
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
                url : '/member/getPayRecord',
                data : filterData,
                result : function(data){
                    data = data.data;
                    if(data.pay_record_list.pages>1 && cb)cb(data.pay_record_list.pages);

                    if(data.pay_record_list.length != 0){
                        $("table").show();
                        for(var i=0;i<data.pay_record_list.length;i++){
                            $("tbody").append('\
                                <tr>\
                                    <td class="first">\
                                        <div class="shop">\
                                            <img src="'+data.pay_record_list[i].inner_imgs+'" alt="">\
                                            <p>'+data.pay_record_list[i].business_name+'</p>\
                                        </div>\
                                    </td>\
                                    <td>￥'+data.pay_record_list[i].pay_total+'</td>\
                                    <td class="stime">'+$.fn.getd('Y.m.d H:i',data.pay_record_list[i].pay_date/1000)+'</td>\
                                    <td class="btns"><a href="">去评价</a></td>\
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