var main = {};
main.post = function (url, data, sucBack, errBack) {
	var error = {},
		appid = "100";
	if (url == null)
		return;
	if (data == null || data.length <= 0)
		return;
	var token = this.getSession("token");
	var timestamp = (new Date()).valueOf();
	var sign = main.getMd5(appid + timestamp);
	if (token != null) {
		sign = main.getMd5(appid + timestamp + token);
		axios.defaults.headers.token = token;
	}
	//axios.defaults.baseURL = "https://api.yingougou.com/v1.0/";
	axios.defaults.baseUrl = "https://api.yingougou.com/v1.0/";
	axios.defaults.headers.appid = appid;
	axios.defaults.headers.sign = sign;
	axios.defaults.headers.timestamp = timestamp;

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
main.getQueryString = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
};
 main.clearSessionItem = function (key) {
    if (key == null || key == "")
      return;
    sessionStorage.removeItem(key);
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

var bussinessID = "",
	memberID = "",
	bussinessName = "",
	bussinessID = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id"),
	memberID = main.getQueryString("m_id") == null ? main.getSession("m_id") : main.getQueryString("m_id"),
	bussinessName = main.getQueryString("b_n") == null ? main.getSession("b_n") : main.getQueryString("b_n"),
	couponID = main.getQueryString("c_id") == null ? main.getSession("c_id") : main.getQueryString("c_id"),
	couponAID = main.getQueryString("c_a_id") == null ? main.getSession("c_a_id") : main.getQueryString("c_a_id");
  var amount = main.getQueryString("amount")
main.setSession("amount",amount)
main.setSession("b_id", bussinessID);
main.setSession("b_n", decodeURI(bussinessName));
if (couponID != null)
	main.setSession("c_id", couponID);
if (couponAID != null)
	main.setSession("c_a_id", couponAID);
var imgurl = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%3A", ":");
if (imgurl.indexOf("https") < 0)
	imgurl = "https://img.yingougou.com/" + imgurl;
if (main.getQueryString("img") != null && main.getSession("img") == null)
	main.setSession("img", "https://img.yingougou.com/" + decodeURI(main.getSession("img")));
main.setSession("img", imgurl);
main.setSession("a_n", decodeURI(main.getQueryString("a_n") == null ? main.getSession("a_n") : main.getQueryString("a_n")));
main.setSession("c_n", decodeURI(main.getQueryString("c_n") == null ? main.getSession("c_n") : main.getQueryString("c_n")).replace("%2F", "/"));
function init() {
	if (main.getSession("sn") == null) {
		// location.href = "/payment/views/payment/index.html";
    location.href = "../../payment/views/newDrainage/payPage.html";
		return;
	}
  debugger
	main.post("https://api.yingougou.com/v1.0/common/getOrdersStatus", {
			sn: main.getSession("sn")
		},
		function (res) {

			if (res.status == 200) {
				var data = res.data.data;
				if (res == null) {
					main.prompt("支付异常");
					return;
				}

				if (data.status == 1) {
					//支付成功，引流
					if (memberID != "" && memberID != null) {
						main.setSession("m_id", memberID);
						location.href = "https://m.yingougou.com/";
					} else
						// location.href = "../../views/newDrainage/paySucc.html";
            location.href =  "../../payment/views/newDrainage/paySucc.html";
					main.clearSessionItem("sn");
					return;
				} else {
					//支付失败
					main.clearSessionItem("sn");
					if (memberID != "" && memberID != null) {
						main.setSession("m_id", memberID);
						location.href = "/payment/views/payment/paymerchant.html";
					} else
						location.href = "/payment/views/payment/index.html";
					//main.prompt("支付失败");
					return;
				}
			}
		});
}

init();