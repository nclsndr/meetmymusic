mmmApp.controller('GameCtrl', ['socket','NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (socket,NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService,QrFactory) {

		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}

		$scope.ui = {
			bgHeight : window.innerHeight
		};

		$scope.me = UserFactory.User;
		$scope.tcProgress = 0;
		$scope.tcTotal = 100;

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
			add.playThis(0);
		}
		$scope.pauseCurrent=function(){
			SoundcloudService.pauseThis(0);
		}


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
		
		GmapService.hideMap(false);
}]);