require(['config'],function(){
    require(['vue','main','imgup'],function (Vue,ygg,OSS) {
		var member_id,
			auth_code,
			app_id,
			code,
			bType
		function browserType() {
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return "weixin"
			} else if(ua.match(/Alipay/i)=="alipay"){
				return "alipay";
			}else {
				return "other"
			}
		}
		bType = browserType()
    	var vm = new Vue({
            el : "#app",
            data : {
                user : {},
                nickName : "",
                nkShow : "",
                telShow : "",
                bindPhone : "",
                hasTelShow : "",
                vercode : "",
				phone : "",
				bdphone:"",
				newVercode : "",
				bindVercode:"",
                pwdShow : "",
                pwd : "",
                rpwd : "",
				isOk : false,
				isBindWx:'绑定',
				isBindZfb:'绑定',
				isBindPhone:'绑定',
				wxImg:'../../assets/images/member/no_wx.png',
				zfbImg:'../../assets/images/member/no_zfb.png',
				phImg:'../../assets/images/member/ic_phone1_xxh.png'
            },
            methods : {
                updatePhoto : function(e){
                	ygg.loading(true);
                	ygg.uploadImg(e.target.files,function(names){
                		ygg.ajax('/member/updateMemberHeadPortrait',{
				            member_id : member_id,
				            head_portrait : names[0]
				        },function(data){

				            data = data.data;
				            vm.$set(vm.user,"head_portrait",data.head_portrait);
				            ygg.loading(false);

				        });
                    });
                },
                clearNk : function(){
                	this.nickName = "";
                },
                returnInfo : function(){
                	this.nickName = this.user.nick_name;
                	this.nkShow = "";
                },
                updateNk : function(e){
                	e.preventDefault();
                	var that = this;
                	var ta=this.nickName.split(""),str_l=0;
					var str_fa=Number(ta[0].charCodeAt());
					if((str_fa>=65&&str_fa<=90)||(str_fa>=97&&str_fa<=122)||(str_fa>255)){
					    for(var i=0;i<=ta.length-1;i++){
					        str_l++;
					        if(ta[i]>255){str_l++;}
					    }
					    if(str_l>=4&&str_l<=16){
					    	ygg.loading(true);
		                	ygg.ajax('/member/updateMemberNickName',{
					            member_id : member_id,
					            nick_name : that.nickName
					        },function(data){
					        	ygg.loading(false);
					        	if(data.status == "success"){
					        		data = data.data;
					        		vm.$set(vm.user,"nick_name",that.nickName);
					        		ygg.prompt("修改成功！");
					        	}else if(data.status == "error"){
					        		ygg.prompt(data.msg);
					        	}

					        });
					    }else{
					    	ygg.prompt("无效的用户名！");
					    }
					}	
                },
                updatePhone : function(e){
                	e.preventDefault();
                	var that = this;
                	ygg.ajax('/member/updateMobile',{
			            old_mobile : that.user.mobile,
			            old_verification_code : that.vercode,
			            new_mobile : that.phone,
			            new_verification_code : that.newVercode
			        },function(data){
			        	ygg.loading(false);
			        	if(data.status == "success"){
			        		data = data.data;
			        		vm.$set(vm.user,"mobile",that.phone);
			        		ygg.prompt("手机号修改成功！");
			        	}else if(data.status == "error"){
			        		ygg.prompt(data.msg);
			        	}

			        });
                },
                updatePwd : function(e){
                	e.preventDefault();
                	var that = this;

                	if(this.pwd.length == 0 || this.rpwd.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
                    }

                    if(that.pwd != that.rpwd){
                        ygg.prompt("两次密码不一致！");
                        return;   
                    }

                	if(this.isOk){
                        ygg.prompt("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
                        return;
                    }

                    ygg.ajax('/member/updatePwd',{
			            member_id : member_id,
			            password : that.pwd
			        },function(data){
			        	ygg.loading(false);
			        	if(data.status == "success"){
			        		data = data.data;
			        		ygg.prompt("修改成功！");
                            window.history.go(-1)
			        	}else if(data.status == "error"){
			        		ygg.prompt(data.msg);
			        	}

			        });

				},
				bpCommit:function (e) {//绑定手机
					e.preventDefault();
					if(this.bdphone.length == 0 || this.bindVercode.length == 0){
                        ygg.prompt("请您仔细填写信息，不能有空哦！");
                        return;
					}
					var that = this
					ygg.loading(true);
                    ygg.ajax('/member/bindMemberAccount',{
			            member_id : member_id,
						mobile: that.bdphone,
						verification_code:that.bindVercode
			        },function(data){
			        	ygg.loading(false);
			        	if(data.status == "success"){
							ygg.prompt("手机号绑定成功!");
							vm.$set(vm.user,"mobile",that.bdphone);
							vm.isBindPhone = '更换'
							vm.phImg = '../../assets/images/member/yes_phone.png'
			        	}else if(data.status == "error"){
			        		ygg.prompt(data.msg);
			        	}

			        });
				},
                blurTip : function(s,t,r){
                    this.isOk = ygg.verify(s,t,r);
				},
				bindwx:function (e) {
					e.preventDefault();
					// if(this.isBindWx == '绑定') {
					// 	if(bType == 'weixin') {
					// 		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
					// 	}else {
					// 		window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb8605b32e044c45b&redirect_uri=https%3a%2f%2fm.yingougou.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
					// 	}
					// }else {
						if(bType == 'weixin') {
							window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
						}else {
							window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb8605b32e044c45b&redirect_uri=https%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
						}
					// }

				},
				bindzfb:function (e) {
					e.preventDefault();
					// window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_urihttps%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html'
					window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_uri%3Dhttps%3A%2F%2Fm.yingougou.com'
					// if(that.isBindZfb == '绑定') {
					// 	window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_urihttps%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html'
					// }else {
					// 	window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fopenauth.alipay.com%2Foauth2%2FpublicAppAuthorize.htm%3Fapp_id%3D2018030802337414%26scope%3Dauth_user%26redirect_urihttps%3a%2f%2fm.yingougou.com%2fviews%2fuser%2fuserinfo.html'
					// }
				},
				bindph:function () {
					if(this.isBindPhone == '绑定') {
						this.bindPhone = 'show'
					}else {
						this.telShow = 'show'
					}
				},
				setpwd:function () {
					if(this.isBindPhone == '绑定') {
						this.bindPhone = 'show'
					}else {
						this.pwdShow = 'show'
					}
				}
            },
            components : {
                getVercode : ygg.template.getVercode 
            }
		}),
		auth_code = ygg.getQueryString("auth_code")
		app_id = ygg.getQueryString("app_id")
		code = ygg.getQueryString("code")
		member_id = ygg.getCookie("member_id");
		if(auth_code != null && app_id != null ) {//用户在当前页面绑定支付宝或者更换支付宝账号授权后的回调参数
			ygg.ajax('/passport/getZfbUserInfo', {//通过回调code先获取要更换的支付宝账户信息
				app_id: app_id,
				auth_code:auth_code
			}, function (data) {
				if (data.status == "error") {
					ygg.prompt(data.msg);
				} else if (data.status == "success") {
					var params = {
						user_id:data.data.user_id,
						member_id:member_id
					}
					ygg.ajax('/member/bindOrChangeZfb',params, function (data) {//更换支付宝
						var msg = data.msg
						if (data.status == "error") {
							ygg.prompt(data.msg);
						} else if (data.status == "success") {
							ygg.ajax('/member/getPersonCenterInfo',{
								member_id : member_id
							},function(data){					
								data = data.data;
								vm.$set(vm,"user",data);
								vm.$set(vm,"nickName",data.nick_name);
								if(data.zfb_openid != null) {
									vm.isBindWx = '更换'
									vm.wxImg='../../assets/images/member/ic_wei_xxh.png'
								}
								if(data.wx_openid != null) {
									vm.isBindWx = '更换'
									vm.zfbImg = '../../assets/images/member/ic_zhi_xxh.png'
								}
								if(data.mobile != null) {
									vm.isBindPhone = '更换'
									vm.phImg = '../../assets/images/member/yes_phone.png'
								}
								ygg.prompt(msg);
								// vm.hasTelShow = 'show'
							});						
						}
					});
				}
			});
		}else if(code != null) {//用户通过微信授权
			var wx_type
			if(bType == 'weixin') {
				wx_type = 0
			}else {
				wx_type = 1
			}
			ygg.ajax('/passport/getWxUnionId',{
				code:code,
				wx_type:wx_type
			},function(data){
				if(data.status == 'error') {
					ygg.prompt('请重新更换');
				}else if(data.status == 'success') {
					var obj = {
						wx_unionid:data.data.unionid,
						member_id:member_id,
						wx_openid: data.data.openid
					}
					ygg.ajax('/member/bindOrChangeWx',obj,function(data){//更换微信
						var msg = data.msg
						if(data.status == 'error') {
							ygg.prompt(data.msg);
						}else if(data.status == 'success') {
							var obj = {
								wx_unionid:data.data.unionid,
								nick_name : data.data.nick_name,
								openid : data.data.openid
							}
							ygg.ajax('/member/getPersonCenterInfo',{
								member_id : member_id
							},function(data){					
								data = data.data;
								vm.$set(vm,"user",data);
								vm.$set(vm,"nickName",data.nick_name);
								if(data.zfb_openid != null) {
									vm.isBindWx = '更换'
									vm.wxImg='../../assets/images/member/ic_wei_xxh.png'
								}
								if(data.wx_openid != null) {
									vm.isBindWx = '更换'
									vm.zfbImg = '../../assets/images/member/ic_zhi_xxh.png'
								}
								if(data.mobile != null) {
									vm.isBindPhone = '更换'
									vm.phImg = '../../assets/images/member/yes_phone.png'
								}
								ygg.prompt(msg);
								// vm.hasTelShow = 'show'
							});			
						}
					})
				}
			})
		}else {//用户正常进入页面
			if(!member_id)window.open('http://'+window.location.host,"_self");
			ygg.getClient(OSS);
			ygg.ajax('/member/getPersonCenterInfo',{
				member_id : member_id
			},function(data){
				data = data.data;
				vm.$set(vm,"user",data);
				vm.$set(vm,"nickName",data.nick_name);
				if(data.wx_openid != null) {
					vm.isBindWx = '更换'
					vm.wxImg='../../assets/images/member/ic_wei_xxh.png'
				}
				if(data.zfb_openid != null) {
					vm.isBindZfb = '更换'
					vm.zfbImg = '../../assets/images/member/ic_zhi_xxh.png'
				}
				if(data.mobile != null) {
					vm.isBindPhone = '更换'
					vm.phImg = '../../assets/images/member/yes_phone.png'
				}
				// vm.hasTelShow = 'show'
			});
		}



		// hasTelShow ()
		// function hasTelShow () {
		// 	if(ygg.getCookie("zfb_is_bind") == 'false' || ygg.getCookie("wx_is_bind") == 'false' ) {
		// 		vm.hasTelShow = 'show' //显示账号管理
		// 	}
		// }
    });
});