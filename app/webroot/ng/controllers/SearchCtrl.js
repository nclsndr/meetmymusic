mmmApp.controller('SearchCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope','$http' 'GmapService',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope,$http, GmapService,QrFactory) {

		if (UserFactory.isNotLogged()) {
			NotificationFactory.add('You are not logged', 'error');
			$location.path('/');
		}
		$scope.ui = {
			bgHeight : window.innerHeight
		};
		$scope.me = UserFactory.User;

		// $scope.searchSong = function() {
		//  	var responsePromise = $http.get("http://api.soundcloud.com/tracks.json?client_id=268d90804476ee4483fd7dea94d198d4&q=the%20fray&limit=5&streamable=true&order=hotness");

  //           responsePromise.success(function(data, status, headers, config) {
  //               $scope.songslist = data.title;
  //               console.log(data.title);
  //               console.log(data);
  //           });
  //           responsePromise.error(function(data, status, headers, config) {
  //               console.log("AJAX failed, searchSon");
  //           });
  //       }
		
		
		// console.log(google);
		// console.log(UserFactory.User);
		GmapService.hideMap(true);
}]);