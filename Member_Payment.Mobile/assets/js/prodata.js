/*  
create by: sdf 
create date: 2017-07-12
note:属性定义
*/

var errorCode = {
    "0": "正常",
    "-1": "通讯异常",
    "-2":"token失效" ,
    "-3":"验证失效"
};



// Array.prototype.removeForID = function (list, key) {//通过ID
//     for (var i = 0; i < list.length; i++) {
//         if (list[i].ID == key)
//             list.splice(i, 1);
//     }
// };
// Array.prototype.removeForIndex = function (list, key) {//通过Index
//     for (var i = 0; i < list.length; i++) {
//         if (list[i].Index == key)
//             list.splice(i, 1);
//     }
//     return list;
// };
// String.prototype.format = function (args) {//后台语法，替换
//     var result = this;
//     if (arguments.length > 0) {
//         if (arguments.length == 1 && typeof (args) == "object") {
//             for (var key in args) {
//                 if (args[key] != undefined) {
//                     var reg = new RegExp("({" + key + "})", "g");
//                     result = result.replace(reg, args[key]);
//                 }
//             }
//         }
//         else {
//             for (var i = 0; i < arguments.length; i++) {
//                 if (arguments[i] != undefined) {
//                     var reg = new RegExp("({)" + i + "(})", "g");
//                     result = result.replace(reg, arguments[i]);
//                 }
//             }
//         }
//     }
//     return result;
// };



// (function (doc, win) {
//   var docEl = doc.documentElement,
//     resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//     recalc = function () {
//       var clientWidth = docEl.clientWidth;
//       if (!clientWidth) return;
//       var sum = 20 * (clientWidth / 320);
//       docEl.style.fontSize = sum + 'px';
//     };

//   if (!doc.addEventListener) return;
//   win.addEventListener(resizeEvt, recalc, false);
//   doc.addEventListener('DOMContentLoaded', recalc, false);
// })(document, window);