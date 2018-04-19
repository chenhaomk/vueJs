require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {
    	var vm = new Vue({
            el : "#app",
            data : {
               city:"",//当前城市
               position:"",//定位城市
               position_id:"",//高德定位area_id
               open_city:[]//开通的城市列表
            },
            methods : {
                change_city:function(list){
                    console.log(list)
                    window.location.href="/index.html?area_id="+list.area_id+"&name="+encodeURIComponent(list.name);
                },
                position_city:function(){
                    window.location.href="/index.html?area_id="+this.position_id+"&name="+encodeURIComponent(this.position);
                }
            }
        });
        ygg.ajax('/common/getOpenCity', {},function (data) {
            data = data.data;
            vm.open_city = data.open_city_list
            console.log(data)
        });
        vm.city=decodeURIComponent(window.location.href.split("?")[1].split("=")[1]);//获取当前城市
        var citysearch = new AMap.CitySearch();//高德定位当前城市
        citysearch.getLocalCity(function (status, result) {
            vm.position=result.city
            vm.position_id=result.adcode
            console.log(result)
        })
    });
});