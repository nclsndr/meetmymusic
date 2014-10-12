mmmApp.controller('DebugCtrl', ['socket', '$scope', 
	function (socket, $scope) {
		console.log(socket);
		$scope.element = function(){
			console.log('send');
			socket.emit('message', $scope.text);
		}
		socket.on('message', function(msg){
			console.log('received');
			$scope.message = msg;
		});
		// socket.emit('meetmymusic', 'request a user');

	}]
);