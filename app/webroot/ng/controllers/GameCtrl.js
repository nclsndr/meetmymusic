mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService','TrackFactory',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService, TrackFactory) {
		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.me = UserFactory.User;
		$scope.peer = UserFactory.Peer;
		$scope.tcProgress = 0;
		$scope.meTrack = {};

		$scope.ui = {
			bgHeight : window.innerHeight,
			friendRequestTg : ''
		};

		if (!SoundcloudService.isEmpty(SoundcloudService.currentTrack)) {
			// Set large IMG
			SoundcloudService.currentTrack.sc.artwork_url = SoundcloudService.getLargeArtwork(SoundcloudService.currentTrack.sc.artwork_url);
			
			$scope.track = {
				title : SoundcloudService.currentTrack.sc.title,
				artwork_url : SoundcloudService.currentTrack.sc.artwork_url,
				duration : SoundcloudService.currentTrack.sc.duration
			};

			TrackFactory.addHistory(SoundcloudService.currentTrack.id)
			.then(
				function(dataSuccess){
					console.log('Song add to History : ', dataSuccess);
				}
			);	

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

		SoundcloudService.getTrackInfos(SoundcloudService.meTrackId)
		.then(function(dataSuccess){
				$scope.meTrack = dataSuccess;
				console.log('SC OBJECT : ', $scope.meTrack);
			}
		);

		
		GmapService.hideMap(false);
		
}]);