mmmApp.controller('DashboardCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q', '$location', '$scope', 'GmapService',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $location, $scope, GmapService) {

		// if (UserFactory.isNotLogged()) {
		// 	NotificationFactory.add('You are not logged', 'error');
		// 	$location.path('/');
		// }
		$scope.ui = {
			bgHeight : window.innerHeight
		};
		$scope.me = UserFactory.User;

		$scope.dropdown = function() {
			var dropdownUser = document.getElementsByClassName('dropdownUser')[0];
            var userOption = document.getElementById('userOption');
            var dropDownIcon = document.getElementById('dropDownIcon');
	    	if(!dropdownUser.classList.contains('visible')){
                dropdownUser.classList.add("visible");
                dropdownUser.classList.remove("fadeOutUp");
                dropDownIcon.classList.add("rotate");
                
            }
            else {
                dropdownUser.classList.add("fadeOutUp");
                setTimeout(function() {
                    dropdownUser.classList.remove("visible");
                    dropdownUser.classList.add("fadeOutUp");
                    dropDownIcon.classList.remove("rotate");
                }, 700) 
            }
		}

		// console.log(google);
		console.log(UserFactory.User);
		GmapService.hideMap(false);
}]);