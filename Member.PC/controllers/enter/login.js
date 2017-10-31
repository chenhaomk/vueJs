require(['config'], function () {
    require(['angle'], function () {

        $("#getYzm").getYzm({
            valDom: $("#tel"),
            sms_type: "0010",
            errorDom: $(".prompt")
        });

        $("#login").click(function (event) {
            var event = event||window.event;
            if (event.preventDefault) {
                    event.preventDefault(); 
                } else {
                    event.returnValue = false;
                }
            
            // event.preventDefault();
            // window.event.returnValue = false;

            if ($(this).hasClass('no')) return;

            if ($("#tel").val().length == 0 || $("#yzm").val().length == 0) {
                $(".prompt").text("手机或验证码不能为空！");
                return;
            }

            if (!(/^1[34578]\d{9}$/.test($("#tel").val()))) {
                $(".prompt").text("请输入正确的手机号！");
                return;
            }

            $.fn.getData({
                url: "/business/passport/fastLogin",
                data: {
                    mobile: $("#tel").val(),
                    verification_code: $("#yzm").val()
                },
                result: function (data) {
                    
                    var status = data.status;
                    if (status == "error") {
                        $(".prompt").text(data.msg);
                    } else if (status == "success") {
                        data = data.data;
                        $.fn.setCookie("admin_id", data.admin_id);
                        window.location.href = "../../views/enter/checkList.html"
                        // if (data.state == 0) {
                        //     window.open("apply.html", "_self");
                        // } else {
                            // var url = "checkList.html?s=" + data.type;
                            // if (data.state == 3) url = "status.html?s=" + data.state + "&t=" + encodeURI(encodeURI(data.reason));
                            // window.open(url, "_self");
                        // }
                    }
                }
            });

        });

    });
});
