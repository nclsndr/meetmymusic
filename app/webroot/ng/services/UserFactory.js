mmmApp.factory('UserFactory', ['$http', '$location', '$q', 'LSFactory', 'SocketFactory',
function ($http, $location, $q, LSFactory, SocketFactory) {
	var Factory = {

		User: {},
		Peer:{},
		location : {},
		token : {
			both:false,
			me : false,
			peer:false
		},

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

		set:function(user){
			Factory.User = user;
			Factory.token.me = user.token;
		},
		register:function(params){
			var deferred = $q.defer();
			var url = 'http://mmm.nclsndr.fr/users';
			$http({method:'POST', data:params, url:url})
				.success(function(data, status){
					Factory.set(data);
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
						Factory.set(data);
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
						// Factory.set(data);
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

		getPeer:function(finalToken){
			var peerToken = Factory.getPeerToken(finalToken);
			console.log('Peer Token',peerToken);
			// Use for debug
			// var peerToken = finalToken;

			var deferred = $q.defer();
			var req = {token:peerToken};
			var url = 'http://mmm.nclsndr.fr/users/getpeerbytoken';

			$http({method:'POST', data:req, url:url})
				.success(function(dataSuccess, status){
					Factory.setPeer(dataSuccess.User);
					deferred.resolve(dataSuccess.User);
				})
				.error(function(data, status){
					var error = {'error':true, 'obj': data};
					deferred.reject(error);
				});
			return deferred.promise;
		},
		setPeer:function(peer){
			if (peer) {
				Factory.Peer = peer;
			}
		},
		getPeerToken:function(finalToken){
			var splited = finalToken.split('_');
			if (splited.length == 2) {
				if (splited[0]==Factory.token.me) {
					Factory.token.peer = splited[1];
					return splited[1];
				}else{
					Factory.token.peer = splited[0];
					return splited[0];
				}	
			}
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
			var deferred = $q.defer();
			if (Factory.location.lat && Factory.location.lng) {
				Factory.User.lat = Factory.location.lat;
				Factory.User.lng = Factory.location.lng;
			}
			var req = {
				id:Factory.User.id,
				token:Factory.User.token,
				lat : Factory.User.lat,
				lng : Factory.User.lng,
			};
			var url = 'http://mmm.nclsndr.fr/users/updategeoloc';
			$http({method:'POST', data:req, url:url})
				.success(function(data, status){
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