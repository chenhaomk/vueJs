/*  
create by: sdf 
create date: 2017-07-12
note:一些自定义属性，方便全局使用
*/
Array.prototype.removeForID = function (list, key) {//通过ID
    for (var i = 0; i < list.length; i++) {
        if (list[i].ID == key)
            list.splice(i, 1);
    }
};
Array.prototype.removeForIndex = function (list, key) {//通过Index
    for (var i = 0; i < list.length; i++) {
        if (list[i].Index == key)
            list.splice(i, 1);
    }
    return list;
};
String.prototype.format = function (args) {//后台语法，替换
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};



(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      var sum = 20 * (clientWidth / 320);
      docEl.style.fontSize = sum + 'px';
    };
  
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);