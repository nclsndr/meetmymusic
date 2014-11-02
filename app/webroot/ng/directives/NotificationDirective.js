mmmApp.directive('notifications', ['NotificationFactory', function(NotificationFactory){
	return {
		restrict: 'A',
		// scope:{},
		template : '<li ng-repeat="notification in notifications track by $index" data-index="{{$index}}" class="{{notification.DOMclass}}">{{notification.msg}}</li>',
		// template : '<li>{{notifications}}</li>',
		link: function($scope, elmt, attrs){
			$scope.notifications = NotificationFactory.List;
			elmt.bind('click',function(e){
				var index = e.target.attributes[1].value;
				NotificationFactory.delete(index, function(item){
					console.log(item);
				});
			});
		}
	}
}]);