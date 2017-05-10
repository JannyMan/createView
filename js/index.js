
window.onload = function () {

    window['adaptive'].desinWidth = 1366;// 设计图宽度
    window['adaptive'].baseFont = 16;// 没有缩放时的字体大小
    window['adaptive'].maxWidth = 1920;// 页面最大宽度 默认540
    window['adaptive'].init();// 调用初始化方法

    var infoShow = new FunFrame();
    infoShow.on_crDropMenu('#menu>ul>li','cur','dul',function (th) {
        alert(th);
    });
};
