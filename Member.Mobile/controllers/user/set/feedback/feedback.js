require(['config'],function(){
    require(['vue','main','imgup'],function (Vue,ygg,OSS) {

    	var vm = new Vue({
            el : "#app",
            data : {
                content : "",
                imgs : [],
                names : []
            },
            methods : {
                getData : function(a){
                    this.$set(this,'imgs',a);
                    su = false;
                },
                send : function(){
                    ygg.loading(true);
                    if(isSub)return;
                    var that = this;
                    if(that.imgs.length == 0 && that.content.length == 0){
                        ygg.prompt("请您说点什么或上传图片！");
                        return;
                    }
                    if(su){
                        submit();
                        return;
                    }
                    ygg.uploadImg(that.imgs,function(names){
                        su = true;
                        that.names = names;
                        submit();
                    });
                }
            },
            components : {
                uploader : ygg.template.uploader2
            }
        }),su = false,
        member_id = ygg.getCookie("member_id"),
        isSub = false;
        if(!member_id)window.open("/index.html","_self");

        ygg.getClient(OSS);

        function submit(){
            isSub = true;
            ygg.ajax("/member/addMemberFeedback",{
                member_id : member_id,
                content : vm.content,
                imgs : vm.names
            },function(d){
                ygg.loading(false);
            });
        }

    });
});