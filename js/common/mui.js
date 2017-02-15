var TIPS_LANGUAGE = {
	'tip' : '\u63d0\u793a', //提示
	'ok' : '\u786e\u5b9a', //确定
	'cancel' : '\u53d6\u6d88', //取消
	'back' : '\u8fd4\u56de', //返回
	'reload': '(\u5237\u65b0...)', //刷新
	'redirect': '(\u8df3\u8f6c...)', //跳转
	'toast': '...'
};
(function($){

	$.showtips_interface = function(json) {
		mui.alert('<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + json.message.content + '</div>', json.message.title ? json.message.title : TIPS_LANGUAGE.tip, [
			json.url === false ? TIPS_LANGUAGE.back : (json.url === true ? '('+TIPS_LANGUAGE.reload+'...)' : '('+TIPS_LANGUAGE.redirect+'...)' )
		]);
	};
	$.lptip_interface = function(result, message, tipType, extraConfig)
	{
		mui.alert('<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + message.content + '</div>', typeof message.title != 'undefined' ? message.title : TIPS_LANGUAGE.tip, [ TIPS_LANGUAGE[tipType.type] ]);
	};
	$.alert_interface = function(msg, confirm_callback, $dfd) {
		mui.alert(msg, TIPS_LANGUAGE.tip, [TIPS_LANGUAGE.ok], function(){
			if (confirm_callback && $.isFunction(confirm_callback))	confirm_callback.call(this);
			$dfd.resolve();
		});
	};
	$.tips_interface = function(msg, timeout, $dfd) {
		mui.toast(msg);
	};
	$.toast_interface = function(msg, timeout, $dfd) {
		mui.toast(msg);
	};
	$.confirm_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		mui.prompt(msg, TIPS_LANGUAGE.tip, [TIPS_LANGUAGE.cancel, TIPS_LANGUAGE.ok], function(e){
			if (e.index == 1) {
				if (confirm_callback && $.isFunction(confirm_callback)) confirm_callback.call(this);
				$dfd.resolve();
			} else {
				if (cancel_callback && $.isFunction(confirm_callback)) cancel_callback.call(this);
				$dfd.reject();
			}
		});
	}
	$.prompt_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		mui.prompt(msg, '', TIPS_LANGUAGE.tip, [TIPS_LANGUAGE.cancel, TIPS_LANGUAGE.ok], function(e){
			if (e.index == 1)
				confirm_callback.call(this, [e.value]);
			else
				cancel_callback.call(this);
		});
	}
})(jQuery);