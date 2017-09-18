require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                list : [],
                scrollIsShow : true,
                isNo : ""
            },
            components : {
                orderList : ygg.template.orderList
            },
            methods : {
                
            }
        }),
        flag = false,
        height = document.getElementsByClassName('height')[0].clientHeight,
        member_id = ygg.getCookie("member_id"),
        obj = {
            member_id : member_id,
            order_status : 4,
            page : 1,
            size : 10
        };

        if(!member_id)window.open('http://'+window.location.host,"_self");

        getList(function(data){
            vm.$set(vm,'list',data);
        });

        window.onscroll = function(e){
            if(e.target.scrollingElement.scrollTop + height + 5.5*rem >= e.target.scrollingElement.clientHeight){
                if(flag)return;
                flag = true;
                obj.page++;
                getList(function(data){
                    vm.$set(vm,"list",vm.list.concat(data));
                    flag = false;
                });
            }
        }

        function getList(cb){
            ygg.ajax('/member/getMemberOrder',obj,function(data){
                data = data.data;

                if(obj.page > data.pages && data.pages != 0){
                    vm.$set(vm,"scrollIsShow",false);
                    return;
                }else if(data.pages <= 1){
                    vm.$set(vm,"scrollIsShow",false);
                }
                if(data.pages == 0){
                    vm.$set(vm,"isNo","no");
                    vm.$set(vm,'list',data.order_list);
                    return;
                }else{
                    vm.$set(vm,"isNo","");
                }
                cb(data.order_list);
            });
        }

    });
});