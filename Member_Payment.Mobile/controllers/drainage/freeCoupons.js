require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var bid = main.getQueryString("b_id") == null ? main.getSession("b_id") :main.getQueryString("b_id")
        
        if(location.href.indexOf("m_id") != -1 && location.href.indexOf("b_id") != -1 ) {
            main.setSession('share_mid',main.getQueryString("m_id"));
            main.setSession('b_id',main.getQueryString("b_id"));
            main.setSession('b_n',main.getQueryString("b_n"));
        }
        var share_mid = main.getQueryString("m_id")?main.getQueryString("m_id"):main.getSession('share_mid');//分享用户id
        // var baseURL = "https://api.yingougou.com/v1.1/"
        var baseURL = "https://paytest.yingougou.com/v1.2/" //测试回调
        // var baseURL = "http://119.23.10.30:9000/v1.2/" //
        
        var amount
        //判断浏览器
        function browserType() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return "weixin"
            } else if(ua.match(/AlipayClient/i) =="alipayclient"){
                return "alipay";
            }else {
                return "other"
            }
        }
        var bty = browserType()
        if(bty != 'weixin' && bty != 'alipay') {
            window.location.href = 'https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id='+bid
        }
        // window.location.href = 'https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id='+bid
    	var vm = new vue({
    		el:"#app",
    		data:{
                star : "",
                img:"",
                b_n:"",
                all:"",
                arr:[],
                add:"",
                telNum:"",
                amount:'',
                couponId:'',
                member_id:'',
                bid: '',
                login_type:'',
                hotBus:false,
                hotBusArr:[],
                how:'',
            },
    		methods:{
                freeCouponBtn:function() {
                    if(bty == "weixin" && location.href.indexOf("code") == -1) { //微信用户拒绝授权
                        location.href = "../../views/newDrainage/freeCouponsDefeat.html" 
                        return
                    }
                    var login_type
                    if(bty == 'weixin') {
                        login_type = 1
                    }else if(bty == 'alipay') {
                        login_type = 2 
                    }else {
                        login_type = 3
                    }
                    main.post(baseURL + "common/shareTicket",{ //领引流券
                        member_id:share_mid,//分享用户id
                        business_id:bid,
                        login_type:login_type
                    } , function (data) {
                        data = data.data
                        if(data.code != 200 || data == null) {
                            // main.prompt(data.msg);
                            location.href = "../../views/newDrainage/couponsFail.html";
                            return
                        }else {
                            if(data.data[1001]) {
                                main.prompt(data.data[1001]);
                                return
                            }else if(data.data[9009] != null || data.data[9013] != null || data.data[9015] != null ||data.data[9012] != null || data.data[9016] != null || data.data[9017] != null) {
                                location.href = "../../views/newDrainage/couponsFail.html"; // 领取过
                            }else {
                                location.href = "../../views/newDrainage/couponsSuccess.html?amount="+this.how+"";
                            }
                        }
                    })

                }
    		},
            components : {
                star:main.template.newStar
            }

    	});
        main.post("common/getShareCouponActivity",{
            // member_id:member_id,
            business_id:bid
        },function (data) {
            data = data.data
            if(data.status == 'error') {
                main.prompt(data.msg);
            }else if(data.status == 'success') {
                if(data.data.coupon_id) {//有引流券
                    if (data.data.type == 0) {
                        vm.how = data.data.discount+"";
                        if(vm.how.indexOf(".") == -1) {
                            vm.how =  data.data.discount+".00";
                        }else {
                            vm.how =  data.data.discount;
                        }
                    }else if (data.data.type == 1) {
                        vm.how = data.data.rate * 10 + "折";
                    }
                    if((data.data.min_price+"").indexOf(".") ==-1) {
                        vm.all = "满" +data.data.min_price+ ".00可用";
                    }else {
                        vm.all = "满" +data.data.min_price+ "可用";
                    }
                    main.setSession("how", vm.how );
                    main.setSession("all", vm.all );
                    if(bty == 'weixin') {
                        if(location.href.indexOf("code") == -1) {
                            location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/ShareTest/views/newDrainage/freeCoupons.html?b_id="+bid+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";//测试
                            // location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/share/views/newDrainage/freeCoupons.html?b_id="+bid+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"; //正式 
                        }else {//授权登录
                            var code = main.getQueryString("code");
                            main.post("passport/getWxUnionId", {//获取微信unionId
                                code: code,
                                wx_type:0,//0是公众号,1是开放平台
                            },function (data) {
                                data = data.data
                                if(data.status == 'error') {
                                    main.prompt(data.msg);
                                }else if(data.status == 'success') {
                                    var obj = {
                                        wx_unionid:data.data.unionid,
                                        nick_name : data.data.nick_name,
                                        openid : data.data.openid
                                    }
                                    main.post('passport/thirdWxLogin',obj,function(data){//登录
                                        data = data.data
                                        if(data.status == "error"){
                                            main.prompt(data.msg)
                                        }else if(data.status == "success") {
                                            
                                            var member_id = data.data.member_id
                                            main.setCookie("member_id",data.data.member_id);
                                            main.setCookie("mobile",data.data.mobile);
                                            main.setCookie("token",data.data.token);
                                            if(data.data.business_id == '' || data.data.business_id == undefined) {
                                                main.post(baseURL + "member/bindBusiness",{//绑定该商户原缀会员
                                                    member_id:member_id,
                                                    business_id:b_id
                                                },function (data) {
                                                    console.log('绑定原缀')
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }else if(bty == 'alipay') {
                        if(location.href.indexOf("auth_code") == -1) {
                            // location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/share/views/newDrainage/freeCoupons.html?b_id="+bid //正式
                            location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/ShareTest/views/newDrainage/freeCoupons.html?b_id="+bid //测试
                        }else {
                            var code = main.getQueryString("auth_code");
                            main.post("pay/getBuyerId", {
                                code: code
                            }, function (res) {
                                if (res.data.code != 200) {
                                    main.prompt(res.msg);
                                    return;
                                }
                                zfb_openid = res.data.data
                                main.post( "passport/zfbRegister",{
                                    zfb_openid:zfb_openid,
                                    nick_name:''
                                } , function (data) {//如果该用户没注册就注册，注册过就返回用户详情
                                    data = data.data
                                    if(data.status == "error") {
                                        main.prompt(data.msg)
                                    }else {
                                        //保存用户登录信息
                                        var member_id = data.data.member_id
                                        main.setCookie("member_id",data.data.member_id);
                                        main.setCookie("mobile",data.data.mobile);
                                        main.setCookie("token",data.data.token);
                                        if(data.data.business_id == '' || data.data.business_id == undefined) {
                                            main.post("member/bindBusiness",{//绑定该商户原缀会员
                                                member_id:member_id,
                                                business_id:bid
                                            },function (data) {
                                                console.log('绑定原缀')
                                            })
                                        }
                                    }
                                })    
                            })
                        }
                    }
                    getBusinessDetil();
                    
                }else {
                    window.location.href = 'https://m.yingougou.com/views/shop/detail.html?returnUrl=/&id='+bid
                }
            }
        })
        function getBusinessDetil() { //获取店铺详情
            // if (bty == "alipay" || bty  == "weixin"){
            //     bid = location.search.split('*')[0].split('=')[1];
            // } else {
            //     bid= main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");
            // }

            main.post(baseURL+'business/getBusinessDetails',{
                business_id:bid,
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
                    if(index < 3) {//显示前三张券
                        vm.arr.push(item)
                    }else {
                        return
                    }
                });
                if(vm.arr.length == 0) { ////显示定位点热门店铺
                    var citysearch = new AMap.CitySearch();
                    //自动获取用户IP，返回当前城市
                    citysearch.getLocalCity(function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.city && result.bounds) {
                                var cityinfo = result.city;
                                var citybounds = result.bounds;
                                main.post('/home/getCouponHomeScreen', {
                                    area_id: result.adcode,
                                    member_id: '',
                                    page:1,
                                    size:10
                                }, function (data) {
                                    data = data.data.data
                                    vm.hotBus = true
                                    data.hot_business.map(function (item,index) {
                                        if(index < 3 ) {
                                            vm.hotBusArr.push(item)
                                        }else {
                                            return
                                        }
                                    })
                                })
                            }
                        } else {
                            main.prompt('定位失败');
                        }
                    });
                }
            })
        }
    })
 });
