var $,tab,skyconsWeather;
layui.config({
	base : "js/"
}).use(['bodyTab','form','element','layer','jquery'],function(){
	var form = layui.form(),
		layer = layui.layer,
		element = layui.element();
		$ = layui.jquery;
		tab = layui.bodyTab();

	$(document).on('keydown', function() {
		if(event.keyCode == 13) {
			$("#unlock").click();
		}
	});

	//手机设备的简单适配
	var treeMobile = $('.site-tree-mobile'),
		shadeMobile = $('.site-mobile-shade')

	treeMobile.on('click', function(){
		$('body').addClass('site-mobile');
	});

	shadeMobile.on('click', function(){
		$('body').removeClass('site-mobile');
	});

	//刷新后还原打开的窗口
	if(window.sessionStorage.getItem("menu") != null){
		menu = JSON.parse(window.sessionStorage.getItem("menu"));
		curmenu = window.sessionStorage.getItem("curmenu");
		var openTitle = '';
		for(var i=0;i<menu.length;i++){
			openTitle = '';
			if(menu[i].icon.split("-")[0] == 'icon'){
				openTitle += '<i class="iconfont '+menu[i].icon+'"></i>';
			}else{
				openTitle += '<i class="layui-icon">'+menu[i].icon+'</i>';
			}
			openTitle += '<cite>'+menu[i].title+'</cite>';
			openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="'+menu[i].layId+'">&#x1006;</i>';
			element.tabAdd("bodyTab",{
				title : openTitle,
		        content :"<iframe src='"+menu[i].href+"' data-id='"+menu[i].layId+"'></frame>",
		        id : menu[i].layId
			})
			//定位到刷新前的窗口
			if(curmenu != "undefined"){
				if(curmenu == '' || curmenu == "null"){  //定位到后台首页
					element.tabChange("bodyTab",'');
				}else if(JSON.parse(curmenu).title == menu[i].title){  //定位到刷新前的页面
					element.tabChange("bodyTab",menu[i].layId);
				}
			}else{
				element.tabChange("bodyTab",menu[menu.length-1].layId);
			}
		}
	}

	if( !localStorage.getItem('admin') ){
		$('.login').css('visibility','visible');
		var index = layer.open({   //登录
			type: 1,
			title: '请登录',
			content: $('.login'),
			area: ['500px','330px'],
			closeBtn: 0,
			anim: 3,
			success : function(){
				$('.piantContent').css('visibility','hidden');
			}
		});
	}

	$('.reInput').click(function(){   //重置
		$('.login input').val('');
	});

	$('.loginIn').click(function(){   //管理员登录
		$.get({
			url : '/admin/login',
			data : {
				adminName : $('.adminName').val(),
				password : $('.password').val()
			},
			success : function(res){
				if( res.state=='true' ){
					layer.msg('登录成功',{
						icon: 1,
						time: 1000,
						success : function(){
							layer.close(index);
						}
					});
					$('.piantContent').css('visibility','visible');
					localStorage.setItem('admin','true');
					$('.login').css('visibility','hidden');
				}
				else{
					layer.msg('登录失败',{
						icon: 2,
						time: 1000,
						success : function(){
							$('.login input').val('');
						}
					});
				}
			}
		});
	});

	$('.loginOut').click(function(){   //登出
		localStorage.removeItem('admin');
		window.location.reload();
	});

	function createTable(arr){
		var str = "";
		for( var i=0; i<arr.length; i++ ){
			str += "<tr>"+
			      		"<td>"+arr[i].author+"</td>"+
			     	 	"<td>"+arr[i].title+"</td>"+
			     	 	"<td>"+arr[i].path+"</td>"+
			      		"<td>"+timestampToTime(parseInt(arr[i].time))+"</td>"+
			      		"<td>"+arr[i].exam_state+"</td>"+
			      		"<td><button class='see'>查看</button><button class='pass'>通过</button><button class='fail'>封禁</button><button class='del'>删除</button></td></tr>";

		}
		$('.piantContent').append(str);
	}

	function createUserTable(arr){
		var str = "";
		for( var i=0; i<arr.length; i++ ){
			str += "<tr>"+
			      		"<td>"+arr[i].username+"</td>"+
			     	 	"<td>"+arr[i].password+"</td>"+
			      		"<td>"+timestampToTime(parseInt(arr[i].time))+"</td>"
			      		+"<td><button class='delUser'>删除</button></td></tr>";

		}
		$('.piantContent').append(str);
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

	$.get({   //首次获取全部作品
		url : '/admin/getData',
		data : {
			type : 0
		},
		success : function(res){
			createTable(res);
		}
	});
	
	$('.navBar ul li:not(:last)').click(function(){   //左侧画作分类点击
		$('thead').empty();
		$('thead').append(
			"<tr class='paintNav'>"
	      		+"<th>作者</th>"
	      		+"<th>标题</th>"
	      		+"<th>路径</th>"
	      		+"<th>提交时间</th>"
	      		+"<th>状态</th>"
	      		+"<th>操作</th>"
	    	+"</tr>"
		);
		$('.piantContent').empty();
		$('.searchContent').val('');
		$.get({
			url : '/admin/getData',
			data : {
				type : $('li').index($(this))
			},
			success : function(res){
				createTable(res);
			}
		});
	});

	$('.navBar ul li:last').click(function(){  //左侧用户类点击
		$('thead').empty();
		$('thead').append(
			+"<tr class='userNav'>"
	    		+"<th>用户名</th>"
	    		+"<th>密码</th>"
	    		+"<th>注册时间</th>"
	    		+"<th>操作</th>"
	    	+"</tr>"
		);
		$('.piantContent').empty();
		$('.searchContent').val('');
		$.get({
			url : '/admin/getUser',
			data : {
				
			},
			success : function(res){
				createUserTable(res);
			}
		});
	});

	$('.piantContent').click(function(e){  //操作
		var status = $(e.target).parent().prev().html();
		if( $(e.target).attr('class')=='pass' ){   //过审
			if( status!='pass' ){
				$.get({
					url : '/admin/exam',
					data : {
						result : 'pass',
						path : $(e.target).parent().prev().prev().prev().html()
					},
					success : function(res){
						layer.msg(res.msg,{
							icon: 1,
							time: 1000
						});
						if( $('li').index($('.layui-this'))==0 ){  //全部
							$(e.target).parent().prev().html('pass');
						}
						else{		//下面的
							$(e.target).parent().parent().css('display','none');
						}
					}
				});
			}
		}
		else if( $(e.target).attr('class')=='fail' ){   //未过审
			if( status!='fail' ){
				$.get({
					url : '/admin/exam',
					data : {
						result : 'fail',
						path : $(e.target).parent().prev().prev().prev().html()
					},
					success : function(res){
						layer.msg(res.msg,{
							icon: 1,
							time: 1000
						});
						if( $('li').index($('.layui-this'))==0 ){  //全部
							$(e.target).parent().prev().html('fail');
						}
						else{		//下面的
							$(e.target).parent().parent().css('display','none');
						}
					}
				});
			}
		}
		else if( $(e.target).attr('class')=='del' ){   //删除作品
			$.get({
				url : '/admin/exam',
				data : {
					result : 'del',
					path : $(e.target).parent().prev().prev().prev().html()
				},
				success : function(res){
					layer.msg(res.msg,{
						icon: 1,
						time: 1000
					});
					$(e.target).parent().parent().css('display','none');
				}
			});
		}
		else if( $(e.target).attr('class')=='see' ){   //查看
			var src = '../'+$(e.target).parent().prev().prev().prev().html();
			$('.photo').css('background-image','url('+src+')');
			$('.photo').css('background-repeat','no-repeat');
			$('.photo').css('background-size','100% 100%');
			console.log($('.photo').width(),$('.photo').height());

			$('.photo').css('visibility','visible');
			var index1 = layer.open({   //图片展示
				type: 1,
				title: '预览',
				scrollbar: false,
				area: '500px',
				content: $('.photo'),
				cancel: function(index1, layero){ 
				 	$('.photo').css('visibility','hidden');
				    layer.close(index1);
				}
			});
		}
		else if( $(e.target).attr('class')=='delUser' ){   //删除用户
			$.get({
				url: '/admin/delUser',
				data: {
					username: $(e.target).parent().prev().prev().prev().html()
				},
				success: function(res){
					$(e.target).parent().parent().css('display','none');
				}
			});
		}
	});

	$('.search').click(function(){   //搜索
		if( $('.searchContent').val()=='' ){
			layer.msg('搜索内容不能为空哦',{
				icon: 2,
				time: 1500,
				anim: 6
			});
		}
		else{
			if( $('thead tr').attr('class')=='paintNav' ){   //搜索作品
				$.get({
					url : '/admin/search',
					data : {
						content : $('.searchContent').val(),
						type: 'paint'
					},
					success : function(res){
						if( res.length==0 ){
							layer.msg('没有任何相关内容',{
								icon: 2,
								time: 1000,
								anim: 6
							});
						}
						else{
							$('.piantContent').empty();
							createTable(res);
						}
					}
				});
			}
			else{   //搜索用户
				$.get({
					url : '/admin/search',
					data : {
						content : $('.searchContent').val(),
						type: 'user'
					},
					success : function(res){
						if( res.length==0 ){
							layer.msg('没有任何相关内容',{
								icon: 2,
								time: 1000,
								anim: 6
							});
						}
						else{
							$('.piantContent').empty();
							createUserTable(res);
						}
					}
				});
			}
		}
	});
});
