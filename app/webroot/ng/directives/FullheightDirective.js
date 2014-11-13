mmmApp.directive('fullheight', ['$window', function ($window){
	return {
		restrict: 'A',
		priority : 1001,
		link: function(scope, element, attrs){
			var w = angular.element($window);
			scope.setHeight = function(height){
				element.attr('style', 'height:'+height+'px;');
			};
			scope.setHeight($window.innerHeight);

	        scope.getWindowDimensions = function () {
	            return { 'h': $window.innerHeight, 'w': $window.innerWidth };
	        };
	        
	        scope.$watch(
	        	scope.getWindowDimensions, 
	        	function (newValue, oldValue) {
		            scope.setHeight(newValue.h);
		        }
	        	, true
	        );

	        w.bind('resize', function () {
	            scope.$apply();
	        });

		}
	}
}]);