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

router.get('/agree',function(req,res){   //赞or踩
	var judgeAttitudeStr = "select attitude from agree where username='"+req.query.username+"' and path='"+req.query.path+"'";
	connection.query(judgeAttitudeStr,function(err,rs){
		if(err){console.log(err);}
		else{
			if( rs.length==0 ){		//用户对该作品没有表态
				var addAttitudeStr = "insert into agree(username,path,attitude) values('"+req.query.username+"','"+req.query.path+"','"+req.query.attitude+"')";
				connection.query(addAttitudeStr,function(err,rs){   //插入态度
					if(err){console.log(err);}
				});

				var addHotStr = "update paint set hot=hot+1 where path='"+req.query.path+"'";
				connection.query(addHotStr,function(err,rs){   //增加热度
					if(err){console.log(err);}
				});

				var changeNumStr = "update paint set "+req.query.attitude+"="+req.query.attitude+"+"+1+" where path='"+req.query.path+"'";
				connection.query(changeNumStr,function(err,rs){
					if(err){console.log(err);}
				});
			}
			else{	//改变表态
				var changeAttitudeStr = "update agree set attitude='"+req.query.attitude+"' where username='"+req.query.username+"' and path='"+req.query.path+"'";
				connection.query(changeAttitudeStr,function(err,rs){
					if(err){console.log(err);}
				});

				if( rs[0].attitude=='agree'&&req.query.attitude=='opposition' ){   //之前赞，现在踩
					var str = "update paint set agree=agree-1,opposition=opposition+1 where path='"+req.query.path+"'";
				}
				else if( rs[0].attitude=='agree'&&req.query.attitude=='agree' ){   //之前赞，现在再点
					obj = {}
					var str = "update paint set agree=agree-1 where path='"+req.query.path+"'";
					var deleteStr = "delete from agree where username='"+req.query.username+"' and path='"+req.query.path+"'";
					connection.query(deleteStr,function(err,rs){
						if(err){console.log(err);}
					});
				}
				else if( rs[0].attitude=='opposition'&&req.query.attitude=='agree' ){    //之前踩，现在赞
					var str = "update paint set agree=agree+1,opposition=opposition-1 where path='"+req.query.path+"'";
				}
				else if( rs[0].attitude=='opposition'&&req.query.attitude=='opposition'  ){   //之前踩，现在再点
					obj = {};
					var str = "update paint set opposition=opposition-1 where path='"+req.query.path+"'";
					var deleteStr = "delete from agree where username='"+req.query.username+"' and path='"+req.query.path+"'";
					connection.query(deleteStr,function(err,rs){
						if(err){console.log(err);}
					});
				}
				connection.query(str,function(err,rs){
					if(err){console.log(err);}
				});

				var addHotStr = "update paint set hot=hot+1 where path='"+req.query.path+"'";
				connection.query(addHotStr,function(err,rs){   //增加热度
					if(err){console.log(err);}
				});
			}
		}
	});
	res.end();
});

router.get('/getCommet',function(req,res){    //获取评论
	var getCommetStr = "select * from commet where path='"+req.query.path+"' order by CAST(time AS DECIMAL) desc";
	connection.query(getCommetStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json(rows);
		}
	});
});

router.get('/commet',function(req,res){    //评论
	var obj = req.query;
	var time = Date.parse(new Date());
	var addCommetStr = "insert into commet(path,user_commet,user_commeted,words,time) values('"+obj.path+"','"+obj.person1+"','"+obj.person2+"','"+obj.content+"','"+time+"')";
	connection.query(addCommetStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json({
				state : 'true',
				time : time
			});
		}
	});
});

module.exports = router;