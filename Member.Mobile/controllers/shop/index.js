require(['config'], function () {
    require(['vue', 'swiper', 'main'], function (Vue, Swiper, ygg) {

        var vm = new Vue({
                el: "#app",
                data: {
                    menu: [],
                    ind: 0,
                    shopList: [],
                    scrollIsShow: true,
                    isKong: ""
                },
                components: {
                    list: ygg.template.shopList
                },
                methods: {
                    menuSwitch: function (index, id) {
                        this.ind = index;
                        getListObj.industry_id = id;
                        getList(function (data) {
                            vm.$set(vm, 'shopList', data)
                        });
                    }
                }
            }),
            flag = false,
            height = document.getElementsByClassName('height')[0].clientHeight,
            getListObj = {
                page: 1,
                size: 10,
                area_id: ygg.getCookie('area_id')
            };

        if (!getListObj.area_id) window.open("/index.html", "_self");

        ygg.ajax('/business/getAllIndustry', {}, function (data) {
            data = data.data;

            vm.$set(vm, 'menu', data.industry_list);

            setTimeout(function () {
                var swiperShop = new Swiper('.swiper-shop', {
                    slidesPerView: 'auto',
                    paginationClickable: true,
                    spaceBetween: 1 * rem,
                    freeMode: true
                });
            }, 1);

            getList(function (data) {
                vm.$set(vm, 'shopList', data)
            });

            window.onscroll = function (e) {
                if (e.target.scrollingElement.scrollTop + height + 5.5 * rem >= e.target.scrollingElement.clientHeight) {
                    if (flag) return;
                    flag = true;
                    getListObj.page++;
                    getList(function (data) {
                        vm.$set(vm, "shopList", vm.shopList.concat(data));
                        flag = false;
                    });
                }
            }
        });

        function getList(cb) {
            ygg.loading(true);
            ygg.ajax('/home/getHotBusiness', getListObj, function (data) {
                data = data.data;

                vm.$set(vm, "isKong", "");
                if (getListObj.page > data.pages && data.pages != 0) {
                    vm.$set(vm, "scrollIsShow", false);
                    ygg.loading(false);
                    return;
                } else if (data.pages <= 1) {
                    vm.$set(vm, "scrollIsShow", false);
                    if (data.pages == 0) {
                        vm.$set(vm, "isKong", "empty");
                    }
                }
                ygg.loading(false);
                cb(data.businessArr);
            });
        }
        if (ygg.getCookie('filter_item')) {
            var val = Number(ygg.getCookie('filter_item'))
            switch (val) {
                case 0:
                    vm.ind = val
                    var id = '402881005e2d1c9c015e2d424aee001f'
                    getListObj.industry_id = id;
                    getList(function (data) {
                        vm.$set(vm, 'shopList', data)
                    });
                    break;
                case 1:
                    var id = '402881005e2d1c9c015e2d42789b0022'
                    getListObj.industry_id = id;
                    vm.ind = val
                    getList(function (data) {
                        vm.$set(vm, 'shopList', data)
                    });
                    break;
                case 2:
                    var id = '402881005e2d1c9c015e2d42bfc10028'
                    getListObj.industry_id = id;
                    vm.ind = val
                    getList(function (data) {
                        vm.$set(vm, 'shopList', data)
                    });
                    break;
                case 3:
                    var id = '402881005e2d1c9c015e2d4ffb400040'
                    getListObj.industry_id = id;
                    vm.ind = val
                    getList(function (data) {
                        vm.$set(vm, 'shopList', data)
                    });
                    break;
                case 4:
                    var id = '402881005e2d1c9c015e2d500fd00043'
                    getListObj.industry_id = id;
                    vm.ind = val
                    getList(function (data) {
                        vm.$set(vm, 'shopList', data)
                    });
                    break;
            }
        }
    });
});