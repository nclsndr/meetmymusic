mmmApp.controller('PregameCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService', 'QrFactory',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {

		// if (UserFactory.isNotLogged()) {
		// 	NotificationFactory.add('You are not logged', 'error');
		// 	$location.path('/');
		// }
		$scope.ui = {
			bgHeight : window.innerHeight
		};
		$scope.me = UserFactory.User;

		// console.log(google);
		console.log(UserFactory.User);
		GmapService.hideMap(false);
}]);