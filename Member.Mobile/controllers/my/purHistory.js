require(['config'],function(){
    require(['vue','main',"swiper"],function (Vue,ygg,Swiper) {

        var vm = new Vue({
            el : "#app",
            data : {
                list : [],
                scrollIsShow : true,
                isNo : "",
                comIsShow : "",
                star : new Array(5),
                comText : "",
                bid : "",
                ssz : 0,
                oid : "",
                shop : [],
                comIsSuc : "",
                comIndex : 0
            },
            components : {
                
            },
            methods : {
                comment : function(t,bid,oid,ind){
                    if(t == "去评价"){
                        this.comIsShow = "show";
                        this.bid = bid;
                        this.oid = oid;
                        this.comIndex = ind;
                    }
                },
                comm : function(index){
                    this.ssz = index + 1;
                    for(var i=0;i<this.star.length;i++){
                        i<=index?this.$set(this.star,i,"active"):this.$set(this.star,i,"");
                    }
                },
                subComment : function(){
                    ygg.loading(true);
                    var that = this;
                    ygg.ajax('/member/addMemberEvaluationBusiness',{
                        member_id : member_id,
                        business_id : that.bid,
                        star : that.ssz * 10,
                        content : that.comText,
                        orders_id : that.oid
                    },function(data){
                        ygg.loading(false);
                        data = data.data;
                        that.shop = data.guess_like_list;
                        that.comIsShow = "";
                        that.comIsSuc = "show";
                        that.list[that.comIndex].statusT = '已评价';

                        setTimeout(function(){
                            new Swiper('.swiper-shop', {
                                slidesPerView: 'auto',
                                paginationClickable: true,
                                spaceBetween: 1*rem,
                                freeMode: true
                            });
                        },1);
                    });
                }
            },
            computed : {
                syComText : function(){
                    return 140-this.comText.length;
                }
            }
        }),
        flag = false,
        height = document.getElementsByClassName('height')[0].clientHeight,
        member_id = ygg.getCookie("member_id"),
        obj = {
            member_id : member_id,
            type : 1,
            page : 1,
            size : 10
        };

        if(!member_id)window.open('http://'+window.location.host,"_self");

        getList(function(data){
            vm.$set(vm,'list',data);
        });

        window.onscroll = function(e){
            if(e.target.scrollingElement.scrollTop + height + 5.5*rem >= e.target.scrollingElement.clientHeight){
                if(flag)return;
                flag = true;
                obj.page++;
                getList(function(data){
                    vm.$set(vm,"list",vm.list.concat(data));
                    flag = false;
                });
            }
        }

        function getList(cb){
            ygg.ajax('/member/getPayRecord',obj,function(data){
                data = data.data;

                if(data.pay_record_list.length != 0){
                    for(var i=0;i<data.pay_record_list.length;i++){
                        data.pay_record_list[i].pay_date = ygg.getd("Y.m.d H:i",data.pay_record_list[i].pay_date/1000);
                        switch(data.pay_record_list[i].status){
                            case 1:
                            data.pay_record_list[i].statusT="去评价";
                            break
                            case 3:
                            data.pay_record_list[i].statusT="已评价";
                            break
                        }

                    }
                }

                if(obj.page > data.pages && data.pages != 0){
                    vm.$set(vm,"scrollIsShow",false);
                    return;
                }else if(data.pages <= 1){
                    vm.$set(vm,"scrollIsShow",false);
                }
                if(data.pages == 0){
                    vm.$set(vm,"isNo","no");
                    vm.$set(vm,'list',data.pay_record_list);
                    return;
                }else{
                    vm.$set(vm,"isNo","");
                }
                cb(data.pay_record_list);
            });
        }

    });
});