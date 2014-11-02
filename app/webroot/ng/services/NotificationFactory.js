mmmApp.factory('NotificationFactory', ['$http','$q', '$interval',
function ($http, $q, $interval) {
	var Factory = {
		List : [],
		isRunning : false,
		timer : null,
		add:function(msg, DOMclass){
			var dClass = DOMclass?DOMclass:'';
			var notif = {
				msg : msg,
				DOMclass : dClass
			}
			Factory.List.push(notif);
			Factory.autoDelete();
			return Factory.List;
		},
		autoDelete:function(){
			if ( Factory.isRunning === true ) return;
			Factory.timer = $interval(function() {
				if (Factory.List.length > 0) {
					Factory.List.shift();
				}else{
					$interval.cancel(Factory.timer);
					Factory.isRunning =false;
				}
			}, 6000);
		},
		delete:function(index, callback){
			index = parseInt(index);
			var item = Factory.List.splice(index,1);
			callback.call(this, item);
		}
	}
	return Factory;
}]);