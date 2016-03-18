/*

使用(function() {}).call(this);包裹代码有什么好处，什么时候应该这样做？

http://segmentfault.com/q/1010000002519489

*/


/*
http://blog.csdn.net/sunlylorn/article/details/6534624

http://blog.csdn.net/sunlylorn/article/details/6534610
*/
// 闭包的另一个重要用途是实现面向对象中的对象，传统的对象语言都提供类的模板机制，
// 这样不同的对象(类的实例)拥有独立的成员及状态，互不干涉。虽然JavaScript中没有类这样的机制，但是通过使用闭包，
// 我们可以模拟出这样的机制。
function Person(){
 	var name = "default";
    return {
       getName : function(){
           return name;
       },
       setName : function(newName){
           name = newName;
       }
    }
};


var john = Person();
alert(john.getName());
john.setName("john");
alert(john.getName());

var jack = Person();
alert(jack.getName());
jack.setName("jack");
alert(jack.getName());

// 运行结果如下：

// default
// john
// default
// jack

// --------------------------------------------------------

// 实现封装
// 可以先来看一个关于封装的例子，在person之外的地方无法访问其内部的变量，而通过提供闭包的形式来访问：

var person = function() {
	//变量作用域为函数内部，外部无法访问
	var name = "default";

	return {
		getName: function() {
			return name;
		},
		setName: function(newName) {
			name = newName;
		}
	}
}();

print(person.name);//直接访问，结果为undefined
print(person.getName());
person.setName("abruzzi");
print(person.getName());

// 得到结果如下：

// undefined
// default
// abruzzi