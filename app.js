var express = require("express");
var app = express();

app.use(express.static('static'));    //设置静态文件

function loadModular(app,path,arr){   //app为主文件，path为app文件的路由的文件夹(routes)，arr为要加载的模块数组
	for( var i=0; i<arr.length; i++ ){
		app.use( '/'+arr[i],require( './'+path+'/'+arr[i] ) );
	}
}

var arr = ['user','upload','paint','follow','commet','admin'];
loadModular(app,'routes',arr);

// var user = require("./routes/user");    //登录注册模块
// app.use('/user',user);

// var upload = require("./routes/upload");   //上传模块
// app.use('/upload',upload);

// var paint = require("./routes/paint");    //渲染图片模块
// app.use('/paint',paint);

// var follow = require("./routes/follow");    //关注模块
// app.use('/follow',follow);

// var commet = require("./routes/commet");     //评论模块
// app.use('/commet',commet);

// var admin = require("./routes/admin");   //管理员模块
// app.use('/admin',admin);

app.listen('8081',function(){
	console.log("监听成功，地址为http://127.0.0.1:8081");
});