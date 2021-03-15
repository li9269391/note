var events = require('events');
var eventEmitter = new events.EventEmitter(); // events 模块只提供一个对象 events.EventEmitter
eventEmitter.on('some_event', (...arg) => {
    console.log('some_event1 事件触发！', arg)
})
eventEmitter.on('some_event', () => {
    console.log('some_event2 事件触发！')
})
setTimeout(() => {
    eventEmitter.emit('some_event', 'arg1 参数', 'arg2 参数')
}, 1000)

eventEmitter.on('start', () => {
    console.log('eventEmitter start')
})
// 触发多次
eventEmitter.emit('start');
eventEmitter.emit('start');

eventEmitter.once('do', () => {
    console.log('eventEmitter do！')
})
// 只触发一次
eventEmitter.emit('do');
eventEmitter.emit('do');

// EventEmitter 实例错误，Node.js 会把它当作异常，为了防止 node.js 程序崩溃，建议始终注册监听 error 事件
eventEmitter.on('error', (error) => {
    console.log(error)
})

