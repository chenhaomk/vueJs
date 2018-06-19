require(['config'],function(){
    require(['vue','main'],function (Vue,ygg) {
    	var vm = new Vue({
            el : "#app",
            data : {
               city:"",//当前城市
               position:"",//定位城市
               position_id:"",//高德定位area_id
               open_province:[],//开通的省
               open_city:[]//开通的城市列表
            },
            methods : {
                change_city:function(list){
                    ygg.setCookie('location_act','true')
                    ygg.setCookie('city_name', list.name);
                    ygg.setCookie('lng', list.area_lng);
                    ygg.setCookie('lat', list.area_lat);
                    window.location.href="/index.html?area_id="+list.area_id+"&name="+encodeURIComponent(list.name);
                },
                position_city:function(){
                    ygg.setCookie('location_act','false')
                    ygg.setCookie('city_name', this.position);
                    window.location.href="/index.html?area_id="+this.position_id+"&name="+encodeURIComponent(this.position);
                }
            }
        });
        ygg.ajax('/common/getOpenCityInProvince', {},function (data) {
            data = data.data.open_city_array;
            vm.open_city = data
            console.log(vm.open_city)
        });
        vm.city=decodeURIComponent(window.location.href.split("?")[1].split("=")[1]);//获取当前城市
        var citysearch = new AMap.CitySearch();//高德定位当前城市
        citysearch.getLocalCity(function (status, result) {
            vm.position=result.city
            vm.position_id=result.adcode
            ygg.setCookie('area_id', result.adcode);
        })
        var geolocation=new AMap.Geolocation({
            enableHighAccuracy: true
        });//精确定位
        geolocation.getCurrentPosition(function(status,result){
            if(result){
                if(result.status===0)return
                ygg.setCookie('lng', result.position.lng);
                ygg.setCookie('lat', result.position.lat);
            }
        })
        
    });
});