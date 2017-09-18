require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                val : "checked",
                ss : 0,
                sso : false,
                ckClass : ""
            },
            methods : {
                radio : function(i){
                    this.ss = i;
                },
                apply : function(){
                    var that = this;
                    ygg.ajax('/member/updateProfitType',{
                        member_id : ygg.getCookie("member_id"),
                        profit_type : that.ss
                    },function(data){
                        ygg.prompt("设置成功！");
                        window.open("/views/my/myCard.html","_self");
                    });
                }
            }
        });

    });
});