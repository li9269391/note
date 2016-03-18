//http://www.cnblogs.com/wangfupeng1988/p/3977924.html （上下文）
//王福明的博客

//-------------------------------------
//要到创建这个函数的那个作用域中取值——是“创建”，而不是“调用”。就是所谓的“静态作用域”。
var x = 10;

function fn() {
	console.log(x);		//10
}

function show(f) {
	var x = 20;

	(function () {
		f();
	})()
}

show(fn );

//-------------------------------------

var max = 10;
function fn(x) {
	if (x > max) {
	 	console.log(max)		//10
	}
}

(function (f) {
	var max = 100;
	f(15);
})(fn)

//---------------------------------------

var a = 10;
var b = 200;
function fn() {
	var b = 20;
	function bar() {
		console.log(a + b);		//30
	}
	return bar;
}

var f1 = fn();
f1();

//---------------------------------------
var max = 20;
function fn() {
	var max = 10;
	return function bar(x) {
		if (x > max) {
			console.log(x);		//15
		}
	}
}
var f1 = fn();
f1(15);

//---------------------------------------

var max = 20;
function fn() {
	var max = 10;
	this.min = 30;
	console.log(this.min);		//30
	console.log(this);			//window
	console.log(this.max);		//20
	return function () {
		console.log(max);		//10
		console.log(this.max);	//20
	}
}
var f1 = fn();
f1();

//---------------------------------------
//new创建对象，this指向new出来的对象，而不是window
var max = 20;
function fn() {
	var max = 10;
	console.log(this.max);		//undefined，而不是20
	return function () {
		console.log(this.max);	//20
	}
}
var f1 = new fn();
f1();

//---------------------------------------
var x = 20;
var obj = {
    x : 10,
    fn : function () {
    	var _this = this;
        function f() {
            console.log(this);      //Window
            console.log(this.x);    //20,如果没有定义全局var x=20, 即undfined
            console.log(_this.x);   //10
        }
        f();
    }
};
obj.fn();

//---------------------------------------

//上下文对象在事件侦听器中this指的就是发生事件的对象
document.body.addEventListener('click',function(){
	alert(this===document.body); // true
},false);