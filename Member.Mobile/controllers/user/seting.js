require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                popup : {
                	content : "爱你！在这里等你哟~",
                	double : true,
                	canle : "取消",
                	confi : "确认退出",
                	isShow : false,
                	canleCb : function(){
                		vm.isShowShadow = false;
                	},
                	confiCb : function(){
                		ygg.delCookie("member_id");
                        ygg.delCookie("mobile");
                        ygg.delCookie("token");
                        ygg.delCookie("area_id");
                        window.open('http://'+window.location.host,"_self");
                	}
                },
                isShowShadow : false
            },
            methods : {
                loginOut : function(){
                	var that = this;
                	this.$set(this.popup,"isShow",true);
                	this.isShowShadow = true;
                }
            },
            components : {
                popup : ygg.template.popup
            }
        }),
        popupEl = document.getElementById("popup");

        if(!ygg.getCookie("token"))window.open('http://'+window.location.host,"_self");

    });
});