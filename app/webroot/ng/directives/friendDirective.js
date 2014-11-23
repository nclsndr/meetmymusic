mmmApp.directive('friendpopin', ['SoundcloudService','UserFactory', function(SoundcloudService,UserFactory){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		templateUrl : 'http://mmm.nclsndr.fr/ng/partials/friendPopIn.html',

		link: function($scope, elmt, attrs, ctrl){
			$scope.closeFriend = function() {
				$scope.friendClose = true;

				setTimeout(function() {
					$scope.hideFriend = true;
				}, 400);
			};

			$scope.openFriend = function() {

				$scope.hideFriend = false;
				$scope.friendClose = false;
				// $scope.dropdown();

				SoundcloudService.getFavoritesTracks().then(function(data){
					$scope.favList = data;
					console.log(data);
				});
			};
		},
		controller: ['$scope', 'UserFactory', function($scope, UserFactory) {
			$scope.hideFriend = true;
			$scope.friendClose = false;

			$scope.me = UserFactory.User;
	    }]
	}
}]);

