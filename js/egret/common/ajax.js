var ajax;
(function(ajax){


	ajax = function(options, thisObj, param3) {
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
        request.send(options.data || {});
        request.addEventListener(egret.Event.COMPLETE, function(event) {
        	var request = event.currentTarget;
        	if (options.success) {
				options.success.call(thisObj, request.response, request.getAllResponseHeaders(), request);
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
	var method = {};
	method.get = function(url, data, onSuccess, thisObj) {
		return ajax({
			url: url,
			data: data,
			method: egret.HttpMethod.GET,
			success: onSuccess
		}, thisObj);
	}
	method.post = function(url, data, onSuccess, thisObj) {
		return ajax({
			url: url,
			data: data,
			method: egret.HttpMethod.POST,
			success: onSuccess
		}, thisObj);
	}
	//export
	for(var n in method) {
		ajax.prototype[n] = method[n];
		egret.registerClass(method[n], 'ajax.' + n);
	}

})(ajax || (ajax = {}));