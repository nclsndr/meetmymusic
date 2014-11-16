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


//            HOW TO $timeout 
//  var def = $q.defer();
            
// var timer = $timeout(
//     function() {
//         console.log( "Timeout executed", Date.now() );
//     },
//     2000
// );
// // Let's bind to the resolve/reject handlers of
// // the timer promise so that we can make sure our
// // cancel approach is actually working.
// timer.then(
//     function() {
//         console.log("Timer resolved!", Date.now());
        

//         UserFactory.usernameExist
//         .then(
//             function (data){

//             }, 
//             function (msg){
//                 console.log(msg);
//         });

//         def.resolve();


//         def.reject();

//         if (usernames.indexOf(modelValue) === -1) {
//             // The username is available
            
//           } else {
            
//           }
//     },
//     function() {
//         console.log( "Timer rejected!", Date.now() );
//     }
// );
// // When the DOM element is removed from the page,
// // AngularJS will trigger the $destroy event on
// // the scope. This gives us a chance to cancel any
// // pending timer that we may have.
// $scope.$on(
//     "$destroy",
//     function(event) {
//         $timeout.cancel( timer );
//     }
// );



// // console.log(modelValue);
// // if (ctrl.$isEmpty(modelValue)) {
// //   // consider empty model valid
// //   return $q.when();
// // }


// console.log(time);

// return def.promise;