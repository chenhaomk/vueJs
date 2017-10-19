require(['config'], function () {
    require(['angle'], function () {
        var brand_id = "";
        var business_check_id = $.fn.getCookie("business_check_id"),
            status = $.fn.getQueryString("s");
        if (!business_check_id) window.open('login.html', "_self");

        if (status == "3") {
            var text = $.fn.getQueryString("t");
            $(".error.status").show().siblings(".status").hide();
            $(".error .cont").html("抱歉！您的审核被驳回，驳回原因：<br>" + decodeURI(text));
        } else if (status == "2") {
            $(".success.status").show().siblings(".status").hide();
        }


        //逻辑
        //检查品牌绑定
        $.fn.getData({
            url: "/business/getBindBrandInfoById",
            data: {
                business_check_id: business_check_id
            },
            async: false,
            result: function (data) {
                data = data.data;
                if (data.brand_id == null)
                    $("#brindStatus").html("绑定品牌");
                else {
                    $("#brindStatus").html("解绑品牌");
                    brand_id = data.brand_id;
                }
            }
        });

        $("#brindStatus").click(function () {
            if ($("#brindStatus").html() == "绑定品牌")
                window.open("apply.html?isbind=1&bindBrand=1", "_self");
            else {
                //解绑
                if (brand_id == null || brand_id <= 0)
                    $(".prompt").text("数据出错，请稍后再试");

                $.fn.getData({
                    url: "/business/bindBrandById",
                    data: {
                        business_check_id: business_check_id,
                        brand_id: null
                    },
                    result: function (data) {
                        if (data.status == "error") {
                            $(".prompt").text(data.msg);
                        } else if (data.status == "success") {
                            data = data.data;
                            // $(".prompt").text("解绑成功");
                            $("#brindStatus").html("绑定品牌");
                        }
                    }
                });

            }
        })
    });
});