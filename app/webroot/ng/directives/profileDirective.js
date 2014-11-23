mmmApp.directive('profilpopin', ['SoundcloudService','UserFactory', function(SoundcloudService,UserFactory){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		templateUrl : 'http://mmm.nclsndr.fr/ng/partials/profilPopIn.html',

		link: function($scope, elmt, attrs, ctrl){
			$scope.closePopIn = function() {
				$scope.profilClose = true;

				setTimeout(function() {
					$scope.hideProfil = true;
				}, 400);
			};

			$scope.openProfil = function() {

				$scope.hideProfil = false;
				$scope.profilClose = false;
				// $scope.dropdown();

				SoundcloudService.getFavoritesTracks().then(function(data){
					$scope.favList = data;
					console.log(data);
				});
			};
		},
		controller: ['$scope', 'UserFactory', function($scope, UserFactory) {
			$scope.hideProfil = true;
			$scope.profilClose = false;

			$scope.me = UserFactory.User;
	    }]
	}
}]);

