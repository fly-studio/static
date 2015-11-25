document.getElementsByTagName('html')[0].setAttribute('ng-app', 'app');
var $app = angular.module('app', []).run(function($http, $rootScope) {
	//$http.defaults.headers.common.method = 'get';
	$rootScope.reload = function(page, filters, orders) {};
}).directive('a', function() {
	return {
		restrict: 'E',
		link: function(scope, elem, attrs) {
			if(attrs.ngClick || attrs.href === '' || attrs.href === '#')
				elem.on('click', function(e){
					e.preventDefault();
				});
			
			if (attrs.method)
				elem.query(function(json){
					if (json.result == 'success' && attrs.ngSuccess);
						
				}, !attrs.noAlert);
		}
	};
});
