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

connection.connect();    //连接数据库

router.get('/judgeIsFollow',function(req,res){    //判断初始的关注状态
	var judgeIsFollowStr = "select user_followed from follow where user_follow='"+req.query.userFollow+"'";
	connection.query(judgeIsFollowStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			if( rs.length>0 ){
				for( var i=0; i<rs.length; i++ ){
					if( rs[i].user_followed==req.query.userFollowed ){
						res.json({
							state: true
						});
						break;
					}
				}
			}
		}
	});
});

router.get('/followOther',function(req,res){   //关注
	var followOtherStr = "insert into follow (user_follow,user_followed) values ('"+req.query.userFollow+"','"+req.query.userFollowed+"')";
	connection.query(followOtherStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json({
				state: true
			});
		}
	});
});

router.get('/cancelFollowOther',function(req,res){    //取消关注
	var cancelFollowOtherStr = "delete from follow where user_follow='"+req.query.userFollow+"' and user_followed='"+req.query.userFollowed+"'";
	connection.query(cancelFollowOtherStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json({
				state: true
			});
		}
	});
});

router.get('/getMyFollow',function(req,res){    //我的关注
	var getMyFollowStr = "select user_followed from follow where user_follow='"+req.query.userFollow+"'";
	connection.query(getMyFollowStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json(rs);
		}
	});
});

router.get('/getMyFans',function(req,res){    //我的粉丝
	var getMyFansStr = "select user_follow from follow where user_followed='"+req.query.userFollowed+"'";
	connection.query(getMyFansStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json(rs);
		}
	});
});

module.exports = router;