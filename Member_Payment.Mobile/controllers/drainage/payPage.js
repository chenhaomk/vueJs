require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var b_id = location.search.split("&")[0].split("=")[1]
        var userId,bty,weixin_openid,wx_unionid,nick_name,zfb_openid

        var weixin_pay_data = {} //微信创建订单参数
        if(location.search.indexOf("userId") != -1) {
            userId  = location.search.split("&")[1].split("=")[1]
        }
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; 
        // if(isAndroid) {}
        var busDteObj = {} //ch-use:获取商家详情请求参数
        window.addEventListener('load', function() {
          FastClick.attach(document.body);
        }, false);
        var imgurl = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%3A", ":");
        if (imgurl.indexOf("https") < 0)
            imgurl = "https://img.yingougou.com/" + imgurl;
        if (main.getQueryString("img") != null && main.getSession("img") == null)
            main.setSession("img", "https://img.yingougou.com/" + decodeURI(main.getSession("img")));

        main.setSession("a_n", main.getQueryString("a_n") == null ? main.getSession("a_n") : main.getQueryString("a_n"));
        main.setSession("c_n", main.getQueryString("c_n") == null ? main.getSession("c_n") : main.getQueryString("c_n"));

        var baseURL = "https://api.yingougou.com/v1.1/"
        // var baseURL = "http://apis.yingegou.com/v1.1/"//测试
        //判断是否在微信浏览器
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
        bty = browserType()
        if(bty == "weixin") {
            if (location.href.indexOf("code") == -1) { 
                var b_id = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id")
                main.newPrompt("页面跳转中...",30000);
                location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                
            }else {//微信环境授权后，用户强制登录
                var code = main.getQueryString("code");
                main.post(baseURL + "pay/getOpenId", {
                    code: code
                },function (res) {
                    if (res.data.code != 200) {
                        main.prompt("扫码出现异常！");
                        return;
                    }
                    //---获取用户注册、登录参数
                    weixin_openid = res.data.data.openid;
                    wx_unionid  = res.data.data.unionid 
                    nick_name = res.data.data.nickname 
                     //---获取创建订单参数
                    weixin_pay_data = res.data.data
                    weixin_pay_data.open_id = weixin_openid
                    weixin_pay_data.pay_way = 'wechat_csb' //支付方式
                    main.post(baseURL + "passport/thirdWxLogin",{
                        wx_openid:weixin_openid,
                        wx_unionid:wx_unionid,
                        nick_name:nick_name
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
                                main.post(baseURL + "member/bindBusiness",{//绑定该商户原缀会员
                                    member_id:member_id,
                                    business_id:b_id
                                },function (data) {
                                    console.log(data)
                                })
                            }
                        }
                    })    
                })
            }
        }else if( bty== "alipay") {
            if(location.href.indexOf("auth_code") == -1){
                var b_id = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id")
                main.newPrompt("页面跳转中...",30000);
                location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id 
            }else {//支付宝扫码，强制用户登录
                var code = main.getQueryString("auth_code");
                main.post(baseURL + "pay/getBuyerId", {
                    code: code
                }, function (res) {
                    if (res.data.code != 200) {
                        main.prompt("扫码出现异常");
                        return;
                    }
                    zfb_openid = res.data.data
                    main.post(baseURL + "passport/zfbRegister",{
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
                                main.post(baseURL + "member/bindBusiness",{//绑定该商户原缀会员
                                    member_id:member_id,
                                    business_id:b_id
                                },function (data) {
                                    
                                })
                            }
                        }
                    })    
                })
            }
        }else {

        }
        main.loading(true)
    	var vm = new vue({
    		el:"#app",
    		data:{
    			isActive: false,
                payNum: "",
                payKind: 0,
                merchant_name: "",
                isDis:false, //ch-use:用于判断是否有不参与优惠的金额
                payType:"nothing",//ch-use:优惠方式（满减，打折，优惠券，或者没有任何优惠）
                discountShow:false,//是否显示折扣
                discount:"0.9",//用于显示的折扣
                discountS:0,//用于计算的折扣
                most_discount:25,//折扣最高优惠
                full_reduceShow:false,//是否有满减 
                full_rule:"100",//买单满减条件，每满100减10元最高40元，条件是100元
                full_reduce:"20",//买单满减金额，每满100减10元最高40元，优惠金额是10元
                most_reduce:"60",//买单满减金额，每满100减10元最高40元，最高金额是40元
                picked:"",
                total:0,
                subMon:0,//计算后的优惠金额
                deDisPr:"",//为不参与折扣金额
                showYhq:false,//判断用户是否登录过，没有就不显示可用优惠券
                groupWarp:false,//用于显示购买团购券时的界面
                isAndroid:isAndroid,//判断是否是安卓手机
    		},
    		methods:{
                back:function () {
                    // main.delCookie("business_id")
                    // main.delCookie("most_discount"); 
                    // main.delCookie("discount"); 
                    // main.delCookie("shopName");
                    // main.delCookie("full_rule");
                    // main.delCookie("full_reduce"); 
                    // main.delCookie("most_reduce");  
                    window.history.go(-1);
                },
                checkPrice:function (event) { //ch-use:是否有不参与优惠的金额
                    event.preventDefault();
                    if(event.target.getAttribute("src").indexOf("ic_select1") != -1) {//未选中
                        this.isDis = true;
                        event.target.setAttribute("src","../../assets/images/newDarinage/ic_selected1_xxh.png");
                    }else {
                        this.deDisPr = 0
                        this.isDis = false;
                        event.target.setAttribute("src","../../assets/images/newDarinage/ic_select1@3x.png");
                    }
                    this.countFn();
                },
                mj:function (event) {//ch-use:选择满减
                    event.preventDefault();
                    if(event.target.getAttribute("src").indexOf("ic_select@3x") != -1) {//未选中
                        this.payType = "mj" //设置支付方式
                        this.$refs.dz.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        this.$refs.yhq.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        event.target.setAttribute("src","../../assets/images/newDarinage/ic_selected@3x.png");
                    }else { 
                        this.payType = "nothing"  
                        this.total =  this.picked                       
                        event.target.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                    }
                    this.countFn()
                },
                dz:function (event) {//ch-use:打折
                    event.preventDefault();
                    if(event.target.getAttribute("src").indexOf("ic_select@3x") != -1) {//未选中
                        this.payType = "dz"
                        this.$refs.mj.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        this.$refs.yhq.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        event.target.setAttribute("src","../../assets/images/newDarinage/ic_selected@3x.png");
                    }else {
                        this.payType = "nothing"
                        this.total =  this.picked                     
                        event.target.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                    }
                    this.countFn()
                },
                yhq:function (event) {//ch-use:优惠券
                    event.preventDefault();                    
                        // if(event.target.getAttribute("src").indexOf("ic_select@3x") != -1) {//未选中
                        //     this.payType = "yhq"
                        //     this.$refs.dz.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        //     this.$refs.mj.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        //     event.target.setAttribute("src","../../assets/images/newDarinage/ic_selected@3x.png");
                        // }else {
                        //     this.payType = "nothing"                        
                        //     event.target.setAttribute("src","../../assets/images/newDarinage/ic_select@3x.png");
                        // }
                    if(this.picked > 0 ) {
                        main.setSession("parOrderTotal", this.picked);//用于选券页面计算优惠金额，消费总额
                        if(this.deDisPr >= 0 ) {
                            main.setSession("deDisPr", this.deDisPr);//用于选券页面计算优惠金额，不参与优惠金额
                        }
                        var str = window.location.search
                        window.location.href = "../../views/newDrainage/payChangeTic.html"+str;
                        // if(main.getSession("token") != null || main.getSession("token") != undefined || main.getSession("token") != "") {//ch-use;判断用户是否登录过
                        //     location.href = "../../views/payment/payChangeTic.html";
                        // }else {
                        //     window.location.href = "../../views/user/login.html";
                        // }
                        
                        
                    }else {
                        main.prompt("请先输入有效金额");
                    }
                },
                disBefore:function (event) {//原总金额
                    if(event.target.value.length > 0) {
                        this.$refs.inputO.style.fontSize = "0.4rem"
                    }else {
                        this.$refs.inputO.style.fontSize = "0.3rem"
                    }
                    // event.target.value = event.target.value.replace(/[^\d.]/g,'')
                    event.target.value = charAtNum(event.target.value)
                    // event.target.=value.replace(/[^\d.]/g,'')
                    this.countFn()
                },
                noDis:function (event) { //输入未参与折扣金额
                    if(event.target.value.length > 0) {
                        this.$refs.inputT.style.fontSize = "0.4rem"
                    }else {
                        this.$refs.inputT.style.fontSize = "0.3rem"
                    }
                    event.target.value = charAtNum(event.target.value)
                    this.countFn()
                },
                countFn:function () { //计算实际支付金额函数
                    if(this.isDis == false && this.deDisPr == 0) { //在没有参与优惠金额时
                        this.picked = charAtNum(this.picked)
                        if(this.payType == "dz") {
                            this.subMon = (this.picked *(1-this.discountS)).toFixed(2)
                            if(this.most_discount < this.subMon) {//是否超过最高优惠
                                this.subMon = this.most_discount
                            }                            
                        }else if(this.payType == "mj") {
                            if(parseInt(this.picked/this.full_rule) > parseInt(this.most_reduce/this.full_reduce) ) { //是否达到满减最高优惠
                                this.subMon = this.most_reduce //优惠金额为最高优惠
                            }else {
                                this.subMon = parseInt(this.picked/this.full_rule)*this.full_reduce 
                            }
                        }else if(this.payType == "yhq") {

                        }else {
                            this.subMon = 0
                        }
                    } else {//有不参与优惠金额时
                        this.deDisPr = charAtNum(this.deDisPr)
                        if(this.payType == "dz") {//打折优惠
                            if(this.deDisPr >= this.picked) { //不参与优惠大于总消费时，该情况可能是用户误输入,则按不参与消费金额为0处理
                                this.subMon = (this.picked*(1-this.discountS)).toFixed(2)
                                if(this.most_discount < this.subMon) {//是否超过最高优惠
                                    this.subMon = this.most_discount
                                }  
                            }else {//不参与消费金额不为0时
                                this.subMon = ((this.picked*(1-this.discountS)).toFixed(2) - this.deDisPr*(1-Number(this.discountS))).toFixed(2)
                                if(this.most_discount < this.subMon) {//是否超过最高优惠
                                    this.subMon = this.most_discount
                                }   
                            }
                        }else if(this.payType == "mj") {//满减优惠
                            if(this.picked-this.deDisPr >= this.full_rule) {//当总消费去不参与优惠金额的差大于优惠规则金额时
                                if(parseInt((this.picked-this.deDisPr)/this.full_rule) > parseInt(this.most_reduce/this.full_reduce) ) {
                                    this.subMon = this.most_reduce
                                }else {
                                    this.subMon = parseInt((this.picked-this.deDisPr)/this.full_rule)*this.full_reduce
                                }
                                
                            }else {//小于则按不满足优惠条件处理
                                this.subMon = 0
                            }
                        }else if(this.payType == "yhq") {

                        }else {
                            this.subMon = 0
                        }
                    }
                    this.total = this.picked - this.subMon

                },
                changeTic:function () {
                    if(this.picked > 0 ) {
                        main.setSession("parOrderTotal", this.picked);//用于选券页面计算优惠金额，消费总额
                        if(this.deDisPr > 0 ) {
                            main.setSession("deDisPr", this.deDisPr);//用于选券页面计算优惠金额，不参与优惠金额
                        }
                        var str = window.location.search
                        location.href = "../../views/newDrainage/payChangeTic.html"+str;
                        // if(main.getSession("token") != null && main.getSession("token") != undefined && main.getSession("token") != "null") {//ch-use;判断用户是否登录过
                        //     location.href = "../../views/payment/payChangeTic.html";
                        // }else {
                        //     window.location.href = "../../views/user/login.html";
                        // }
                        
                        
                    }else {
                        main.prompt("请先输入有效金额");
                    }
                    
                    
                },
                checkPay: function (event) {
                    event.preventDefault();
                    var data = {}
                    if(bty == 'weixin') {
                        data = weixin_pay_data
                        data.member_id = main.getCookie('member_id')
                    }else if(bty = 'alipay') {
                        data.member_id = main.getCookie('member_id')
                    }
                    data.amount = this.picked;
                    main.setSession("b_id",main.getSession("b_id"))
                    data.business_id = busDteObj.business_id
                    main.setSession("amount", this.total);
                    main.setSession("business_id", data.business_id);
                    
                    if(this.payType == "dz") {
                        data.type = 1
                        data.no_sale_amount = this.deDisPr ==""?0:this.deDisPr
                        data.coupon_id
                    }else if(this.payType == "mj") {
                        data.type = 2
                        data.no_sale_amount = this.deDisPr ==""?0:this.deDisPr
                    }else {
                        if (main.getSession("c_id") != null)
                            data.coupon_id = main.getSession("c_id");
                        if (main.getSession("c_a_id") != null)
                            data.coupon_activity_id = main.getSession("c_a_id");
                    }
                    if(this.total > 0) {
                        payFn(browserType,data,baseURL,ck)
                    }else {
                        main.prompt("请先输入有效金额");
                    }
                    
                    function ck() {
                        // location.href = "../../views/newDrainage/freeCoupons.html"+window.location.search;
                        location.href ='https://m.yingougou.com/views/my/purHistory.html' //用户登录过h5，支付成功后就跳往消费记录页面
                    }
                
                }
    		}
    	})
        vm.isAndroid = isAndroid ;
        // //ch-use:用来判断是从哪个页面返回的支付界面，可能是买团购券，可能是在选取用户的优惠券后
        // if(main.getSession("disBefore") != null ) { //main.getSession("disBefore")在选取优惠券页面保存，则从选取优惠券页面返回
        //     vm.picked = main.getSession("parOrderTotal") //填充表单
        //     if((main.getSession("deDisPr") != null || main.getSession("deDisPr") != undefined || main.getSession("deDisPr") != "") && main.getSession("deDisPr") > 0) {
        //         vm.isDis = true;
        //         vm.deDisPr = main.getSession("deDisPr");
        //         vm.$refs.ck.setAttribute("src","../../assets/images/newDarinage/ic_selected1_xxh.png");
        //     }
        //     vm.$refs.yhq.setAttribute("src","../../assets/images/newDarinage/ic_selected@3x.png");
        //     vm.subMon = vm.picked - main.getSession("disBefore")
        //     vm.total = main.getSession("disBefore")
        //     vm.payType = "yhq"
        // }
        //ch-use:用于判断用户是否登录过
        if( userId != "null" && userId != undefined && userId != "undefined") {//ch-use;判断用户是否登录过
            vm.showYhq = true
        }else {
            vm.showYhq = false
        }
        if(b_id != undefined || b_id != null ) {
            busDteObj.business_id = b_id
        }else {
            busDteObj.business_id = main.getSession("b_id")?main.getSession("b_id"):main.getQueryString("b_id") 
        }
        
        if(main.getSession("b_id") && main.getSession("b_id") != "null") {//ch-use:扫码支付时从index.js获取session
            busDteObj.business_id = main.getSession("b_id")
        }else if(main.getQueryString("id") && main.getQueryString("id") != "null") {
            busDteObj.business_id = main.getQueryString("id")
        }else if(main.getCookie('business_id') && main.getCookie('business_id') != "null") {//ch-use:从商店详情去买单时获取cookie
            busDteObj.business_id = main.getCookie('business_id')
        }
        if(userId != undefined || userId != null) {
            busDteObj.member_id = userId
        }

        //判断是否去过选择优惠券页面
        if(main.getSession("parOrderTotal")) {
            vm.picked = main.getSession("parOrderTotal")
            //判断用户是否选择过优惠券
            if(main.getSession("disBefore")) {
                vm.payType = "yhq"
                vm.subMon = vm.picked - main.getSession("disBefore");
                vm.$refs.yhq.setAttribute("src","../../assets/images/newDarinage/ic_selected@3x.png");
            }else {
                vm.subMon = 0
            }
            if(main.getSession("deDisPr")) {
                vm.deDisPr = main.getSession("deDisPr")
                vm.isDis = true
                vm.$refs.ck.setAttribute("src","../../assets/images/newDarinage/ic_selected1_xxh.png");
            }
            vm.total = vm.picked-vm.subMon
        }
        main.post(baseURL +"business/getBusinessDetails",busDteObj , function (res) {//获取商家详情      
            vm.merchant_name = res.data.data.business_details.name //商家名
            main.setSession("b_n",vm.merchant_name)//用于引流页面获取商家名
            data = res.data.data.business_details
            if(data.sale_status  == true && data.discount != null) {
                vm.discountShow = true
                vm.discount = data.discount*10
                vm.discountS = data.discount
                if(data.most_discount == -1) {//商家最高优惠没有限制时
                    vm.most_discount = 10000000 
                }else {
                    vm.most_discount = data.most_discount
                }
                
            }
            
            if(data.reduce_status  == true ) {
                vm.full_reduceShow = true
                vm.full_rule  = data.full_rule 
                vm.full_reduce = data.full_reduce
                
                if(data.most_reduce == -1) {//商家最高优惠没有限制时
                    vm.most_reduce  = 10000000
                }else {
                    vm.most_reduce  = data.most_reduce 
                }
            }
            main.loading(false)
        })

        function charAtNum(num) {//ch-use:限制输入框输入类型
            num = num+"" 
            num = num.replace(/[^\d.]/g,"")
            num = num.replace(/\.{2,}/g,"."); 
            num = num.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
            num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); 
            if(num.indexOf(".")< 0 && num !=""){
                num= parseFloat(num); 
            }
            return num
        }
        
        function payFn(browserType,data,baseURL,callBack) {//browserType为判断浏览器函数，data为支付接口参数对象,baseURL,callBack支付后的回调
            if(browserType() =="weixin") {//微信浏览器内
                main.post(baseURL + "pay/create_pay",weixin_pay_data , function (res) {
                    if (res.data.code == 200) {
                        var orderId = res.data.data.order_id//获取店铺id，用来获取获取店铺复购券信息
                        //调用官方公众号接口
                        var configObj = {
                            debug:false,
                            appId:res.data.data.appId,
                            timestamp:res.data.data.timeStamp,
                            nonceStr:res.data.data.nonceStr,
                            signature:res.data.data.paySign,
                            jsApiList:["chooseWXPay"]
                        }
                        wx.config(configObj);
                        wx.ready(function () {
                            console.log("微信js接口已准备")
                        })
                        wx.chooseWXPay({
                            timestamp:res.data.data.timeStamp,
                            nonceStr:res.data.data.nonceStr,
                            package:res.data.data.package,
                            signType:res.data.data.signType,
                            paySign:res.data.data.paySign,
                            success:function (res) {
                                main.setSession("amount", data.amount);
                                main.setSession("business_id", main.getQueryString("b_id"));
                                if(vm.payType == 'yhq') {//用户登录过，执行回调跳转到消费记录页面
                                    callBack()
                                }else {
                                    main.post(baseURL + "common/getRebuyCoupon",{//获取复购券详情，判断店铺是否有复购券
                                        order_id:orderId,
                                        business_id:b_id
                                    } , function (data) {
                                        data = data.data
                                        if(data.status == "error") {
                                            main.prompt(data.msg)
                                        }else {
                                            if(data.data.coupon  ) {//有复购券
                                                var amount = data.data.coupon.discount //折扣金额
                                                var coupon_activity_id = data.data.coupon.coupon_id  //复购券id
                                                main.post(baseURL + "common/receiveRebuyCoupon",{//领取复购券
                                                    member_id:main.getCookie('member_id'),
                                                    coupon_activity_id:coupon_activity_id
                                                } , function (data) {
                                                    location.href = "../../views/newDrainage/couponsSuccess.html?amount="+amount+"";
                                                })
                                            }else {
                                                location.href ='https://m.yingougou.com/views/my/purHistory.html' //没有就跳转h5的消费记录页
                                            } 
                                        }
                                    });

                                }
                            }
                        })
                    }
                });
            }else if(browserType() =="alipay") {//支付宝扫码进入
                data.buyer_id = zfb_openid
                data.pay_way ='alipay_csb'
                main.post(baseURL + "pay/create_pay",data , function (res) {
                    if (res.data.code == 200) {
                        //调用官方公众号接口
                        var orderId = res.data.data.order_id//获取店铺id，用来获取获取店铺复购券信息
                        var tradeNo = res.data.data.tradeNO;
                        main.setSession("tradeNO", tradeNo);
                        AlipayJSBridge.call("tradePay",{
                            tradeNO: main.getSession("tradeNO")
                        }, function(result){
                            if(result.resultCode == 9000) {
                                main.setSession("amount", data.amount);
                                main.setSession("business_id", main.getQueryString("b_id"));
                                if(vm.payType == 'yhq') {
                                    callBack()
                                }else {
                                    main.post(baseURL + "common/getRebuyCoupon",{//获取复购券详情，判断店铺是否有复购券
                                        order_id:orderId,
                                        business_id:b_id
                                    } , function (data) {
                                        data = data.data
                                        if(data.status == "error") {
                                            main.prompt(data.msg)
                                        }else {
                                            if(data.data.coupon  ) {//有复购券
                                                var amount = data.data.coupon.discount //折扣金额
                                                var coupon_activity_id = data.data.coupon.coupon_id  //复购券id
                                                main.post(baseURL + "common/receiveRebuyCoupon",{//领取复购券
                                                    member_id:main.getCookie('member_id'),
                                                    coupon_activity_id:coupon_activity_id
                                                } , function (data) {
                                                    location.href = "../../views/newDrainage/couponsSuccess.html?amount="+amount+"";
                                                })
                                            }else {
                                                location.href ='https://m.yingougou.com/views/my/purHistory.html' //没有就跳转h5的消费记录页
                                            } 
                                        }
                                    });
                                }
                            }else {
                                alert("支付异常!")
                            }
                        });
                        
                    }
                });

            }else {//普通浏览器扫码进入
                data.pay_way = 'alipay_web';
                main.post( baseURL+"pay/create_pay",
                        data,
                    function (res) {    
                        console.log(res)       
                        if (res.code == 2001) {
                            // location.href = "../../views/newDrainage/freeCoupons.html";
                            // main.clearSessionItem("sn");
                            return;
                        }
                        if (res.status == 200) {
                            var data = res.data.data;
                            if (res == null) {
                                main.prompt("支付异常");
                                return;
                            }
                            main.setSession("amount", data.amount);
                            main.setSession("business_id", main.getQueryString("b_id"));
                            // debugger
                            main.setSession("sn", data.orderNo);
                            // main.setSession("paySuccObj", paySuccObj);//传值支付成功的引流页面
                            var url = data.credential.alipay_web.orderInfo;
                            location.href = url

                        }
                });
            }
        }
    })
 })   