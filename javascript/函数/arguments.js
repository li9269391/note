//arguments 对象

/*它不从 Array.prototype 继承，实际上它是一个对象（Object）。
因此，无法对 arguments 变量使用标准的数组方法，比如 push, pop 或者 slice。
虽然使用 for 循环遍历也是可以的，但是为了更好的使用数组方法，最好把它转化为一个真正的数组。

转化为数组

下面的代码将会创建一个新的数组，包含所有 arguments 对象中的元素。
Array.prototype.slice.call(arguments);
这个转化比较慢，在性能不好的代码中不推荐这种做法。

传递参数
下面是将参数从一个函数传递到另一个函数的推荐做法。*/

function foo() {
    bar.apply(null, arguments);
}
function bar(a, b, c) {
    // 干活
}
// 另一个技巧是同时使用 call 和 apply，创建一个快速的解绑定包装器。

function Foo() {}

Foo.prototype.method = function(a, b, c) {
    console.log(this, a, b, c);
};

// 创建一个解绑定的 "method"
// 输入参数为: this, arg1, arg2...argN
Foo.method = function() {

    // 结果: Foo.prototype.method.call(this, arg1, arg2... argN)
    Function.call.apply(Foo.prototype.method, arguments);
};
//译者注：上面的 Foo.method 函数和下面代码的效果是一样的:

Foo.method = function() {
    var args = Array.prototype.slice.call(arguments);
    Foo.prototype.method.apply(args[0], args.slice(1));
};