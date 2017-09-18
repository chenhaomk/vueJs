define(function(){
    require.config({
        baseUrl: '/plugins',
        paths: {
            "jq": ["jquery/jquery-3.2.1.min"],
            "angle": ["jquery/angle"],
            "aes" : ['md5/aes'],
            "idcode" : ['idcode/jquery.idcode'],
            "citys" : ['jquery/citys'],
            "zclip" : ['jquery/jquery.zclip.min'],
            "bankBin" : ['bankBin'],
            "qrcode" : ['qrcode'],
            'gaode' : ["https://webapi.amap.com/maps?v=1.3&key=a9506f1b1e66b4e85d7e15c8461ca4d4&plugin=AMap.CitySearch"],
            'imgup' : ["https://gosspublic.alicdn.com/aliyun-oss-sdk-4.3.0.min"]
        },
        shim : {
            angle : {
                deps : ['jq','gaode']
            },
            zclip : {
                deps : ['jq']
            }
        }
    });
});