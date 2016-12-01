//输入字符限制
function confine() {
    var iLen = 0;
    for (var i = 0; i < oConBox.value.length; i++){
        iLen += /[^\x00-\xff]/g.test(oConBox.value.charAt(i)) ? 1 : 0.5;
    }
    oMaxNum.html(Math.abs(maxNum - Math.floor(iLen)));
    if(maxNum - Math.floor(iLen) >= 0){
        oMaxNum.css("color", "");
        oCountTxt.html("还能输入");
        bSend = true;
    } else {
        oMaxNum.css("color", "#f60");
        oCountTxt.html("已超出");
        bSend = false;
    }
}
