
(function($){
	var QUERY_LANGUAGE = {
		'error' : '错误',
		'reload' : '重新载入',
		'redirect' : '页面跳转',
		'unselected' : '请至少选择一项！',
		'network_timeout' : '网络故障，请检查网络连接后重试！',
		'parser_error' : '数据解析失败，刷新重试下？',
		'server_error' : '服务器可能出现了点问题，刷新页面重试下？',
		'encrypt_key' : '数据已经加密，但未传递正确的公钥。',
		'encrypt_js' : '数据已经加密，但页面未加载解密JS。',
		'encrypt_string' : '数据已经加密，但密文解密失败，请联系管理员。',
		'encrypt_unserialize' : '数据已经加密，但密文解开失败，请联系管理员。',
	}
	//init csrf
	$.csrf = $('meta[name="csrf-token"]').attr('content');
	var headers = {};
	if ($.csrf)
		headers['X-CSRF-TOKEN'] = $.csrf
	if ($.ssl)
		headers['X-RSA'] = encodeURIComponent($.ssl.rsa.public);


	$.ajaxSetup({headers:headers, dataFilter: function(data, type){
		var callback = ''; 
		var jsonError = function(content) {
			json.result = 'error';
			json.message = {title: QUERY_LANGUAGE.error, content: content};
			return JSON.stringify(data);
		}
		if (type == 'jsonp')
			callback = '';
		if (type == 'json') {
			var json = $.parseJSON(data);
			if (typeof json != 'undefined' && typeof json.result != 'undefined' && json.result == 'api' && typeof json.encrypt != 'undefined' && json.encrypt === true)
			{
				 if (typeof json.key != 'undefined' && typeof $.ssl != 'undefined' && !!json.key) {
				 	try{
						var key = $.ssl.decrypt(json.key);
					} catch (e) {
						return jsonError(QUERY_LANGUAGE.encrypt_key + e.message);
					}
					var encrypted = json.data;
					try{
						var encrypted_json = JSON.parse(aesjs.util.convertBytesToString(base64js.toByteArray(encrypted))); //json_decode()
					} catch (e) {
						return jsonError(QUERY_LANGUAGE.encrypt_string + e.message);
					}
					try{
						//base64 decode
						var keyBytes = base64js.toByteArray(key),
						ivBytes = base64js.toByteArray(encrypted_json.iv),
						valueBytes = base64js.toByteArray(encrypted_json.value);
						//aes cbc
						var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
						var decryptedBytes = aesCbc.decrypt(valueBytes);
						var decypted = aesjs.util.convertBytesToString(decryptedBytes);
						//unserialize
						json.data = unserialize(decypted);
					} catch(e) {
						return jsonError(QUERY_LANGUAGE.encrypt_unserialize + e.message);
					}

				} else if (!json.key)
					return jsonError(QUERY_LANGUAGE.encrypt_key);
				else 
					return jsonError(QUERY_LANGUAGE.encrypt_js);
			}
			data = JSON.stringify(json);
			if (typeof json.debug != 'undefined' && !!json.debug) console.log(json);
			delete json;
		}

		return data;
	}}); 

	//init ssl

	/**
	 * post or get a url
	 * @example post it when [data] isn't null
	 * @example get it when [data] is null/undefined
	 * @example show tips when [alert_it] is true
	 * 
	 * @param  {String}   		url      query URL
	 * @param  {String/Object}	data     form data
	 * @param  {Function} 		callback call it when query success
	 * @param  {Boolean/Object} alert_it show tips when true or noty's config
	 */
	$.query = function(url, data, method, callback, alert_it) {
		if (typeof alert_it == 'undefined') alert_it = true;
		if (typeof method == 'undefined') method = data ? 'POST' : 'GET';
		var _this = this, _result = null, _headers = {}, _data = data;
		if (data && data instanceof String) _data = $.deparam(data);
		if (_data && _data['_method']) {
			method = _data['_method'];
			_headers['X-HTTP-Method-Override'] = method;
		};
		if (_data && _data['_token']) //add csrf
			_headers['X-CSRF-TOKEN'] = _data['_token'];
		var ajax = $.ajax({
			url : url,
			data : _data ? _data : null,
			async : callback !== false, 
			cache : false,
			type : method.toUpperCase(),
			headers: _headers,
			timeout : 20000,
			dataType : /[\?&](jsonp|callback)=\?/i.test(url) ? 'jsonp' : 'json',
			success : function(json, textStatus, jqXHR) {
				if (json) {
					if (json.result && alert_it){
						$.showtips(json, true, alert_it);
					}
				}
				if (callback === false)	{
					_result = json;
					return _result;
				}
				if (callback && $.isFunction(callback))
					callback.call(_this, json, textStatus, jqXHR);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (alert_it)
				{
					switch(textStatus) {
						case 'timeout':
							$.tips(QUERY_LANGUAGE.network_timeout);
							break;
						case 'error':
							break;
						case 'notmodified':
							break;
						case 'parsererror':
							$.tips(QUERY_LANGUAGE.parser_error);
							break;
						default:
							$.tips(QUERY_LANGUAGE.server_error);
							break;
					}
				}
			}
		});
		return callback === false ? _result : ajax;
	};
	$.GET = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'GET', callback, alert_it);
	};
	$.POST = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'POST', callback, alert_it)
	};
	$.PUT = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'PUT', callback, alert_it)
	};
	$.DELETE = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'DELETE', callback, alert_it)
	};
	$.HEAD = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'HEAD', callback, alert_it)
	};
	$.PATCH = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'PATCH', callback, alert_it)
	};

	$.showtips = function(tips, redirect, config) {
		if (tips.result == 'api') return; //API

		var _tips = clone(tips);
		var _redirect = typeof redirect == 'undefined' ? true : redirect;
		if (typeof $.showtips_interface != 'undefined') {
			$.showtips_interface(_tips, config);
		} else
			alert(_tips.message.content.noHTML());

		if (_redirect && typeof _tips['url'] != 'undefined') {
			if (_tips.url !== true && _tips.url !== false ) {
				setTimeout(function() {
					self.location.href = _tips.url;
				}, 1500);
			} else if (_tips.url === true) {
				setTimeout(function() {
					self.location.reload();
				}, 1500);
			}
		}
	};

	$.fn.extend({
	query : function(callback, alert_it, show_loading) {
		return this.each(function() {
			var $this = $(this);
			var is_form = $this.is('form');
			show_loading = typeof show_loading != 'undefined' ? show_loading : true;
			var validator = is_form ? $this.data('validator') : null;
			if (validator) validator.settings.submitHandler = function(f,e) {};
			$this.on(is_form ? 'submit': 'click', function(e){
				var selector = $this.attr('selector');
				if ($this.is('.disabled,[disabled]')) return false;
				var $selector = is_form ? $this.add(selector) : $(selector);
				if (validator && !$.isEmptyObject(validator.invalid)) //validator is invalid
					return false;
				
				if((selector || is_form) && $selector.serializeArray().length <= 0) //selector is set,but nothing to query
				{
					$.tips(QUERY_LANGUAGE.unselected);
					return false;
				}
				
				var url = $this.attr(is_form ? 'action' : 'href');
				var method = $this.attr('method');
				var msg = $this.attr('confirm');
				var query = function(){
					var $doms = is_form ? $(':submit,:image',$this)/*.add($this)*/ : $this;
					$doms = $doms.filter(':not(.disabled,[disabled])');
					$doms.prop('disabled',true).attr('disabled','disabled').each(function(){
						var $t = $(this);var o = $t.offset();
						if (show_loading) $('<div style="position:absolute;left:'+(o.left + $t.width())+'px;top:'+(o.top - 16) +'px;height:16px;width:16px;display:block;z-index:99999" class="query-loading"><img src="data:image/gif;base64,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"</div>').appendTo('body');
					}); //disabled the submit button
					return $.query.call($this, url, $selector.serializeArray(), method, callback, alert_it).always(function(){
						$('.query-loading').remove();
						$doms.prop('disabled',false).removeAttr('disabled');
					});
				}
				if (msg) {
					msg = msg.replace('%L', $selector.serializeArray().length)
					$.confirm(msg, query);
				} else
					query.call(this);
				e.stopImmediatePropagation();
				return false;
			});
		});
	}
	});
})(jQuery);