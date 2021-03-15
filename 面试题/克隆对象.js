
// js对象的深度克隆 一：
Object.prototype.clone = function () {
    var o = this.constructor === Array ? [] : {};
    for (var e in this) {
        o[e] = typeof this[e] === "object" ? this[e].clone() : this[e];
    }
    return o;
}

// js对象的深度克隆 二：

function clone(Obj) {
    var buf;
    if (Obj instanceof Array) {
        buf = []; //创建一个空的数组
        var i = Obj.length;
        while (i--) {
            buf[i] = clone(Obj[i]);
        }
        return buf;

    } else if (Obj instanceof Object) {
        buf = {}; //创建一个空对象
        for (var k in Obj) { //为这个对象添加新的属性
            buf[k] = clone(Obj[k]);
        }
        return buf;

    } else {
        return Obj;
    }
}

function deepClone(obj) {
    let result;
    if (typeof obj === 'object') {
        result = obj.constructor === Array ? [] : {};
        // result = obj instaceof Function ? [] : {};
        for(let i in obj) {
            result[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
        }
    } else {
        result = obj;
    }
    return result
}