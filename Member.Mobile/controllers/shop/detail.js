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
                discountPay:[]//优惠买单
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
                pay:function (event) {//优惠买点跳转
                    console.log(event.currentTarget.getAttribute("data"))
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
            vm.discountPay = [
                {
                    name:"9折",
                    num:"已买250",
                    id:"12312"
                },
                {
                    name:"满100减10",
                    num:"已买250",
                    id:"263236"
                },
            ]
        });

    });
});