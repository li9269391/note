var server = require('./server');
var router = require('./router');
var controller = require('./requestHandlers').controller;

var handler = {
    '/': controller.index,
    '/index': controller.index,
    '/upload': controller.upload,
    '/showImage': controller.showImage
};

server.start(router.route, handler);
