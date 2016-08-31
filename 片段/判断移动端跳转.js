
String.prototype.getParam = function(n){
    var r = new RegExp("[\?\&]"+n+"=([^&?]*)(\\s||$)", "gi");
    var r1=new RegExp(n+"=","gi");
    var m=this.match(r);
    if(m==null){
        return "";
    }else{
        return typeof(m[0].split(r1)[1])=='undefined'?'':decodeURIComponent(m[0].split(r1)[1]);
    }
};
function mobile_device_detect(url){
        var thisOS=navigator.platform;
        var os=new Array("iPhone","iPod","android","Nokia","SymbianOS","Symbian","Windows Phone","Phone","Linux armv71","MAUI","UNTRUSTED/1.0","Windows CE","BlackBerry","IEMobile");
        for(var i=0;i<os.length;i++){
            if(thisOS.match(os[i])){
                window.location=url;
            }
        }
        var check=navigator.appVersion;
            if(check.match(/linux/i)){
                if(check.match(/mobile/i)||check.match(/X11/i)){
                    window.location=url;
                }
            }
    }
if(location.search.getParam("from")!="wap"){// 不特定要打开PC端时，默认作判断跳转WAP端
    mobile_device_detect("/m/index.html");
}
