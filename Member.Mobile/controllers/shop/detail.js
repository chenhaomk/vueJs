require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {
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
                full_rule:"",
                full_reduce:"",
                most_reduce :""

            },
            components : {
                dis:ygg.template.discount,
                gis:ygg.template.groupdis,
                star : ygg.template.star,
                comment : ygg.template.comment
            },
            methods : {
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
            data.coupons.map(function (item,index) {
                if(item.type == 3) { //团购
                    vm.groupdis.push(item)
                }else {//优惠券
                    vm.coupons.push(item)
                }
            })
            console.log(vm.groupdis)
            vm.$set(vm,"groupdis",vm.groupdis);
            vm.$set(vm,"coupons",vm.coupons);//渲染优惠券
            vm.$set(vm,"comments",data.comments);
            ygg.setCookie('shopName',data.business_details.name)//保存商家名称

            if((data.sale_status == null || data.sale_status == undefined) && (data.reduce_status == null || data.reduce_status == undefined) ) {
                vm.willShow = false
            }else {
                if(data.sale_status  == null || data.sale_status  == undefined) {
                    vm.discountShow = false
                }else {
                    vm.discount = data.discount*10
                }
                if(data.reduce_status  == null || data.reduce_status  == undefined) {
                    vm.full_reduceShow = false
                }else {
                    vm.full_rule  = data.full_rule 
                    vm.full_reduce = data.full_reduce
                    vm.most_reduce  = data.most_reduce 
                }
            }

            

        });

    });
});