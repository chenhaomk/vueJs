require(['config'],function(){
    require(['vue','swiper','main'],function (Vue,Swiper,ygg) {
        var ticketId = window.location.search.split("&")[0].split("=")[1] //团购券id
        var bid = window.location.search.split("&")[1].split("=")[1] //商家id
    	var vm = new Vue({
            el : "#app",
            data : {
                detail:{},
                ttIsShow : false
            },
            components : {
               star: ygg.template.star
            },
            methods : {
                goBuy:function () {
                    
                },
                back:function () {
                    window.history.go(-1);
                }
            }
        })

        getTicketDetil() //获取团购券详情
        function getTicketDetil() {
            ygg.loading(true);
            ygg.ajax('/coupon/getCouponDetails',{
                coupon_id:ticketId,
            },function(data){
                data = data.data;
                if ((data.price+"").indexOf() == -1) {
                    data.zs = data.price
                    data.xs = "00"
                }else {
                    data.price = data.price.toFixed(2)
                    data.zs = data.price.toString().split(".")[0]
                    data.xs = data.price.toString().split(".")[1]
                    
                }
                data.stime = ygg.getd("Y.m.d ", data.begin_date / 1000) + '-' + ygg.getd("Y.m.d ", data.end_date / 1000);
                vm.$set(vm, 'detail', data);
                vm.$set(vm, 'ttIsShow', true);
                ygg.loading(false);
            });
        }
    });
});