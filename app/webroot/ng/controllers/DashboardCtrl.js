mmmApp.controller('DashboardCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope) {

		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}
		$scope.ui = {
			bgHeight : window.innerHeight
		};
		$scope.me = UserFactory.User;

		// console.log(google);
		console.log(UserFactory.User);
}]);