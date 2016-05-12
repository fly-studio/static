(function($){
	$.showtips_interface = function(json) {
		mui.alert('<div style="word-break:break-all;word-wrap:break-word;text-align:left;">' + json.message.content + '</div>', json.message.title ? json.message.title : COMMON_LANGUAGE.tips, [
			json.url === false ? COMMON_LANGUAGE.back : (json.url === true ? '('+COMMON_LANGUAGE.reload+'...)' : '('+COMMON_LANGUAGE.redirect+'...)' )
		]);
	};
	$.alert_interface = function(msg, confirm_callback, $dfd) {
		mui.alert(msg, COMMON_LANGUAGE.tips, [COMMON_LANGUAGE.ok], function(){
			if (confirm_callback && $.isFunction(confirm_callback))	confirm_callback.call(this);
			$dfd.resolve();
		});
	};
	$.tips_interface = function(msg, timeout, $dfd) {
		mui.toast(msg);
	};
	$.confirm_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		mui.prompt(msg, COMMON_LANGUAGE.tips, [COMMON_LANGUAGE.cancel, COMMON_LANGUAGE.ok], function(e){
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
		mui.prompt(msg, '', COMMON_LANGUAGE.tips, [COMMON_LANGUAGE.cancel, COMMON_LANGUAGE.ok], function(e){
			if (e.index == 1)
				confirm_callback.call(this, [e.value]);
			else
				cancel_callback.call(this);
		});
	}
})(jQuery);