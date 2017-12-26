require(['config'],function(){
    require(['axio','vue','main'],function (axio,Vue,ygg) {

        var vm = new Vue({
            el : "#app",
            data : {
                comment_list : [],
                scrollIsShow : true,
                businessId : "",
                returnUrl : ygg.getQueryString("returnUrl"),
                comment_size : 0
            },
            components : {
                comment : ygg.template.comment
            }
        }),
        flag = false,
        height = document.getElementsByClassName('height')[0].clientHeight,
        business_id = ygg.getQueryString("id"),
        obj = {
            page : 1,
            size : 10
        };

        if(!business_id)window.open("/index11.html","_self");
        obj.business_id = business_id;
        vm.$set(vm,"businessId",business_id);

        getList(function(d){
            vm.$set(vm,"comment_list",d);
        });

        window.onscroll = function(e){
            if(e.target.scrollingElement.scrollTop + height + 5.5*rem >= e.target.scrollingElement.clientHeight){
                if(flag)return;
                flag = true;
                obj.page++;
                getList(function(data){
                    vm.$set(vm,"comment_list",vm.comment_list.concat(data));
                    flag = false;
                });
            }
        }

        function getList(cb){
            ygg.ajax('/business/getComments',obj,function(data){
                data = data.data;
                if(obj.page > data.pages && data.pages != 0){
                    vm.$set(vm,"scrollIsShow",false);
                    return;
                }else if(data.pages <= 1){
                    vm.$set(vm,"scrollIsShow",false);
                }
                cb(data.comments);
            });
        }
    });
});