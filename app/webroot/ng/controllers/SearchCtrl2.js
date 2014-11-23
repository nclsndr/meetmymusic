mmmApp.controller('SearchCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location','$window', '$scope','$http', 'GmapService',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $window, $scope,$http, GmapService,QrFactory) {

		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}
		$scope.ui = {
			bgHeight : window.innerHeight
		};

		$scope.me = UserFactory.User;
		$scope.SC = {};
		$scope.hidePopInValidate = true;
		$scope.popinValidateClose= false;
		$scope.timecode = '00:00';
		$scope.selectedTrack = {};

		$scope.searchSC = function(searchQ){
			if(searchQ==='') {
				$scope.SC.songList = null;
			}
			else {
				SoundcloudService.search(searchQ).then(function(data){
					$scope.SC.songList = data;
				});
			}
		};

		// CALL SC CONNECT ONCE
		SoundcloudService.isDefine(function(){
			SoundcloudService.getFavoritesTracks().then(function(data){
				$scope.SC.favList = data;
				console.log(data);
			});
			SoundcloudService.getHotTracks().then(function(data){
				$scope.SC.hotTracks = data;
				console.log(data);
			});
		});

		$scope.validateSelection = function(){
			console.log($scope.idTemp);
			SoundcloudService.getTrack($scope.selectedTrack.id)
			.then(
				function(dataSuccess){
					$location.path('/pregame');
				}
			);
		};

		$scope.cancelSelection = function(){
			// var bg = document.getElementById('popInValidateBg');
			// var content = document.getElementById('popInValidateContent');
			// bg.classList.add('fadeOut');
			// content.classList.add('zoomOut');
			$scope.selectedTrack = {};

			$scope.popinValidateClose = true;

				setTimeout(function() {
					$scope.hidePopInValidate = true;
				}, 400);
			};
		};

		$scope.openPopIn = function(id,title,cover,duration){
			$scope.selectedTrack.id = id;
			
			$scope.hidePopInValidate = false;
			$scope.popInValidateClose = false;

			$scope.selectedTrack.timecode = SoundcloudService.setTimeCode(duration);
			
			if(cover){
				$scope.selectedTrack.artwork = cover;
			}
			else {
				$scope.selectedTrack.artwork = 'http://mmm.nclsndr.fr/img/app/noPicture.jpg';
			}
			$scope.selectedTrack.title = title;

			$scope.popinValidate = true;
			// console.log('id = ' + id + ' title = ' + title +' cover = ' +  cover + ' duration = ' + duration );
		};
		
		GmapService.hideMap(true);

}]);