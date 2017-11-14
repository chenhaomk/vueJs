require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	// var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // main.post.
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // 2c92f9245f5bf7b7015f5c69e068001f
        var baseURL = "http://apis.yingegou.com/v1.0/"//测试服
    	var vm = new vue({
    		el:"#app",
    		data:{
                star : "",
                img:"",
                b_n:"测试",
                all:"22"
    		},
    		methods:{

    		},
            components : {
                star:main.template.star,
            },

    	})
        getBusinessDetil()
        function getBusinessDetil() {
            main.post(baseURL+'business/getBusinessDetails',{
                business_id:"2c92f9245f5bf7b7015f5c69e068001f"
            },function (res) {
                console.log(res)
                data = res.data.data;
                vm.$set(vm,"star",data.business_details.star);
                
            })
        }
    })
 })   