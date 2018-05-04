require(['config'], function () {
  require(['vue'], function ( vue) {
    var vm = new vue({
      el:"#app",
      data:{
      },
      methods:{
        closePage:function() {
          WeixinJSBridge.invoke('closeWindow',{},function(res){
            
          });
        }
      },
    });
  })
});
