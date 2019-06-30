# ServiceWorker 入门
Service Worker（下文将 Service Worker 简称为 sw），通过库 workerBox 使用，快速入门

# Service Worker 是什么

SW 是独立于当前页面的一段运行在浏览器后台进程里的脚本。可以拦截处理页面的网络请求（fetch），可以访问 cache 和 IndexDB。
换言之 sw 可以让开发者自己控制管理缓存的内容以及版本，为离线弱网环境下的 web 的运行提供了可能， 是 PWA（Progressive Web App）中最重要的一部分。
# workerBox 是什么
sw 和 workerBox 的关系就好比 javascript 和 jQuery；我们可以先了解一下 workbox：

不管你的站点是何种方式构建的，都可以为你的站点提供离线访问能力。
就算你不考虑离线能力，也能让你的站点访问速度更加快。
几乎不用考虑太多的具体实现，只用做一些配置。
当你知道 sw 是什么之后，我会用 workerBox 来演示，实现缓存静态资源，当然它的能力远不止这一点，如果你被这些特性吸引住了，可以往下看看

# 用法
前面说过 sw 是运行在浏览器后台的脚本，那么就需要引用（注册）

## 一、注册 sw
当浏览器对 sw 提供原生支持时，我们便可以在页面加载后注册指定的 JavaScript 文件，并运行在后台线程之中，以下代码是这一过程的实例。


```html
<!DOCTYPE html>
<html>
<head>
  <title>ServiceWorker</title>
</head>
<body>
  <h1>Hello World!</h1>
  <script>
    // 检查浏览器是否对 sw 有原生支持
    if ('serviceWorker' in navigator) {
      // 有原生支持时，在页面加载后开启新的 sw 线程，从而优化首屏加载速度
      window.addEventListener('load', function() {
        // register 方法里第一个参数为 sw 要加载的文件；第二个参数 scope 可选，用来指定 sw 控制的内容的子目录
        navigator.serviceWorker.register('./service-worker.js')
      });
    }
  </script>
</body>
</html>
```
可以访问 `chrome://inspect/#service-workers` 和 `chrome://serviceworker-internals/ 来检查 Service Worker` 是否已经启用。



## 二、service-worker.js （安装、激活、监听）

浏览器的一些错误捕捉
```javascript
self.addEventListener('error', function(e) {
    self.clients.matchAll()
        .then(function (clients) {
            if (clients && clients.length) {
                clients[0].postMessage({
                    type: 'ERROR',
                    msg: e.message || null,
                    stack: e.error ? e.error.stack : null
                });
            }
        });
});
```

```javascript
self.addEventListener('unhandledrejection', function(e) {
    self.clients.matchAll()
        .then(function (clients) {
            if (clients && clients.length) {
                clients[0].postMessage({
                    type: 'REJECTION',
                    msg: e.reason ? e.reason.message : null,
                    stack: e.reason ? e.reason.stack : null
                });
            }
        });
})
```

首先引入 workbox 框架，可以放到自己的 cdn 下
```javascript
importScripts("https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js");
workbox.setConfig({
    // 默认情况下，localhost 站点，orkbox-sw 将使用调试版本，但对于任何其他源，它将使用生产版本
    // 如果要强制调试或生产版本，请设置 debug config 选项。
    debug: true,
    // 告诉 workbox-sw 在哪里找到依赖模块文件，如上面说的调试版本
    modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
});
```

根据自己的需求，定制缓存策略
```javascript
workbox.precaching.precacheAndRoute(
    [
        // 注册成功后要立即缓存的资源列表，这些资源一般不存在“异步”的加载
        // 这里相当于，初始化的时候就有了第一个 router.registerRoute()，之后的就需要手动注册了
        'https://test.cn/app.css?v=1.0',
        // 这里需要注意的是这个 revision 的值，当预缓存的文件就任何变动的时候就会被更新，
        // 如果 revision 没有更新，那当你更新 Service Worker 的时候，被缓存的文件也不会被更新。
        {
            url: '/index.html',
            revision: '1551161943'
        },
        {
            url: '/test-key.html?key2=2',
            revision: '6821e07'
        }
    ],
    {
        // 通常当用户访问 / 时，对应的访问的页面 HTML 文件是 /index.html，默认情况下，precache 路由机制会在任何 URL 的结尾的 / 后加上 index.html，这就以为着你预缓存的任何 index.html 都可以通过 /index.html 或者 / 访问到。
        // 当然，你也可以通过 directoryIndex 参数禁用掉这个默认行为：
        directoryIndex: null,
        // 忽略请求参数
        // 这样 ./test-key.html?key1=1&key2=2 这个路由对应的内容就可以被预缓存了
        ignoreUrlParametersMatching: [/key1/],
    }
);
```

从缓存取，同时请求网络，更新缓存，适合不同源 CDN
```javascript
workbox.routing.registerRoute(
    new RegExp('https://test.cn/static/.*\.(?:js|css)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'static',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20
            })
        ]
    })
);
```

有缓存后不再请求
```javascript
workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    // new RegExp('https://img.test.cn/static/.*\.(?:png|gif|jpg|jpeg|svg)'),
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20, // 最大的缓存数，超过之后则走 LRU 策略清除最老最少使用缓存
                maxAgeSeconds: 12 * 60 * 60, // 这只最长缓存时间为 12 小时
            }),
        ],
    }),
);
```

直接强制使用正常的网络请求，并将结果返回给客户端
```javascript
workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    workbox.strategies.networkOnly()
);
```

html 的缓存策略，防止断网兜底
如果你在页面上有一些动态信息（比如用户信息等等）， 配合一个合适的失败时间，毕竟大家都不希望用户登录了另一个账号，显示的还是上一个账号，这同样适用于那些使用 cookie（有状态）的请求，这些请求也推荐你添加失效策略，和失败状态。
永远记住你的目标，让用户能够更快的看到页面，但不要给用户一个错误的页面。
```javascript
workbox.routing.registerRoute(
    /*function(event) {
        // 需要缓存的HTML路径列表
        if (event.url.host === 'test.cn') {
            if (~cacheList.indexOf(event.url.pathname)) return true;
            else return false;
        } else {
            return false;
        }
    },*/
    new RegExp('.*test-index\.html'),
    workbox.strategies.networkFirst()
);
```

### 路由请求缓存策略
**Cache-First **

直接从 Cache 缓存中取得结果，如果 Cache 缓存中没有结果，那就会发起网络请求，拿到网络请求结果并将结果更新至 Cache 缓存，并将结果返回给客户端。

**Cache-only**

直接使用 Cache 缓存的结果，并将结果返回给客户端

**network-first（networkTimeoutSeconds）**

先拿网络请求的返回结果，如果拿到网络请求的结果，就将结果返回给客户端并且写入 Cache 缓存，如果网络请求失败，那最后被缓存的 Cache 缓存结果就会被返回到客户端

**network-only**

直接强制使用正常的网络请求

**StaleWhileRevalidateCache** 
缓存结果就直接返回，在返回 Cache 缓存结果的同时会在后台发起网络请求拿到请求结果并更新 Cache 缓存

如果本来就没有 Cache 缓存的话，直接就发起网络请求并返回结果，这对用户来说是一种非常安全的策略



**注间事项**
- 作用域：出于安全原因, Service Worker 脚本的作用范围不能超出脚本文件所在的路径。比如地址是 "/sw-test/sw.js" 的脚本只能控制 "/sw-test/" 下的页面

- 本地开发环境可以使用 http 协议， 上线必须使用https 协议

- Service Worker 中的 Javascript 代码必须是非阻塞的，所以你不应该在 Service Worker 代码中是用 localStorage 以及 XMLHttpRequest

- 在页面关闭后，浏览器可以继续保持 service worker运行，也可以关闭 service worker，这取决与浏览器自己的行为，所以不要在 serviceWorker.js 中定义全局变量，如果想要保存一些持久化的信息，你可以在 service worker 里使用IndexedDB API

# 浏览器缓存机制
从缓存位置上来说分为四种，并且各自有优先级，当依次查找缓存且都没有命中的时候，才会去请求网络。

Service Worker => Memory Cache => Disk Cache => Push Cache

Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker 的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

Service Worker 实现缓存功能一般分为三个步骤：首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。

当 Service Worker 没有命中缓存的时候，我们需要去调用 fetch 函数获取数据。也就是说，如果我们没有在 Service Worker 命中缓存的话，会根据缓存查找优先级去查找数据。但是不管我们是从 Memory Cache 中还是从网络请求中获取的数据，浏览器都会显示我们是从 Service Worker 中获取的内容。


## 使用这一特性的网站
https://ssr.vuejs.org/zh/
https://www.taobao.com/

## 参考

[Service Worker 初探](https://www.jianshu.com/p/0e2dee4c77bc "Service Worker 初探")
[Service Worker 是什么？](https://www.jianshu.com/p/62338c038c42 "Service Worker 是什么？")
[Workerbox 可以如此简单](https://github.com/GeoffZhu/geoffzhu.github.io/issues/14 "Workerbox 可以如此简单")
[神奇的 Workbox](https://zoumiaojiang.com/article/amazing-workbox-3/ "神奇的 Workbox")