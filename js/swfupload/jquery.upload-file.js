(function($){
	if(typeof COMMON_LANGUAGE == 'undefined')
		throw('this javascript file need behind \'common.js\'');
	var scripts = document.getElementsByTagName("script");
	var querys = $.deparam.querystring((scripts[ scripts.length - 1 ]).src);
	$.session_id = querys['session_id'];

	$.fn.extend({
		upload_file : function(max_width, max_height, filesize, filetype) {
			max_width = $.isUndefined(max_width) ? 0 : parseFloat(max_width);
			max_height = $.isUndefined(max_height) ? 0 : parseFloat(max_height);
			filesize = $.isUndefined(filesize) ? '2 MB' : filesize;
			filetype = $.isUndefined(filetype) ? '*.jpg;*.jpeg;*.png;*.bmp;*.gif' : filetype;
			var img_types = ['.jpg','.jpeg','.png','.bmp','.gif'];
			return this.each(function(){
				var t = $(this);
				var method = {};
				var nonce = rand(10000,99999);
				var placeholder_id = 'placeholder_id_' + nonce, progress_id = 'progress_id_' + nonce, thumbnails_id = 'thumbnails_' + nonce;
				var $upload_noty = null;
				var $container = $('<div class="btn btn-info">\
						<span id="'+placeholder_id+'"></span>\
					</div>'
					+ '&nbsp;<span class="label label-success">' + filetype.replace(/;/g,'</span>&nbsp;<span class="label label-success">') + '</span>'
					+ (max_width > 0 && max_height > 0 ? '<small>&nbsp;\u56fe\u7247\u4f1a\u81ea\u52a8\u7b49\u6bd4\u7f29\u653e\u81f3\uff1a' + max_width.toString().toHTML() + 'x' + max_height.toString().toHTML() + '</small>': '')  +
					'<div id="'+progress_id+'" style="height: 75px;" class="hide"></div>\
					<div id="'+thumbnails_id+'" class="upload-preview hide" style="width:302px;height:202px;margin:15px 0;overflow:hidden;">\
						<img data-src="" alt="" src="'+$.baseuri+'placeholder?size=300x200&text='+encodeURIComponent('\u6b63\u5728\u8f7d\u5165...')+'" onload="javascript:resizeImg(this,300,200);" onerror="this.src=\''+ $.baseuri +'placeholder?size=300x200&text=\'+encodeURIComponent(\'\u6587\u4ef6\u65e0\u6cd5\u9884\u89c8\');" />\
						<div class="actions">\
							<a title="&#39044;&#35272;" href="#" name="preview_link" target="_blank"><i class="icon-search icon-white glyphicon glyphicon-search" style="color:white;"></i></a>\
							<a title="&#31227;&#38500;" href="#" name="preview_delete"><i class="icon-remove icon-white glyphicon glyphicon-remove" style="color:white;"></i></a>\
						</div>\
					</div><div class="clearfix"></div>').insertAfter(t);

				var $progress = $('<div class="progressWrapper">\
					<div class="progressContainer">\
						<a href="#" class="progressCancel" style="display:none;"> </a>\
						<div class="progressName"></div>\
						<div class="progressBarStatus">&nbsp;</div>\
						<div class="progressBarInProgress" name="progress_bar"></div>\
					</div>\
				</div>').appendTo('#'+progress_id);

				method.hideProgress = function() {
					$('#'+progress_id).hide();
				};
				method.initProgress = function() {
					$('#'+progress_id).removeClass("hide hidden").show();
					$('.progressContainer', $progress).removeClass('red green blue');
					$('[name="progress_bar"]', $progress).removeClass().width("0");
				};
				method.setProgress = function (percentage) {
					method.initProgress(); 
					$('.progressContainer', $progress).addClass("green");
					$('[name="progress_bar"]', $progress).addClass("progressBarInProgress").width(percentage + "%");
				}
				method.setComplete = function () {
					method.initProgress(); 
					$('.progressContainer', $progress).addClass("blue");
					$('[name="progress_bar"]', $progress).addClass("progressBarComplete").width("100%");
				};
				method.setError = function () {
					method.initProgress();
					$('.progressContainer', $progress).addClass("red");
					$('[name="progress_bar"]', $progress).addClass("progressBarError");
				};
				method.setCancelled = function () {
					method.initProgress();
					$('[name="progress_bar"]', $progress).addClass("progressBarError");
				};
				method.setStatus = function (status) {
					$('.progressBarStatus', $progress).html(status);
				};
				method.setFileName = function (file) {
					$('.progressName', $progress).html(file.name.toHTML());
				}
				method.toggleCancel = function (show, swfuploadInstance) {
					var $obj = $('.progressCancel', $progress);
					if (show) $obj.show(); else $obj.hide();
				};

				method.preview = function(aid, filename, fileext) {
					var aid = parseInt(aid);
					t.val(aid);
					if (!aid) 
					{
						method.remove();
						return;
					}
					$('#'+progress_id)/*.empty().hide()*/;
					var $thumbnails_id = $('#'+thumbnails_id).hide();
					$('a[name="preview_link"]', $container).attr('href',$.baseuri+'attachment?aid=' + aid);
					var $img = $('img', '#'+thumbnails_id).css({'width':'auto','height':'auto'});
					if (!fileext) 
					{
						$.GET($.baseuri + 'attachment/info?aid='+aid, null, function(json){
							if (json.result == 'success' && json.data.ext)
							{
								var pic = img_types.indexOf('.' + json.data.ext.toLowerCase()) > -1 ? $.baseuri+'attachment/preview?aid=' + aid : $.baseuri+'placeholder?size=300x200&text='+encodeURIComponent(json.data.displayname.toHTML());
								$thumbnails_id.removeClass('hide hidden').show();
								$img.attr('src',pic);
							}
						},false);
					}
					else
					{
						var pic = img_types.indexOf(fileext.toLowerCase()) > -1 ? $.baseuri+'attachment/preview?aid=' + aid : $.baseuri+'placeholder?size=300x200&text='+encodeURIComponent(filename.toHTML());
						$thumbnails_id.removeClass('hide hidden').show();
						$img.attr('src',pic);
					}
					
					
				}
				method.remove = function()
				{
					t.val('0');
					$('#'+thumbnails_id).hide();
					$('img', '#'+thumbnails_id).attr('src','');
					$('a[name="preview_link"]', $container).attr('href','#');
					$('#'+progress_id)/*.empty()*/.hide();
					t.triggerHandler("upload-remove-success");
				}

				$('a[name="preview_delete"]', $container).on('click',function(){
					method.remove();
					return false;
				});

				t.on('upload-remove', function(e){
					method.remove();
				});

				t.on('upload-preview', function(e, aid, filename, fileext){
					aid = parseInt(!!aid ? aid : t.val());
					if (!isNaN(aid) && aid > 0) method.preview(aid, filename, fileext); else method.remove();
				}).triggerHandler('upload-preview', [t.val()]);

				//---------------------------------------

				method.preLoad = function() {
					if (!this.support.loading) {
						$.alert("\u4f60\u9700\u8981\u5b89\u88c5Flash Player\u624d\u80fd\u8fd0\u884cSWFUpload\u3002");
						return false;
					} else if (!this.support.imageResize) {
						$.alert("\u4f60\u9700\u8981\u5b89\u88c5Flash Player 10\u4ee5\u4e0a\u7684\u7248\u672c\uff0c\u624d\u80fd\u88c1\u51cf\u56fe\u7247\u5927\u5c0f\u3002");
						return false;
					}
				}
				method.loadFailed = function() {
					$.alert("Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative");
				}
				method.fileQueueError = function(file, errorCode, message) {
					try {
						switch (errorCode) {
							case SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED:
								$.alert('\u8bf7\u52ff\u540c\u65f6\u4e0a\u4f20\u4e86\u8fc7\u591a\u6587\u4ef6.');
								break;
							case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
								$.alert('\u8bf7\u52ff\u4e0a\u4f200\u5b57\u8282\u7684\u6587\u4ef6.');
								break;
							case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
								$.alert('\u60a8\u4e0a\u4f20\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa\u9650\u5236\uff1a'+ filesize.toHTML());
								break;
							case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
								$.alert('\u60a8\u4e0a\u4f20\u6587\u4ef6('+file.name.toHTML()+')\uff0c\u7c7b\u578b\u4e0d\u7b26\u5408\u8981\u6c42: ' + filetype.toHTML());
								break;
							default:
								$.alert('\u5931\u8d25\uff1a' + message);
								break;
						}
					} catch (ex) {
						this.debug(ex);
					}
				}
				method.fileDialogComplete = function(numFilesSelected, numFilesQueued) {
					try {
						if (numFilesQueued > 0) {
							if ($.noty)
								$upload_noty = noty({text:'<img src="'+ $.baseuri +'static/img/loading.gif" /> \u6b63\u5728\u4e0a\u4f20\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u2026\u2026',timeout:false,type:'success'});
							var file = this.getFile(0);
							if (img_types.indexOf(file.type.toLowerCase()) > -1 && this.customSettings.thumbnail_height > 0 && this.customSettings.thumbnail_width > 0)
								this.startResizedUpload(file.ID, this.customSettings.thumbnail_width, this.customSettings.thumbnail_height, file.type.toLowerCase() == '.png' ? SWFUpload.RESIZE_ENCODING.PNG : SWFUpload.RESIZE_ENCODING.JPEG, this.customSettings.thumbnail_quality, false);
							else
								this.startUpload(file.ID);
						}
					} catch (ex) {
						this.debug(ex);
					}
				}
				method.uploadProgress = function(file, bytesLoaded) {
					try {
						var percent = Math.ceil((bytesLoaded / file.size) * 100);

						method.setFileName(file);
						method.setProgress(percent);
						method.setStatus("\u4e0a\u4f20\u4e2d...");
						method.toggleCancel(true, this);
					} catch (ex) {
						this.debug(ex);
					}
				}
				method.uploadSuccess = function(file, serverData) {
					//try {
						if($upload_noty && $.noty) $upload_noty.close();
						method.setFileName(file);
						method.toggleCancel(false);
						var json = $.parseJSON(serverData);
						if (json && json.result == 'success') {
							method.preview(json.data.aid.toHTML(), json.data.displayname.toHTML(), '.'+json.data.ext.toHTML());
							t.triggerHandler('upload-success',[json, file]);
							method.setStatus("\u4e0a\u4f20\u5b8c\u6210.");
							method.setComplete();
						} else {
							method.setError();
							method.setStatus("\u5931\u8d25:" + json.message.content.toHTML());
							$.alert(json.message.content);
						}
					//} catch (ex) {
					//	this.debug(ex);
					//}
				}
				method.uploadComplete = function(file) {
					try {
						/*  I want the next upload to continue automatically so I'll call startUpload here */
						if (this.getStats().files_queued > 0) {
							var file = this.getFile(0);
							if (img_types.indexOf(file.type.toLowerCase()) > -1 && this.customSettings.thumbnail_height > 0 && this.customSettings.thumbnail_width > 0)
								this.startResizedUpload(file.ID, this.customSettings.thumbnail_width, this.customSettings.thumbnail_height, file.type.toLowerCase() == '.png' ? SWFUpload.RESIZE_ENCODING.PNG : SWFUpload.RESIZE_ENCODING.JPEG, this.customSettings.thumbnail_quality, false);
							else
								this.startUpload(file.ID);
						} else {
							//method.setFileName(file);
							//method.setComplete();
							//method.setStatus("\u6587\u4ef6\u5df2\u63a5\u6536\u5b8c\u6210.");
							//method.toggleCancel(false);
						}
					} catch (ex) {
						this.debug(ex);
					}
				}
				method.uploadError = function(file, errorCode, message) {
					if($upload_noty && $.noty) $upload_noty.close();
					method.setFileName(file);
					try {
						switch (errorCode) {
						case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
							try {
								method.setCancelled();
								method.setStatus("\u5df2\u53d6\u6d88");
								method.toggleCancel(false);
							}
							catch (ex1) {
								this.debug(ex1);
							}
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
							try {
								method.setCancelled();
								method.setStatus("\u5df2\u505c\u6b62");
								method.toggleCancel(true);
							}
							catch (ex2) {
								this.debug(ex2);
							}
						case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
							try {
								method.setStatus("\u6587\u4ef6\u6570\u91cf\u8d85\u51fa\u9650\u5236");
								method.toggleCancel(true);
							}
							catch (ex2) {
								this.debug(ex2);
							}
							break;
						default:
							$.alert('\u5931\u8d25\uff1a' + message);
							break;
						}
					} catch (ex3) {
						this.debug(ex3);
					}

				}
				
				var swfupload = new SWFUpload({
					// Backend Settings
					upload_url: $.baseuri + "attachment/swfupload_query?of=json",
					post_params: {"PHPSESSIONID": $.session_id},

					// File Upload Settings
					file_size_limit : filesize,	// 5MB
					file_types : filetype,
					file_types_description : "\u8bf7\u9009\u62e9\u6587\u4ef6",
					file_upload_limit : 0,

					swfupload_preload_handler : method.preLoad,
					swfupload_load_failed_handler : method.loadFailed,
					file_queue_error_handler : method.fileQueueError,
					file_dialog_complete_handler : method.fileDialogComplete,
					upload_progress_handler : method.uploadProgress,
					upload_error_handler : method.uploadError,
					upload_success_handler : method.uploadSuccess,
					upload_complete_handler : method.uploadComplete,

					// Button Settings
					button_image_url : $.baseuri + 'static/js/swfupload/img/SmallSpyGlassWithTransperancy_17x18.png',
					button_placeholder_id : placeholder_id,
					button_action: SWFUpload.BUTTON_ACTION.SELECT_FILE, //单选
					button_width: 180,
					button_height: 18,
					button_text : '<span class="button">\u8bf7\u9009\u62e9\u6587\u4ef6 <span class="buttonSmall">(\u6700\u5927 '+filesize+')</span></span>',
					button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt; color:#F7F7F7;} .buttonSmall { font-size: 10pt; }',
					button_text_top_padding: 0,
					button_text_left_padding: 18,
					button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
					button_cursor: SWFUpload.CURSOR.HAND,
					
					// Flash Settings
					flash_url : $.baseuri + 'static/js/swfupload/swfupload.swf',
					flash9_url : $.baseuri + 'static/js/swfupload/swfupload_FP9.swf',

					custom_settings : {
						upload_target : progress_id,
						thumbnail_height: max_height,
						thumbnail_width: max_width,
						thumbnail_quality: 100
					},
					
					// Debug Settings
					debug: false
				});
				
				$('.progressCancel', $container).on('click',function(){
					swfupload.cancelUpload(null, false);
					method.hideProgress();
					return false;
				});

			});
			
		}
	});
})(jQuery);