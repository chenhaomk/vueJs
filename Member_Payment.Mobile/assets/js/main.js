define([
  'axio', 'vue'
], function (axios, Vue) {
  'use strict';

  var body = document.getElementsByTagName("body")[0];
  // var html = document.documentElement;
  // var windowwidth = html.clientWidth;
  // html.style.fontSize = windowwidth / 7.5 + "px";
  // document.getElementById("body").style.height = window.innerHeight + "px";

  // 添加一个请求拦截器
  // 指定允许其他域名访问  
  axios.interceptors.request.use(function (config) {
    //在请求发出之前进行一些操作
    return config;
  }, function (err) {
    //Do something with request error
    return Promise.reject(err);
  });
  //添加一个响应拦截器
  axios.interceptors.response.use(function (res) {
    //在这里对返回的数据进行处理
    if (res == null)
      return;
    res.errCode = 0;
    res.errMsg = "";
    if (res.code == "tokenInvalid")
      res.errCode = -2;
    return res;
  }, function (err) {
    //Do something with response error
    return Promise.reject(err);
  });
  var main = {};
  // main.baseUrl = "https://api.yingougou.com/v1.1/";
  main.baseUrl = "http://119.23.10.30:9000/v1.2/";
  // main.calllBcakUrl = 'https://m.yingougou.com' //
  main.calllBcakUrl = 'http://119.23.10.30:8002'
  main.post = function (url, data, sucBack, errBack) {
    var error = {},
      appid = "100";
    if (url == null)
      return;
    if (data == null || data.length <= 0)
      return;
    var tk
    if (location.search.indexOf("userId") != -1) {
      tk = location.search.split("&")[2].split("=")[1]
    }
    var token = this.getSession("token") ? this.getSession("token") : this.getCookie("token");
    if (tk != null || tk != undefined) {
      token = tk
    }
    var timestamp = (new Date()).valueOf();
    var sign = main.getMd5(appid + timestamp);
    if (token != null) {
      sign = main.getMd5(appid + timestamp + token);
      axios.defaults.headers.token = token;
    }
    // axios.defaults.baseURL = "https://api.yingougou.com/v1.1/";
    // axios.defaults.baseURL = "http://119.23.10.30:9000/v1.2/";
    axios.defaults.baseURL = "https://paytest.yingougou.com/v1.2/"; //测试服测试支付，避免跨域
    // axios.defaults.baseUrl = "http://119.23.10.30:9000/ygg_dev_201803081529_1.5.2/v1.0";

    axios.defaults.headers.appid = appid;
    axios.defaults.headers.sign = sign;
    axios.defaults.headers.timestamp = timestamp;
    axios.defaults.headers.member_id = this.getCookie("member_id");
    axios.post(url, data)
      .then(function (res) {
        if (sucBack != null) {
          if (res.errCode == -2)
            res.errMsg = "token失效";
          sucBack(res);
        }
      })
      .catch(function (err) {
        //测试取消该备注
        // switch (err.request.status) {
        //   case "timeout":
        //     err.errCode = -1;
        //     err.errMsg = "数据超时";
        //     break;
        //   case "error":
        //     err.errCode = -1;
        //     err.errMsg = "数据出错";
        //     break;
        //   case "notmodified":
        //     err.errCode = -1;
        //     err.errMsg = "异常错误";
        //     break;
        //   default:
        //     err.errCode = -1;
        //     err.errMsg = "解析错误";
        //     break;
        // }
        if (errBack != null)
          errBack(err);
      })
  };
  main.postMult = function (arr, ajaxBack) {
    if (arr == null || arr.length <= 0)
      return;
    axios.all(arr)
      .then(axios.spread(
        ajaxBack()
      ));
  };
  main.setSession = function (key, value) {
    // if (key == null || value == null)
    //   return;
    var s = sessionStorage;
    s.setItem(key, value);
  };
  main.getSession = function (key) {
    if (key == null || key == "") {
      main.prompt("请求超时！");
      return;
    }
    return sessionStorage.getItem(key);
  };
  main.clearSessionItem = function (key) {
    if (key == null || key == "")
      return;
    sessionStorage.removeItem(key);
  };
  main.clearSession = function () {
    if (sessionStorage != null)
      sessionStorage.clear();
  };
  // ----------开始--------ch-use:用于payPage页面获取由h5店铺详情点击优惠买单时设置的cookie
  main.getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }
  main.setCookie = function (name, value) {
    var Days = 365;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  }
  main.delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = main.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
  // ---------结束---------ch-use:用于payPage页面获取由h5店铺详情点击优惠买单时设置的cookie
  main.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };
  main.getd = function (format, timestamp) {
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
  };
  main.getMd5 = function (str) {
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
  main.template = {};
  //弹窗提示
  main.template.getVercode = Vue.extend({
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
          main.prompt("手机号不能为空！");
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
        main.post('http://119.23.10.30:9000/v1.0/common/sendVerificationCode', {
          mobile: that.mobile,
          sms_type: that.sms_type
        }, function (data) {
          if (data.status == "error") {
            main.prompt(data.msg);
            that.text = "获取验证码";
            clearInterval(t);
            that.isClick = false;
          }
        });
      }
    }
  });

  //优惠券列表
  main.template.discount = Vue.extend({
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
    computed: {},
    template: '<section class="discount_group fn-clear" :class="{default:a.type==0 && a.is_share,default_z:a.type==0 && !a.is_share,rate:a.type==1 && a.is_share,rate_z:a.type==1 && !a.is_share,dk:a.type==2 && a.is_share,dk_z:a.type==2 && !a.is_share,expired:isGq,lqcg:lqcg}">' +
      '<a>' +
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
      '<a @click="getc(a.is_from_business,a.is_from_business?a.coupon_activity_id:a.coupon_id,a.calculate_discount)">' +
      '<p>立即<br>使用</p>' +
      '</a>' +
      '</section>' +
      '</section>',
    methods: {
      getc: function (isb, id, discount) {
        console.log(isb)
        if (id != null || id != "") {
          main.setSession("couponID", id);
          main.setSession("isBusiness", isb);
          main.setSession("calculate_discount", discount);
          location.href = "../../views/payment/paymerchantmanual.html";
        }
      }
    }
  });
  //评分星级
  main.template.star = Vue.extend({
    props: {
      score: Number
    },
    template: '<div class="score_star">\
                        <a v-for="a of aScore"><b :style="{width:a}"></b></a>\
                        <span>{{score}}分</label>\
                    </div>',
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
  main.template.newStar = Vue.extend({
    props: {
      score: Number
    },
    template: '<div class="new_star">\
                <div  v-for="a of aScore" class="star_num" ><div class="star_model"  :style="{width:a}"></div><div class="star_img" ></div> </div><span>{{score}}分\
                    </div>',
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
  })
  main.prompt = function (t) {
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
  };
  main.loading = function (con) {
    if (con) {
      body.setAttribute("class", body.getAttribute("class") + " loading");
    } else {
      body.setAttribute("class", (body.getAttribute("class")).replace("loading"));
    }
  }
  main.newPrompt = function (t, timer) {
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
    }, timer);

  };
  main.loadingImg = function () {
    var dom = document.getElementById("prompt");
    if (!dom) {
      var prompt = document.createElement("section"),
        shadow_b = document.createElement("section"),
        text = document.createElement("section"),
        p = document.createElement("p"),
        img = document.createElement("img");

      prompt.setAttribute("id", "prompt");
      prompt.setAttribute("class", "prompt");
      shadow_b.setAttribute("class", "shadow_b");
      text.setAttribute("class", "text");
      img.setAttribute("src", "../../assets/images/loading-go.gif")
      prompt.appendChild(shadow_b);
      prompt.appendChild(text);
      text.appendChild(p);
      p.appendChild(img);
      document.getElementsByTagName("body")[0].appendChild(prompt);
      dom = document.getElementById("prompt");
    } else {
      dom.childNodes[1].childNodes[0].childNodes[0].innerText = t;
    }
    dom.setAttribute("class", "prompt show");
  };
  return main;
});