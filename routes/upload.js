var express = require("express");
var router = express.Router();
var mysql = require('mysql');
var multer  = require('multer');
var fs = require('fs');
var bodyParser = require('body-parser');
router.use(bodyParser.json());

//创建一个connection
var connection = mysql.createConnection({
	host: '127.0.0.1',    //主机 
	user: 'root',        //MySQL认证用户名
	password: '19961001',    //MySQL认证用户密码
	database: 'test',
	port: '3306'          //端口号
});

connection.connect();    //连接数据库

//本地上传处理
var upload = multer({ dest: 'static/uploads/' });  //设置上传图片的存储路径
router.post('/upload_photo_offline', upload.single('file'), function (req, res, next) {
	var path = '../uploads/' + req.file.filename;    //拼接图片路径
	var filename = req.file.originalname.replace(/\..*/,'');
	var time = Date.parse(new Date());
	var addPaintStr = "insert into paint values('"+req.body.author+"','"
												  +filename+"','"
												  +path+"','"
												  +time+"',0,0,0,'null')";
	connection.query(addPaintStr,function(err,rs){
		if(err) {
			console.error("上传失败:"+err);
		}
		else {
			res.json({
				'code' : '0',
				'path' : path
			});
		}
		
	});
});

//在线上传处理
router.get('/upload_photo_online',function(req,res){
	var randomName = definePhotoName();
	var path = '../uploads/' + randomName;
	var time = Date.parse(new Date());
	var addPaintStr = "insert into paint values('"+req.query.author+"','"
												  +req.query.title+"','"
												  +path+"','"
												  +time+"',0,0,0,'null')";
	connection.query(addPaintStr,function(err,rs){
		if(err) {
			console.error("上传失败:"+err);
		}
		else {
			var base64Data=req.query.src.replace(/^data:image\/png;base64,/,"");
			var binaryData=new Buffer(base64Data,'base64').toString('binary');
			fs.writeFile('./static/uploads/'+randomName,binaryData,'binary',function(err){   //创建图片保存在服务器
				if(err){
					console.log(err);
				}
			});
			res.json({
				'code' : '0',
				'path' : path
			});
		}
	});
	function definePhotoName(){  //随机生成一个字符串
		randomLength = Math.ceil(Math.random*8);
	  	return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
	}
});
	
module.exports = router;
