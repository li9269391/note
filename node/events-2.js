var events = require('events')
var eventEmitter = new events.EventEmitter; // events.EventEmitter()，这种场景创建对象时带括号和不带括号没有区别
eventEmitter.once('newListener', (event, listener) => {
    console.log(`newListener 的 event 事件为 ${event}`);
    eventEmitter.on('start', () => {
        console.log('eventEmitter start2') // 优先
    })
})
eventEmitter.on('start', () => {
    console.log('eventEmitter start')
})
eventEmitter.emit('start')