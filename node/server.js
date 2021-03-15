// TCP 通信之 Server 端

var net = require('net');
var port = 8000;
var server = net.createServer((socket) => {
    // console.log('someone connects')
    // 获取地址信息
    var address = server.address();
    var message = `地址信息：${JSON.stringify(address)}`;

    // 向客户端发送数据
    socket.write(message, () => {
        var writeSize = socket.bytesWritten;
        console.log(`向客户端发送数据：${message}，数据大小：${writeSize}`);
    })

    // 监听客户端传来的 data 数据
    socket.on('data', data => {
        var readSize = socket.bytesRead;
        console.log(`来自客户端数据：${data.toString()}，数据大小：${readSize}`)
    })
})

server.listen(port, () => {
    console.log(`Creat server on http://127.0.0.1:${port}`)
})