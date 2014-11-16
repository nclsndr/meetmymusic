mmmApp.controller('StartCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q','$scope', '$location',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $scope, $location) {

		SoundcloudService.init();
		$scope.SC = {};
		$scope.ui = {
			loginState : 'fadeIn',
			registerState : 'fadeOut',
			msgRegisterState : 'hide',
			bgHeight : window.innerHeight
		};


		$scope.loginForm = function(){
			UserFactory.login($scope.User.login)
				.then(
				function (data){
				}, 
				function (msg){
					console.log(msg);
				});
		}


		$scope.registerForm = function(){
			console.log($scope.User.register);
			UserFactory.register($scope.User.register)
				// .then(
				// function (data){
				// 	console.log(data);
				// }, function (msg){
				// 	console.log(msg);
				// });
		}

		$scope.showRegister = function(){
			$scope.ui.loginState = 'fadeOut';
			$scope.ui.msgRegisterState = 'fadeIn';
		}

		$scope.connectSC = function(){
			SoundcloudService.connect()
				.then(function(data){
					var SCUser = data;
					UserFactory.hasAccount(data.id)
						.then(function(dataSuccess){
							if (dataSuccess.hasNoAccount) {
								$scope.ui.loginState = 'fadeOut';
								$scope.ui.registerState = 'fadeIn';
								$scope.ui.msgRegisterState = 'fadeOut';
								$scope.ui.SCBtState = 'fadeOut';
								$scope.register.api_id = SCUser.id;
								$scope.register.avatar_url = SCUser.avatar_url;
								$scope.register.username = SCUser.username;
							}else{
								NotificationFactory.add('You are logged', 'success');
								$location.path('/dashboard');
								// REDIRECT TO DASHBOARD
							}
						},
						function(data, status){
							NotificationFactory.add('There is a problem to log in', 'success');
						});
				});
		};


}]);