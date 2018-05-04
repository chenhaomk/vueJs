require(['config'], function () {
  require(['vue', 'swiper', 'main'], function (Vue, Swiper, ygg) {
    ygg.loading(true);
    var specialId = window.location.search.split('=')[1] //专题id
    var lng = ygg.getCookie('lng')
    var lat = ygg.getCookie('lat')
    var area_id = ygg.getCookie('area_id')
    var vm = new Vue({
      el: "#app",
      data: {
        title:'',
        msg:'',
        banner:'',
        shopList:[],
        isKong:''
      },
      components: {
        list: ygg.template.specialDetailshopList
      },
      methods: {
        menuSwitch: function (index, id) {
          this.ind = index;
          getListObj.industry_id = id;
          getList(function (data) {
            vm.$set(vm, 'shopList', data)
          });
        }
      }
    })

    getSpecialDetil(specialId,lat,lng,area_id)
    function getSpecialDetil(id,lat,lng,area_id) {
      ygg.ajax('/home/getSpecialSubjectDetail', {
        special_subject_id:id,
        longitude:lng,
        latitude:lat,
        area_id:area_id
      },function (data) {
        ygg.loading(false);
        if(data.code == 200 ) {
          vm.title = data.data.special_subject_name
          vm.msg = data.data.special_subject_introduction
          vm.banner = data.data.special_subject_img
          vm.$set(vm, 'shopList', data.data.businesses)
        }
      })
    }



  });
});