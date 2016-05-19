var hasOwnProperty = Object.prototype.hasOwnProperty;
var isEmpty = function(obj) {
	// null and undefined are "empty"
	if (obj == null) return true;

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length > 0)    return false;
	if (obj.length === 0)  return true;

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for (var key in obj) {
	    if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}

var url;
(function(url){
	var method = {};
	method.http_build_query = function(formdata, numericPrefix, argSeparator) {
		var value;
		var key;
		var tmp = [];

		var _httpBuildQueryHelper = function (key, val, argSeparator) {
			var k;
			var tmp = [];
			if (val === true) 
				val = '1';
			else if (val === false)
				val = '0';
			if (val !== null) {
				if (typeof val === 'object') {
			    	for (k in val) {
			    		if (val[k] !== null)
			    			tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator));
					}
					return tmp.join(argSeparator);
				} else if (typeof val !== 'function') {
					return method.urlencode(key) + '=' + method.urlencode(val);
				} else {
					throw new Error('There was an error processing for http_build_query().');
				}
			} else {
				return '';
			}
		}

		if (!argSeparator) argSeparator = '&';
		for (key in formdata) {
			value = formdata[key];
			if (numericPrefix && !isNaN(key)) key = String(numericPrefix) + key;
			var query = _httpBuildQueryHelper(key, value, argSeparator);
			if (query !== '') tmp.push(query);
		}

		return tmp.join(argSeparator)
	};

	method.urlencode = function(str){
		str = (str + '')

		// Tilde should be allowed unescaped in future versions of PHP (as reflected below),
		// but if you want to reflect current
		// PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
		return encodeURIComponent(str)
			.replace(/!/g, '%21')
			.replace(/'/g, '%27')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29')
			.replace(/\*/g, '%2A')
			.replace(/%20/g, '+');
	};

	method.urldecode = function(str) {
		return decodeURIComponent((str + '')
		.replace(/%(?![\da-f]{2})/gi, function () {
			// PHP tolerates poorly formed escape sequences
			return '%25'
		})
    	.replace(/\+/g, '%20'));
	}

	//export
	for(var n in method) {
		url[n] = method[n];
		egret.registerClass(method[n], 'url.' + n);
	}
})(url || (url = {}));

var url;
(function(url){
	var method = {};
	method._httpRequest = function(request, options, thisObj) {
		request.addEventListener(egret.Event.COMPLETE, function(event) {
			var request = event.currentTarget;
			if (options.success) {
				options.success.call(thisObj, JSON.parse(request.response), request.getAllResponseHeaders(), request);
			}
		}, thisObj);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, function(event) {
			if (options.error) {
				options.error.call(thisObj, event);
			}
		}, thisObj);
		request.addEventListener(egret.ProgressEvent.PROGRESS, function(event){
			if (options.progress)
				options.progress(thisObj, event.bytesLoaded, event.bytesTotal);
		}, thisObj);
		return request;
	}
	
	method.query = function(options, thisObj, param3) {
		if (typeof options == 'string') {
			thisObj['url'] = options;
			options = thisObj || {};
			thisObj = param3;
		}
		var request = new egret.HttpRequest();
		request.responseType = options.dataType || egret.HttpResponseType.TEXT;
		request.open(options.url, options.method || egret.HttpMethod.GET);
		for (var key in (options.headers || {}))
			request.setRequestHeader(key, options.header[key]);
		if (options.method == egret.HttpMethod.POST) request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		var data = options.data || {};
		if (typeof data != 'string') data = url.http_build_query(data);
		request.send(data);
		
		return method._httpRequest(request, options, thisObj);
	}

	method.upload = function(options, thisObj, param3) {
		if (typeof options == 'string') {
			thisObj['url'] = options;
			options = thisObj || {};
			thisObj = param3;
		}
		var request = new egret.HttpRequest();
		request.responseType = options.dataType || egret.HttpResponseType.TEXT;
		request.open(options.url, egret.HttpMethod.POST);
		for (var key in (options.headers || {}))
			request.setRequestHeader(key, options.header[key]);
		var randString = '----FormBoundary' + (100000000 * Math.rand()).toString(16);
		request.setRequestHeader('Content-Type', 'Content-Type:multipart/form-data; boundary=' + randString);

		var data = '';
		for(var key in options.data)
			data += '--' + randString + "\nContent-Disposition: form-data; name=\""+key+"\"\n\n" + options.data[key];
	
		request.send(data);

		return method._httpRequest(request, options, thisObj);
	}
	
	method.get = function(url, data, onSuccess, thisObj) {
		return method.query({
			url: url,
			data: data,
			method: egret.HttpMethod.GET,
			success: onSuccess
		}, thisObj);
	}
	method.post = function(url, data, onSuccess, thisObj) {
		return method.query({
			url: url,
			data: data,
			method: egret.HttpMethod.POST,
			success: onSuccess
		}, thisObj);
	}
	//export
	for(var n in method) {
		url[n] = method[n];
		egret.registerClass(method[n], 'url.' + n);
	}

})(url || (url = {}));

