mmmApp.controller('PregameCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService', 'QrFactory', 'SocketFactory',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService, QrFactory, SocketFactory) {
		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.ui = {
			bgHeight : window.innerHeight,
			socketOK: false
		};
		$scope.me = UserFactory.User;
		socket.emit('initTwins', UserFactory.User.token);

		$scope.solo = function(){
			socket.emit('setSolo', UserFactory.User.token);
		}

		
		// console.log(google);
		console.log(UserFactory.User);
		GmapService.hideMap(true);
}]);