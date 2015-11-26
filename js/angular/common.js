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
}]);
var $app = angular.module('app', ['jquery.ajax', 'ui.bootstrap', 'untils']).run(function($http, $rootScope) {
	//$http.defaults.headers.common.method = 'get';
	$rootScope.load = function(page, filters, orders) {};
	$rootScope.reload = function() {};
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

}).directive('method', function(){
	return {
		restrict: 'A',
		require: '?a',
		scope: {
			'done': '&ondone',
			'fail': '&onfail'
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
