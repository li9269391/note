Date.prototype.format = function(tpl) {
	var strs, w, keys, year, val;
	strs = [];
	tpl = tpl || 'YY\u5e74MM\u6708DD\u65e5 \u661f\u671fdd';
	w = 'FullYear,Month,Date,Hours,Minutes,Seconds,Day'.split(',');
	keys = [ /YY/g, /Y/g, /MM/g, /M/g, /DD/g, /D/g, /hh/g, /h/g, /mm/g, /m/g, /ss/g, /s/g, /dd/g, /d/g ];
	for ( var i = 0; i < 7; i++) {
		val = this['get' + w[i]]() + (w[i] === 'Month' ? 1 : 0);
		strs.push(('0' + val).slice(-2), val);
	}
	year = [ strs[1], strs[0] ].concat(strs.slice(2, -2));
	year.push('\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d'.substr(strs.slice(-1), 1), strs.slice(-1));
	for ( var i = 0; i < 14; i++) {
		tpl = tpl.replace(keys[i], year[i]);
	}
	return tpl;
};
/**
 * dateObj 任意 Date 对象。
 * @param strInterval 必选项。字符串表达式，【秒，分，时，天，周，季，月，年】
 * @param Number 必选项。数值表达式，可以是正数（得到未来的日期）或负数（得到过去的日期）
 * @returns {Date} 返回已添加指定时间间隔的日期对象。
 */
Date.prototype.dateadd = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
	case 's':
		return new Date(Date.parse(dtTmp) + (1000 * Number));
	case 'n':
		return new Date(Date.parse(dtTmp) + (60000 * Number));
	case 'h':
		return new Date(Date.parse(dtTmp) + (3600000 * Number));
	case 'd':
		return new Date(Date.parse(dtTmp) + (86400000 * Number));
	case 'w':
		return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
	case 'q':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	case 'm':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	case 'y':
		return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	}
};

// +---------------------------------------------------
// | 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串
// +---------------------------------------------------
Date.prototype.datediff = function(strInterval, dtEnd) {
	var dtStart = this;
	if (typeof dtEnd == 'string')// 如果是字符串转换为日期型
	{
		dtEnd = StringToDate(dtEnd);
	}
	switch (strInterval) {
	case 's':
		return parseInt((dtEnd - dtStart) / 1000);
	case 'n':
		return parseInt((dtEnd - dtStart) / 60000);
	case 'h':
		return parseInt((dtEnd - dtStart) / 3600000);
	case 'd':
		return parseInt((dtEnd - dtStart) / 86400000);
	case 'w':
		return parseInt((dtEnd - dtStart) / (86400000 * 7));
	case 'm':
		return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
	case 'y':
		return dtEnd.getFullYear() - dtStart.getFullYear();
	}
};

Date.prototype.format = function (format) {
	var o = {
	    "M+": this.getMonth() + 1,
	    "d+": this.getDate(),
	    "h+": this.getHours(),
	    "m+": this.getMinutes(),
	    "s+": this.getSeconds(),
	    "q+": Math.floor((this.getMonth() + 3) / 3),
	    "S": this.getMilliseconds()
	}
if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
}
for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
}
return format;
};
/**  
*转换日期对象为日期字符串  
* @param date 日期对象  
* @param isFull 是否为完整的日期数据,  
*               为true时, 格式如"2000-03-05 01:05:04"  
*               为false时, 格式如 "2000-03-05"  
* @return 符合要求的日期字符串  
*/  
function getSmpFormatDate(date, isFull) {
	var pattern = "";
	if (isFull == true || isFull == undefined) {
	    pattern = "yyyy-MM-dd hh:mm:ss";
	} else {
	    pattern = "yyyy-MM-dd";
	}
	return getFormatDate(date, pattern);
};

/**  
*转换当前日期对象为日期字符串  
* @param date 日期对象  
* @param isFull 是否为完整的日期数据,  
*               为true时, 格式如"2000-03-05 01:05:04"  
*               为false时, 格式如 "2000-03-05"  
* @return 符合要求的日期字符串  
*/  

function getSmpFormatNowDate(isFull) {
	return getSmpFormatDate(new Date(), isFull);
};
/**  
*转换long值为日期字符串  
* @param l long值  
* @param isFull 是否为完整的日期数据,  
*               为true时, 格式如"2000-03-05 01:05:04"  
*               为false时, 格式如 "2000-03-05"  
* @return 符合要求的日期字符串  
*/  

function getSmpFormatDateByLong(l, isFull) {
	return getSmpFormatDate(new Date(l), isFull);
};
/**  
*转换long值为日期字符串  
* @param l long值  
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss  
* @return 符合要求的日期字符串  
*/  

function getFormatDateByLong(l, pattern) {
	return getFormatDate(new Date(l), pattern);
};
/**  
*转换日期对象为日期字符串  
* @param l long值  
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss  
* @return 符合要求的日期字符串  
*/  
function getFormatDate(date, pattern) {
	if (date == undefined) {
	    date = new Date();
	}
	if (pattern == undefined) {
	    pattern = "yyyy-MM-dd hh:mm:ss";
	}
	return date.format(pattern);
};
/**
**
*把时间字符串转成标准时间
**/
function str2date(s){
s=typeof s=="number"?s+"":s;
if (typeof(s) == "string") {
    $.trim(s);
    s = s.replace(/[\/\s\:]/gi, "-");
    if (s.match(/\-/)!=null) {
        md = s.split("-");
        md[1] = md[1] * 1 - 1;
        if (md.length > 3) {
            s = new Date(md[0], md[1], md[2], md[3], md[4], md[5])
        }
        else {
            s = new Date(md[0], md[1], md[2]);
        }
    }
    else {
        md = s.split("");
        var mdy = ("" + md[0] + md[1] + md[2] + md[3]) * 1;
        var mdm = ("" + md[4] + md[5]) * 1 - 1;
        var mdd = ("" + md[6] + md[7]) * 1;
        if (md.length > 10) {
            var mdhh = ("" + md[8] + md[9]) * 1;
            var mdmm= ("" + md[10] + md[11]) * 1;
            var mdss = ("" + md[12] + md[13]) * 1;
            s = new Date(mdy, mdm, mdd, mdhh, mdmm, mdss);
        }
        else {
            s = new Date(mdy, mdm, mdd);
        }
    }
}
return s;
}
/**
**
*减去相应天数
**/
Date.prototype.descDay=function(dayNum){
	var time=this.getTime()-dayNum*24*60*60*1000;
	return new Date(time);
};
/**
**
*增加相应天数
**/
Date.prototype.addDay=function(dayNum){
	var time=this.getTime()+dayNum*24*60*60*1000;
	return new Date(time);
};
/**
***比较小时、分钟是否到期
**/
Date.prototype.compareHour = function(hour,minute){
	if (minute == undefined) {
    minute = 0;
}
	var hour1 = this.getHours();
	var minute1=this.getMinutes();
	return (hour1*60+minute1)-(hour*60+minute);
};
    
