$('.changePwd').click(function(){
	if( $('.passwordNew').val()==$('.passwordSame').val() ){
		$.ajax({
			url : '/user/changePwd',
			data: {
				username : localStorage.getItem('用户'),
				passwordOld : $('.password').val(),
				passwordNew : $('.passwordNew').val()
			},
			success:function(res){
				if( res.status ){
					layer.msg('修改成功', {
	                    icon: 1,
	                    time: 1000
	                }, function(){
	                    localStorage.setItem('changePwd','true');
	                    localStorage.removeItem(localStorage.getItem('用户'));
	                });
				}
			}
		});
	}
	else{
		layer.msg('两次密码不一致',{
			icon: 2,
			time: 1000,
			anim: 6
		});
	}
	
});
