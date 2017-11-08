require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var baseURL = 'http://119.23.10.30:9000/v1.0/'; //本机测试地址
        // var baseURL = "https://api.yingougou.com/v1.0/"
        // main.post.
    	var vm = new vue({
    		el:"#app",
    		data:{
                merchant_name:main.getSession("b_n"),
                recommend_coupon:[],//系统推荐优惠券
                discount_list:[],//可用优惠券列表
                showRecommend:false,//是否显示系统推荐券
                disIsShow2:2,
                moreIsShow2:true,
    		},
    		methods:{
                back:function() {
                    window.history.go(-1)
                },
                viewMore2 : function(){
                    if(this.disIsShow2 >= this.discount_list.length){
                        this.disIsShow2 = this.discount_list.length;
                        this.moreIsShow2 = false;
                    }else{
                        this.disIsShow2+=5;
                        if(this.disIsShow2 >= this.discount_list.length){
                            this.disIsShow2 = this.discount_list.length;
                            this.moreIsShow2 = false;
                        }
                    }
                },
                useTic:function (date) {//ch-use:立即使用优惠券
                    
                    var picked = main.getSession("parOrderTotal") // 从获取支付界面存的支付总金额
                    var deDisPr  = main.getSession("deDisPr") //不参与优惠金额
                    var disBefore // 折扣后的金额
                    if(deDisPr != null || deDisPr != undefined || deDisPr != "" ) {
                        if(picked-deDisPr >= date.min_price) {
                            if(date.type == 0) { //代金券
                                disBefore = picked - date.discount;
                            }else if(date.type == 1) {//折扣券
                                if(picked*(1-date.rate) > date.max_price) {//如果折扣幅度大于最高优惠价，则按最高优惠价优惠
                                    disBefore = picked - date.max_price;
                                }else {
                                    disBefore = picked*date.rate;
                                }
                            }else if(date.type == 2) {//抵扣券
                                disBefore = picked - date.discount;
                            }
                        }else {
                            main.prompt("不满足该券使用条件!");
                        }
                    }else {
                        if(picked >= date.min_price) {
                            if(date.type == 0) { //代金券
                                disBefore = picked - date.discount;
                            }else if(date.type == 1) {//折扣券
                                if(picked*(1-date.rate) > date.max_price) {//如果折扣幅度大于最高优惠价，则按最高优惠价优惠
                                    disBefore = picked - date.max_price;
                                }else {
                                    disBefore = picked*date.rate;
                                }
                            }else if(date.type == 2) {//抵扣券
                                disBefore = picked - date.discount;
                            }
                        }else {//消费金额低于券的最低消费金额
                            main.prompt("不满足该券使用条件!");
                        }
                    }
                    main.setSession("disBefore",disBefore)//保存在选取优惠券的页面计算的用券优惠后的金额，在支付界面直接获取显示对应券的优惠幅度（只在支付界面使用，其余界面清空）
                    main.setSession("c_id",date.coupon_id)//保存优惠券id,用于支付界面
                    window.location.href = "../../views/newDrainage/payPage.html"
                }   
    		},

    	})

        getUserTicInfo()//获取用户在该商店已领优惠券列表
        function getUserTicInfo() {//获取用户优惠券详情
            main.post(baseURL+'member/getCanUseCoupon', {
                member_id: main.getCookie("member_id"),
                business_id:main.getCookie('business_id'),
                price:Number(main.getSession("parOrderTotal")),
                no_sale_price:main.getSession("deDisPr")?Number(main.getSession("deDisPr")):0,
            }, function (res) {
                var data = res.data.data
                if(res.data.status == "success") {
                    if(data.recommend_coupon.name != null ||data.recommend_coupon.name != undefined ||data.recommend_coupon.name != "") {
                        vm.showRecommend = true
                        vm.recommend_coupon.push(data.recommend_coupon)
                    }
                    vm.discount_list = data.discount_list

                    console.log(vm.discount_list)
                }else {
                    main.prompt("请求失败!")
                }
            });
        }
    })
 })   