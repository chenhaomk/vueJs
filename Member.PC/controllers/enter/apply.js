    require(['config'], function () {
        require(["imgup", 'angle', 'citys', 'bankBin'], function (OSS) {
            // var business_check_id = window.location.seach.split("=")[1]
            // console.log(window.location.seach)
            var f_img = [],
                n_img = [],
                l_img = [],
                zm_img = [],
                bm_img = [],
                yyzz_img = [],
                business_check_id = $.fn.getCookie("business_check_id"),
                hasFi = false,
                hasNi = false,
                hasLi = false,
                hasZi = false,
                hasBi = false,
                hasYzi = false,
                oldIm = [],
                isbind = $.fn.getQueryString("isbind"),
                isAgain = $.fn.getQueryString("isAgain"),
                bindBrand = $.fn.getQueryString("bindBrand"),
                isData = $.fn.getQueryString("isData"),
                part3Key;
            if ($.fn.getCookie("admin_id") == null || $.fn.getCookie("admin_id") == undefined)
                window.open('login.html', "_self");
            if (isbind == 1) {
                isbind = true;
            } else {
                isbind = false;
            }
            if (isAgain == 1) {
                isAgain = true;
            } else {
                isAgain = false;
            }
            if (isData == 1)
                isData = true;
            else
                isData = false;

            $(".yhxx2").click(function (event) {
                $(".yhxx_popup").fadeIn();
            });
            $(".yhxx_popup .close").click(function (event) {
                $(".yhxx_popup").fadeOut();
            });

            $.fn.getClient(OSS);

            $("body").on('click', '.select', function (event) {
                var className = event.target.className;
                if (!$(this).find('.options').hasClass('op_show')) {
                    $(".op_show").removeClass('op_show');
                }
                $(this).find('.options').addClass(className);
                if ($(this).find('.options').hasClass('op_show')) {
                    $(this).find('.options').removeClass('op_show');
                } else {
                    $(this).find('.options').addClass('op_show');
                }
            });

            $(".submit").on('click', '.prev', function (event) {

                $("form").each(function (index, el) {
                    if ($(this).is(":visible")) {
                        $(this).hide().prev().show();
                        $(".th").removeClass("thactive")
                        $(".part a").eq(index).removeClass('active').prev().addClass('active');
                    }
                });
            });

            setSelect(rawCitiesData, $(".province.select"), "name", 'id');
            var lat, lng
            //获取初始位置--------开始------------
            getLocation()
            var map = new BMap.Map("container", {
                enableMapClick: false
            });
            map.enableScrollWheelZoom(true)
            var lastMarker

            function getLocation() {
                $.fn.loading(true);
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        removeLastPoint(lastMarker);
                        lastMarker = new BMap.Marker(r.point);
                        var point = new BMap.Point(r.point.lng, r.point.lat);
                        map.centerAndZoom(r.point, 16);
                        map.addOverlay(lastMarker);
                        $.fn.loading(false);
                    } else {

                    }
                }, {
                    enableHighAccuracy: true
                })
            }
            //获取初始位置--------结束------------
            //移除上一个点位

            function removeLastPoint(lastMarker) {
                map.removeOverlay(lastMarker);
            };

            function getGeocoder(string, province) {
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(string, function (point) {
                    if (point) {
                        // lat = point.lat
                        // lng = point.lng
                        removeLastPoint(lastMarker);
                        map.centerAndZoom(point, 16);
                        lastMarker = new BMap.Marker(point)
                        map.addOverlay(lastMarker);
                        console.log(point)
                        $.ajax({
                            url: "https://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + point.lng + "," + point.lat + "&coordsys=baidu&output=JSON&key=9781ab13347d6669085c90a7db3809e6",
                            beforeSend: function () {
                                $.fn.loading(true);
                            },
                            success: function (data) {
                                console.log(data)
                                $.fn.loading(false);
                                lng = data.locations.split(",")[0]
                                lat = data.locations.split(",")[1]
                            }
                        })
                    } else {
                        // alert("您选择地址没有解析到结果!");
                    }
                }, province);
            }
            $(".addInput img").click(function () {
                if ($(".add").val() == "") {
                    getLocation()
                } else {
                    var str = $("[name='province']").val() + $("[name='city']").val() + $("[name='area']").val() + $("[name='address']").val()
                    getGeocoder(str, $("[name='province']").val())
                }
            })
            $(".add").keyup(function (e) {
                if (e.keyCode == 13) {
                    if ($(".add").val() == "") {
                        getLocation()
                    } else {
                        var str = $("[name='province']").val() + $("[name='city']").val() + $("[name='area']").val() + $("[name='address']").val()
                        getGeocoder(str, $("[name='province']").val())
                    }
                }
            })
            var citysearch = new AMap.CitySearch();
            citysearch.getLocalCity(function (status, result) {
                $.fn.getData({
                    url: "/business/getBusinessCheckDetails",
                    data: {
                        business_check_id: $.fn.getCookie("business_check_id")
                    },
                    async: false,
                    result: function (data) {
                        // debugger
                        data = data.data;
                        // $.fn.loading(false);
                        if (data.business_licence_num && !isbind && !isAgain) {
                            window.open("login.html", "_self");
                        }
                        lat = data.lat
                        lng = data.lng
                        $("form:eq(0)").show().siblings('form').hide();

                        if (data.brand_id && bindBrand == 1) {
                            $("form:eq(1)").show().siblings('form').hide();
                            $(".th").removeClass("thactive")
                            $(".part a:eq(1)").addClass('active').siblings().removeClass('active');
                            $.fn.getData({
                                url: "/business/getBindBrandInfoById",
                                data: {
                                    business_check_id: $.fn.getCookie("business_check_id")
                                },
                                async: false,
                                result: function (data) {
                                    data = data.data;
                                    $("#pinp").html("").append('\
                                    <div class="g fn-clear">\
                                        <img src="' + data.logo + '">\
                                        <div class="text">\
                                            <p class="title">' + data.brand_name + '<span>已绑定</span></p>\
                                            <p class="cont">' + data.introduction + '</p>\
                                            <p class="tel">' + data.phone + '</p>\
                                        </div>\
                                    </div>\
                                ')
                                }
                            });
                        } else if (bindBrand == 1) {
                            $("form:eq(1)").show().siblings('form').hide();
                            $(".th").removeClass("thactive")
                            $(".part a:eq(1)").addClass('active').siblings().removeClass('active');
                        }
                        if (isbind && !isData) {
                            $(".prev").hide();
                            $("#two").val('完成').click(function (event) {
                                event.preventDefault();
                                if (part3Key == 13) {
                                    $('#search').click();
                                    return;
                                }
                                window.open("status.html?s=2", "_self");
                            });


                        }

                        $.fn.getData({
                            url: "/business/getAllIndustry",
                            data: {},
                            async: false,
                            result: function (data) {
                                // console.log(data)
                                data = data.data;
                                setSelect(data.industry_list, $(".b_type.select"), "name", 'industry_id');
                            }
                        });
                        if (data.area_id) {
                            var pDom, provinceIndex, cDom, cityIndex, aDom, sDom;
                            hasFi = true;
                            hasNi = true;
                            hasLi = true;
                            var names = $.fn.getProvinceName(data.area_id);

                            pDom = $(".select.province .options a:contains(" + names[0] + ")");
                            provinceIndex = pDom.index();

                            pDom.addClass('active');
                            setCitys(provinceIndex, 1);

                            cDom = $(".select.city .options a:contains(" + names[1] + ")");
                            cityIndex = cDom.index();

                            cDom.addClass('active');
                            setAreas(cityIndex, provinceIndex, 1);

                            aDom = $(".select.area .options a:contains(" + names[2] + ")");
                            aDom.addClass('active');

                            setSq(data.area_id);

                            sDom = $(".select.sq .options [data-id=" + data.business_circle_id + "]");
                            aDom.addClass('active');
                            $("[name='province']").val(pDom.text()).attr("data-id", pDom.attr("data-id"));
                            $("[name='city']").val(cDom.text()).attr("data-id", cDom.attr("data-id"));
                            $("[name='area']").val(aDom.text()).attr("data-id", aDom.attr("data-id"));
                            $("[name='b_area']").val(sDom.text()).attr("data-id", sDom.attr("data-id"));
                            $("[name='address']").val(data.address);
                            $(".th").removeClass("thactive")
                            $(".b_type .options a:contains(" + data.industry_name + ")").addClass("active").siblings().removeClass('active');
                            $("[name='b_type']").val(data.industry_name).attr("data-id", $(".b_type .options a:contains(" + data.industry_name + ")").attr("data-id"));
                            f_img.push($.fn.formatImgName(data.face_img));
                            l_img.push($.fn.formatImgName(data.logo));
                            for (var i = 0; i < data.inner_imgs.length; i++) {
                                n_img.push($.fn.formatImgName(data.inner_imgs[i]));
                                oldIm.push($.fn.formatImgName(data.inner_imgs[i]));
                            }
                        } else {
                            pDom = $(".select.province .options a:contains(" + result.province + ")");
                            provinceIndex = pDom.index();
                            pDom.addClass('active');
                            setCitys(provinceIndex);

                            cDom = $(".select.city .options a:contains(" + result.city + ")");
                            cityIndex = cDom.index();

                            cDom.addClass('active');
                            aDom = $(".select.area .options a:eq(0)");

                            aDom.addClass('active');
                            $("[name='province']").val(pDom.text()).attr("data-id", pDom.attr("data-id"));
                            $("[name='city']").val(cDom.text()).attr("data-id", cDom.attr("data-id"));
                            $("[name='area']").val(aDom.text()).attr("data-id", aDom.attr("data-id"));

                        }


                        $("[name='name']").val(data.name);
                        $("[name='tel']").val(data.phone);
                        $("#ygphone").val(data.commissioner_id);

                        $(".uploader.f_img").uploader({
                            r: function (file) {
                                f_img.push(file);
                            },
                            del: function (index) {
                                f_img.splice(index, 1);
                                hasFi = false;
                            },
                            om: data.face_img
                        });

                        $(".uploader.n_img").uploader({
                            r: function (file) {
                                n_img.push(file);
                                hasNi = false;
                            },
                            del: function (index) {
                                n_img.splice(index, 1);
                                oldIm.splice(index, 1);
                            },
                            maxSize: 8,
                            om: data.inner_imgs
                        });

                        $(".uploader.l_img").uploader({
                            r: function (file) {
                                l_img.push(file);
                            },
                            del: function (index) {
                                l_img.splice(index, 1);
                                hasLi = false;
                            },
                            om: data.logo
                        });
                        //                         if (!isData) {
                        //     return;
                        // }
                        if (data.id_card_front_img) {
                            $("form:eq(2)").show().siblings('form').hide();
                            $(".th").removeClass("thactive")
                            $(".part a:eq(2)").addClass('active').siblings().removeClass('active');
                            hasZi = true;
                            hasBi = true;
                            zm_img.push($.fn.formatImgName(data.id_card_front_img));
                            bm_img.push($.fn.formatImgName(data.id_card_back_img));
                        }

                        if (isAgain) {
                            $("form:eq(0)").show().siblings('form').hide();
                            $(".th").removeClass("thactive")
                            $(".part a:eq(0)").addClass('active').siblings().removeClass('active');
                        }

                        $("#userName").val(data.real_name);
                        $("#cardNo").val(data.id_card_no);
                        $("#bank").val(data.bank_card);
                        $('.zm').uploader({
                            r: function (file) {
                                zm_img.push(file);
                            },
                            del: function (index) {
                                zm_img.splice(index, 1);
                                hasZi = false;
                            },
                            text: "身份证正面照",
                            om: data.id_card_front_img
                        });

                        $('.bm').uploader({
                            r: function (file) {
                                bm_img.push(file);
                            },
                            del: function (index) {
                                bm_img.splice(index, 1);
                                hasBi = false;
                            },
                            text: "身份证背面照",
                            om: data.id_card_back_img
                        });

                        var bankName = data.bank;
                        $.fn.getData({
                            url: "/common/getBankList",
                            data: {},
                            async: false,
                            result: function (data) {
                                data = data.data;
                                setSelect(data, $(".fsyh.select"), "bank_name", 'bank_code');
                                if (bankName) {
                                    $(".th").removeClass("thactive")
                                    $(".fsyh .options a:contains(" + bankName + ")").addClass("active").siblings().removeClass('active');
                                    $("[name='fsyh']").val(bankName).attr("data-id", $(".fsyh .options a:contains(" + bankName + ")").attr("data-id"));
                                }
                            }
                        });

                        var styz;
                        if (data.business_licence_img != undefined && data.business_licence_img.length != 0) {
                            hasYzi = true;
                            styz = data.business_licence_img[0];
                            yyzz_img.push($.fn.formatImgName(data.business_licence_img[0]));
                        }

                        $(".yyzz").uploader({
                            r: function (file) {
                                yyzz_img.push(file);
                            },
                            del: function (index) {
                                yyzz_img.splice(index, 1);
                                hasYzi = false;
                            },
                            om: styz
                        });

                        $("#userName").val(data.real_name);
                        $("#cardNo").val(data.id_card_no);
                        $("#bank").val(data.bank_card);
                        $("#yzch").val(data.business_licence_num);
                        $("#yname").val(data.business_licence_name);
                        $("#ydz").val(data.business_licence_address);
                        if (data.business_licence_date) {
                            var ttm = ($.fn.getd("Y.m.d", data.business_licence_date / 1000)).split(".");
                            $("#stt").manhuaDate({
                                dYear: parseInt(ttm[0]),
                                dMonth: parseInt(ttm[1]) + 1,
                                dDay: parseInt(ttm[2])
                            });
                        } else {
                            $("#stt").manhuaDate();
                        }
                        // $.fn.loading(false);
                    }
                });

            });

            $(document).click(function (event) {
                if (!$(event.target).parent().hasClass('select')) {
                    $(".options").removeClass('op_show');
                }
            });

            $("#pp").keydown(function (e) {
                var theEvent = e || window.event;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    part3Key = code;
                }
            });


            $("#two").click(function (event) {
                if ($("#two").attr("value") == "下一步") {
                    event.preventDefault();
                    if (part3Key == 13) {
                        $('#search').click();
                        return;
                    }
                    $(".th").addClass('thactive').siblings().removeClass('active');
                    $("form:eq(2)").show().siblings('form').hide();
                    $(".result").hide();
                }
            });


            $("#last").click(function (event) {
                event.preventDefault();

                var yzch = $("#yzch").val(),
                    yname = $("#yname").val(),
                    ydz = $("#ydz").val(),
                    ytime = $("#ytime").val();

                if (len(yzch) || len(yname) || len(ydz) || len(ytime) || len(yyzz_img)) {
                    $(".prompt5").text("请您仔细填写信息，不能有空哦！");
                    return;
                }
                $.fn.loading(true);

                ytime = ytime.replace(".", "-");
                ytime = ytime.replace(".", "-");

                if (hasYzi == false) {
                    $.fn.uploadImg(yyzz_img, function (d) {
                        yyzz_img = d[0];
                        part4();
                    });
                } else {
                    yyzz_img = yyzz_img[0];
                    part4();
                }

                function part4() {
                    $.fn.getData({
                        url: "/business/addQualificationAuthInfo",
                        data: {
                            business_check_id: $.fn.getCookie("business_check_id"),
                            business_licence_num: yzch,
                            business_licence_name: yname,
                            business_licence_address: ydz,
                            business_licence_date: ytime,
                            business_licence_img: yyzz_img
                        },
                        result: function (data) {
                            $.fn.loading(false);
                            if (data.status == "error") {
                                $(".prompt5").text(data.msg);
                            } else if (data.status == "success") {
                                window.open("status.html?s=0", "_self");
                            }
                        }
                    });
                }
            });

            $("#th").click(function (event) {
                event.preventDefault();

                if ($(this).hasClass('none')) return;

                var userName = $("#userName").val(),
                    cardNo = $("#cardNo").val(),
                    bank = $("#bank").val();

                if (len(userName) || len(cardNo) || len(zm_img) || len(bm_img) || len(bank)) {
                    $(".prompt3").text("请您仔细填写信息，不能有空哦！");
                    return;
                }

                if (!CheckBankNo(bank)) {
                    $(".prompt4").text("请输入正确的银行卡号！");
                    return;
                }

                $.fn.loading(true);

                if (hasZi && hasBi) {
                    bm_img = bm_img[0];
                    zm_img = zm_img[0];
                    part3();
                } else if (!hasZi && hasBi) {
                    $.fn.uploadImg(zm_img, function (d) {
                        zm_img = d[0];
                        bm_img = bm_img[0];
                        part3();
                    });
                } else if (!hasBi && hasZi) {
                    $.fn.uploadImg(bm_img, function (d) {
                        bm_img = d[0];
                        zm_img = zm_img[0];
                        part3();
                    });
                } else {
                    $.fn.uploadImg(zm_img, function (d) {
                        zm_img = d[0];
                        $.fn.uploadImg(bm_img, function (d) {
                            bm_img = d[0];
                            part3();
                        });
                    });
                }

                function part3() {
                    var fsyh = $("[name='fsyh']").attr("data-id"),

                        bankName = $(".fsyh .options [data-id='" + fsyh + "']").html();
                    $.fn.getData({
                        url: "/business/bindBankCardAndAuth",
                        data: {
                            business_check_id: $.fn.getCookie("business_check_id"),
                            real_name: userName,
                            bank_card: bank,
                            bank_code: fsyh,
                            bank_name: bankName,
                            id_card_no: cardNo,
                            id_card_front_img: zm_img,
                            id_card_back_img: bm_img
                        },
                        result: function (data) {
                            $.fn.loading(false);
                            if (data.status == "error") {
                                $(".prompt3").text(data.msg);

                            } else if (data.status == "success") {
                                if (!data.data.is_auth) {
                                    $(".prompt3").text(data.data.message);
                                    return;
                                }
                                $.fn.getData({
                                    url: "/business/bindBankCard",
                                    data: {
                                        business_check_id: $.fn.getCookie("business_check_id"),
                                        card_holder: $("#userName").val(),
                                        bank_card_no: bank,
                                        bank: $("#fsyh").val()
                                    },
                                    result: function (data) {
                                        $.fn.loading(false);
                                        if (data.status == "error") {
                                            $(".prompt4").text(data.msg);
                                        } else if (data.status == "success") {
                                            $(".th").removeClass("thactive")
                                            $(".last").addClass('active').siblings().removeClass('active');
                                            $("form:eq(3)").show().siblings('form').hide();
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });

            var blFilter = {
                business_check_id: $.fn.getCookie("business_check_id"),
                brand_name: "",
                page: 1,
                size: 10
            }

            $("#search").click(function (event) {

                var val = $("#pp").val();
                if (len(val)) {
                    $(".prompt2").text('品牌名称不能为空!');
                    return;
                }
                blFilter.brand_name = val;

                getBrandList(function (pages) {
                    $(".paging").pages(pages, function (i) {
                        if (i == "next") {
                            blFilter.page++;
                        } else if (i == "prev") {
                            blFilter.page--;
                        } else {
                            blFilter.page = i;
                        }
                        getBrandList();
                    });
                });
            });

            var bindId, name, imgUrl, inf, tel;
            $("#result tbody").on('click', '.bind', function (event) {
                bindId = $(this).parent().parent().attr("data-id");
                name = $(this).parent().siblings().eq(0).children('span').text(),
                    imgUrl = $(this).parent().siblings().eq(0).children('img').attr("src"),
                    inf = $(this).parent().siblings(".t").text(),
                    tel = $(this).parent().siblings().eq(2).text();

                $(".popup1,.shadow").fadeIn();
                $(".popup1 .title").text('确定绑定' + name + '？');
            });

            $(".popup1 .close").click(function (event) {
                $(".popup,.shadow").fadeOut();
            });

            $(".xy .ck").click(function (event) {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(".confi_bind,#th").addClass('none');
                } else {
                    $(this).addClass('active');
                    $(".confi_bind,#th").removeClass('none');
                }
            });
            $(".popup").on('click', '.confi_bind', function (event) {
                if ($(this).hasClass('none')) return;
                $.fn.getData({
                    url: "/business/bindBrandById",
                    data: {
                        business_check_id: $.fn.getCookie("business_check_id"),
                        brand_id: bindId
                    },
                    result: function (data) {
                        if (data.status == "error") {
                            $(".prompt2").text(data.msg);
                        } else if (data.status == "success") {
                            data = data.data;
                            $(".popup,.shadow").fadeOut();
                            $("#pinp").html("").append('\
                            <div class="g fn-clear">\
                                <img src="' + imgUrl + '">\
                                <div class="text">\
                                    <p class="title">' + name + '<span>已绑定</span></p>\
                                    <p class="cont">' + inf + '</p>\
                                    <p class="tel">' + tel + '</p>\
                                </div>\
                            </div>\
                        ')
                        }
                    }
                });
            });

            function getBrandList(cb) {
                $.fn.loading(true);
                $.fn.getData({
                    url: "/business/getBrandList",
                    data: blFilter,
                    result: function (data) {
                        if (data.status == "error") {
                            $(".prompt2").text(data.msg);
                        } else if (data.status == "success") {
                            data = data.data;
                            $.fn.loading(false);

                            if (data.pages > 1 && cb) cb(data.pages);
                            $(".result").show().removeClass('empty');
                            if (data.brand_list.length == 0) {
                                $(".result").addClass('empty');
                            } else {
                                $("#result tbody").html("").show();
                                for (var i = 0; i < data.brand_list.length; i++) {
                                    $("#result tbody").append('\
                                    <tr data-id="' + data.brand_list[i].brand_id + '">\
                                        <td class="f">\
                                            <img src="' + data.brand_list[i].logo + '" alt="">\
                                            <span>' + data.brand_list[i].brand_name + '</span>\
                                        </td>\
                                        <td class="t">' + data.brand_list[i].introduction + '</td>\
                                        <td>' + data.brand_list[i].phone + '</td>\
                                        <td><a class="bind">确定绑定</a></td>\
                                    </tr>\
                                ')
                                }
                            }
                        }
                    }
                });
            }

            $("#first").click(function (event) {
                event.preventDefault();
                var name = $("[name='name']").val(),
                    tel = $("[name='tel']").val(),
                    area = $("[name='area']").attr("data-id"),
                    address = $("[name='address']").val(),
                    b_area = $("[name='b_area']").attr("data-id"),
                    b_type = $("[name='b_type']").attr("data-id");

                if (len(name) || len(tel) || len(area) || len(address) || len(b_area) || len(b_type) || len(f_img) || len(n_img) || len(l_img)) {
                    $(".prompt1").text("请您仔细填写信息，不能有空哦！");
                    return;
                }
                if (!(/^((0\d{2,3}-\d{7,8})|(1(([34578][0-9]))\d{8}))$|^((0\d{2,3}\d{7,8}))$/.test(tel))) {
                    $(".prompt1").text("请输入合理的手机号码！");
                    return;
                }
                // var shopTelNum = $("#shopTelNum").val();

                // if (!(/^1[34578]\d{9}$/.test(shopTelNum)) && shopTelNum.length != 0) {
                //     $(".prompt").text("请输入正确的手机号！");
                //     return;
                // }
                $.fn.loading(true);

                if (hasFi && hasNi && hasLi) {
                    l_img = l_img[0];
                    f_img = f_img[0];
                    part1();
                } else if (!hasFi && hasNi && hasLi) {
                    $.fn.uploadImg(f_img, function (d) {
                        f_img = d[0];
                        l_img = l_img[0];
                        part1();
                    });
                } else if (hasFi && hasNi && !hasLi) {
                    $.fn.uploadImg(l_img, function (d) {
                        l_img = d[0];
                        f_img = f_img[0];
                        part1();
                    });
                } else if (hasFi && !hasNi && hasLi) {
                    for (var i = 0; i < n_img.length; i++) {
                        if (typeof (n_img[i]) == "string") {
                            n_img.splice(i, 1);
                            i--;
                        }
                    }
                    if (n_img.length == 0) {
                        n_img = oldIm;
                        l_img = l_img[0];
                        f_img = f_img[0];
                        part1();
                    } else {
                        $.fn.uploadImg(n_img, function (d) {
                            n_img = d;
                            n_img = n_img.concat(oldIm);
                            l_img = l_img[0];
                            f_img = f_img[0];
                            part1();
                        });
                    }
                } else if (!hasFi && !hasNi && hasLi) {
                    $.fn.uploadImg(f_img, function (d) {
                        f_img = d[0];
                        for (var i = 0; i < n_img.length; i++) {
                            if (typeof (n_img[i]) == "string") {
                                n_img.splice(i, 1);
                                i--;
                            }
                        }
                        if (n_img.length == 0) {
                            n_img = d;
                            n_img = oldIm;
                            l_img = l_img[0];
                            part1();
                        } else {
                            $.fn.uploadImg(n_img, function (d) {
                                n_img = d;
                                n_img = n_img.concat(oldIm);
                                l_img = l_img[0];
                                part1();
                            });
                        }
                    });
                } else if (!hasFi && hasNi && !hasLi) {
                    $.fn.uploadImg(f_img, function (d) {
                        f_img = d[0];
                        $.fn.uploadImg(l_img, function (d) {
                            l_img = d[0];
                            part1();
                        });
                    });
                } else if (hasFi && !hasNi && !hasLi) {
                    $.fn.uploadImg(l_img, function (d) {
                        l_img = d[0];
                        for (var i = 0; i < n_img.length; i++) {
                            if (typeof (n_img[i]) == "string") {
                                n_img.splice(i, 1);
                                i--;
                            }
                        }
                        if (n_img.length == 0) {
                            n_img = d;
                            n_img = oldIm;
                            f_img = f_img[0];
                            part1();
                        } else {
                            $.fn.uploadImg(n_img, function (d) {
                                n_img = d;
                                n_img = n_img.concat(oldIm);
                                f_img = f_img[0];
                                part1();
                            });
                        }
                    });
                } else {
                    $.fn.uploadImg(f_img, function (d) {
                        f_img = d[0];
                        $.fn.uploadImg(n_img, function (d) {
                            n_img = d;
                            $.fn.uploadImg(l_img, function (d) {
                                l_img = d[0];
                                part1();
                            });
                        });
                    });
                }
                if (lat == undefined || lng == undefined) {
                    $(".prompt1").text("请您输入正确地址！");
                    return;
                }

                function part1() {
                    if (business_check_id == null || business_check_id == "undefined" || business_check_id == undefined)
                        business_check_id = "";
                    var ygphone = $("#ygphone").val();
                    $.fn.getData({
                        url: "/business/addBusinessCheckTwo",
                        data: {
                            business_check_id: business_check_id,
                            name: name,
                            area_id: area,
                            business_circle_id: b_area,
                            address: address,
                            phone: tel,
                            industry_id: b_type,
                            inner_imgs: n_img,
                            face_img: f_img,
                            logo: l_img,
                            commissioner_id: ygphone,
                            lat: lat,
                            lng: lng,
                            member_id: ""
                        },
                        result: function (data) {
                            $.fn.loading(false);
                            if (data.status == "error") {
                                $(".prompt1").text(data.msg);
                                return;
                            } else if (data.status == "success") {
                                data = data.data;
                                $(".th").removeClass("thactive")
                                $(".two").addClass('active').siblings().removeClass('active');
                                $("form:eq(1)").show().siblings('form').hide();
                                $.fn.setCookie('business_check_id', data.business_check_id);
                            }
                        }
                    });
                }

            });

            function len(v) {
                if (v != undefined) {
                    if (v.length == 0 || v.length == undefined) return true;
                } else {
                    return true
                }

            }

            $(".select").on('click', '.options a', function (event) {
                $(".th").removeClass("thactive")
                $(this).addClass('active').siblings().removeClass('active');
                var tt = $(this);
                var t = $(this).text();
                var pd = $(this).parent();
                var inp = pd.prev();
                inp.val(t).attr("data-id", $(this).attr("data-id"));
                var index = $(this).index();
                if ($(this).parent().parent().hasClass('province')) {
                    setCitys(index);
                } else if ($(this).parent().parent().hasClass('city')) {
                    setAreas(index, $(".province.select .options a.active").index());
                } else if ($(this).parent().parent().hasClass('area')) {
                    setSq(rawCitiesData[$(".province.select .options a.active").index()]["sub"][$(".city.select .options a.active").index()]["sub"][index].id);
                }
            });

            function setSelect(arr, dom, str, id) {
                dom.children('.options').html("");
                for (var i = 0; i < arr.length; i++) {
                    dom.children('.options').append('<a data-id="' + arr[i][id] + '">' + arr[i][str] + '</a>')
                }
            }

            function setCitys(index, con) {
                setSelect(rawCitiesData[index]["sub"], $(".city.select"), "name", 'id');
                if (con != "1") {
                    $(".city.select .options a:eq(0)").click();
                    setAreas(0, index);
                }
            }

            function setAreas(index, cindex, con) {
                setSelect(rawCitiesData[cindex]["sub"][index]["sub"], $(".area.select"), "name", 'id');
                if (con != "1") {
                    $(".area.select .options a:eq(0)").click();
                }
            }

            function setSq(area_id) {
                $.fn.getData({
                    url: "/business/getBusinessCircleByAreaId",
                    data: {
                        area_id: area_id
                    },
                    async: false,
                    result: function (data) {
                        data = data.data;
                        setSelect(data, $(".sq.select"), "business_circle_name", 'business_circle_id');
                        $("[name='b_area']").val($(".sq.select .options a:eq(0)").text()).attr('data-id', $(".sq.select .options a:eq(0)").attr("data-id"));
                    }
                });
            }

        });
    });

    function luhnCheck(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）

        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9

        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;

        if (lastNum == luhn) {
            console.log("验证通过");
            return true;
        } else {
            $(".prompt3").text("银行卡号必须符合luhn校验");
            return false;
        }
    }

    //检查银行卡号
    function CheckBankNo(bankno) {
        var bankno = bankno.replace(/\s/g, '');
        if (bankno == "") {
            $(".prompt3").text("请填写银行卡号");
            return false;
        }
        if (bankno.length < 16 || bankno.length > 19) {
            $(".prompt3").text("银行卡号长度必须在16到19之间");

            return false;
        }
        var num = /^\d*$/; //全数字
        if (!num.exec(bankno)) {
            $(".prompt3").text("银行卡号必须全为数字");

            return false;
        }
        //开头6位
        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
        if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
            $(".prompt3").text("银行卡号开头6位不符合规范");

            return false;
        }
        //Luhn校验
        if (!luhnCheck(bankno)) {
            return false;
        }
        return true;
    }