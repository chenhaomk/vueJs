require(['config'],function(){
    require(["imgup",'angle'],function (OSS) {

        var imgPohto;

        if(!$.fn.getCookie("member_id")){
            window.open('http://'+window.location.host,"_self");
        }

        $("#getYzm").getYzm({
            valDom : $("#oldPhone"),
            sms_type : "0004",
            errorDom : $("#prompt2")
        });
        $("#getYzm2").getYzm({
            valDom : $("#newPhone"),
            sms_type : "0004",
            errorDom : $("#prompt2")
        });

        $("#updatePhone").click(function(event) {
            event.preventDefault(); 
            window.event.returnValue = false;

            if($("#yzm1").val().length == 0 || $("#newPhone").val().length == 0 || $("#yzm2").val().length == 0){
                $("#prompt2").text("手机号或验证码不能为空！");
                return;
            }

            $.fn.getData({
                url : "/member/updateMobile",
                data : {
                    old_mobile : $("#userinfo").attr("data-tel"),
                    old_verification_code : $("#yzm1").val(),
                    new_mobile : $("#newPhone").val(),
                    new_verification_code : $("#yzm2").val()
                },
                result : function(data){
                    if(data.status == "error"){
                        $("#prompt2").text(data.msg);
                    }else if(data.status == "success"){
                        $.fn.prompt({
                            t : "修改成功！",
                            ct : false,
                            rt : "确定",
                            noc : true
                        });
                    }
                }
            });
        });

        $("#updatePwd").click(function(event) {
            event.preventDefault(); 
            window.event.returnValue = false;

            if($("#pwd").val().length == 0 || $("#rpwd").val().length == 0){
                $("#prompt3").text("密码和确认密码不能为空！");
                return;
            }

            if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z`~!@#$%^&*()_+=-]{8,16}$/.test($("#pwd").val()))){
                $("#prompt3").text("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
                return;
            }

            if($("#pwd").val().length != $("#pwd").val().length){
                $("#prompt3").text("两次密码不一致！");
                return;
            }

            $.fn.getData({
                url : "/member/updatePwd",
                data : {
                    member_id : $.fn.getCookie("member_id"),
                    password : $("#pwd").val()
                },
                result : function(data){
                    if(data.status == "error"){
                        $("#prompt3").text(data.msg);
                    }else if(data.status == "success"){
                        $.fn.prompt({
                            t : "修改成功！",
                            ct : false,
                            rt : "确定",
                            noc : true
                        });
                    }
                }
            });
        });

        $("#updateXz").click(function(event) {
            event.preventDefault(); 
            window.event.returnValue = false;
            var st;
            if($("#r1").prop("checked")){
                st = 0;
            }else{
                st = 1;
            }
            $.fn.getData({
                url : "/member/updateMemberCouponSetting",
                data : {
                    member_id : $.fn.getCookie("member_id"),
                    select_setting : st
                },
                result : function(data){
                    $.fn.prompt({
                        t : "修改成功！",
                        ct : false,
                        rt : "确定",
                        noc : true
                    });
                }
            });
        });

        $.fn.loadHeadFooter(function(){
            $(".nav>a:eq(0)").addClass('active');
            $(".sidebar").load("sidebar.html");
            $("#userPhoto").attr("src",$("#userinfo .info img").attr("src"));
            var phone = $("#userinfo").attr("data-tel");
            $("#oldPhone").text($("#userinfo").attr("data-tel"));
            phone = phone.substring(0,3) + "****" + phone.substring(7);
            $("#phone").val(phone);
            if($("#userinfo").attr("data-ss") == 0){
                $("#r1").prop("checked",true);
            }else{
                $("#r2").prop("checked",true);
            }

            $("#nickName").val($("#userinfo").attr("data-nk"));
            $.fn.getClient(OSS);

            $("#saveNk").click(function(event) {
                var t = $("#nickName").val();
                if(t === $("#userinfo").attr("data-nk") && !imgPohto)return;
                if(t.length == 0){
                    $(this).prev().text("昵称不能为空！");
                    return;
                }
                if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z`~!@#$%^&*()_+=-]{8,16}$/.test(t))){
                    
                }
                $.fn.getData({
                    url : '/member/updateMemberNickName',
                    data : {
                        member_id : $.fn.getCookie("member_id"),
                        nick_name : t
                    },
                    result : function(data){
                        data = data.data;

                        $("#sidebar .name,#userinfo .info p").text(t);
                        $("#userinfo").attr("data-nk",t);

                        if(imgPohto){

                            $.fn.uploadImg([imgPohto],function(d){
                                $.fn.getData({
                                    url : '/member/updateMemberHeadPortrait',
                                    data : {
                                        member_id : $.fn.getCookie("member_id"),
                                        head_portrait : d[0]
                                    },
                                    result : function(data){
                                        data = data.data;

                                        $("#userPhoto,#userinfo .info img,#sidebar .photo").attr("src",data.head_portrait);

                                        $.fn.prompt({
                                            t : "修改成功！",
                                            ct : null,
                                            rt : "确定",
                                            noc : true
                                        });
                                    }
                                });
                            }); 
                        }else{
                            $.fn.prompt({
                                t : "修改成功！",
                                ct : null,
                                rt : "确定",
                                noc : true
                            });
                        }
                    }
                });
            });

            $(".up_photo").click(function(event) {
                $("#photoFile").focus().click();
            });
            $("#photoFile").change(function(event) {
                imgPohto = event.target.files[0];
                var imgObjPreview=document.getElementById("preview");
                if(this.files &&this.files[0]){
                    $("#userPhoto").attr("src",window.URL.createObjectURL(this.files[0]));
                    //imgPohto = window.URL.createObjectURL(this.files[0]);
                }else{
                this.select();
                var imgSrc = document.selection.createRange().text;
                var localImagId = document.getElementById("userPhoto");
                localImagId.style.width = "102px";
                localImagId.style.height = "102px";
                try{
                    localImagId.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                }
                catch(e)
                {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
                }
                imgObjPreview.style.display = 'none';
                document.selection.empty();
                }
                return true;
            });
        });

        $(".tab").tab();

        $("#update_phone").click(function(event) {
            $(".update_phone").show().siblings('.cont').hide();
        });

        $("#update_pwd").click(function(event) {
            $(".update_pwd").show().siblings('.cont').hide();
        });

        $(".return,.return_set").click(function(event) {
            $(".cont").show().siblings('.update_pwd').hide().siblings('.update_phone').hide();
        });

    });
});