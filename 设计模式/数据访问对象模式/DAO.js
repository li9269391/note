/***
 * 本地存储类
 * 参数 preId		本地存储数据库前缀
 * 参数 timeSign		时间戳与存储数据之间的拼接符
 * 
 ***/
var BaseLocalStorage = function (preId, timeSign){
	this.preId = preId;
	this.timeSign = timeSign || '|-|';
}
BaseLocalStorage.prototype = {
	// 操作状态
	status : {
		SUCCESS : 0,	// 成功
		FAILUER : 1,	// 失败
		OVERFLOW : 2,	// 溢出
		TIMEOUT : 3		// 过期
	},
	// 保存本地存储链接
	storage : localStorage || window.localStorage,
	// 获取本地存储数据库真实字段
	getKey : function (key){
		return this.preId + key;
	},
	/***
	 * 添加修改数据
	 * 参数 key		: 数据字段标识
	 * 参数 value	: 数据值
	 * 参数 callback	: 回调函数
	 * 参数 time		: 添加时间
	 ***/
	set : function (key, value, callback, time){
		// 默认操作状态时成功
		var status = this.status.SUCCESS,
			key = this.getKey(key);
		try{
			time = new Date(time).getTime() || time.getTime();
		}catch(e){
			// 默认时间一个月
			time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
		}
		try{
			// 添加数据
			this.storage.setItem(key, time + this.timeSign + value);
		}catch(e){
			// 溢出失败，返回溢出状态
			status = this.status.OVERFLOW;
		}
		callback && callback.call(this, status, key, value);
	},
	/***
	 * 获取数据
	 * 参数 key		: 数据字段标识
	 * 参数 callback	: 回调函数
	 ***/
	get : function (key, callback){
		var status = this.status.SUCCESS,
			key = this.getKey(key),
			value = null,
			timeSignLen = this.timeSign.length,
			that = this,	// 缓存当前对象
			index,			// 时间戳与存储数据之间的拼接符起始位置
			time,			// 时间戳
			result;			// 最终获取数据
		try{
			value = that.storage.getItem(key);
		}catch(e){
			// 获取失败则返回失败状态，数据结果为null
			result = {
				status : that.status.FAILUER,
				value : null
			};
			// 执行回调并返回
			callback && callback.call(this, result.status, result.value);
			return result;
		};
		if (value) {
			index = value.indexOf(that.timeSign);
			time = +value.slice(0, index);
			// 如果时间为过期
			if ( new Date(time).getTime() > new Date().getTime() || time == 0 ) {
				// 获取数据结果（拼接符后面的字符串）
				value = value.slice(index + timeSignLen);
			} else{
				// 过期则结果为null
				value = null;
				// 设置状态为过期状态
				status = that.status.TIMEOUT;
				// 删除该字段
				that.remove(key);
			}
		} else{
			// 未获取数据字符串状态为失败状态
			status = that.status.FAILUER;
		}
		// 设置结果
		result = {
			status : status,
			value : value
		}
		callback && callback.call(this, result.status, result.value);
		return result;
	},
	/***
	 * 删除数据
	 * 参数 key		: 数据字段标识
	 * 参数 callback	: 回调函数
	 ***/
	remove : function (key, callback){
		var status = this.status.FAILUER,
			key = this.getKey(key),
			value = null;
		try{
			value = this.storage.getItem(key)
		}catch(e){}
		// 如果数据存在
		if(value){
			try{
				this.storage.removeItem(key);
				status = this.status.SUCCESS;
			}catch(e){}
		}
		// 如果成功则返回真实的数据结果，否则返回空
		callback && callback.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length));
	}
}


// const LS = new BaseLocalStorage('LS__');
// set 默认时间一个月
// LS.set('a', 'xiao ming', function (status, key, value) {
//     console.log(arguments)
// }, new Date().getTime() + 1000 * 60 * 60 * 24); // [0, "LS__a", "xiao ming"]
// LS.get('a', function(){console.log(arguments)});    // [0, "xiao ming"]
// LS.remove('a', function(){console.log(arguments)}); // [0, "xiao ming"]
// LS.remove('a', function(){console.log(arguments)}); // [1, null]
// LS.get('a', function(){console.log(arguments)});    // [1, null]