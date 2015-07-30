//分享到好友
function share_friend(title, description, url, imgUrl, callback)
{
	WeixinJSBridge.on('menu:share:appmessage', function(argv){ 
	 	WeixinJSBridge.invoke('sendAppMessage',{
				"appid":"",                                       //appid 设置空就好了。
				"img_url":	 imgUrl,                              //分享时所带的图片路径
				"img_width":	"120",                            //图片宽度
				"img_height":	"120",                            //图片高度
				"link":url,                                       //分享附带链接地址
				"desc": description,    			                      //分享内容介绍
				"title":title
			}, function(res){if (callback && (typeof callback == 'function')) callback.call(this, [res]);});
	 });
}

//分享到朋友圈
function share_zone(title, description, url, imgUrl, callback)
{
	WeixinJSBridge.on('menu:share:timeline', function(argv){ 
	 	WeixinJSBridge.invoke('shareTimeline',{
				"appid":"",                                       //appid 设置空就好了。
				"img_url":	 imgUrl,                              //分享时所带的图片路径
				"img_width":	"120",                            //图片宽度
				"img_height":	"120",                            //图片高度
				"link":url,                                       //分享附带链接地址
				"desc": description,    			                      //分享内容介绍
				"title":title
			}, function(res){if (callback && (typeof callback == 'function')) callback.call(this, [res]);});
	 });
}

//分享到微博
function share_weibo(content, url, callback) {
	WeixinJSBridge.on('menu:share:weibo', function(argv){
		WeixinJSBridge.invoke('shareWeibo',{
			"content":content,
			"url":url
			}, function(res){if (callback && (typeof callback == 'function')) callback.call(this, [res]);});
	});
}