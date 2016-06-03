// 文字溢出省略
// <div class='ellipsis'><p>内容</p></div>
jQuery(".ellipsis").each(function (i) {
    var divH = jQuery(this).height();
    var $p = jQuery("p", _Q(this)).eq(0);
    while ($p.outerHeight() > divH) {
        $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
    }
    ;
});
