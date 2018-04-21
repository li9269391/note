// 对象默认值解构
function move1({x=0, y=0} = {}) {
    trace(x + " " + y + "\n");
}

function move2({x, y} = { x: 0, y: 0 }) {
    trace(x + " " + y + "\n");
}

move1({x: 3, y: 8}); // 3 8
move1({x: 3}); // 3 0
move1({}); //0 0
move1(); //0 0
move1({z:3})//0 0

trace("\n");

move2({x: 3, y: 8}); //3 8
move2({x: 3}); //3 undefined
move2({}); //undefined undefined
move2(); //0 0
move2({z:3})//undefined undefined

/*通过结果可以看出，采用{x=0,y=0} =  {}的形式，无论怎么传参，都能保证x，y的默认值是0，
但是采用{x,y} = {x:0,y:0}的形式，如果传入的参数值不是undefined，那么将不能有效保证函数参数默认值是0，
这里需要仔细区分两者的不同。*/

function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
    console.log(method);
}
fetch('//api.example.cn', {
    method: 'POST'
})

function foo(x = 5, y = 6) {
    console.log(x, y);
}
foo(undefined, null)
// 5 null

////////数组解构

function f3([ x, y, ...z], ...w) {
    trace( x + y + z + w );
}
f3( [] ); // undefined undefined [] []
f3( [1,2,3,4], 5, 6 ); // 1 2 [3,4] [5,6]

function f([ x=2, y=3, z ]) {
    trace(x + " " +y + " " + z + "\n");
}

//f();//# Exception: f: cannot coerce undefined to object!
f([1]);//1 3 undefined
f([1,2]);//1 2 undefined
f([1,2,3]);//1 2 3
f([1,2,3,4]);//1 2 3

// 数组参数解构也可以有默认值，但是如果传入undefined的话，将会报异常，因为undefined不能转换成iterator：
function f([ x=2, y=3, z ]) {
    trace(x + " " +y + " " + z + "\n");
}

//f();//# Exception: f: cannot coerce undefined to object!
f([1]);//1 3 undefined
f([1,2]);//1 2 undefined
f([1,2,3]);//1 2 3
f([1,2,3,4]);//1 2 3
