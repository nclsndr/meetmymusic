mmmApp.directive('overwriteEmail', function() {
	var EMAIL_REGEXP = new RegExp("/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@example\.com$/i");

	return {
		require: 'ngModel',
		restrict: 'A',
		link: function(scope, elm, attrs, ngModel) {
			console.log(ngModel);
		}
	};
});

