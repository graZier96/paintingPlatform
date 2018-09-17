$(function(){
	var patternUser = /^[A-Za-z0-9\u4e00-\u9fa5]{2,8}$/;
	var patternPwd = /^[A-Za-z0-9]{6,12}$/;
	$('.register_in').click(function(){    //注册验证
		var strUser = $('.username').val();
		var strPwd = $('.password').val();
		var strPwdRe = $('.password_re').val();

		if( !strUser||!strPwd ){
			layer.msg( '请将账号密码填写完整',{
				icon: 2,
				time: 2000
			});
		}
		else if( patternUser.test(strUser)==false||patternPwd.test(strPwd)==false ){
			layer.msg( '账号或密码格式错误',{
				icon: 2,
				time: 2000
			});
		}
		else if( strPwd!=strPwdRe ){    //验证两次密码是否相等
			layer.msg( '两次密码不一致',{
				icon: 2,
				time: 2000
			});
		}
		else{
			$.ajax({
				type : 'get',
				url : '/user/register_user',
				data : {
					username : $('.username').val(),
					password : $('.password').val()
				},
				success : function(res){
					if( res.status ) {
						$.get({
							url: '/user/addIsLogin',
							data: {
								username : $('.username').val()
							},
							success: function(res){
								
							}
						});
						layer.msg(res.msg,{
							icon: 1,
							time: 2000,
							success:function(){
								setTimeout(function(){
									window.location = 'index.html';
								}, 2000);
							}
						});
					}
					else {
						layer.msg(res.msg,{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		}
	});
	
	$('.username,.password').focus(function(){    //placeholder处理
		$(this).attr('placeholder','');
	});
	$('.username').blur(function(){
		$(this).attr('placeholder','2-8位中文数字字母');
	});
	$('.password').blur(function(){
		$(this).attr('placeholder','6-12位数字字母');
	});

	$('.goback').click(function(){    //返回
		sessionStorage.setItem('flag','true');
		window.history.go(-1);
	});

	
});
