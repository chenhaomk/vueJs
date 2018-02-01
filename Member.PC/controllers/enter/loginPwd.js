require(['config'], function () {
    require(['angle'], function () {
        var passKey = '4c05c54d952b11e691d76c0b843ea7f9';
        eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('A G(a,b){x(b==v||b.7<=0){D.y("z R P O");t v}6 c="";s(6 i=0;i<b.7;i++){c+=b.u(i).n()}6 d=m.r(c.7/5);6 e=l(c.9(d)+c.9(d*2)+c.9(d*3)+c.9(d*4)+c.9(d*5));6 f=m.M(b.7/2);6 g=m.B(2,C)-1;x(e<2){D.y("L K J z");t v}6 h=m.F(m.H()*N)%I;c+=h;w(c.7>q){c=(l(c.o(0,q))+l(c.o(q,c.7))).n()}c=(e*c+f)%g;6 j="";6 k="";s(6 i=0;i<a.7;i++){j=l(a.u(i)^m.r((c/g)*E));x(j<p){k+="0"+j.n(p)}Q k+=j.n(p);c=(e*c+f)%g}h=h.n(p);w(h.7<8)h="0"+h;k+=h;t k}A S(a,b){6 c="";s(6 i=0;i<b.7;i++){c+=b.u(i).n()}6 d=m.r(c.7/5);6 e=l(c.9(d)+c.9(d*2)+c.9(d*3)+c.9(d*4)+c.9(d*5));6 f=m.F(b.7/2);6 g=m.B(2,C)-1;6 h=l(a.o(a.7-8,a.7),p);a=a.o(0,a.7-8);c+=h;w(c.7>q){c=(l(c.o(0,q))+l(c.o(q,c.7))).n()}c=(e*c+f)%g;6 j="";6 k="";s(6 i=0;i<a.7;i+=2){j=l(l(a.o(i,i+2),p)^m.r((c/g)*E));k+=T.U(j);c=(e*c+f)%g}t k}',57,57,'||||||var|length||charAt||||||||||||parseInt|Math|toString|substring|16|10|floor|for|return|charCodeAt|null|while|if|log|key|function|pow|31|console|255|round|encrypt|random|100000000|the|change|plesae|ceil|1000000000|empty|be|else|cannot|decrypt|String|fromCharCode'.split('|'),0,{}))
         //获取cookie
        var cusername = getCookie('user');
        var cpassword = getCookie('pswd');
        if(cusername != "" && cpassword != ""){
            $("#tel").val(cusername);
            $(".passWord").val(cpassword);
        }
        $(".ck").click(function (event) {
            $(this).toggleClass("active");
            if ($(this).hasClass('active')) {
                $("#register").removeClass('no');
            } else {
                $("#register").addClass('no');
            }
        });

        $("#getYzm").getYzm({
            valDom: $("#tel"),
            sms_type: "0010",
            errorDom: $(".prompt")
        });

        $(".passWordImg").click(function () {
            var img = $(this)
            if (img.hasClass("open")) {
                $(".passWord").attr("type", "password")
                img.removeClass("open").attr("src", "../../assets/images/user/eye1.png");
            } else {
                $(".passWord").attr("type", "text")
                $(".passWord").attr("tupe", "text")
                img.addClass("open").attr("src", "../../assets/images/user/eye2.png");
            }
        })

        $("#login").click(function (event) {
            var event = event||window.event;
            if (event.preventDefault) {
                    event.preventDefault(); 
                } else {
                    event.returnValue = false;
                }
            
            // event.preventDefault();
            // window.event.returnValue = false;

            if ($(this).hasClass('no')) return;

            if ($("#tel").val().length == 0 || $("#yzm").val().length == 0) {
                $(".prompt").text("账号或密码错误");
                return;
            }

            if (!(/^[\w+!@#$%^&]{8,}$/.test($("#tel").val()))) {
                $(".prompt").text("请输入正确的手机号！");
                return;
            }

            //判断是否长期保存密码
            if($('.ck').hasClass("active"))
            {
                // localStorage.setItem('phone',$("#tel").val());
                setCookie('user',$("#tel").val(),7);
                setCookie('pswd',$(".passWord").val(),7);
            }
            else {
                localStorage.clear();
                clearCookie('user')
                clearCookie('pswd')
            }
            // if (!(/^1[34578]\d{9}$/.test($("#tel").val()))) {
            //     $(".prompt").text("请输入正确的密码！");
            //     return;
            // }

            $.fn.getData({
                url: "/business/login",
                data: {
                    mobile: $("#tel").val(),
                    password: $("#yzm").val()
                },
                result: function (data) {
                    
                    var status = data.status;
                    if (status == "error") {
                        $(".prompt").text(data.msg);
                    } else if (status == "success") {
                        data = data.data;
                        $.fn.setCookie("admin_id", data.admin_id);
                        window.location.href = "../../views/enter/checkList.html"
                        // if (data.state == 0) {
                        //     window.open("apply.html", "_self");
                        // } else {
                            // var url = "checkList.html?s=" + data.type;
                            // if (data.state == 3) url = "status.html?s=" + data.state + "&t=" + encodeURI(encodeURI(data.reason));
                            // window.open(url, "_self");
                        // }
                    }
                }
            });

        });
        //设置cookie

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + encrypt(escape(cvalue), passKey) + "; " + expires;
        }
            //获取cookie
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';')
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) != -1){
                var cnameValue = unescape(c.substring(name.length, c.length));
                return decrypt(cnameValue, passKey);
                } 
            }
            return "";
        }
        //清除cookie 
        function clearCookie(cname) { 
            setCookie(cname, "", -1); 
        }
    });
});
