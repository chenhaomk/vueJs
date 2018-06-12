require(['config'], function () {
    require(['vue', 'main'], function (Vue, main) {
        var docEl = document.documentElement,
        body = document.getElementsByTagName("body")[0],
        width = docEl.clientWidth,
        height = docEl.clientHeight,
        appid = "100";

        var size = 10 * (width / 375);
        var isdou = document.createElement('div');
        isdou.setAttribute("class", "isdou");
        body.appendChild(isdou);
        if (size > 20) size = 20;
        window.rem = size;

        docEl.style.fontSize = size + 'px';
        docEl.style.minHeight = height + 'px';
        body.style.minHeight = height + 'px';
        body.style.display = 'block';
        var baseURL = "https://api.yingougou.com/v1.2/"//测试
        var  discount = Vue.extend({
            props: {
              a: {
                type: Object
              },
              returnUrl: "",
              isMy: false,
              isGq: false
            },
            data: function () {
              return {
                geting: false,
                success: false,
                lqcg: false,
                url: "/views/coupon/index.html?returnUrl=" + this.returnUrl + "&id="
              }
            },
            computed: {},
            template: '<section class="discount_group fn-clear" :class="{default:a.type==0 && a.is_share,default_z:a.type==0 && !a.is_share,rate:a.type==1 && a.is_share,rate_z:a.type==1 && !a.is_share,dk:a.type==2 && a.is_share,dk_z:a.type==2 && !a.is_share,expired:isGq,lqcg:lqcg}">' +
              '<a class="router">' +
              '<section class="info">' +
              '<section class="top fn-clear">' +
              '<img :src="a.img_path">' +
              '<section class="text">' +
              '<p class="title_n" v-if="!a.is_share">专属券</p>' +
              '<p class="title_n" v-else>共享券</p>' +
              '<p class="discounted" v-if="a.type == 0"><span>{{a.discount}}</span>元</p>' +
              '<p class="discounted" v-else-if="a.type == 1"><span>{{a.rate*10}}</span>折</p>' +
              '<p class="discounted" v-else><span>{{a.price}}</span>元<b>{{a.discount}}元</b></p>' +
              '</section>' +
              '</section>' +
              '<section class="bot">' +
              '<span>满{{a.min_price}}可用</span>' +
              '<span class="text-sl">{{a.business_name}}</span>' +
              '</section>' +
              '</section>' +
              '</a>' +
              '<section class="status">' +
              '<a  @click="getc(a)">' +
              '<p>立即<br>使用</p>' +
              '</a>' +
              '</section>' +
              '</section>',
            methods: {
              getc: function (a) {
                var pick = main.getSession('parOrderTotal')
                var type = a.type
                var disBefore
                console.log(a)

                if(a.business_id != main.getSession('b_id') &&a.business_id != undefined) {
                    main.prompt("该优惠券不能在该店铺使用!");
                    return
                }
                
                if(a.min_price != null) {//是否有最小消费金额限制
                    if(a.min_price > pick) {
                        main.prompt("支付金额不满足该券使用条件!");
                        return
                    }else {
                        switch(type)
                        {
                            case 0://代金券
                                disBefore = pick - a.discount
                                main.setSession("disBefore",disBefore)
                                break;
                            case 1://折扣券
                                disBefore = pick - a.rate
                                main.setSession("disBefore",disBefore)
                                break;
                            case 2://抵扣券
                                disBefore = pick - a.discount
                                main.setSession("disBefore",disBefore)
                                break;
                            case 3://
                                disBefore = pick - a.discount
                                main.setSession("disBefore",disBefore)
                                break;
                        }
                    }
                }else {
                    switch(type)
                    {
                        case 0://代金券
                            disBefore = pick - a.discount
                            main.setSession("disBefore",disBefore)
                            break;
                        case 1://折扣券
                            disBefore = pick - a.rate
                            main.setSession("disBefore",disBefore)
                            break;
                        case 2://抵扣券
                            disBefore = pick - a.discount
                            main.setSession("disBefore",disBefore)
                            break;
                        case 3://
                            disBefore = pick - a.discount
                            main.setSession("disBefore",disBefore)
                            break;
                    }
                }
                console.log(disBefore)


                // if (id != null || id != "") {

                //     main.setSession('disBefore','disBefore')
                //     main.setSession("couponID", id);
                //     main.setSession("isBusiness", isb);
                //     main.setSession("calculate_discount", discount);
                //     location.href = "../../views/znPay/index.html";
                // }
              }
            }
          });

        var vm = new Vue({
                el: "#app",
                data: {
                    menu: ['共享券', '门店专属券', '团购券'],
                    ind: 0,
                    discount: [],
                    scrollIsShow: true,
                    isNo: ""
                },
                components: {
                    dis: discount
                },
                methods: {
                    menuSwitch: function (index) {
                        this.ind = index;
                        if (index == 0) {
                            obj.coupon_type = 1
                        } else if (index == 1) {
                            obj.coupon_type = 0
                        } else {
                            obj.coupon_type = 2
                        }
                        obj.page = 1;
                        flag = false;
                        window.scrollTo(0, 0);
                        getList(function (data) {
                            vm.$set(vm, 'discount', data);
                        });
                    },
                    back:function () {
                        history.go(-1)
                    }
                }
            }),
            flag = false,
            height = document.getElementsByClassName('height')[0].clientHeight,
            member_id = main.getSession("member_id"),
            obj = {
                member_id: member_id,
                coupon_type: 1,
                overdue: 0,
                page: 1,
                size: 10
            };

        //   if(!member_id)window.open('http://'+window.location.host,"_self");

        getList(function (data) {
            vm.$set(vm, 'discount', data);
        });

        window.onscroll = function (e) {
            if (e.target.scrollingElement.scrollTop + height + 5.5 * rem >= e.target.scrollingElement.clientHeight) {
                if (flag) return;
                flag = true;
                obj.page++;
                getList(function (data) {
                    vm.$set(vm, "discount", vm.discount.concat(data));
                    flag = false;
                });
            }
        }

        function getList(cb) {
            main.post(baseURL+"member/getMemberCoupon", obj, function (data) {
                // console.log(data)
                data = data.data.data;
                console.log(data)
                vm.$set(vm,"menu",["共享券("+data.share_coupon_total+")","门店专属券("+data.exclusive_coupon_total+")","团购券("+data.group_coupon_total+")"]);
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
            })
        }

    });
});