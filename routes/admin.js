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
connection.connect();

router.get('/login',function(req,res){  //登录
	if( req.query.adminName=='admin'&&req.query.password==123456 ){
		res.send({
			state : 'true'
		});
	}
	else{
		res.send({
			state : 'false'
		});
	}
});

router.get('/getData',function(req,res){  //获取画作
	if( req.query.type==0 ){
		var getDataStr = "select author,title,path,time,exam_state from paint order by time";
	}
	else if( req.query.type==1 ){
		var getDataStr = "select author,title,path,time,exam_state from paint where exam_state='null' order by time";
	}
	else if( req.query.type==2 ){
		var getDataStr = "select author,title,path,time,exam_state from paint where exam_state='pass' order by time";
	}
	else if( req.query.type==3 ){
		var getDataStr = "select author,title,path,time,exam_state from paint where exam_state='fail' order by time";
	}
	connection.query(getDataStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json(rows);
		}
	});
});

router.get('/getUser',function(req,res){  //获取用户
	var getUserStr = "select * from user";
	connection.query(getUserStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json(rows);
		}
	});
});

router.get('/exam',function(req,res){   //通过或者不通过
	if( req.query.result=='pass' ){
		var examStr = "update paint set exam_state='pass' where path='"+req.query.path+"'";
		var msg = '审核';
	}
	else if( req.query.result=='fail' ){
		var examStr = "update paint set exam_state='fail' where path='"+req.query.path+"'";
		var msg = '审核';
	}
	else if( req.query.result=='del' ){
		var examStr = "delete from paint where path='"+req.query.path+"'";
		var msg = '删除';
	}
	connection.query(examStr,function(err,rows){
		if(err){
			console.log(err);
			res.json({
				msg : msg+'失败'
			});
		}
		else{
			res.json({
				msg : msg+'成功'
			});
		}
	});
});

router.get('/delUser',function(req,res){   //删除用户
	var delUserStr1 = "delete from user where username='"+req.query.username+"'";
	connection.query(delUserStr1,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	var delUserStr2 = "delete from paint where author='"+req.query.username+"'";
	connection.query(delUserStr2,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	var delUserStr3 = "delete from login_state where username='"+req.query.username+"'";
	connection.query(delUserStr3,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	var delUserStr4 = "delete from follow where user_follow='"+req.query.username+"' or user_followed='"+req.query.username+"'";
	connection.query(delUserStr4,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	var delUserStr5 = "delete from commet where user_commet='"+req.query.username+"' or user_commeted='"+req.query.username+"'";
	connection.query(delUserStr5,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	var delUserStr6 = "delete from collection where username='"+req.query.username+"'";
	connection.query(delUserStr6,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	var delUserStr7 = "delete from agree where username='"+req.query.username+"'";
	connection.query(delUserStr7,function(err,rows){
		if(err){
			console.log(err);
		}
	});
	res.end();
});

router.get('/search',function(req,res){   //搜索
	if( req.query.type=='paint' ){
		var searchStr = "select author,title,path,time,exam_state from paint where author='"+req.query.content+"' or title='"+req.query.content+"' order by time";
	}
	else{
		var searchStr = "select * from user where username='"+req.query.content+"' order by time";
	}
	connection.query(searchStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json(rows);
		}
	});
});

module.exports = router;
