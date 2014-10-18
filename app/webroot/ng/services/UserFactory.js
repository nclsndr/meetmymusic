mmmApp.factory('UserFactory', ['$http', '$location', '$q',
function ($http, $location, $q) {
	var Factory = {

		user: {
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
					deferred.reject('impossible de finaliser l\'enregistrement');
				});
			return deferred.promise;
		}
	}
	return Factory;
}]);