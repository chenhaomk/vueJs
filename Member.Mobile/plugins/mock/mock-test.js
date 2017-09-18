define(['mock'],function(Mock){
	//首页banner
	Mock.mock('http://home.banner.cn',{
		'list|3-5' : [{'id|+1':1,imgUrl:'@url','text|1':['99元任选10件','88元任选9件','66元任选7件','77元任选8件']}]
	});

	//商铺信息列表
	Mock.mock('http://shop.cn',{
		'list|5-10' : [{'id|+1':1,imgUrl:'@url','title|1':['兵哥豌豆面','小胖日式烤肉','泰泰锅','老太婆摊摊面'],logo:'@url','distance|0-9.1':1}]
	});

	//优惠筛选饮食类别
	Mock.mock('http://discount.filter.type.cn',{
		'list' : [{id:1,name:'小吃快餐'},{id:2,name:'火锅串串'},{id:3,name:'西餐'},{id:4,name:'日式料理'},{id:5,name:'韩式料理'},{id:6,name:'泰国菜'},{id:7,name:'中餐'}]
	});

	//优惠筛选地域
	Mock.mock('http://discount.filter.region.cn',{
		'list' : [{id:1,name:'附近'},{id:2,name:'武侯区'},{id:3,name:'锦江区'},{id:4,name:'青羊区'},{id:5,name:'高新区'}]
	});

	//优惠详情
	Mock.mock('http://discount.detail.cn',{
		'list' : [{
			'id|1-100':1,
			'logo' : '@url',
			'name' : '我是优惠名称',
			'title' : '我是优惠标题',
			'money|1-50' : 1,
			'content' : '我是代金券详情内容！',
			'notice' : '购买你需要知道些什么!',
			'isObtain|1' : Boolean
		}]
	});

	//商铺优惠信息列表
	Mock.mock('http://discount.cn',{
		'list|2-4' : [{
			'id|+1':1,
			'discountType|1' : ['discount','voucher'],
			'imgUrl' : '@url',
			'title|1' : ['兵哥豌豆面','小胖日式烤肉','泰泰锅','老太婆摊摊面'],
			'type|1' : ['共享券','专属券'],
			'discounted|1-9.1' : 1,
			'discountedLimit|1-100' : 1,
			'distance|0-9.1' : 1,
			'quota|1-100' : 1,
			'isObtain|1' : Boolean
		}]
	});

	//首页定位附近、历史列表
	Mock.mock('http://home.address.near.cn', {
		'list|3-5': [{'id|+1':1,'address|1':['四川省成都市武侯区...','四川省成都市青羊区...','四川省成都市高新区...','四川省成都市锦江区...']}]
	});

	//首页城市选择
	Mock.mock('http://home.city.cn',{
		'list' : [{
			'id':1,
			'province' : '四川省',
			'citys' : [{
				'id' : 1,
				'city' : '成都市',
				'areas' : [{id:1,area:'高新区'},{id:2,area:'锦江区'},{id:3,area:'武侯区'}]
			},{
				'id' : 2,
				'city' : '绵阳市',
				'areas' : [{id:1,area:'安县'},{id:2,area:'江油'},{id:3,area:'三台'},{id:4,area:'涪城区'}]
			}]
		},{
			'id':2,
			'province' : '陕西省',
			'citys' : [{
				'id' : 1,
				'city' : '西安市',
				'areas' : [{id:1,area:'莲湖区'},{id:2,area:'新城区'},{id:3,area:'碑林区'}]
			},{
				'id' : 2,
				'city' : '铜川市',
				'areas' : [{id:1,area:'耀州区'},{id:2,area:'王益区'},{id:3,area:'印台区'}]
			}]
		}]
	});

	//商铺详情
	Mock.mock('http://shop.detail.cn',{
		'list' : [{
			'id|1-100':1,
			'banner' : '@url',
			'title|1' : ['兵哥豌豆面','小胖日式烤肉','泰泰锅','老太婆摊摊面'],
			'score|1-5.1' : 1,
			'tel' : 13678167146,
			'distance|0-9.1' : 1
		}]
	});

	//评论
	Mock.mock('http://comment.cn',{
		'list|5-10' : [{
			'id|+1':1,
			'score|1-5.1' : 1,
			'content|1-4' : "这个东西超好吃！",
			'date' : '@date',
			'userInfo' : {
				'id|1-100' : 1,
				name : "@name",
				photo : "@url"
			}
		}]
	});


});