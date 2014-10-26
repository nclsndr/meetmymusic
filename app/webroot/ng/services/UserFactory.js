mmmApp.factory('UserFactory', ['$http', '$location', '$q',
function ($http, $location, $q) {
	var Factory = {

		User: {
			token:''
		},

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
		}
	}
	return Factory;
}]);