document.getElementsByTagName('html')[0].setAttribute('ng-app', 'app');
//jquery ajax
angular.module('jquery', [])
.provider("$ajax", function(){
	this.$get = ['$rootScope', function($rootScope){
		function ajax(url, options){
			var $dfd = jQuery.Deferred();
			jQuery.ajax(url, options).done(function(data){
				$rootScope.$apply(function() {
					$dfd.resolve(data);
				});
			}).fail(function() {
				var failArgs = arguments;
				$rootScope.$apply(function() {
					$dfd.reject.apply($dfd, failArgs);
				});
			});
			return $dfd.promise();
		}
		angular.forEach(['get','post','head','patch','put','delete'], function(method){
			ajax[method] = function(url, data, callback) {
				return ajax({url: url, data: data, type: method.toUpperCase(), success: callback});
			}
		});
		return query;
	}];
})
.provider("$query", function(){
	this.$get = ['$rootScope', function($rootScope){
		var query = function(url, data, method, callback, alert_it){
			if (callback === false) callback = null;
			var $dfd = jQuery.Deferred();
			jQuery.query(url, data, method, callback, alert_it).done(function(data, textStatus, jqXHR){
				var args = arguments;
				$rootScope.$apply(function() {
					data && data.result == 'success' ? $dfd.resolve.apply($dfd, args) : $dfd.reject.apply($dfd, args)
				});
			}).fail(function() {
				var args = arguments;
				$rootScope.$apply(function() {
					$dfd.reject.apply($dfd, args);
				});
			});
			return $dfd.promise();
		}
		angular.forEach(['get','post','head','patch','put','delete'], function(method){
			query[method] = function(url, data, callback, alert_it)
			{
				return query(url, data, method, callback, alert_it);
			}
		});
		query.form = function($form, callback, alert_it) {
			var method = ($form.attr('method') ? $form.attr('method') : 'POST').toLowerCase();
			return query($form.attr('action'), $form.serialize(), method, callback, alert_it);
		}
		return query;
	}];
	//this.$get.$inject = ['$rootScope'];
	//return this;
});
angular.module('untils', [])
//nl2br
.filter('nl2br', function($sce) {
	return function(input) {
		if (input !== void 0) {
			return $sce.trustAsHtml(input.replace(/\n/g, '<br>'));
		}
	};
})
//byte2size
.filter('byte2size', function() {
	return function(input) {
		if (input !== void 0) {
			return bytesToSize(input);
		}
	};
})
//trustUrl for video/audio
.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]).directive('uploader', function() {
	return {
		restrict: 'A',
		require: ['?input'],
		scope: {
			maxWidth: '@',
			maxHeight: '@',
			filesize: '@',
			filetype: '@',
			filelimit: '@uploader',
			value: '=ngModel',
		},
		link: function(scope, elem, attrs) {
			var update = function(e, file, json, ids){
				scope.value = elem.val();
				scope.$apply();
			};
			elem.uploader(scope.maxWidth, scope.maxHeight, scope.filesize, scope.filetype, scope.filelimit, scope.value ? scope.value : elem.val()).on('uploader.uploaded', update).on('uploader.removed', update);
		}
	};
});
var $app = angular.module('app', ['jquery', 'ui.bootstrap', 'untils', 'ngInputModified'])
.config(function(inputModifiedConfigProvider) {
	inputModifiedConfigProvider.disableGlobally(); //默认关闭ngInputModified
})
.config(function($provide) {
	$provide.decorator('$controller', function($delegate) {
		return function(constructor, locals, later, indent) {
			if (typeof constructor === 'string' && !locals.$scope.controllerName) {
				locals.$scope.controllerName =  constructor;
			}
			return $delegate(constructor, locals, later, indent);
		};
	});
})
.run(function($rootScope) {
	/*$rootScope.load = function(page, filters, orders) {};
	$rootScope.reload = function() {};*/
})
//<a href="空/#" ng-click=""></a>
.directive('a', function() {
	return {
		restrict: 'E',
		link: function(scope, elem, attrs) {
			if(attrs.ngClick || attrs.href === '' || attrs.href === '#')
				elem.on('click', function(e){
					e.preventDefault();
				});
		}
	};
})
//<a method></a> <form method></form>
.controller('queryController',  function(){

}).directive('query', function(){
	return {
		restrict: 'A',
		require: ['?a', '?form'],
		scope: {
			'done': '&query',
			'fail': '&fail'
		},
		controller: 'queryController',
		link: function(scope, elem, attrs) {
			elem.query(function(json){
				if (json.result == 'success')
					scope.done.apply(scope, [json]);
			}, !attrs.noAlert);
		}
	}
});
