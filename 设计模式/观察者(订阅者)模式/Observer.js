// 将观察者放在闭包中，当页面加载就立即执行
var Observer = (function(){
	// 防止消息队列暴漏而被篡改故将消息容器作为静态私有变量保存
	var __messages = {};
	return {
		// 注册信息接口
		regist : function (type, fn){
			// 如果些消息不存在则应该创建一个该消息类型
			if(typeof __messages[type] === 'undefined'){
				__messages[type] = [fn];
			} else {
				// 将动作推入到消息对应的动作执行队列中
				__messages[type].push(fn);
			}
		},
		// 发布信息接口
		fire : function(type, args){
			// 如果消息没有被注册，则返回
			if(!__messages[type]){
				return;
			}
			// 定义消息信息
			var events = {
				type : type,
				args : args || {}
			},
			i = 0,
			len = __messages[type].length;
			// 遍历消息动作
			for(; i < len; i++){
				// 依次执行注册的消息对应的动作序列
				__messages[type][i].call(this, events);
			}
		},
		// 移除信息接口
		remove : function(type, fn){
			// 如果消息动作队列存在
			if(__messages[type] instanceof Array){
				// 从最后一个消息动作遍历
				var i = __messages[type].length - 1;
				for(; i >= 0; i--)  {
					// 如果存在该动作则在消息动作序列中移除相应动作
					__messages[type][i] === fn && __messages[type].splice(i, 1);
				}
			}
		}
	}
})()