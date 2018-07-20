(function () {
    // var baseURL = "https://paytest.yingougou.com/v1.2/" //测试支付
    var baseURL = "https://api.yingougou.com/v1.2/" //正式
    // var calllBcakUrl = 'http://119.23.10.30:8002'
    var calllBcakUrl = 'https://m.yingougou.com' //
    var u = navigator.userAgent;
    var userId, bty, weixin_openid, wx_unionid, nick_name, zfb_openid, isAndroid
    var bty = browserType()
    var hrefStr = location.href
    var money=getQueryString('money')?getQueryString('money'):0
    $("#payMoney").val(money)
 
      if (bty == 'weixin') {
        if (hrefStr.indexOf('code') == -1) {
          // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/PaymentTest/views/newDrainage/pay.html?money="+money+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"; //测试 
          location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/pay.html?money="+money+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";  //正式  
          // return        
        } else {
          var code = getQueryString("code");
          $.ajax({
            type: 'POST',
            headers: setHeader(),
            url: baseURL + 'pay/getOpenId',
            data: JSON.stringify({
              code: code
            }),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success: function (res) { 
              if(res.code != 200) {
                prompt('扫码出现异常!')
                return
              }
              //---获取用户openid
              weixin_openid = res.data.openid;
              //---获取创建订单参数
              weixin_pay_data = res.data
              weixin_pay_data.open_id = res.data.openid
              weixin_pay_data.pay_way = 'wechat_csb' //支付方式
              weixin_pay_data.amount= money
             
            },
          })
        }
      }else if( bty== "alipay") {
        if(hrefStr.indexOf('auth_code') == -1) {
          // location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/PaymentTest/views/newDrainage/pay.html?money="+money //测试
          // location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id //正式
          location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/pay.html?money="+money //正式
          // return
        }else {
          var code = getQueryString("auth_code");
          $.ajax({
            type: 'POST',
            headers: setHeader(),
            url: baseURL + 'pay/getBuyerId',
            data: JSON.stringify({
              code: code
            }),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success: function (res) {
              if (res.code != 200) {
                main.prompt("扫码出现异常");
                return;
              }
              zfb_openid = res.data
            }
          })  
        }
      }else {
        prompt('请使用微信或者支付宝扫码支付!')
      }
    //   loading(true)loading(true)
    //判断浏览器类型
    function browserType() {
        var ua = u.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return "weixin"
        } else if (ua.match(/AlipayClient/i) == "alipayclient") {
        return "alipay";
        } else {
        return "other"
        }
    }
    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    //确认买单
  $('#confirm').on('click',function (e) {
    e.preventDefault();
    if(location.href.indexOf("code") == -1) {//微信用户拒绝授权,跳往失败引导页面
      location.href = "../../views/newDrainage/payDefeat.html" 
    }
    var data = {}
    if(bty == 'weixin') {
      data = weixin_pay_data
    //   data.member_id = getCookie('member_id')
    }else if(bty = 'alipay') {
    //   data.member_id = getCookie('member_id')
    }
    payFn(bty,data,baseURL,ck)
    function ck() {
      location.href ="../../views/newDrainage/complete.html";
    }
  })
  /**
   * @name 支付函数
   * 
   * @param {*} browserType  为判断浏览器函数
   * @param {*} data 为支付接口参数对象
   * @param {*} baseURL 
   * @param {*} callBack 支付后的回调
   */
  function payFn(browserType,data,baseURL,callBack) {
    if(browserType =="weixin") {//微信浏览器内
      loading(true)
      $.ajax({
        type: 'POST',
        headers: setHeader(),
        url: baseURL+'pay/replenishment',
        data:JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success:function (res) {
          if(res.code == 200) {
            //调用官方公众号接口
            var configObj = {
                debug:false,
                appId:res.data.appId,
                timestamp:res.data.timeStamp,
                nonceStr:res.data.nonceStr,
                signature:res.data.paySign,
                jsApiList:["chooseWXPay"]
            }
            wx.config(configObj);
            wx.ready(function () {
            //   wxready.endTime = getTimer()
              wx.chooseWXPay({
                timestamp:res.data.timeStamp,
                nonceStr:res.data.nonceStr,
                package:res.data.package,
                signType:res.data.signType,
                paySign:res.data.paySign,
                success:function (res) {
                  callBack()
                }
              })  
            })
            loading(false)
          }else{
            loading(false)
            prompt('支付异常!')
          }
        }
      })
    }else if(browserType =="alipay") {//支付宝扫码进入
      loading(true)
      data.buyer_id = zfb_openid
      data.pay_way ='alipay_csb'
      data.amount=money
      $.ajax({
        type: 'POST',
        headers: setHeader(),
        url: baseURL+'pay/replenishment',
        data:JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success:function (res) {
          if(res.code == 200 ) {
            var tradeNo = res.data.tradeNO;
            loading(false)
            AlipayJSBridge.call("tradePay",{
              tradeNO:tradeNo
            }, function(result){
              if(result.resultCode == 9000) {
                  callBack()

              }else {
                loading(false)
                prompt("支付异常!")
              }
            })  
          }
        }
      })  
    }else {//普通浏览器扫码进入
      prompt('请使用微信或者支付宝扫码支付!')
    }
  }
   //alert msg
   function prompt(t) {
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
  //loading
  function loading(con) {
    // var body = $($('body')[0])
    if (con) {
      // body.addClass('loading')
      $('.load').removeClass('hide')
      $('.loading').addClass('play').removeClass('pause')
    } else {
      // body.removeClass('loading')
      $('.load').addClass('hide')
      $('.loading').removeClass('play').addClass('pause')
    }
  }
  //md5
  function getMd5(str) {
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
  function setHeader () {
    //---------------------ajax header设置----------开始----
    var tk
    var appid = '100'
    if (location.search.indexOf("userId") != -1) {
    tk = location.search.split("&")[2].split("=")[1]
    }
    
    var timestamp = (new Date()).valueOf();
    var sign = getMd5(appid + timestamp);
    
    var headers = {
    appid: appid,
    sign: sign,
    timestamp: timestamp
    }
    //---------------------ajax header设置----------结束----
    return headers
    }
    //-----------------------工具类函数------------结束
    window.addEventListener('load', function () {
    FastClick.attach(document.body);
        var ga = document.createElement('script'); 
    ga.type = 'text/javascript'; 
    ga.async = true; 
    if(bty == 'weixin') {
    ga.src = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js' 
    }else if (bty== "alipay") {
    ga.src = '../antbridge.min.js'
    }

    var s = document.getElementsByTagName('script')[0]; 
    s.parentNode.insertBefore(ga, s);
    }, false);
})()


