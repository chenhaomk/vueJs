require(['config'], function () {
    require(['vue', 'main', 'imgup'], function (Vue, ygg, OSS) {

        var member_id,
			auth_code,
			app_id,
			code,
			bType
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
					user: {},
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
                    serviceShow: false,
                    bindPhone: "",
                    hasTelShow: "",
					bindVercode: "",
					telShow: "",
                    bdphone: "",
                    pwdShow:"",
					phone: "",
					pwd: "",
					rpwd: "",
					newVercode: "",
					vercode: "",
                    isBindWx: '绑定',
					isBindZfb: '绑定',
					isBindPhone: '绑定',
                    wxImg: '../../../assets/images/member/no_wx.png',
					zfbImg: '../../../assets/images/member/no_zfb.png',
					phImg: '../../../assets/images/member/ic_phone1_xxh.png'
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
                    },
					updatePhone: function (e) {
						e.preventDefault();
						var that = this;
						ygg.ajax('/member/updateMobile', {
							old_mobile: that.user.mobile,
							old_verification_code: that.vercode,
							new_mobile: that.phone,
							new_verification_code: that.newVercode
						}, function (data) {
							ygg.loading(false);
							if (data.status == "success") {
								data = data.data;
								vm.$set(vm.user, "mobile", that.phone);
								ygg.prompt("手机号修改成功！");
							} else if (data.status == "error") {
								ygg.prompt(data.msg);
							}

						});
					},
					updatePwd: function (e) {
						e.preventDefault();
						var that = this;

						if (this.pwd.length == 0 || this.rpwd.length == 0) {
							ygg.prompt("请您仔细填写信息，不能有空哦！");
							return;
						}

						if (that.pwd != that.rpwd) {
							ygg.prompt("两次密码不一致！");
							return;
						}

						if (this.isOk) {
							ygg.prompt("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
							return;
						}

						ygg.ajax('/member/updatePwd', {
							member_id: member_id,
							password: that.pwd
						}, function (data) {
							ygg.loading(false);
							if (data.status == "success") {
								data = data.data;
								ygg.prompt("修改成功！");
								window.history.go(-1)
							} else if (data.status == "error") {
								ygg.prompt(data.msg);
							}

						});

					},
					bpCommit: function (e) { //绑定手机
						e.preventDefault();
						if (this.bdphone.length == 0 || this.bindVercode.length == 0) {
							ygg.prompt("请您仔细填写信息，不能有空哦！");
							return;
						}
						var that = this
						ygg.loading(true);
						ygg.ajax('/member/bindMemberAccount', {
							member_id: member_id,
							mobile: that.bdphone,
							verification_code: that.bindVercode
						}, function (data) {
							ygg.loading(false);
							if (data.status == "success") {
								ygg.prompt("手机号绑定成功!");
								vm.bindPhone = 'show'
								vm.$set(vm.user, "mobile", that.bdphone);
								vm.isBindPhone = '更换'
								vm.phImg = '../../assets/images/member/yes_phone.png'
							} else if (data.status == "error") {
								ygg.prompt(data.msg);
							}

						});
					},
					blurTip: function (s, t, r) {
						this.isOk = ygg.verify(s, t, r);
					},
					bindwx: function (e) {
						e.preventDefault();
						// if(this.isBindWx == '绑定') {
						// 	if(bType == 'weixin') {
						// 		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
						// 	}else {
						// 		window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb8605b32e044c45b&redirect_uri=https%3a%2f%2fm.yingougou.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
						// 	}
						// }else {
						if (bType == 'weixin') {
							window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
						} else {
							window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb8605b32e044c45b&redirect_uri=https%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
						}
						// }

					},
					bindzfb: function (e) {
						e.preventDefault();
						// window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_urihttps%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html'
						window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_uri%3Dhttps%3A%2F%2Fm.yingougou.com'
						// if(that.isBindZfb == '绑定') {
						// 	window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_urihttps%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html'
						// }else {
						// 	window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_urihttps%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html'
						// }
					},
					bindph: function () {
						if (this.isBindPhone == '绑定') {
							this.bindPhone = 'show'
						} else {
							this.telShow = 'show'
						}
					},
					setpwd: function () {
						if (this.isBindPhone == '绑定') {
							this.bindPhone = 'show'
						} else {
							this.pwdShow = 'show'
						}
					}
                },
                components: {
                    popup: ygg.template.popup,
                    uploader: ygg.template.uploader2,
                    feedback: ygg.template.feedback
                }
            }),
        auth_code = ygg.getQueryString("auth_code")
		app_id = ygg.getQueryString("app_id")
		code = ygg.getQueryString("code")
		member_id = ygg.getCookie("member_id");
		if (auth_code != null && app_id != null) { //用户在当前页面绑定支付宝或者更换支付宝账号授权后的回调参数
			ygg.ajax('/passport/getZfbUserInfo', { //通过回调code先获取要更换的支付宝账户信息
				app_id: app_id,
				auth_code: auth_code
			}, function (data) {
				if (data.status == "error") {
					ygg.prompt(data.msg);
				} else if (data.status == "success") {
					var params = {
						user_id: data.data.user_id,
						member_id: member_id
					}
					ygg.ajax('/member/bindOrChangeZfb', params, function (data) { //更换支付宝
						var msg = data.msg
						if (data.status == "error") {
							ygg.prompt(data.msg);
						} else if (data.status == "success") {
							ygg.ajax('/member/getPersonCenterInfo', {
								member_id: member_id
							}, function (data) {
								data = data.data;
								vm.$set(vm, "user", data);
								vm.$set(vm, "nickName", data.nick_name);
								if (data.zfb_openid != null) {
									vm.isBindWx = '更换'
									vm.wxImg = '../../../assets/images/member/ic_wei_xxh.png'
								}
								if (data.wx_openid != null) {
									vm.isBindWx = '更换'
									vm.zfbImg = '../../../assets/images/member/ic_zhi_xxh.png'
								}
								if (data.mobile != null) {
									vm.isBindPhone = '更换'
									vm.phImg = '../../../assets/images/member/yes_phone.png'
								}
								ygg.prompt(msg);
								// vm.hasTelShow = 'show'
							});
						}
					});
				}
			});
		} else if (code != null) { //用户通过微信授权
			var wx_type
			if (bType == 'weixin') {
				wx_type = 0
			} else {
				wx_type = 1
			}
			ygg.ajax('/passport/getWxUnionId', {
				code: code,
				wx_type: wx_type
			}, function (data) {
				if (data.status == 'error') {
					ygg.prompt('请重新更换');
				} else if (data.status == 'success') {
					var obj = {
						wx_unionid: data.data.unionid,
						member_id: member_id,
						wx_openid: data.data.openid
					}
					ygg.ajax('/member/bindOrChangeWx', obj, function (data) { //更换微信
						var msg = data.msg
						if (data.status == 'error') {
							ygg.prompt(data.msg);
						} else if (data.status == 'success') {
							var obj = {
								wx_unionid: data.data.unionid,
								nick_name: data.data.nick_name,
								openid: data.data.openid
							}
							ygg.ajax('/member/getPersonCenterInfo', {
								member_id: member_id
							}, function (data) {
								data = data.data;
								vm.$set(vm, "user", data);
								vm.$set(vm, "nickName", data.nick_name);
								if (data.zfb_openid != null) {
									vm.isBindWx = '更换'
									vm.wxImg = '../../../assets/images/member/ic_wei_xxh.png'
								}
								if (data.wx_openid != null) {
									vm.isBindWx = '更换'
									vm.zfbImg = '../../../assets/images/member/ic_zhi_xxh.png'
								}
								if (data.mobile != null) {
									vm.isBindPhone = '更换'
									vm.phImg = '../../../assets/images/member/yes_phone.png'
								}
								ygg.prompt(msg);
								// vm.hasTelShow = 'show'
							});
						}
					})
				}
			})
		} else { //用户正常进入页面
			if (!member_id) window.open('http://' + window.location.host, "_self");
			ygg.getClient(OSS);
			ygg.ajax('/member/getPersonCenterInfo', {
				member_id: member_id
			}, function (data) {
				data = data.data;
				vm.$set(vm, "user", data);
				vm.$set(vm, "nickName", data.nick_name);
				if (data.wx_openid != null) {
					vm.isBindWx = '更换'
					vm.wxImg = '../../../assets/images/member/ic_wei_xxh.png'
				}
				if (data.zfb_openid != null) {
					vm.isBindZfb = '更换'
					vm.zfbImg = '../../../assets/images/member/ic_zhi_xxh.png'
				}
				if (data.mobile != null) {
					vm.isBindPhone = '更换'
					vm.phImg = '../../../assets/images/member/yes_phone.png'
				}
				// vm.hasTelShow = 'show'
			});
		}
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