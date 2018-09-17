$('.goback').click(function(){
	window.history.go(-1);
});

$.ajax({   //获取我的粉丝
	url: '/follow/getMyFans',
	data: {
		userFollowed: localStorage.getItem('用户')
	},
	success: function(res){
		if( res.length==0 ){
			$('.myFollowAuthors').prepend("<li style='text-align:center;'>还没有人关注你</li>");
		}
		else{
			for( let i=res.length-1; i>=0; i-- ){  //<button class='layui-btn layui-btn-radius follow'>互相关注</button>
				$('.myFollowAuthors').prepend("<li style='text-align:center;'><span class='register_in author author"+i+"'>"+res[i].user_follow+"</span></li>");
			}
			// $('.follow').click(function(){   //互相关注
			// 	$.ajax({
			// 		url: '/follow/FollowOther',
			// 		data: {
			// 			userFollow: localStorage.getItem('用户'),
			// 			userFollowed: $(this).prev().html()
			// 		},
			// 		success: (res)=>{
			// 			// location.reload();
			// 			$(this).css({
			// 				// backgroudColor: '#eee',
			// 				color: '#fff'
			// 			});
			// 		}
			// 	});
			// });
			$('.author').click(function(){    //查看他人信息
				localStorage.setItem('otherName',$(this).html());
				window.location = 'otherInformation.html';
			});
		}
	}
});



