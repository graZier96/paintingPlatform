function appendMyPaint(arr,start,end){   //自定义渲染n张图片
    for( var i=start; i<end; i++ ){
    	var img = createMyPaint(arr[i]);
    	if( arr[i].title.length>15 ){
    		arr[i].title = arr[i].title.slice(0,15) + '...';
    	}
    	$('.dynamicBox').append("<div class='img"+i+"'><div class='infor clearfix'><span>"+arr[i].author+"</span><span>"+arr[i].title+"</span><span class='time'>"+timestampToTime(parseInt(arr[i].time))+"</span></div></div>");
    	$('.img'+i).prepend(img);
    	$('.img'+i).children(0).attr('width','100%');
    	$('.img'+i).children(0).attr('height','10%');
    }
    function createMyPaint(obj){   //创建图片
        var img = new Image();
        img.src = obj.path;
        img.height = '100';
        img.width = '100';
        return img;
    }
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours()>9? date.getHours()+ ':' : '0'+date.getHours()+':' ;
    m = date.getMinutes()>9? date.getMinutes()+ ':' : '0'+date.getMinutes()+':' ;
    s = date.getSeconds()>9? date.getSeconds() : '0'+date.getSeconds() ;
    return Y+M+D+h+m+s;
}

$.get({
    url : '/paint/getDynamics',
    data : {
        username : localStorage.getItem('用户')
    },
    success : function(res){
        appendMyPaint(res,0,res.length);
        $('.dynamicBox>div').click(function(){  //点击图片进入详情
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

$('.goback').click(function(){
    window.history.go(-1);
});

$(window).scroll(function(){
    if( $(window).scrollTop()>=$(window).height() ){
        $('.returnTop').css('visibility','visible');
    }
    else{
        $('.returnTop').css('visibility','hidden');
    }
});

$('.returnTop').click(function(){
    $('html,body').animate({
        scrollTop : '0'
    },1000 );
});