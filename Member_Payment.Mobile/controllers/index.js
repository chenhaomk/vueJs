require(['config'], function () {
	require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
		var bussinessID = "",
			memberID = "",
			bussinessName = "",
			bussinessID = main.getQueryString("b_id") == null ? main.getSession("b_id") : main.getQueryString("b_id"),
			memberID = main.getQueryString("m_id") == null ? main.getSession("m_id") : main.getQueryString("m_id"),
			bussinessName = main.getQueryString("b_n") == null ? main.getSession("b_n") : main.getQueryString("b_n"),
			couponID = main.getQueryString("c_id") == null ? main.getSession("c_id") : main.getQueryString("c_id"),
			couponAID = main.getQueryString("c_a_id") == null ? main.getSession("c_a_id") : main.getQueryString("c_a_id");
		main.setSession("b_id", bussinessID);
		main.setSession("b_n", decodeURI(bussinessName));
		if (couponID != null)
			main.setSession("c_id", couponID);
		if (couponAID != null)
			main.setSession("c_a_id", couponAID);
		var imgurl = decodeURI(main.getQueryString("img") == null ? main.getSession("img") : main.getQueryString("img")).replace("%2F", "/").replace("%2F", "/").replace("%3A", ":");
		if (imgurl.indexOf("https") < 0)
			imgurl = "https://img.yingegou.com/" + imgurl;
		if (main.getQueryString("img") != null && main.getSession("img") == null)
			main.setSession("img", "https://img.yingegou.com/" + decodeURI(main.getSession("img")));
		main.setSession("img", imgurl);
		main.setSession("a_n", decodeURI(main.getQueryString("a_n") == null ? main.getSession("a_n") : main.getQueryString("a_n")));
		main.setSession("c_n", decodeURI(main.getQueryString("c_n") == null ? main.getSession("c_n") : main.getQueryString("c_n")).replace("%2F", "/"));

		function init() {
			if (main.getSession("sn") == null) {
				location.href = "/payment/views/payment/index.html";
				return;
			}

			main.post("http://192.168.1.130:8082/v1.0/common/getOrdersStatus", {
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
								location.href = "https://m.yingegou.com/";
							} else
								location.href = "/payment/views/payment/views/drainage/drainagenologin.html";
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
	});
});