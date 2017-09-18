require(['config'],function(){
    require(['axio','vue','main','mock','mock-api'],function (axio,Vue,ygg) {

        var vm = new Vue({
            el : "#app",
            data : {
                menu : ['全部明细','收入','支出'],
                ind : 0,
                list : []
            },
            methods : {
                menuSwitch : function(index){
                    this.ind = index;
                },
                getData : function(a){
                    console.dir(a);
                }
            },
            components : {
                balance : ygg.template.balance
            }
        });

        ygg.all([
            axio.post('http://shop.cn',{})
        ],function(shop){
            vm.list = shop.data.list;
        });


    });
});