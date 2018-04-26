require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                menu : ['全部（0）','待支付（0）','待使用（0）','已使用（0）'],
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
                console.log(data)
                var Obj = {
                     "need_use_total": 1,
                    "already_use_total": 0,
                    "pages": 1,
                    "size": 10,
                    "need_pay_total": 1,
                    "all_total": 2,
                    "now": 1504947744134,
                    "page": 1,
                    "expired_total": 3,
                    "order_list": [
                        {
                            "end_date": 1536076800000,
                            "code": null,
                            "coupon_activity_id": "2c92f9255e519642015e520fa3b50156",
                            "business_address": "成都高新区益州大道中段722号复城国际3栋110号",
                            "begin_date": 1504540800000,
                            "discount": 100,
                            "use_business_id": null,
                            "type": 2,
                            "use_count": 1,
                            "business_phone": "13675555266",
                            "coupon_id": "db1e597227004490b5a4bd8b2a0bd757",
                            "rate": null,
                            "price": 80,
                            "use_business_phone": null,
                            "create_date": 1504947310000,
                            "introduction": null,
                            "member_id": "1644ba4d38d549a6820ac4b640c04449",
                            "business_name": "燃知味面馆",
                            "use_business_name": null,
                            "is_share": false,
                            "max_price": null,
                            "min_price": 100,
                            "img_path": "https://img.yingegou.com/user-dirJSNZGjytk4.jpg",
                            "business_city_name": "成都市",
                            "name": "燃知味",
                            "business_area_name": "武侯区",
                            "order_id": "a3632d48f11e441c90b32b2592c8ca41",
                            "business_id": "2c92f9255e519642015e5204e152013a",
                            "status": 2,
                            "use_date": null
                        },
                        {
                            "end_date": 1536076800000,
                            "code": null,
                            "coupon_activity_id": "2c92f9255e519642015e51dda5c100f6",
                            "business_address": "成都市高新区益州大道中段复城国际广场111号",
                            "begin_date": 1504540800000,
                            "discount": 80,
                            "use_business_id": null,
                            "type": 2,
                            "use_count": 1,
                            "business_phone": "15520954052",
                            "coupon_id": "1672873af1114f7884ff719ef379844a",
                            "rate": null,
                            "price": 59.9,
                            "use_business_phone": null,
                            "create_date": 1504694344000,
                            "introduction": null,
                            "member_id": "1644ba4d38d549a6820ac4b640c04449",
                            "business_name": "华记豌杂面",
                            "use_business_name": null,
                            "is_share": true,
                            "max_price": null,
                            "min_price": 80,
                            "img_path": "https://img.yingegou.com/user-dirPQZBfGYPEc.JPG",
                            "business_city_name": "成都市",
                            "name": "豌豆面",
                            "business_area_name": "武侯区",
                            "order_id": "",
                            "business_id": "2c92f9255e519642015e51d7b55700c4",
                            "status": 0,
                            "use_date": null
                        },
                        {
                            "end_date": 1536076800000,
                            "code": null,
                            "coupon_activity_id": "2c92f9255e519642015e51dda5c100f6",
                            "business_address": "成都市高新区益州大道中段复城国际广场111号",
                            "begin_date": 1504540800000,
                            "discount": 80,
                            "use_business_id": null,
                            "type": 3,
                            "use_count": 1,
                            "business_phone": "15520954052",
                            "coupon_id": "1672873af1114f7884ff719ef379844a",
                            "rate": null,
                            "price": 59.9,
                            "use_business_phone": null,
                            "create_date": 1504694344000,
                            "introduction": null,
                            "member_id": "1644ba4d38d549a6820ac4b640c04449",
                            "business_name": "华记豌杂面",
                            "use_business_name": null,
                            "is_share": true,
                            "max_price": null,
                            "min_price": 80,
                            "img_path": "https://img.yingegou.com/user-dirPQZBfGYPEc.JPG",
                            "business_city_name": "成都市",
                            "name": "豌豆面",
                            "business_area_name": "武侯区",
                            "order_id": "",
                            "business_id": "2c92f9255e519642015e51d7b55700c4",
                            "status": 0,
                            "use_date": null
                        }
                    ]
                }
                // data = Obj
                vm.$set(vm,"menu",["全部("+data.all_total+")","待支付("+data.need_pay_total+")","待使用("+data.need_use_total+")","已使用("+data.already_use_total+")"]);
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