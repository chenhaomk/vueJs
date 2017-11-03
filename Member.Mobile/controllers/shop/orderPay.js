require(['config'],function(){
    require(['vue','swiper','main'],function (Vue,Swiper,ygg) {
        var payType = location.search.split("?")[1]//折扣买单还是满减买单

    	var vm = new Vue({
            el : "#app",
            data : {
                shopName:ygg.getCookie('shopName'),
                discountShow:payType == "discount"?true:false,
                full_reduceShow:payType == "full_reduce"?true:false,
                discount:0.9,//折扣ygg.getCookie('discount')
                full_rule:100, //满减条件）ygg.getCookie('full_rule')
                full_reduce:10,//满减金额ygg.getCookie('full_reduce')
                most_reduce:40,//满减最高优惠ygg.getCookie('most_reduce')
                subMon:0,//优惠金额
                total:0,//优惠后的总价
                picked:"",
                totalSp:false,
            },
            methods : {
                menuSwitch : function(index,id){
                    this.ind = index;
                    getListObj.industry_id = id;
                    getList(function(data){vm.$set(vm,'shopList',data)});
                },
                pageBack:function () {   
                    ygg.delCookie("discount") 
                    ygg.delCookie("shopName")
                    ygg.delCookie("full_rule")
                    ygg.delCookie("full_reduce") 
                    ygg.delCookie("most_reduce")               
                    window.history.go(-1)
                },
                disBefore:function (event) {//原总金额

                    this.picked = charAtNum(this.picked)
                    if(this.discountShow) {//折扣
                        this.subMon = (this.picked *(1-this.discount)).toFixed(2)
                    }else {//满减               
                        if(parseInt(this.picked/this.full_rule) > parseInt(this.most_reduce/this.full_reduce) ) { //是否达到满减最高优惠
                            this.subMon = this.most_reduce //优惠金额为最高优惠
                        }else {
                            this.subMon = parseInt(this.picked/this.full_rule)*this.full_reduce 
                        }
                         
                    }
                    this.total = this.picked - this.subMon
                    if(this.picked != 0 || this.picked != "") {
                        this.totalSp = true
                    }else {
                        this.totalSp = false
                    }
                },
                noDis:function (event) {
                    if(this.picked == "" || this.picked == 0) {
                        event.target.value = ""
                    }else {
                        // if(event.target.value == 0) {
                        //     this.subMon = 0
                        //     this.total = this.picked 
                        // }else {
                            event.target.value = charAtNum(event.target.value)
                            if(this.discountShow) { 
                                if(event.target.value > this.picked) {
                                    this.subMon = 0
                                    this.total = this.picked
                                    // this.subMon = (this.picked *(1-this.discount)).toFixed(2)
                                }else {
                                    this.subMon = (this.picked *(1-this.discount)).toFixed(2) - event.target.value*(1-this.discount).toFixed(2) 
                                }
                            }else {
                                if(event.target.value > this.picked) {
                                    this.subMon = 0
                                    this.total = this.picked
                                }else {
                                    this.subMon = parseInt(this.picked/this.full_rule)*this.full_reduce
                                }
                                 
                            }
                            this.total = this.picked -this.subMon
                        // }


                    }
                },
                toPayPage:function () {
                    console.log("maidan")
                }
            }
        })
        function charAtNum(num) {
            num = num.replace(/[^\d.]/g,"")
            num = num.replace(/\.{2,}/g,"."); 
            num = num.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
            num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); 
            if(num.indexOf(".")< 0 && num !=""){
                num= parseFloat(num); 
            }
            return num
        }
    })
});