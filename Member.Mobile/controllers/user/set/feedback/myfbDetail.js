require(['config'],function(){
    require(['axio','vue','main','mock','mock-api'],function (axio,Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                list : ['1','1','1']
            },
            methods : {
                getData : function(a){
                    
                }
            },
            components : {
                feedback : ygg.template.feedback
            }
        });

    });
});