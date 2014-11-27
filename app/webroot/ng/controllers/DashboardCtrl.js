mmmApp.controller('DashboardCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService','TrackFactory',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService, TrackFactory) {

		// if (UserFactory.isNotLogged()) {
		// 	NotificationFactory.add('You are not logged', 'error');
		// 	$location.path('/');
		// }
		$scope.ui = {
			bgHeight : window.innerHeight,
			asideStatus : 'fadeIn',
			refreshStatus : 'none'
		};
		$scope.me = UserFactory.User;
		$scope.SC = {};

		$scope.hideFriendList = true;
		$scope.frienListClose = true;

		$scope.toggleFriendList = function() {
			if($scope.frienListClose == true) {
				$scope.hideFriendList = false;
				$scope.frienListClose = false;
			}
			else {
				$scope.frienListClose = true;
				setTimeout(function() {
					$scope.hideFriendList = true;
				}, 400);
			}
		};

		$scope.refreshAside = function(){
			$scope.ui.asideStatus = 'fadeOut';
			$scope.ui.refreshStatus = 'infinite_rotate';
			SoundcloudService.isDefine(function(){

				TrackFactory.getHistory(UserFactory.User.id, 20)
				.then(
					function(trackList){
						$scope.SC.userHistory = {};
						$scope.SC.userHistory = trackList;
						$scope.SC.lastTrack = trackList[0];
						$scope.ui.asideStatus = 'fadeIn';
						$scope.ui.refreshStatus = 'none';
					},
					function(error){
						console.log(error);
					}
				);
			});
		}

		$scope.timeSince = function(date) {
		    var seconds = Math.floor(((new Date().getTime()/1000) - date)),
			interval = Math.floor(seconds / 31536000);

			if (interval > 1) return interval + "y";

			interval = Math.floor(seconds / 2592000);
			if (interval > 1) return interval + "m";

			interval = Math.floor(seconds / 86400);
			if (interval >= 1) return interval + "d";

			interval = Math.floor(seconds / 3600);
			if (interval >= 1) return interval + "h";

			interval = Math.floor(seconds / 60);
			if (interval > 1) return interval + "m ";

			return Math.floor(seconds) + "s";
		}

		$scope.refreshAside();

		function refresh(){

		}

		// console.log(google);
		console.log(UserFactory.User);
		GmapService.hideMap(false);
}]);