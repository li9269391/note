// 是否是微信浏览器
export const isWeiXin = () => {
    return ua.match(/microMessenger/i) == 'micromessenger'
}

// 是否是移动端
export const isDeviceMobile = () => {
    return /android|webos|iphone|ipod|balckberry/i.test(ua)
}

// 是否是QQ浏览器
export const isQQBrowser = () => {
    return !!ua.match(/mqqbrowser|qzone|qqbrowser|qbwebviewtype/i)
}

// 是否是爬虫
export const isSpider = () => {
    return /adsbot|googlebot|bingbot|msnbot|yandexbot|baidubot|robot|careerbot|seznambot|bot|baiduspider|jikespider|symantecspider|scannerlwebcrawler|crawler|360spider|sosospider|sogou web sprider|sogou orion spider/.test(ua)
}

// 是否ios
export const isIos = () => {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {  //安卓手机
        return false
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        return true
    } else if (u.indexOf('iPad') > -1) {//iPad
        return false
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        return false
    } else {
        return false
    }
}

// 是否为PC端
export const isPC = () => {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}