const UploadImage = {
    view: $('#apply-form'),
    //图片上传队列 每次最多只能上传两张图
    queue: [],
    //正在上传的图片数量
    count: 0,
    _uid: 0,
    //入队
    enqueue (fn) {
        var p = this;

        p.queue.push(fn);
        //数量少于2 出队
        if (p.count < 2) {
            p.dequeue();
        }
    },
    dequeue () {
        var p = this
            , fn = p.queue.shift();

        if (typeof fn === 'function') {
            p.count++;
            fn();
        }

    },
    splice (node) {
        var p = this;
        var _uid = node.data('_uid_');

        for (var i = 0, len = p.queue.length; i < len; i++) {
            if (_uid === p.queue[i]._uid_) {
                return p.queue.splice(i, 1);
            }
        }
    },
    initChild (node, src) {
        var thumb = node.children('.thumb')
            , img = thumb.children('img');

        if (!img.length) {
            $('<img src="{src}">'.replace('{src}', src)).appendTo(thumb);
        } else {
            img.attr('src', src);
        }

        thumb.show();

        node.children('.progress').show();
        node.children('.t-remove').show();
    },
    uploadImage (options) {
        var opt = {
            uploadUrl: '',
            file: null,
            start: $.noop,
            progress: $.noop
        };

        var data = new FormData(), def;

        options = $.extend(opt, options);

        data.append('data', options.file);

        def = $.ajax({
            url: options.uploadUrl,
            type: 'post',
            processData: false,
            data: data,
            contentType: false,

            'xhr': function () {
                var xhr = $.ajaxSettings.xhr();

                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function (e) {
                        var percentage = Math.round(e.loaded / e.total * 100) + "%";

                        options && options.progress(percentage);
                    }, false);
                }

                return xhr;
            }
        });

        options.start(def);

        def.complete(function () {
            options = null;
        });

        return def;
    },
    add (node) {
        var div = node.children('.progress'), p = this;

        function fn() {
            p.uploadImage({
                uploadUrl: p.uploadUrl,
                file: node.data('file'),
                start: function (xhr) {
                    //把xhr存起来 方便以后abort
                    node.data('xhr', xhr);
                    div.children('span').text('正在上传');
                },

                progress: function (per) {
                    div.children('span').text(per);
                    div.children('div').css('width', per);
                }
            })
                .then(function (res) {
                    var def = $.Deferred();

                    return res.result ? def.resolve(res.url) : def.reject();
                })
                .done(function (url) {
                    //上传成功
                    node.removeData('file');
                    div.siblings('.hidden').val(url);
                    div.children('span').text('上传成功');
                })
                .fail(function (res) {

                    if (res && res.statusText === 'abort') {
                        node.removeData('file');
                        return;
                    }
                    //点击上传
                    div.addClass('continue-btn');
                    //上传失败
                    div.children('span').text('点击重新上传');
                })
                .always(function () {

                    node.removeData('xhr');

                    node = div = file = null;

                    p.count--;
                    //继续上传
                    return p.dequeue();
                });
        }

        node.data('_uid_', p._uid);
        fn._uid_ = p._uid++;
        //入队
        return p.enqueue(fn);
    },
    createThumbnail (file) {
        var fr, deferred;

        deferred = $.Deferred();

        if (window.URL && window.URL.createObjectURL) {
            window.setTimeout(function () {
                var src = window.URL.createObjectURL(file);

                deferred.resolve(src);

                file = null;
            }, 0);
        } else {
            fr = new FileReader();
            fr.onload = function () {
                deferred.resolve(this.result);
            };

            fr.readAsDataURL(file);
        }

        return deferred.promise();
    },
    resetData (node) {
        //之前的 就停止掉
        if (node.data('xhr')) {
            node.data('xhr').abort();
            node.removeData('xhr');
        }
        //之前的val 去掉
        node.children('.hidden').val('');

        var div = node.children('.progress');

        div.removeClass('continue-btn');
        div.children('span').text('等待上传');
        div.children('div').css('width', '100%');

    },
    addEvent () {
        this.view
            .on('click', '.continue-btn', function () {
                var node = $(this).parent();

                p.resetData(node);
                p.add(node);
            })
            .on('click', '.t-remove', function () {
                var node = $(this).parent();

                p.resetData(node);
                p.splice(node);

                $(this).hide();
                node.removeData('file');
                node.children('.progress').hide();
                node.children('.thumb').hide();
            })
            .on('change', 'input[type="file"]', function () {
                var file = this.files[0]
                    , size = file.size / 1024 / 1024;

                if (size > 2) {
                    // $_sys.AlertBox({title: '图片的大小不能超过2M'});
                    return;
                }

                var node = $(this).parent();

                p.resetData(node);

                node.data('file', file);

                //生成缩略图
                p.createThumbnail(file)
                    .done(function (src) {
                        p.initChild(node, src);
                    })
                    .done(function () {

                        p.add(node);

                        node = null;

                    });
            });
    },
    init (option) {
        var opt = $.extend({
            success: $.noop
        }, option);
        this.uploadUrl = opt.uploadUrl;
        this.success = opt.success;
        this.addEvent();
    }
};
export default{
    UploadImage
}