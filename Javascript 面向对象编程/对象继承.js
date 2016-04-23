// 两种不推荐的1
// instance1的一个无意修改，就会影响到instance2，容易埋藏陷阱
// 由于子类实现的继承是靠其原型prototype对父类的实例化实现的，在创建父类的时候，是无法向父类传递参数进行初始化
function SuperClass(){
	this.books = ['a',"b","c"];
}
function SubClass(){}
SubClass.prototype = new SuperClass();
var instance1 = new SubClass();
var instance2 = new SubClass();
instance1.books.push("d");
console.log(instance2.books);	// ["a","b","c","d"]

// 两种不推荐的2
//这样做的优点是效率比较高（不用执行和建立Animal的实例了）
//，比较省内存。缺点是 Cat.prototype和Animal.prototype现在指向
//了同一个对象，那么任何对Cat.prototype的修改，都会反映到Animal.prototype。
function Animal(){ }
Animal.prototype.species = "动物";
function Cat(){}
Cat.prototype = Animal.prototype;
Cat.prototype.constructor = Cat;
var cat1 = new Cat();
alert(cat1.species); // 动物
Cat.prototype.constructor = Cat;
//这一句实际上把Animal.prototype对象的constructor属性也改掉了！
alert(Animal.prototype.constructor); // Cat


//2组合继承，也叫做伪经典继承（将原型链和借用构造函数继承的组合到一块）（最常用）
//组合继承是Javascript最常用的继承模式；不过，它也有自己的不足。组合继承最大的问题是无论什么情况下，
//都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。
function SuperType(name) {
	this.name = name;
	this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
	alert(this.name);
}
function SubType(name, age) {
	//继承属性
	SuperType.call(this, name);
	this.age = age;
}
SubType.prototype = new SuperType();
SubType.constructor = SubType;	//修正指向问题

SubType.prototype.sayAge = function () {
	alert(this.age);
}

var instance1 = new SubType("yooly", "25");
var instance2 = new SubType("cici", "24");
instance1.colors.push("black");
alert(instance1.colors);		//"red,blue,green,black"
alert(instance2.colors);		//"red,blue,green"
instance2.sayName();		//"cici"
instance2.sayAge();		//24


//3 寄生式继承+原型继承（最优）
//解决直接继承prototype模式的缺点
//F是空对象，所以几乎不占内存。
//这时，修改Cat的prototype对象，就不会影响到Animal的prototype对象。
//YUI的YAHOO.lang.extend()方法采用了寄生组合继承，从而让这种模式首次出现在了一个应用非常广泛的Javascript库中

function SuperType(name) {
	this.name = name;
	this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
	alert(this.name);
}
function SubType(name, age) {
	SuperType.call(this, name);
	this.age = age;
}
extend(SubType, SuperType);	//调用封装好的继承函数
// 扩展方法必须在继承函数后面
SubType.prototype.sayAge = function () {
	alert(this.age);
}
function extend(Child, Parent) {
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
}

var instance1 = new SubType("Nicholas", 29);
var instance2 = new SubType("Greg", 27);
instance1.colors.push("black");
alert(instance1.colors);  //"red,blue,green,black"
alert(instance2.colors);  //"red,blue,green"
instance2.sayName();      //"Greg"
instance2.sayAge();       //27

// 寄生式继承
// 其实是对原型继承的第二次封装
// 像寄生虫一样寄托于某个对象内部生长
function inheritObject(o){
	function F(){ };
	F.prototype = o;
	return F();
}
var book = {
	name : "jsBook",
	alikeBook : ["cssBook", "htmlBook"]
};
function createBook(obj){
	var o = new inheritObject(obj);
	// 拓展新对象
	o.getName = function(){
		console.log(name);
	};
	// 返回拓展后的新对象
	return o;
}

// 再看看extend是如何组合出来的object + inheritObject
function object(o){
	function F(){ };
	F.prototype = o;
	return F();
}
function inheritObject(Child, Parent){
	var prototype = object(Parent.prototype);
	Child.prototype.constructor = Child;
	Child.prototype = prototype;
}
function extend(Child, Parent) {
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
}




//-------------非构造函数的继承 -------------//
//继承方法4 -- 拷贝
function extendCopy(c, p) {
	for (var attr in p) {
		c[attr] = p[attr];
	}
}

extendCopy(SubType.prototype, SuperType.prototype);

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

// 最后一个多继承
// 为了方便可以直接绑定到原生对象
Object.prototype.mix = function(){
	var i = 0,
		len = arguments.length,
		arg;

	for (; i < len; i++) {
		// 缓存当前对象
		arg = arguments[i];
		for (var property in arg) {
			// 将继承对象中的属性复制到目标对象中
			this[property] = arg[property];
		};
	}
}
var book1 = {
	name : 'A',
	alike : ["a", "b"]
}
var book2 = {
	name : 'B',
	alike : ["c", "d"]
}
var anotherBook = {
	color : 'blue'
}
anotherBook.mix(book1, book2);
console.log(anotherBook);	//alike:["c", "d"],color:"blue",name:"B"

// 还有一种多对象(浅复制)
function prototypeExtend(){
	var F = function(){},
		args = arguments,
		i = 0,
		len = args.length;
	for (; i < len; i++) {
		for (var j in args[i]) {
			F.prototype[j] = args[i][j];
		}
	}
	return new F();
}
// 测试用例
var penguin = prototypeExtend({
	speed : 20,
	swim : function(){
		console.log('游泳速度 ' + this.speed);
	}
},{
	run : function(){
		console.log('奔跑速度 ' + speed);
	}
},{
	jump : function(){
		console.log('跳跃动作');
	}
})
// 通过prototypeExtend创建的是一个对象，无需再用new去创建新的实例对象
penguin.swim();		// 游泳速度 20
penguin.run(10);	// 奔跑速度 10
penguin.jump();		// 跳跃动作



//---------------- 扩展 ----------------------//


//为了解决"构造函数法"的缺点，更方便地生成对象，
//Javascript的国际标准ECMAScript第五版（目前通行的是第三版），提出了一个新的方法Object.create()。
//直接用Object.create()生成实例，不需要用到new。
//目前，各大浏览器的最新版本（包括IE9）都部署了这个方法。如果遇到老式浏览器，可以用下面的代码自行部署。
if (!Object.create) {
	Object.create = function (o){
		function F() {
		}

		F.prototype = o;
		return new F()
	}
}
//这种方法比"构造函数法"简单，但是不能实现私有属性和私有方法，实例对象之间也不能共享数据，对"类"的模拟不够全面

//极简主义法
//荷兰程序员Gabor de Mooij提出了一种比Object.create()更好的新方法，
//他称这种方法为"极简主义法"（minimalist approach）。这也是我推荐的方法。
var Cat = {
	createNew: function () {
		var cat = {};
		cat.name = "大毛";
		cat.makeSound = function () {
			alert("喵喵喵");
		};
		return cat;
	}
};

//继承
var Animal = {
	createNew: function() {
		var animal = {};
		animal.sleep = function() {
			alert("睡懒觉");
		};
		return animal;
	}
};
var Cat = {
	createNew: function(){
		var cat = Animal.createNew();//
		cat.name = "大毛";
		cat.makeSound = function(){ alert("喵喵喵"); };
		return cat;
	}
}
//在Cat的createNew()方法中，调用Animal的createNew()方法。
//这样得到的Cat实例，就会同时继承Cat类和Animal类。

//在createNew()方法中，只要不是定义在cat对象上的方法和属性，都是私有的。
var Cat = {
	createNew: function(){
		var cat = {};
		var sound = "喵喵喵";
		cat.makeSound = function(){ alert(sound); };
		return cat;
	}
};

//有时候，我们需要所有实例对象，能够读写同一项内部数据。
//这个时候，只要把这个内部数据，封装在类对象的里面、createNew()方法的外面即可。

var Cat = {
	sound : "喵喵喵",
	createNew: function(){
		var cat = {};
		cat.makeSound = function(){ alert(Cat.sound); };
		cat.changeSound = function(x){ Cat.sound = x; };
		return cat;
	}
};

var cat1 = Cat.createNew();
var cat2 = Cat.createNew();

cat1.makeSound(); // 喵喵喵
cat2.changeSound("啦啦啦");
cat1.makeSound(); // 啦啦啦




//学习Ferris的方法-----------

function SuperType() {
	this.initialize.apply(this, arguments)
}

SuperType.prototype = {
	//初始化
	initialize : function (name) {
		this.name = name;
		this.colors = ["red", "blue", "green"];
	},
	sayName : function () {
		alert(this.name);
	}
}

function SubType(name, age) {
	//继承属性
	SuperType.call(this, name);

	this.age = age;
}

//继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function () {
	alert(this.age);
}

var instance1 = new SubType("yooly", "25");
instance1.colors.push("black");
alert(instance1.colors);		//"red,blue,green,black"
instance1.sayName();		//"yooly"
instance1.sayAge();		//25

var instance2 = new SubType("cici", "24");
alert(instance2.colors);		//"red,blue,green"
instance2.sayName();		//"cici"
instance2.sayAge();		//24