mmmApp.directive('tc', ['SoundcloudService', function(SoundcloudService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@duration'
        },
        template: '<div class="timecode">{{timecode}}</div>',
        link: function(scope, element, attrs) {
            if (attrs.duration) {
                scope.timecode = SoundcloudService.setTimeCode(attrs.duration);
            }
        }
    }
}]);