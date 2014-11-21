mmmApp.directive('timeLength', 'SoundcloudService' [function (SoundcloudService){
	return {
		restrict: 'E',
		template : '<div class="timeLength">{{convertedDuration}}</div>',
		link: function(scope, element, attrs){
		}
		alert(scope.convertedDuration);
	}
}]);
