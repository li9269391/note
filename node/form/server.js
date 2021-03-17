// 创建服务

var http = require('http');
var port = 5100;

// module.exports
exports.start = function (route, handler) {
    var onRequest = (request, response) => {
        // 路由
        route(request, response, handler);
    };
    http.createServer(onRequest).listen(port);
    console.log(`服务已启动，访问 http://127.0.0.1:${port}`);
}