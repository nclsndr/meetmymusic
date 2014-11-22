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
			mobileUrl : 'http://'+$location.$$host+':'+$location.$$port+'/mobile/'
		};
		$scope.me = UserFactory.User;

		SocketFactory.on('mobileTwin', function(data){
			console.log(data);
			NotificationFactory.add('you\'re phone is now connected', 'success');
		});	

		SocketFactory.on('finalToken', function(finalToken){
			console.log('finalToken : ',finalToken);
			UserFactory.getPeer(finalToken).then(
				function(dataSuccess){
					NotificationFactory.add('You\'re connected with '+dataSuccess.username, 'success');
					$location.path('/game');
				},
				function(error){
					console.log(error);
				}
			);
		});

		// SocketFactory.emit('initTwins', UserFactory.User.token);
		$scope.solo = function(){
			SocketFactory.emit('setSolo', UserFactory.User.token);
			NotificationFactory.add('We search for someone', 'success');
		}
		
		// console.log(google);
		// console.log(UserFactory.User);
		GmapService.hideMap(true);
}]);