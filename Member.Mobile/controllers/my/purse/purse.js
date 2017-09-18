require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

        var vm = new Vue({
            el : "#app",
            data : {
                ind : 0
            },
            components : {
                
            },
            methods : {
                
            }
        }),
        member_id = ygg.getCookie("member_id");

        if(!member_id)window.open('http://'+window.location.host,"_self");

        ygg.ajax('/member/getPersonCenterInfo',{
            member_id : member_id
        },function(data){
            data = data.data;

            if(data.balance)vm.$set(vm,'ind',data.balance);
        });

    });
});