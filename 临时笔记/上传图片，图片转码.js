// <input type="file" accept="image/gif,image/png,image/jpeg,image/jpg" />
onChange = function () {
    const file = e.target.files[0]
    const size = file.size / 1024

    if(this.value === null || this.value === "" || this.value === undefined){
        alert("请选择文件");
        return;
    }else if(!/image\//.test(file.type)){
        alert("请上传图片，不支持其它文件！");
        return;
    }
}

imgFn = {
    createBase64 (src) {
        let deferred = $.Deferred();
        var img = new window.Image();
        img.onload = img.onerror = function () {
            var width = img.width;
            var height = img.height;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // draw image params
            var sx = 0;
            var sy = 0;
            var sWidth = width;
            var sHeight = height;
            var dx = 0;
            var dy = 0;
            var dWidth = width;
            var dHeight = height;
            var quality = 0.92;

            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, dWidth, dHeight);
            ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

            var dataUrl = canvas.toDataURL('image/jpeg', quality);
            deferred.resolve(dataUrl);
        };
        img.onerror = function () {
            deferred.reject('图片加载出错')
        }
        img.src = src;
        return deferred.promise()
    },
    createThumbnail (file) {

        let fr
        let deferred = $.Deferred();

        fr = new window.FileReader();
        fr.onload = function () {
            deferred.resolve(this.result);

            // 加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload = function(){
                var width = image.width;
                var height = image.height;
            };
            image.src = this.result;
        };
        fr.readAsDataURL(file);

        return deferred.promise();
    }
}
//
// createThumbnail(file).done((src) => {
//     this.createBase64(src).done((bs64) => {
//         this.getToken(bs64.split(',')[1], flag)
//     })
//     e.target.value = null
// });
