$('.goback').click(function(){
	window.history.go(-1);
});

$.ajax({   //获取我关注的用户
	url: '/follow/getMyFollow',
	data: {
		userFollow: localStorage.getItem('用户')
	},
	success: function(res){
		if( res.length==0 ){
			$('.myFollowAuthors').prepend("<li style='text-align:center;'>没有关注任何人</li>");
		}
		else{
			for( let i=res.length-1; i>=0; i-- ){
				$('.myFollowAuthors').prepend("<li>&nbsp;&nbsp;&nbsp;&nbsp;<span class='register_in author author"+i+"'>"+res[i].user_followed+"</span><button class='layui-btn layui-btn-radius follow'>取消关注</button></li>");
			}
			$('.follow').click(function(){   //取消关注
				$.ajax({
					url: '/follow/cancelFollowOther',
					data: {
						userFollow: localStorage.getItem('用户'),
						userFollowed: $(this).prev().html()
					},
					success: (res)=>{
						location.reload();
					}
				});
			});

			$('.author').click(function(){    //查看他人信息
				localStorage.setItem('otherName',$(this).html());
				window.location = 'otherInformation.html';
			});
		}
	}
});



