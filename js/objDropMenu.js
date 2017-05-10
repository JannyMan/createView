
//创建对象
function FunFrame() {
    this._init();
}

//给对象添加默认属性
FunFrame.prototype = {
    //改变对象this为FunFrame
    constructor: FunFrame,
    //初始化对象
    _init:function () {

    },

    /*下滑菜单-------------------*/
    on_crDropMenu:function (selector, showClassName, hiddenClassName, callback) {
        crDropMenu(selector, showClassName, hiddenClassName, callback);
    }
    /*下滑菜单  结束 --------------------*/
};





// 给对象实例化方法
function crDropMenu(selector, showClassName, hiddenClassName, callback) {    //选择器，显示的类名，隐藏的类名，点击后的回调函数

    //实现效果 '#menu>ul>li'
    $(selector).mousedown(function (e) {
        //阻止事件冒泡
        var e = window.event || e;
        e.stopPropagation();
        var cur = $(this).find('ul').attr('class');
        if (cur == showClassName) {
            //隐藏
            $(this).find('ul').removeClass(showClassName).addClass(hiddenClassName);
        } else {
            $(selector).find('ul').addClass(hiddenClassName);
            //添加显示类 '#menu>ul>li'
            $(this).find('ul').removeClass(hiddenClassName).addClass(showClassName);
        }
    });

    //点击事件并回调
    $(selector +' li').mousedown(function (ev) {
        var ev = ev || window.event;
        ev.stopPropagation();
        callback(this);
    });

}












