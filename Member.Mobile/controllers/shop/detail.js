require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {
        /*
        *1.6引流（改）---开始
        * */
        //判断浏览器
        var bid
        if(location.href.indexOf("code") == -1 && location.href.indexOf("auth_code") == -1) {
            bid = ygg.getQueryString("id") == null ? ygg.getSession("b_id") :ygg.getQueryString("id")
        }else {
            bid = window.location.search.split('&')[0].split('*')[1].split('=')[1]
        }
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
        if(ygg.getSession('snsapi')) {//引流过来才授权
            if(bty == 'weixin') {
                if(location.href.indexOf("code") == -1) {
                    location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/views/shop/detail.html?returnUrl=/*id="+bid+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"; 
                }else {//授权登录
                    var code = ygg.getQueryString("code");
                    ygg.ajax("passport/getWxUnionId", {//获取微信unionId
                        code: code,
                        wx_type:0,//0是公众号,1是开放平台
                    },function (data) {
                        // data = data.data
                        console.log(data)
                        if(data.status == 'error') {
                            ygg.prompt(data.msg);
                        }else if(data.status == 'success') {
                            var obj = {
                                wx_unionid:data.data.unionid,
                                nick_name : data.data.nick_name,
                                wx_web_openid : data.data.openid
                            }
                            ygg.ajax('passport/thirdWxLogin',obj,function(data){//登录
                                // data = data.data
                                console.log(data)
                                if(data.status == "error"){
                                    ygg.prompt(data.msg)
                                }else if(data.status == "success") {

                                    var member_id = data.data.member_id
                                    ygg.setCookie("member_id",data.data.member_id);
                                    ygg.setCookie("mobile",data.data.mobile);
                                    ygg.setCookie("token",data.data.token);
                                    if(data.data.business_id == '' || data.data.business_id == undefined) {
                                        ygg.ajax("member/bindBusiness",{//绑定该商户原缀会员
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
                    location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/views/shop/detail.html?returnUrl=/*id="+bid
                }else {
                    var code = ygg.getQueryString("auth_code");
                    ygg.ajax("pay/getBuyerId", {
                        code: code
                    }, function (res) {
                        if (res.data.code != 200) {
                            ygg.prompt(res.msg);
                            return;
                        }
                        zfb_openid = res.data.data
                        ygg.ajax( "passport/zfbRegister",{
                            zfb_openid:zfb_openid,
                            nick_name:''
                        } , function (data) {//如果该用户没注册就注册，注册过就返回用户详情
                            data = data.data
                            if(data.status == "error") {
                                ygg.prompt(data.msg)
                            }else {
                                //保存用户登录信息
                                var member_id = data.data.member_id
                                ygg.setCookie("member_id",data.data.member_id);
                                ygg.setCookie("mobile",data.data.mobile);
                                ygg.setCookie("token",data.data.token);
                                if(data.data.business_id == '' || data.data.business_id == undefined) {
                                    ygg.ajax("member/bindBusiness",{//绑定该商户原缀会员
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
        }
        /*
        *1.6引流（改）---结束
        * */

        Vue.component('anchored-heading', {
            template: '<>',
            props: {
                level:{
                    type: Number,
                    required: true
                }
            }
        })
        var vm = new Vue({
            el : "#app",
            data : {
                shop : {},
                coupons : [],//优惠券
                comments : [],
                groupdis:[], //团购券
                disIsShow1 : 2,
                disIsShow2:2,
                moreIsShow1 : true,
                moreIsShow2:true,
                businessId : "",
                returnUrl : ygg.getQueryString("returnUrl"),
                comIsShow : "",
                comment_list : [],
                discountPay:[],//优惠买单
                willShow:true,//优惠买点显示
                discountShow:true,//是否有打折
                full_reduceShow:true,//是否有满减
                discount:"",
                most_discount:"",
                full_rule:"",
                full_reduce:"",
                most_reduce :"",
                followed: true,
                changeImg:"../../assets/images/shop/ic_collect_xxh.png",

            },
            components : {
                dis:ygg.template.discount,
                gis:ygg.template.groupdis,
                star : ygg.template.star,
                comment : ygg.template.comment
            },
            methods : {
                // 点击收藏1.6.2
                getCollection: function () {
                    // ygg.loading(true);
                    if (!ygg.getCookie("member_id")) window.open("/views/user/login.html", "_self");
                    ygg.ajax('/member/collectBusiness', {
                        business_id:business_id,
                        member_id: ygg.getCookie("member_id")
                    }, function (data) {
                        if (data.data.is_collectable) {
                            vm.$set(vm,"changeImg","../../assets/images/shop/ic_collect_pre_xxh.png");
                        } else {
                            vm.$set(vm,"changeImg","../../assets/images/shop/ic_collect_xxh.png");
                        }
                    });
                },
                viewMore1 : function(){
                    if(this.disIsShow1 >= this.coupons.length){
                        this.disIsShow1 = this.coupons.length;
                        this.moreIsShow1 = false;
                    }else{
                        this.disIsShow1+=5;
                        if(this.disIsShow1 >= this.coupons.length){
                            this.disIsShow1 = this.coupons.length;
                            this.moreIsShow1 = false;
                        }
                    }
                },
                viewMore2 : function(){
                    if(this.disIsShow2 >= this.groupdis.length){
                        this.disIsShow2 = this.groupdis.length;
                        this.moreIsShow2 = false;
                    }else{
                        this.disIsShow2+=5;
                        if(this.disIsShow2 >= this.groupdis.length){
                            this.disIsShow2 = this.groupdis.length;
                            this.moreIsShow2 = false;
                        }
                    }
                },
                moreComment: function(){
                    ygg.loading(true);
                    this.comIsShow = "show";
                    var that = this;
                    ygg.ajax('/business/getComments',{
                        business_id : that.shop.business_id,
                        page : 1,
                        size : 100
                    },function(data){
                        data = data.data;
                        ygg.loading(false);
                        vm.$set(vm,"comment_list",data.comments);
                    });
                },
                pay:function (event) {//优惠买单跳转
                    // if(event.currentTarget.getAttribute("data") == 1) {//折扣买单
                    //     // window.location.href = "https://m.yingougou.com/payment/views/newDrainage/payPage.html" //结算页
                    //     ygg.setCookie('discount',vm.discount);
                    //     ygg.setCookie('most_discount',vm.most_discount); 
                    // }else { //满减买单
                    //     // window.location.href = "https://m.yingougou.com/payment/views/newDrainage/payPage.html" //结算页
                    //     ygg.setCookie('full_rule',vm.full_rule);
                    //     ygg.setCookie('full_reduce',vm.full_reduce); 
                    //     ygg.setCookie('most_reduce',vm.most_reduce);  
                    // }
                    if(ygg.getCookie('member_id') != null || ygg.getCookie('member_id') != undefined || ygg.getCookie('member_id') != "") {
                        window.location.href = "https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+ygg.getQueryString("id")+"&userId="+ygg.getCookie('member_id')+"&tk="+ygg.getCookie('token') //本地跳转
                    }else {
                        window.location.href = "https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+ygg.getQueryString("id")
                    }
                    
                }
            }
        })
        var business_id = bid;
        ygg.setCookie('business_id',business_id)
        if(location.href.indexOf("code") == -1 && location.href.indexOf("auth_code") == -1) {
            returnUrl = ygg.getQueryString("returnUrl");
        }else {
            returnUrl = ygg.getQueryString("returnUrl").split('*')[0]
        }
        
        if(!business_id || !returnUrl)window.open("/","_self");
        if(returnUrl == 'index')returnUrl='http://'+window.location.host;

        vm.$set(vm,'businessId',business_id);
        vm.$set(vm,'returnUrl',returnUrl);
        
        ygg.ajax('/business/getBusinessDetails',{
            business_id : business_id,
            member_id : ygg.getCookie('member_id')
        },function(data){
            data = data.data;
            if(data.is_collectable){
                vm.$set(vm,"changeImg","../../assets/images/shop/ic_collect_pre_xxh.png");
            }else{
                vm.$set(vm,"changeImg","../../assets/images/shop/ic_collect_xxh.png");
            }
            vm.$set(vm,"shop",data.business_details);
            data.coupons.map(function (item,index) {
                if(item.type == 3) { //团购
                    vm.groupdis.push(item)
                }else {//优惠券
                    vm.coupons.push(item)
                }
            })
            vm.$set(vm,"groupdis",vm.groupdis);
            vm.$set(vm,"coupons",vm.coupons);//渲染优惠券
            vm.$set(vm,"comments",data.comments);
            ygg.setCookie('shopName',data.business_details.name)//保存商家名称

            // if((data.sale_status == null || data.sale_status == undefined) && (data.reduce_status == null || data.reduce_status == undefined) ) {
            //     vm.willShow = false
            // }else {
            //     if(data.sale_status  == null || data.sale_status  == undefined) {
            //         vm.discountShow = false
            //     }else {
            //         vm.discount = data.discount*10
            //         vm.most_discount = data.most_discount
            //     }
            //     if(data.reduce_status  == null || data.reduce_status  == undefined) {
            //         vm.full_reduceShow = false
            //     }else {
            //         vm.full_rule  = data.full_rule 
            //         vm.full_reduce = data.full_reduce
            //         vm.most_reduce  = data.most_reduce 
            //     }
            // }

            

        });

    });
});