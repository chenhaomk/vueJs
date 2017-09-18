require(['config'],function(){
    require(['axio','vue','mock','mock-api','main'],function (axio,Vue,Mock,mockApi,ygg) {

    	ygg.ajax('http://discount.detail.cn',{},function(data){
    		console.dir(data);
    		new Vue({
	        	el : "#app",
	        	data : {
	        		money : [1,10],
	        		detail : data.data.list[0]
	        	}
	        });
    	});

    });
});