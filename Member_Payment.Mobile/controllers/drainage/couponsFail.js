require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	// var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // main.post.
        // main.loading(true)
        var baseURL = "https://api.yingougou.com/v1.1/"
        // 2c92f9245f5bf7b7015f5c69e068001f
        var bid = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id")
        // var baseURL = "http://119.23.10.30:9000/ygg_dev_201803081529_1.5.2/v1.0/"//测试服
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
                    // alert(222)
                    main.setSession('m_id',main.getQueryString("m_id"));
                    window.location.href="https://m.yingougou.com/views/my/myDis.html"
                }
    		},
            components : {
                star:main.template.newStar,
            },

    	})


    })
 })   