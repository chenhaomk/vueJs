require(['config'],function(){
    require(['axio','vue','main','mock','mock-api'],function (axio,Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                menu : ['全部','待使用','已使用'],
                ind : 0,
                list : []
            },
            methods : {
                menuSwitch : function(index){
                    this.ind = index;
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