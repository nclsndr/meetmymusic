mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {
		
		$scope.me = UserFactory.User;
		$scope.tcProgress = 0;
		$scope.tcTotal = 100000;


		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.ui = {
			bgHeight : window.innerHeight
		};

		$scope.getTrackInfo = function(id){
			return $scope.SoundcloudService.getTrackInfo(id);
		}

		SocketFactory.removeAllListeners();

		SoundcloudService.init();
		$scope.SC = {};

		SocketFactory.on('authToken', function(debug){
			if (debug) {
				$scope.nodeDatas = debug;
			}
		});
		
		GmapService.hideMap(false);
		if(SoundcloudService.choosenTrack) {
			$scope.trackChosen = $scope.getTrackInfo(SoundcloudService.choosenTrackId);
			console.log($scope.trackChosen);
		}
}]);