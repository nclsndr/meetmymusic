mmmApp.controller('DebugCtrl', ['socket', '$scope', 'QrFactory',
	function (socket, $scope, QrFactory) {
		console.log(socket);
		$scope.element = function(){
			console.log('send');
			socket.emit('message', $scope.text);
		}
		socket.on('message', function(msg){
			console.log('received');
			$scope.message = msg;
		});
		
		socket.on('authToken', function(debug){
			if (debug) {
				$scope.nodeDatas = debug;
			}
		});
		// socket.emit('meetmymusic', 'request a user');

	}]
);