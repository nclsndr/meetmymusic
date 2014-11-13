mmmApp.directive('gmap', ['GmapService', function(GmapService){
	return {
		restrict: 'A',
		// scope:{},
		template : '<div id="map"><div/>',
		link: function($scope, elmt, attrs, ctrl){
			
		}
	}
}]);