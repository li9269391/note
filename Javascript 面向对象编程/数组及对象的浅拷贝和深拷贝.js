//拷贝普通对象，如var a = {}  或  b = []; 这种
//不是构造函数，无法使用构造函数方法实现"继承"。
//参考文章：http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance_continued.html

//拷贝继承-浅拷贝
function extendCopy(p) {
	var c = {};
	for (var i in p) {
		c[i] = p[i];
	}
	c.uber = p;
	return c;
}
//但是，这样的拷贝有一个问题。那就是，如果父对象的属性等于数组或另一个对象，
//那么实际上，子对象获得的只是一个内存地址，而不是真正拷贝，因此存在父对象被篡改的可能。

//拷贝继承-深拷贝
//所谓"深拷贝"，就是能够实现真正意义上的数组和对象的拷贝。它的实现并不难，只要递归调用"浅拷贝"就行了。
function deepCopy(p, c) {
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
}


//第二种方法：
//还可以通过JSON拷贝，IE7以下需要加载json2.js才兼容
function extendCopy(p) {
	var str = JSON.stringify(p);
	c = JSON.parse(str);
	return c;
}