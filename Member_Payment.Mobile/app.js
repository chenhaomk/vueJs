/*  
create by: sdf 
create date: 2017-07-12
note:手机端所需js文件在此处进行加载
*/
// (function () {
//     loadScript("/js_framework/axios.min.js", function () {
//         // loadScript("/js_framework/mode-ecb.js", function () {
//         //     //参考axios.js
//         //     //添加一个请求拦截器
//         //     // 指定允许其他域名访问  
//         //     axios.interceptors.request.use(function (config) {
//         //         //在请求发出之前进行一些操作
//         //         return config;
//         //     }, function (err) {
//         //         //Do something with request error
//         //         return Promise.reject(err);
//         //     });
//         //     //添加一个响应拦截器
//         //     axios.interceptors.response.use(function (res) {
//         //         //在这里对返回的数据进行处理
//         //         debugger;
//         //         return res;
//         //     }, function (err) {
//         //         //Do something with response error
//         //         return Promise.reject(err);
//         //     });

//         // });

//         // axios.interceptors.request.use(function (config) {
//         //     //在请求发出之前进行一些操作
//         //     return config;
//         // }, function (err) {
//         //     //Do something with request error
//         //     return Promise.reject(err);
//         // });
//         // //添加一个响应拦截器
//         // axios.interceptors.response.use(function (res) {
//         //     //在这里对返回的数据进行处理
//         //     debugger;
//         //     return res;
//         // }, function (err) {
//         //     //Do something with response error
//         //     return Promise.reject(err);
//         // });

//     });


// }());

// function loadScript(url, callback) {
//     var script = document.createElement('script');
//     script.async = 'async';
//     script.src = url;
//     document.body.appendChild(script);
//     if (script.readyState) {   //IE
//         script.onreadystatechange = function () {
//             if (script.readyState == 'complete' || script.readyState == 'loaded') {
//                 script.onreadystatechange = null;
//                 callback();
//             }
//         }
//     } else {    //非IE
//         script.onload = function () { callback(); }
//     }
// }

