mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {
		
		$scope.me = UserFactory.User;
		$scope.tcProgress = 0;
		$scope.tcTotal = 6000;
		$scope.trackId = SoundcloudService.choosenTrackId;


		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.ui = {
			bgHeight : window.innerHeight
		};



		SoundcloudService.getTrackInfo()
		.then(
			function(data){
				console.log(data);
				$scope.trackChoosen = data;
				// $scope.$apply(function(){
					
				// });
			}
		);

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