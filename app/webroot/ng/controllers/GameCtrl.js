mmmApp.controller('GameCtrl', ['SocketFactory','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService','TrackFactory',
	function (SocketFactory,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService, TrackFactory) {
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



		// $scope.peer = {
		// 	username : 'username',
		// 	avatar_url : 'http://placekitten.com/g/200/200',
		// 	city : 'Berlin !'
		// }

		// SoundcloudService.isDefine(function(){
		// 	SoundcloudService.getTrack(121346458)
		// 	.then(
		// 		function(currentTrack){
		// 			console.log(currentTrack);
		// 			$scope.track = {
		// 				title : currentTrack.sc.title,
		// 				duration : currentTrack.sc.duration
		// 			};

					
		// 		}
		// 	);
		// });

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
			}

			SoundcloudService.currentTrack.obj.options.onfinish = function(){
				console.log('track is finished');
				leaveGame('/dashboard');
			}
			SoundcloudService.currentTrack.obj.paused = true;

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
			var store = {
				to : UserFactory.token.me,
				ev : 'trackInfosMobile',
				data : {
					track : SoundcloudService.currentTrack.sc
				}
			};
			SocketFactory.emit('mmmRouter', store);
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
			SoundcloudService.resetPlayer(function(){
				var store = {
					to : UserFactory.token.peer,
					ev : 'leaveGame',
					data : {
						user : UserFactory.Peer.id
					}
				};
				SocketFactory.emit('mmmRouterBroadcast', store);
				var del = {
					token : UserFactory.token.me,
					finalToken : UserFactory.token.both
				}
				SocketFactory.emit('leaveRooms', store);

				UserFactory.resetPeer(function(){
					$location.path(leavePath);
				});
			});
		}

		// SOCKET IO EVENTS TO LISTEN

		SocketFactory.on('friendRequest', function(data){
			if (data.caller == UserFactory.User.id) {
				NotificationFactory.add(UserFactory.Peer.username+' wants to be your friend', 'success');
				$scope.ui.friendRequestStatus = 'fromPeer';
				$scope.friendRequestMsg = 'Accept demand';
			}else{
				NotificationFactory.add('Friend request send', 'success');
				$scope.ui.friendRequestStatus = 'fromMe';
				$scope.friendRequestMsg = 'Waiting ...';
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

		SocketFactory.on('leaveGame', function(data){
			$scope.ui.leaveGameStatus = 'leave';
			NotificationFactory.add( UserFactory.Peer.username+' have left the game', 'error');
			$scope.$apply();

			console.log('leaveGame : ', data);
		});


















		
}]);