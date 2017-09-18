require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var docEl = document.documentElement,
            body = document.getElementsByTagName("body")[0],
            width = docEl.clientWidth,
            height = docEl.clientHeight,
            size = 10 * (width / 375),
            appid = "100";
        if (size > 20) size = 20;
        window.rem = size;
        docEl.style.fontSize = size + 'px';
        docEl.style.minHeight = height + 'px';
        body.style.minHeight = height + 'px';
        body.style.display = 'block';
        var vm = new vue({
            el: "#app",
            data: {
                discount: [],
                isShow: true
            },
            methods: {
                footerFunc: function () {
                    var payDom = document.getElementsByClassName("underFunc")[0];
                    if (payDom == null)
                        return;
                    if (payDom.className == "underFunc")
                        payDom.className = "underFunc active";
                    else
                        payDom.className = "underFunc";
                }
            },
            components: {
                dis: main.template.discount
            }
        });
        obj = {
            member_id: main.getSession("m_id"),
            business_id: main.getSession("b_id"),
            price: main.getSession("price")
        };

        getList(function (data) {
            vm.$set(vm, 'discount', data);
        });


        function getList(cb) {
            main.post('/member/getPayCanUseCoupon', obj, function (data) {
                data = data.data;
                vm.$set(vm, 'discount', data.data.discount_list);
                if (data.data.discount_list.length <= 0)
                    vm.isShow = false;
                cb(data.data.discount_list);
            });
        }
    });
});