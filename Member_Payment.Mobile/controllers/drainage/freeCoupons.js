require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {

    	// var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // main.post.
        // main.loading(true)
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // 2c92f9245f5bf7b7015f5c69e068001f
        var bid = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id")
        var baseURL = "http://119.23.10.30:9000/ygg_dev_201803081529_1.5.2/v1.0/"//测试服
    	var vm = new vue({
    		el:"#app",
    		data:{
                star : "",
                img:"",
                b_n:"",
                all:"22",
                arr:[],
                add:"",
                telNum:"",
                
    		},
    		methods:{
                btn:function() {
                    // window.location.href = "../../payment/views/newDrainage/freeCoupons.html"
                    window.location.href = "../../views/newDrainage/drainageLogin.html"
                }
    		},
            components : {
                star:main.template.newStar,
            },

    	});
        //判断是否在微信浏览器
        function browserType() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return "weixin"
            } else if(ua.match(/Alipay/i)=="alipay"){
                return "alipay";
            }else {
                return "other"
            }
        }

        if(browserType() == "weixin") {
            var b_id = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");
            var url="https://m.yingougou.com/payment/views/newDrainage/freeCoupons.html?b_id="+b_id+"";
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri="+url+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }else if( browserType()== "alipay") {
            var b_id = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");
            var url="https://m.yingougou.com/payment/views/newDrainage/freeCoupons.html?b_id="+b_id+"";
            location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018030802337414&scope=auth_base&redirect_uri="+url+"";

        }else {


        }



        if(browserType() =="weixin") {//微信浏览器内
            var code = main.getQueryString("code");
            if (code != null && code != "") {
                main.setSession("code");
                main.post(baseURL + "passport/thirdWxLogin", {
                    code: code
                },function (data) {
                    console.log(data)
                });
            }
        }else if(browserType() =="alipay") {//支付宝扫码进入
            var code = main.getQueryString("auth_code");
            if (code != null && code != "") {

            }
        }else {//普通浏览器扫码进入

        }




        getBusinessDetil();
        main.setSession('m_id',main.getQueryString("m_id"));
        function getBusinessDetil() {
            main.post(baseURL+'business/getBusinessDetails',{
                business_id:bid
            },function (res) {
                data = res.data.data;
                vm.b_n = data.business_details.name;
                vm.telNum = data.business_details.phone;
                vm.add = data.business_details.address;
                main.setSession("b_n",data.business_details.name);
                main.setSession("img",data.business_details.logo);
                main.setSession("b_id",data.business_details.business_id);
                vm.img = data.business_details.logo;
                vm.$set(vm,"star",data.business_details.star);
                data.coupons.map(function (item,index) {
                    // debugger
                    if(item.type != 3) { //团购
                        vm.arr.push(item)
                    }
                });


                // console.log(data)
                              if(vm.arr.length == 0) {
                    // window.location.href = "../../payment/views/newDrainage/newDrainagefalt.html"
                    // window.location.href = "../../views/newDrainage/drainageNewUser.html"
                }
                // vm.arr = vm.arr.concat(vm.arr)
                // vm.arr = vm.arr.concat(vm.arr)
                if(vm.arr.length >3) {
                    var arr = []
                    arr = vm.arr.splice(3,vm.arr.length-3)
                }

                //  fn()
            })
        }

        function fn() {
            main.post(baseURL+'common/getShareCouponActivity',{
            },function (res) {
                // debugger
                main.loading(false)
                if(res.data.data.coupon_id) {
                    if(res.data.data.count == 0) {
                        window.location.href = "../../views/newDrainage/drainageNewUser.html"
                    }
                }else {
                    window.location.href = "../../views/newDrainage/drainageNewUser.html"
                }
            })
        }
    })
 });