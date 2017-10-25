require(['config'], function () {
    require(['axio', 'vue', 'main'], function (axio, Vue, ygg) {

        var vm = new Vue({
            el: "#app",
            data: {
                admin_id: "",
                examine_business_list: [],
                finish_business_list: [],
                pending_business_list: []
            },
            methods: {
                say: function (message) {
                    ygg.prompt(message);
                }
            }
        });

        function init() {
            vm.admin_id = ygg.getCookie("admin_id");
            if (vm.admin_id == null) {
                ygg.prompt("无法找到当前管理员信息，请稍后重试");
                return;
            }
            if (vm.admin_id == null | vm.admin_id == undefined)
                return;
            axio.defaults.headers.admin_id = vm.admin_id;
            ygg.ajax('/business/getAllBusiness', {
                admin_id: vm.admin_id
            }, function (data) {
                data = data.data;
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                }
                vm.examine_business_list = data.examine_business_list;
                vm.finish_business_list = data.finish_business_list;
                vm.pending_business_list = data.pending_business_list;
                for (var i1 = 0; i1 < vm.examine_business_list.length; i1++) {
                    var data = vm.examine_business_list[i1].create_date;
                    vm.examine_business_list[i1].date = ygg.getd("Y.m.d", data / 1000);
                }
                for (var i2 = 0; i2 < vm.finish_business_list.length; i2++) {
                    var data = vm.finish_business_list[i2].create_date;
                    vm.finish_business_list[i2].date = ygg.getd("Y.m.d", data / 1000);
                }
                for (var i3 = 0; i3 < vm.pending_business_list.length; i3++) {
                    var data = vm.pending_business_list[i3].create_date;
                    vm.pending_business_list[i3].date = ygg.getd("Y.m.d", data / 1000);
                }
            });
        }

        init();
    });
});