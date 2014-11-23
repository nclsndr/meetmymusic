mmmApp.controller('DashboardCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService) {

		// if (UserFactory.isNotLogged()) {
		// 	NotificationFactory.add('You are not logged', 'error');
		// 	$location.path('/');
		// }
		$scope.ui = {
			bgHeight : window.innerHeight
		};
		$scope.me = UserFactory.User;
		$scope.SC = {};

		$scope.hideFriendList = true;
		$scope.frienListClose = true;

		$scope.toggleFriendList = function() {
			if($scope.frienListClose == true) {
				$scope.hideFriendList = false;
				$scope.frienListClose = false;
			}
			else {
				$scope.frienListClose = true;

				setTimeout(function() {
					$scope.hideFriendList = true;
				}, 400);
			}
		};

		SoundcloudService.isDefine(function(){
			SoundcloudService.getFavoritesTracks().then(function(data){
				$scope.SC.favList = data;
				console.log(data);
			});
		});

		// console.log(google);
		console.log(UserFactory.User);
		GmapService.hideMap(false);
}]);