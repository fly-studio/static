(function($){
	$.showtips_interface = function(json, config) {
		var _config = {
			content: '<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + json.message.content + '</div>',
			title: json.message.title ? json.message.title : COMMON_LANGUAGE.tips,
			time: json.url === false ? false : 1500,
			btn: json.url === false ? [COMMON_LANGUAGE.back] : false,
			yes: function (index, layero) {
				layer.close(index);
			}
		};
		layer.open($.extend(_config, config));
	};
	$.alert_interface = function(msg, confirm_callback, $dfd) {
		layer.alert(msg, function(index){
			layer.close(index);
			confirm_callback.call(this);
			$dfd.resolve();
		});
	};
	$.tips_interface = function(msg, timeout) {
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
