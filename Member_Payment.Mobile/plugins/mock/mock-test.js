/*
create:sdf;
date:2017-07-18;
note:数据字段根据现有字段实际模拟，字段因为系统未定，会随时变动，做好纪录
*/

define(['mock'], function (Mock) {
	//结算完成后，可领卷
	Mock.mock('http://shopcoupon.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			id: 1,
			logo: '小胖日式烤肉店',
			imgs_inner: ['../../assets/images/darinage/demo3.jpg'],
			title_log: '../../assets/images/darinage/bg_user@2x.png',
			area_name: '成都·复城国际店复城国际店',
			payMoney: "18.50",
			coupon_kind: 1,
			coupon_kind_label: '支付成功!',
			coupon_use: {
				all: "满200可用",
				how: "50"
			},
			coupon_time: '07.07.12-07.12.12',
		},
		version: "1.0",
		msg: ""
	});

	//获取验证码
	Mock.mock('http://shopcouponphone.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			status: 1,
			code: '9527'
		},
		version: "1.0",
		msg: ""
	});

	//提交领卷验证
	Mock.mock('http://shopcouponsubmit.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			status: 1,
			msg: '提交成功'
		},
		version: "1.0",
		msg: ""
	});

	//未登陆支付
	Mock.mock('http://paymenttomerchant.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			merchant_name: "兵哥豌豆面(复城国际店)",
			pay_kind: [1, 2],
			pay_kind_label: ["微信支付", "支付宝支付"]
		},
		version: "1.0",
		msg: ""
	});

	//登陆支付
	Mock.mock('http://loggedtomerchant.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			merchant_name: "兵哥豌豆面(复城国际店)",
			pay_kind: [1, 2, 3],
			pay_kind_label: ["微信支付", "支付宝支付", "inGogo支付"],
			user_inner: ['../../assets/images/payment/ic_user@2x.png'],
			userPhone: "13422222222",
			discount: [{
				id: 1,
				lable: "本店优惠",
				count: 1
			}, {
				id: 2,
				lable: "9折优惠卷",
				count: 1.3
			}, {
				id: 3,
				lable: "2元抵扣卷 5元",
				count: 3
			}]
		},
		version: "1.0",
		msg: ""
	});

	//登陆支付
	Mock.mock('http://loggedtomerchantmanual.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			merchant_name: "兵哥豌豆面(复城国际店)",
			pay_kind: [1, 2, 3],
			pay_kind_label: ["微信支付", "支付宝支付", "inGogo支付"],
			user_inner: ['../../assets/images/payment/ic_user@2x.png'],
			userPhone: "13422222222",
			discount: [{
				id: 1,
				lable: "本店优惠",
				count: 1
			}]
		},
		version: "1.0",
		msg: ""
	});
	//我的可用优惠券
	Mock.mock('http://availablecoupons.cn', {
		token: "71856476a36e434e9b32ce43c293054b",
		status: "success",
		code: 200,
		data: {
			coupenList: [{
					id: 1,
					lable: "9折共享折扣券",
					kind:true,
					kindLabel: 9.5,
					kindUnit: "折",
					dkCoupon: "",
					howtoCoupon: "满5可用"
				},
				{
					id: 1,
					lable: "9折共享折扣券9折共享折扣券9折共享折扣券9折共享折扣券",
					kind:false,
					kindLabel: 20,
					kindUnit: "元",
					dkCoupon: "100元",
					howtoCoupon: "满100可用"
				},
				{
					id: 1,
					lable: "9折共享折扣券",
					kind:false,
					kindLabel: 9.5,
					kindUnit: "折",
					dkCoupon: "",
					howtoCoupon: "满5可用"
				}
			]
		},
		version: "1.0",
		msg: ""
	});

	// //优惠筛选饮食类别
	// Mock.mock('http://discount.filter.type.cn',{
	// 	'list' : [{id:1,name:'小吃快餐'},{id:2,name:'火锅串串'},{id:3,name:'西餐'},{id:4,name:'日式料理'},{id:5,name:'韩式料理'},{id:6,name:'泰国菜'},{id:7,name:'中餐'}]
	// });

	// //优惠筛选地域
	// Mock.mock('http://discount.filter.region.cn',{
	// 	'list' : [{id:1,name:'附近'},{id:2,name:'武侯区'},{id:3,name:'锦江区'},{id:4,name:'青羊区'},{id:5,name:'高新区'}]
	// });

	// //优惠详情
	// Mock.mock('http://discount.detail.cn',{
	// 	'list' : [{
	// 		'id|1-100':1,
	// 		'logo' : '@url',
	// 		'name' : '我是优惠名称',
	// 		'money|1-50' : 1,
	// 		'content' : '我是代金券详情内容！',
	// 		'notice' : '购买你需要知道些什么!',
	// 		'isObtain|1' : Boolean
	// 	}]
	// });

	// //商铺优惠信息列表
	// Mock.mock('http://discount.cn',{
	// 	'list|5-10' : [{
	// 		'id|+1':1,
	// 		'discountType|1' : ['discount','voucher'],
	// 		'imgUrl' : '@url',
	// 		'title|1' : ['兵哥豌豆面','小胖日式烤肉','泰泰锅','老太婆摊摊面'],
	// 		'discounted|1-9.1' : 1,
	// 		'discountedLimit|1-100' : 1,
	// 		'distance|0-9.1' : 1,
	// 		'quota|1-100' : 1,
	// 		'isObtain|1' : Boolean
	// 	}]
	// });

	// //首页定位附近、历史列表
	// Mock.mock('http://home.address.near.cn', {
	// 	'list|3-5': [{'id|+1':1,'address|1':['四川省成都市武侯区...','四川省成都市青羊区...','四川省成都市高新区...','四川省成都市锦江区...']}]
	// });

	// //首页城市选择
	// Mock.mock('http://home.city.cn',{
	// 	'list' : [{
	// 		'id':1,
	// 		'province' : '四川省',
	// 		'citys' : [{
	// 			'id' : 1,
	// 			'city' : '成都市',
	// 			'areas' : [{id:1,area:'高新区'},{id:2,area:'锦江区'},{id:3,area:'武侯区'}]
	// 		},{
	// 			'id' : 2,
	// 			'city' : '绵阳市',
	// 			'areas' : [{id:1,area:'安县'},{id:2,area:'江油'},{id:3,area:'三台'},{id:4,area:'涪城区'}]
	// 		}]
	// 	},{
	// 		'id':2,
	// 		'province' : '陕西省',
	// 		'citys' : [{
	// 			'id' : 1,
	// 			'city' : '西安市',
	// 			'areas' : [{id:1,area:'莲湖区'},{id:2,area:'新城区'},{id:3,area:'碑林区'}]
	// 		},{
	// 			'id' : 2,
	// 			'city' : '铜川市',
	// 			'areas' : [{id:1,area:'耀州区'},{id:2,area:'王益区'},{id:3,area:'印台区'}]
	// 		}]
	// 	}]
	// });

	// //商铺详情
	// Mock.mock('http://shop.detail.cn',{
	// 	'list' : [{
	// 		'id|1-100':1,
	// 		'banner' : '@url',
	// 		'title|1' : ['兵哥豌豆面','小胖日式烤肉','泰泰锅','老太婆摊摊面'],
	// 		'score|1-5.1' : 1,
	// 		'tel' : 13678167146,
	// 		'distance|0-9.1' : 1
	// 	}]
	// });

	// //评论
	// Mock.mock('http://comment.cn',{
	// 	'list|5-10' : [{
	// 		'id|+1':1,
	// 		'score|1-5.1' : 1,
	// 		'content|1-4' : "这个东西超好吃！",
	// 		'date' : '@date',
	// 		'userInfo' : {
	// 			'id|1-100' : 1,
	// 			name : "@name",
	// 			photo : "@url"
	// 		}
	// 	}]
	// });


});