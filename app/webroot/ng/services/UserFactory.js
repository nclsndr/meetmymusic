mmmApp.factory('UserFactory', ['$http', '$location', '$q',
function ($http, $location, $q) {
	var Factory = {

		User: {},

		login:function(params){
			var deferred = $q.defer();
			var url = 'http://mmm.nclsndr.fr/users/login';

			$http({method:'POST', data:params, url:url})
				.success(function(data, status){
					deferred.resolve(data);
				})
				.error(function(data, status){
					deferred.reject(data);
				});
			return deferred.promise;
		},

		register:function(params){
			var deferred = $q.defer();
			var url = 'http://mmm.nclsndr.fr/users';
			$http({method:'POST', data:params, url:url})
				.success(function(data, status){
					console.log('success : ',data);
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
					}
					deferred.resolve(data);
				})
				.error(function(data, status){
					deferred.reject(data);
				});
			return deferred.promise;
		},

		usernameExists:function(username){
			var cleanUsername = username.trim();
			var deferred = $q.defer();
			var url = 'http://mmm.nclsndr.fr/users/usernameexist';

			$http({method:'POST', data:username, url:url})
				.success(function(data, status){
					if (!data.hasNoAccount) {
						Factory.User = data;
					}
					deferred.resolve(data);
				})
				.error(function(data, status){
					var error = {'error':true}
					deferred.reject(error);
				});
			return deferred.promise;
		}
	}
	return Factory;
}]);