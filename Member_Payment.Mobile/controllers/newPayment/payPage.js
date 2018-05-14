(function () {
  $('body').addClass('show')
  var baseURL = "https://paytest.yingougou.com/v1.2/" //测试支付
  // var baseURL = "https://api.yingougou.com/v1.2/" //正式
  // var calllBcakUrl = 'http://119.23.10.30:8002'
  var calllBcakUrl = 'https://m.yingougou.com' //
  var u = navigator.userAgent;
  var vm = {
    isActive: false,
    payNum: "",
    payKind: 0,
    merchant_name: "",
    isDis: false, //ch-use:用于判断是否有不参与优惠的金额
    payType: "nothing", //ch-use:优惠方式（满减，打折，优惠券，或者没有任何优惠）
    discountShow: false, //是否显示折扣
    discount: "0.9", //用于显示的折扣
    discountS: 0, //用于计算的折扣
    most_discount: 25, //折扣最高优惠
    full_reduceShow: false, //是否有满减 
    full_rule: "100", //买单满减条件，每满100减10元最高40元，条件是100元
    full_reduce: "20", //买单满减金额，每满100减10元最高40元，优惠金额是10元
    most_reduce: "60", //买单满减金额，每满100减10元最高40元，最高金额是40元
    picked: "",
    total: 0,
    subMon: 0, //计算后的优惠金额
    deDisPr: "", //为不参与折扣金额
    showYhq: false, //判断用户是否登录过，没有就不显示可用优惠券
    groupWarp: false, //用于显示购买团购券时的界面
  }
  var userId, bty, weixin_openid, wx_unionid, nick_name, zfb_openid, isAndroid
  var busDteObj = {} //ch-use:获取商家详情请求参数
  var bty = browserType()
  var hrefStr = location.href
  var b_id = getQueryString("b_id")
  var recordTimeObj = {
    userId:'',
    openId:'',
    api:[]
  }
  var op = {
    path:'pay/getOpenId'
  }
  var lg = {
    path:'passport/thirdWxLogin'
  }
  var create_pay = {
    path:'pay/create_pay'
  }
  var wxready = {
    path:'wxready'
  }
  if(!b_id) {
    if (getSession("b_id") && getSession("b_id") != "null") { //ch-use:扫码支付时从index.js获取session
      b_id = getSession("b_id")
    } else if (getQueryString("id") && getQueryString("id") != "null") {
      b_id = getQueryString("id")
    } else if (getCookie('business_id') && getCookie('business_id') != "null") { //ch-use:从商店详情去买单时获取cookie
      b_id = getCookie('business_id')
    }
  }
  // var b_id = getQueryString("b_id") == null ? getSession("b_id") : getQueryString("b_id")
  if (bty == 'weixin') {
    if (hrefStr.indexOf('code') == -1) {
      location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/PaymentTest/views/newDrainage/newPayPage.html?b_id=" + b_id + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"; //测试
      // location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";  //正式  
      // location.href =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb483b5983575f0fc&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";  //正式  
      // return        
    } else {

      op.bgTime = getTimer()
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
          op.endTime = getTimer()
          lg.bgTime = getTimer()
          if(res.code != 200) {
            prompt('扫码出现异常!')
            return
          }
          //---获取用户注册、登录参数
          weixin_openid = res.data.openid;
          wx_unionid = res.data.unionid
          nick_name = res.data.nickname
          //---获取创建订单参数
          weixin_pay_data = res.data
          weixin_pay_data.open_id = weixin_openid
          weixin_pay_data.pay_way = 'wechat_csb' //支付方式
          $.ajax({
            type: 'POST',
            url: baseURL+'passport/thirdWxLogin',
            data:JSON.stringify({
              // wx_web_openid:weixin_openid,
              wx_openid:weixin_openid,
              wx_unionid:wx_unionid,
              nick_name:nick_name
            }),
            headers: setHeader(),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success:function (data) {
              lg.endTime = getTimer()
              console.log(data)
              // data = data.data
              if(data.status == "error") {
                prompt(data.msg)
              }else {
                //保存用户登录信息
                var member_id = data.data.member_id
                setCookie("member_id",data.data.member_id);
                setCookie("mobile",data.data.mobile);
                setCookie("token",data.data.token);
                if(data.data.business_id == '' || data.data.business_id == undefined) {
                  $.ajax({
                    type: 'POST',
                    headers: setHeader(),
                    url: baseURL+'member/bindBusiness',
                    data:JSON.stringify({
                      member_id:member_id,
                      business_id:b_id
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    success:function (data) {
                      
                    }
                  })
                }
              }
            }
          })  
        },
      })
    }
  }else if( bty== "alipay") {
    if(hrefStr.indexOf('auth_code') == -1) {
      location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/PaymentTest/views/newDrainage/newPayPage.html?b_id="+b_id //测试
      // location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id //正式
      // location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017083008466534&scope=auth_base&redirect_uri=https://m.yingougou.com/payment/views/newDrainage/payPage.html?b_id="+b_id //正式
      return
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
          $.ajax({
            type: 'POST',
            headers: setHeader(),
            url: baseURL + 'passport/zfbRegister',
            data: JSON.stringify({
              zfb_openid:zfb_openid,
              nick_name:''
            }),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success: function (data) {
              // data = data.data
              if(data.status == "error") {
                prompt(data.msg)
              }else {
                //保存用户登录信息
                var member_id = data.data.member_id
                setCookie("member_id",data.data.member_id);
                setCookie("mobile",data.data.mobile);
                setCookie("token",data.data.token);
                if(data.data.business_id == '' || data.data.business_id == undefined) {
                  $.ajax({
                    type: 'POST',
                    headers: setHeader(),
                    url: baseURL+'member/bindBusiness',
                    data:JSON.stringify({
                      member_id:member_id,
                      business_id:b_id
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    success:function (data) {
                    }
                  })
                }
              }
            }
          })  
        }
      })  
    }
  }else {
    prompt('请使用微信或者支付宝扫码支付!')
  }
  loading(true)
  isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  if (location.search.indexOf("userId") != -1) {
    userId = location.search.split("&")[1].split("=")[1]
  }
  if (userId != "null" && userId != undefined && userId != "undefined") { //ch-use;判断用户是否登录过
    // vm.showYhq = true
    $('.yhq').removeClass('hide')
    $('.back').on('click',function () {
      window.history.go(-1);
    })
  } else {
    $('.yhq').addClass('hide')
    // vm.showYhq = false
    $('.back').addClass('hide')
  }
  busDteObj.business_id = b_id
  if (userId != undefined || userId != null) {
    busDteObj.member_id = userId
  }
  if (isAndroid) {
    $('.ad_input').removeClass('hide')
  } else {
    $('.ios_input').removeClass('hide')
  }
  getBusDetail(busDteObj)

  function getBusDetail(obj) {
    $.ajax({
      type: 'POST',
      headers: setHeader(),
      url: baseURL + 'business/getBusinessDetails',
      data: JSON.stringify(obj),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (data) {
        loading(false)
        if (data.code != 200) {
          prompt('请求错误!')
          return
        }
        $('.merchant_name').html(data.data.business_details.name)
        setSession('b_n', data.data.business_details.name) //用于引流页面获取商家名
        var busDetail = data.data.business_details
        if (busDetail.sale_status == true && busDetail.discount != null) {
          vm.discountShow = true
          vm.discount = busDetail.discount * 10
          vm.discountS = busDetail.discount
          if (busDetail.most_discount == -1) { //商家最高优惠没有限制时
            vm.most_discount = 10000000
          } else {
            vm.most_discount = busDetail.most_discount
          }
        }
        if (busDetail.reduce_status) {
          vm.full_reduceShow = true
          vm.full_rule = busDetail.full_rule
          vm.full_reduce = busDetail.full_reduce
          if (busDetail.most_reduce == -1) { //商家最高优惠没有限制时
            vm.most_reduce = 10000000
          } else {
            vm.most_reduce = busDetail.most_reduce
          }
        }
        if(vm.full_reduceShow) {
          domAction('mj', true)
          $('.mj_txt').html('每满'+vm.full_rule+'减'+vm.full_reduce+'元')
          if(vm.most_reduce < 10000000) {
            $('.max_mj').removeClass('hide').html('(最高减'+vm.most_reduce+'元)')
            $('.max_mj_yh').html(vm.subMon)
          }
          $('.mj_div').on('click',function(e) {//选择满减
            e.preventDefault();
            var dom = $(this).find('.mj_img')[0]
            action_yh (dom,'mj_show_con','mj')
            countFn()
          })
        }
        if(vm.discountShow) {
          domAction('dz', true)
          $('.dz_txt').html(''+vm.discount+'折')
          if(vm.most_discount < 10000000) {
            $('.max_dz').removeClass('hide').html('(最高减'+vm.most_discount+'元)')
            $('.max_dz_yh').html(vm.subMon)
          }
          $('.dz_div').on('click',function (e) {
            e.preventDefault()
            var dom = $(this).find('.dz_img')[0]
            action_yh (dom,'dz_show_con','dz')
            countFn()
          })
        }
      }
    })
  }
  //------------------当用户登录H5，并且选择优惠券支付时------开始
  $('.yhq_div').on('click',function (e) {
    e.preventDefault();
    var dom = $(this).find('.yhq_img')[0]
    action_yh (dom,'yhq_show_con','yhq')
    // if(vm.picked > 0 ) {
    //   setSession("parOrderTotal", vm.picked);
    //   if(vm.deDisPr >= 0 ) {
    //     setSession("deDisPr", vm.deDisPr);//用于选券页面计算优惠金额，不参与优惠金额
    //   }
    //   // var str = window.location.search
    //   // window.location.href = "../../views/newDrainage/payChangeTic.html"+str;
    // }else {
    //   prompt("请先输入有效金额");
    // }
  })
  if (getSession("parOrderTotal")) {
    vm.picked = getSession("parOrderTotal")
    $('.cut_before').val(vm.picked)
    if (getSession("disBefore")) {
      vm.payType = "yhq"
      vm.subMon = vm.picked - getSession("disBefore")
      $('.checkPrice').src = '../../assets/images/newDarinage/ic_selected@3x.png'
      domAction('yhq', true)
      action_yh ($('.yhq_img')[0],'yhq_show_con','yhq')
    } else {
      vm.subMon = 0
    }
    if (getSession("deDisPr")) {
      vm.deDisPr = main.getSession("deDisPr")
      vm.isDis = true
      $('.checkPrice').src = '../../assets/images/newDarinage/ic_selected1_xxh.png'
    }
    vm.total = vm.picked - vm.subMon
    countFn()
  }
  //选择优惠券
  $('.changeTic').on('click',function () {
    if(vm.picked > 0 ) {
      setSession("parOrderTotal", vm.picked);//用于选券页面计算优惠金额，消费总额
      if(vm.deDisPr > 0 ) {
        setSession("deDisPr", vm.deDisPr);//用于选券页面计算优惠金额，不参与优惠金额
      }
      var str = window.location.search
      location.href = "../../views/newDrainage/payChangeTic.html"+str;
    }else {
      prompt("请先输入有效金额")
    }
  })
  //------------------当用户登录H5，并且选择优惠券支付时------结束
  $('.checkWarp div').on('click', function (e) { //ch-use:是否有不参与优惠的金额
    var dom = $(this).find('.chPc')
    e.preventDefault();
    if (dom.hasClass('checkPrice')) { //未选中
      dom.removeClass('checkPrice').addClass('checkPrice_s')
      vm.isDis = true;
      domAction('checkInput', true)
    } else {
      vm.isDis = false;
      vm.deDisPr = 0
      $(".cut_after").val()
      dom.removeClass('checkPrice_s').addClass('checkPrice')
      domAction('checkInput', false)
    }
    countFn()
  })
  //输入总金额
  $('.cut_before').on('input', function (e) {//原总金额
    var dom = this
    if (dom.value.length > 0) {
      $(dom).css('fontSize', '0.4rem')
    } else {
      $(dom).css('fontSize', '0.3rem')
    }
    e.target.value = charAtNum(dom.value)
    vm.picked = charAtNum(dom.value?dom.value:0)
    countFn()
  })
  //输入不参与优惠金额
  $('.cut_after').on('input',function (e) {
    var dom = this
    if (dom.value.length > 0) {
      $(dom).css('fontSize', '0.4rem')
    } else {
      $(dom).css('fontSize', '0.3rem')
    }
    e.target.value = charAtNum(dom.value)
    vm.deDisPr = charAtNum(dom.value?dom.value:0)
    countFn()
  })
  //计算实际支付金额
  function countFn() {
    if (vm.isDis == false && vm.deDisPr == 0) { //在没有参与优惠金额时
      vm.picked = charAtNum(vm.picked)
      if (vm.payType == "dz") {
        vm.subMon = (vm.picked * (1 - vm.discountS)).toFixed(2)
        if (vm.most_discount < vm.subMon) { //是否超过最高优惠
          vm.subMon = vm.most_discount
        }
      } else if (vm.payType == "mj") {
        if (parseInt(vm.picked / vm.full_rule) > parseInt(vm.most_reduce / vm.full_reduce)) { //是否达到满减最高优惠
          vm.subMon = vm.most_reduce //优惠金额为最高优惠
        } else {
          vm.subMon = (parseInt(vm.picked / vm.full_rule) * vm.full_reduce).toFixed(2)
        }
      } else if (vm.payType == "yhq") {

      } else {
        vm.subMon = 0
      }
    } else { //有不参与优惠金额时      
      if (vm.payType == "dz") { //打折优惠
        if (vm.deDisPr >= vm.picked) { //不参与优惠大于总消费时，该情况可能是用户误输入,则按不参与消费金额为0处理
          // vm.subMon = (vm.picked * (1 - vm.discountS)).toFixed(2)
          vm.subMon = 0
          if (vm.most_discount < vm.subMon) { //是否超过最高优惠
            vm.subMon = vm.most_discount
          }
        } else { //不参与消费金额不为0时
          vm.subMon = ((vm.picked * (1 - vm.discountS)).toFixed(2) - vm.deDisPr * (1 - Number(vm.discountS))).toFixed(2)
          if (vm.most_discount < vm.subMon) { //是否超过最高优惠
            vm.subMon = vm.most_discount
          }
        }
      } else if (vm.payType == "mj") { //满减优惠
        if (vm.picked - vm.deDisPr >= vm.full_rule) { //当总消费去不参与优惠金额的差大于优惠规则金额时
          if (parseInt((vm.picked - vm.deDisPr) / vm.full_rule) > parseInt(vm.most_reduce / vm.full_reduce)) {
            vm.subMon = vm.most_reduce
          } else {
            vm.subMon = parseInt((vm.picked - vm.deDisPr) / vm.full_rule) * vm.full_reduce
          }

        } else { //小于则按不满足优惠条件处理
          vm.subMon = 0
        }
      } else if (vm.payType == "yhq") {

      } else {
        vm.subMon = 0
      }
    }
    vm.total = (vm.picked - vm.subMon).toFixed(2)
    if(vm.total >= 0) {
      $('.sj_total').html(vm.total)
      $('.qr_total').html(vm.total+'确认买单')
    }
    $('.show_limit').html(vm.subMon)
    return 
  }
  /**
   * dom当前点击图标
   * action_img显示金额
   * payType支付方式
   */
  
  function action_yh(dom,action_img,payType) {
    dom = $(dom)
    $('.rad').map(function(index,item) {
      if(index != $('.rad').index(dom)) {
        $(item).removeClass('rad_s')
      }
    })
    $('.limit').map(function (index,item) {
      if(index != $('.limit').index($('.'+action_img))) {
        $(item).addClass('hide')
      }
    })
    // console.log(dom)
    if(dom.hasClass('rad_s')) {
      vm.total =  vm.picked
      vm.payType = 'nothing'
      dom.removeClass('rad_s')
      $('.'+action_img).addClass('hide')
      $('.checkWarp').addClass('hide')
      domAction('checkInput', false)
    }else {
      vm.payType = payType
      $('.rad').map(function (index,item) {
        $(item).removeClass('rad_s')
      })
      dom.addClass('rad_s')
      $('.'+action_img).removeClass('hide')
      $('.checkWarp').removeClass('hide')
      if($('.chPc').hasClass('checkPrice_s')) {
        domAction('checkInput', true)
      }
      // if($('.checkPrice').attr('src').indexOf('ic_select1') == -1) {
      //   domAction('checkInput', true)
      // }
    }
    // if(dom.src.indexOf('ic_select@3x') != -1) {
    //   vm.payType = payType
    //   $('.rad').map(function (index,item) {
    //     $(item).src = '../../assets/images/newDarinage/ic_select@3x.png'
    //   })
    //   dom.src = '../../assets/images/newDarinage/ic_selected@3x.png'
    //   $('.'+action_img).removeClass('hide')
    //   $('.checkWarp').removeClass('hide')
    //   if($('.checkPrice').attr('src').indexOf('ic_select1') == -1) {
    //     domAction('checkInput', true)
    //   }
    // }else {
    //   vm.total =  vm.picked
    //   vm.payType = 'nothing'
    //   dom.src = '../../assets/images/newDarinage/ic_select@3x.png'
    //   $('.'+action_img).addClass('hide')
    //   $('.checkWarp').addClass('hide')
    //   domAction('checkInput', false)
    // }
  }
  //确认买单
  $('.checkPay').on('click',function (e) {
    e.preventDefault();
    if(location.href.indexOf("code") == -1) {//微信用户拒绝授权,跳往失败引导页面
      location.href = "../../views/newDrainage/payDefeat.html" 
    }
    var data = {}
    if(bty == 'weixin') {
      data = weixin_pay_data
      data.member_id = getCookie('member_id')
    }else if(bty = 'alipay') {
      data.member_id = getCookie('member_id')
    }
    data.amount = vm.picked;
    setSession("b_id",b_id)
    setSession("business_id",b_id);
    setSession("amount", vm.total);
    data.business_id = b_id
    if(vm.payType == "dz") {
      data.type = 1
      data.no_sale_amount = vm.deDisPr ==""?0:vm.deDisPr
      data.coupon_id
    }else if(vm.payType == "mj") {
        data.type = 2
        data.no_sale_amount = vm.deDisPr ==""?0:vm.deDisPr
    }else {
      if (getSession("c_id") != null)
        data.coupon_id = getSession("c_id");
      if (getSession("c_a_id") != null)
        data.coupon_activity_id = getSession("c_a_id");
    }
    if(vm.total > 0) {
      if(bty == "weixin") {
          if(location.href.indexOf("code") == -1) {//微信用户拒绝授权,跳往失败引导页面
            location.href = "../../views/newDrainage/payDefeat.html" 
          }else {
            payFn(bty,data,baseURL,ck)
          }
      }else {
        payFn(bty,data,baseURL,ck)
      }
    }else {
      prompt("请先输入有效金额");
    }
    function ck() {
      // location.href = "../../views/newDrainage/freeCoupons.html"+window.location.search;
      location.href =''+calllBcakUrl+'/views/my/purHistory.html' //用户登录过h5，支付成功后就跳往消费记录页面
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
      create_pay.bgTime = getTimer()
      $.ajax({
        type: 'POST',
        headers: setHeader(),
        url: baseURL+'pay/create_pay',
        data:JSON.stringify(weixin_pay_data),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success:function (res) {
          create_pay.endTime = getTimer()
          wxready.bgTime = getTimer()
          if(res.code == 200) {
            var orderId = res.data.order_id//获取店铺id，用来获取获取店铺复购券信息
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
              wxready.endTime = getTimer()
              wx.chooseWXPay({
                timestamp:res.data.timeStamp,
                nonceStr:res.data.nonceStr,
                package:res.data.package,
                signType:res.data.signType,
                paySign:res.data.paySign,
                success:function (res) {
                  recordTimeObj.api.push(op)
                  recordTimeObj.api.push(lg)
                  recordTimeObj.api.push(create_pay)
                  recordTimeObj.api.push(wxready)
                  recordTimeObj.userId = getCookie("member_id");
                  recordTimeObj.openId = weixin_openid
                  // alert(JSON.stringify(recordTimeObj))
                  $.ajax({//获取复购券详情，判断店铺是否有复购券
                    type: 'POST',
                    // headers: setHeader(),
                    url: 'https://www.sdfgod.com/api/ygg',
                    data:recordTimeObj,
                    dataType: 'json',
                    // contentType: 'application/json;charset=UTF-8',
                    success:function (data) {
                      // alert(JSON.stringify(data))
                    }
                  })
                  if(vm.payType == 'yhq') {//用户登录过，执行回调跳转到消费记录页面
                    callBack()
                  }else {
                    loading(true)
                    $.ajax({//获取复购券详情，判断店铺是否有复购券
                      type: 'POST',
                      headers: setHeader(),
                      url: baseURL+'common/getRebuyCoupon',
                      data:JSON.stringify({
                        order_id:orderId,
                        business_id:b_id
                      }),
                      dataType: 'json',
                      contentType: 'application/json;charset=UTF-8',
                      success:function (data) {
                        if(data.status == "error") {
                          loading(false)
                          prompt(data.msg)
                          return
                        }else {
                          data = data.data
                          if(data.coupon ) {//有复购券
                            var amount,rule
                            var coupon_activity_id = data.coupon.coupon_id  //复购券id
                            if (data.coupon.type == 0) {
                              amount =  data.coupon.discount+"";
                              if(amount.indexOf(".") == -1) {
                                amount =  data.coupon.discount+".00";
                              }else {
                                amount =  data.coupon.discount;
                              }
                            }else if (data.coupon.type == 1) {
                                amount = data.coupon.rate * 10 + "折";
                            }
                            if((data.coupon.min_price+"").indexOf(".") ==-1) {
                              rule = "满" +data.coupon.min_price+ ".00可用";
                            }else {
                              rule = "满" +data.coupon.min_price+ "可用";
                            }
                            setSession("how", amount );
                            setSession("all",rule );
                            $.ajax({//领取复购券
                              type: 'POST',
                              headers: setHeader(),
                              url: baseURL+'common/receiveRebuyCoupon',
                              data:JSON.stringify({
                                member_id:getCookie('member_id'),
                                coupon_activity_id:coupon_activity_id
                              }),
                              dataType: 'json',
                              contentType: 'application/json;charset=UTF-8',
                              success:function (data) {
                                loading(false)
                                if(data.code == 200) {
                                  location.href = "../../views/newDrainage/couponsSuccess.html";
                                }else {
                                  prompt(data.msg)
                                  return
                                }
                              }
                            })  
                          }else {
                            loading(false)
                            location.href =''+calllBcakUrl+'/views/my/purHistory.html' //没有就跳转h5的消费记录页
                          }
                        }
                      }
                    })  
                  }
                }
              })  
            })
            loading(false)
          }
        }
      })
    }else if(browserType =="alipay") {//支付宝扫码进入
      loading(true)
      data.buyer_id = zfb_openid
      data.pay_way ='alipay_csb'
      $.ajax({
        type: 'POST',
        headers: setHeader(),
        url: baseURL+'pay/create_pay',
        data:JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success:function (res) {
          if(res.code == 200 ) {
            var orderId = res.data.order_id//获取店铺id，用来获取获取店铺复购券信息
            var tradeNo = res.data.tradeNO;
            setSession("tradeNO", tradeNo);
            loading(false)
            AlipayJSBridge.call("tradePay",{
              tradeNO:getSession("tradeNO")
            }, function(result){
              if(result.resultCode == 9000) {
                setSession("amount", data.amount);
                setSession("business_id", getQueryString("b_id"));
                if(vm.payType == 'yhq') {
                  callBack()
                }else {
                  loading(true)
                  $.ajax({//获取复购券详情，判断店铺是否有复购券
                    type: 'POST',
                    headers: setHeader(),
                    url: baseURL+'common/getRebuyCoupon',
                    data:JSON.stringify({
                      order_id:orderId,
                      business_id:b_id
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    success:function (data) {
                      if(data.status == "error") {
                        loading(false)
                        prompt(data.msg)
                        return
                      }else {
                        data = data.data
                        if(data.coupon ) {//有复购券
                          var amount,rule
                          var coupon_activity_id = data.coupon.coupon_id  //复购券id
                          if (data.coupon.type == 0) {
                            amount =  data.coupon.discount+"";
                            if(amount.indexOf(".") == -1) {
                              amount =  data.coupon.discount+".00";
                            }else {
                              amount =  data.coupon.discount;
                            }
                          }else if (data.coupon.type == 1) {
                              amount = data.coupon.rate * 10 + "折";
                          }
                          if((data.coupon.min_price+"").indexOf(".") ==-1) {
                            rule = "满" +data.coupon.min_price+ ".00可用";
                          }else {
                            rule = "满" +data.coupon.min_price+ "可用";
                          }
                          setSession("how", amount );
                          setSession("all",rule );
                          $.ajax({//领取复购券
                            type: 'POST',
                            headers: setHeader(),
                            url: baseURL+'common/receiveRebuyCoupon',
                            data:JSON.stringify({
                              member_id:getCookie('member_id'),
                              coupon_activity_id:coupon_activity_id
                            }),
                            dataType: 'json',
                            contentType: 'application/json;charset=UTF-8',
                            success:function (data) {
                              loading(false)
                              if(data.code == 200) {
                                location.href = "../../views/newDrainage/couponsSuccess.html";
                              }else {
                                prompt(data.msg)
                                return
                              }
                            }
                          })  
                        }else {
                          loading(false)
                          location.href =''+calllBcakUrl+'/views/my/purHistory.html' //没有就跳转h5的消费记录页
                        }
                      }
                    }
                  })  
                }
              }else {
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

  //----------------------工具类函数--------开始------------
  function getTimer() {
    return (new Date()).valueOf()
  }
  function charAtNum(num) { //ch-use:限制输入框输入类型
    num = num + ""
    num = num.replace(/[^\d.]/g, "")
    num = num.replace(/\.{2,}/g, ".");
    num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (num.indexOf(".") < 0 && num != "") {
      num = parseFloat(num);
    }
    return num
  }
  //dom hide show
  function domAction(dom, status) {
    if (status) {
      $('.' + dom).removeClass('hide').addClass('show')
    } else {
      $('.' + dom).removeClass('show').addClass('hide')
    }
  }
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
  //---存取session----开始
  function setSession(key, value) {
    var s = sessionStorage;
    s.setItem(key, value);
  };

  function getSession(key) {
    return sessionStorage.getItem(key);
  };

  function clearSessionItem(key) {
    if (key == null || key == "")
      return;
    sessionStorage.removeItem(key);
  };

  function clearSession() {
    if (sessionStorage != null)
      sessionStorage.clear();
  };
  //---存取session----结束
  // ----------开始--------ch-use:用于payPage页面获取由h5店铺详情点击优惠买单时设置的cookie
  function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }

  function setCookie(name, value) {
    var Days = 365;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  }

  function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
  // ---------结束---------ch-use:用于payPage页面获取由h5店铺详情点击优惠买单时设置的cookie
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
    var token = getCookie("token") ? getCookie("token"): getSession("token") ;
    if (tk != null || tk != undefined) {
      token = tk
    }
    var timestamp = (new Date()).valueOf();
    var sign = getMd5(appid + timestamp);
    if (token != null) {
      sign = getMd5(appid + timestamp + token);
    }
    var headers = {
      appid: appid,
      sign: sign,
      timestamp: timestamp,
      token: token,
      member_id:getCookie('member_id')
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
      ga.src = '../../antbridge.min.js'
    }
    
    var s = document.getElementsByTagName('script')[0]; 
    s.parentNode.insertBefore(ga, s);
  }, false);

})()