mmmApp.controller('SearchCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope','$http', 'GmapService',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope,$http, GmapService,QrFactory) {

		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}
		$scope.ui = {
			bgHeight : window.innerHeight
		};
		$scope.me = UserFactory.User;
		$scope.SC = {};
		$scope.popin = false;
		$scope.timecode = '00:00';

		$scope.searchSC = function(searchQ){
			if(searchQ==='') {
				$scope.SC.songList = null;
			}
			else {
				SoundcloudService.search(searchQ).then(function(data){
					$scope.SC.songList = data;
					console.log('search');
					console.log(data);
				});
			}
		};

		$scope.getFavoritesTracks = function(){
			SoundcloudService.getFavoritesTracks().then(function(data){
				$scope.SC.favList = data;
				console.log(data);
			});
		};$scope.getFavoritesTracks();
		
		$scope.cancelSelection = function(){
			var bg = document.getElementById('popInValidateBg');
			var content = document.getElementById('popInValidateContent');
			bg.classList.add('fadeOut');
			content.classList.add('zoomOut');
			
			setTimeout(function() {
				$scope.popin = false;
				bg.style.display = 'none';
				content.style.display = 'none';
				bg.classList.remove('fadeOut');
				content.classList.remove('zoomOut');
			}, 500)
			
		};

		$scope.openPopIn = function(id,title,cover,duration){
			var bg = document.getElementById('popInValidateBg');
			var content = document.getElementById('popInValidateContent');
			$scope.timecode = SoundcloudService.setTimeCode(duration);
			if(cover){
				$scope.coverSelected = cover;
			}
			else {
				$scope.coverSelected = 'http://mmm.nclsndr.fr/img/app/noPicture.jpg';
			}
			$scope.titleSelected = title;

			bg.style.display = 'block';
			content.style.display = 'block';
			$scope.popin = true;
			console.log('id = ' + id + ' title = ' + title +' cover = ' +  cover + ' duration = ' + duration );
		};
		
		// console.log(google);
		// console.log(UserFactory.User);
		GmapService.hideMap(true);
}]);