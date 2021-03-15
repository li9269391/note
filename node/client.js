// TCP 通信之 Client 端

var net = require('net');
var client = net.Socket();
var host = '127.0.0.1';
var port = 8000
client.connect(port, host, () => {
    console.log('连接服务器成功！');
    client.write('你好服务器！');
})
// 监听服务器传来的数据
client.on('data', (data) => {
    console.log(`服务器传来的数据: ${data.toString()}`);
})
// 监听 end 事件
client.on('end', () => {
    console.log('服务已断开！')
})