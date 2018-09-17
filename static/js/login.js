$(function(){
	$('.verify').keyup(function(){   //验证账号和密码
		$(this).next().css('visibility','visible');
		var pattern_user = /^[a-zA-Z\u4e00-\u9fa5_]{4,12}$/;
		var pattern_pwd = /^[a-zA-Z0-9]{6,12}$/;
		var pattern = $(this).next().attr('id') == 'user_icon' ? pattern_user : pattern_pwd ;
		var str = $(this).val();
		if( pattern.test(str) ){
			$(this).next().removeClass('fault');
			$(this).next().addClass('right');
		}
		else{
			$(this).next().removeClass('right');
			$(this).next().addClass('fault');
		}
		
		if( !str ){   //账号密码为空时去除判断图片
			$(this).next().css('visibility','hidden');
		}
	});
	
	$('.verify').focus(function(){
		$(this).attr('placeholder','');
	});
	$('#name').blur(function(){
		$(this).attr('placeholder','请输入4-12位汉字、数字、字母或下划线');
		for( var i=0; i<localStorage.length; i++ ){   //获取localstorage存储的密码
			if( localStorage.key(i)==$(this).val() ){
				document.getElementById('pwd').value = localStorage.getItem(localStorage.key(i));
				break;
			}
		}
	});
	$('#pwd').blur(function(){
		$(this).attr('placeholder','请输入6-12位字母或数字');
	});
	
	//用户登录提交
	$('#login').click(function(){
		$.ajax({
			type : 'get',
			url : '/user/get_user',
			data : {
				username : $('#name').val(),
				password : $('#pwd').val()
			},
			success : function( res ){
				if( res.status ) {
					alert(res.msg);
					if ( $('#remember_pwd').is(':checked') ) {   //记住密码
					    localStorage.setItem($('#name').val(),$('#pwd').val());
					}
				}
				else {
					alert(res.msg);
				}
			}
		});		
	});
	
});
