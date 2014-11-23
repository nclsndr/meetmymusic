mmmApp.controller('PregameCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService', 'QrFactory', 'SocketFactory',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService, QrFactory, SocketFactory) {
		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}
		console.log($location);
		$scope.ui = {
			bgHeight : window.innerHeight,
			socketOK: false,
			mobileUrl : 'http://'+$location.$$host+':'+$location.$$port+'/mobile/',
			loadPeer : 'hidden',
			choseStack : 'fadeIn'
		};
		$scope.me = UserFactory.User;

		SocketFactory.on('confirmSetTwins', function(data){
			console.log('confirmSetTwins : ',data);
			$scope.ui.choseStack = 'hidden';
			$scope.ui.loadeer = 'fadeIn';
			$scope.$apply();
			NotificationFactory.add('you\'re phone is now connected', 'success');
			SoundcloudService.getTrackInfos(SoundcloudService.meTrackId)
			.then(
				function(dataSuccess){
					dataSuccess.artwork_url = SoundcloudService.getLargeArtwork(dataSuccess.artwork_url);
					var stored = {
						to : UserFactory.token.me,
						ev : 'mobileDataInit',
						data : {
							user : UserFactory.User,
							trackMobile : dataSuccess	
						}
					};
					GmapService.hideMap(false);
					SocketFactory.emit('mmmRouter', stored);		
				}
			);
		});	


		SocketFactory.on('confirmSetSolo', function(data){
			console.log('confirmSetSolo : ',data);
			$scope.ui.choseStack = 'hidden';
			$scope.ui.loadPeer = 'fadeIn';
			NotificationFactory.add('we look for a peer', 'success');
			GmapService.hideMap(false);
		});	


		SocketFactory.on('finalToken', function(finalToken){
			UserFactory.getPeer(finalToken).then(
				function(dataSuccess){
					console.log('Peer User : ', dataSuccess);
					NotificationFactory.add('You\'re connected with '+dataSuccess.username, 'success');

					GmapService.setMarker('peer',UserFactory.Peer.lat, UserFactory.Peer.lng);
					GmapService.autoCenter();

					var store = {
						to : UserFactory.token.peer,
						ev : 'sendMeTrackId',
						data : {
							trackId : SoundcloudService.meTrackId
						}
					};
					SocketFactory.emit('mmmRouter', store);
				},
				function(error){
					console.log(error);
				}
			);
		});

		SocketFactory.on('sendMeTrackId', function(data){
			console.log('trackId : ', data.trackId);
			
			SoundcloudService.getTrack(data.trackId)
				.then(
					function(dataSuccess){
						console.log('getTrack SC : ', dataSuccess);
						$location.path('/game');
					}
				);
		});

		

		// SocketFactory.emit('initTwins', UserFactory.User.token);
		$scope.solo = function(){
			SocketFactory.emit('setSolo', UserFactory.User.token);
			NotificationFactory.add('We search for someone', 'success');
		}
		
		// console.log(google);
		console.log(UserFactory.User);
		GmapService.hideMap(true);
}]);