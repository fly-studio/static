(function($){
	$.$.TIPS_LANGUAGE = {
		'tips' : '\u63d0\u793a', //提示
		'ok' : '\u786e\u5b9a', //确定
		'cancel' : '\u53d6\u6d88', //取消
		'back' : '\u8fd4\u56de' //返回
	}
	$.showtips_interface = function(json) {
		mui.alert('<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + json.message.content + '</div>', json.message.title ? json.message.title : $.TIPS_LANGUAGE.tips, [
			json.url === false ? $.TIPS_LANGUAGE.back : (json.url === true ? '('+$.TIPS_LANGUAGE.reload+'...)' : '('+$.TIPS_LANGUAGE.redirect+'...)' )
		]);
	};
	$.alert_interface = function(msg, confirm_callback, $dfd) {
		mui.alert(msg, $.TIPS_LANGUAGE.tips, [$.TIPS_LANGUAGE.ok], function(){
			if (confirm_callback && $.isFunction(confirm_callback))	confirm_callback.call(this);
			$dfd.resolve();
		});
	};
	$.tips_interface = function(msg, timeout, $dfd) {
		mui.toast(msg);
	};
	$.confirm_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		mui.prompt(msg, $.TIPS_LANGUAGE.tips, [$.TIPS_LANGUAGE.cancel, $.TIPS_LANGUAGE.ok], function(e){
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
		mui.prompt(msg, '', $.TIPS_LANGUAGE.tips, [$.TIPS_LANGUAGE.cancel, $.TIPS_LANGUAGE.ok], function(e){
			if (e.index == 1)
				confirm_callback.call(this, [e.value]);
			else
				cancel_callback.call(this);
		});
	}
})(jQuery);