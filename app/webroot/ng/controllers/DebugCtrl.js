mmmApp.controller('DebugCtrl', ['socket', '$scope', 'QrFactory', 'SoundcloudService',
	function (socket, $scope, QrFactory, SoundcloudService) {

		socket.removeAllListeners();

		SoundcloudService.init();
		$scope.SC = {};

		$scope.connectSC = function(){
			SoundcloudService.connect().then(function(data){
				console.log(data);
				console.log(SoundcloudService.SCUser);
				$scope.SC.user = data;
			});
		};

		$scope.getTracksSC = function(){
			SoundcloudService.getSelfTracks().then(function(data){
				console.log(data);
				$scope.SC.response = data[0];
			});
		};

		$scope.getFavoritesTracks = function(){
			SoundcloudService.getFavoritesTracks().then(function(data){
				console.log(data);
				if (data.length>0) {
					$scope.SC.favorites = data;
				}
			});
		};

		$scope.selectTrack = function(id){
			socket.emit('sound', id);
		};

		$scope.playCurrent=function(){
			SoundcloudService.playThis(0);
		}
		$scope.pauseCurrent=function(){
			SoundcloudService.pauseThis(0);
		}


		$scope.textSubmit = function(){
			socket.emit('message', $scope.chat.text);
			$scope.chat.text = '';
		}
		// socket.emit('message', 'test');

		$scope.messages = [];

		socket.on('message', function(msg){
				console.log('received : ', msg);
			$scope.messages.unshift({msg : msg});
		});


		socket.on('soundR', function(soundId){
			console.log('soundR received : ', soundId);
			if (SoundcloudService.idList.indexOf(soundId)!=-1) {
				console.log('duplicate sound : ',soundId);
				return false;
			};
			SoundcloudService.addSound(soundId).then(function(trackList){
				console.log('trackList :', trackList);
				$scope.sound = trackList[0];
			});
		});
		
		socket.on('authToken', function(debug){
			if (debug) {
				$scope.nodeDatas = debug;
			}
		});
		// socket.emit('meetmymusic', 'request a user');

	}]
);