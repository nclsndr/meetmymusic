mmmApp.directive('dropdown', ['$location', 'SocketFactory', 'SoundcloudService', 'UserFactory', 'GmapService', function($location,SocketFactory,SoundcloudService,UserFactory,GmapService){
	return {
		restrict: 'E',
		templateUrl : 'http://mmm.nclsndr.fr/ng/partials/dropdown.html',
		link: function($scope, element, attrs){
			$scope.hideDropdown = true;
			$scope.dropdownClose = true;

			$scope.dropdown = function() {
				if($scope.hideDropdown == true) {
					$scope.hideDropdown = false;
					$scope.dropdownClose = false;
				}
				else {
					$scope.dropdownClose = true;
					setTimeout(function() {
						$scope.hideDropdown = true;

					}, 400);
				}
			};

			$scope.clickLogo = function(){
				var currentPage = window.location.href.toString().split(window.location.host+'/#/')[1];
				switch(currentPage){
					case 'dashboard':
						console.log('Dashboard Menu Back');
						break;
					case 'search':
						leaveGame('/dashboard');
						console.log('Search Back');
						break;
					case 'pregame':
						leaveGame('/dashboard');
						console.log('Pregame Back');
						break;
					case 'game':
						leaveGame('/dashboard');
						console.log('Game Back');
						GmapService.resetMap();
						break;
					default:
						console.log('Default Back');
						break;
				}
			}

			function leaveGame(leavePath){
				var leavePath = leavePath;
				SoundcloudService.resetPlayer(function(){
					var tokenPeer = false;
					if (UserFactory.token.peer!=false) {
						tokenPeer = UserFactory.token.peer;
					}
					var store = {
						data : {
							data : tokenPeer
						}
					};
					SocketFactory.emit('leaveGame', store);
					UserFactory.resetPeer(function(){
						$location.path(leavePath);
					});


				});
			}
		},
		
	}
}]);
