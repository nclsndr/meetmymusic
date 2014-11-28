mmmApp.directive('dropdown', ['$location', function(location){
	return {
		restrict: 'E',
		templateUrl : 'http://mmm.nclsndr.fr/ng/partials/dropdown.html',
		link: function($scope, element, attrs){
			$scope.hideDropdown = true;
			$scope.dropdownClose = true;

			$scope.dropdown = function() {
				if($scope.hideDropdown == true) {
					$scope.hideDropdown = false;
					$scope.dropdownClose = false;
				}
				else {
					$scope.dropdownClose = true;
					setTimeout(function() {
						$scope.hideDropdown = true;

					}, 400);
				}
			};

			$scope.clickLogo = function(){
				var currentPage = window.location.href.toString().split(window.location.host+'/#/')[1];
				switch(currentPage){
					case 'dashboard':
						console.log('Dashboard Menu Back');
						break;
					case 'search':
						console.log('Search Back');
						break;
					case 'pregame':
						console.log('Pregame Back');
						break;
					case 'game':
						console.log('Game Back');
						break;
					default:
						console.log('Default Back');
						break;
				}
			}
		},
		
	}
}]);
