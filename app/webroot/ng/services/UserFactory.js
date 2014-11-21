mmmApp.factory('UserFactory', ['$http', '$location', '$q', 'LSFactory',
function ($http, $location, $q, LSFactory) {
	var Factory = {

		User: {},
		location : {},

		// login:function(params){
		// 	var deferred = $q.defer();
		// 	var url = 'http://mmm.nclsndr.fr/users/login';

		// 	$http({method:'POST', data:params, url:url})
		// 		.success(function(data, status){
		// 			deferred.resolve(data);
		// 		})
		// 		.error(function(data, status){
		// 			deferred.reject(data);
		// 		});
		// 	return deferred.promise;
		// },

		register:function(params){
			var deferred = $q.defer();
			var url = 'http://mmm.nclsndr.fr/users';
			$http({method:'POST', data:params, url:url})
				.success(function(data, status){
					Factory.User = data;
					deferred.resolve(data);
				})
				.error(function(data, status){
					console.log('reject : ',data);
					console.log('reject status : ',status);
					deferred.reject(data);
				});
			return deferred.promise;
		},

		isNotLogged:function(){
			if (Factory.User == null) return true;
		    if (Factory.User.length > 0)    return false;
		    if (Factory.User.length === 0)  return true;
		    for (var key in Factory.User) {
		        if (hasOwnProperty.call(Factory.User, key)) return false;
		    }
		    return true;
		},

		hasAccount:function(api_id){
			var deferred = $q.defer();
			var url = 'http://mmm.nclsndr.fr/users/hasaccount';

			$http({method:'POST', data:api_id, url:url})
				.success(function(data, status){
					if (!data.hasNoAccount) {
						Factory.User = data;
						LSFactory.set('User', data);
					}
					deferred.resolve(data);
				})
				.error(function(data, status){
					deferred.reject(data);
				});
			return deferred.promise;
		},

		usernameExists:function(username){
			var deferred = $q.defer();
			var req = {username:username};

			var url = 'http://mmm.nclsndr.fr/users/usernameexist';

			$http({method:'POST', data:req, url:url})
				.success(function(data, status){
					if (data.usernameExist) {
						Factory.User = data;
						var res = {user:true};
						deferred.resolve(res);
					}else{
						var res = {user:false};
						deferred.reject(res);
					}
				})
				.error(function(data, status){
					var error = {'error':true}
					deferred.reject(error);
				});
			return deferred.promise;
		},

		geolocation:function(){

			var deferred = $q.defer();

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					function(position){
						Factory.location.lat = position.coords.latitude;
						Factory.location.lng = position.coords.longitude;
						deferred.resolve(position);
					},
					function(){
						var error = {error:'You must fill your location manually'};
						deferred.reject(error);
					},
					{enableHighAccuracy:true}
				);
			}else{
				var error = {error:'Your browser doesn\'t support geolocation'};
				deferred.reject(error);
			}
			return deferred.promise;
		},

		updateGeoloc:function(){
			Factory.User.lat = Factory.location.lat;
			Factory.User.lng = Factory.location.lng;
		}

	}
	return Factory;
}]);