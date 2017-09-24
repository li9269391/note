//先引入 emoji-data 码表

var WoniuTrip = WoniuTrip || {};

WoniuTrip.Emoji = {

  isInit: false,

  init: function() {
    var a = [];
    var c = this;

    //正则
    c.map = {};

    for (var i in EMOJIDATA){
      for (var j = 0; j < EMOJIDATA[i][0].length; j++){
        c.map[EMOJIDATA[i][0][j]] = i;
        a.push(EMOJIDATA[i][0][j].replace('*', '\\*'));
      }
    }

    a = a.sort(function(a, b){
      return b.length - a.length;
    });

    c.emojiReg = new RegExp('('+a.join('|')+')(\uD83C[\uDFFB-\uDFFF])?', "g");
  },

  parse: function(str) {
    var c = this;

    if (!c.isInit) {
      c.isInit = true;

      c.init();
    }

    str += '';

    return str.replace(c.emojiReg, function(m, p1, p2){
      var val = c.map[p1];

      if (!val) return m;

      var idx = null;

      if (p2 == '\uD83C\uDFFB') idx = '1f3fb';
      if (p2 == '\uD83C\uDFFC') idx = '1f3fc';
      if (p2 == '\uD83C\uDFFD') idx = '1f3fd';
      if (p2 == '\uD83C\uDFFE') idx = '1f3fe';
      if (p2 == '\uD83C\uDFFF') idx = '1f3ff';

      return '[em:' + (idx ? idx : val.split('-')[0]) + ']';

    });
  },

  textToImg: function(str) {
    var c = this;

    str += '';

    var reg = /\[em:([a-z0-9]+)\]/g;

    return str.replace(reg, function(_, b) {
      //若图片存在 则返回图片 否则 清掉
      if (FaceMap.hasOwnProperty(b)) {
        return '<img src="' + staticUrl + '/images/face/' + b + '.png" />';
      }

      return '';
    });
  },
    textToImg2: function (str) {
        var c = this;
        if (!c.isInit) {
            c.isInit = true;

            c.init();
        }
        str += '';

        return str.replace(c.emojiReg, function(m, p1, p2) {
            // p1 对应 map index
            // p2 匹配到的值
            var val = c.map[p1];
            // val 如 \u00AE\uFE0F
            if (!val) return m;

            var idx = null;
            if (p2 == '\uD83C\uDFFB') idx = '1f3fb';
            if (p2 == '\uD83C\uDFFC') idx = '1f3fc';
            if (p2 == '\uD83C\uDFFD') idx = '1f3fd';
            if (p2 == '\uD83C\uDFFE') idx = '1f3fe';
            if (p2 == '\uD83C\uDFFF') idx = '1f3ff';

            var imgName = idx ? idx : val.split('-')[0];
            //若图片存在 则返回图片 否则 清掉
            if (FaceMap.hasOwnProperty(imgName)) {
                return '<img src="' + staticUrl + '/images/face/' + imgName + '.png" />';
            }
            return '';
        });
    }
};

/********************
*******使用说明******
//将emoji转换成文字
WoniuTrip.Emoji.parse

@param string //包含emoji的文本
@return string //返回转义后的文本
@depends emoji-data.js  //需要引入emoji-data.js 生成正则

//例如
WoniuTrip.Emoji.parse('Adonis is very handsome!🍅') //返回 Adonis is very handsome![em:1f345]

//将文字转换为图片
WoniuTrip.Emoji.textToImg

@param string
@return string
@depends facemap.js  //之所以要引入facemap.js 是因为图片不全 所以 需要检测图片是否存在

//例如
WoniuTrip.Emoji.textToImg('Adonis is very handsome![em:1f345]')
//返回 Adonis is very handsome!<img src="./face/1f345.png" />

 //例如
 WoniuTrip.Emoji.textToImg2('Adonis is very handsome!\uD83C\uDF45')
 //返回 Adonis is very handsome!<img src="./face/1f345.png" />

*******/