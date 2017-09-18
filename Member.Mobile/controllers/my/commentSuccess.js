require(['config'],function(){
    require(['axio','vue','main','swiper','mock','mock-api'],function (axio,Vue,ygg,Swiper) {

    	var vm = new Vue({
            el : "#app",
            data : {
                shop : []
            },
            methods : {
                
            }
        });

        ygg.all([
            axio.post('http://shop.cn',{})
        ],function(shop){

            vm.shop = shop.data.list;

            setTimeout(function(){
                new Swiper('.swiper-shop', {
                    slidesPerView: 'auto',
                    paginationClickable: true,
                    spaceBetween: 1*rem,
                    freeMode: true
                });
            },1);
        });


    });
});