require(['config'], function () {
    require(['axio', 'vue', 'mock', 'mockApi', 'main'], function (ajax, vue, mock, mockApi, main) {
    	var baseURL = 'http://192.168.0.229:8081/v1.0/';
    	//判断是否在微信浏览器
    	function isWeiXin() {
	        var ua = window.navigator.userAgent.toLowerCase();
	        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
	            return "weixin"
	        } else if(ua.match(/Alipay/i)=="alipay"){
	            return "alipay";
	        }else {
	        	return "other"
	        }
    	}

    	if(isWeiXin()) {

    	}else {

    	}
    	var vm = new vue({
    		el:"#app",
    		data:{
    			totalMoney:"",
    			url:""
    		},
    		methods:{
    			pay:function() {
    				if(isWeiXin() =="weixin") {
    					console.log("微信支付")
    				}else if(isWeiXin() =="alipay") {

    				}else {
    					console.log("H5支付")
			    		main.post(baseURL + "pay/create_pay", {
                            amount: 0.1,
                            member_id: 'd6c74ca9f49945c28c282e4a93def6c9',
                            business_id: '2c92f9245f5d0d46015f5d0e00f40002',
                            pay_way: 'wechat_wap'
                        }, function (res) {
                            console.log(res)
                            if (res.data.code == 200) {
                                location.href = res.data.data;
                            }
                        });
    				}
    			}
    		}
    	})
        
        function fn(dom,length) { //dom位原生节点，length用来限制卡号位数（23就代表为15位银行卡，26代表21位银行卡）
            dom.oninput = function (e) {
                this.setAttribute("data-oral",this.value.replace(/\ +/g,""));
                var self = trim(this.value) ;
                var temp = this.value.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
                if(self.length > length){
                    this.value = self.substr(0, length);
                    return this.value;
                }
                if(temp != this.value){
                    this.value = temp;
                }
            }
            function trim(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }
        }

    })
 })   