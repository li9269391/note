// JavaScript 异步进化史:   https://segmentfault.com/a/1190000006138882#articleHeader3
// async 函数的含义和用法  http://www.ruanyifeng.com/blog/2015/05/async.html



// 由于异步函数采用类同步的书写方法，所以在处理多个并发请求，新手可能会像下面一样书写。这样会导致url2的请求必需等到url1的请求回来后才会发送。

var fetch = function (url) {
    return new Promise(function (resolve,reject) {
        ajax(url,resolve,reject);
    });
}

async function main(){
    try{
        var value1 = await fetch('url1');
        var value2 = await fetch('url2');
        conosle.log(value1,value2);
    }catch(err){
        console.error(err)
    }
}

// 使用Promise.all的方法来解决这个问题。Promise.all用于将多个Promise实例，包装成一个新的 Promis e实例，当所有的 Promise 成功后才会触发Promise.all的resolve函数，当有一个失败，则立即调用Promise.all的reject函数。

var fetch = function (url) {
    return new Promise(function (resolve,reject) {
        ajax(url,resolve,reject);
    });
}

async function main(){
    try{
        var arrValue = await Promise.all[fetch('url1'),fetch('url2')];
        conosle.log(arrValue[0],arrValue[1]);
    }catch(err){
        console.error(err)
    }
}

main();