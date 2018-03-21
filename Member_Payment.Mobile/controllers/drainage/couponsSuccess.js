require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var vm = new vue({
    		el:"#app",
    		data:{
                b_n:"",
                all:"22",
                arr:[],
                add:"",
                telNum:"",
                how: ""
            },
    		methods:{
                checkBtn:function() {
                    main.setSession('m_id',main.getQueryString("m_id"));
                    window.location.href="https://m.yingougou.com/views/my/myDis.html"
                }
    		},
            components : {

            },

        })
        vm.how = main.getQueryString("amount");
    })
 })   