var url = require('url');

function route(request, response, handler) {
    var pathname = url.parse(request.url).pathname;
    if (typeof handler[pathname] === 'function') {
        // 把 response 放在第一个参数方便使用，因为 request 可能用不上
        handler[pathname](response, request)
    } else {
        response.writeHead(404, {
            "Content-Type": "text/html"
        });
        response.write('404，页面不存在！');
        response.end()
    }
}
exports.route = route;