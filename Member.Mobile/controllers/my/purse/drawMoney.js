require(['config'],function(){
    require(['axio','vue','main','mock','mock-api'],function (axio,Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                isShow : false,
                readOnly : "no"
            },
            methods : {
                showPo : function(){
                    this.isShow = true;
                },
                closePo : function(){
                    this.isShow = false;
                },
                isClick : function(e){
                    if(e.target.value > 0){
                        this.$set(this,"readOnly","");
                    }else{
                        this.$set(this,"readOnly","no");
                    }
                }
            }
        });

        ygg.all([
            axio.post('http://shop.cn',{})
        ],function(shop){
            vm.list = shop.data.list;
        });


    });
});