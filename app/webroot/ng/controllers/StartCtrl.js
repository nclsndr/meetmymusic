mmmApp.controller('StartCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q','$scope', '$location', 'GmapService',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $scope, $location, GmapService) {

		SoundcloudService.init();
		$scope.SC = {};
		$scope.ui = {
			loginState : 'fadeIn',
			registerState : 'fadeOut',
			msgRegisterState : 'hide',
			bgHeight : window.innerHeight,
			displayRegister : false
		};

<<<<<<< HEAD
=======


>>>>>>> f4ee9627c700912efae9cb7d9ae10e4c2695083c
		var isGeoloc = false, location = null;

		UserFactory.geolocation()
			.then(
				function(position){
					location = position;
					isGeoloc = true;
				},
				function(msg){
					NotificationFactory.add(msg);
				}
			);
		
		$scope.connectSC = function(){
			SoundcloudService.connect()
				.then(function(data){
					var SCUser = data;

					UserFactory.hasAccount(data.id)
						.then(function(dataSuccess){
							if (dataSuccess.hasNoAccount) {
								if (isGeoloc) {
									$scope.lat = location.coords.latitude;
									$scope.lng = location.coords.longitude;
									GmapService.revGeocoder(location.coords.latitude, location.coords.longitude)
										.then(
											function(results){
												console.log(results[4].formatted_address);
												$scope.city_country = results[4].formatted_address;
												// $scope.register.city.$setViewValue(results[4].formatted_address);
												console.log($scope.register);
											},
											function(msg){
												NotificationFactory.add(msg, 'error');
											}
										);
								}
								$scope.ui.loginState = 'fadeOut';
								$scope.ui.registerState = 'fadeIn';
								$scope.ui.msgRegisterState = 'fadeOut';
								$scope.ui.SCBtState = 'fadeOut';
								$scope.ui.displayRegister = true;

								$scope.api_id = SCUser.id;
								$scope.avatar_url = SCUser.avatar_url;
								$scope.ui.avatar_url = SCUser.avatar_url;
								$scope.username = SCUser.username;
							}else{
								if (isGeoloc) {
									UserFactory.updateGeoloc();
								}
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

		$scope.registerForm = function(){
			if ($scope.register.$valid) {
				var form = $scope.register;
				var toStore = {
					api_id : form.api_id.$modelValue,
					avatar_url : form.avatar_url.$modelValue,
					city : form.city_country.$modelValue,
					lat : form.lat.$modelValue,
					lng : form.lng.$modelValue,
					is_geoloc : isGeoloc,
					mail : form.email.$modelValue,
					username : form.username.$modelValue
				};
				console.log(toStore);

				UserFactory.register(toStore)
					.then(
					function (data){
						NotificationFactory.add('You are logged', 'success');
						$location.path('/dashboard');
					}, function (msg){
						console.log('error : ',msg);
					});
			}else{
				NotificationFactory.add('Some fields aren\'t filled', 'error');
			}
		}

		$scope.showRegister = function(){
			$scope.ui.loginState = 'fadeOut';
			$scope.ui.msgRegisterState = 'fadeIn';
		}


	}
]);