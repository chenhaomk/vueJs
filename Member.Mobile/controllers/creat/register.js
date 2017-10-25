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
                salesmanCode: "",
                password : ""
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
                    if(that.password.length>0){
                    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z`~!@#$%^&*()_+=-]{8,16}$/.test(that.password)) {
                        ygg.prompt("密码8到16位，且必需带有字母");//文案有问题，根据web版本修改
                        return;
                    }
                }
                    var praram = {};

                    praram.mobile = that.phone;
                    praram.verification_code = that.vercode;

                    if (that.email.length > 0)
                        praram.email = that.email;
                    if (that.password.length > 0) {
                        praram.password = that.password;
                    }
                    var mid = ygg.getCookie("member_id");
                    if (mid != null || mid != "") {
                        praram.member_id = mid;
                    }
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

        function init() {
            var mid = ygg.getQueryString("m_id");
            if (mid != null && mid != "") {
                ygg.setCookie("member_id", mid);
            }
        }
        init();
    });
});