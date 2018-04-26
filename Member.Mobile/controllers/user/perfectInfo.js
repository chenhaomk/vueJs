require(['config'],function(){
  require(['axio','vue','main'],function (axio,Vue,ygg) {
      var vm = new Vue({
          el : "#app",
          data : {
              active : 0,
              phone : "",
              vercode : "",
              userId : "",
              pwd : "",
              cs : 0,
              ver : "",
              vshow : false
          },
          methods : {
              bingPhone : function(e){
                  event.preventDefault();
                  window.event.returnValue = false;
                  var that = this;
                  if(that.phone.length == 0 || that.vercode.length == 0){
                      ygg.prompt("请您仔细填写信息，不能有空哦！");
                      return;
                  }
                  if (!(/^1[34578]\d{9}$/.test(that.phone))){
                      ygg.prompt("请输入合理的手机号码！");
                      return
                  }
                  ygg.ajax('/member/bindMemberAccount',{
                      mobile : that.phone,
                      verification_code : that.vercode
                  },function(data){
                      if(data.status == "error"){
                        ygg.prompt(data.msg);
                      }else if(data.status == "success"){
                        // console.log(data.data)
                        window.open("/index.html","_self");
                      }
                  });
              },
          },
          components : {
              getVercode : ygg.template.getVercode 
          }
      });


  });
});