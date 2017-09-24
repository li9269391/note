// 来源：http://wnworld.com/archives/191.html

/**
 * 处理css3 transitionend和animationend动画事件
 * 1、WN.addTranEvent(elem,fn,duration)：用于绑定transtionend事件，处理掉多次执行的问题
 * 2、WN.addAnimEvent(elem,fn),removeAnimEvent(elem,fn)：分别用于绑定和解绑animationend事件
 * 3、WN.setStyleAttribute(elem,val)：用于设置css3的属性
 */
(function (root, factory) {
    if (typeof define === 'function') {
        define(factory);
    }else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.WN = factory();
    }
})(this,function(){
    var WN = {},
        body=document.body || document.documentElement,
        style=body.style,
        transition="transition",
        transitionEnd,
        animationEnd,
        vendorPrefix;

    transition=transition.charAt(0).toUpperCase() + transition.substr(1);

    vendorPrefix=(function(){//现在的opera也是webkit
        var  i=0, vendor=["Moz", "Webkit", "Khtml", "O", "ms"];
        while (i < vendor.length) {
            if (typeof style[vendor[i] + transition] === "string") {
                return vendor[i];
            }
            i++;
        }
        return false;
    })();

    transitionEnd=(function(){
        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }
        for(var name in transEndEventNames){
            if(typeof style[name] === "string"){
                return transEndEventNames[name]
            }
        }
    })();

    animationEnd=(function(){
        var animEndEventNames = {
            WebkitAnimation : 'webkitAnimationEnd',
            animation      : 'animationend'
        }
        for(var name in animEndEventNames){
            if(typeof style[name] === "string"){
                return animEndEventNames[name]
            }
        }
    })();
    WN.addTranEvent=function(elem,fn,duration){
        var called=false;
        var fncallback = function(){
            if(!called){
                fn();
                called=true;
            }
        };
        function hand(){
            elem.addEventListener(transitionEnd, function () {
                elem.removeEventListener(transitionEnd, arguments.callee, false);
                fncallback();
            }, false);
        }
        setTimeout(hand,duration);
    };
    WN.addAnimEvent=function(elem,fn){
        elem.addEventListener(animationEnd,fn,false)
    };

    WN.removeAnimEvent=function(elem,fn){
        elem.removeEventListener(animationEnd,fn,false)
    };

    WN.setStyleAttribute=function(elem,val){
        if(Object.prototype.toString.call(val)==="[object Object]"){
            for(var name in val){
                if(/^transition|animation|transform/.test(name)){
                    var styleName=name.charAt(0).toUpperCase() + name.substr(1);
                    elem.style[vendorPrefix+styleName]=val[name];
                }else{
                    elem.style[name]=val[name];
                }
            }
        }
    };
    WN.transitionEnd=transitionEnd;
    WN.vendorPrefix=vendorPrefix;
    WN.animationEnd=animationEnd;
    return WN;
});


// 例：
// 1 transitionend事件
function callback(){
    $text.html("动画结束啦！只执行了一次transitioned")
}	
$movebtn.on("click",function(){
    $text.html("");
    $movebox.addClass("moving");
    WN.addTranEvent($movebox.get(0),callback,1);
});
$resetbtn.on("click",function(){
    $text.html("");
    $movebox.removeClass("moving");
    WN.addTranEvent($movebox.get(0),callback,1);
});


// 2 animationend事件
function callback(){
    $text.html("animation结束啦！")
}
WN.addAnimEvent($movebox.get(0),callback);
$movebtn.on("click",function(){
    $text.html("");
    $movebox.addClass('moving');	
});
$resetbtn.on("click",function(){
    $text.html("");
    $movebox.removeClass("moving");
});
$delbtn.on("click",function(){
    alert("删除动画事件成功,动画结束后就不会触发任何函数！")
    WN.removeAnimEvent($movebox.get(0),callback);
});
$reevent.on("click",function(){
    WN.addAnimEvent($movebox.get(0),callback);
    alert("恢复动画事件成功,动画结束后就会触发函数！")
})


// 3 设置transfrom,transitionDuration的css3属性让元素运动起来
$movebtn.on("click",function(){
    WN.setStyleAttribute($movebox.get(0),{
        transitionProperty:"all",
        transitionDuration:"1s",
        width:"125px",
        transform:"translate(75px,75px) rotate(45deg) skew(10deg,10deg)"
    })
});
$resetbtn.on("click",function(){
    WN.setStyleAttribute($movebox.get(0),{
        transitionProperty:"all",
        transitionDuration:"1s",
        width:"",
        transform:""
    })
})
