mmmApp.service('RouteService',['$http', '$q', 'UserFactory',
	function ($http, $q, UserFactory){

		this.Url = {
					redirectLogin : '/login',
					login : '/login'
				};

		this.webroot = 'http://mmm.nclsndr.fr';
		this.node = 'http://mmm.nclsndr.fr:3000/#';
		this.partials = 'http://mmm.nclsndr.fr/ng/partials';

		this.getRoute = function (key){
			var webroot = this.webroot;
			var res = false;
			if (UserFactory.User.token) {
				angular.forEach(this.Url, function(value, ref) {
					if (ref == key) {
						res = webroot+value+'?token='+UserFactory.User.token;
					}
				});
			}else{
				angular.forEach(this.Url, function(value, ref) {
					if (ref == key) {
						res = webroot+value;
					}
				});
			}
			return res;
		}

		this.genRoute = function (route){
			if (UserFactory.User.token) {
				return route+'/'+UserFactory.User.token+'/';
			}
			return false;
		}
	}
]);