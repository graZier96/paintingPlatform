var express = require("express");
var router = express.Router();
var mysql = require('mysql');

//创建一个connection
var connection = mysql.createConnection({
	host: '127.0.0.1',    //主机 
	user: 'root',        //MySQL认证用户名
	password: '19961001',    //MySQL认证用户密码
	database: 'test',
	port: '3306'          //端口号
});

//连接数据库
connection.connect(function(err){
	if(err) {
		console.error("连接数据库失败:"+err);
	}
	else {
		console.log("连接数据库成功！");
	}
});

//用户登录处理
router.get('/get_user',function(req,res){
	var getUserStr = "select username,password from user";
	connection.query(getUserStr,(err,rs)=>{
		if(err) {
			console.error("查询失败:"+err);
		}
		else {
			for ( var i = 0; i < rs.length; i++ ) {
				if( req.query.username==rs[i].username&&req.query.password==rs[i].password ){
					var judgeIsLoginStr = "select state from login_state where username='"+rs[i].username+"'";
					connection.query(judgeIsLoginStr,(err,rs1)=>{
						if(err){
							console.log(err);
						}
						else{
							if( rs1[0].state=='true' ){  //判断该用户是否在线
								res.json({
									msg: rs[i].username+"is online"
								});
							}
							else{
								var changeLoginState = "update login_state set state='true' where username='"+rs[i].username+"'";
								connection.query(changeLoginState,(err,rs2)=>{
									if(err){
										console.log(err);
									}	
									else{
										res.json({
											status : true,
											msg : "登录成功"
										});
									}
								});
							}
						}
					});
					break;
				}
			}
			if( i==rs.length ){
				res.json({
					msg : "登录失败"
				});
			}
		}
	});
});

//用户退出处理
router.get('/loginOut',function(req,res){
	var loginOutStr = "update login_state set state='false' where username='"+req.query.username+"'";
	connection.query(loginOutStr,function(err){
		if(err){
			console.log(err);
		}
	});
});

//用户注册处理
router.get('/register_user',function(req,res){
	var obj = {};
	var time = Date.parse(new Date());
	var addUserStr = "insert into user values('"+req.query.username+"','"+req.query.password+"','"+time+"')";
	connection.query(addUserStr,function(err,rs){   //将用户信息插入数据库
		if(err) {
			console.error("注册失败:"+err);
			obj = {
				status : false,
				msg : "注册失败",
				data : {}
			}
		}
		else {
			obj = {
				status : true,
				msg : "注册成功",
				data : {}
			}
		}
		res.json(obj);
	});
});

//修改密码
router.get('/changePwd',function(req,res){
	var obj = {};
	var judgePwdStr = "select password from user where username='"+req.query.username+"'";
	connection.query(judgePwdStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			if( rs[0].password==req.query.passwordOld ){   //旧密码输入正确
				//修改密码
				var changePwdStr = "update user set password="+req.query.passwordNew+" where username='"+req.query.username+"'";
				connection.query(changePwdStr,function(err,rs){
					if(err){
						console.log(err);
					}
					else{
						obj = {
							status: true
						}
					}
					res.json(obj);
				});
			}
			else{
				res.json({
					msg: '旧密码输入错误'
				});
			}
		}
	});
});

//初始化注册后的登录状态
router.get('/addIsLogin',function(req,res){
	var addLoginStr = "insert into login_state values('"+req.query.username+"','false')";
	connection.query(addLoginStr,function(err,rs){
		if(err){
			console.log(err);
		}
	});
});

//判断当前用户是否存在
router.get('/userIsExist',function(req,res){
	var userIsExistStr = "select * from user where username='"+req.query.username+"'";
	connection.query(userIsExistStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			if( !rows[0] ){
				res.json({
					state : true
				});
			}
			else{
				res.end();
			}
		}
	});
});

module.exports = router;
