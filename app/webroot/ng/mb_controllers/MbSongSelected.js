mmmApp.controller('MbSongSelectedCtrl', ['$q','$scope', '$location', 'SocketFactory', 'UserFactory', 'SoundcloudService',
	function ($q, $scope, $location, SocketFactory, UserFactory, SoundcloudService) {

		var params = window.location.pathname.split('/mobile/');
		var token = params[params.length-1];

		if (token) {
			console.log(token);
			SocketFactory.emit('setTwins', token);

			SocketFactory.on('confirmSetTwins', function(data){
				console.log(data);
			});	

			SocketFactory.on('mobileDataInit', function(data){
				console.log(data);
				UserFactory.User = data.user;
				$scope.track = data.trackMobile;
				$scope.$apply();	
			});

			SocketFactory.on('finalToken', function(finalToken){
				UserFactory.getPeer(finalToken)
				.then(
					function(dataSuccess){
						console.log('Peer User : ', dataSuccess);
					},
					function(error){
						console.log(error);
					}
				);
			});

			SocketFactory.on('trackInfosMobile', function(data){
				console.log(data);
				SoundcloudService.currentTrackMobile = data.track;
				console.log(UserFactory);
				$location.path('/remote');
			});

		}else{
			alert('There is a problem with your url');
		}

}]);