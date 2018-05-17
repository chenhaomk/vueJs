require(['config'], function () {
    require(['vue', 'main'], function (Vue, ygg) {
        var vm = new Vue({
                el: "#app",
                data: {
                    ind: 0,
                    favoriteList:[],
                    scrollIsShow: true,
                    isKong: ""
                },
                components: {
                    list: ygg.template.favoriteList
                },
                methods: {
                }
            }),
            flag = false,
            height = document.getElementsByClassName('height')[0].clientHeight,
            getListObj = {
                page: 1,
                size: 10,
                member_id: ygg.getCookie("member_id")
            };
        ygg.ajax('/member/getCollectBusiness', getListObj, function (data) {
            data = data.data;
            vm.$set(vm, 'favoriteList', data.card_list)
        })

        function getList(cb) {
            ygg.loading(true);
            ygg.ajax('/member/getCollectBusiness', getListObj, function (data) {
                console.log(data)
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
    });
});