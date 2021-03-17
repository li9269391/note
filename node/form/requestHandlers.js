var fs = require('fs');
var formidable = require('formidable');

exports.controller = {
    index(response) {
        var body = '<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <title>upload</title>\n' +
            '</head>\n' +
            '<body>\n' +
            '<form action="/upload" enctype="multipart/form-data" method="post">\n' +
            '    <input type="file" name="upload" multiple="multiple">\n' +
            '    <input type="submit" value="Upload file">\n' +
            '</form>\n' +
            '</body>\n' +
            '</html>'
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write(body)
        response.end();
    },
    upload(response, request) {
        var form = new formidable.IncomingForm();
        form.parse(request, (error, fields, files) => {
            if(error){
                console.log('解析失败')
            }
            // fields: {name: value} 文本域；
            // files：上传文件的详细信息
            console.log(fields)
            console.log(files);
            var oldPath = files.upload.path;
            var newPath = './tmp/test.png';
            // form.uploadDir = "/my/dir"; 设置上传文件存放的文件夹，默认为系统的临时文件夹
            // 可以使用 fs.rename() 来改变上传文件的存放位置和文件名
            fs.renameSync(oldPath, newPath, () => {
                if(err){
                    console.log('改名失败')
                }
            })
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write('上传成功的图片：<br/>');
            response.write('<img src="/showImage" />'); // get 请求获取图片
            response.end('ok');
        });
    },
    showImage(response) {
        fs.readFile('./tmp/test.png', 'binary', (err, file) => {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write('error' + '\n');
                response.end();
            } else {
                response.writeHead(200, {
                    "Content-Type": "image/png"
                });
                response.write(file, "binary");
                response.end();
            }
        })
    }
}