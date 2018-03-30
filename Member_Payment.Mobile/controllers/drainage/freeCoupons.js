require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	// var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // main.post.
        // main.loading(true)
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // 2c92f9245f5bf7b7015f5c69e068001f
<<<<<<< HEAD
        var bid = main.getQueryString("b_id") == null ? main.getSession("b_id") :  main.getQueryString("b_id").indexOf('*') == -1 ? main.getQueryString("b_id"):main.getQueryString("b_id").split('*')[0];
        // var baseURL = "http://119.23.10.30:9000/ygg_dev_201803081529_1.5.2/v1.0/"; //测试服
        var baseURL = "https://api.yingougou.com/v1.1/"
=======

        var bid = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");

        var baseURL = "http://119.23.10.30:9000/v1.1/"; //测试服
>>>>>>> b39fd8c89a83ecafae6a4ab168e4bc2249ae5b72
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
                amount:'',
                couponId:'',
                member_id:'',
                bid: '',
                login_type:''
            },
    		methods:{
                freeCouponBtn:function() {
                    // this.member_id
                    // this.bid
                    couponId:this.couponId
                    amount:this.amount
                    main.post(baseURL + "common/shareTicket",{ //领引流券
                        member_id:this.member_id,
                        business_id:this.bid,
                        login_type:this.login_type
                    } , function (data) {
                        // console.log(data)
                        if(data.data[9010] != null||data.data[9011] != null||data.data[9014] != null ) { // 没领取过
                            location.href = "../../views/newDrainage/couponsSuccess.html?amount="+amount+"";
                        }else {
                            location.href = "../../views/newDrainage/couponsFail.html"; // 领取过
                        }
                    })

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
            vm.bid = bid
        otherLogin()
        function otherLogin() {
            if(browserType() == "weixin") { //微信
                vm.login_type = 1
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
                            };
                            main.post(baseURL + "passport/thirdWxLogin",obj,function (data) {
                                if(data.status == "error") {
                                    main.prompt(data.msg)
                                }else {
                                    //保存用户登录信息
                                    var member_id = data.data.member_id
                                    main.setCookie("member_id",data.data.member_id);
                                    main.setCookie("mobile",data.data.mobile);
                                    main.setCookie("token",data.data.token);
                                    var bid  = location.search.split('*')[0].split('=')[1];
                                    vm.bid = bid
                                    vm.member_id = member_id
                                    if(data.data.business_id == null || data.data.business_id == undefined) {
                                        main.post(baseURL + "common/getRebuyCoupon",{//绑定该商户原缀会员
                                            member_id:member_id,
                                            business_id:bid
                                        },function (data) {

                                        })
                                    }
                                    main.post(baseURL + "common/getShareCouponActivity",{//判断店铺是否有引流券
                                        business_id:b_id
                                    } , function (data) {
                                        // console.log(data)
                                        if(data.status == "error") {
                                            main.prompt(data.msg)
                                        }else {
                                            if(data.data != unll || data.data != undefined) {//有引流券
                                                vm.amount=data.data.discount //金额
                                                vm.couponId = data.data.coupon_id
                                                // var amount = data.data.discount  //金额
                                                // var couponId = data.data.coupon_id

                                                // main.post(baseURL + "common/shareTicket",{ //领引流券
                                                //     member_id:member_id,
                                                //     login_type:1,
                                                //     couponId:couponId
                                                // } , function (data) {
                                                //     if (data.data.member_id != unll || data.data.member_id != undefined){ // 没领取过
                                                //         location.href = "../../views/newDrainage/couponsSuccess.html?amount="+amount+"";
                                                //     }else {
                                                //         location.href = "../../views/newDrainage/couponsFail.html"; // 领取过
                                                //     }
                                                // })
                                            }else {
                                                location.href="https://m.yingougou.com/views/shop/detail.html?id="+bid+""  //没有引流券跳转到h5详情页
                                            }
                                        }
                                    });
                                }
                            });
                        }else  {
                            main.prompt(data.msg);
                        }
                    });
                }
            }else if( browserType()== "alipay") { //支付宝
                vm.login_type = 2
                var auth_code  =  main.getQueryString('auth_code')
                if(auth_code == null ) {
                    var b_id =  main.getQueryString('b_id');
                    var m_id = main.getQueryString('m_id');
                    var b_n = main.getQueryString('b_n');
                    var a_n = main.getQueryString('a_n');
                    var c_n = main.getQueryString('c_n');
                    var img = main.getQueryString('img');
                    location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018030802337414&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/freeCoupons.html?b_id="+b_id+"*m_id="+m_id+"*b_n="+b_n+"*a_n="+a_n+"*c_n="+c_n+"*img="+img+"";
                }else {
                    main.post(baseURL + "passport/thirdZfbLoginGetInfoString",{
                        auth_code:auth_code
                    },function (res) {
                        if (res.status.success){
                            var zfb_openid = res.data.data.buyer_id;  //获取支付宝openid
                            main.post(baseURL + "passport/zfbRegister", {
                                zfb_openid:zfb_openid,
                                nick_name:''
                            },function (data) {
                                if(data.status == "error") {
                                    main.prompt(data.msg)
                                }else {
                                    //保存用户登录信息
                                    var member_id = data.data.member_id;
                                    main.setCookie("member_id",data.data.member_id);
                                    main.setCookie("mobile",data.data.mobile);
                                    main.setCookie("token",data.data.token);
                                    var bid  = location.search.split('*')[0].split('=')[1];
                                    vm.bid = bid
                                    vm.member_id = member_id
                                    if(data.data.business_id == null || data.data.business_id == undefined) {
                                        main.post(baseURL + "common/getRebuyCoupon",{//绑定该商户原缀会员
                                            member_id:member_id,
                                            business_id:b_id
                                        },function (data) {

                                        })
                                    }
                                    main.post(baseURL + "common/getShareCouponActivity",{//判断店铺是否有引流券
                                        business_id:b_id
                                    } , function (data) {
                                        if(data.status == "error") {
                                            main.prompt(data.msg)
                                        }else {
                                            if(data.data != unll || data.data != undefined) {//有引流券
                                                vm.amount=data.data.discount //金额
                                                vm.couponId = data.data.coupon_id
                                                // var amount = data.data.discount  //金额
                                                // var couponId = data.data.coupon_id
                                                // main.post(baseURL + "common/shareTicket",{ //领引流券
                                                //     member_id:member_id,
                                                //     login_type:2,
                                                //     couponId:couponId
                                                // } , function (data) {
                                                //     if (data.data.member_id != unll || data.data.member_id != undefined){ // 没领取过
                                                //         location.href = "../../views/newDrainage/couponsSuccess.html?amount="+amount+"";
                                                //     }else {
                                                //         location.href = "../../views/newDrainage/couponsFail.html"; // 领取过
                                                //     }
                                                // })
                                            }else {
                                                location.href="https://m.yingougou.com/views/shop/detail.html?id="+bid+""  //没有引流券跳转到h5详情页
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            main.prompt(data.msg);
                        }
                    });
                }
            }else { // 其他方式打开
                vm.login_type = 3
                main.post(baseURL + "common/getShareCouponActivity",{//判断店铺是否有引流券
                    business_id:b_id
                } , function (data) {
                    if(data.status == "error") {
                        main.prompt(data.msg)
                    }else {
                        if(data.data != unll || data.data != undefined) {//有引流券
                            // debugger
                            vm.amount=data.data.discount //金额
                            vm.couponId = data.data.coupon_id
                            // main.post(baseURL + "common/shareTicket",{ //领引流券
                            //     login_type:3,
                            //     member_id:member_id,
                            //     couponId:couponId
                            // } , function (data) {
                            //     if (data.data.member_id != unll || data.data.member_id != undefined){ // 没领取过
                            //         location.href = "../../views/newDrainage/couponsSuccess.html?amount="+amount+"";
                            //     }else {
                            //         location.href = "../../views/newDrainage/couponsFail.html" // 领取过
                            //     }
                            // })
                        }else {
                            // window.location.href="http://m.yingougou.com/views/shop/detail.html?returnUrl=/&id=2c92f9255e519642015e51c89ebe0099"
                            location.href="https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id="+bid+""  //没有引流券跳转到h5详情页
                        }
                    }
                });
            }
        }

        getBusinessDetil();
        main.setSession('m_id',main.getQueryString("m_id"));
        function getBusinessDetil() {
            var bid = '';

            if (browserType()== "alipay" || browserType() == "weixin"){
                bid = location.search.split('*')[0].split('=')[1];
            } else {
                bid= main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");
            }

            // console.log(bid)
            main.post(baseURL+'business/getBusinessDetails',{
                business_id:bid,
            },function (res) {
                // console.log(res)
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
                    if(item.type != 3) { //团购
                        vm.arr.push(item)
                    }
                });
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
