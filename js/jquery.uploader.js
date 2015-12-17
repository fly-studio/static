(function($){
	if(typeof COMMON_LANGUAGE == 'undefined')
		throw('this javascript file need behind \'common.js\'');
	var scripts = document.getElementsByTagName("script");
	var querys = $.deparam.querystring((scripts[ scripts.length - 1 ]).src);
	$.session_id = querys['session_id'];
	
	$.fn.extend({
		uploader : function(max_width, max_height, filesize, filetype, filelimit, id) {
			if (max_width !== true)
				max_width = $.isUndefined(max_width) ? 0 : parseFloat(max_width);
			max_height = $.isUndefined(max_height) ? 0 : parseFloat(max_height);
			filesize = $.isUndefined(filesize) ? 2 * 1024 * 1024 : filesize; //2 MB
			filetype = $.isUndefined(filetype) ? 'jpg,jpeg,png,bmp,gif,webp,svg' : filetype.toLowerCase();
			filelimit = isNaN(filelimit) ? 1 : parseInt(filelimit);
			var img_types = ['jpg','jpeg','png','bmp','gif','webp','svg'];
			return this.each(function(){
				var t = $(this);

				var flex_uploader = t.prop('flex_uploader') ? t.prop('flex_uploader') : {};
				if (flex_uploader && flex_uploader.uploader)
				{ //删除原有的控件
					delete flex_uploader.uploader;
					flex_uploader.$container.remove();
					t.prop('flex_uploader', {});
				}
				//删除该控件，下面的不用执行
				if (max_width === true) return;

				var method = {};
				var nonce = function(){
					return rand(10000,99999);
				};
				var uploader_id = 'uploader-id-' + nonce(), pick_id = 'pick-id-' + nonce();
				var progresses_id = uploader_id + '-progresses',thumbnails_id = uploader_id + '-thumbnails', input_id = uploader_id + '-input';
				//添加容器到input下
				flex_uploader.$container = $('<div class="uploader-container" id="'+uploader_id+'"><div class="drop-tips text-info"><h2>\u62d6\u5230\u6587\u4ef6\u5230\u8fd9\u91cc</h2><br /><br /><div class="btn btn-info" onclick="javascript:jQuery(this).parent().hide().parent(\'.uploader-container\').removeClass(\'webuploader-dnd-over\');"><i class="glyphicon glyphicon-remove"></i> \u5173;\u95ed;</div></div>\
					<div class="pull-left"><span id="'+pick_id+'">\u9009\u62e9\u6587\u4ef6(\u2264 '+bytesToSize(filesize)+')</span></div>'
					+ '<div class="pull-left tags">&nbsp;<span class="label label-success">.' + filetype.replace(/,/g,'</span>&nbsp;<span class="label label-success">.') + '</span>'
					+ '&nbsp;<span class="label label-warning enable-tooltip" data-placement="top" title="\u53ef\u4ee5\u4f7f\u7528Ctrl+V\u76f4\u63a5\u7c98\u8d34\u622a\u56fe\uff08\u9700\u73b0\u4ee3\u6d4f\u89c8\u5668\uff09"><small class="glyphicon glyphicon-info-sign"></small> Ctrl+V \u622a\u56fe</span>&nbsp;<span class="label label-warning enable-tooltip" data-placement="top" title="\u652f\u6301\u4eceWindows\u4e2d\u62d6\u52a8\u6587\u4ef6\u5230\u8fd9\u91cc\u4e0a\u4f20\uff08\u9700\u73b0\u4ee3\u6d4f\u89c8\u5668\uff09"><small class="glyphicon glyphicon-info-sign"></small> \u62d6\u653e\u6587\u4ef6</span>'
					+ (max_width > 0 && max_height > 0 ? '<br /><small>&nbsp;\u56fe\u7247\u4f1a\u81ea\u52a8\u7b49\u6bd4\u7f29\u653e\u81f3\uff1a' + max_width.toString().toHTML() + 'x' + max_height.toString().toHTML() + '</small>': '')
					+ '</div><div class="clearfix"></div>\
					<div id="'+progresses_id+'" class="progresses"></div><div class="clearfix"></div>\
					<div id="'+thumbnails_id+'" class="thumbnails row"></div><div class="clearfix"></div></div>').insertAfter(t);
				if ($.fn.tooltip) $('.enable-tooltip', flex_uploader.$container).tooltip();
				flex_uploader.uploader = WebUploader.create({
					// swf文件路径
					swf: $.baseuri + "static/js/webuploader/Uploader.swf",
					// 文件接收服务端。
					server: $.baseuri + "attachment/uploader_query?of=json",
					// 选择文件的按钮。可选。内部根据当前运行是创建，可能是input元素，也可能是flash
					pick: {
						id: '#' + pick_id,
						multiple: true
					},
					//表单附加数据
					formData: $.extend($.session_id ? {"PHPSESSIONID": $.session_id} : {}, $.csrf ? {'_token': $.csrf} : {}, {}),
					//文件表单name
					fileVal: 'Filedata',
					//METHOD
					method: 'POST',
					//二进制上传，php://input都为文件内容，其他参数在$_GET中
					sendAsBinary: false,
					//可提交文件数量限制
					fileNumLimit: 0,
					//总文件大小限制
					//fileSizeLimit: 1024 * 1024 * 1024, //1G
					//单文件大小限制
					fileSingleSizeLimit: filesize,
					//是否去重
					duplicate: false,
					// 文件选择筛选。
					accept: {
						title: '\u9009\u62e9\u6587\u4ef6',
						extensions: filetype,
						mimeTypes: typeof mimeType != 'undefined' ? filetype.split(',').map(function(v){return mimeType.lookup('name.'+v)}).join(',') : '*/*'
					},
					//是否允许在文件传输时提前把下一个文件的分片,MD5准备好
					prepareNextFile: true,
					//分多大一片？ 默认大小为5M.
					chunkSize: 5242880,
					//分片允许自动重传多少次
					chunkRetry: 2,
					//是否分片上传。
					chunked: true,
					//同时上传并发数
					threads: 3,
					//指定拖拽的容器
					dnd: '#' + uploader_id,
					//全局禁用拉拽，防止默认打开文件
					disableGlobalDnd: true,
					//可以粘贴的容器
					paste: document.body,
					thumb: {// 缩略图
						width: 75,
						height: 75,
						// 图片质量，只有type为`image/jpeg`的时候才有效。
						quality: 70,
						// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
						allowMagnify: false,
						// 是否允许裁剪。
						crop: true,
						// 为空的话则保留原有图片格式。
						// 否则强制转换成指定的类型。
						//type: 'image/jpeg'
					},
					// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
					resize: false,
					compress: null
				});
				// 修改后图片上传前，尝试将图片压缩到max_width * max_height
				if (max_width > 0 && max_height > 0)
					flex_uploader.uploader.option( 'compress', {
						width: max_width,
						height: max_height,
						// 图片质量，只有type为`image/jpeg`的时候才有效。
						quality: 100,
						// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
						allowMagnify: false,
						// 是否允许裁剪。
						crop: false,
						// 是否保留头部meta信息。
						preserveHeaders: true,
						// 如果发现压缩后文件大小比原来还大，则使用原来图片。此属性可能会影响图片自动纠正功能
						noCompressIfLarger: true,
						// 单位字节，如果图片大小小于此值，不会采用压缩。
						compressSize: 0
					});

				

				var $progresses = {};
				var progress = function(file){
					if (!$progresses[file.id])
						$progresses[file.id] = $('<div class="media alert alert-warning fade in"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
							<div class="media-left media-middle"><img class="media-object" src="" alt=""></div>\
							<div class="media-body"><h4 class="media-heading">'+file.name.toHTML()+'('+bytesToSize(file.size)+')</h4>\
							<div class="media-message"></div>\
							<div class="progress">\
								<div class="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">\
									<span class=""></span>\
								</div>\
							</div>\
							</div>\
						</div>').appendTo('#'+progresses_id).on('closed.bs.alert', function(){
							if (file.getStatus() == 'complete')
								progress(file).remove();
							else
								progress(file).cancel();
						});
						//console.log(file);
					return {
						init: function(){
							$progresses[file.id].removeClass('alert-info alert-danger alert-success alert-warning');
							return this;
						},
						initProgress: function(){
							 $('.progress-bar', $progresses[file.id]).removeClass('progress-bar-info progress-bar-danger progress-bar-success progress-bar-warning');
						},
						thumb: function(){
							flex_uploader.uploader.makeThumb( file, function( error, ret ) {
								$('.media-object', $progresses[file.id]).attr('src', error ? $.baseuri+'placeholder?text='+file.ext+'&size=75x75&fontsize=35' : ret);
							});
						},
						name: function(name){
							$('.progressName', $progresses[file.id]).html(name.toHTML());
							return this;
						},
						message: function(message){
							$('.media-message', $progresses[file.id]).html(message);
							return this;
						},
						error: function(message) {
							this.init();
							this.initProgress();
							file.setStatus('invalid');
							$progresses[file.id].addClass("alert-danger");
							$('.progress-bar', $progresses[file.id]).addClass("progress-bar-danger");
							return this.message(message);
						},
						progressing: function (percentage) {
							this.init();
							this.initProgress();
							$progresses[file.id].addClass("alert-info");
							var $bar = $('.progress-bar', $progresses[file.id]).width(percentage + "%");
							$('.progress-bar span', $progresses[file.id]).text(percentage + "%");
							if (percentage < 20)
								$bar.addClass('progress-bar-warning');
							else if (percentage < 95)
								$bar.addClass('progress-bar-info');
							else
								$bar.addClass('progress-bar-success');
							if (percentage < 100) $bar.addClass('active'); else $bar.removeClass('active');
							return this.message('\u6b63\u5728\u4e0a\u4f20\u6587\u4ef6...');
						},
						success: function() {
							this.progressing(100);
							this.init();
							$progresses[file.id].addClass("alert-success");

							$progresses[file.id].delay(1500).queue(function(){
								$(this).alert('close').dequeue();
							});
							return this.message('\u4e0a\u4f20\u6210\u529f!');
						},
						cancel: function() {
							flex_uploader.uploader.cancelFile(file);
							return this.remove();
						},
						remove: function() {
							$progresses[file.id].remove();
							delete $progresses[file.id];
							return this;
						}
					};
				}
				var $thumbnails = {};
				var preview = function(id, filename, fileext)
				{
					if (!!id && !$thumbnails[id])
					{
						$thumbnails[id] = $('<div class="col-xs-6 col-md-4 alert"><div class="thumbnail">\
							<div class="file-panel"><span class="cancel" data-dismiss="alert" aria-label="Close">\u5220\u9664</span><span class="rotateRight">\u5411\u53f3\u65cb\u8f6c</span><span class="rotateLeft">\u5411\u5de6\u65cb\u8f6c</span></div>\
							<a href="'+$.baseuri+'attachment?id='+id+'"  target="_blank"><img src="'+$.baseuri+'placeholder?size=300x200&text='+encodeURIComponent('\u6b63\u5728\u8f7d\u5165...')+'" alt="" class="img-responsive center-block"  onerror="this.src=\''+ $.baseuri +'placeholder?size=300x200&text=\'+encodeURIComponent(\'\u6587\u4ef6\u8bfb\u53d6\u4e2d...\');"></a>\
							<div class="caption">\
        					<h4><span class="title">'+(filename ? filename.toHTML() : '')+'</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></h4>\
							</div><div class="clearfix"></div>\
							</div><div class="clearfix"></div></div>').appendTo('#' + thumbnails_id).on('closed.bs.alert', function(){
								preview(id).remove();
							});
							$('.rotateLeft,.rotateRight', $thumbnails[id]).on('click', function(){
								var rotation = parseInt($thumbnails[id].data('rotation')) || 0;
								rotation += $(this).is('.rotateLeft') ? -90 : 90;
								deg = 'rotate(' + rotation + 'deg)';
								$('img', $thumbnails[id]).css(
									$.supportTransition ? {'-webkit-transform': deg,'-mos-transform': deg,'-o-transform': deg,'transform': deg}
								     : {filter: 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((rotation/90)%4 + 4)%4) +')'}
								);
								$thumbnails[id].data('rotation', rotation);
							});
						if (!fileext) 
						{
							$.GET($.baseuri + 'attachment/info?id='+id, null, function(json){
								if (json.result == 'success' && json.data.ext)
								{
									var pic = img_types.indexOf(json.data.ext.toLowerCase()) > -1 ? $.baseuri+'attachment/preview?id='+id : $.baseuri+'placeholder?size=300x200&text='+encodeURIComponent(json.data.ext);
									$('.title', $thumbnails[id]).text(json.data.displayname);
									$('img', $thumbnails[id]).attr('src',pic);
								}
							},false);
						}
						else
						{
							var pic = img_types.indexOf(fileext.toLowerCase()) > -1 ? $.baseuri+'attachment/preview?id='+id: $.baseuri+'placeholder?size=300x200&text='+encodeURIComponent(fileext);
							$('img', $thumbnails[id]).attr('src',pic);
						}
					}
					
					return {
						build: function(){
							if (t.triggerHandler('uploader.previewing', [this.getFile(), id, attachment().get()]) === false) return this;
							attachment().add(id);
							t.triggerHandler('uploader.previewed',[this.getFile(), id, attachment().get()]);
							return this;
						},
						remove: function(){
							var file = this.getFile();
							if (t.triggerHandler('uploader.removing', [file, id, attachment().get()]) === false) return this;
							if (file) flex_uploader.uploader.removeFile(file, true);
							attachment().remove(id);
							$thumbnails[id].remove();
							delete $thumbnails[id];
							t.triggerHandler('uploader.removed',[file, id, attachment().get()]);
							return this;
						},
						setFile: function(file){
							$thumbnails[id].data("file", file);
							return this;
						},
						getFile: function(){
							return $thumbnails[id].data("file");
						},
						removeAll: function(){
							for (var id in $thumbnails) {
								preview(id).remove();
							};
						},
						rebuildAll: function() {
							//remove all files
							files = flex_uploader.uploader.getFiles();
							for(var i = 0;i < files.length;i++)
								flex_uploader.uploader.removeFile(files[i], true);
							//remove all preview
							this.removeAll();
							//build
							var aids = attachment().get();
							for (var i = 0; i < aids.length; i++) {
								preview(aids[i]).build();
							};
							return this;
						}
					};
				}
				var attachment = function() {
					var aid = t.val();
					if (aid == '0') aid = '';
					aids = aid ? ( aid instanceof Array ? aid : aid.split(',') ) : [];
					return {
						write: function() {
							if (t.is('select')){
								t.empty();
								aids.forEach(function(i){
									t.append('<option value="'+i+'">'+i+'</option>');
								});
							}
							t.val(aids);
							return this;
						},
						add: function(id) {
							if (filelimit == 1) aids = [id.toString()];
							var i = aids.indexOf(id.toString());
							if (i == -1) aids.push(id.toString());
							return this.write();
						},
						remove: function(id) {
							var i = aids.indexOf(id.toString());
							if (i != -1) aids.splice(i,1);
							return this.write();
						},
						removeAll: function(){
							aids = [];
							return this.write();
						},
						get: function(){
							return aids;
						}
					};
				}


				//---------------------------------------
				method.beforeFileQueued = function(file) {
					if (filetype.split(',').indexOf(file.ext.toLowerCase()) == -1){
						$.alert('\u8bf7\u4e0a\u4f20' + filetype + '\u6587\u4ef6!');
						return false;
					}
					if (filelimit > 1 &&  attachment().get().length >= filelimit) {
						$.alert('\u53ea\u5141\u8bb8\u4e0a\u4f20' + filelimit + '\u4e2a\u6587\u4ef6\uff0c\u8bf7\u5220\u51cf\u540e\u91cd\u8bd5!');
						return false;
					}
					return true;
				}
				method.fileQueued = function(file) {
					if (t.triggerHandler('uploader.uploading', [file, attachment().get()]) === false) return false;
					progress(file).init().thumb();

					//前台压缩图片，为避免产生BUG，不检查md5
					if (max_width > 0 && max_height > 0 && (file.ext == 'jpg' || file.ext == 'jpeg'))
					{
						flex_uploader.uploader.upload(file);
						return true;
					}

					this.md5File( file ).progress(function(percentage) {
						progress(file).progressing(percentage).message('\u6b63\u5728\u6548\u9a8c\u6587\u4ef6...');
					}).then(function(val) {
						$.POST($.baseuri + 'attachment/hash_query', {
							hash: val,
							_token: $.csrf,
							filename: file.name,
							ext: file.ext,
							size: file.size
						}, function(json){
							if (json && json.result == 'success'){
								flex_uploader.uploader.skipFile(file);
								progress(file).success().message('\u4e91\u7aef\u6587\u4ef6\u5df2\u5b58\u5728\uff0c\u6587\u4ef6\u79d2\u4f20\u6210\u529f!');
								if (filelimit == 1) preview().removeAll();
								preview(json.data.id, json.data.displayname, json.data.ext).build().setFile(file);
								t.triggerHandler('uploader.uploaded',[file, json, attachment().get()]);
							} else {
								flex_uploader.uploader.upload(file);
							}
						},false);
					});
					return true;
				}
				//上传过程中触发，携带上传进度。
				method.uploadProgress = function(file, percentage) {
					t.triggerHandler('uploader.progressing',[file, percentage, attachment().get()]);
					progress(file).progressing(percentage);
				}
				//当文件上传成功时触发。
				method.uploadSuccess = function(file, json) {
					if (json && json.result == 'success') {
						progress(file).success();
						if (filelimit == 1) preview().removeAll();
						preview(json.data.id, json.data.displayname, json.data.ext).build().setFile(file);
						t.triggerHandler('uploader.uploaded',[file, json, attachment().get()]);
					} else {
						progress(file).error("\u5931\u8d25: " + json.message.content);
						t.triggerHandler('uploader.error',[file, json.message.content, attachment().get()]);
						//$.alert(json.message.content);
					}
				}
				
				//当文件上传出错时触发。
				method.uploadError = function(file, reason) {
					progress(file).error("\u5931\u8d25: " + reason);
					t.triggerHandler('uploader.error',[file, reason, attachment().get()]);
				}
				//不管成功或者失败，文件上传完成时触发。
				method.uploadComplete = function(file) {
					
				}
				method.error = function(code, max, file) {
					switch(code)
					{
						case 'Q_EXCEED_NUM_LIMIT':
							$.alert('\u53ea\u80fd\u4e0a\u4f20' + max + '\u4e2a\u6587\u4ef6!');
							break;
						case 'Q_EXCEED_SIZE_LIMIT':
							$.alert('\u6587\u4ef6\u603b\u5927\u5c0f\u8d85\u51fa!');
							break;
						case 'F_EXCEED_SIZE':
							$.alert('\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa'+bytesToSize(filesize)+'!');
							break;
						case 'F_DUPLICATE':
							$.alert('\u4e0a\u4f20\u961f\u5217\u4e2d\u6709\u91cd\u590d\u6587\u4ef6!');
							break;
						case 'Q_TYPE_DENIED':
							$.alert('\u4e0a\u4f20\u7684\u6587\u4ef6\u53ea\u80fd\u4e3a' + filetype);
							break;
						default:
							$.alert(code);
							break;
					}
				}

				flex_uploader.uploader.on('beforeFileQueued', method.beforeFileQueued)
				flex_uploader.uploader.on('fileQueued', method.fileQueued)
				flex_uploader.uploader.on('uploadProgress', method.uploadProgress)
				flex_uploader.uploader.on('uploadSuccess', method.uploadSuccess)
				flex_uploader.uploader.on('uploadError', method.uploadError)
				flex_uploader.uploader.on('uploadComplete', method.uploadComplete)
				flex_uploader.uploader.on('error', method.error)
				//init
				if(id) attachment().add(id);
				preview().rebuildAll();
				t.prop('flex_uploader', flex_uploader);
			});
			
		}
	});
})(jQuery);