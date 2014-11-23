mmmApp.directive('dropdown', [function (){
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
		},
		
	}
}]);
