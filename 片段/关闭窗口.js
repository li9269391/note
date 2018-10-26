let closeWindow = () => {
    if (window.history.length <= 1) {
        if (window.MJSSDK.UA.mamaApp) {
            window.MJSSDK.closeWindow();
        } else if (window.MJSSDK.UA.wx) {
            window.WeixinJSBridge.call('closeWindow');
        } else {
            window.opener = null;
            window.open('', '_self');
            window.close();
            window.history.back();
            window.location.href = 'about:blank ';
        }
    } else {
        window.history.back();
    }
}