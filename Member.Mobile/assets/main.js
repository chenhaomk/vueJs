define(['axio', 'vue'], function (axio, Vue) {

    var docEl = document.documentElement,
        body = document.getElementsByTagName("body")[0],
        width = docEl.clientWidth,
        height = docEl.clientHeight,
        appid = "101";

    var size = 10 * (width / 375);
    var isdou = document.createElement('div');
    isdou.setAttribute("class", "isdou");
    body.appendChild(isdou);
    if (size > 20) size = 20;
    window.rem = size;

    docEl.style.fontSize = size + 'px';
    docEl.style.minHeight = height + 'px';
    body.style.minHeight = height + 'px';
    body.style.display = 'block';

    setTimeout(function () {
        if (isdou.clientWidth >= size * 2 - 1) {
            size /= 2;
            docEl.style.fontSize = size + 'px';
        }
    }, 1);

    //axio.defaults.baseURL = 'http://119.23.10.30:9000/v1.0';
    axio.defaults.baseURL = 'https://api.yingegou.com/v1.0';
    var ygg = {};
    ygg.maxImgSize = 4194304;
    ygg.ajax = function (url, data, callback) {
        var timestamp = (new Date()).valueOf(),
            token = ygg.getCookie('token'),
            sign = ygg.getMd5(appid + timestamp);

        if (token) {
            sign = ygg.getMd5(appid + timestamp + token);
        }
        axio.defaults.headers.appid = appid;
        axio.defaults.headers.sign = sign;
        axio.defaults.headers.timestamp = timestamp;
        axio.defaults.headers.token = token;
        return axio.post(url, data).then(function (res) {
            if (res.data.status == "error" && res.data.code == "3001") {
                ygg.delCookie("member_id");
                ygg.delCookie("mobile");
                ygg.delCookie("token");
                ygg.delCookie("area_id");
                location.reload();
            } else {
                callback(res.data);
            }
        }).catch(function (err) {

        });
    }

    //跨域请求
    ygg.getScript = function (url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);
        head.appendChild(js);
        //执行回调
        var callbackFn = function () {
            if (typeof callback === 'function') {
                callback();
            }
        };
        if (document.all) { //IE
            js.onreadystatechange = function () {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn();
                }
            }
        } else {
            js.onload = function () {
                callbackFn();
            }
        }
    }

    ygg.loading = function (con) {
        if (con) {
            body.setAttribute("class", body.getAttribute("class") + " loading");
        } else {
            body.setAttribute("class", (body.getAttribute("class")).replace("loading"));
        }
    }

    ygg.getClient = function (OSS) {
        ygg.ajax("/common/getAliOSSToken", {}, function (d) {
            d = d.data;
            window.client = new OSS.Wrapper({
                region: 'oss-cn-shenzhen',
                accessKeyId: d.AccessKeyId,
                accessKeySecret: d.AccessKeySecret,
                stsToken: d.SecurityToken,
                bucket: d.bucket_name,
                secure: true
            });
        });
    }

    ygg.uploadImg = function (a, cb) {
        var size = 0,
            names = [];
        for (var i = 0; i < a.length; i++) {

            var suffix = (a[i].name).substr((a[i].name).indexOf(".")),
                obj = (new Date()).valueOf(),
                storeAs = "ygg" + appid + obj + "" + (Math.floor(Math.random() * 9000) + 1000) + suffix;

            if (!/\.(gif|jpg|jpeg|bmp|png)$/.test(suffix.toLowerCase())) {
                ygg.prompt("图片格式不正确！");
                ygg.loading(false);
                return;
            }

            client.multipartUpload(storeAs, a[i]).then(function (result) {
                size++;
                names.push(result.name);
                if (size >= a.length)
                    cb(names);
                // else
                //     ygg.prompt("服务器异常！");
            }).catch(function (err) {
                ygg.prompt("上传图片出错，请稍后重试！");
                ygg.loading(false);
            });

        }
    }

    /*ygg.getAddress = function(cb,errorCb){
        var mapObj = new AMap.Map('iCenter');
        mapObj.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', function(a){
                cb(a.lng,a.lat);
            });
            AMap.event.addListener(geolocation, 'error', function(){
                errorCb();
            });
        });
    }*/

    ygg.verify = function (s, t, r) {
        var con = false;
        switch (t) {
            case "phone":
                if (!(/^1[34578]\d{9}$/.test(s))) {
                    ygg.prompt("请输入合理的手机号码！");
                    con = true;
                } else {
                    con = false;
                }
                break;
            case "pwd":
                if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z`~!@#$%^&*()_+=-]{8,16}$/.test(s))) {
                    ygg.prompt("密码必须是8-16位的字母和数字组成，不能有特殊符号！");
                    con = true;
                } else {
                    con = false;
                }
                break;
            case "dpwd":
                if (s != r) {
                    ygg.prompt("两次密码不一致！");
                    con = true;
                } else {
                    con = false;
                }
                break;
            case "email":
                if (!(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(s))) {
                    ygg.prompt("请输入合理邮箱");
                    con = true;
                } else {
                    con = false;
                }
                break;
            case "mobile":
                if (!(/^((0\d{2,3}-\d{7,8})|(1(([34578][0-9]))\d{8}))$/.test(s))) {
                    ygg.prompt("请输入合理电话号码");
                    con = true;
                } else {
                    con = false;
                }
                break;
        }
        return con;
    }

    ygg.getMonthNum = function (month, year) {
        month = month - 1;
        var LeapYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
        var monthNum;
        switch (parseInt(month)) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                monthNum = 31;
                break;
            case 3:
            case 5:
            case 8:
            case 10:
                monthNum = 30;
                break;
            case 1:
                monthNum = LeapYear ? 29 : 28;
        }
        return monthNum;
    }

    ygg.getTime = function (a) {
        var myDate = new Date();
        var month, year;
        if (a.year != null && a.month != null && a.date != null) {
            month = a.month - 1;
            year = a.year;
            myDate = new Date(year, month, a.date);
        }
        var result = new Array();
        for (i = 0; i < a.str.length; i++) {
            switch (a.str[i]) {
                case "year":
                    result[i] = myDate.getFullYear(); //获取年份
                    break;
                case "month":
                    result[i] = myDate.getMonth() + 1; //获取月份
                    break;
                case "date":
                    result[i] = myDate.getDate(); //获取日
                    break;
                case "week":
                    result[i] = myDate.getDay(); //获取星期几0-6,0代表星期天
                    break;
                case "minutes":
                    result[i] = myDate.getMinutes(); //获取分钟
                    break;
                case "seconds":
                    result[i] = myDate.getSeconds(); //获取秒数
                    break;
                case "time":
                    result[i] = myDate.toLocaleTimeString(); //获取当前时间,例如:下午1.24.30
                    break;
                case "local":
                    result[i] = myDate.toLocaleString(); //获取日期与时间
                    break;
                case "days":
                    if (a.month == 2) {
                        result[i] = year % 4 == 0 ? 29 : 28;
                    } else if (a.month == 1 || a.month == 3 || a.month == 5 || a.month == 7 || a.month == 8 || a.month == 10 || a.month == 12) {
                        result[i] = 31;
                    } else {
                        result[i] = 30;
                    }
                    break;
            }
        }
        a.result(result);
    }

    ygg.getDefaultDate = function (y, m, s, st) {
        st = '.' || st;
        var rs;
        ygg.getTime({
            str: ["year", 'month', 'date'],
            result: function (d) {
                if (y) d[0] += y;
                if (m) d[1] += m;
                if (s) d[2] += s;
                if (d[1] < 10) d[1] = "0" + d[1];
                if (d[2] < 10) d[2] = "0" + d[2];
                rs = d[0] + st + d[1] + st + d[2]
            }
        });
        return rs;
    }

    ygg.getDateArray = function (y, m, d, st) {
        y = 2015 || y;
        m = 1 || m;
        d = 1 || d;
        st = "." || st;
        var j, k, cs = 0,
            result = new Array();
        for (var i = y; i <= new Date().getFullYear(); i++) {
            for (i > y ? j = 1 : j = m; j < 12; j++) {
                if (i == new Date().getFullYear() && j > new Date().getMonth() + 1) continue;
                for (i > y || j > m ? k = 1 : k = d; k <= ygg.getMonthNum(j, i); k++) {
                    if (i == new Date().getFullYear() && j == new Date().getMonth() + 1 && k > new Date().getDate()) continue;
                    var month = j,
                        day = k;
                    if (month < 10) month = '0' + month;
                    if (day < 10) day = '0' + day;
                    result[cs] = i + st + month + st + day;
                    cs++;
                }
            }
        }
        return result;
    }

    ygg.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }
    ygg.setCookie = function (name, value) {
        var Days = 365;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    }
    ygg.delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = ygg.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
    }
    ygg.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    ygg.prompt = function (t) {
        var dom = document.getElementById("prompt");
        if (!dom) {
            var prompt = document.createElement("section"),
                shadow_b = document.createElement("section"),
                text = document.createElement("section"),
                p = document.createElement("p"),
                span = document.createElement("span");

            prompt.setAttribute("id", "prompt");
            prompt.setAttribute("class", "prompt");
            shadow_b.setAttribute("class", "shadow_b");
            text.setAttribute("class", "text");
            span.innerText = t;
            prompt.appendChild(shadow_b);
            prompt.appendChild(text);
            text.appendChild(p);
            p.appendChild(span);
            document.getElementsByTagName("body")[0].appendChild(prompt);
            dom = document.getElementById("prompt");
        } else {
            dom.childNodes[1].childNodes[0].childNodes[0].innerText = t;
        }
        dom.setAttribute("class", "prompt show");
        setTimeout(function () {
            dom.setAttribute("class", "prompt hide")
        }, 2000);
    }

    ygg.getMd5 = function (str) {
        var hexcase = 0;
        var b64pad = "";
        var chrsz = 8;

        function hex_md5(s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        }

        function b64_md5(s) {
            return binl2b64(core_md5(str2binl(s), s.length * chrsz));
        }

        function str_md5(s) {
            return binl2str(core_md5(str2binl(s), s.length * chrsz));
        }

        function hex_hmac_md5(key, data) {
            return binl2hex(core_hmac_md5(key, data));
        }

        function b64_hmac_md5(key, data) {
            return binl2b64(core_hmac_md5(key, data));
        }

        function str_hmac_md5(key, data) {
            return binl2str(core_hmac_md5(key, data));
        }

        return hex_md5(str);

        function core_md5(x, len) {
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);

        }

        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function core_hmac_md5(key, data) {
            var bkey = str2binl(key);
            if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
            return core_md5(opad.concat(hash), 512 + 128);
        }

        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        function str2binl(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
            return bin;
        }

        function binl2str(bin) {
            var str = "";
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str;
        }

        function binl2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        }

        function binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
                    (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
                    ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }

    }

    ygg.getd = function (format, timestamp) {
        //  discuss at: http://locutus.io/php/date/
        // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)

        var jsdate, f
        var txtWords = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        var formatChr = /\\?(.?)/gi
        var formatChrCb = function (t, s) {
            return f[t] ? f[t]() : s
        }
        var _pad = function (n, c) {
            n = String(n)
            while (n.length < c) {
                n = '0' + n
            }
            return n
        }
        f = {
            d: function () {
                return _pad(f.j(), 2)
            },
            D: function () {
                return f.l()
                    .slice(0, 3)
            },
            j: function () {
                return jsdate.getDate()
            },
            l: function () {
                return txtWords[f.w()] + 'day'
            },
            N: function () {
                return f.w() || 7
            },
            S: function () {
                var j = f.j()
                var i = j % 10
                if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
                    i = 0
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th'
            },
            w: function () {
                return jsdate.getDay()
            },
            z: function () {
                var a = new Date(f.Y(), f.n() - 1, f.j())
                var b = new Date(f.Y(), 0, 1)
                return Math.round((a - b) / 864e5)
            },

            W: function () {
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
                var b = new Date(a.getFullYear(), 0, 4)
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
            },

            F: function () {
                return txtWords[6 + f.n()]
            },
            m: function () {
                return _pad(f.n(), 2)
            },
            M: function () {
                return f.F()
                    .slice(0, 3)
            },
            n: function () {
                return jsdate.getMonth() + 1
            },
            t: function () {
                return (new Date(f.Y(), f.n(), 0))
                    .getDate()
            },

            L: function () {
                var j = f.Y()
                return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
            },
            o: function () {
                var n = f.n()
                var W = f.W()
                var Y = f.Y()
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
            },
            Y: function () {
                return jsdate.getFullYear()
            },
            y: function () {
                return f.Y()
                    .toString()
                    .slice(-2)
            },

            a: function () {
                return jsdate.getHours() > 11 ? 'pm' : 'am'
            },
            A: function () {
                return f.a()
                    .toUpperCase()
            },
            B: function () {
                var H = jsdate.getUTCHours() * 36e2
                var i = jsdate.getUTCMinutes() * 60
                var s = jsdate.getUTCSeconds()
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
            },
            g: function () {
                return f.G() % 12 || 12
            },
            G: function () {
                return jsdate.getHours()
            },
            h: function () {
                return _pad(f.g(), 2)
            },
            H: function () {
                return _pad(f.G(), 2)
            },
            i: function () {
                return _pad(jsdate.getMinutes(), 2)
            },
            s: function () {
                return _pad(jsdate.getSeconds(), 2)
            },
            u: function () {
                return _pad(jsdate.getMilliseconds() * 1000, 6)
            },

            e: function () {
                var msg = 'Not supported (see source code of date() for timezone on how to add support)'
                throw new Error(msg)
            },
            I: function () {
                var a = new Date(f.Y(), 0)
                var c = Date.UTC(f.Y(), 0)
                var b = new Date(f.Y(), 6)
                var d = Date.UTC(f.Y(), 6)
                return ((a - c) !== (b - d)) ? 1 : 0
            },
            O: function () {
                var tzo = jsdate.getTimezoneOffset()
                var a = Math.abs(tzo)
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
            },
            P: function () {
                var O = f.O()
                return (O.substr(0, 3) + ':' + O.substr(3, 2))
            },
            T: function () {
                return 'UTC'
            },
            Z: function () {
                return -jsdate.getTimezoneOffset() * 60
            },

            c: function () {
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
            },
            r: function () {
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
            },
            U: function () {
                return jsdate / 1000 | 0
            }
        }

        var _date = function (format, timestamp) {
            jsdate = (timestamp === undefined ? new Date() // Not provided
                :
                (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
                :
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
            )
            return format.replace(formatChr, formatChrCb)
        }

        return _date(format, timestamp)
    }

    //全局组建注册
    ygg.template = {};

    //我的侧栏
    ygg.template.my = Vue.extend({
        props: {
            user: {
                type: Object
            },
            isLogin: Boolean
        },
        data: function () {
            return {
                loginUrl: "/views/user/login.html",
                purseUrl: "/views/my/purse/purse.html",
                orderUrl: "/views/my/orderDis.html",
                couponUrl: "/views/my/myDis.html",
                historyUrl: "/views/my/purHistory.html"
            }
        },
        computed: {
            aurl: function () {
                var a = "/views/user/login.html";
                if (ygg.getCookie("member_id")) {
                    a = "/views/user/set/disSet.html"
                }
                return a;
            }
        },
        template: '<section class="my">' +
            '<section class="top">' +
            '<a href="/views/user/set/seting.html" v-show="user.nickName" class="set"></a>' +
            '<a v-if="user.nickName" href="/views/user/userinfo.html"><img :src="user.photo" class="photo"/></a>' +
            '<a v-else><img :src="user.photo" class="photo"/></a>' +
            '<section class="info" v-show="user.nickName">' +
            '<p>{{user.nickName}}</p>' +
            '</section>' +
            '<section class="btns" v-show="!user.nickName">' +
            '<a href="/views/user/login.html">登录</a>' +
            '<a href="/views/user/register.html">注册</a>' +
            '</section>' +
            '</section>' +
            '<section class="menu">' +
            '<a @click="noc($event)" :href="isLogin?purseUrl:loginUrl">钱包<span></span></a>' +
            '<a :href="isLogin?couponUrl:loginUrl">优惠券<span>{{user.coupon_total}}</span></a>' +
            '<a :href="isLogin?orderUrl:loginUrl">订单<span></span></a>' +
            '<a href="" class="hide">虚拟账号<span>支付宝</span></a>' +
            '<a :href="isLogin?historyUrl:loginUrl">消费记录<span></span></a>' +
            '</section>' +
            '<section class="ot">' +
            '<a href="/views/my/myCard.html" v-if="user.is_expand">邀请商家入驻</a>' +
            '<a :href="aurl" v-else>申请为商户发展人</a>' +
            '<a href="/views/creat/register.html">免费入驻为商家</a>' +
            '</section>' +
            '</section>',
        methods: {
            noc: function (e) {
                e.preventDefault();
                ygg.prompt("该功能正在开发中，请下载APP查看");
            }
        }
    });

    //优惠券列表
    ygg.template.discount = Vue.extend({
        props: {
            a: {
                type: Object
            },
            returnUrl: "",
            isMy: false,
            isGq: false
        },
        data: function () {
            return {
                geting: false,
                success: false,
                lqcg: false,
                url: "/views/coupon/index.html?returnUrl=" + this.returnUrl + "&id="
            }
        },
        computed: {
            urlp: function () {
                var u;
                this.isMy ? u = this.url + this.a.coupon_activity_id : u = this.url + this.a.coupon_id
                var bid = ygg.getQueryString("id");
                if (bid) {
                    u += "&bid=" + this.a.business_id
                }
                return u
            }
        },
        template: '<section class="discount_group fn-clear" :class="{default:a.type==0 && a.is_share,default_z:a.type==0 && !a.is_share,rate:a.type==1 && a.is_share,rate_z:a.type==1 && !a.is_share,dk:a.type==2 && a.is_share,dk_z:a.type==2 && !a.is_share,expired:isGq,lqcg:lqcg,lqgl:a.already_get || lqcg}">' +
            '<a :href="urlp">' +
            '<section class="info">' +
            '<section class="top fn-clear">' +
            '<img :src="a.img_path">' +
            '<section class="text">' +
            '<p class="title_n" v-if="!a.is_share">专属券</p>' +
            '<p class="title_n" v-else>共享券</p>' +
            '<p class="discounted" v-if="a.type == 0"><span>{{a.discount}}</span>元</p>' +
            '<p class="discounted" v-else-if="a.type == 1"><span>{{a.rate*10}}</span>折</p>' +
            '<p class="discounted" v-else><span>{{a.price}}</span>元<b>{{a.discount}}元</b></p>' +
            '</section>' +
            '</section>' +
            '<section class="bot">' +
            '<span>满{{a.min_price}}可用</span>' +
            '<span class="text-sl">{{a.business_name}}</span>' +
            '</section>' +
            '</section>' +
            '</a>' +
            '<section class="status">' +
            '<a v-if="isMy" :class="{nohx:isMy}">' +
            '<p>待使用</p>' +
            '</a>' +
            '<a v-else-if="lqcg || a.already_get" class="nohx">' +
            '<p>已领取</p>' +
            '</a>' +
            '<a v-else-if="isGq" :class="{nohx:isGq}">' +
            '<p>已过期</p>' +
            '</a>' +
            '<a v-else-if="a.type==2 && !geting" :href="urlp">' +
            '<p>立即<br>抢购</p>' +
            '</a>' +
            '<a v-else-if="a.type!=2 && !geting" @click="getc(this.isMy?a.coupon_activity_id:a.coupon_id)">' +
            '<p>免费<br>领取</p>' +
            '</a>' +
            '<a v-else-if="success">' +
            '<p>领取中<br><b>.</b><b>.</b><b>.</b></p>' +
            '</a>' +
            '</section>' +
            '</section>',
        methods: {
            getc: function (id) {
                this.$set(this, "geting", true);
                this.$set(this, "success", true);
                var that = this;
                ygg.loading(true);
                if (!ygg.getCookie("member_id")) window.open("/views/user/login.html", "_self");
                ygg.ajax('/thirdPay/create_coupon_order', {
                    coupon_id: id,
                    member_id: ygg.getCookie("member_id")
                }, function (data) {
                    ygg.loading(false);
                    if (data.status == 'error') {
                        ygg.prompt(data.msg);
                        that.$set(that, "geting", false);
                    } else if (data.status == 'success') {
                        that.$set(that, "lqcg", true);
                    }

                });
            }
        }
    });

    //图片列表
    ygg.template.imgList = Vue.extend({
        props: {
            imgData: {},
            deleteImg: Function,
            index: 0
        },
        template: '<section class="img_group">\
                        <a class="delete" @click="deleteImg($event,imgData,index)"></a>\
                        <p><img :src="imgData" :style="style"></p>\
                    </section>',
        computed: { //.src
            style: function () {
                var s = "",
                    bl = 7.5 * rem,
                    a = this.imgData;

                if (a.width > a.height) {
                    bl = bl / a.height;
                    s = "width:" + bl * a.width + "px;height:100%;margin-left:" + -(bl * a.width - 7.5 * rem) / 2 + "px";
                } else {
                    bl = bl / a.width;
                    s = "height:" + bl * a.height + "px;width:100%;margin-top:" + -(bl * a.height - 7.5 * rem) / 2 + "px";
                }

                return s;
            }
        }
    });

    //图片上传
    ygg.template.uploader = Vue.extend({
        props: {
            getFileHan: Function,
            isOne: String,
            maxLength: {
                type: Number,
                default: 50
            },
            oldImgs: {
                default: [],
                type: Array
            }
        },
        template: '<section class="uploader">\
                        <img-list :deleteImg="dele" v-for="(a,index) of imgs" :index="index" :imgData="a" ></img-list>\
                        <section class="add" v-show="isAdd"><input type="file" accept="image/*" v-on:change="getFile($event)" multiple></section>\
                    </section>',
        components: { //<section class="hide">{{imggs}}</section>\
            imgList: ygg.template.imgList
        },
        data: function () {
            return {
                uFiles: [],
                isAdd: true,
                //imgs: []
            }
        },
        computed: {
            imgs: function () {
                var a = [];
                if (this.oldImgs.length > 1 && typeof (this.oldImgs) != "string") {
                    a = a.concat(this.oldImgs);
                } else if (this.oldImgs.length != 0) {
                    a.push(this.oldImgs);
                }

                if (a.length >= this.maxLength) this.isAdd = false;
                return a;
            }
            // imggs: function () {
            //     var a = [];
            //     var that = this;
            //     if (this.oldImgs.length > 1 && typeof (this.oldImgs) != "string") {
            //         for(var i=0;i<this.oldImgs.length;i++){
            //             var img = new Image();
            //             img.src = this.oldImgs[i];
            //             img.onload = function () {
            //                 that.imgs.push({
            //                     src: this.src,
            //                     width: this.width,
            //                     height: this.height
            //                 });
            //             }
            //         }
            //     } else if (this.oldImgs.length != 0) {
            //         var img = new Image();
            //         img.src = this.oldImgs;
            //         img.onload = function () {
            //             that.imgs.push({
            //                 src: this.src,
            //                 width: this.width,
            //                 height: this.height
            //             });
            //         }
            //     }
            //     if (this.oldImgs.length >= this.maxLength || typeof (this.oldImgs) == "string") this.isAdd = false;
            //     return a;
            // }
        },
        methods: {
            getFile: function (e) {
                var that = this;
                for (var i = 0; i < e.target.files.length; i++) {
                    if (this.isOne) {
                        if (i > 0) return;
                    }
                    if (this.uFiles.length >= this.maxLength) return;
                    var file = e.target.files[i];
                    if (file.size > ygg.maxImgSize) {
                        ygg.prompt("图片大于4M，请压缩后再上传！");
                        return;
                    }
                    this.uFiles.push(file);
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        var img = new Image();
                        img.src = this.result;
                        img.onload = function () {
                            that.addImg({
                                src: this.src,
                                width: this.width,
                                height: this.height
                            });
                        }
                    }
                    if (this.uFiles.length >= this.maxLength) this.isAdd = false;
                }
                e.target.value = "";
            },
            addImg: function (a) {
                var bool = (this.imgs).isHav(a);
                bool ? alert('该图片已上传') : this.imgs.push(a);
                this.getFileHan(this.uFiles, a.src, 0);
            },
            dele: function (e, s, i) {
                var j = 0;
                if (this.imgs.length > this.uFiles.length)
                    j = this.imgs.length - this.uFiles.length;
                this.imgs.remove(s);
                this.isAdd = true;
                if (s.indexOf("https://") < 0) //.src
                    this.uFiles.splice(i - j, 1);
                this.getFileHan(this.uFiles, s, 1); //.src
            }
        }
    });

    //优惠券订单列表
    ygg.template.orderList = Vue.extend({
        props: {
            a: Object,
            now: "",
            isGq: Boolean,
            getDetail: Function
        },
        template: '<section class="dis_order_group" @click="getde" :class="{use:a.status == 1 && !isGq}">\
                        <a><section class="last_time" v-show="!isGq">\
                            <p>{{djs}}</p>\
                            <p>过期</p>\
                        </section>\
                        <section class="left">\
                            <p class="price">￥<span>{{a.price}}</span></p>\
                            <p class="type" v-if="a.is_share">共享券</p>\
                            <p class="type" v-else>专属券</p>\
                        </section>\
                        <section class="right">\
                            <p class="title text-sl">{{a.use_business_name}}</p>\
                            <p class="limit">{{a.price}}元抵扣{{a.discount}}元</p>\
                            <p class="time">{{time}}</p>\
                        </section>\
                        <section class="bot">\
                            实付：￥{{a.price}}\
                            <p class="address">{{a.business_area_name}}</p>\
                        </section></a>\
                    </section>',
        computed: {
            time: function () {
                return ygg.getd('Y.m.d H:i', this.a.create_date / 1000);
            },
            djs: function () {
                var t = (this.a.end_date - this.now) / 1000,
                    day = Math.floor(t / 86400),
                    hour = Math.floor(t % 86400 / 3600),
                    minute = Math.floor(t % 86400 % 3600 / 60);

                if (day != 0) {
                    return day + "天"
                } else if (hour != 0) {
                    return hour + "小时"
                } else {
                    return minute + "分"
                }
            },
            url: function () {
                var url = "orderDisDetail.html?cid=" + this.a.coupon_id + "&bid=" + this.a.business_id;
                if (this.isGq) {
                    url = "javascript:void(0)";
                }
                return url;
            }
        },
        methods: {
            getde: function () {
                this.getDetail(this.a);
            }
        }
    });

    //评分星级
    ygg.template.star = Vue.extend({
        props: {
            score: Number
        },
        template: '<section class="score_star">\
                        <a v-for="a of aScore"><b :style="{width:a}"></b></a>\
                        <label>{{score}}分</label>\
                    </section>',
        computed: {
            aScore: function () {

                if (!this.score) {
                    this.score = 0;
                } else {
                    this.score = this.score / 10;
                }
                var arr = new Array(5),
                    sco = this.score;

                for (var i = 0; i < arr.length; i++) {
                    if (i + 1 <= sco) {
                        arr[i] = 1 * 100 + "%";
                    } else if (i + 1 > sco && i < sco) {
                        arr[i] = sco % 1 * 100 + "%";
                    } else {
                        arr[i] = 0;
                    }
                }

                return arr;
            }
        }
    });


    //商铺列表
    ygg.template.shopList = Vue.extend({
        props: {
            a: {
                type: Object
            },
            returnUrl: ""
        },
        data: function () {
            return {
                url: "/views/shop/detail.html?returnUrl=" + this.returnUrl + "&id="
            }
        },
        template: '<li><a :href="url+a.business_id">\
                        <img :src="a.inner_imgs">\
                        <section class="text">\
                            <p class="title">{{a.name}}</p>\
                            <score :score="a.star*10"></score>\
                            <a class="address"><span class="text-sl">{{a.area_name}}</span></a>\
                        </section>\
                    </a></li>',
        components: {
            score: ygg.template.star
        }
    });


    //评论列表
    ygg.template.comment = Vue.extend({
        props: {
            a: Object
        },
        template: '<section class="comment_list fn-clear">\
                        <img :src="a.head_portrait">\
                        <section class="info">\
                            <p class="time">{{cdate}}</p>\
                            <p class="name">{{a.nick_name}}</p>\
                            <score :score="a.star"></score>\
                            <p class="content">{{a.content}}</p>\
                        </section>\
                    </section>',
        components: {
            score: ygg.template.star
        },
        computed: {
            cdate: function () {
                return ygg.getd('Y.m.d', this.a.create_date / 1000);
            }
        }
    });

    //用户反馈列表
    ygg.template.feedback = Vue.extend({
        props: {
            a: Object
        },
        template: '<section class="fb_group">\
                        <p class="top">\
                            <span class="time">{{ctime}}</span>\
                            <span v-if="a.status==0" class="status">待处理</span>\
                            <span v-else class="status ar">已处理</span>\
                        </p>\
                        <p class="bot text-sl">{{a.content}}</p>\
                    </section>',
        computed: {
            ctime: function () {
                return ygg.getd("Y.m.d H:i", this.a.create_date / 1000);
            }
        }
    });

    //账户明细列表
    ygg.template.balance = Vue.extend({
        props: {
            a: Object
        },
        template: '<section class="balance_group">\
                        <section class="bg_top">\
                            推荐用户分润\
                            <span>2017.02.12</span>\
                        </section>\
                        <section class="bg_bot">\
                            余额：800\
                            <span>+100.00</span>\
                        </section>\
                    </section>'
    });

    //弹窗提示
    ygg.template.popup = Vue.extend({
        props: {
            a: {
                type: Object,
                default: {
                    double: false,
                    isShow: false,
                    canle: "确定",
                    confi: ""
                }
            }
        },
        template: '<section id="popup" :class="{popup:true,double:a.double}" v-show="a.isShow"">\
                        <p>{{a.content}}</p>\
                        <section class="btns">\
                            <a @click="canleCb">{{a.canle}}</a>\
                            <a @click="confiCb">{{a.confi}}</a>\
                        </section>\
                    </section>',
        methods: {
            canleCb: function () {
                this.a.isShow = false;
                this.a.canleCb();
            },
            confiCb: function () {
                this.a.isShow = false;
                this.a.confiCb();
            }
        }
    });

    //弹窗提示
    ygg.template.getVercode = Vue.extend({
        props: {
            mobile: "123",
            sms_type: ""
        },
        data: function () {
            return {
                isClick: false,
                text: "获取验证码"
            }
        },
        template: '<a @click="getVer">{{text}}</a>',
        methods: {
            getVer: function () {
                var that = this;
                if (that.isClick) return;
                if (that.mobile.length == 0) {
                    ygg.prompt("手机号不能为空！");
                    return;
                }
                var startTime = Date.parse(new Date()) / 1000 + 60,
                    t;
                that.text = 60 + "s";
                t = setInterval(function () {
                    var st = startTime - Date.parse(new Date()) / 1000;
                    that.text = st + "s";
                    if (st <= 0) {
                        that.text = "重新获取";
                        clearInterval(t);
                        that.isClick = false;
                    }
                }, 1000);
                ygg.ajax('/common/sendVerificationCode', {
                    mobile: that.mobile,
                    sms_type: that.sms_type
                }, function (data) {
                    if (data.status == "error") {
                        ygg.prompt(data.msg);
                        that.text = "获取验证码";
                        clearInterval(t);
                        that.isClick = false;
                    }
                });
            }
        }
    });

    return ygg;

});

Array.prototype.remove = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) this.splice(i, 1);
    }
    return this;
}

Array.prototype.isHav = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) return true;
    }
}