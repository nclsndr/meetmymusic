mmmApp.controller('StartCtrl', ['NotificationFactory', 'UserFactory', 'SoundcloudService', '$q','$scope', '$location', 'GmapService', 'SocketFactory',
	function (NotificationFactory, UserFactory, SoundcloudService, $q, $scope, $location, GmapService, SocketFactory) {

		SoundcloudService.init();
		$scope.SC = {};
		$scope.ui = {
			loginState : 'fadeIn',
			registerState : 'fadeOut',
			msgRegisterState : 'hide',
			bgHeight : window.innerHeight,
			displayRegister : false,
			validateMessage : false,
			showCreateAccount : true,
		};

		var isGeoloc = false, location = null;

		// RESET LOCAL STORAGE 
		// localStorage.removeItem('User');

		UserFactory.geolocation()
			.then(
				function(position){
					location = position;
					console.log(location);
					isGeoloc = true;
				},
				function(msg){
					NotificationFactory.add(msg,'error');
					// console.log(location);
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
								$scope.ui.showCreateAccount = false;
								$scope.ui.validateMessage = false;
								$scope.ui.avatar_url = SCUser.avatar_url;
								$scope.username = SCUser.username;
							}else{
								var localToken = dataSuccess.token;
								NotificationFactory.add('You are logged', 'success');
								if (isGeoloc) {
									UserFactory.updateGeoloc().then(
										function(dataSuccess){
											NotificationFactory.add('Your geolocation is updated');
											SocketFactory.emit('initTwins', localToken);
											$location.path('/dashboard');
											// REDIRECT TO DASHBOARD
										}
									);
								}else{
									SocketFactory.emit('initTwins', localToken);
									$location.path('/dashboard');
								}
											
							}
						},
						function(data, status){
							NotificationFactory.add('There is a problem to log in', 'error');
						});
				});
		};

		$scope.registerForm = function(){
			if ($scope.register.$valid) {
				var form = $scope.register;
				var toStore = {
					api_id : SoundcloudService.SCUser.id,
					avatar_url : SoundcloudService.SCUser.avatar_url,
					sc_url : SoundcloudService.SCUser.permalink_url,
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
						SocketFactory.emit('initTwins', data.token);
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
			$scope.ui.validateMessage = 'fadeIn';
			$scope.ui.showCreateAccount = false;
		}

		GmapService.hideMap(true);

	}
]);