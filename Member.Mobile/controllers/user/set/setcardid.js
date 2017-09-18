require(['config'],function(){
    require(['axio','vue','mock','mock-api','main'],function (axio,Vue,Mock,mockApi,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                
            },
            methods : {
                getData : function(a){
                    console.dir(a);
                }
            },
            components : {
                uploader : ygg.template.uploader
            }
        });

    });
});