<<<<<<< HEAD
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
=======
mmmApp.controller('UserCtrl', ['$scope', 
	function ($scope) {
		console.log($scope);
>>>>>>> ae018865ed9befee0319c10e4cc4d399d39f16b6
	}]
);