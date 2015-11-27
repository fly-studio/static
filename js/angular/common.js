document.getElementsByTagName('html')[0].setAttribute('ng-app', 'app');
//jquery ajax
angular.module('jquery.ajax', []).provider("$ajax", function(){
	this.$get = ['$rootScope', function($rootScope){
		function query(options){
			var $dfd = jQuery.Deferred();
			jQuery.ajax(options).done(function(data){
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
		['get','post','head','patch','put','delete'].forEach(function(method){
			query[method] = function(url, data, callback, alert_it)
			{
				if (callback === false) callback = nulll
				var $dfd = jQuery.Deferred();
				jQuery.query(url, data, method, callback, alert_it).done(function(data){
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
		});
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
var $app = angular.module('app', ['jquery.ajax', 'ui.bootstrap', 'untils', 'ngInputModified'])
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
					scope.done.apply(scope);
			}, !attrs.noAlert);
		}
	}
});
