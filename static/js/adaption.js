//自适应
(function (doc, win) {
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = clientWidth / 10 + 'px';
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);//resize
    doc.addEventListener('DOMContentLoaded', recalc, false);//reload

    var scale = 1.0;
    var ratio = 1;
    if (win.devicePixelRatio >= 2) {
        scale *= 0.5;
        ratio *= 2;
    }
    var text = '<meta name="viewport" content="initial-scale=' + scale + ', maximum-scale=' + scale + ',' + ' minimum-scale=' + scale + ', width=device-width,' + ' user-scalable=no" />';
    doc.write(text);
})(document, window);