//组合使用构造函数模式和原型模式创建对象
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job
	this.friends = ["Shelby", "Court"];
}

Person.prototype = {
	constructor : Person,
	sayName : function () {
		alert(this.name);
	}
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 29, "Doctor");

person1.friends.push("Van");

alert(person1.friends);		//"Shelby,Court,Van"
alert(person2.friends);		//"Shelby,Court"
alert(person1.friends === person2.friends);		//false
alert(person1.sayName === person2.sayName);		//true


//动态模式模式创建对象
function Person(name, age, job) {
	//属性
	this.name = name;
	this.age = age;
	this.job = job;

	//方法
	if (typeof this.sayName != "function" ) {
		Person.prototype.sayName = function () {
			alert(this.name);
		}
	}
}
var person = new Person("Nicholas", "29" "software Engineer");
person.sayName();		//Nicholas


//寄生构造函数模式创建对象
//寄生构造函数模式可以在特殊的情况下用来为对象创建构造函数。
function Person(name, age, job) {
	var o = new object();
	o.name = name;
	o.age = age;
	o.job = job;
	o.sayName = function () {
		alert(this.name);
	}
	return o;
}

//例子：
//假设我们想创建一个具有额外方法的特殊数组。由于不能直接修改Array构造函数，因此可以使用这个模式：
function SpecialArray() {
	//创建数组
	var values = new Array();
	//添加值
	values.push.apply(values, arguments);
	//添加方法
	values.toPipedString = function () {
		return this.join("|");
	}
	//返回数组
	return values;
}

var colors = new SpecialArray("red", "blue", "green");
alert(colors.toPipedString());		//"red|blue|green"
