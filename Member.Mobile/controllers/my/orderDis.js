require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                menu : ['全部（0）','待使用（0）','已使用（0）'],
                ind : 0,
                list : [],
                scrollIsShow : true,
                isNo : "",
                now : "",
                detailIsShow : "",
                orderDetail : {}
            },
            components : {
                orderList : ygg.template.orderList
            },
            methods : {
                menuSwitch : function(index){
                    this.ind = index;
                    index == 0?obj.order_status = 0:index==1?obj.order_status = 2:obj.order_status = 3;
                    getList(function(data){
                        vm.$set(vm,'list',data);
                    });
                },
                getDetaile : function(d){
                    this.orderDetail = d;
                    this.orderDetail.cTime = ygg.getd("Y.m.d H:i",this.orderDetail.create_date / 1000);
                    this.detailIsShow = "show";
                }
            }
        }),
        flag = false,
        height = document.getElementsByClassName('height')[0].clientHeight,
        member_id = ygg.getCookie("member_id"),
        obj = {
            member_id : member_id,
            order_status : 0,
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

                vm.$set(vm,"menu",["全部("+data.all_total+")","待使用("+data.need_use_total+")","已使用("+data.already_use_total+")"]);
                vm.$set(vm,'now',data.now);
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