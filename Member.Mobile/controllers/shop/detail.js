require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

        var vm = new Vue({
            el : "#app",
            data : {
                shop : {},
                coupons : [],
                comments : [],
                disIsShow : 2,
                moreIsShow : true,
                businessId : "",
                returnUrl : ygg.getQueryString("returnUrl"),
                comIsShow : "",
                comment_list : [],
                discountPay:[],//优惠买单
                willShow:true,//优惠买点显示
                discountShow:true,//是否有打折
                full_reduceShow:true,//是否有满减
                discount:"",
                full_rule:"",
                full_reduce:"",
                most_reduce :""

            },
            components : {
                dis : ygg.template.discount,
                star : ygg.template.star,
                comment : ygg.template.comment
            },
            methods : {
                viewMore : function(){
                    if(this.disIsShow >= this.coupons.length){
                        this.disIsShow = this.coupons.length;
                        this.moreIsShow = false;
                    }else{
                        this.disIsShow+=5;
                        if(this.disIsShow >= this.coupons.length){
                            this.disIsShow = this.coupons.length;
                            this.moreIsShow = false;
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
                    if(event.currentTarget.getAttribute("data") == 1) {//折扣买单
                        window.location.href = "orderPay.html?discount" //结算页
                        ygg.setCookie('discount',vm.discount); 
                    }else { //满减买单
                        window.location.href = "orderPay.html?full_reduce" //结算页
                        ygg.setCookie('full_rule',vm.full_rule);
                        ygg.setCookie('full_reduce',vm.full_reduce); 
                        ygg.setCookie('most_reduce',vm.most_reduce);  
                    }
                    
                }
            }
        }),
        business_id = ygg.getQueryString("id"),
        returnUrl = ygg.getQueryString("returnUrl");

        if(!business_id || !returnUrl)window.open("/","_self");
        if(returnUrl == 'index')returnUrl='http://'+window.location.host;

        vm.$set(vm,'businessId',business_id);
        vm.$set(vm,'returnUrl',returnUrl);

        ygg.ajax('/business/getBusinessDetails',{
            business_id : business_id,
            member_id : ygg.getCookie('member_id')
        },function(data){

            data = data.data;
            vm.$set(vm,"shop",data.business_details);
            vm.$set(vm,"coupons",data.coupons);
            vm.$set(vm,"comments",data.comments);
            ygg.setCookie('shopName',data.business_details.name)//保存商家名称


            // if((data.sale_status == null || data.sale_status == undefined) && (data.reduce_status == null || data.reduce_status == undefined) ) {
            //     vm.willShow = false
            // }else {
            //     if(data.sale_status  == null || data.sale_status  == undefined) {
            //         vm.discountShow = false
            //     }else {
            //         vm.discount = data.discount*10
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