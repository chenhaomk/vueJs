require(['config'], function () {
    require(['vue', 'main', 'imgup', 'axio'], function (Vue, ygg, OSS, axio) {

        // 百度地图API功能
        var map = new BMap.Map("container");
        var maeker;
        getLocation();
        console.log(map)
        function getLocation() {
            var geolocation = new BMap.Geolocation();
            var geolocationControl = new BMap.GeolocationControl({
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            });
            geolocationControl.addEventListener("locationSuccess", function (e) {
                removeMk(maeker);
                geoPint(e.point)
            });
            geolocationControl.addEventListener("locationError", function (e) {
                // 定位失败事件
                alert(e.message);
            });
            map.addControl(geolocationControl);
            var geolocationControl = new BMap.GeolocationControl();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    maeker = new BMap.Marker(r.point);
                    map.centerAndZoom(r.point, 16);
                    map.addOverlay(maeker);
                    map.panTo(r.point);
                    geoPint(r.point)
                }

            }, {
                enableHighAccuracy: true
            })
        }
        var isInit = false;

        function removeMk(mk) {
            map.removeOverlay(mk);
        }
        var shopDetil = JSON.parse(sessionStorage.getItem("shopDetil"));
        var warp = new Vue({
            el: '#footer',
            data: {
                message: ''
            },
            methods: {
                getMyLocation: function () {
                    pointMap();
                }
            }
        });
        var app = new Vue({
            el: "#app",
            data: {

            },
            methods: {
                back: function () {
                    // console.log(shopDetil);
                    window.history.go(-1);
                }
            }
        });

        function geoPint(point) {

            axio.get("http://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + point.lng + "," + point.lat + "&coordsys=baidu&output=JSON&key=9781ab13347d6669085c90a7db3809e6").then(function (res) {
                // shopDetil.lat = res.data.locations.split(",")[0];
                // shopDetil.lng = res.data.locations.split(",")[1];
                // sessionStorage.setItem("shopDetil", JSON.stringify(shopDetil));
                // if (shopDetil != null) {
                //     warp.message = shopDetil.address;
                // }
                // if (!isInit)
                //     pointMap();
                // isInit = true;
                console.log(res)
            }).catch(function (err) {

            });
        }

        function pointMap() {
            // if (shopDetil == null) {
            //     alert("数据错误，请返回重试!");
            //     return;
            // }
            // var adr = shopDetil.address == null ? "" : shopDetil.address;
            // if (warp.message != null && warp.message != undefined && warp.message != "")
            //     adr = warp.message;
            // if (adr != null && adr != undefined && adr != "") {
                var myGeo = new BMap.Geocoder();
                // var str = warp.message;
                myGeo.getPoint("顺城街", function (point) {
                    if (point) {
                        // shopDetil.address = str;
                        geoPint(point);
                        removeMk(maeker);
                        map.centerAndZoom(point, 16);
                        maeker = new BMap.Marker(point);
                        map.addOverlay(maeker);
                        // shopDetil.lat = point.lat;
                        // shopDetil.lng = point.lng;
                        // sessionStorage.setItem("shopDetil", JSON.stringify(shopDetil));
                        return;
                    } else {
                        alert("您选择地址没有解析到结果!");
                    }
                }, "成都市");
            // } else {
            //     //alert("请填写详细地址!");
            // }
        }
    });
});