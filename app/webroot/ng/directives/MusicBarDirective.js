mmmApp.directive('musicbar', ['SoundcloudService', function(SoundcloudService) {
    return {
        restrict: 'E',

        template: '<div class="timeCodeContainer"><span id="tcProgress">{{tcProgressConvert}}</span> / <span id="tcTotal">{{tcTotalConvert}}</span></div><div id="musicBar" class="animated zoomIn"><div id="musicBarCursor"></div></div>',
        link: function($scope, element, attrs) {

            // $scope.setWidth = function(w) {
            //     document.getElementById('musicBarCursor').style.width = w;
            // };
    
            $scope.setTC = function(ms) {
                return SoundcloudService.setTimeCode(ms);
            };

            $scope.updateBar = function(tcProgress) {
                if (tcProgress <= attrs.duration) {
                    $scope.tcProgressConvert = $scope.setTC(tcProgress);
                    cursorPercent = (tcProgress * 100) / attrs.duration;
                    console.log('tcProgressConvert : ' + tcProgressConvert);
                    // $scope.setWidth($scope.cursorPercent+'%');
                }
            }
            
            $scope.updateBar();
            $scope.tcProgressConvert = $scope.setTC($scope.tcProgress);
            $scope.tcTotalConvert = $scope.setTC(attrs.duration);


            setInterval(function() {
                $scope.tcProgress = $scope.tcProgress + 1000;
                $scope.updateBar($scope.tcProgress);
            }, 1000);

        }
    }
}]);