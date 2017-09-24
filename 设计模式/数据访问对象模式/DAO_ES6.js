
class BaseLocalStorage {
    constructor (preId, timeSign) {
        this.preId = preId;
        this.timeSign = timeSign || '|-|';
        this.status = {
            SUCCESS: 0, // 成功
            FAILUER: 1, // 失败
            OVERFLOW: 2, // 溢出
            TIMEOUT: 3 // 过期
        }
        this.storage = window.localStorage
    }
    // 获取本地存储数据库真实字段
    getKey (key) {
        return this.preId + key;
    }
    /**
     * 添加修改数据
     * @param key 数据字段标识
     * @param value 数据值
     * @param callback 回调函数
     * @param time 添加时间
     */
    set (key, value, callback, time) {
        // 默认操作状态时成功
        let status = this.status.SUCCESS;
        let sKey = this.getKey(key);
        let nTime = null
        try {
            nTime = new Date(time).getTime() || time.getTime();
        } catch (e) {
            // 默认时间一个月
            nTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
        }
        try {
            // 添加数据
            this.storage.setItem(sKey, nTime + this.timeSign + value);
        } catch (e) {
            // 溢出失败，返回溢出状态
            status = this.status.OVERFLOW;
        }
        callback && callback.call(this, status, sKey, value);
    }
    /**
     * 获取数据
     * @param key 数据字段标识
     * @param callback 回调函数
     * @returns {*}
     */
    get (key, callback) {
        let status = this.status.SUCCESS
        let sKey = this.getKey(key)
        let value = null
        let timeSignLen = this.timeSign.length
        let that = this // 缓存当前对象
        let index // 时间戳与存储数据之间的拼接符起始位置
        let time // 时间戳
        let result // 最终获取数据
        try {
            value = that.storage.getItem(sKey);
        } catch (e) {
            // 获取失败则返回失败状态，数据结果为null
            result = {
                status: that.status.FAILUER,
                value: null
            };
            // 执行回调并返回
            callback && callback.callee(this, result.status, result.value);
            return result;
        };
        if (value) {
            index = value.indexOf(that.timeSign);
            time = +value.slice(0, index);
            // 如果时间为过期
            if (new Date(time).getTime() > new Date().getTime() || time === 0) {
                // 获取数据结果（拼接符后面的字符串）
                value = value.slice(index + timeSignLen);
            } else {
                // 过期则结果为null
                value = null;
                // 设置状态为过期状态
                status = that.status.TIMEOUT;
                // 删除该字段
                that.remove(sKey);
            }
        } else {
            // 未获取数据字符串状态为失败状态
            status = that.status.FAILUER;
        }
        // 设置结果
        result = {
            status: status,
            value: value
        }
        callback && callback.call(this, result.status, result.value);
        return result;
    }
    /**
     * 删除数据
     * @param key 数据字段标识
     * @param callback 回调函数
     */
    remove (key, callback) {
        let status = this.status.FAILUER
        let sKey = this.getKey(key)
        let value = null
        try {
            value = this.storage.getItem(sKey)
        } catch (e) {

        }
        // 如果数据存在
        if (value) {
            try {
                this.storage.removeItem(sKey);
                status = this.status.SUCCESS;
            } catch (e) {

            }
        }
        // 如果成功则返回真实的数据结果，否则返回空
        callback && callback.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length));
    }
}
export default BaseLocalStorage

// /**
//  * 本地存储类
//  * @param preId 本地存储数据库前缀
//  * @param timeSign 时间戳与存储数据之间的拼接符
//  * @constructor
//  */
// const BaseLocalStorage = function (preId, timeSign) {
//     this.preId = preId;
//     this.timeSign = timeSign || '|-|';
// }
// BaseLocalStorage.prototype = {
//     // 操作状态
//     status: {
//         SUCCESS: 0, // 成功
//         FAILUER: 1, // 失败
//         OVERFLOW: 2, // 溢出
//         TIMEOUT: 3 // 过期
//     },
//     // 保存本地存储链接
//     storage: window.localStorage,
//     // 获取本地存储数据库真实字段
//     getKey (key) {
//         return this.preId + key;
//     },
//     /**
//      * 添加修改数据
//      * @param key 数据字段标识
//      * @param value 数据值
//      * @param callback 回调函数
//      * @param time 添加时间
//      */
//     set (key, value, callback, time) {
//         // 默认操作状态时成功
//         let status = this.status.SUCCESS;
//         let sKey = this.getKey(key);
//         let nTime = null
//         try {
//             nTime = new Date(time).getTime() || time.getTime();
//         } catch (e) {
//             // 默认时间一个月
//             nTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
//         }
//         try {
//             // 添加数据
//             this.storage.setItem(sKey, nTime + this.timeSign + value);
//         } catch (e) {
//             // 溢出失败，返回溢出状态
//             status = this.status.OVERFLOW;
//         }
//         callback && callback.call(this, status, sKey, value);
//     },
//     /**
//      * 获取数据
//      * @param key 数据字段标识
//      * @param callback 回调函数
//      * @returns {*}
//      */
//     get (key, callback) {
//         let status = this.status.SUCCESS
//         let sKey = this.getKey(key)
//         let value = null
//         let timeSignLen = this.timeSign.length
//         let that = this // 缓存当前对象
//         let index // 时间戳与存储数据之间的拼接符起始位置
//         let time // 时间戳
//         let result // 最终获取数据
//         try {
//             value = that.storage.getItem(sKey);
//         } catch (e) {
//             // 获取失败则返回失败状态，数据结果为null
//             result = {
//                 status: that.status.FAILUER,
//                 value: null
//             };
//             // 执行回调并返回
//             callback && callback.callee(this, result.status, result.value);
//             return result;
//         };
//         if (value) {
//             index = value.indexOf(that.timeSign);
//             time = +value.slice(0, index);
//             // 如果时间为过期
//             if (new Date(time).getTime() > new Date().getTime() || time === 0) {
//                 // 获取数据结果（拼接符后面的字符串）
//                 value = value.slice(index + timeSignLen);
//             } else {
//                 // 过期则结果为null
//                 value = null;
//                 // 设置状态为过期状态
//                 status = that.status.TIMEOUT;
//                 // 删除该字段
//                 that.remove(sKey);
//             }
//         } else {
//             // 未获取数据字符串状态为失败状态
//             status = that.status.FAILUER;
//         }
//         // 设置结果
//         result = {
//             status: status,
//             value: value
//         }
//         callback && callback.call(this, result.status, result.value);
//         return result;
//     },
//     /**
//      * 删除数据
//      * @param key 数据字段标识
//      * @param callback 回调函数
//      */
//     remove (key, callback) {
//         let status = this.status.FAILUER
//         let sKey = this.getKey(key)
//         let value = null
//         try {
//             value = this.storage.getItem(sKey)
//         } catch (e) {
//
//         }
//         // 如果数据存在
//         if (value) {
//             try {
//                 this.storage.removeItem(sKey);
//                 status = this.status.SUCCESS;
//             } catch (e) {
//
//             }
//         }
//         // 如果成功则返回真实的数据结果，否则返回空
//         callback && callback.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length));
//     }
// }
//
// export default BaseLocalStorage