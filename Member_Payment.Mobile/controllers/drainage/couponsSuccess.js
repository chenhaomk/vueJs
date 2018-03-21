require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var vm = new vue({
    		el:"#app",
    		data:{
                how: ""
                
    		},
    		methods:{
                Btn:function() {
                    location.href ='https://m.yingougou.com/views/my/myDis.html'
                }
    		},
            components : {

            },

        })
        vm.how = main.getQueryString("amount");
    })
 })   