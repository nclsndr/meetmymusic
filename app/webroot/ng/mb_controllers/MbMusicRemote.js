mmmApp.controller('MbMusicRemoteCtrl', ['$q','$scope', '$location','UserFactory', 'SoundcloudService',
	function ($q, $scope, $location, UserFactory, SoundcloudService) {

		$scope.peer = UserFactory.Peer;
		$scope.track = SoundcloudService.currentTrackMobile;
}]);