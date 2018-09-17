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

app.listen('8081',function(){
	console.log("监听成功，地址为http://127.0.0.1:8081");
});