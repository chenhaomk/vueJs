require(['config'], function () {
    require(['vue', 'main', 'imgup', 'axio'], function (Vue, ygg, OSS, axio) {
        var vm = new Vue({
            el: "#app",
            data: {
                card_holder: "",
                bank_card_no: "",
                bank: "",
                isRead: true,
                active: 0,
                ck: "",
            },
            methods: {
                getPositive: function (a) {
                    this.$set(this, 'prv', a);
                    su = false;
                },
                getOther: function (a) {
                    this.$set(this, 'other', a);
                    su = false;
                },
                checkbox: function () {
                    this.ck == "" ? this.$set(this, "ck", "none") : this.$set(this, "ck", "");
                },
                next: function () {
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if (that.card_holder.length == 0) {
                        ygg.prompt("请您填写持卡人姓名！");
                        return;
                    }
                    if (that.bank_card_no.length == 0) {
                        ygg.prompt("请您填写银行卡号！");
                        return;
                    }
                    if (that.bank.length == 0) {
                        ygg.prompt("请您填写所属银行！");
                        return;
                    }
                    //此处判断银行卡类型 DC: "储蓄卡",CC: "信用卡",SCC: "准贷记卡",PC: "预付费卡"
                    //https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=6225750006459602&cardBinCheck=true
                    if (that.bank.indexOf("信用") >= 0) {
                        ygg.prompt("不能绑定信用卡哟！");
                        return;
                    }
                    if (this.ck == "none")
                        return;
                    submit();

                }
            },
            watch: {
                bank_card_no: function (newVal, oldVal) {
                    if (newVal == null || newVal == "") {
                        this.brandList = [];
                        return;
                    }
                    if (newVal.length != 6 && newVal.length != 5)
                        return;
                    var index = bankBin.indexOf(newVal);
                    if (index < 0) {
                        this.isRead = false;
                        this.bank = "";
                    } else {
                        this.bank = bankName[index];
                        this.isRead = true;

                    }

                }
            }
        });
        var su = false,
            bussiness_id = ygg.getCookie("business_check_id");
        if (bussiness_id == null || bussiness_id == "" || bussiness_id == "undefined")
            window.open("register.html", "_self");
        var bussiness_id = ygg.getCookie("business_check_id");

        function submit() {
            var id = ygg.getCookie("business_check_id");

            ygg.ajax("/business/bindBankCard", {
                business_check_id: id,
                card_holder: vm.card_holder,
                bank_card_no: vm.bank_card_no,
                bank: vm.bank
            }, function (data) {
                if (data.status == "error") {
                    ygg.prompt(data.msg);
                } else if (data.status == "success") {
                    location.href = "cert.html";
                }
            });
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
                    vm.img_show = false;
                    var that = data.data;
                    vm.card_holder = that.card_holder;
                    vm.bank_card_no = that.bank_card;
                    vm.bank = that.bank;
                }
            }); 
        }
    });
});

