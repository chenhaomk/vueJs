require(['config'], function () {
    require(['vue', 'main', 'imgup'], function (Vue, ygg, OSS) {

        var vm = new Vue({
                el: "#app",
                data: {
                    popup: {
                        content: "爱你！在这里等你哟~",
                        double: true,
                        canle: "取消",
                        confi: "确认退出",
                        isShow: false,
                        canleCb: function () {
                            vm.isShowShadow = false;
                        },
                        confiCb: function () {
                            ygg.delCookie("member_id");
                            ygg.delCookie("mobile");
                            ygg.delCookie("token");
                            ygg.delCookie("area_id");
                            window.open('http://' + window.location.host, "_self");
                        }
                    },
                    isShowShadow: false,
                    disShow: false,
                    val: "checked",
                    ss: 0,
                    fbShow: false,
                    content: "",
                    imgs: [],
                    names: [],
                    textSize: 200,
                    myfbShow: false,
                    list: [],
                    myfbdShow: false,
                    fbDetail: {},
                    aboutusShow: false,
                    aboutustShow: false,
                    serviceShow: false
                },
                methods: {
                    loginOut: function () {
                        var that = this;
                        this.$set(this.popup, "isShow", true);
                        this.isShowShadow = true;
                    },
                    update: function () {
                        ygg.ajax('/member/updateMemberCouponSetting', {
                            member_id: ygg.getCookie("member_id"),
                            select_setting: vm.ss
                        }, function (data) {
                            ygg.prompt("设置成功！");
                            ygg.setCookie("select_setting", vm.ss);
                        });
                    },
                    radio: function (i) {
                        this.ss = i;
                    },
                    getData: function (a) {
                        this.$set(this, 'imgs', a);
                        su = false;
                    },
                    send: function () {
                        ygg.loading(true);
                        var that = this;
                        if (that.imgs.length == 0 && that.content.length == 0) {
                            ygg.prompt("请您说点什么或上传图片！");
                            ygg.loading(false);
                            return;
                        }
                        if (su) {
                            submit();
                            return;
                        }
                        ygg.uploadImg(that.imgs, function (names) {
                            su = true;
                            that.names = names;
                            submit();
                        });
                    },
                    textarea: function () {
                        this.textSize = 200 - this.content.length;
                    },
                    myFk: function () {
                        var that = this;
                        ygg.loading(true);
                        ygg.ajax("/member/getMemberFeedBacks", {
                            member_id: member_id,
                            page: 1,
                            size: 1000
                        }, function (d) {
                            d = d.data;
                            that.myfbShow = 'show';
                            that.$set(that, "list", d.member_feedback_list);
                            ygg.loading(false);
                        });
                    },
                    getfbDetail: function (id) {
                        var that = this;
                        ygg.loading(true);
                        ygg.ajax("/member/getMemberFeedbackDetail", {
                            member_feedback_id: id
                        }, function (d) {
                            d = d.data;
                            if (d.status == 0) {
                                d.zjTime = ygg.getd("Y.m.d H:i", d.create_date / 1000);
                            } else {
                                d.zjTime = ygg.getd("Y.m.d H:i", d.deal_date / 1000);
                            }
                            that.$set(that, "fbDetail", d);
                            that.myfbdShow = 'show';
                            ygg.loading(false);
                        });
                    }
                },
                components: {
                    popup: ygg.template.popup,
                    uploader: ygg.template.uploader2,
                    feedback: ygg.template.feedback
                }
            }),
            su = true,
            member_id = ygg.getCookie("member_id"),
            popupEl = document.getElementById("popup");

        if (!member_id) window.open("/", "_self");

        var ra1 = document.getElementById("ra1");
        var ra2 = document.getElementById("ra2");
        if (ygg.getCookie("select_setting") == "1") {
            ra1.removeAttribute("checked");
            ra2.setAttribute("checked", true);
        }

        ygg.getClient(OSS);

        function submit() {
            ygg.ajax("/member/addMemberFeedback", {
                member_id: member_id,
                content: vm.content,
                imgs: vm.names
            }, function (d) {
                vm.myfbShow = 'show';
                ygg.ajax("/member/getMemberFeedBacks", {
                    member_id: member_id,
                    page: 1,
                    size: 1000
                }, function (d) {
                    d = d.data;
                    vm.$set(vm, "list", d.member_feedback_list);
                    ygg.loading(false);
                });
            });
        }

    });
});