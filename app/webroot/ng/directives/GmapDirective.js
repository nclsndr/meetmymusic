mmmApp.directive('gmap', ['GmapService', 'UserFactory', function(GmapService, UserFactory){
	return {
		restrict: 'E',
		// scope:{},
		template : '<div fullheight id="map"><div/>',
		link: function($scope, elmt, attrs, ctrl){
			// console.log(GmapService);
			// console.log(elmt);

			UserFactory.geolocation()
			.then(
				function(position){
					// console.log(position);
					$scope.init(elmt,position.coords.latitude,position.coords.longitude,false);
				},
				function(data){
					$scope.init(elmt,false,false,false);
				}
			);
		},
		controller: ['$scope', 'GmapService', function($scope, GmapService) {

			$scope.hidden = true;

			$scope.init = function(elmt, lat, lng, zoom){
				// console.log(elmt);
				var res = GmapService.initDraw(elmt[0].children[0], lat, lng, zoom);
				// console.log(res);
				GmapService.setMarker(lat, lng, false);
			}
	    }]
	}
}]);