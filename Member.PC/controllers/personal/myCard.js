require(['config'],function(){
    require(['angle','zclip','qrcode'],function () {

        $.fn.loadHeadFooter(function(){
            if(!$.fn.getCookie("member_id"))window.open('/',"_self");

            if(!meInfo){
                $.fn.getData({
                    url : '/member/getMemberExpanderInfo',
                    data : {
                        member_id : $.fn.getCookie("member_id")
                    },
                    result : function(data){
                        if(data.status == "success"){
                            window.meInfo = data.data;
                        }else{
                            
                        }
                    }
                });
            }
            
            $("#sha").text(meInfo.share_url);
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 80,
                height : 80
            });

            function makeCode () {
                qrcode.makeCode(meInfo.share_url);
            }
            makeCode();
            $("#copy").click(function(event) {
                SelectText("sha");
                document.execCommand("Copy");
                $.fn.prompt({
                    t : "复制成功，赶快分享给好友吧！",
                    ct : false,
                    rt : "确定",
                    noc : true,
                    w : 330
                });
            });

            /*$(".my_card .myc .left .eem p a").zclip({
                path: "/plugins/jquery/ZeroClipboard.swf",
                copy: function(){
                    return meInfo.share_url;
                },
                beforeCopy:function(){
                    $(this).css("color","orange");
                },
                afterCopy:function(){
                    
                }
            });*/

            function SelectText(element) {  
                var text = document.getElementById(element);  
                if ($.support.msie) {  
                    var range = document.body.createTextRange();  
                    range.moveToElementText(text);  
                    range.select();  
                } else if ($.support.mozilla || $.support.opera) {  
                    var selection = window.getSelection();  
                    var range = document.createRange();  
                    range.selectNodeContents(text);  
                    selection.removeAllRanges();  
                    selection.addRange(range);  
                } else if ($.support.safari) {  
                    var selection = window.getSelection();  
                    selection.setBaseAndExtent(text, 0, text, 1);  
                }  else{
                    var selection = window.getSelection();  
                    var range = document.createRange();  
                    range.selectNodeContents(text);  
                    selection.removeAllRanges();  
                    selection.addRange(range);  
                }
            }  
            
            if(meInfo.profit_type == 0){
                $(".myc .right").append('\
                    <p>您选择的奖励为：永久返佣 <span>5%</span></p>\
                    <p>可得奖励为：<span>'+meInfo.amount+'</span> 元</p>\
                    <p>奖励方式：登录APP去余额提现</p>\
                    <a id="gz">发展商家奖励规则</a>\
                ')
            }else{
                $(".myc .right").append('\
                    <p>您选择的奖励为：单笔奖励 <span>'+meInfo.profit_ratio_fixed+'</span>元</p>\
                    <p>可得奖励为：<span>'+meInfo.amount+'</span> 元</p>\
                    <p>奖励方式：已有<span>'+meInfo.business_count+'</span>家商家达标，每月15日到账</p>\
                    <a id="gz">发展商家奖励规则</a>\
                ')
            }

            $("#gz").click(function(event) {
                $(".popup,.shadow").fadeIn();
            });
            $(".popup_mc .close").click(function(event) {
                $(".popup,.shadow").fadeOut();
            });
        });

    });
});