require(['config'], function () {
    require(['vue', 'main', 'imgup', 'city-picker'], function (Vue, ygg, OSS) {
        var vm = new Vue({
            el: "#app",
            data: {
                postive_img: "",
                other_img: "",
                prv: {},
                other: {},
                postive_img_list: "",
                other_img_list: "",
                name: "",
                card: "",
                bank_card_no: "",
                bank_name: "",
                bank: "",
                bank_code: ""
            },
            methods: {
                getPositive: function (a, src, isDel) {
                    this.$set(this, 'prv', a);
                    if (src != null || src != "" || src != "undefined")
                        this.$set(this, 'postive_img', src);
                    else if (isDel == 1) {
                        this.postive_img_list = "";
                        this.postive_img = "";
                    }
                    su = false;
                },
                getOther: function (a, src, isDel) {
                    this.$set(this, 'other', a);
                    if (src != null || src != "" || src != "undefined")
                        this.$set(this, 'other_img', src);
                    else if (isDel == 1) {
                        this.other_img_list = "";
                        this.other_img = "";
                    }
                    su = false;
                },
                next: function () {
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if (that.name.length == 0) {
                        ygg.prompt("请您填写真实姓名！");
                        return;
                    }
                    if (that.card.length == 0) {
                        ygg.prompt("请您填写身份证号！");
                        return;
                    }
                    if (that.bank_card_no.length == 0) {
                        ygg.prompt("请您填写银行卡号！");
                        return;
                    }
                    if (that.bank_card_no.length == 0) {
                        ygg.prompt("请您选择所属银行！");
                        return;
                    }
                    if (that.postive_img.length <= 0 || that.other_img.length <= 0) {
                        ygg.prompt("请您上传完整身份证照！");
                        return;
                    }
                    ygg.loading(true);
                    if (su) {
                        submit();
                        return;
                    }
                    if (that.prv.length != undefined && that.other.length != undefined) {
                        ygg.uploadImg(that.prv, function (prv) {
                            that.postive_img_list = prv[0];
                            ygg.uploadImg(that.other, function (other) {
                                that.other_img_list = other[0];
                                submit();
                            });
                        });
                    } else if (that.prv.length != undefined) {
                        ygg.uploadImg(that.prv, function (prv) {
                            that.postive_img_list = prv[0];
                            submit();
                        });
                    } else if (that.other.length != undefined) {
                        ygg.uploadImg(that.other, function (other) {
                            that.other_img_list = other[0];
                            submit();
                        });
                    } else {
                        submit();
                        ygg.loading(false);
                    }
                }
            },
            components: {
                uploader2: ygg.template.uploader2
            }
        });
        var su = true,
            isin = false;
        ygg.getClient(OSS);
        bussiness_id = ygg.getCookie("business_check_id");
        if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
            window.open("register.html", "_self");
        var bussiness_id = ygg.getCookie("business_check_id");

        function submit() {
            var id = ygg.getCookie("business_check_id"),
                param = {};
            param.business_check_id = id;
            param.bank_card = vm.bank_card_no;
            param.bank_name = vm.bank_name;
            param.real_name = vm.name;
            param.id_card_no = vm.card;
            param.bank_code = vm.bank_code;
            param.id_card_front_img = vm.postive_img_list;
            param.id_card_back_img = vm.other_img_list;
            ygg.ajax("/business/bindBankCardAndAuth", param, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    su = true;
                    if (!data.data.is_auth) {
                        ygg.prompt(data.data.message);
                        return;
                    }
                    location.href = "cert.html";
                }
            });

            ygg.loading(false);
        }
        getInfo();

        var filterData = {};

        function getFilter() {
            ygg.ajax("/common/getBankList", {}, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    var name = [],
                        code = [];
                    for (var i = 0; i < data.data.length; i++) {
                        name.push(data.data[i].bank_name);
                        code.push(data.data[i].bank_code);

                    }
                    $("#filter_bank").picker({
                        toolbarTemplate: '<header class="bar bar-nav">\
                    <button class="button button-link pull-right close-picker">确定</button>\
                    <h1 class="title">选择所属银行</h1>\
                    </header>',
                        cols: [{
                            textAlign: 'center',
                            values: code,
                            displayValues: name
                        }],
                        onOpen: function (p) {

                            if ((vm.bank_card != null || vm.bank_card != "") && !isin) {
                                p.cols[0].setValue(vm.bank_name);
                                isin = true;
                            }
                            vm.openShadow = "show";
                        },
                        onClose: function (p) {
                            vm.openShadow = "";
                            vm.$set(vm, "bank_name", p.cols[0].displayValues);
                            vm.$set(vm, "bank_code", p.cols[0].value);
                            p.cols[0].activeIndex == 0 ? filterData.bank_code = "" : filterData.bank_code = data.data[p.cols[0].activeIndex - 1].bank_code;
                            if (data.data.length > 0) {
                                vm.bank_code = data.data[p.cols[0].activeIndex].bank_code;
                                vm.bank_name = data.data[p.cols[0].activeIndex].bank_name;
                            }
                        }
                    });
                }
            });
        }
        getFilter();

        function getInfo() {
            var id = ygg.getCookie("business_check_id");
            if (id == null || id == "")
                return;
            ygg.ajax("/business/getBusinessCheckDetails", {
                business_check_id: id
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    var that = data.data;
                    vm.name = that.real_name;
                    vm.card = that.id_card_no;
                    vm.postive_img = that.id_card_front_img;
                    vm.postive_img_list = that.id_card_front_img.replace("https://img.yingougou.com/", "");
                    vm.other_img = that.id_card_back_img;
                    vm.other_img_list = that.id_card_back_img.replace("https://img.yingougou.com/", "");
                    vm.bank_card_no = that.bank_card;
                    vm.bank_name = that.bank;
                    vm.bank_code = that.bank_code;
                    getFilter();
                }
            });
        }
    });
});