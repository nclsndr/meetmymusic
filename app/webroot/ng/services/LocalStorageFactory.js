mmmApp.factory('LSFactory', ['$http', '$q',
function ($http, $q) {
	var Factory = {

		isEnable:function(){
			if (typeof localStorage!='undefined') {
				return true;
			}
			return false;
		},

		set:function(key, value){
			if (Factory.isEnable) {
				var toStore = JSON.stringify(value);
				localStorage.setItem(key,toStore);
				return true;
			}
			return false;
		},

		get:function(key){
			if (Factory.isEnable) {
				if (localStorage.getItem(key)!=null) {
					return JSON.parse(localStorage.getItem(key));
				}
				return false;
			}
			return false;
		}

	}
	return Factory;
}]);
