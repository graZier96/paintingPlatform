var otherName = localStorage.getItem('otherName');  //获取当前用户的用户名
$('title,.otherName').html(otherName);

$.ajax({
	url : '/paint/getPersonPaint',
	data: {
		username : otherName
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

$('.goback').click(function(){
	window.history.go(-1);
});




