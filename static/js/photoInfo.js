var res = localStorage.getItem('photoMessage');
res = JSON.parse(res);
var src = '../uploads/' + res[0].path;
$('img').attr('src',src);
$('.title').html(res[0].title);
$('.username').html(res[0].author);
$('.time').html(res[0].time);

$.get({   //获取作品信息
	url : '/paint/photoInfo',
	data : {
		path : res[0].path
	},
	success : function(res){
		$('.agree span').html(res[0].agree);
		$('.opposition span').html(res[0].opposition);
		$('.hot span').html(res[0].hot);
	}
});

$.get({
	url : '/paint/getFansNum',
	data: {
		author : res[0].author
	},
	success : function(res){
		$('.followNum').html(res+'人关注');
	}
});

if( localStorage.getItem('用户')!=res[0].author ){   //判断当前用户是否关注了该作者
	$.ajax({
		url: '/follow/judgeIsFollow',
		data: {
			userFollow: localStorage.getItem('用户'),
			userFollowed: res[0].author
		},
		success: function(res){
			if( res.state ){
				$('.follow').css({
					backgroundColor:'#ddd',
					color : 'black'
				});
				$('.follow').html('已关注');
			}
		}
	});
}

$('.userInfo').click(function(){   //查看作者个人信息
	if( localStorage.getItem('用户')==$('.username').html() ){    //自己
		window.location = 'userInformation.html';
	}
	else{
		localStorage.setItem('otherName',$('.username').html());    //别人
		window.location = 'otherInformation.html';
	}
});


$('.follow').click(function(){   //关注
	if( !localStorage.getItem('用户') ){
		layer.msg('请先登录',{
			icon: 2,
			time: 1000,
			anim: 6
		});
	}
	else if( localStorage.getItem('用户')==res[0].author ){
		layer.msg('不能关注自己',{
			icon: 2,
			time: 1000,
			anim: 6
		});
	}
	else if( $('.follow').html()=='关注' ){
		$.ajax({
			url: '/follow/followOther',
			data: {
				userFollow: localStorage.getItem('用户'),
				userFollowed: res[0].author
			},
			success: function(res){
				if( res.state ){
					$('.follow').css({
						backgroundColor:'#ddd',
						color : 'black'
					});
					$('.follow').html('已关注');
				}
			}
		});
	}
	else{
		layer.open({
			title: false,
			content: '确认取消关注吗',
			skin: 'layui-layer-molv',
			area: '80%',
			btn: ['再想想','取消关注'],
			yes: function(index,layero){
				layer.close(index);
			},
			btn2: function(index,layero){
				$.ajax({
					url: '/follow/cancelFollowOther',
					data: {
						userFollow: localStorage.getItem('用户'),
						userFollowed: res[0].author
					},
					success: function(res){
						if( res.state ){
							$('.follow').css({
								backgroundColor:'#009688',
								color : '#fff'
							});
							$('.follow').html('关注');
						}
					}
				});
			}
		});
	}
});

$('.agree,.opposition').click(function(){
	if( !localStorage.getItem('用户') ){
		layer.msg('请先登录',{
			icon: 2,
			time: 1000,
			anim: 6
		});
	}
	else{
		$.get({
			url : '/commet/agree',
			data : {
				username: localStorage.getItem('用户'),
				path: res[0].path,
				attitude : $(this).attr('class')
			},
			success: function(res){
				var sum = parseInt($('.hot span').html())+1;
				$('.hot span').html(sum);
			}
		});
	}

});

// 评论区
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

$.get({    //获取评论
	url : '/commet/getCommet',
	data : {
		path : res[0].path
	},
	success: function(rows){
		if( rows.length==0 ){
			$('.noCommet').css('display','block');
		}
		else{
			for(var i=0; i<rows.length; i++ ){
				$('.commetArea').prepend(
					"<div class='reback'>"
	                	+"<span class='speak1'>"+rows[i].user_commet+"</span>：<span class='rebackContent'>"+rows[i].words+"</span><span class='time'>"+timestampToTime(parseInt(rows[i].time))+"</span>"
	                +"</div>"
				);
			}
		}
	}
});

$('.rebackAuthor').click(function(){   //添加评论
	if( localStorage.getItem('用户') ){
		$.get({
			url : '/commet/commet',
			data : {
				person1 : localStorage.getItem('用户'),
				person2 : res[0].author,
				path : res[0].path,
				content : $('.rebackAuthorText').val()
			},
			success : function(res){
				if( res.state ){
					$('.commetArea').prepend(
						"<div class='reback'>"
		                	+"<span class='speak1'>"+localStorage.getItem('用户')+"</span>：<span class='rebackContent'>"+$('.rebackAuthorText').val()+"</span><span class='time'>"+timestampToTime(parseInt(res.time))+"</span>"
		                +"</div>"
					);
					$('.rebackAuthorText').val('');
					$('.noCommet').css('display','none');
				}
			}
		});
	}
	else{
		layer.msg('需要先登录',{
			icon: 2,
			time: 1000,
			anim: 6,
			success : function(){
				$('.rebackAuthorText').val('');
			}
		});
	}
});

if( localStorage.getItem('用户') ){
	$.get({
		url : '/paint/judgeCollection',
		data : {
			username: localStorage.getItem('用户'),
			path: res[0].path
		},
		success : function(res){
			if( res.state ){
				$('.collectionIcon').addClass('colorActive');
			}
		}
	});

	$('.collectionIcon').click(function(){
		if( !$('.collectionIcon').hasClass('colorActive') ){
			var flag = 'true';
		}
		else{
			var flag = 'false';
		}
		$.get({
			url : '/paint/collection',
			data : {
				flag: flag,
				username: localStorage.getItem('用户'),
				path: res[0].path
			},
			success : function(res){
				if( res.act=='yes' ){
					$('.collectionIcon').addClass('colorActive');
				}
				else{
					$('.collectionIcon').removeClass('colorActive');
				}
				layer.msg(res.msg,{
					icon: 1,
					time: 1000
				});
			}
		});
	});
}

$('.collection').click(function(){
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






