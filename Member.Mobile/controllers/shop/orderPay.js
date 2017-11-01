require(['config'],function(){
    require(['vue','swiper','main'],function (Vue,Swiper,ygg) {
        var payType = location.search.split("?")[1]//折扣买单还是满减买单

    	var vm = new Vue({
            el : "#app",
            data : {
                shopName:ygg.getCookie('shopName'),
                discountShow:payType == "discount"?true:false,
                full_reduceShow:payType == "full_reduce"?true:false,
                discount:ygg.getCookie('discount'),//折扣
                full_rule:ygg.getCookie('full_rule'), //满减
                full_reduce:ygg.getCookie('full_reduce'),//满减
                most_reduce:ygg.getCookie('most_reduce'),//满减
                subMon:0,//优惠金额
                total:0,//优惠后的总价
                picked:""
            },
            methods : {
                menuSwitch : function(index,id){
                    this.ind = index;
                    getListObj.industry_id = id;
                    getList(function(data){vm.$set(vm,'shopList',data)});
                },
                pageBack:function () {                   
                    window.history.go(-1)
                },
                disBefore:function (event) {//原总金额
                    this.picked = charAtNum(this.picked)
                    if(this.discountShow) {//折扣
                        this.subMon = (this.picked *(1-0.98)).toFixed(2)
                    }else {
                        
                        
                        if(this.picked/this.full_rule > this.most_reduce/this.full_reduce )
                    }
                },
                noDis:function (event) {
                    if(this.picked == "" || this.picked == 0) {
                        event.target.value = ""
                    }else {
                        event.target.value = charAtNum(event.target.value)
                        if(event.target.value > this.picked) {
                            this.subMon = (this.picked *(1-0.98)).toFixed(2)
                        }else {
                            this.subMon = (this.picked *(1-0.98)).toFixed(2) - event.target.value*(1-0.98).toFixed(2)
                        }
                    }
                    
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