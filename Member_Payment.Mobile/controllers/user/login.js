require(['config'], function () {
    require(['axio', 'vue', 'main'], function (axio, Vue, ygg) {
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
        var vm = new Vue({
            el: "#app",
            data: {
                active: 0,
                phone: "",
                vercode: "",
                userId: "",
                pwd: "",
                cs: 0,
                ver: ""
            },
            methods: {
                tab: function (index) {
                    this.active = index;
                },
                login1: function (e) {
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if (that.phone.length == 0 || that.vercode.length == 0) {
                        main.prompt("请您仔细填写信息， 不能有空哦！ ");
                        return;
                    }
                    if (!(/^1[34578]\d{9}$/.test(that.phone))) {
                        main.prompt("请输入合理的手机号码！");
                        return
                    }
                    ygg.post('passport/fastLogin', {
                        mobile: that.phone,
                        verification_code: that.vercode
                    }, function (data) {
                        if (data.data.status == "error") {
                            main.prompt(data.msg);
                        } else if (data.data.status == "success") {
                            data = data.data.data;
                            ygg.setSession("m_id", data.member_id);
                            ygg.setSession("m_n", data.mobile);
                            ygg.setSession("phone", data.mobile);
                            ygg.setSession("token", data.token);
                            ygg.setSession("h_t", data.head_portrait);
                            ygg.post('member/getPersonCenterInfo', {
                                member_id: ygg.getSession("m_id")
                            }, function (data) {
                                if (data.status == "error") {
                                    main.prompt(data.msg);
                                } else if (data.status == "200") {
                                    if (data.data.data.select_setting == 1)
                                        location.href = "../../views/payment/paymerchantmanual.html";
                                    else
                                        location.href = "../../views/payment/paymerchant.html";
                                    //获取用户设置信息 1-paymerchantmanual,0-paymerchant
                                }
                            });
                        }
                    });
                },
                login2: function (e) {
                    event.preventDefault();
                    window.event.returnValue = false;
                    var that = this;
                    if (that.userId.length == 0 || that.pwd.length == 0) {
                        main.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }
                    ygg.post('passport/login', {
                        mobile: that.userId,
                        password: that.pwd
                    }, function (data) {
                        if (data.status == "error") {
                            main.prompt(data.msg);
                            if (data.code == "1001") {
                                that.cs++;
                            }
                        } else if (data.data.status != "error") {
                            data = data.data;
                            ygg.setSession("m_id", data.member_id);
                            ygg.setSession("m_n", data.mobile);
                            ygg.setSession("phone", data.mobile);
                            ygg.setSession("token", data.token);
                            ygg.setSession("h_t", data.head_portrait);
                            ygg.post('member/getPersonCenterInfo', {
                                member_id: ygg.getSession("m_id")
                            }, function (data) {
                                data = data.data;
                                if (data.status == "error") {
                                    main.prompt(data.msg);
                                } else if (data.status == "success") {
                                    if (data.data.select_setting == 1)
                                        location.href = "../../views/payment/paymerchantmanual.html";
                                    else
                                        location.href = "../../views/payment/paymerchant.html";
                                    //获取用户设置信息 1-paymerchantmanual,0-paymerchant
                                }
                            });
                        } else {
                            main.prompt(data.data.msg);
                        }
                    });
                }
            },
            components: {
                getVercode: ygg.template.getVercode
            }
        });
    });
});