require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {

    	// var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // main.post.
        // main.loading(true)
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // 2c92f9245f5bf7b7015f5c69e068001f
        var bid = main.getQueryString("b_id") == null ? main.getSession("b_id") :  main.getQueryString("b_id").indexOf('*') == -1 ? main.getQueryString("b_id"):main.getQueryString("b_id").split('*')[0];
        // var baseURL = "http://119.23.10.30:9000/ygg_dev_201803081529_1.5.2/v1.0/"; //测试服
        var baseURL = "https://api.yingougou.com/v1.1/"
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
                isJk:false
    		},
    		methods:{
                freeCouponBtn:function() {
                    main.setSession('m_id',main.getQueryString("m_id"));
                    var m_id  =  main.getQueryString('m_id')
                    if (m_id==null) {
                        window.location.href = "../../views/newDrainage/couponsSuccess.html"
                    }else {
                        window.location.href = "../../views/newDrainage/couponsFail.html"
                    }
                }
    		},
            components : {
                star:main.template.newStar
            }

    	});
        //判断浏览器
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
        otherLogin()
        function otherLogin() {
        if(browserType() == "weixin") { //微信
            var code = main.getQueryString('code')
            if(code == null) {
                var b_id =  main.getQueryString('b_id');
                var m_id = main.getQueryString('m_id');
                var b_n = main.getQueryString('b_n');
                var a_n = main.getQueryString('a_n');
                var c_n = main.getQueryString('c_n');
                var img = main.getQueryString('img');
                // debugger
                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/freeCoupons.html?b_id="+b_id+"*m_id="+m_id+"*b_n="+b_n+"*a_n="+a_n+"*c_n="+c_n+"*img="+img+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            }else  {
                main.post(baseURL + "passport/thirdWxLogin", {
                    code: code
                },function (res) {
                    if(res.status == 'success') {
                        var obj = {
                            wx_openid:data.data.wx_openid,
                            nick_name:data.data.nick_name,
                            wx_unionid :data.data.wx_unionid
                        }
                        main.post(baseURL + "passport/thirdWxLogin",obj,function (res) {
                            if(res.status == 'success') {//注册过
                                main.post(baseURL+'common/getShareCouponActivity',{ // 判断引流券
                                    business_id:bid
                                },function (res) {
                                    if (res.status == 'success'){
                                        getBusinessDetil();
                                    } else {
                                        var bid = main.getQueryString("b_id");
                                        location.href="https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id="+bid+""
                                    }
                                });
                            }else { //没注册过
                                main.post(baseURL + "common/getRebuyCoupon",{//绑定该商户原缀会员
                                    member_id:member_id,
                                    business_id:b_id
                                },function (data) {

                                });
                            }
                        });
                    }else  {
                        main.prompt(data.msg);
                    }

                });
            }
        }else if( browserType()== "alipay") { //支付宝
            var auth_code  =  main.getQueryString('auth_code')
            if(auth_code == null ) {
                var b_id =  main.getQueryString('b_id');
                var m_id = main.getQueryString('m_id');
                var b_n = main.getQueryString('b_n');
                var a_n = main.getQueryString('a_n');
                var c_n = main.getQueryString('c_n');
                var img = main.getQueryString('img');
                debugger
                location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018030802337414&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/freeCoupons.html?b_id="+b_id+"*m_id="+m_id+"*b_n="+b_n+"*a_n="+a_n+"*c_n="+c_n+"*img="+img+"";
            }else {
                main.post(baseURL + "passport/thirdZfbLoginGetInfoString",{
                    auth_code:auth_code
                },function (res) {
                    if (res.status.success){
                        var obj = {
                            info_string:data.data.info_string,
                            app_id:data.data.app_id
                        }
                        main.post(baseURL + "passport/zfbRegister",obj,function (res) {
                            if (res.status.success) { //注册过
                                main.post(baseURL+'common/getShareCouponActivity',{ // 判断引流券
                                    business_id:bid
                                },function (res) {
                                    if (res.status == 'success'){
                                        getBusinessDetil();
                                    } else {
                                        var bid = main.getQueryString("b_id");
                                        location.href="https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id="+bid+""
                                    }
                                });
                            }else { //没注册过
                                main.post(baseURL + "common/getRebuyCoupon",{//绑定该商户原缀会员
                                    member_id:member_id,
                                    business_id:b_id
                                },function (data) {

                                });
                            }
                        });
                    } else {
                        main.prompt(data.msg);
                    }
                });
            }
        }else { // 其他方式打开
            var bid = main.getQueryString("b_id");
            // window.location.href="https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id="+bid+""
        }
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
                // if(data.coupons.length >0) {
                //     vm.isJk = true
                // }
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