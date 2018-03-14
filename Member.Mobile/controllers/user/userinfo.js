require(['config'],function(){
    require(['vue','main','imgup'],function (Vue,ygg,OSS) {

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
                newVercode : "",
                pwdShow : "",
                pwd : "",
                rpwd : "",
                isOk : false
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
			        		ygg.prompt("修改成功！");
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
                blurTip : function(s,t,r){
                    this.isOk = ygg.verify(s,t,r);
                }
            },
            components : {
                getVercode : ygg.template.getVercode 
            }
        }),
        member_id = ygg.getCookie("member_id");

        if(!member_id)window.open('http://'+window.location.host,"_self");
        ygg.getClient(OSS);
    	
    	ygg.ajax('/member/getPersonCenterInfo',{
            member_id : member_id
        },function(data){

            data = data.data;

            vm.$set(vm,"user",data);
            vm.$set(vm,"nickName",data.nick_name);

        });

    });
});