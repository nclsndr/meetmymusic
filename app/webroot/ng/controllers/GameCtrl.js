mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {
		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.me = UserFactory.User;
		$scope.peer = UserFactory.Peer;
		$scope.tcProgress = 0;

		$scope.ui = {
			bgHeight : window.innerHeight,
			friendRequestTg : ''
		};

		if (!SoundcloudService.isEmpty(SoundcloudService.currentTrack)) {
			$scope.track = {
				title : SoundcloudService.currentTrack.sc.title,
				artwork : SoundcloudService.currentTrack.sc.artwork_url,
				duration : SoundcloudService.currentTrack.sc.duration
			};
			var store = {
				to : UserFactory.token.me,
				ev : 'trackInfosMobile',
				data : {
					track : SoundcloudService.currentTrack.sc
				}
			};
			SocketFactory.emit('mmmRouter', store);
		}		
		

		$scope.addToFriends = function() {
			NotificationFactory.add('Friend request send');
			$scope.ui.friendRequestTg = 'friendRequest';
			console.log('addToFriends');
			// alert('addToFriendsDebug');
		}

		$scope.passTheSong = function() {
			NotificationFactory.add('Song paCtrlssed');
			// alert('passTheSongDebug');
		}

		$scope.addToFavorites = function() {
			NotificationFactory.add('Add to your favorites on SoundCloud');
			SoundcloudService.addToFavorites();
		}

		$scope.play = function() {
			SoundcloudService.currentTrack.obj.play();
			// alert('play debug');
		}
		$scope.pause = function() {
			SoundcloudService.currentTrack.obj.pause();
			// alert('pause debug');
		}


		// SoundcloudService.getTrackInfo()
		// .then(
		// 	function(data){
		// 		$scope.trackChoosen = data;
		// 		if(data) $scope.tcTotal = data.duration;
				
		// 		console.log('-------$scope data-------');
		// 		console.log($scope.trackChoosen);
		// 		console.log('$scope.tcTotal = ' + $scope.tcTotal)
		// 	}
		// );

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