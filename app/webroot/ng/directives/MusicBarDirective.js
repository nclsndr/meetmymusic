mmmApp.directive('musicbar', ['SoundcloudService', '$interval', function(SoundcloudService, $interval) {
    return {
        restrict: 'E',
        template: '<div class="timeCodeContainer"><span id="tcProgress">{{musicBar.tcProgressConvert}}</span> / <span id="tcTotal">{{musicBar.tcTotalConvert}}</span></div><div id="musicBar" class="animated zoomIn"><div id="musicBarCursor" style="width:{{musicBar.progress}}%"></div></div>',
        link: function($scope, element, attrs) {

            $scope.musicBar = {
                tcTotalConvert : SoundcloudService.setTimeCode(attrs.duration),
                progress : 0,
                tcProgressConvert : 0
            }

            // $scope.$watch(function(){
            //     if (SoundcloudService.currentTrack.obj) {
            //         return SoundcloudService.currentTrack.obj.position;
            //     }else{
            //         return 0;
            //     }
            // }, function(newVar, oldVar){
            //     console.log(newVar);
            // });

            $interval(function(){
                if (SoundcloudService.currentTrack.obj) {
                    // console.log(SoundcloudService.currentTrack.obj.position);
                    console.log('------- POSITION : ',SoundcloudService.currentTrack.obj.position);
                    $scope.musicBar.tcTotalConvert = SoundcloudService.setTimeCode(attrs.duration);
                    $scope.musicBar.progress = (SoundcloudService.currentTrack.obj.position*100)/parseInt(attrs.duration);
                    $scope.musicBar.tcProgressConvert = SoundcloudService.setTimeCode(SoundcloudService.currentTrack.obj.position);
                }
            }, 1000);

        },
        
    }
}]);