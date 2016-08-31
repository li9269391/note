
var system ={
    win : false,
    mac : false,
    xll : false
};

//检测平台
var p = navigator.platform;
system.win = p.indexOf("Win") == 0;
system.mac = p.indexOf("Mac") == 0;
//system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

var isPad = isPad();
//跳转语句
//if( isPad ||  !(system.win||system.mac||system.x11)){
if( isPad ||  !(system.win||system.mac) ){
    window.location.href="http://kabrita.mama.cn/x2/index.php?p=kabrita&c=wapIndex";
}

function isPad(){
    equipmentInfo = navigator.userAgent;
    equipmentInfo = equipmentInfo.substring(0,40);
    equipmentInfo = equipmentInfo.toLowerCase();

    if(equipmentInfo.indexOf("pad") > 0){
        return true;
    }else{
        return false;
    }
}
    
