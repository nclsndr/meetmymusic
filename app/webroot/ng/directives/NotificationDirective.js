mmmApp.directive('notifications', ['NotificationFactory', function(NotificationFactory){
	return {
		restrict: 'A',
		// scope:{},
		template : '<ul><li ng-repeat="notification in notifications track by $index" data-index="{{$index}}" class="{{notification.DOMclass}}">{{notification.msg}}</li></ul>',
		// template : '<li>{{notifications}}</li>',
		link: function($scope, elmt, attrs){

			// $scope.$watch(
			// 	function(NotificationFactory){
			// 		console.log('watch test called');
			// 		return NotificationFactory.List;
			// 	},
   //          	function(newValue, oldValue){
   //          		console.log('watch called : ',newValue);
			// 		$scope.notifications = newValue;
   //          	}
   //           );

			$scope.$on("addNotif", function(event, List) {
				$scope.notifications = List;
	        });

			elmt.bind('click',function(e){
				var index = e.target.attributes[1].value;
				NotificationFactory.delete(index, function(item){
					// console.log(item);
				});
			});
		}
	}
}]);