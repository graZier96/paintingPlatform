$(function(){
    // 滚动条头部事件
    var l =console.log;
    $(window).scroll(function(){
        var headerHeight = $('.header').css('height');
        var before = $(window).scrollTop();
        $(window).scroll(function() {
            var after = $(window).scrollTop();
            if( parseInt(after)<=parseInt(headerHeight) ){
                $('.header').css('position','relative');
            }
            else{
                if (before<after) {  //向下滚
                    $('.header').css('position','relative');
                    before = after;
                }
                else if(before>after) {  //向上滚
                    $('.header').css('position','fixed');
                    before = after;
                }
            }
        });
    });

    // 轮播图
    layui.use('carousel', function(){   
         var carousel = layui.carousel;
         //建造实例
         carousel.render({
             elem: '#banner'
             ,width: '100%' //设置容器宽度
             ,height: '10rem'
             ,arrow: 'none' //始终显示箭头
             ,anim: 'fade' //切换动画方式
         });
    });

    //请求渲染图片
    layui.use('flow', function(){   //开启懒加载 lay-src
        var flow = layui.flow;
        flow.lazyimg();
    });

    $.ajax({    //首页请求图片
        type : 'get',
        url : '/paint/get_paint',
        success : function(res){
            appendPhoto(res);
            $('.photo_show img').attr('lay-src',$('.photo_show img').attr('src'));
            $('.photo_show ul li').click(function(){  //点击图片进入详情
                $.ajax({
                    url : '/paint/photoInfo',
                    data : {
                        path : $(this).children(0).attr('src')
                    },
                    success : function(res){
                        var obj = JSON.stringify(res);
                        localStorage.setItem('photoMessage',obj);
                        window.location = 'photoInfo.html';
                    }
                });
            });
            // var height = parseInt($('.photo_show ul').css('height'))+ 100 + 'px';
            // $('.photo_show').css('height',height);
        }
    });

    function appendPhoto(arr){   //瀑布流渲染图片
        var strL='',strC='',strR='';
        var L=0,C=0,R=0;
        for( var i=0; i<arr.length; i++ ){
            var img = createImg(arr[i]);   //创建图片
            if( arr[i].title.length>9 ){   //限制标题长度
                arr[i].title = arr[i].title.slice(0,9)+'...';
            }
            
            if( L<=C&&L<=R ){
                strL = "<li class='img"+i+"'><div class='infor'><span>"+arr[i].title+"</span><span class='hot'>"+arr[i].hot+"</span><i class='layui-icon'>&#xe756;</i></div></li>";
                $('.listL').append($(strL));
                L += (parseInt($('.select>ul').css('width'))*img.height)/img.width+24;
            }
            else if( C<=L&&C<=R ){
                strC = "<li class='img"+i+"'><div class='infor'><span>"+arr[i].title+"</span><span class='hot'>"+arr[i].hot+"</span><i class='layui-icon'>&#xe756;</i></div></li>";
                $('.listC').append($(strC));
                C += (parseInt($('.select>ul').css('width'))*img.height)/img.width+24;
            }
            else{
                strR = "<li class='img"+i+"'><div class='infor'><span>"+arr[i].title+"</span><span class='hot'>"+arr[i].hot+"</span><i class='layui-icon'>&#xe756;</i></div></li>";
                $('.listR').append($(strR));
                R += (parseInt($('.select>ul').css('width'))*img.height)/img.width+24;
            }
            // var flagStr = '';
            // if( L<=C&&L<=R ){
            //     flagStr = 'L';
            // }
            // else if( C<=L&&C<=R ){
            //     flagStr = 'C';
            // }
            // else{
            //     flagStr = 'R';
            // }
            // var domStr = "<li class='img"+i+"'><div class='infor'><span>"+arr[i].title+"</span><span class='hot'>"+arr[i].hot+"</span><i class='layui-icon'>&#xe756;</i></div></li>";
            // $('.list'+flagStr).append($(domStr));
            // window[flagStr] += (parseInt($('.select>ul').css('width'))*img.height)/img.width+24;
            // console.log(window[flagStr]);
            $('.img'+i).prepend(img);
        }

        function createImg(obj){   //创建图片
            var img = new Image();     
            img.src = obj.path;
            img.onload = function(){
                var width = parseInt($('.select>ul').css('width'));
                img.width = width;
                img.height = (width*img.height)/img.width;   //等比缩放图片
            }
            return img;
        }
    }

    //头像点击事件，登录or个人信息
    if( localStorage.getItem('用户') ){    //判断是否为登录状态
        $('.header').attr('isLogin',localStorage.getItem('用户'));
        $('#user i').html(localStorage.getItem('用户'));
    }
    else{
        $('.header').attr('isLogin','false');    //初始化登录参数
    }
    
    $('#user').click(function(){
        if( $('.header').attr('isLogin')=='false' ) { //未登录,进入登录模块
            $('#userId,#password').val('');   //初始化状态
            $('#remenberPwd').prop('checked',false);
            $('.judgeId,.judgePwd').css('visibility','hidden');

            $('.login').css('z-index','2');
            $('.login').css('visibility','visible');
            $('.shadow').css('visibility','visible');
            $('.close').css('visibility','visible');
            $('.shadow').css('opacity','0.8');
        }
        else{  //已登录，进入个人信息界面
            window.location = "userInformation.html";
        }
    });

    // 登录模块
    $('#userId').on('input propertychange',function(){   //用户名输入监听
        var patternId = /^[A-Za-z0-9\u4e00-\u9fa5]{2,8}$/;
        var str = $('#userId').val();
        if( str.length!=0 ){
            $('.judgeId').css('visibility','visible');
        }
        else{
            $('.judgeId').css('visibility','hidden');
        }

        if( patternId.test(str)==true ){
            $('.judgeId').html('&#xe616;');
        }
        else{
            $('.judgeId').html('&#x1007;');
        }
    });

    $('#password').on('input propertychange',function(){   //密码输入监听
        var patternPwd = /^[A-Za-z0-9]{6,12}$/;
        var str = $('#password').val();
        if( str.length!=0 ){
            $('.judgePwd').css('visibility','visible');
        }
        else{
            $('.judgePwd').css('visibility','hidden');
        }

        if( patternPwd.test(str)==true ){
            $('.judgePwd').html('&#xe616;');
        }
        else{
            $('.judgePwd').html('&#x1007;');
        }
    });

    $('#userId,#password').focus(function(){
        $('.footer').css('position','static');
    });

    $('#userId').blur(function(){   //补上密码
        var id = $('#userId').val();
        if( localStorage.getItem(id) ){
            $('#password').val( localStorage.getItem(id) );
            $('.judgePwd').css('visibility','visible');
            $('.judgePwd').html('&#xe616;');
        }
    });

    $('#reset').click(function(){    //重置按钮点击事件
        $('#userId,#password').val('');
        $('#remenberPwd').prop('checked',false);
        $('.judgeId,.judgePwd').css('visibility','hidden');
    });

    $('.close').click(function(){    //点击关闭登录模块
        $('.login').css('z-index','-1');
        $('.login,.close,.shadow,.judgeId,.judgePwd').css('visibility','hidden');
        $('.footer').css('position','fixed');
    });

    //登录请求
    $('#login').click(function(){
        if( $('#userId').val()==''||$('#password').val()=='' ){
            layer.msg('账号或者密码不能为空', {
                icon: 2,
                time: 1000,  //（如果不配置，默认是3秒）
                anim: 6
            });
        }
        else{
            $.ajax({
                type: 'get',
                url: '/user/get_user',
                data: {
                    username : $('#userId').val(),
                    password : $('#password').val()
                },
                success: function(res){   //
                    if( res.status ) {
                        layer.msg('登录成功', {
                            icon: 1,
                            time: 1000  //（如果不配置，默认是3秒）
                        }, function(){   //成功登录后的操作
                            $('.login').css('z-index','-1');
                            $('.login,.close,.shadow,.judgeId,.judgePwd').css('visibility','hidden');
                            $('.footer').css('position','fixed');
                            $('#user i').html($('#userId').val());
                            if ( $('#remenberPwd').prop('checked')==true ) {   //记住密码
                                localStorage.setItem($('#userId').val(),$('#password').val());
                            }
                            $('.header').attr('isLogin',$('#userId').val());
                            localStorage.setItem('用户',$('#userId').val());    //用用户名记录登录者  
                            location.reload();
                        });
                    }
                    else {
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        }, function(){
                            $('#password').val('');
                            $('.judgePwd').css('visibility','hidden');
                          //do something
                        });
                    }
                }
            });
        }
    });

    //注册按钮点击
    $('#register').click(function(){
        window.location = 'register.html';
    });

    //头部导航栏
    $('#search').click(function(){   //搜索框弹入弹出
        if( $('.searchModular').css('position')=='absolute' ){
            $('.searchModular').css('position','static');
        }
        else{
            $('.searchModular').css('position','absolute');
        }
    });

    $('.searchBtn').click(function(){   //搜索
        var str = $('.searchText').val()=='' ? 'false' : $('.searchText').val()
        $.ajax({
            url: '/paint/searchPaint',
            data: {
                content: $('.searchText').val()
            },
            success: function(res){
                $('.listL,.listC,.listR').empty();
                appendPhoto(res);
                $('.photo_show ul li').click(function(){  //点击图片进入详情
                    $.ajax({
                        url : '/paint/photoInfo',
                        data : {
                            path : $(this).children(0).attr('src')
                        },
                        success : function(res){
                            var obj = JSON.stringify(res);
                            localStorage.setItem('photoMessage',obj);
                            window.location = 'photoInfo.html';
                        }
                    });
                });
            }
        });
    });
    
    $('#painting').click(function(){    //绘画
        window.location = 'painting.html';
    });
    
    if( localStorage.getItem('用户') ){    //本地上传
        layui.use('upload', function(){   //添加作品
            var upload = layui.upload;
            var uploadInst = upload.render({
                elem: '#add_works' //绑定元素
                ,url: '/upload/upload_photo_offline' //上传接口
                ,data: {
                    author: localStorage.getItem('用户')
                }
                ,done: function(res){
                 //上传完毕回调
                    if( res.code==0 ){
                        // console.log(res.path);
                        layer.msg('上传成功', {
                            icon: 1,
                            time: 1000
                        });
                    }
                }
                ,error: function(){
                  //请求异常回调
                    layer.msg('上传失败', {
                        icon: 2,
                        time: 1000
                    });
                }
            });
        });
    }
    else{
        $('#add_works').click(function(){
            layer.msg('请先登录', 
            {
                icon: 5,
                anim: 6,
                time: 2000
            });
        });
    }

    //底部栏
    $('.footer div').click(function(){    //选项卡
        $('.footer div').css('color','black');
        $(this).css('color','yellow');
    });

    $('.home').click(function(){   //主页
        window.location = 'index.html';
    });

    $('.dynamic').click(function(){   //动态
        if( localStorage.getItem('用户') ){
            window.location = 'focusDynamics.html';
        }
        else{
            layer.msg('请先登录',{
                icon: 2,
                time: 1500,
                anim: 6
            });
        }
    });

    $('.collection').click(function(){   //我的收藏
        if( localStorage.getItem('用户') ){
            window.location = 'myCollection.html';
        }
        else{
            layer.msg('请先登录',{
                icon: 2,
                time: 1500,
                anim: 6
            });
        }
    });

    if( localStorage.getItem('用户') ){  //判断当前用户是否还存在
        $.get({
            url: '/user/userIsExist',
            data: {
                username: localStorage.getItem('用户')
            },
            success: function(res){
                if( res.state ){
                    localStorage.removeItem( localStorage.getItem('用户') );
                    localStorage.removeItem('用户');
                }
            }
        });
    }

});


