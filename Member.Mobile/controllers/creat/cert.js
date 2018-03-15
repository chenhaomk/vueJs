require(['config'], function () {
    require(['vue', 'main', 'imgup','axio', 'city-picker-area'], function (Vue, ygg, OSS,axio) {

        var vm = new Vue({
            el: "#app",
            data: {
                licence_img: [],
                licence: [],
                licence_img_list: [],
                business_licence_num: "",
                business_licence_name: "",
                business_licence_address: "",
                business_licence_date: getNowFormatDate(),
                active: 0
            },
            methods: {
                getLicence: function (a, src, isDel) {
                    this.$set(this, 'licence', a);
                    if ((src != null || src != "" || src != undefined) && isDel == 0)
                        this.licence_img.push(src);
                    else {
                        if (typeof src == 'object')
                            src = src[0];
                        this.licence_img.remove(src);
                        this.licence_img_list.remove(src.replace("https://img.yingougou.com/", ""));
                    }
                    su = false;
                },
                getData: function (a) {
                    console.dir(a);
                },
                submit: function () {
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if (that.business_licence_num.length == 0) {
                        ygg.prompt("请您填写营业执照号！");
                        return;
                    }
                    if (that.business_licence_name.length == 0) {
                        ygg.prompt("请您填写营业执照名称！");
                        return;
                    }
                    if (that.business_licence_address.length == 0) {
                        ygg.prompt("请您填写营业执照地址！");
                        return;
                    }
                    if (that.business_licence_date.length == 0) {
                        ygg.prompt("请您填写注册时间！");
                        return;
                    }
                    if (that.licence_img.length <= 0) {
                        ygg.prompt("请您上传营业执照图！");
                        return;
                    }
                    ygg.loading(true);
                    if (su) {
                        submit();
                        return;
                    }
                    ygg.uploadImg(that.licence, function (licence) {
                        that.licence_img_list.push(licence);
                        submit();
                    });
                }
            },
            components: {
                uploader: ygg.template.uploader
            }
        });
        var su = true,
            bussiness_id = ygg.getCookie("business_check_id");
        ygg.getClient(OSS);
        if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
            window.open("register.html", "_self");
        var bussiness_id = ygg.getCookie("business_check_id");

        function submit() {
            var id = ygg.getCookie("business_check_id"),
                inner = "";
            if (vm.licence_img_list.length > 0) {
                for (var i = 0; i < vm.licence_img_list.length; i++) {
                    if (inner != "")
                        inner += ",";
                    inner += vm.licence_img_list[i];
                }
            }
            var param = {};
            param.business_check_id = id;
            param.business_licence_num = vm.business_licence_num;
            param.business_licence_name = vm.business_licence_name;
            param.business_licence_address = vm.business_licence_address;
            param.business_licence_date = vm.business_licence_date;

            param.business_licence_img = inner;

            ygg.ajax("/business/addQualificationAuthInfo", param, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    vm.active = 1;
                    su = true;
                }
            });
            ygg.loading(false);
        }
        getInfo();

        function getInfo() {
            var id = ygg.getCookie("business_check_id");
            ygg.ajax("/business/getBusinessCheckDetails", {
                business_check_id: id
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    var that = data.data;
                    vm.business_licence_num = that.business_licence_num;
                    vm.business_licence_name = that.business_licence_name;
                    vm.business_licence_address = that.business_licence_address;
                    vm.business_licence_date = fmtDate(that.business_licence_date);
                    vm.licence_img = that.business_licence_img;
                    for (var i = 0; i < that.business_licence_img.length; i++) {
                        var imgName = that.business_licence_img[i];
                        vm.licence_img_list.push(imgName.replace("https://img.yingougou.com/", ""));
                    }
                }
            });
        }

        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
                " " + date.getHours() + seperator2 + date.getMinutes() +
                seperator2 + date.getSeconds();
            return currentdate.split(' ')[0];
        }
        function fmtDate(obj) {
            var date = new Date(obj);
            var y = 1900 + date.getYear();
            var m = "0" + (date.getMonth() + 1);
            var d = "0" + date.getDate();
            return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
        }
    });
});