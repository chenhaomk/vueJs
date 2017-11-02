;
(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !$) {
        define(["$"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function (root, $) {
            if ($ === undefined) {
                if (typeof window !== 'undefined') {
                    $ = require('$');
                } else {
                    $ = require('$')(root);
                }
            }
            factory($);
            return $;
        };
    } else {
        factory($);
    }
}(function ($) {

    window.ie8 = navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0";
    // window.local = "https://api.yingougou.com/v1.0";
    window.local = "http://119.23.10.30:9000/v1.0";
    //  window.local = "http://192.168.1.130:8082/v1.0";
    if (!+'\v1' && !'1' [0]) {

    }

    $("body").on('click', '.yhxy', function (event) {
        event.preventDefault();
        $.fn.yhxy();
    });

    $("body").append('<div class="loading"></div>');

    $("body").on('click', '.buy_coupon', function (event) {
        event.preventDefault();
        if ($(this).hasClass('lq_suc')) return;
        var that = $(this);
        var id = $(this).attr("data-id");
        var member_id = $.fn.getCookie("member_id");
        if (!member_id) window.open("/views/user/login.html", "_self");
        $.fn.getData({
            url: '/thirdPay/create_coupon_order',
            data: {
                coupon_id: id,
                member_id: member_id
            },
            result: function (data) {

                if (data.status == "success") {
                    $.fn.prompt({
                        t: "领取成功！",
                        ct: false,
                        rt: "确定",
                        noc: true
                    });
                    that.text("已领取").addClass('lq_suc');
                } else {
                    $.fn.prompt({
                        t: data.msg,
                        ct: false,
                        rt: "确定",
                        noc: true
                    });
                    that.text("已领取").addClass('lq_suc');
                }

            }
        });
    });

    $.fn.extend({
        getData: function (options) {
            var a = {
                url: "",
                data: {},
                result: false,
                async: true
            }
            $.extend(a, options);

            var data = a.data,
                appid = "100",
                timestamp = (new Date()).valueOf(),
                token = $.fn.getCookie('token') || "",
                sign;

            if (token) {
                sign = $.fn.getMd5(appid + timestamp + token);
            } else {
                sign = $.fn.getMd5(appid + timestamp);
            }
            var admin_id =  $.fn.getCookie('admin_id')
            var headerObj = {
                    appid: appid,
                    sign: sign,
                    timestamp: timestamp,
                    token: token
                }
            if(admin_id != undefined) {
                headerObj.admin_id = admin_id
            }
            $.ajax({
                url: local + a.url,
                type: 'POST',
                dataType: 'json',
                async: a.async,
                contentType: "application/json; charset=utf-8",
                headers: headerObj,
                data: JSON.stringify(data),
                success: function (data) {
                    a.result(data);
                },
                error: function (a, b, c) {

                }
            });

        },
        yhxy: function () {
            if ($("body>.shadow").length == 0) {
                $("body").append('<div class="shadow"></div>');
            }
            if ($("body>.yhxx_popup").length == 0) {
                $("body").append('<div class="yhxx_popup popup">\
                                    <a class="close"></a>\
                                    <p class="title">银个购用户协议</p>\
                                    <div class="content">\
                                        <p>银个购（www.yingougou.com）所提供的各项服务的所有权和运作权均归四川省达观科技有限公司（以下简称“达观”）所有。银个购用户注册协议（以下简称“本协议”）系由银个购用户与达观就银个购的各项服务所订立的相关权利义务规范。因此，请于注册成为银个购会员前，确实详细阅读本协议的所有内容，当用户勾选“已阅读并同意相关“银个购服务协议”并点击注册后，即视为同意本协议的所有条款并愿受其约束，成为银个购会员。</p>\
                                        <p>达观有权对本协议条款进行修改，修改后的协议一旦公布即有效代替原来的协议。用户可随时查阅最新协议。每次协议更新后，用户会在下一次登录银个购时，收到“同意用户注册协议”的提示。用户应仔细阅读协议，当用户点击“登录”后，即视为用户同意接受更新版协议 。如用户不同意更新版协议，可以停止接受银个购依据本协议提供的服务。</p>\
                                        <p class="t">一、会员注册</p>\
                                        <p>1. 费用：在本站注册无须任何费用。</p>\
                                        <p>2. 资料填写：</p>\
                                        <p class="sb">1）用户提供的注册资料，用户同意：</p>\
                                        <p class="sb2">（1）提供合法、真实、准确、详尽的个人资料；。</p>\
                                        <p class="sb2">（2）如有变动，及时更新会员资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且达观保留终止用户使用银个购各项服务的权利。</p>\
                                        <p class="sb2">（3）允许银个购不定时向您的电子邮箱和通讯设备发送信息。</p>\
                                        <p class="t">二、服务的提供、修改及终止</p>\
                                        <p>1、用户在接受银个购各项服务的同时，同意接受银个购提供的各类信息服务。用户在此授权达观可以向其电子邮件、手机、通信地址等发送商业信息。 用户有权选择不接受银个购提供的各类信息服务，并进入银个购相关页面进行更改。</p>\
                                        <p>2、银个购保留随时修改或中断服务而不需通知用户的权利。银个购有权行使修改或中断服务的权利，不需对用户或任何无直接关系的第三方负责。</p>\
                                        <p>3、用户对本协议的修改有异议，或对银个购的服务不满，可以行使如下权利：</p>\
                                        <p class="sb">（1）停止使用银个购的网络服务；</p>\
                                        <p class="sb">（2）通过客服等渠道告知银个购停止对其服务。 结束服务后，用户使用银个购络服务的权利立即终止。在此情况下，银个购没有义务传送任何未处理的信息或未完成的服务给用户或任何无直接关系的第三方。</p>\
                                        <p class="t">三、会员隐私制度</p>\
                                        <p>1、本协议所称之银个购用户信息是指符合法律、法规及相关规定，并符合下述范围的信息：</p>\
                                        <p class="sb">（1）用户注册银个购时，向银个购提供的个人信息；</p>\
                                        <p class="sb">（2）用户在使用银个购服务、参加网站活动或访问网站网页时，银个购自动接收并记录的用户浏览器端或手机客户端数据，包括但不限于IP地址、网站Cookie中的资料及用户要求取用的网页记录；</p>\
                                        <p class="sb">（3）银个购从商业伙伴处合法获取的用户个人信息；</p>\
                                        <p class="sb">（4）其它银个购通过合法途径获取的用户个人信息。</p>\
                                        <p>2、银个购承诺：</p>\
                                        <p>非经法定原因或用户事先许可，银个购不会向任何第三方透露用户的密码、姓名等非公开信息</p>\
                                        <p>3、在下述法定情况下，用户的个人信息将会被部分或全部披露：</p>\
                                        <p class="sb">（1）经用户同意向用户本人或其他第三方披露；</p>\
                                        <p class="sb">（2）根据法律、法规等相关规定，或行政机构要求，向行政、司法机构或其他法律规定的第三方披露；</p>\
                                        <p class="sb">（3）其它银个购根据法律、法规等相关规定进行的披露。</p>\
                                        <p>四、用户的用户名、密码和安全性</p>\
                                        <p>1、用户有权自行创建、修改昵称。用户名和昵称的命名及使用应遵守相关法律法规并符合网络道德。用户名和昵称中不能含有任何侮辱、威胁、淫秽、谩骂等侵害他人合法权益的文字。</p>\
                                        <p>2、用户一旦注册成功，成为银个购的会员，将得到用户名（用户手机号）和密码，并对以此组用户名和密码登入系统后所发生的所有活动和事件负责，自行承担一切使用该用户名的言语、行为等而直接或者间接导致的法律责任。</p>\
                                        <p>3、用户有义务妥善保管用户名和密码，用户将对用户名和密码安全负全部责任。因用户原因导致用户名或密码泄露而造成的任何法律后果由用户本人负责。</p>\
                                        <p>4、用户密码遗失的，可以通过手机号+验证码方式重置密码，用户若发现任何非法使用用户名或存在其他安全漏洞的情况，应立即告知银个购。</p>\
                                        <p></p>\
                                        <p>五、用户权利</p>\
                                        <p class="sb">（1）用户有权在注册并登录后对站内商户发布客观、真实、亲身体验的点评信息；</p>\
                                        <p class="sb">（2）用户有权根据网站相关规定，在发布点评信息等贡献后，取得银个购给予的奖励（如贡献值和/或积分兑换等）；</p>\
                                        <p class="sb">（3）用户有权修改其个人账户中各项可修改信息，自行选择昵称和录入介绍性文字，自行决定是否提供非必填项的内容；</p>\
                                        <p class="sb">（4）用户有权根据网站相关规定，获得银个购给与的奖励（如贡献值、积分等）；</p>\
                                        <p class="sb">（5）用户有权参加银个购组织提供的各项线上、线下活动；</p>\
                                        <p class="sb">（6）用户有权在银个购上自行浏览、下载和使用优惠代码。</p>\
                                        <p class="sb">（7）用户有权下载安装银个购手机客户端并使用其功能。</p>\
                                        <p class="sb">（8）用户有权根据银个购站规定，享受银个购提供的其它服务。</p>\
                                        <p>六、用户义务</p>\
                                        <p class="sb">1、不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：</p>\
                                        <p class="sb2">（1）煽动抗拒、破坏宪法和法律、行政法规实施的；</p>\
                                        <p class="sb2">（2）煽动颠覆国家政权，推翻社会主义制度的；</p>\
                                        <p class="sb2">（3）煽动分裂国家、破坏国家统一的；</p>\
                                        <p class="sb2">（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>\
                                        <p class="sb2">（5）捏造或者歪曲事实，散布谣言，扰乱社会秩序的；</p>\
                                        <p class="sb2">（6）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；</p>\
                                        <p class="sb2">（7）公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；</p>\
                                        <p class="sb2">（8）损害国家机关信誉的；</p>\
                                        <p class="sb2">（9）其他违反宪法和法律行政法规的；</p>\
                                        <p class="sb2">（10）进行商业广告行为的。</p>\
                                        <p>七、版权说明</p>\
                                        <p>任何用户接受本注册协议，即表明该用户主动将其在任何时间段在本站发表的任何形式的信息的著作财产权，包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利无偿独家转让给银个购运营商所有，同时表明该用户许可银个购有权利就任何主体侵权而单独提起诉讼，并获得全部赔偿。 本协议已经构成《著作权法》第二十五条所规定的书面协议，其效力及于用户在银个购发布的任何受著作权法保护的作品内容，无论该内容形成于本协议签订前还是本协议签订后。</p>\
                                        <p>用户同意并明确了解上述条款，不将已发表于本站的信息，以任何形式发布或授权其它网站（及媒体）使用。同时，银个购保留删除站内各类不符合规定点评而不通知用户的权利：</p>\
                                        <p>达观是银个购的制作者,拥有此网站内容及资源的版权,受国家知识产权保护,享有对本网站声明的最终解释与修改权；未经达观的明确书面许可,任何单位或个人不得以任何方式,以任何文字作全部和局部复制、转载、引用和链接。否则本公司将追究其法律责任。</p>\
                                        <p>八、侵权投诉</p>\
                                        <p>1、据《中华人民共和国侵权责任法》第三十六条，任何第三方认为，用户利用银个购平台侵害本人民事权益或实施侵权行为的，包括但不限于侮辱、诽谤等，被侵权人有权书面通知银个购采取删除、屏蔽、断开链接等必要措施。</p>\
                                        <p>2、据《信息网络传播权保护条例》，任何第三方认为，银个购所涉及的作品、表演、录音录像制品，侵犯自己的信息网络传播权或者被删除、改变了自己的权利管理电子信息的，可以向银个购提交书面通知，要求银个购删除该侵权作品，或者断开链接。通知书应当包含下列内容：</p>\
                                        <p class="sb">（一）权利人的姓名（名称）、联系方式和地址；</p>\
                                        <p class="sb">（二）要求删除或者断开链接的侵权作品、表演、录音录像制品的名称和网络地址；</p>\
                                        <p>（三）构成侵权的初步证明材料。</p>\
                                        <p>权利人应当对通知书的真实性负责。</p>\
                                        <p>此外，为使银个购能及时、准确作出判断，还请侵权投诉人一并提供以下材料：</p>\
                                        <p>3、任何第三方（包括但不限于企业、公司、单位或个人等）认为银个购用户发布的任何信息侵犯其合法权益的，包括但不限于以上两点，在有充分法律法规及证据足以证明的情况下，均可以通过下列联系方式通知银个购：</p>\
                                        <p>邮寄地址：四川省成都市高新区益州大道中段722号1栋1单元24层2404号</p>\
                                        <p>邮政编码：610095</p>\
                                        <p>收件人：银个购客服</p>\
                                        <p>客服电话：028-85193201</p>\
                                        <p>4、侵权投诉必须包含下述信息：</p>\
                                        <p class="sb">（1）被侵权人的证明材料，或被侵权作品的原始链接及其它证明材料。</p>\
                                        <p class="sb">（2）侵权信息或作品在银个购上的具体链接。</p>\
                                        <p class="sb">（3）侵权投诉人的联络方式，以便银个购相关部门能及时回复您的投诉，最好包括电子邮件地址、电话号码或手机等。</p>\
                                        <p class="sb">（4）投诉内容须纳入以下声明：“本人本着诚信原则，有证据认为该对象侵害本人或他人的合法权益。本人承诺投诉全部信息真实、准确，否则自愿承担一切后果。”</p>\
                                        <p class="sb">（5）本人亲笔签字并注明日期，如代理他人投诉的，必须出具授权人签字的授权书。</p>\
                                        <p>5、银个购建议用户在提起投诉之前咨询法律顾问或律师。我们提请用户注意：如果对侵权投诉不实，则用户可能承担法律责任。。</p>\
                                        <p>九、适用法律和裁判地点</p>\
                                        <p>1、因用户使用银个购站而引起或与之相关的一切争议、权利主张或其它事项，均受中华人民共和国法律的管辖。</p>\
                                        <p>2、用户和银个购发生争议的，应首先本着诚信原则通过协商加以解决。如果协商不成，则应向达观所在地人民法院提起诉讼。</p>\
                                        <p>十、可分性</p>\
                                        <p>如果本协议的任何条款被视为不合法、无效或因任何原因而无法执行，则此等规定应视为可分割，不影响任何其它条款的法律效力。</p>\
                                        <p>十一、冲突选择</p>\
                                        <p>本协议是银个购与用户注册成为银个购会员，使用银个购服务之间的重要法律文件，银个购或者用户的任何其他书面或者口头意思表示与本协议不一致的，均应当以本协议为准。</p>\
                                    </div>\
                                </div>');
            }
            $(".yhxx_popup,.shadow").fadeIn();
            $('.yhxx_popup .close').click(function (event) {
                if ($('.enter .popup').is(":visible")) {
                    $(".yhxx_popup").fadeOut();
                } else {
                    $(".shadow,.yhxx_popup").fadeOut();
                }
            });
        },
        loading: function (con) {
            if (con) {
                $(".loading").show();
            } else {
                $(".loading").hide();
            }
        },
        uploader: function (options) {
            var a = {
                r: false,
                maxSize: 1,
                del: false,
                text: "上传图片",
                om: false
            }
            $.extend(a, options);

            var that = $(this),
                names = {};

            that.append('\
                <div class="add">\
                    <input type="file">\
                    <p>' + a.text + '</p>\
                </div>\
            ');

            if (a.om != false) {
                if (typeof (a.om) == "string") {
                    that.children('.add').before('\
                        <div class="group">\
                            <a class="delete"></a>\
                            <img src="' + a.om + '" alt="">\
                        </div>\
                    ');
                    that.children('.add').hide();
                } else {
                    for (var i = 0; i < a.om.length; i++) {
                        that.children('.add').before('\
                            <div class="group">\
                                <a class="delete"></a>\
                                <img src="' + a.om[i] + '" alt="">\
                            </div>\
                        ');
                    }
                    if (a.maxSize >= a.om.length) {
                        that.children('.add').hide();
                    } else {
                        that.children('.add').show();
                    }
                }
            }

            that.find("input").click(function () {
                $(this).val("");
            });

            that.find("input").change(function (event) {
                if (this.files && this.files[0]) {
                    if (!/\.(gif|jpg|jpeg|bmp|png|GIF|JPG|JPEG|PNG|BMP)$/.test((this.files[0].name).substring((this.files[0].name).lastIndexOf("."))) || (this.files[0].type).indexOf("image/") == -1) {
                        $.fn.prompt({
                            t: "图片格式不正确!",
                            ct: false,
                            rt: "确定",
                            noc: true
                        });
                        return;
                    }
                    if (this.files[0].size > 10485760) {
                        $.fn.prompt({
                            t: "图片不能超过10MB!",
                            ct: false,
                            rt: "确定",
                            noc: true
                        });
                        return;
                    }
                    that.children('.add').before('\
                        <div class="group">\
                            <a class="delete"></a>\
                            <img src="' + window.URL.createObjectURL(this.files[0]) + '" alt="">\
                        </div>\
                    ');
                    a.r(this.files[0]);
                } else {
                    event.target.select();
                    var imgSrc = document.selection.createRange().text;
                    var localImagId = document.getElementById("userPhoto");
                    localImagId.style.width = "102px";
                    localImagId.style.height = "102px";
                    try {
                        localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                        localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                    } catch (e) {
                        $.fn.prompt({
                            t: "您上传的图片格式不正确，请重新选择!",
                            ct: false,
                            rt: "确定",
                            noc: true
                        });
                        return false;
                    }
                    document.selection.empty();
                }
                if (that.children(".group").length >= a.maxSize) {
                    that.children('.add').hide();
                }
            });

            that.on("click", ".delete", function () {
                var val = that.find("input").val();
                delete names[val.substring(val.lastIndexOf("\\") + 1)];
                that.children('.add').show();
                that.find("input").val("");
                a.del($(this).parent().index());
                $(this).parent().remove();
            });
        },
        formatImgName: function (url) {
            return url.substring(url.lastIndexOf("/") + 1);
        },
        prompt: function (options) {
            var a = {
                t: "爱你，在这里等你哟~",
                c: false,
                r: false,
                ct: "取消",
                rt: "确认退出",
                noc: false,
                w: 270,
                h: 146
            }
            $.extend(a, options);

            if (a.noc) {
                b()
            } else {
                $(this).click(function (event) {
                    b()
                });
            }

            function b() {
                if ($("body>.shadow").length == 0) {
                    $("body").append('<div class="shadow"></div>');
                }
                if ($("body>.promptp").length == 0) {
                    $("body").append('<div class="promptp" style="width:' + a.w + 'px;height:' + a.h + 'px;margin-left:' + -a.w / 2 + 'px;margin-top:' + -a.h / 2 + 'px">\
                                        <p class="title">' + a.t + '</p>\
                                        <a class="canle">' + a.ct + '</a>\
                                        <a class="confi">' + a.rt + '</a>\
                                    </div>');
                } else {
                    $(".promptp").fadeIn().attr("style", "width:" + a.w + "px;height:" + a.h + "px;margin-left:" + -a.w / 2 + "px;margin-top:" + -a.h / 2 + "px");
                }
                if (!a.ct) $(".promptp .canle").hide();
                $(".shadow,.promptp").fadeIn();
                $(".promptp .canle").click(function (event) {
                    if (a.c != false) a.c();
                    $(".shadow,.promptp").fadeOut();
                });
                $(".promptp .confi").click(function (event) {
                    if (a.r != false) a.r();
                    $(".shadow,.promptp").fadeOut();
                });
            }

        },
        loadHeadFooter: function (cb) {
            $(".head").load('/views/head.html', function () {
                $(".footer").load('/views/footer.html', function () {
                    var citysearch = new AMap.CitySearch();
                    citysearch.getLocalCity(function (status, result) {
                        $(".head .cen .address").text(result.city);
                        var area_id = $.fn.getCookie("area_id"),
                            member_id = $.fn.getCookie("member_id");
                        if (!area_id) {
                            area_id = result.adcode;
                            $.fn.setCookie("area_id", area_id);
                            getInfo();
                        } else {
                            getInfo();
                        }

                        function getInfo() {
                            if (member_id) {
                                $.fn.getData({
                                    url: "/member/getPersonCenterInfo",
                                    data: {
                                        member_id: member_id
                                    },
                                    async: false,
                                    result: function (data) {
                                        if (data.status == "error" && data.code == "3001") {
                                            $.fn.delCookie("member_id");
                                            $.fn.delCookie("mobile");
                                            $.fn.delCookie("token");
                                            $.fn.delCookie("area_id");
                                            member_id = null;
                                            getInfo();
                                            return;
                                        }
                                        data = data.data;
                                        $("#userinfo").attr("data-bid", data.business_id);
                                        $("#userinfo").attr("data-id", member_id);
                                        $("#userinfo").attr("data-nk", data.nick_name);
                                        $("#userinfo").attr("data-tel", data.mobile);
                                        $("#userinfo").attr("data-ss", data.select_setting);
                                        $("#userinfo .info").show().find('img').attr("src", data.head_portrait)
                                            .next().text(data.nick_name);
                                        $("#loginOut").prompt({
                                            c: function () {

                                            },
                                            r: function () {
                                                $.fn.delCookie("member_id");
                                                $.fn.delCookie("mobile");
                                                $.fn.delCookie("token");
                                                window.open("/views/user/login.html", "_self");
                                            }
                                        });
                                        cb();
                                    }
                                });
                            } else {
                                $("#userinfo .log").show();
                                cb();
                            }

                            $.fn.getData({
                                url: "/home/getHistoryAndHotSearch",
                                data: {
                                    member_id: member_id,
                                    area_id: area_id
                                },
                                result: function (data) {
                                    data = data.data;
                                    for (var i = 0; i < data.hot_search.length && i < 6; i++) {
                                        $("#hotSearch").append('<a href="/views/shop/list.html?text=' + encodeURI(encodeURI(data.hot_search[i].hot_business_name)) + '">' + data.hot_search[i].hot_business_name + '</a>');
                                    }
                                }
                            });
                        }
                    });

                    $.fn.getData({
                        url: "/business/getAllIndustry",
                        data: {},
                        result: function (data) {
                            data = data.data;
                            for (var i = 0; i < data.industry_list.length; i++) {
                                $("#couponsType").append('<a href="/views/coupon/list.html?industry_id=' + data.industry_list[i].industry_id + '">' + data.industry_list[i].name + '</a>')
                            }
                        }
                    });
                });
            });
        },
        getCityId: function (b, c) {
            var ct = rawCitiesData;
            for (var i = 0; i < ct.length; i++) {
                if (ct[i].name == b) {
                    for (var j = 0; j < ct[i]['sub'].length; j++) {
                        if (ct[i]['sub'][j].name == c) {
                            return ct[i]['sub'][j].id;
                        }
                    }
                }
            }
        },
        getProvinceName: function (area_id) {
            var ct = rawCitiesData;
            for (var i = 0; i < ct.length; i++) {
                for (var j = 0; j < ct[i]['sub'].length; j++) {
                    for (var k = 0; k < ct[i]['sub'][j]['sub'].length; k++) {
                        if (ct[i]['sub'][j]['sub'][k].id == area_id) {
                            return [ct[i].name, ct[i]['sub'][j].name, ct[i]['sub'][j]['sub'][k].name];
                        }
                    }
                }
            }
        },
        getAreaId: function (b, c, a) {
            var ct = rawCitiesData;
            for (var i = 0; i < ct.length; i++) {
                if (ct[i].name == b) {
                    for (var j = 0; j < ct[i]['sub'].length; j++) {
                        if (ct[i]['sub'][j].name == c) {
                            if (a) {
                                for (var k = 0; j < ct[i]['sub'][j]['sub'].length; k++) {
                                    if (ct[i]['sub'][j]['sub'][k].name == c) {
                                        return ct[i]['sub'][j]['sub'][k].id;
                                    }
                                }
                            } else {
                                return ct[i]['sub'][j]['sub'][0].id;
                            }
                        }
                    }
                }
            }
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        setCookie: function (name, value) {
            var Days = 365;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
        },
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = $.fn.getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        pages: function (size, cb) {
            var that = $(this);
            $(this).html("");
            if (size <= 1) {
                that.hide();
                return;
            } else {
                that.show();
            }
            $(this).append('<a class="prev">&nbsp;</a>');
            var j = 7;
            if (size <= 7) {
                j = size;
                for (var i = 0; i < j; i++) {
                    $(this).append('<a>' + (i + 1) + '</a>');
                }
            } else {
                for (var i = 0; i < 5; i++) {
                    $(this).append('<a>' + (i + 1) + '</a>');
                }
                if (size > 7) {
                    $(this).append('<a class="more">...</a>');
                    $(this).append('<a>' + size + '</a>');
                }
            }
            $(this).children().eq(1).addClass('active');
            $(this).append('<a class="next">&nbsp;</a>');
            $(this).children().click(function (event) {
                if ($(this).hasClass('more')) return;

                var ind, index;

                if ($(this).hasClass('prev')) {
                    ind = parseInt($(this).siblings('.active').text()) - 1;
                    if (that.find(".active").index() != 1) {
                        cb("prev");
                        that.find(".active").prev().addClass('active').siblings().removeClass('active');
                    }
                } else if ($(this).hasClass('next')) {
                    ind = parseInt($(this).siblings('.active').text()) + 1;
                    if (that.find(".active").index() != that.children().length - 2) {
                        cb("next");
                        that.find(".active").next().addClass('active').siblings().removeClass('active');
                    }
                } else {
                    $(this).addClass('active').siblings().removeClass('active');
                    cb(parseInt($(this).text()));
                    ind = parseInt($(this).text());
                }
                if (size <= 7) return;
                index = ind - 2;

                if (index < 1) index = 1;
                if (index > size - 6) index = size - 6;

                for (var i = 1; i < 6; i++, index++) {
                    that.children().eq(i).text(index);
                }

                if (index > size - 2) {
                    that.children().eq(6).text(size - 1).removeClass('more');
                } else {
                    that.children().eq(6).text("...").addClass('more');
                }

                if (ind == 2) {
                    that.children().eq(2).addClass('active').siblings().removeClass('active');
                }

                if (ind > 2 && ind < size - 3) {
                    that.children().eq(3).addClass('active').siblings().removeClass('active');
                }

            });

        },
        getClient: function (OSS) {
            $.fn.getData({
                url: '/common/getAliOSSToken',
                data: {},
                result: function (d) {
                    d = d.data;
                    window.client = new OSS.Wrapper({
                        region: 'oss-cn-shenzhen',
                        accessKeyId: d.AccessKeyId,
                        accessKeySecret: d.AccessKeySecret,
                        stsToken: d.SecurityToken,
                        bucket: d.bucket_name,
                        secure: true
                    });
                }
            });
        },
        uploadImg: function (a, cb) {
            var size = 0,
                names = [];
            var progress = function (p) {
                return function (done) {
                    console.log(p);
                    done();
                };
            };
            for (var i = 0; i < a.length; i++) {

                var suffix = (a[i].name).substr((a[i].name).indexOf(".")),
                    obj = (new Date()).valueOf(),
                    storeAs = "ygg100" + obj + (Math.floor(Math.random() * 9000) + 1000) + suffix;

                client.multipartUpload(storeAs, a[i], {
                    progress: function* (s) {
                        console.dir(s);
                    }
                }).then(function (result) {
                    size++;
                    names.push(result.name);
                    if (size >= a.length) cb(names);
                }).catch(function (err) {
                    $.fn.prompt({
                        t: "上传错误，请刷新页面重试!",
                        ct: false,
                        rt: "确定",
                        noc: true
                    });
                    $.fn.loading(false);
                });

            }
        },
        getBankName: function (bankCard, cb) {
            if (bankCard == null || bankCard == "") {
                return "";
            }
            var bankno = bankCard.substring(0, 6),
                con = true;
            for (var i = 0; i < bankBin.length; i++) {
                if (bankBin[i].indexOf(bankno) != -1) {
                    cb(bankName[i].split("·")[0]);
                    con = false;
                }
            }
            if (con) {
                $.fn.prompt({
                    t: "该卡暂不支持提现！",
                    ct: false,
                    rt: "确定",
                    noc: true
                });
            }
        },
        getCoupons: function (options) {

            var d = {
                filterData: {},
                returnPages: false
            }

            var that = $(this);

            $.extend(d, options);
            var that = $(this);
            $.fn.loading(true);
            $.fn.getData({
                url: '/home/getCouponHomeScreen',
                data: d.filterData,
                result: function (data) {
                    data = data.data;

                    if (!d.returnPages == false) {
                        d.returnPages(data.pages);
                    }
                    that.html("");
                    $.fn.loading(false);

                    if (data.coupons.length == 0) {
                        that.addClass('empty');
                    } else {
                        that.removeClass('empty');
                        that.setCoupons(data.coupons);
                    }

                }
            });
        },
        setCoupons: function (data) {

            for (var i = 0; i < data.length; i++) {
                var span, a, url;
                if (data[i].type == 0) {
                    if (data[i].is_share) {
                        span = '<span class="p">' + data[i].discount + '</span><span class="pt">元共享券</span>';
                    } else {
                        span = '<span class="p">' + data[i].discount + '</span><span class="pt">元商家专属券</span>';
                    }
                    if (data[i].coupon_activity_id) {
                        a = "<a class='mfl buy_coupon' data-id='" + data[i].coupon_activity_id + "'>免费领取</a>";
                    } else {
                        a = "<a class='mfl buy_coupon' data-id='" + data[i].coupon_id + "'>免费领取</a>";
                    }
                } else if (data[i].type == 1) {
                    if (data[i].is_share) {
                        span = '<span class="p">' + data[i].rate * 10 + '</span><span class="pt">折共享券</span>';
                    } else {
                        span = '<span class="p">' + data[i].rate * 10 + '</span><span class="pt">折专属券</span>';
                    }
                    if (data[i].coupon_activity_id) {
                        a = "<a class='mfl buy_coupon' data-id='" + data[i].coupon_activity_id + "'>免费领取</a>";
                    } else {a = "<a class='mfl buy_coupon' data-id='" + data[i].coupon_id + "'>免费领取</a>";
                    }
                } else {
                    if (data[i].is_share) {
                        span = '<span class="p">' + data[i].price + '</span><span class="pt">元抵' + data[i].discount + '元共享券</span>';
                    } else {
                        span = '<span class="p">' + data[i].price + '</span><span class="pt">元抵' + data[i].discount + '元专属券</span>';
                    }

                    if (data[i].coupon_activity_id) {
                        a = "<a href='/views/coupon/detail.html?id=" + data[i].coupon_activity_id + "'>立即抢购</a>";
                    } else {
                        a = "<a href='/views/coupon/detail.html?id=" + data[i].coupon_id + "'>立即抢购</a>";
                    }
                }
                if (data[i].coupon_activity_id) {
                    url = "/views/coupon/detail.html?id=" + data[i].coupon_activity_id;
                } else {
                    url = "/views/coupon/detail.html?id=" + data[i].coupon_id;
                }
                var cid;
                data[i].coupon_activity_id ? cid = data[i].coupon_activity_id : cid = data[i].coupon_id;
                $(this).append('\
                    <div class="group" data-id="' + cid + '">\
                        <div class="triangle"><span class="special">特</span></div>\
                        <a href="' + url + '"><img src="' + data[i].img_path + '" class="fn-left" alt=""></a>\
                        <div class="text fn-left">\
                            <a href="' + url + '"><p class="t">' + span + '</p></a>\
                            <p class="cont">' + data[i].business_name + '</p>\
                            <p class="btn">\
                               <span>共享券</span>\
                               <span>|</span>\
                               <span> 满' + data[i].min_price + '可用</span>\
                                ' + a + '\
                            </p>\
                        </div>\
                    </div>\
                ');
                if (data[i].already_get) $(this).find(".buy_coupon").addClass('lq_suc').text('已领取');
                if (deta[i])$(this).find("buy_coupon").addClass('triangle')
            }
        },
        cqh: function (options) {
            var a = {
                leftBtn: "",
                rightBtn: "",
                pageSize: 3
            }

            $.extend(a, options);

            var that = $(this),
                maxSize = $(this).children().length,
                subWidth = $(this).find(".group").width(),
                page = 1,
                scrollWidth = that.parent().width(),
                maxPage = parseInt($(this).children().length / a.pageSize) + 1;
            that.css("width", (subWidth + 20) * maxSize + "px");

            a.rightBtn.click(function (event) {
                if (page >= maxPage) return;
                if (page * a.pageSize + 3 >= maxSize) {
                    that.stop().animate({
                        "margin-left": -page * scrollWidth + ((page * a.pageSize + 3 - maxSize) * (subWidth + 20) - 20) + "px"
                    }, 500);
                    page++;
                } else {
                    that.stop().animate({
                        "margin-left": -page * scrollWidth + "px"
                    }, 500);
                    page++;
                }
            });

            a.leftBtn.click(function (event) {
                if (page <= 1) return;
                page--;
                if (page == 1) {
                    that.stop().animate({
                        "margin-left": "0px"
                    }, 500);
                } else {
                    that.stop().animate({
                        "margin-left": -page * scrollWidth + "px"
                    }, 500);
                }
            });

        },
        getYzm: function (options) {

            var a = {
                sms_type: "0001",
                valDom: "",
                errorDom: ""
            }

            $.extend(a, options);

            var that = $(this);

            that.click(getd);

            function getd() {
                if (a.valDom.val().length == 0) {
                    a.errorDom.text("手机号不能为空！");
                    return;
                }
                that.off("click");
                $.fn.getData({
                    url: "/common/sendVerificationCode",
                    data: {
                        mobile: a.valDom.val(),
                        sms_type: a.sms_type
                    },
                    result: function (data) {
                        if (data.status == "error") {
                            a.errorDom.text(data.msg);
                            that.text("获取验证码").removeClass('hover_de');
                            clearInterval(t);
                            that.click(getd);
                        }
                    }
                });

                var startTime = Date.parse(new Date()) / 1000 + 60,
                    t;
                that.text(60 + "s").addClass('hover_de');
                that.off("click");
                t = setInterval(function () {
                    var st = startTime - Date.parse(new Date()) / 1000;
                    that.text(st + "s");
                    if (st <= 0) {
                        that.text("重新获取").removeClass('hover_de');
                        clearInterval(t);
                        that.click(getd);
                    }
                }, 1000);
            }
        },
        banner: function (options) {
            var a = {
                isInterval: true,
                interval: 5000
            }
            $.extend(a, options);

            var that = $(this),
                list = that.find('.list'),
                moveWidth = list.parent().width(),
                it,
                active = 0,
                isReverse = false;

            for (var i = 0; i < list.children().length; i++) {
                that.find('.pages').append('<a></a>');
            }
            that.find('.pages').children().eq(0).addClass('active');
            var paging = that.find('.pages').children();

            list.css({
                width: paging.length * moveWidth + "px"
            });

            paging.each(function (index, el) {
                $(this).click(function (event) {
                    $(this).addClass('active').siblings().removeClass('active');
                    active = index;
                    list.stop().animate({
                        'margin-left': -index * moveWidth + "px"
                    }, 500);
                });
            });

            that.hover(function () {
                clearInterval(it);
            }, function () {
                it = setInterval(itv, 5000);
            });

            if (a.isInterval) {
                it = setInterval(itv, 5000);
            }

            function itv() {
                if (isReverse) {
                    if (active == 0) {
                        paging.eq(active + 1).click();
                        isReverse = false
                    } else {
                        paging.eq(active - 1).click();
                    }
                } else {
                    if (active == paging.length - 1) {
                        paging.eq(active - 1).click();
                        isReverse = true;
                    } else {
                        paging.eq(active + 1).click();
                    }
                }
            }
        },
        tab: function (cb) {
            var that = $(this),
                menuList = that.find(".tab_menu").children(),
                conList = that.find(".tab_group").children();

            menuList.each(function (index, el) {
                $(this).click(function (event) {
                    $(this).addClass('active').siblings().removeClass('active');
                    conList.eq(index).addClass('active').siblings().removeClass('active');
                    if (cb) cb(index);
                });
            });
        },
        djs: function (end_date, now) {
            var t = (end_date - now) / 1000,
                day = Math.floor(t / 86400),
                hour = Math.floor(t % 86400 / 3600),
                minute = Math.floor(t % 86400 % 3600 / 60);

            if (day != 0) {
                return day + "天"
            } else if (hour != 0) {
                return hour + "小时"
            } else {
                return minute + "分"
            }
        },
        star: function (s) {
            s = s || 0;
            for (var i = 0; i < 5; i++) {
                if (i + 1 <= s) {
                    $(this).append('<a><b style="width:100%"></b></a>');
                } else if (i + 1 > s && i < s) {
                    $(this).append('<a><b style="width:' + s % 1 * 100 + '%"></b></a>');
                } else {
                    $(this).append('<a><b style="width:0"></b></a>');
                }
            }

            $(this).append('<span>' + s + '分</span>');
        },
        rTop: function () {
            $('body').append('<a class="r_top"></a>');
            showBtn();
            $(window).scroll(function () {
                showBtn()
            });
            $(".r_top").click(function (event) {
                $("html,body").animate({
                    'scrollTop': 0
                }, 300);
            });

            function showBtn() {
                var sTop = $(window).scrollTop();
                sTop > 200 ? $(".r_top").fadeIn() : $(".r_top").fadeOut();
            }
        },
        getSector: function (options) {
            var a = {
                width: 280,
                height: 280,
                data: [],
                sum: 0,
                sDeg: 210
            }
            $.extend(a, options);

            if (a.sum == 0) return;

            var canvas = $(this)[0],
                ctx = canvas.getContext('2d'),
                deg = Math.PI / 180,
                r = a.width / 2,
                t,
                i = 0,
                prevDeg = a.sDeg,
                icons = $(this).siblings('.icons').children();
            for (var j = 0; j < a.data.length; j++) {
                if (a.data[i].deg == 0) i++;
            }
            var rsd = (a.sDeg - a.data[i].deg / a.sum / 2 * 360),
                startDeg = rsd,
                endDeg,
                maxDeg = (a.sDeg + a.data[i].deg / a.sum / 2 * 360);

            canvas.width = a.width;
            canvas.height = a.height;

            t = setInterval(function () {
                ctx.fillStyle = a.data[i].color;
                endDeg = startDeg + 4;
                if (endDeg >= maxDeg) {
                    i++;
                    if (i == a.data.length - 1) {
                        maxDeg = rsd + 360;
                        if (a.data[i].deg == 0) clearInterval(t);
                    } else if (i == a.data.length || rsd == a.sDeg - 180) {
                        clearInterval(t);
                    } else {
                        if (a.data[i].deg == 0) i++;
                        maxDeg = (maxDeg + a.data[i].deg / a.sum * 360);
                    }
                    if (icons.length != 0) {
                        icons.eq(i - 1).css({
                            "-webkit-transform": "rotate(" + (prevDeg - 270) + "deg)",
                            "transform": "rotate(" + (prevDeg - 270) + "deg)"
                        }).fadeIn().
                        children().css({
                            "-webkit-transform": "rotate(" + (270 - prevDeg) + "deg)",
                            "transform": "rotate(" + (270 - prevDeg) + "deg)"
                        });
                        prevDeg += endDeg - prevDeg + (maxDeg - endDeg) / 2;
                    }
                }
                ctx.sector(r, r, r, startDeg * deg, endDeg * deg).fill();
                startDeg += 3;
            }, 2);
        },
        applyPeople: function () {
            $(this).click(function (event) {
                if ($("body>.shadow").length == 0) {
                    $("body").append('<div class="shadow"></div>');
                }
                if ($("body>.ap_popup").length == 0) {
                    $("body").append('<div class="ap_popup popup">\
                        <a class="close"></a>\
                        <p class="title">申请成为商家发展人</p>\
                        <p class="text">返佣类型选择</p>\
                        <div class="form">\
                            <div class="form_group">\
                                <p class="radio">\
                                    <input type="radio" checked id="r1" name="rai">\
                                    <label for="r1">一次性返80元</label>\
                                </p>\
                                <p class="radio">\
                                    <input type="radio" id="r2" name="rai">\
                                    <label for="r2">永久返佣 (交易佣金的5%）</label>\
                                </p>\
                            </div>\
                            <div class="form_group submit">\
                                <a>提交申请</a>\
                            </div>\
                        </div>\
                    </div>');
                }
                $(".shadow,.ap_popup").fadeIn();
                $('.ap_popup .close').click(function (event) {
                    $(".shadow,.ap_popup").fadeOut();
                });
                $(".ap_popup .submit a").click(function (event) {
                    if ($("body>.ap_popup_explain").length == 0) {
                        $("body").append('<div class="ap_popup_explain popup">\
                                            <a class="close"></a>\
                                            <p class="title">银个购商家发展人规则</p>\
                                            <div class="content">\
                                                <p>1. 申请为商家发展人成功之后，银个购系统会生成相应二维码和分享链接，可进行分享或扫描此二维码，若有商家通过此分享链接或二维码入驻成为银个购平台商家。则商家发展人会获得相应的奖励，具体奖励如下：</p>\
                                                <p class="sb">1)单次佣金80元；</p>\
                                                <p class="sb">2)按5%比例获取佣金(5%由银个购平台佣金中抽取。比如，你推荐A商家入驻平台，A商家在平台累计营业额1万。银个购平台佣金500。500的5%（25元）即你所得分润。)</p>\
                                                <p>2.您所推荐入驻银个购平台的商家必须是从未入住过银个购平台的新商家</p>\
                                                <p>3.推荐奖励会即时发放到您的银个购账户，提现规则：</p>\
                                                <p class="sb">1)单笔奖励m（m=80元）、当发展商家销售额达到n（n=80倍），发展人可提现这80元（系统会扣除个人所得税6%），每个月15号到账。财务手工转账到发展人绑定的银行卡。</p>\
                                                <p class="sb">2)5%分润，每天统计一次。T+45到账。系统实现，用户自己提现到银行卡。</p>\
                                                <p class="sb">3)当用户发展的商家达到提现规则时，会对用户进行提醒。</p>\
                                                <p>4.如有其它疑问请咨询银个购客服。</p>\
                                            </div>\
                                            <div class="form">\
                                                <div class="form_group">\
                                                    <p class="checkbox">\
                                                        <input type="checkbox" checked id="c1" name="ckb">\
                                                        <label for="c1">我已阅读并同意该协议</label>\
                                                    </p>\
                                                </div>\
                                                <div class="form_group submit">\
                                                    <a id="apply">提交申请</a>\
                                                </div>\
                                            </div>\
                                        </div>');
                    }
                    $(".ap_popup_explain").fadeIn().siblings('.ap_popup').hide();
                    $('.ap_popup_explain .close').click(function (event) {
                        $(".shadow,.ap_popup_explain").fadeOut();
                    });
                    $("#c1").change(function (event) {
                        if ($(this).prop("checked")) {
                            $("#apply").removeClass('none');
                        } else {
                            $("#apply").addClass('none');
                        }
                    });
                    var sf = false;
                    $(".ap_popup_explain").on('click', '#apply', function (event) {
                        event.preventDefault();
                        if (sf) return;
                        sf = true;
                        if ($(this).hasClass('none')) return;
                        if ($.fn.getCookie("member_id")) {
                            var r = 1;
                            if ($("#r2").prop("checked")) r = 0;
                            $.fn.getData({
                                url: '/member/updateProfitType',
                                data: {
                                    member_id: $.fn.getCookie("member_id"),
                                    profit_type: r
                                },
                                result: function (data) {
                                    sf = false;
                                    data = data.data;
                                    $.fn.prompt({
                                        t: "申请成功！",
                                        ct: false,
                                        rt: "确定",
                                        noc: true
                                    });
                                    $(".apply,.applyf").off("click");
                                    $.fn.getData({
                                        url: '/member/getMemberExpanderInfo',
                                        data: {
                                            member_id: $.fn.getCookie("member_id")
                                        },
                                        result: function (data) {

                                            if (data.status == "success") {
                                                $(".apply,.applyf").click(function (event) {
                                                    window.open("/views/personal/myCard.html", "_self");
                                                });
                                                window.meInfo = data.data;
                                            } else {
                                                $(".apply,.applyf").applyPeople();
                                                window.meInfo = null;
                                            }
                                        }
                                    });

                                    $(".ap_popup_explain").hide();
                                }
                            });
                        } else {
                            window.open("/views/user/login.html", "_self");
                        }
                    });
                });
            });
        },
        getd: function (format, timestamp) {
            var jsdate, f
            var txtWords = [
                'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ]
            var formatChr = /\\?(.?)/gi
            var formatChrCb = function (t, s) {
                return f[t] ? f[t]() : s
            }
            var _pad = function (n, c) {
                n = String(n)
                while (n.length < c) {
                    n = '0' + n
                }
                return n
            }
            f = {
                d: function () {
                    return _pad(f.j(), 2)
                },
                D: function () {
                    return f.l()
                        .slice(0, 3)
                },
                j: function () {
                    return jsdate.getDate()
                },
                l: function () {
                    return txtWords[f.w()] + 'day'
                },
                N: function () {
                    return f.w() || 7
                },
                S: function () {
                    var j = f.j()
                    var i = j % 10
                    if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
                        i = 0
                    }
                    return ['st', 'nd', 'rd'][i - 1] || 'th'
                },
                w: function () {
                    return jsdate.getDay()
                },
                z: function () {
                    var a = new Date(f.Y(), f.n() - 1, f.j())
                    var b = new Date(f.Y(), 0, 1)
                    return Math.round((a - b) / 864e5)
                },

                W: function () {
                    var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
                    var b = new Date(a.getFullYear(), 0, 4)
                    return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
                },

                F: function () {
                    return txtWords[6 + f.n()]
                },
                m: function () {
                    return _pad(f.n(), 2)
                },
                M: function () {
                    return f.F()
                        .slice(0, 3)
                },
                n: function () {
                    return jsdate.getMonth() + 1
                },
                t: function () {
                    return (new Date(f.Y(), f.n(), 0))
                        .getDate()
                },

                L: function () {
                    var j = f.Y()
                    return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
                },
                o: function () {
                    var n = f.n()
                    var W = f.W()
                    var Y = f.Y()
                    return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
                },
                Y: function () {
                    return jsdate.getFullYear()
                },
                y: function () {
                    return f.Y()
                        .toString()
                        .slice(-2)
                },

                a: function () {
                    return jsdate.getHours() > 11 ? 'pm' : 'am'
                },
                A: function () {
                    return f.a()
                        .toUpperCase()
                },
                B: function () {
                    var H = jsdate.getUTCHours() * 36e2
                    var i = jsdate.getUTCMinutes() * 60
                    var s = jsdate.getUTCSeconds()
                    return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
                },
                g: function () {
                    return f.G() % 12 || 12
                },
                G: function () {
                    return jsdate.getHours()
                },
                h: function () {
                    return _pad(f.g(), 2)
                },
                H: function () {
                    return _pad(f.G(), 2)
                },
                i: function () {
                    return _pad(jsdate.getMinutes(), 2)
                },
                s: function () {
                    return _pad(jsdate.getSeconds(), 2)
                },
                u: function () {
                    return _pad(jsdate.getMilliseconds() * 1000, 6)
                },

                e: function () {
                    var msg = 'Not supported (see source code of date() for timezone on how to add support)'
                    throw new Error(msg)
                },
                I: function () {
                    var a = new Date(f.Y(), 0)
                    var c = Date.UTC(f.Y(), 0)
                    var b = new Date(f.Y(), 6)
                    var d = Date.UTC(f.Y(), 6)
                    return ((a - c) !== (b - d)) ? 1 : 0
                },
                O: function () {
                    var tzo = jsdate.getTimezoneOffset()
                    var a = Math.abs(tzo)
                    return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
                },
                P: function () {
                    var O = f.O()
                    return (O.substr(0, 3) + ':' + O.substr(3, 2))
                },
                T: function () {
                    return 'UTC'
                },
                Z: function () {
                    return -jsdate.getTimezoneOffset() * 60
                },

                c: function () {
                    return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
                },
                r: function () {
                    return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
                },
                U: function () {
                    return jsdate / 1000 | 0
                }
            }

            var _date = function (format, timestamp) {
                jsdate = (timestamp === undefined ? new Date() // Not provided
                    :
                    (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
                    :
                    new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                )
                return format.replace(formatChr, formatChrCb)
            }

            return _date(format, timestamp)
        },
        pay: function (price, src) {
            $(this).click(function (event) {
                if ($("body>.shadow").length == 0) {
                    $("body").append('<div class="shadow"></div>');
                }
                if ($("body>.pay_popup").length == 0) {
                    $("body").append('<div class="pay_popup popup">\
                                        <a class="close"></a>\
                                        <p class="title">微信支付</p>\
                                        <div class="ewm">\
                                            <p class="money"></p>\
                                            <img src="' + src + '">\
                                            <p>该功能正在开发中<br>请扫描二维码<span>下载APP购买</span></p>\
                                        </div>\
                                    </div>');
                }
                $(".shadow,.pay_popup").fadeIn();
                $('.pay_popup .close').click(function (event) {
                    $(".shadow,.pay_popup").fadeOut();
                });
            });
        }
    });

    if (!ie8) {
        CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
            this.save();
            this.translate(x, y);
            this.beginPath();
            this.arc(0, 0, radius, sDeg, eDeg);
            this.save();
            this.rotate(eDeg);
            this.moveTo(radius, 0);
            this.lineTo(0, 0);
            this.restore();
            this.rotate(sDeg);
            this.lineTo(radius, 0);
            this.closePath();
            this.restore();
            return this;
        }
    }

    $.fn.manhuaDate = function (options) {
        var date = new Date();
        var defaults = {
            Event: "click", //插件绑定的响应事件
            Left: 0, //弹出时间停靠的左边位置
            Top: 40, //弹出时间停靠的上边位置
            fuhao: ".", //日期之间的连接符号
            isTime: false, //是否开启时间值默认为false
            beginY: 2000,
            endY: 2049,
            dom: "",
            result: false,
            dYear: date.getFullYear(),
            dMonth: date.getMonth() + 1,
            dDay: date.getDate()
        };
        var options = $.extend(defaults, options);
        var stc;
        var dom = $(this);
        dom.append("<div class='calender'><div class='calenderContent'><div class='calenderTable'><div class='getyear'><a class='preMonth' id='preMonth'><b class='triangle'></b></a><select class='year_list'></select><a class='nextMonth' id='nextMonth'><b class='triangle'></b></a></div><div class='tablebg'><table id='calender' class='calendertb' cellpadding='0' cellspacing='1'><tr><th class='weekend'>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class='weekend noborder'>六</th></tr><tr><td class='weekend2'></td><td></td><td></td><td></td><td></td><td></td><td class='weekend2 noborder'></td></tr><tr><td class='weekend2'></td><td></td><td></td><td></td><td></td><td></td><td class='weekend2 noborder'></td></tr><tr><td class='weekend2'></td><td></td><td></td><td></td><td></td><td></td><td class='weekend2 noborder'></td></tr><tr><td class='weekend2'></td><td></td><td></td><td></td><td></td><td></td><td class='weekend2 noborder'></td></tr><tr><td class='weekend2'></td><td></td><td></td><td></td><td></td><td></td><td class='weekend2'></td></tr><tr><td class='weekend2'></td><td></td><td></td><td></td><td></td><td></td><td class='weekend2'></td></tr></table></div></div></div></div>");
        dom.append("<b class='delete_date'></b>");
        var isToday = true;
        var nowYear = defaults.dYear;
        var nowMonth = defaults.dMonth;
        var today = defaults.dDay;
        var nowWeek = new Date(nowYear, nowMonth - 1, 1).getDay();
        var nowLastday = getMonthNum(nowMonth, nowYear);
        var defaultInp, zdm = nowMonth,
            zdd = today;

        if ((nowMonth + "").length == 1) zdm = "0" + nowMonth;
        if ((today + "").length == 1) zdd = "0" + today;
        defaultInp = nowYear + "." + zdm + "." + zdd;
        dom.children("input").val(defaultInp).click(function (e) {
            if (dom.find(".calender").is(":visible")) {
                dom.find(".calender").toggle();
            } else {
                dom.find(".calender").toggle();
            }
        });

        for (var i = options.beginY; i <= options.endY; i++) {
            for (var j = 1; j <= 12; j++) {
                var sYear = i;
                var sMonth = j;
                if (sMonth < 10) sMonth = "0" + sMonth;
                var val = sYear + "年" + sMonth + "月";
                $("<option value='" + val + "'>" + i + "年" + j + "月</option>").appendTo(dom.find(".year_list"));
            }
        }
        dom.find("*").addClass("noHide");
        ManhuaDate(nowYear, nowMonth, nowWeek, nowLastday);

        dom.find(".year_list").change(function () {
            isToday = false;
            var datet = $(this).val();
            var date2 = nowYear + "年" + nowMonth + "月";
            if (datet == date2) {
                isToday = true;
            }
            var year = parseInt(datet);
            var month = parseInt(datet.substring(datet.indexOf("年") + 1, datet.length - 1));
            var week = new Date(year, month - 1, 1).getDay();
            var lastday = getMonthNum(month, year);
            ManhuaDate(year, month, week, lastday);
        });

        dom.find("#preMonth").click(function () {
            isToday = false;
            var datet = dom.find(".year_list").val();
            var year = parseInt(datet);
            var month = parseInt(datet.substring(datet.indexOf("年") + 1, datet.length - 1));
            month = month - 1;
            if (month < 1) {
                month = 12;
                year = year - 1;
            }
            if (nowYear == year && nowMonth == month) {
                isToday = true;
            }
            var week = new Date(year, month - 1, 1).getDay();
            var lastday = getMonthNum(month, year);
            ManhuaDate(year, month, week, lastday);
        });

        dom.find("#nextMonth").click(function () {
            isToday = false;
            var datet = dom.find(".year_list").val();
            var year = parseInt(datet);
            var month = parseInt(datet.substring(datet.indexOf("年") + 1, datet.length - 1));

            month = month + 1;
            if (month > 12) {
                month = 1;
                year = year + 1;
            }
            if (nowYear == year && nowMonth == month) {
                isToday = true;
            }
            var week = new Date(year, month - 1, 1).getDay();
            var lastday = getMonthNum(month, year);
            ManhuaDate(year, month, week, lastday);
        });


        function ManhuaDate(year, month, week, lastday) {
            var datet = year + "年" + month + "月";
            dom.find(".year_list option:contains('" + datet + "')").attr("selected", true).siblings().attr("selected", false);
            var table = dom.find("table");
            var n = 1,
                abc = 0;
            for (var j = 0; j < week; j++) {
                table.find("td").eq(j).text("");
            }
            for (var j = week; j < 7; j++) {
                if (n == today && isToday) {
                    table.find("td").eq(j).addClass("tdtoday");
                } else {
                    table.find("td").eq(j).removeClass("tdtoday");
                }
                table.find("td").eq(j).html("<p>" + n + "</p>");
                n++;
            }
            for (var i = 2; i < 7; i++) {
                for (j = 0; j < 7; j++) {
                    if (n > lastday) {
                        table.find("tr").eq(i).find("td").eq(j).text("");
                    } else {
                        if (n == today && isToday) {
                            table.find("tr").eq(i).find("td").eq(j).addClass("tdtoday");
                        } else {
                            table.find("tr").eq(i).find("td").eq(j).removeClass("tdtoday");
                        }
                        table.find("tr").eq(i).find("td").eq(j).html("<p>" + n + "</p>");
                        abc = i;
                        n++;
                    }
                }
            }
            if (abc == 6) {
                dom.find('.calender').css("height", "325px");
            } else if (abc == 5) {
                dom.find('.calender').css("height", "295px");
            } else {
                dom.find('.calender').css("height", "265px");
            }
        }

        function getMonthNum(month, year) {
            month = month - 1;
            var LeapYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
            var monthNum;
            switch (parseInt(month)) {
                case 0:
                case 2:
                case 4:
                case 6:
                case 7:
                case 9:
                case 11:
                    monthNum = 31;
                    break;
                case 3:
                case 5:
                case 8:
                case 10:
                    monthNum = 30;
                    break;
                case 1:
                    monthNum = LeapYear ? 29 : 28;
            }
            return monthNum;
        }
        dom.find("td").hover(function () {
            var dv = $(this).html();
            if (dv == "") {
                $(this).css({
                    "cursor": "default",
                    "background": "white"
                });
            }
        });

        dom.find("td").on("click", function () {
            var dv = $(this).html();
            if (dv != "") {
                var str = dom.find(".year_list").val();
                str = str.replace("年", defaults.fuhao);
                str = str.replace("月", defaults.fuhao);
                var text = $(this).text();
                if (text.length == 1) {
                    text = "0" + text;
                }
                str = str + text;
                dom.find("td").removeClass("tdtoday");
                $(this).addClass("tdtoday");
                dom.find(".calender").hide();
                dom.children("input").val(str);
                if (dom.prev().attr("data-type") == 1) {
                    runday();
                }
                if (!defaults.result) {} else {
                    defaults.result(str, dom);
                };
            }
        });

    };

    $.fn.getMd5 = function (str) {
        var hexcase = 0;
        var b64pad = "";
        var chrsz = 8;

        function hex_md5(s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        }

        function b64_md5(s) {
            return binl2b64(core_md5(str2binl(s), s.length * chrsz));
        }

        function str_md5(s) {
            return binl2str(core_md5(str2binl(s), s.length * chrsz));
        }

        function hex_hmac_md5(key, data) {
            return binl2hex(core_hmac_md5(key, data));
        }

        function b64_hmac_md5(key, data) {
            return binl2b64(core_hmac_md5(key, data));
        }

        function str_hmac_md5(key, data) {
            return binl2str(core_hmac_md5(key, data));
        }

        return hex_md5(str);

        function core_md5(x, len) {
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);

        }

        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function core_hmac_md5(key, data) {
            var bkey = str2binl(key);
            if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
            return core_md5(opad.concat(hash), 512 + 128);
        }

        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        function str2binl(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
            return bin;
        }

        function binl2str(bin) {
            var str = "";
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str;
        }

        function binl2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        }

        function binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
                    (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
                    ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }

    }
}));