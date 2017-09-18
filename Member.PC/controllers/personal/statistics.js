require(['config'],function(){
    require(['angle'],function () {

        var startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).valueOf(),
            endDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).valueOf(),
            filterData = {
                member_id : $.fn.getCookie("member_id"),
                detail_type : 0,
                page : 1,
                size : 10
            },
            profitCountData = {
                member_id : $.fn.getCookie("member_id"),
                start_date : startDate,
                end_date : endDate
            },
            spendCountData = profitCountData;

        $(".start_date").val($.fn.getd("Y.m.d",startDate/1000));
        $(".end_date").val($.fn.getd("Y.m.d",endDate/1000));
        if(!filterData.member_id){
            window.open('http://'+window.location.host,"_self");
        }
        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(0)").addClass('active');
            $(".sidebar").load("sidebar.html",function(){
                $("#sidebar .pur").addClass('active');
            });

            $.fn.getData({
                url : '/wallet/getBalance',
                data : {
                    member_id : filterData.member_id
                },
                result : function(data){
                    data = data.data;
                    if(!data.balance){
                        data.balance=0;
                    }
                    $(".money span").html(data.balance);

                }
            });

            var isOne = true;
            $(".tab").tab(function(index){
                if(index == 1 && isOne){
                    getStat();
                    getStat2();
                }
            });

            $("#stt1").manhuaDate({
                dMonth : new Date().getMonth(),
                result : function(d){
                    d = d.split(".");
                    profitCountData.start_date = new Date(d[0],d[1]-1,d[2]).valueOf();
                    getp();
                }
            });

            $("#ett1").manhuaDate({
                dMonth : new Date().getMonth()+1,
                result : function(d){
                    d = d.split(".");
                    var ed = new Date(d[0],d[1]-1,d[2]).valueOf();

                    if(profitCountData.start_date > ed){
                        $.fn.prompt({
                            t : "截止日期不能比开始日期小！",
                            ct : false,
                            rt : "确定",
                            noc : true,
                            w : 310
                        });
                        return;
                    }
                    profitCountData.end_date = ed;
                    getp();
                }
            });

            $("#stt2").manhuaDate({
                dMonth : new Date().getMonth(),
                result : function(d){
                    d = d.split(".");
                    spendCountData.start_date = new Date(d[0],d[1]-1,d[2]).valueOf();
                    getp();
                }
            });

            $("#ett2").manhuaDate({
                dMonth : new Date().getMonth()+1,
                result : function(d){
                    d = d.split(".");
                    var ed = new Date(d[0],d[1]-1,d[2]).valueOf();

                    if(spendCountData.start_date > ed){
                        $.fn.prompt({
                            t : "截止日期不能比开始日期小！",
                            ct : false,
                            rt : "确定",
                            noc : true
                        });
                        return;
                    }
                    spendCountData.end_date = ed;
                    getp();
                }
            });

            getp();
        });

        $(".balance .btns").on('click', 'a', function(event) {
            event.preventDefault();
            if($(this).hasClass('active'))return;
            $(this).addClass('active').siblings().removeClass('active');
            var index = $(this).index();
            index == 0?filterData.detail_type=0:index==1?filterData.detail_type=1:filterData.detail_type=2;
            getp();
        });

        $(".btn a").click(function(event) {
            $(".balance_detail").show().siblings('.cont').hide();
        });

        function getp(){
            getList(function(pages){
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
        }

        function getStat(){
            $.fn.getData({
                url : '/wallet/getMemberProfitCount',
                data : profitCountData,
                result : function(data){
                    data = data.data;

                    $(".income .total").html("<span>累计分润：</span>"+data.total_profit);
                    if(ie8){
                        $(".frdIe8 p:eq(0) b").text(data.select_total_profit);
                        $(".frdIe8 p:eq(1) b").text(data.develop_profit);
                        $(".frdIe8 p:eq(2) b").text(data.recommend_profit);
                        $(".frdIe8 p:eq(3) b").text(data.rebate_profit);
                    }else{
                        $("#frd .t").html("<span>分润总额：</span>"+data.select_total_profit);
                        $("#frd .g1").html("发展商户分润<span>"+data.develop_profit+"</span>");
                        $("#frd .g2").html("推荐用户分润<span>"+data.recommend_profit+"</span>");
                        $("#frd .g3").html("消费返利<span>"+data.rebate_profit+"</span>");
                        $("#frd_res").text(data.select_total_profit);
                    }

                    setBt($(".income .chart canvas"),{
                        data : [{
                            color : '#85e09a',
                            deg : data.develop_profit
                        },{
                            color : '#78a9fa',
                            deg : data.recommend_profit
                        },{
                            color : '#ff7d7d',
                            deg : data.rebate_profit
                        }],
                        sum : data.select_total_profit
                    });
                }
            });
        }

        function getStat2(){
            $.fn.getData({
                url : '/wallet/getMemberSpendCount',
                data : spendCountData,
                result : function(data){
                    data = data.data;

                    $(".cost .total").html("<span>累计消费：</span>"+data.total_amount);
                    if(ie8){
                        $(".xfie8 p:eq(0) b").text(data.select_total_amount);
                        $(".xfie8 p:eq(1) b").text(data.develop_profit);
                        $(".xfie8 p:eq(2) b").text(data.recommend_profit);
                    }else{
                        $("#xf .t").html("<span>消费总额：</span>"+data.select_total_amount);
                        $("#xf .g4").html("线上消费<span>"+data.spend_amount+"</span>");
                        $("#xf .g5").html("线下购物<span>"+data.coupon_amount+"</span>");
                        $("#xf_res").text(data.select_total_amount);
                    }

                    setBt($(".cost .chart canvas"),{
                        data : [{
                            color : '#ffc21f',
                            deg : data.spend_amount
                        },{
                            color : '#ff7d5f',
                            deg : data.coupon_amount
                        }],
                        sum : data.select_total_amount
                    });

                }
            });
        }

        function setBt(dom,obj){
            if(ie8){
                $(".chart.ie8").each(function() {
                    var that = $(this),total = 0;
                    $(this).children().each(function(index, el) {
                        if(index == 0){
                            total = $(this).find('b').width();
                        }else{
                            var bfb = parseInt(that.siblings('.info').children().eq(index).children().text()) / parseInt(that.siblings('.chart').children(".res").text());
                            $(this).find('b').stop().animate({width: bfb*total},500);
                        }
                    });
                });
            }else{
                dom.getSector(obj);
            }
        }

        function getList(cb){
            $("#list tbody tr").hide().remove();
            $.fn.getData({
                url : '/wallet/getAccountDetail',
                data : filterData,
                result : function(data){
                    data = data.data;
                    if(data.pages>1 && cb)cb(data.pages);

                    if(data.detail_list.length != 0){
                        $("table#list").show();
                        for(var i=0;i<data.detail_list.length;i++){
                            var ly;
                            switch(data.detail_list[i].type){
                                case 4:
                                ly = "提现";
                                break;
                                case 5:
                                ly = "消费返利";
                                break;
                                case 6:
                                ly = "发展商户分润";
                                break;
                                case 7:
                                ly = "推荐用户奖励";
                                break;
                            }
                            $("#list tbody").append('\
                                <tr>\
                                    <td class="f">'+ly+'</p></td>\
                                    <td>￥'+data.detail_list[i].amount+'</td>\
                                    <td>'+$.fn.getd('Y.m.d H:i',data.detail_list[i].create_date/1000)+'</td>\
                                    <td>'+data.detail_list[i].cur_balance+'</td>\
                                </tr>\
                            ');
                        }
                    }else{
                        $("table#list").show().addClass('empty');
                    }

                }
            });
        }

    });
});