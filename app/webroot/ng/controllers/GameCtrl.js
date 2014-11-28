mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService','TrackFactory', '$interval',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService, TrackFactory, $interval) {
		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.me = UserFactory.User;
		$scope.peer = UserFactory.Peer;

		$scope.ui = {
			bgHeight : window.innerHeight,
			friendRequestStatus : '',
			leaveGameStatus : 'fadeInRight'
		};
		$scope.friendRequestMsg = 'Add to friends';


		if (!SoundcloudService.isEmpty(SoundcloudService.currentTrack)) {
			// Set large IMG
			SoundcloudService.currentTrack.sc.artwork_url = SoundcloudService.getLargeArtwork(SoundcloudService.currentTrack.sc.artwork_url);

			// SET PEER PLAYER INFO
			SoundcloudService.isDefine(function(){
				SoundcloudService.getTrackInfos(SoundcloudService.meTrackId)
				.then(function(dataSuccess){
						$scope.meTrack = dataSuccess;
						console.log('SC OBJECT : ', $scope.meTrack);
					}
				);	
			});

			// SET EVENT TO EMIT IN SOCKET IO
			SoundcloudService.currentTrack.obj.options.onplay = function(){
				console.log('is played');
				var store = {
					to : UserFactory.token.me,
					ev : 'DesktopPlayPause',
					data : {
						play : true
					}
				};
				SocketFactory.emit('mmmRouterBroadcast', store);
				musicBarInterval();
			}

			SoundcloudService.currentTrack.obj.options.onpause = function(){
				console.log('is paused');
				var store = {
					to : UserFactory.token.me,
					ev : 'DesktopPlayPause',
					data : {
						play : false
					}
				};
				SocketFactory.emit('mmmRouterBroadcast', store);
				$interval.cancel(musicBarInterval);
			}

			SoundcloudService.currentTrack.obj.options.onfinish = function(){
				console.log('track is finished');
				leaveGame('/dashboard');
			}
			soundManager.onready(function(){
				SoundcloudService.currentTrack.obj.play();
				var vol = 0;
				$interval(
					function(){
						if (typeof SoundcloudService.currentTrack != 'undefined') {
							SoundcloudService.currentTrack.obj.setVolume(vol++);
						}
					},
					100,
					100
				);
			});

			// SET UI
			$scope.track = {
				title : SoundcloudService.currentTrack.sc.title,
				artwork_url : SoundcloudService.currentTrack.sc.artwork_url,
				duration : SoundcloudService.currentTrack.sc.duration
			};

			// ADD TRACK TO USER HISTORY 
			TrackFactory.addHistory(SoundcloudService.currentTrack.id)
			.then(
				function(dataSuccess){
					console.log('Song add to History : ', dataSuccess);
				}
			);	

			// INIT MOBILE CONTENT
			var store2 = {
				to : UserFactory.token.me,
				ev : 'trackInfosMobile',
				data : {
					track : SoundcloudService.currentTrack.sc
				}
			};
			SocketFactory.emit('mmmRouterBroadcast', store2);
		}

		GmapService.hideMap(false);

		$scope.addToFriends = function() {
			if ($scope.ui.friendRequestStatus == '') {
				NotificationFactory.add('Friend request send');
				$scope.ui.friendRequestStatus = 'fromMe';
				$scope.friendRequestMsg = 'Waiting ...';

				var store = {
					to : UserFactory.token.peer,
					ev : 'friendRequest',
					data : {
						caller : UserFactory.User.id
					}
				};
				SocketFactory.emit('mmmRouterBroadcast', store);
			}
		}

		$scope.passTheSong = function() {
			NotificationFactory.add('Song skiped');
			leaveGame('/search');
		}
		$scope.toDashboard = function(){
			leaveGame('/dashboard');
		}

		$scope.addToFavorites = function() {
			NotificationFactory.add('Add to your favorites on SoundCloud');
			SoundcloudService.addToFavorites();
		}

		$scope.play = function() {
			if (SoundcloudService.currentTrack.obj.paused == true) {
				SoundcloudService.currentTrack.obj.play();
			}
			// alert('play debug');
		}
		$scope.pause = function() {
			if (SoundcloudService.currentTrack.obj.paused==false) {
				SoundcloudService.currentTrack.obj.pause();
			}
			// alert('pause debug');
		}

		function leaveGame(leavePath){
			var leavePath = leavePath;
			console.log('First');
			$interval.cancel(musicBarInterval);
			SoundcloudService.resetPlayer(function(){
				console.log('Second');
				var store = {
					data : {
						data : UserFactory.token.peer
					}
				};
				SocketFactory.emit('leaveGame', store);

				UserFactory.resetPeer(function(){
					console.log('readyToLeave');
					$location.path(leavePath);
				});
			});
		}

		var musicBarInterval = $interval(function(){
            if (SoundcloudService.currentTrack.obj) {
                // console.log(SoundcloudService.currentTrack.obj.position);
                console.log('------- POSITION : ',SoundcloudService.currentTrack.obj.position);
                $scope.musicBar.tcTotalConvert = SoundcloudService.setTimeCode(attrs.duration);
                $scope.musicBar.progress = (SoundcloudService.currentTrack.obj.position*100)/parseInt(attrs.duration);
                $scope.musicBar.tcProgressConvert = SoundcloudService.setTimeCode(SoundcloudService.currentTrack.obj.position);
            }
        }, 1000);


		// SOCKET IO EVENTS TO LISTEN

		SocketFactory.on('friendRequest', function(data){
			if (data.caller == UserFactory.User.id) {
				NotificationFactory.add('Friend request send', 'success');
				$scope.ui.friendRequestStatus = 'fromMe';
				$scope.friendRequestMsg = 'Waiting ...';
			}else{
				NotificationFactory.add(UserFactory.Peer.username+' wants to be your friend', 'success');
				$scope.ui.friendRequestStatus = 'fromPeer';
				$scope.friendRequestMsg = 'Accept demand';
			}
			$scope.$apply();
		});

		SocketFactory.on('MobileplayPause', function(data){

			console.log(data.play && SoundcloudService.currentTrack.obj.paused);

			if (data.play && SoundcloudService.currentTrack.obj.paused) {
				SoundcloudService.currentTrack.obj.play();
			}else{
				SoundcloudService.currentTrack.obj.pause();
			}
		});

		SocketFactory.on('confirmLeaveGame', function(data){
			$scope.ui.leaveGameStatus = 'leave';
			NotificationFactory.add( UserFactory.Peer.username+' have left the game', 'error');
			
			$scope.$apply();

			console.log('confirmLeaveGame : ', data);
		});
	
}]);