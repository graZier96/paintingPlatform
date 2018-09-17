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

router.get('/get_paint',function(req,res){   //主页获取图片
	var getPaintStr = "select * from paint where exam_state='pass' order by time desc";
	connection.query(getPaintStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json(rs);
		}
	});
});

router.get('/photoInfo',function(req,res){    //图片详情
	var getPhotoInfo = "select * from paint where path='"+req.query.path+"'";
	connection.query(getPhotoInfo,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json(rs);
		}
	});
});

router.get('/getPersonPaint',function(req,res){    //获取个人中心区的图片
	var getMyPaintStr = "select * from paint where exam_state='pass' and author='"+req.query.username+"' order by time desc";
	connection.query(getMyPaintStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json(rs);
		}
	});
});

router.get('/searchPaint',function(req,res){    //搜索
	var getSearchPaint = "select * from paint where exam_state='pass' order by time desc";
	connection.query(getSearchPaint,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			if( !req.query.content ){  //搜索为空
				res.json(rows);
			}
			else{  //搜索不为空
				var reg=new RegExp(req.query.content,'i');
				for( var i=0; i<rows.length; i++ ){
					if( reg.test(rows[i].title)==false&&rows[i].author!=req.query.content ){
						rows.splice(i,1);
						i--;
					}
				}
				res.json(rows);
			}
		}
	});
	
});

router.get('/getFansNum',function(req,res){   //获取粉丝数量
	var getFansNumStr = "select count(*) as num from follow where user_followed='"+req.query.author+"'";
	connection.query(getFansNumStr,function(err,rs){
		if(err){
			console.log(err);
		}
		else{
			res.json(rs[0].num);
		}
	});
});

router.get('/getDynamics',function(req,res){   //获取动态
	var getDynamicsStr = "select paint.author,paint.title,paint.path,paint.time from paint JOIN follow where paint.exam_state='pass' and paint.author=follow.user_followed and follow.user_follow='"+req.query.username+"' order by paint.time desc";
	connection.query(getDynamicsStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json(rows);
		}
	});
});

router.get('/getCollection',function(req,res){   //获取收藏
	var getCollectionStr = "select paint.author,paint.title,paint.path,paint.time from paint JOIN collection where paint.exam_state='pass' and paint.path=collection.path and collection.username='"+req.query.username+"' order by paint.time desc";
	connection.query(getCollectionStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json(rows);
		}
	});
});

router.get('/judgeCollection',function(req,res){   //判断是否收藏
	var collectionStr = "select * from collection where username='"+req.query.username+"' and path='"+req.query.path+"'";
	connection.query(collectionStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			if( rows.length>0 ){
				res.json({
					state : 'true'
				});
			}
		}
	});
});

router.get('/collection',function(req,res){   //收藏or取消收藏
	if( req.query.flag=='true' ){
		var collectionStr = "insert into collection(username,path) values('"+req.query.username+"','"+req.query.path+"')";
		var msg = '收藏成功';
		var act = 'yes';
	}
	else{
		var collectionStr = "delete from collection where username='"+req.query.username+"' and path='"+req.query.path+"'";
		var msg = '取消收藏';
		var act = 'no';
	}
	connection.query(collectionStr,function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			res.json({
				act : act,
				msg : msg
			});
		}
	});
});

module.exports = router;