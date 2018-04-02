require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var vm = new vue({
    		el:"#app",
    		data:{
                how: main.getSession("how"),
                b_n:main.getSession("b_n")
    		},
    		methods:{
                Btn:function() {
                    location.href ='https://m.yingougou.com/views/my/myDis.html'
                },
                showMsg :function () {
                    var msg = main.getSession("all")
                    main.prompt(msg);
                }
    		},
            components : {

            },

        })
        // vm.how = main.getQueryString("amount");
    })
 })