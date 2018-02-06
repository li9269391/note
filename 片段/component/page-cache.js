import $ from 'jquery'
import Storage from 'component/storage'
import scrollLoad from 'component/scroll-load'
window.$ = window.jQuery = $;


export default {
    initIndex: function() {
        let baseSessionStorage = new Storage('SS__', window.sessionStorage);
        let pageCache =  {
            hostname: window.location.hostname,
            path: window.location.pathname,
            data: [],
            page: 1,
            top: 0
        }
        let initPage = 1;

        // 跳转前缓存分页数据
        $('#main').on('click', 'a', function (event) {
            pageCache.top = $(window).scrollTop();
            baseSessionStorage.set('pageCache', JSON.stringify(pageCache), function (status, key, value) {
                if (status === 0) {
                    // console.log('设置缓存成功！')
                }
            }, new Date().getTime() + 1000 * 60 * 5);
        });
        baseSessionStorage.get('pageCache', function (status, value) {
            let cacheData = JSON.parse(value);
            if (
                status === 0 &&
                value &&
                cacheData.hostname === window.location.hostname &&
                cacheData.path === window.location.pathname
            ) {
                initPage = ~~cacheData.page + 1;
                render(initPage, cacheData.data);
                $(window).scrollTop(cacheData.top);
            } else {
                // console.log('没有缓存，或缓存过期！')
            }
        });
        scrollLoad.init({
            url: '//act.mama.cn/v6/welfare/index/welfarelist',
            initPage: initPage,
            revealId: 'loadingBar',
            success: function (page, result) {
                render(page, result.data)
            },
            fail: function () {}
        })

        function render(page, data) {
            if (!data.length) {
                scrollLoad.loadEnd(); // 加载全部完成，主动触发，因为每个接口和数据结构不一样。
            }
            pageCache.data = pageCache.data.concat(data);
            pageCache.page = page;
        }

    }
};
