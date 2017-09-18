require(['config'],function(){
    require(['axio','vue','main','mock','mock-api'],function (axio,Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                menu : ['全部','待使用','已使用'],
                ind : 0,
                star : new Array(5)
            },
            methods : {
                comm : function(index){
                    for(var i=0;i<this.star.length;i++){
                        i<=index?this.$set(this.star,i,"active"):this.$set(this.star,i,"");
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