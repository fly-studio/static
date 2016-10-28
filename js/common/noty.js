(function($){
	$.TIPS_LANGUAGE = {
		'tips' : '\u63d0\u793a', //提示
		'ok' : '\u786e\u5b9a', //确定
		'cancel' : '\u53d6\u6d88', //取消
		'back' : '\u8fd4\u56de' //返回
	}
	$.noty.defaults = {
		layout: 'center',
		theme: 'defaultTheme',
		type: 'alert',
		text: '',
		dismissQueue: true, // If you want to use queue feature set this true
		template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
		animation: {
			open: {height: 'toggle'},
			close: {height: 'toggle'},
			easing: 'swing',
			speed: /(Android|webOS|iPhone|Windows\sPhone|iPod|BlackBerry|SymbianOS)/i.test(navigator.userAgent) ? 0 : 500 // opening & closing animation speed
		},
		timeout: 2000, // delay for closing event. Set false for sticky notifications
		force: false, // adds notification to the beginning of queue when set to true
		modal: true,
		maxVisible: 15, // you can set max visible notification for dismissQueue true option
		closeWith: ['click'], // ['click', 'button', 'hover']
		callback: {
			onShow: function() {},
			afterShow: function() {},
			onClose: function() {},
			afterClose: function() {}
		},
		buttons: false // an array of buttons
	};
	$.noty.tips_exchange = {
		'success': 'success',
		'failure': 'warning',
		'warning': 'warning',
		'error': 'error',
		'notice': 'alert',
		'information': 'information'
	};
	$.showtips_interface = function(json, config)
	{
		var setting = {
			text : '<div style="text-align:left;"><h4>' + json.message.title + '</h4><div style="word-break:break-all;word-wrap:break-word;">'+ json.message.content +'</div></div>',
			type : $.noty.tips_exchange[json.result] ? $.noty.tips_exchange[json.result] : 'alert',
			timeout : json.url === false ? false : 1500,
			buttons : json.url === false ? [
			{
				addClass: 'btn btn-warning',
				text: $.TIPS_LANGUAGE.back,
				onClick: function($noty) {
					$noty.close();
				}
			}
			] : false
		};
		if (typeof config == 'object')
			setting = $.extend(setting, config);

		var $noty = noty(setting);
		$('button:eq(0)',$noty.$buttons).focus();
	}
	$.alert_interface = function(msg, confirm_callback, $dfd) {
		var setting = {
			text : '<div style="text-align:left;"><h4>' + $.TIPS_LANGUAGE.tips + '</h4><div style="word-break:break-all;word-wrap:break-word;text-align:left;">'+ msg +'</div></div>',
			type : 'success',
			timeout :  confirm_callback ? false : 1500 ,
			buttons : confirm_callback ? [
				{
					addClass: 'btn btn-primary',
					text: $.TIPS_LANGUAGE.ok,
					onClick: function($noty) {
						$noty.close();
						if (confirm_callback && $.isFunction(confirm_callback))	confirm_callback.call(this);
						$dfd.resolve();
					}
				}
			] : false
		};
		var $noty = noty(setting);
		$('button:eq(0)',$noty.$buttons).focus();
	};
	$.tips_interface = function(msg, timeout, $dfd)
	{
		var setting = {
			text : '<div style="text-align:left;"><h4>' + $.TIPS_LANGUAGE.tips + '</h4><div style="word-break:break-all;word-wrap:break-word;">'+ msg +'</div></div>',
			type : 'warning',
			timeout :  timeout ? timeout : 1500,
			callback: {
				onClose: function() {
					$dfd.resolve();
				}
			}
		};
		noty(setting);
	};
	$.confirm_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		var setting = {
			text : '<div style="text-align:left;"><h4>' + $.TIPS_LANGUAGE.tips + '</h4><div style="word-break:break-all;word-wrap:break-word;">'+ msg +'</div></div>',
			type : 'warning',
			timeout :  false ,
			buttons : [
				{
					addClass: 'btn btn-primary',text: $.TIPS_LANGUAGE.ok,
					onClick: function($noty) {
						$noty.close();
						if (confirm_callback && $.isFunction(confirm_callback)) confirm_callback.call(this);
						$dfd.resolve();
					}
				},{
					addClass: 'btn btn-danger',text: $.TIPS_LANGUAGE.cancel,
					onClick: function($noty) {
						$noty.close();
						if (cancel_callback && $.isFunction(confirm_callback)) cancel_callback.call(this);
						$dfd.reject();
					}
				}
			]
		};
		var $noty = noty(setting);
		$('button:eq(1)',$noty.$buttons).focus();
	};
	$.prompt_interface = function(msg, confirm_callback, cancel_callback, $dfd) {
		var setting = {
			text : '<div style="text-align:left;"><h4>' + $.TIPS_LANGUAGE.tips + '</h4><label style="word-break:break-all;word-wrap:break-word;">'+ msg +'<input type="text" class="form-control" name="prompt" placeholder="" autofocus="autofocus"></label></div>',
			type : 'alert',
			timeout :  false ,
			buttons : [
				{
					addClass: 'btn btn-primary',text: $.TIPS_LANGUAGE.ok,
					onClick: function($noty) {
						$noty.close();
						var v = $('[name="prompt"]',$noty.$bar).val();
						confirm_callback.call(this, [v]);
					}
				},{
					addClass: 'btn btn-danger',text: $.TIPS_LANGUAGE.cancel,
					onClick: function($noty) {
						$noty.close();
						cancel_callback.call(this);
					}
				}
			]
		};
		var $noty = noty(setting);
		$('[name="prompt"]',$noty.$bar).focus().on('keypress', function(e){
			if (e.keyCode==13)
			{
				$noty.close();
				var v = $(this).val();
				confirm_callback.call(this, [v]);
			}
		});
	};
})(jQuery);