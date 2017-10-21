require(['config'],function(){
    require(['vue','main','qrcode'],function (Vue,ygg) {
        var vm = new Vue({
            el : "#app",
            data : {
                meInfo : {},
                sso : false
            },
            methods : {
                
            }
        }),
        member_id = ygg.getCookie("member_id");
        if(!member_id)window.open("/","_self");
        ygg.loading(true);

        ygg.ajax('/member/getMemberExpanderInfo',{
            member_id : member_id
        },function(data){
            data = data.data;
            ygg.loading(false);
            vm.$set(vm,"meInfo",data);
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 80,
                height : 80
            });
            function makeCode () {
                qrcode.makeCode(data.share_url);
            }
            makeCode();
        });

    });
});