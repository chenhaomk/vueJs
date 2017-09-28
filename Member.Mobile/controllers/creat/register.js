require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mock-api', 'main'], function (axio, Vue, Mock, mockApi, ygg) {
        //判断是否已经为商家了

        var vm = new Vue({
            el: "#app",
            data: {
                active: 0,
                phone: "",
                vercode: "",
                email: "",
                userId: "",
                pwd: "",
                dpwd: "",
                rvercode: "",
                ck: "",
                account: "",
                salesmanCode: ""
            },
            methods: {
                register1: function (e) {
                    event.preventDefault();
                    window.event.returnValue = false;
                    if (this.ck == "none") return;
                    var that = this;
                    if (that.phone.length == 0 || that.vercode.length == 0) {
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }
                    var praram = {};

                    praram.mobile = that.phone;
                    praram.verification_code = that.vercode;
                    if (that.email.length > 0)
                        praram.email = that.email;
                     if (that.salesmanCode.length > 0)
                         praram.commissioner_id = that.commissioner_id;
                    var mid = ygg.getCookie("member_id");
                    if (mid != null || mid != "")
                        praram.member_id = mid;
                    ygg.ajax('/business/addBusinessCheckOne', praram, function (data) {
                        if (data.status == "error") {
                            ygg.prompt(data.msg);
                        } else if (data.status == "success") {
                            data = data.data;
                            ygg.setCookie("business_check_id", data.business_check_id);
                            ygg.setCookie("account", data.account);
                            that.account = data.account;
                            that.mobile = "";
                            that.verification_code = "";
                            that.email = "";
                            that.active = 1;
                        }
                    });
                },
                checkbox: function () {
                    this.ck == "" ? this.$set(this, "ck", "none") : this.$set(this, "ck", "");
                },
                blurTip: function (s, t, r) {
                    ygg.verify(s, t, r);
                }
            },
            components: {
                getVercode: ygg.template.getVercode
            }
        });


    });
});