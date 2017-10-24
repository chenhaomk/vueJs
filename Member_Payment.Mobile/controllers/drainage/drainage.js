require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
        var imgurl = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%2F", "/").replace("%3A", ":");
        if (imgurl.indexOf("https") < 0)
            imgurl = "https://img.yingougou.com/" + imgurl;
        if (main.getQueryString("img") != null && main.getSession("img") == null)
            main.setSession("img", imgurl);
        var vm = new vue({
            el: "#app",
            data: {
                phone: "",
                verificationCode: "",
                img: imgurl,
                b_n: decodeURI(main.getQueryString("b_n") == null ? main.getSession("b_n") : main.getQueryString("b_n")),
                a_n: decodeURI(main.getQueryString("a_n") == null ? main.getSession("a_n") : main.getQueryString("a_n")) + "ㆍ" + decodeURI(main.getQueryString("c_n") == null ? main.getSession("c_n") : main.getQueryString("c_n")).replace("%2F", "/"),
                how: "",
                all: "",
                time: "",
<<<<<<< HEAD
                willShow: true,
=======
                willShow:true,
>>>>>>> 3c21db814f7f0f0c927d9b649fe7a7f97ff3ed56
                // willHide:false
            },
            methods: {
                getVerification: function () {
                    var ver = document.getElementById("verifia");
                    if (parseInt(ver.getAttribute("t")) > 0)
                        return;
                    if (this.phone == null || this.phone == "") {
                        main.prompt("请输入手机号"); //后期需要弹出效果
                        return;
                    }
                    if (!(/^1[34578]\d{9}$/.test(this.phone))) {
                        main.prompt("手机号码有误，请重填");
                        return false;
                    }
                    main.post("common/sendVerificationCode", {
                        mobile: this.phone,
                        sms_type: "0009"
                    }, function (res) {
                        if (res.errCode < 0)
                            main.prompt(res.errMsg);
                        var data = res.data;
                        if (data == null || data.code != 200) {
                            main.prompt(data.msg); //此类提示较为后台化，可根据实际情况修改与用户的会话
                            return;
                        }
                        ver.setAttribute("value", "60s");
                        ver.setAttribute("t", "60");
                        time = setInterval(timetick, 1 * 1000);
                    });
                },
                verificationSubmit: function () {
                    if (this.phone == null || this.phone == "") {
                        main.prompt("请输入手机号"); //后期需要弹出效果
                        return;
                    }
                    if (this.verificationCode == null || this.verificationCode == "") {
                        main.prompt("请输入验证码"); //后期需要弹出效果
                        return;
                    }
                    var data = {};
                    data.business_id = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id");
                    data.phone = vm.phone;
                    data.valid_code = vm.verificationCode;
                    if (main.getQueryString("m_id") != null)
                        data.member_id = main.getQueryString("m_id");
                    main.post("common/shareTicket",
                        data,
                        function (res) {
                            if (res.errCode < 0)
                                main.prompt(res.errMsg);
                            var data = res.data;
                            if (data == null || data.code != 200) {
                                //main.prompt("数据有误"); //此类提示较为后台化，可根据实际情况修改与用户的会话
                                main.prompt(data.msg);
                                //location.href = "newDrainagefalt.html";
                                return;
                            }
                            if (data.data != null) {
                                if (data.data[1001] != null)
                                    main.prompt(data.data[1001]);
                                if (data.data[9009] != null)
                                    main.prompt(data.data[9009]);
                                if (data.data[9012] != null)
                                    main.prompt(data.data[9012]);
                                if (data.data[9013] != null)
                                    main.prompt(data.data[9013]);
                                if (data.data[9015] != null)
                                    main.prompt(data.data[9015]);
                                if (data.data[9016] != null)
                                    main.prompt(data.data[9016]);
                                if (data.data[9017] != null)
                                    main.prompt(data.data[9017]);
                                return;

                            }
                            main.setSession("img", decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%3A", ":"));
                            main.setSession("b_n", main.getQueryString("b_n") == null ? main.getSession("b_n") : main.getQueryString("b_n"));
                            location.href = "newDrainageSucc.html";
                        });
                },
                dowm: function () {
                    var ua = navigator.userAgent.toLowerCase();
                    if (/iphone|ipad|ipod/.test(ua)) {
                        window.open("https://itunes.apple.com/cn/app/id1273704196");
                    } else if (/android/.test(ua)) {
                        window.open("https://dl.yingougou.com/Android/ygg_app-release.apk");
                    }
                    //m.yingougou.com/download.html 
                },
                linkH5: function () {
                    location.href = "https://m.yingougou.com/";
                }
            }
        });
        var time = null;

        function timetick() {
            var ver = document.getElementById("verifia");
            if (parseInt(ver.getAttribute("t")) > 0) {
                var newt = parseInt(ver.getAttribute("t")) - 1;
                ver.setAttribute("t", newt);
                ver.setAttribute("value", newt + "s")
            } else if (parseInt(ver.getAttribute("t")) <= 0) {
                ver.setAttribute("t", "0");
                ver.setAttribute("value", "获取验证码");
                clearInterval(time);
            }
        }

        function init() {
            main.post("common/getShareCouponActivity", {
                business_id: main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id")
            }, function (res) {
                if (res.errCode < 0)
                    main.prompt(res.errMsg);
                var data = res.data;
                var bn = decodeURI(main.getQueryString("b_n") == null ? main.getSession("b_n") : main.getQueryString("b_n"));
                var img = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%2F", "/").replace("%3A", ":");
                if (main.getSession("b_n") == null || main.getSession("b_n") == "null")
                    main.setSession("b_n", bn);
                if (main.getSession("img") == null || main.getSession("img") == "null")
                    main.setSession("img", img);
                var jsonString = JSON.stringify(data.data);
                if (data == null || jsonString == "{}" || data.code != 200) {
                    // debugger;
                    location.href = "newDrainagefalt.html";
                    return;
                }
                data = data.data;
                if (data.type == 0)
                    vm.how = data.discount;
                else if (data.type == 1)
                    vm.how = data.rate * 10 + "折";
                vm.all = "满" + data.min_price + "可用";
                vm.time = main.getd('y.m.d', data.begin_date / 1000) + "-" + main.getd('y.m.d', data.end_date / 1000);
                if (main.getSession("sn") != null)
                    main.clearSessionItem("sn");
            });
        }
        //初始化
        if (location.href.indexOf("drainageLogin.html") >= 0)
            init();
        // debugger;
        if (location.href.indexOf("newDrainagefalt.html") >= 0) {
            var bn = main.getSession("b_n"),
                bn_1 = main.getQueryString("b_n");
            if (bn != null)
                vm.b_n = decodeURI(bn);
            else if (bn_1 != null)
                vm.b_n = decodeURI(bn_1);
        }
        if (location.href.indexOf("newDrainageSucc.html") >= 0) {
            vm.b_n = decodeURI(main.getSession("b_n"));
        }

        setTimeout(function () {
            vm.willShow = false;
            // vm.willHide = true
<<<<<<< HEAD
        }, 1000)
=======
        },1000)
>>>>>>> 3c21db814f7f0f0c927d9b649fe7a7f97ff3ed56
    });

});