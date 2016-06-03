Number.prototype.rmb = function(prevfix, n) {
  //	return (prevfix === false ? '' : '\uffe5') + this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,');
	return this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,');
};

// 格式化千分符
function CommaFormatted(str) {
    return str.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
jQuery('.format-txt').each(function(){
    var txt = CommaFormatted(jQuery(this).text());
    jQuery(this).text(txt);
});
