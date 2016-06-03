Number.prototype.CommaFormatted = function(n,symbol) {
	return (symbol || '\uffe5') + this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,');
	// return this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,');
};
(4564546).CommaFormatted(2,"$");

// 格式化千分符
function CommaFormatted(str,symbol) {
	var symbol = symbol || "￥";
    return str.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
jQuery('.format-txt').each(function(){
    var txt = CommaFormatted(jQuery(this).text());
    jQuery(this).text(txt);
});
