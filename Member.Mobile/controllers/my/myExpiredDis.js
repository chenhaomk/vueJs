require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                discount : [],
                scrollIsShow : true,
                isNo : ""
            },
            components : {
                dis : ygg.template.discount
            },
            methods : {
                
            }
        }),
        flag = false,
        height = document.getElementsByClassName('height')[0].clientHeight,
        member_id = ygg.getCookie("member_id"),
        obj = {
            member_id : member_id,
            overdue : 1,
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