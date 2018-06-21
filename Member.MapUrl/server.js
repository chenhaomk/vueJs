var http = require("http");
var url = require("url");
var querystring = require('querystring');
var mysql = require('mysql');
// var apiUrl="api.yingougou.com";
var apiUrl = "119.23.10.30";

function start() {

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var plen = request.url.replace('/', '').length;
        if (plen != 6)
            return;
        var paramUrl = 'https://s.yingougou.com' + pathname;

        if (pathname.indexOf('.ico') >= 0)
            return;
        // http://192.168.1.126:8888/67ZJfa
        //post
        var contents = JSON.stringify({
            'url': paramUrl
        });
        try {
            var options = {
                host: apiUrl,
                port: 80,
                path: '/v1.2/open/urlParsing',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(contents)
                }
            }

            var req = http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    console.log("data:", data); //一段html代码
                    var data = JSON.parse(data);
                    if (data.status == "error") {
                        response.writeHead(200, {
                            "Content-Type": "text/html;charset=utf-8"
                        });
                        var resInfo=`<p style='text-align:center;font-size:36px;padding-top:40vh;'>${data.msg}</p>`;
                        response.write(resInfo);//data.msg
                        response.end();
                        return;
                    }
                    response.writeHead(301, {
                        'Location': data.data.url
                    });
                    response.end();
                });
            });
            req.write(contents);
            req.end;
        } catch (error) {
            response.writeHead(200, {
                "Content-Type": "text/plain;charset=utf-8"
            });
            response.write("该二维码尚未绑定商家，请确认绑定后重试");
            response.end();
        }
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;