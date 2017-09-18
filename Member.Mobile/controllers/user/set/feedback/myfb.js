require(['config'],function(){
    require(['axio','vue','main','mock','mock-api'],function (axio,Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                list : []
            },
            methods : {
                getData : function(a){
                    
                }
            },
            components : {
                feedback : ygg.template.feedback
            }
        });

        ygg.all([
            axio.post('http://shop.cn',{})
        ],function(shop){
            vm.list = shop.data.list;
        });

    });
});