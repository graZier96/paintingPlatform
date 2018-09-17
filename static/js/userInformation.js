var userId = localStorage.getItem('用户');  //获取当前登录的用户名
$('.user').html(userId);

$.ajax({
	url : '/paint/getPersonPaint',
	data: {
		username : userId
	},
	success: function(res){
		var count;  
		if( res.length==0 ){   //该用户投稿数为0
			count = 0;
			$('.noPaint').css('display','block');   //显示暂无投稿
		}
		else if( res.length==1 ){
			count = 1;
		}
		else{
			count = 2;   //默认显示的图片数量2
		}
		appendMyPaint(res,0,count);

		if( res.length>2 ){
			$('#showMore').css('display','block');   
		}
		$('#showMore').click(function(){	//显示更多
			appendMyPaint(res,count,res.length);
			$('#showMore').css('display','none');
			$('.myPaint>div').click(function(){  //点击图片进入详情
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
		});
		$('.myPaint>div').click(function(){  //点击图片进入详情
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

function appendMyPaint(arr,start,end){   //自定义渲染n张图片
    for( var i=start; i<end; i++ ){
    	var img = createMyPaint(arr[i]);
    	if( arr[i].title.length>5 ){
    		arr[i].title = arr[i].title.slice(0,5) + '...';
    	}
    	$('.myPaint').append("<div class='img"+i+"'><div class='infor clearfix'><span>"+arr[i].title+"</span><span class='hot'>"+arr[i].hot+"</span><i class='layui-icon'>&#xe756;</i></div></div>");
    	$('.img'+i).prepend(img);
    	$('.img'+i).children(0).attr('width','100%');
    	$('.img'+i).children(0).attr('height','80%');
    }
    function createMyPaint(obj){   //创建图片
        var img = new Image();
        img.src = obj.path;
        img.height = '100';
        img.width = '100';
        return img;
    }
}

$('.changePwd').click(function(){    //修改密码
	var index = layer.open({
	  	type: 2, 
	  	content: 'changePwd.html',
	  	area: ['70%','55%']
	});
	localStorage.removeItem('changePwd');
	var timer = setInterval(function(){
		if( localStorage.getItem('changePwd') ){
			layer.close(index);
			clearInterval(timer);
		}
	}, 1000);
});

$('.outLogin').click(function(){ 	//退出登录
	layer.confirm('是否退出登录?', {
		icon: 3, 
		title:'提示',
		area: ['40%','20%']
	}, function(index){
	  	localStorage.removeItem('用户');
	  	layer.close(index);
	  	$.get({
	  		url: '/user/loginOut',
	  		data: {
	  			username: $('.user').html()
	  		}
	  	});
	  	window.location = 'index.html';
	});
});

$('.goback').click(function(){
	window.history.go(-1);
});

$('.myFollow').click(function(){    //我的关注
	window.location = 'myFollow.html';
});

$('.myFans').click(function(){	  //我的粉丝
	window.location = "myFans.html";
});




