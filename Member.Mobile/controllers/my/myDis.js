require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                menu : ['共享券','商家专属券'],
                ind : 0,
                discount : [],
                scrollIsShow : true,
                isNo : ""
            },
            components : {
                dis : ygg.template.discount
            },
            methods : {
                menuSwitch : function(index){
                    this.ind = index;
                    index == 0?obj.coupon_type = 1:obj.coupon_type = 0;
                    obj.page = 1;
                    flag = false;
                    window.scrollTo(0,0);
                    getList(function(data){
                        vm.$set(vm,'discount',data);
                    });
                }
            }
        }),
        flag = false,
        height = document.getElementsByClassName('height')[0].clientHeight,
        member_id = ygg.getCookie("member_id"),
        obj = {
            member_id : member_id,
            coupon_type : 1,
            overdue : 0,
            page : 1,
            size : 10
        };

        if(!member_id)window.open('http://'+window.location.host,"_self");

        getList(function(data){
            vm.$set(vm,'discount',data);
        });

        window.onscroll = function(e){
            if(e.target.scrollingElement.scrollTop + height + 5.5*rem >= e.target.scrollingElement.clientHeight){
                if(flag)return;
                flag = true;
                obj.page++;
                getList(function(data){
                    vm.$set(vm,"discount",vm.discount.concat(data));
                    flag = false;
                });
            }
        }

        function getList(cb){
            ygg.ajax('/member/getMemberCoupon',obj,function(data){
                data = data.data;
                    
                vm.$set(vm,"menu",["共享券("+data.share_coupon_total+")","商家专属券("+data.exclusive_coupon_total+")"]);
                if(obj.page > data.pages && data.pages != 0){
                    vm.$set(vm,"scrollIsShow",false);
                    return;
                }else if(data.pages <= 1){
                    vm.$set(vm,"scrollIsShow",false);
                }
                if(data.pages == 0){
                    vm.$set(vm,"isNo","no");
                    vm.$set(vm,'discount',data.coupons);
                    return;
                }else{
                    vm.$set(vm,"isNo","");
                }
                cb(data.coupons);
            });
        }

    });
});