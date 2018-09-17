//设置画板大小
var width = document.documentElement.clientWidth*0.9;
var height = document.documentElement.clientHeight*0.8;
$('#myCanvas').attr({
	'width' : width,
	'height' : height
});

//配置项
$('#selColor option').css('background',function(){
	return $(this).attr('value');
});

//画画逻辑实现
var mousePressed = false;
var lastX, lastY;
var ctx;

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");
    $('#myCanvas').on('touchstart',function (e) {
        mousePressed = true;
        // console.log(e.originalEvent.targetTouches[0].pageX,$(this).offset().left,$(this).offset().top);
        Draw(e.originalEvent.targetTouches[0].pageX - $(this).offset().left, e.originalEvent.targetTouches[0].pageY - $(this).offset().top, false);
    });
 
    $('#myCanvas').on('touchmove',function (e) {
        if (mousePressed) {
            Draw(e.originalEvent.targetTouches[0].pageX - $(this).offset().left, e.originalEvent.targetTouches[0].pageY - $(this).offset().top, true);
        }
    });
 
    $('#myCanvas').on('touchend',function (e) {
        mousePressed = false;
    });

}
 
function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

$('.tapClip').click(function(){
    $('#selWidth option,#selColor option').removeAttr('selected');
    $("#selWidth option[value='11']").attr('selected','selected');
    $("#selColor option[value='white']").attr('selected','selected');
});
     
function clearArea() {  //清空画板
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
InitThis();

function canvasToImage(canvas) {  //把canvas转换成base64图像保存
    var canvas = document.getElementById('myCanvas');
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}

$('.upload').click(function(){  //上传到数据库和静态服务器下
    if( localStorage.getItem('用户') ){
        var canvas = $('#myCanvas');
        var image = canvasToImage(canvas);  //创造以canvas生成的图片
        layer.open({
            type : '1',
            content: "<div style='text-algin:center'><span class='spanTitle'>标题</span></br><input class='title' type='text'/></div>",
            area: ['60%','20%'],
            btn: '确认',
            yes: function(index, layero){
                if( $('.title').val() ){
                    $.ajax({
                        type : 'get',
                        url : '/upload/upload_photo_online',
                        data : {
                            author : localStorage.getItem('用户'),
                            title : $('.title').val(),
                            src : image.src
                        },
                        success : function(res){
                            if( res.code=='0' ) {
                                layer.msg('上传成功',{
                                    icon: 1,
                                    time: 2000
                                });
                                setTimeout(function(){
                                    layer.closeAll();
                                },2000);
                            }
                            else {
                                layer.msg('上传失败',{
                                    icon: 2,
                                    time: 2000
                                });
                                setTimeout(function(){
                                    layer.closeAll();
                                },2000);
                            }
                        }
                    });
                }
                else{
                    layer.msg('标题不能为空',{
                        icon: 2,
                        anim: 6,
                        time: 2000
                    });
                }
            }
        });
    }
    else{
        layer.msg('请先登录',{
            icon: 2,
            anim: 6,
            time: 1500
        });
    }
});



