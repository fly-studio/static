var TIPS_LANGUAGE = {
	'tip' : '\u63d0\u793a', //提示
	'ok' : '\u786e\u5b9a', //确定
	'cancel' : '\u53d6\u6d88', //取消
	'back' : '\u8fd4\u56de' //返回
};
(function($){

	$.showtips_interface = function(json, config) {
		var _config = {
			content: '<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + json.message.content + '</div>',
			title: json.message.title ? json.message.title : TIPS_LANGUAGE.tip,
			time: json.url === false ? false : 1500,
			btn: json.url === false ? [TIPS_LANGUAGE.back] : false,
			yes: function (index, layero) {
				layer.close(index);
			}
		};
		layer.open($.extend(_config, config));
	};
	$.lptip_interface = function(result, message, tipType, extraConfig) {
		var _config = {
			content: '<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + message.content + '</div>',
			title: typeof message.title != 'undefined' ? message.title : TIPS_LANGUAGE.tip,
			time: tipType.timeout,
			btn: tipType.type == 'back' ? [TIPS_LANGUAGE.back] : false,
			yes: function (index, layero) {
				layer.close(index);
			}
		};
		layer.open($.extend(_config, extraConfig));
	};
	$.alert_interface = function(msg, confirm_callback, $dfd) {
		layer.alert(msg, function(index){
			layer.close(index);
			confirm_callback.call(this);
			$dfd.resolve();
		});
	};
	$.tips_interface = function(msg, timeout, $dfd) {
		layer.msg(msg, {
			time: timeout
		}, function(){
			$dfd.resolve();
		});
	};
	$.toast_interface = function(msg, timeout, $dfd) {
		layer.msg(msg, {
			time: timeout
		}, function(){
			$dfd.resolve();
		});
	};
	$.confirm_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		layer.confirm(msg, function(index){
			layer.close(index);
			confirm_callback.call(this);
			$dfd.resolve();
		}, function(index) {
			layer.close(index);
			cancel_callback.call(this);
			$dfd.reject();
		});
	};
	$.prompt_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		layer.prompt({
			formType: 2,
			value: '',
			title: msg
		}, function(value, index, elem){
			confirm_callback.call(this, [value]);
			layer.close(index);
			$dfd.resolve();
		}, function(){
			cancel_callback.call(this);
			layer.close(index);
			$dfd.reject();
		});
	};
})(jQuery);
