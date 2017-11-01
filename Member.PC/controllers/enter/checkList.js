require(['config'], function () {
    require(['angle'], function () {
        var examine_business_list = [] //待审核的商店列表
        var finish_business_list = []  //已完成的商店列表
        var pending_business_list = [] //待处理的商店列表
        // examine_business_list = testObj
        //获取门店列表 id 为管理员id
        function getMyShopList() { 
            $.fn.getData({
                url: "/business/getAllBusiness",
                result: function (data) {
                    if(data.status == "success") {                        
                        examine_business_list = data.data.examine_business_list
                        finish_business_list = data.data.finish_business_list
                        pending_business_list = data.data.pending_business_list
                        $(".shopList").html(template(pending_business_list,1))
                        $(".status").click(function () {
                            $.fn.setCookie('business_check_id',$(this).attr("business_check_id"));
                            window.location.href = "../../views/enter/apply.html?business_check_id="+$(this).attr("business_check_id")
                        })
                    }
                }
            });
        }
        getMyShopList()
        // $(".shopList").html(template(pending_business_list,1));
        
        $(".shopType ul").on("click","li",function () {
            $(".shopType ul").find("li").removeClass("onChange")
            var index = $(this)
            var str = index.html()
            index.addClass("onChange");
            $(".status").off()
            if(str == "待通过") {
                $(".shopList").html(template(examine_business_list,2))
                $(".status").click(function () {
                    $.fn.setCookie('business_check_id',$(this).attr("business_check_id"));
                    window.location.href = "../../views/enter/apply.html?isbind=1&isAgain=1&isData=1&business_check_id="+$(this).attr("business_check_id")
                })
            }else if(str == "待补充") {
                $(".shopList").html(template(pending_business_list,1))
                $(".status").click(function (e) {
                    if($(this).find("span").html() != "审核中") {
                        $.fn.setCookie('business_check_id',$(this).attr("business_check_id"));
                        window.location.href = "../../views/enter/apply.html?isbind=1&isAgain=1&isData=1&business_check_id="+$(this).attr("business_check_id")
                    }
                })

            }else if (str == "已通过") {
                $(".shopList").html(template(finish_business_list,3))
                $(".status").click(function () {
                    window.location.href = "https://ingo.yingougou.com"
                })
            }
        })
        $(".shopType div").click(function () {
           // window.location.href = "https://ingo.yingougou.com"
           $.fn.setCookie('business_check_id',"");
            event.preventDefault();
            $.fn.yhxy();
        })
        //
        $(".userCheck").find("span").click(function () {
            if($(this).hasClass("active")) {
                $(this).removeClass("active")
                $(".userCheck").find("div").removeClass("active")
            }else {
                $(this).addClass("active")
                $(".userCheck").find("div").addClass("active")
            }
        })
        $(".userCheck").find("div").click (function () {
            if($(this).hasClass("active")) {
                window.location.href = "../../views/enter/apply.html"
            }
        })
        //渲染模板
        function template(arr,status) {
            var str = "<ul>"
            var goLocatio 
            if(status == 1) {
                goLocatio = "立即填写>"
            }else if(status == 2){
                goLocatio = "<span>审核中</span>"
            }else {
                goLocatio = "管理门店>"
            }
            arr.map(function (item,index) {
                if(status == 1) {
                    goLocatio = "立即填写>"
                }else if(status == 2){
                    if(item.state == 3) {
                        goLocatio = "审核失败!重新入驻>"
                    }else {
                        goLocatio = "<span>审核中</span>"
                    }
                    
                }else {
                    goLocatio = "管理门店>"
                }

                var time = new Date(item.create_date)
                var timeStr = time.getFullYear()+"."+(time.getMonth() + 1)+"."+time.getDate()
                var src = (item.inner_imgs.length >0)?item.inner_imgs:"../../assets/images/enter/logo2.png"
                var business_check_id = item.business_check_id?item.business_check_id:''
                str += "<li class='"+((index%2 == 0) ?"addMargin":"")+"'>"+
                    "<div class='shopDetil'>"+
                        " <img src='"+src+"' class='shopImg' />"+
                        "<div><p class='shopName'>"+item.name+"</p><p class='createDate'>创建时间:"+timeStr+"</p>"+
                        "<div class='shopTypes'><p>"+item.industry_name+"</p></div>"+
                        "</div>"+
                    "</div><div class='status' status='"+status+"' business_check_id="+business_check_id+">"+goLocatio+"</div>"
                "</li>"
            })
            str += "</ul>"

            return  str
        }     
    });
});
