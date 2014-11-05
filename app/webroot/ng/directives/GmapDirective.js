mmmApp.directive('gmap', ['GmapService', function(GmapService){
	return {
		restrict: 'A',
		// scope:{},
		template : '<li>{{notifications}}</li>',
		link: function($scope, elmt, attrs, ctrl){
			
		}
	}
}]);