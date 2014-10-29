mmmApp.controller('UserCtrl', ['UserFactory', 'SoundcloudService', '$q','$scope', 
	function (UserFactory, SoundcloudService, $q, $scope) {

		SoundcloudService.init();
		$scope.SC = {};
		$scope.User = {
			register : {},
			login : {} 
		};
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
					UserFactory.user.token = data.token;
				}, function (msg){
					console.log(msg);
				});
		}


		$scope.registerForm = function(){
			// UserFactory.register($scope.User.register)
			// 	.then(
			// 	function (data){
			// 		console.log(data);
			// 		UserFactory.user.token = data.token;
			// 	}, function (msg){
			// 		console.log(msg);
			// 	});
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
							console.log(dataSuccess);
							if (dataSuccess.hasNoAccount) {
								$scope.ui.loginState = 'fadeOut';
								$scope.ui.registerState = 'fadeIn';
								$scope.ui.msgRegisterState = 'fadeOut';
								$scope.User.register.api_id = SCUser.id;
								$scope.User.register.avatar_url = SCUser.avatar_url;
								$scope.User.register.username = SCUser.username;
							}else{
								alert('you are logged');
								console.log('need to redirect : user logged');
								// REDIRECT TO DASHBOARD
							}
						},
						function(data, status){
							// NOTIF
						});
				});
		};


}]);