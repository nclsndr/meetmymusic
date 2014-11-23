mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {
		
		$scope.me = UserFactory.User;
		$scope.tcProgress = 0;

		$scope.ui = {
			bgHeight : window.innerHeight,
			friendRequestTg : true
		};
		
		$scope.trackId = SoundcloudService.choosenTrackId;


		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.addToFriends = function() {
			NotificationFactory.add('Friend request send');
			$scope.ui.friendRequestTg = 'friendRequest';
			alert('addToFriendsDebug');
		}

		$scope.passTheSong = function() {
			NotificationFactory.add('Song passed');
			alert('passTheSongDebug');
		}

		$scope.addToFavorites = function() {
			NotificationFactory.add('Add to your favorites on SoundCloud');
			SoundcloudService.addToFavorites();
		}

		$scope.play = function() {
			NotificationFactory.add('The song is playing');
			alert('play debug');
		}
		$scope.pause = function() {
			NotificationFactory.add('The song is on pause');
			alert('pause debug');
		}


		SoundcloudService.getTrackInfo()
		.then(
			function(data){
				$scope.trackChoosen = data;
				if(data) $scope.tcTotal = data.duration;
				
				console.log('-------$scope data-------');
				console.log($scope.trackChoosen);
				console.log('$scope.tcTotal = ' + $scope.tcTotal)
			}
		);

		// SocketFactory.removeAllListeners();

		// SoundcloudService.init();
		// $scope.SC = {};

		// SocketFactory.on('authToken', function(debug){
		// 	if (debug) {
		// 		$scope.nodeDatas = debug;
		// 	}
		// });
		
		GmapService.hideMap(false);
		
}]);