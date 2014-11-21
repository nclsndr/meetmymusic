mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {

		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.ui = {
			bgHeight : window.innerHeight
		};

		$scope.me = UserFactory.User;
		$scope.tcProgress = 0;
		$scope.tcTotal = 100;

		SocketFactory.removeAllListeners();

		SoundcloudService.init();
		$scope.SC = {};

		SocketFactory.on('authToken', function(debug){
			if (debug) {
				$scope.nodeDatas = debug;
			}
		});
		
		GmapService.hideMap(false);
}]);