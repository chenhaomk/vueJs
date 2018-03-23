require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var vm = new vue({
    		el:"#app",
    		data:{
                b_n: decodeURI(main.getQueryString("b_n") == null ? main.getSession("b_n") : main.getQueryString("b_n")),
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