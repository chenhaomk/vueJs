require(['config'], function () {
  require(['vue', 'main', 'swiper', 'axio'], function (Vue, ygg, Swiper, axio) {
    
      var vm = new Vue({
              el: "#app",
              data: {
                  banner: [],
                  shop: [],
                  discount: [],
                  user: {
                      photo: "/assets/images/index/ic_bg_user_xxh.png"
                  },
                  openUser: "",
                  openShadow: '',
                  city: "",
                  business: {},
                  filterType: "全部",
                  filterShop: "行业",
                  filterAddress: "所有商圈",
                  filterSort: "智能排序",
                  isShowMy: false,
                  isLogin: false,
                  searchShow: "",
                  searchVal: "",
                  hotSearch: [],
                  hisSearch: [],
                  islo: false,
                  scrollIsShow: true,
                  shopList: [],
                  scrollIsShow2: false,
                  isSS: true,
                  isEmpty: "",
                  downLoadType: "",
                  showDown: true
              },
              components: {
                  my: ygg.template.my,
                  dis: ygg.template.discountHomePage,
                  list: ygg.template.shopList
              },
              methods: {
                  closeDownLoad: function () {
                      if (this.showDown)
                          this.showDown = false;
                  },
                  isWeixin: function () { //判断是否是微信
                      var ua = navigator.userAgent.toLowerCase();
                      if (ua.match(/MicroMessenger/i) == "micromessenger") {
                          return true;
                      } else {
                          return false;
                      }
                  },
                  downApp: function () {
                      if (this.isWeixin()) {
                          (document.getElementsByTagName("body")[0]).setAttribute("class", "isWx");
                      } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                          var loadDateTime = new Date();
                          window.setTimeout(function () {
                                  var timeOutDateTime = new Date();
                                  if (timeOutDateTime - loadDateTime < 5000) {
                                      window.location = "https://itunes.apple.com/cn/app/id1273704196";
                                  } else {
                                      window.close();
                                  }
                              },
                              25);
                          window.location = "YPB://";
                      } else if (navigator.userAgent.match(/android/i)) {
                          var state = null;
                          try {
                              state = window.open("YPB://");
                              window.close();
                          } catch (e) {}
                          if (state) {
                              window.location = "YPB://";
                              return;
                          } else {
                              window.location = "https://dl.yingougou.com/Android/app-release.apk";
                              return;
                          }
                      }
                  },
                  openMenu: function () {
                      this.openUser = this.openShadow = "show";
                  },
                  closeMeun: function () {
                      var that = this;
                      if (this.openUser == "show") {
                          this.openUser = this.openShadow = "";
                      }
                      window.history.pushState("", "title", "/");
                      document.documentElement.style.overflow = 'auto';
                  },
                  showSearch: function () {
                      document.documentElement.style.overflow = 'hidden';
                      this.$set(this, "searchShow", "show");
                      var that = this;
                      if (this.hotSearch.length == 0) {
                          ygg.ajax('/home/getHistoryAndHotSearch', {
                              member_id: filterData.member_id,
                              area_id: filterData.area_id
                          }, function (data) {

                              data = data.data;
                              vm.$set(vm, "hotSearch", data.hot_search);
                              vm.$set(vm, "hisSearch", data.search_history);
                          });
                      }
                  },
                  clearVal: function () {
                      this.$set(this, "searchVal", "");
                  },
                  returni: function () {
                      this.$set(this, "searchShow", "");
                      document.documentElement.style.overflow = 'auto';
                  },
                  hots: function (bname) {
                      searchData.business_name = bname;
                      this.$set(this, "searchVal", bname);
                      ygg.loading(true);
                      ygg.ajax('/home/getSearchResult', searchData, function (data) {

                          ygg.loading(false);
                          data = data.data;
                          vm.$set(vm, "isSS", false);
                          vm.$set(vm, "shopList", data.businessArr);
                          if (data.businessArr.length == 0) {
                              vm.$set(vm, "isEmpty", "empty");
                              vm.$set(vm, "isSS", true);
                          }
                      });
                  }
              }
          }),
          firstOpen = true,
          filterData = {
              member_id: ygg.getCookie('member_id'),
              page: 1,
              area_id: "",
              size: 10
          },
          searchData = {
              member_id: filterData.member_id,
              area_id: filterData.area_id,
              business_name: "",
              page: 1,
              size: 10
          },
          defaultCoupons = false;
      if (ygg.getCookie('member_id')) vm.$set(vm, "isLogin", true);

      document.addEventListener('touchmove', function (e) {}, false);

      if (ygg.getQueryString("my")) {
          vm.$set(vm, "openShadow", "show");
          vm.$set(vm, "openUser", "show");
          document.documentElement.style.overflow = 'hidden';
      }

    //   var citysearch = new AMap.CitySearch();
    //   citysearch.getLocalCity(function (status, result) {
    //       vm.city = (result.city).replace("市", "");
    //       $("#city-picker").val("成都市");
    //       //$("#city-picker").val(result.province+" "+result.city);
    //       /*$("#city-picker").cityPicker({
    //           toolbarTemplate: '<header class="bar bar-nav">\
    //           <button class="button button-link pull-right close-picker">确定</button>\
    //           <h1 class="title">选择地址</h1>\
    //           </header>',
    //           onOpen : function(p){
    //               vm.openShadow = "show";
    //               if(firstOpen){
                      
    //                   firstOpen = false;
    //               }
    //           },
    //           onClose : function(p){
    //               vm.openShadow = "";
    //               $(".header .text-sl").text((p.cols[1].value).replace("市",""));
    //               filterData.area_id = getCityId(p.cols[0].value,p.cols[1].value);
    //               searchData.area_id = filterData.area_id;
    //               ygg.setCookie('area_id',filterData.area_id);
    //               filterData.page = 1;
    //               getTopData();
    //               getCoupons(function(data){
    //                   vm.$set(vm,"discount",data);
    //               });
    //           }
    //       });
    //       filterData.area_id = result.adcode;
    //       searchData.area_id = result.adcode;*/
    //       filterData.area_id = ygg.getCookie('area_id');
    //       searchData.area_id =  ygg.getCookie('area_id');
    //     //   ygg.setCookie('area_id', filterData.area_id);

    //       if (filterData.member_id) {
    //           ygg.ajax('/member/getPersonCenterInfo', {
    //               member_id: filterData.member_id
    //           }, function (data) {

    //               data = data.data;
    //               getFilter();
    //               getCoupons(function (d) {
    //                   vm.$set(vm, "discount", d);
    //               });

    //               vm.$set(vm.user, "photo", data.head_portrait);
    //               vm.$set(vm.user, "nickName", data.nick_name);
    //               vm.$set(vm.user, "coupon_total", data.coupon_total);
    //               vm.$set(vm.user, "is_expand", data.is_expand);

    //               ygg.setCookie("select_setting", data.select_setting);

    //           });
    //       } else {
    //           getFilter();
    //           getCoupons(function (data) {
    //               vm.$set(vm, "discount", data);
    //           });
    //       }

    //   });
    filterData.area_id = ygg.getCookie('area_id');
    searchData.area_id =  ygg.getCookie('area_id');
  //   ygg.setCookie('area_id', filterData.area_id);

    if (filterData.member_id) {
        ygg.ajax('/member/getPersonCenterInfo', {
            member_id: filterData.member_id
        }, function (data) {

            data = data.data;
            getFilter();
            getCoupons(function (d) {
                vm.$set(vm, "discount", d);
            });

            vm.$set(vm.user, "photo", data.head_portrait);
            vm.$set(vm.user, "nickName", data.nick_name);
            vm.$set(vm.user, "coupon_total", data.coupon_total);
            vm.$set(vm.user, "is_expand", data.is_expand);

            ygg.setCookie("select_setting", data.select_setting);

        });
    } else {
        getFilter();
        getCoupons(function (data) {
            vm.$set(vm, "discount", data);
        });
    }
      function getCoupons(cb, data) {
          var sdata = data || filterData;
          var sdd = data;
          ygg.loading(true);
          ygg.ajax('/home/getCouponHomeScreen', sdata, function (data) {
              ygg.loading(false);
              data = data.data;
              if (filterData.page > data.pages && data.pages != 0) {
                  $(".infinite-scroll-preloader").hide();
                  return;
              } else if (data.pages <= 1) {
                  vm.$set(vm, "scrollIsShow", false);
              }
              cb(data.coupons, data.pages);
              flag;
              if (data.coupons.length == 0) {
                  $(".home .main .discount .list").addClass('none');
                //   getCoupons(function (data) {
                //       vm.$set(vm, "discount", data);
                //   }, {
                //       member_id: ygg.getCookie('member_id'),
                //       page: 1,
                //       area_id: ygg.getCookie('area_id'),
                //       size: 10
                //   });
                  defaultCoupons = true;
              } else {
                  if (!sdata) $(".home .main .discount .list").removeClass('none');
              }
              if (sdata == sdd) {
                  defaultCoupons = true;
              } else {
                  defaultCoupons = false;
              }
              if (!defaultCoupons && data.coupons.length != 0) $(".home .main .discount .list").removeClass('none');
          });
      }

      var height = document.getElementsByClassName('height')[0].clientHeight,
          flag = true;
      window.onscroll = function (e) {
          if (e.target.scrollingElement.scrollTop + height + 5.5 * rem >= e.target.scrollingElement.clientHeight) {
              if (flag) return;
              flag = true;
              filterData.page++;
              getCoupons(function (data) {
                  vm.$set(vm, "discount", vm.discount.concat(data));
                  flag = false;
              });
          }
      }

      function getFilter() {
          ygg.ajax('/home/getAreaAndCircleAndMore', {
              area_id: filterData.area_id
          }, function (data) {
              data = data.data;

              $("#filter_type").picker({
                  toolbarTemplate: '<header class="bar bar-nav">\
                  <button class="button button-link pull-right close-picker">确定</button>\
                  <h1 class="title">选择优惠券类型</h1>\
                  </header>',
                  cols: [{
                      textAlign: 'center',
                      values: ['全部', '专属券', '共享券', '团购券']
                  }],
                  onOpen: function (p) {
                      vm.openShadow = "show";
                  },
                  onClose: function (p) {
                      vm.openShadow = "";
                      vm.$set(vm, "filterType", p.cols[0].value);
                      p.cols[0].activeIndex == 0 ? filterData.coupon_type = "" : filterData.coupon_type = p.cols[0].activeIndex - 1;
                      filterData.page = 1;
                      getCoupons(function (data) {
                          vm.$set(vm, "discount", data);
                      });
                  }
              });

              var filterShopList = ["行业"];
              for (var i = 0; i < data.industry_list.length; i++) {
                  filterShopList.push(data.industry_list[i].name);
              }

              $("#filter_shop").picker({
                  toolbarTemplate: '<header class="bar bar-nav">\
                  <button class="button button-link pull-right close-picker">确定</button>\
                  <h1 class="title">选择行业</h1>\
                  </header>',
                  cols: [{
                      textAlign: 'center',
                      values: filterShopList
                  }],
                  onOpen: function (p) {
                      vm.openShadow = "show";
                  },
                  onClose: function (p) {
                      vm.openShadow = "";
                      vm.$set(vm, "filterShop", p.cols[0].value);
                      p.cols[0].activeIndex == 0 ? filterData.industry_id = "" : filterData.industry_id = data.industry_list[p.cols[0].activeIndex - 1].industry_id;
                      filterData.page = 1;
                      getCoupons(function (data) {
                          vm.$set(vm, "discount", data);
                      });
                  }
              });

              var filterAddressCols0 = ['所有商圈'],
                  filterAddressCols1 = ['所有商圈'],
                  currentAddress = '所有商圈',
                  t,
                  addFirstOpen = true;
              for (var i = 0; i < data.area_circle_list.length; i++) {
                  filterAddressCols0.push(data.area_circle_list[i].area_name);
              }

              $("#filter_address").picker({
                  toolbarTemplate: '<header class="bar bar-nav">\
                  <button class="button button-link pull-right close-picker">确定</button>\
                  <h1 class="title">选择商圈</h1>\
                  </header>',
                  cols: [{
                          textAlign: 'center',
                          values: filterAddressCols0
                      },
                      {
                          textAlign: 'center',
                          values: filterAddressCols1
                      }
                  ],
                  onOpen: function (p) {
                      vm.openShadow = "show";
                      if (addFirstOpen) {
                          p.cols[1].setValue(p.cols[1].items[0].innerText, "all 0s");
                          addFirstOpen = false;
                      }
                  },
                  onClose: function (p) {
                      vm.openShadow = "";
                      vm.$set(vm, "filterAddress", p.cols[1].value);
                      if (p.cols[0].activeIndex == 0) {
                          filterData.circle_id = "";
                          $(".discount .list").removeClass('none');
                      } else {
                          var d = data.area_circle_list[p.cols[0].activeIndex - 1];
                          if (d.circle_list.length == 0) {
                              filterData.circle_id = "";
                              $(".discount .list").addClass('none');
                          } else {
                              $(".discount .list").removeClass('none');
                              filterData.circle_id = d.circle_list[p.cols[1].activeIndex].circle_id;
                          }
                      }

                      filterData.page = 1;
                      getCoupons(function (data) {
                          vm.$set(vm, "discount", data);
                      });
                  },
                  onChange: function (p) {
                      var index = p.cols[0].activeIndex;
                      var newAddress = p.cols[0].value;
                      if (newAddress !== currentAddress) {
                          var newRegion = [];
                          if (index == 0) {
                              newRegion = filterAddressCols1;
                          } else {
                              if (data.area_circle_list[index - 1].circle_list.length == 0) {
                                  newRegion.push(data.area_circle_list[index - 1].area_name);
                              } else {
                                  for (var i = 0; i < data.area_circle_list[index - 1].circle_list.length; i++) {
                                      newRegion.push(data.area_circle_list[index - 1].circle_list[i].circle_name);
                                  }
                              }
                          }
                          clearTimeout(t);
                          t = setTimeout(function () {
                              p.cols[1].replaceValues(newRegion);
                              currentAddress = newAddress;
                              p.updateValue();
                          }, 200);
                          return
                      }
                  }
              });

              $("#filter_sort").picker({
                  toolbarTemplate: '<header class="bar bar-nav">\
                  <button class="button button-link pull-right close-picker">确定</button>\
                  <h1 class="title">选择排序方式</h1>\
                  </header>',
                  cols: [{
                      textAlign: 'center',
                      // values: ['智能排序','销量最高','评价最高']
                      values: ['智能排序', '销量最高']
                  }],
                  onOpen: function (p) {
                      vm.openShadow = "show";
                  },
                  onClose: function (p) {
                      vm.openShadow = "";
                      vm.$set(vm, "filterSort", p.cols[0].value);
                      switch (p.cols[0].activeIndex) {
                          case 0:
                              filterData.xlzg = "";
                              filterData.plzg = "";
                              break;
                          case 1:
                              filterData.xlzg = 1;
                              filterData.plzg = "";
                              break;
                          case 2:
                              filterData.xlzg = "";
                              filterData.plzg = 1;
                              break;
                      }
                      filterData.page = 1;
                      getCoupons(function (data) {
                          vm.$set(vm, "discount", data);
                      });
                  }
              });
          });
      }

      function getCityId(b, c) {
          var ct = $.smConfig.rawCitiesData;
          for (var i = 0; i < ct.length; i++) {
              if (ct[i].name == b) {
                  for (var j = 0; j < ct[i]['sub'].length; j++) {
                      if (ct[i]['sub'][j].name == c) {
                          return ct[i]['sub'][j].id;
                      }
                  }
              }
          }
      }



  });
});