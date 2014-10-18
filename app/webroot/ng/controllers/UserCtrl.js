mmmApp.controller('UserCtrl', ['UserFactory', '$q','$scope', 
	function (UserFactory, $q, $scope) {

		$scope.login = function(){
			UserFactory.login($scope.User)
				.then(
				function (data){
					console.log(data);
					UserFactory.user.token = data.token;
				}, function (msg){
					console.log(msg);
				});
		}

}]);