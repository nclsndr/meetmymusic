mmmApp.controller('MbStartCtrl', ['$q','$scope', '$location', 'SocketFactory', 'UserFactory',
	function ($q, $scope, $location, SocketFactory, UserFactory) {


		var params = window.location.pathname.split('/mobile/');
		var token = params[params.length-1];

		if (token) {
			console.log(token);
			SocketFactory.emit('setTwins', token);

			SocketFactory.on('mobileTwin', function(data){
				console.log(data);
			});	

			SocketFactory.on('finalToken', function(data){
				UserFactory.getPeer(finalToken).then(
				function(dataSuccess){
					$location.path('/game');
				},
				function(error){
					console.log(error);
				}
			);
			});
		}else{
			alert('There is a problem with your url');
		}

		
		// console.log($location);
		// console.log(SocketFactory);

}]);