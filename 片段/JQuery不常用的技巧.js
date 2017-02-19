//更方便的分解URL。

// You want to parse this address into parts:
var url = 'http://tutorialzine.com/books/jquery-trickshots?trick=12#comments';

// The trickshot:
var a = $('<a>',{ href: url });

console.log('Host name: ' + a.prop('hostname'));
console.log('Path: ' + a.prop('pathname'));
console.log('Query: ' + a.prop('search'));
console.log('Protocol: ' + a.prop('protocol'));
console.log('Hash: ' + a.prop('hash'));


//更快地阻止默认事件行为。
//我们知道js中可以使用preventDefault()方法来阻止默认行为，但是jQuery对此提供了更简单的方法。如下：

// <a href="http://google.com/" id="goToGoogle">Go To Google</a>
$('#goToGoogle').click(false);


//在下载文件旁显示文件大小。
//你知道如何在不下载一个文件的情况下通过发送一个ajax请求头得到一个文件的大小吗？ 使用jQuery就很容易。

// <a href="001.html" class="fetchSize">First Trickshot</a> <br />
// <a href="034.html" class="fetchSize">This Trickshot</a> <br />
// <a href="assets/img/ball.png" class="fetchSize">Ball.png</a> <br />

// Loop all .fetchSize links
    $('a.fetchSize').each(function(){

        // Issue an AJAX HEAD request for each one
        var link = this;

        $.ajax({
            type        : 'HEAD',
            url            : link.href,
            complete    : function(xhr){

                // Append the filesize to each
                $(link).append(' (' + humanize(xhr.getResponseHeader('Content-Length')) + ')');

            }
        });

    });


function humanize(size){
    var units = ['bytes','KB','MB','GB','TB','PB'];

    var ord = Math.floor( Math.log(size) / Math.log(1024) );
    ord = Math.min( Math.max(0,ord), units.length-1);

    var s = Math.round((size / Math.pow(1024,ord))*100)/100;
    return s + ' ' + units[ord];
}


//使用最简单的ajax请求
//jQuery（使用ajax）提供了一个速记的方法来快速下载内容并添加在一个元素中。

// <p class="content"></p> <p class="content"></p>

var contentDivs = $('.content');

// Fetch the contents of a text file:
contentDivs.eq(0).load('1.txt');

// Fetch the contents of a HTML file, and display a specific element:
contentDivs.eq(1).load('1.html #header');


//序列化对象
//jQuery提供了一个方法序列化表单值和一般的对象成为URL编码文本字符串。这样，我们就可以把序列化的值传给ajax()作为url的参数，轻松使用ajax()提交表单了。
/*<form action="">
    First name: <input type="text" name="FirstName" value="Bill" /><br />
    Last name: <input type="text" name="LastName" value="Gates" /><br />
    </form>*/

// Turn all form fields into a URL friendly key/value string.
// This can be passed as argument of AJAX requests, or URLs.

    $(document).ready(function(){
        console.log($("form").serialize()); // FirstName=Bill&LastName=Gates
    });

// You can also encode your own objects with the $.param method:
log($.param({'pet':'cat', 'name':'snowbell'}));



//使用jQuery上传二进制文件
//现在的浏览器都支持FormData API，这可以是我们很轻松的通过ajax来发送数据。 并将之结合HTML5中的File API，我们就可以上传二进制文件了。
// The file input field

var fileInput = $('input[type=file]'),
    button = $('#upload');

button.on('click', function(){

    // Access the files property, which holds
    // an array with the selected files

    var files = fileInput.prop('files');

    // No file was chosen!
    if(files.length == 0) {
        alert('Please choose a file to upload!');
        return false;
    }

    // Create a new FormData object

    var fd = new FormData();

    fd.append('file', files[0]);

    // Upload the file to assets/php/upload.php. Open that file in a text
    // editor to get a better idea of how it works.

    $.ajax({
        url: './assets/php/upload.php',
        data: fd,
        contentType:false,        // This will make the browser use the multipart/formdata encoding, which is required for transferring binary data.
        processData:false,        // jQuery shouldn't do any processsing on the data - the browser will handle this when it sees we are passing a formdata object.
        type:'POST',
        success: function(m){
            log(m);
        }
    });
});