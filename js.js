$(function () {
    var chat = $.connection.chatHub;
    //获取url中的参数   http://localhost/DXWebComs/ChatRoom/ChatRoom.html?room=room1&username=xiaoming
    var url = decodeURI(window.location.href);
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2];
        return null; //返回参数值
    };

    var displayGroupname = decodeURI(getUrlParam('room'));   //房间1
    var displayname = decodeURI(getUrlParam('username'));   //江林


    chat.client.addUserIn = function (room, userName) {
        var today = new Date();
        var encodedtTime = $('<div />').text(today.toLocaleTimeString()).html();
        if (userName != displayname) {
            $('#discussion').append('<li style="color: #78777d;margin-top: 8px;float: left;width: 100%;">' + encodedtTime + " "
                + ':&nbsp;&nbsp;用户' + userName + '进入房间' + room + '</li>');
        }
    };

    var displayBoolean = false;
    //获取起始时间
    var date = new Date();
    var minute = date.getMinutes();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var time1 = y+'-'+ m +'-'+ d+'   '+h+':'+minute;
    $('#discussion').append('<li style="text-align: center;margin-top: 8px;color: #78777d;float: left;width: 100%;">'+ time1 +'</li>');

    chat.client.broadcastMessage = function (name, message, dtTime) {
        // Html encode display name and message.
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        if(displayBoolean){
            //获取当前时间
            var newDate = new Date();
            var newMinute = newDate.getMinutes();
            if(newMinute != minute){
                var year = newDate.getFullYear();
                var month = newDate.getMonth() + 1;
                var day = newDate.getDate();
                var hh = newDate.getHours();
                var newMinute = newDate.getMinutes();
                var time = year + '-' + month + '-' + day + '   ' + hh + ':' + newMinute;
                $('#discussion').append('<li style="text-align: center;margin-top: 8px;color: #78777d;float: left;width: 100%;">'+ time +'</li>');
                //更新起始时间
                minute = newMinute;
            }
        }else {
            displayBoolean = true;
        }
        var scrollTops = $(window).scrollTop();
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();
        var s = documentHeight - (windowHeight + scrollTops);

        if (encodedName == displayname) {
            //接收自己发送的信息
            $('#discussion').append('<li class = "liRight">' + '<span class="self myname">:&nbsp;&nbsp;' + encodedName + '</span>' + '<span class = "myMsg">' + encodedMsg + '</span>'
                + '</li>');
            //消息优化
            var selfLiWidth = $('.container #discussion .liRight').width();
            var selfNameWidth = $('.container #discussion .liRight .myname').width();
            //IE8
            if (myBrowser() == "IE8" && documentHeight > windowHeight) {
                $('.container #discussion .liRight .myMsg').css({
                    maxWidth: selfLiWidth - selfNameWidth - 30
                });
            } else {
                $('.container #discussion .liRight .myMsg').css({
                    maxWidth: selfLiWidth - selfNameWidth - 21
                });
            }
        } else {
            //接收他人发送的信息
            $('#discussion').append('<li class = "liLeft"><span class="others othersName">' + encodedName + '&nbsp;&nbsp;:</span>'
                + '<span class="othersMsg">' + encodedMsg + '</span>' + '</li>');
            //消息优化
            var selfLiWidth = $('.container #discussion .liLeft').width();
            var selfNameWidth = $('.container #discussion .liLeft .othersName').width();
            //IE8
            if (myBrowser() == "IE8" && documentHeight > windowHeight) {
                $('.container #discussion .liLeft .othersMsg').css({
                    maxWidth: selfLiWidth - selfNameWidth - 30
                });
            } else {
                $('.container #discussion .liLeft .othersMsg').css({
                    maxWidth: selfLiWidth - selfNameWidth - 21
                });
            }
        }
        setTimeout(function () {
            //移动到最下面
            var scrollTops = $(window).scrollTop();
            var windowHeight = $(window).height();
            var documentHeight = $(document).height();
            var s = documentHeight - (windowHeight + scrollTops);
            $('html,body').animate({ scrollTop: (s + scrollTops) + 'px' }, 'slow');
        },10);
    };
    // Get the user name and store it to prepend to messages.
    //$('#displayGroupname').val(prompt('Enter your room:', ''));
    //$('#displayname').val(prompt('Enter your name:', ''));
    // Set initial focus to message input box.
    $('#message').focus();

    $.connection.hub.start().done(function () {

        //var groupName = $('#displayGroupname').val();
        chat.server.loginRoom(displayGroupname, displayname);

        //回车键发送信息
        document.onkeyup = function (e) {
            var e = e || event;
            if (e.keyCode == 13) {
                //调用发送方法
                sendMsg();
                //$('#sendmessage').html('');
            }
        };
        // 点击事件发送信息
        $('#sendmessage').click(function () {
            sendMsg();
            $('this').html('');
        });

        //封装发送函数
        function sendMsg() {
            //去除前后空格
            var reg = /(^\s*)|(\s*$)/g;
            //var str = $('#message').val;
            var str = $('#message').val();
            var info = str.replace(reg, "");

            // Call the Send method on the hub.
            // chat.server.send($('#displayname').val(), $('#message').val());

            //判断内容是否为空
            if (info == '') {
                return;
            } else {
                var today = new Date();
                chat.server.sendGroupMsg(displayGroupname, displayname, info, today.toLocaleTimeString());
                // Clear text box and reset focus for next comment.
                $('#message').val('').focus();
                $("#rmWord").html('剩余输入字数：<b>66</b>');
            }
        }
    });
    //检测输入事件

    $('#message').keyup(function (e) {
        var len = $(this).val().length;
        var event = e || window.event;
        console.log(document.getElementById('message'));
        if (myBrowser() == "IE8") {
            //ie8;
            if (len > 66) {
                console.log('输入完成！');
                //$('#message').html($('#message').val().slice(0, 66));
                var messageBox = document.getElementById('message');
                messageBox.disabled = true;
                var sumFonts = $('#message').val().slice(0, 66);
                messageBox.value = sumFonts;
                messageBox.disabled = false;
            }
        } else {
            //谷歌浏览器和ie9+
            if (len > 66) {
                $('#message').val($('#message').val().substring(0, 66));
            }
        }
        var num = 66 - len;
        if(num < 0){
            num = 0;
        }
        $("#rmWord").html('剩余输入字数：'+'<b>'+ num +'</b>');
    });
});
