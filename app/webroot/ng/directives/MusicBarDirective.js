mmmApp.directive('musicbar', ['SoundcloudService', function (SoundcloudService){
    return {
        restrict: 'E',
<<<<<<< HEAD

        template : '<div class="timeCodeContainer"><span id="tcProgress">{{tcProgressConvert}}</span> / <span id="tcTotal">{{tcTotalConvert}}</span></div><div id="musicBar" class="animated zoomIn"><div id="musicBarCursor"></div></div>',
        
        link: function(scope, element, attrs) {

            // scope.setWidth = function(w) {
            //     document.getElementById('musicBarCursor').style.width = w;
            // };
            scope.setTC = function(ms) {
                return SoundcloudService.setTimeCode(ms);
=======
        template : '<div class="timeCodeContainer"><span id="tcProgress">{{tcProgressConvert}}</span> / <span id="tcTotal">{{tcTotalConvert}}</span></div><div id="musicBar" class="animated zoomIn"><div id="musicBarCursor"></div></div>',
        link: function(scope, element, attrs) {
            scope.setWidth = function(w) {
                document.getElementById('musicBarCursor').style.width = w;
>>>>>>> init-app-socket
            };
            scope.setTC = function(ms) {
                return SoundcloudService.setTimeCode(ms);
            };

<<<<<<< HEAD
=======
            scope.tcProgressConvert = scope.setTC(scope.tcProgress);
            scope.tcTotalConvert = scope.setTC(scope.tcTotal); 
>>>>>>> init-app-socket

            scope.updateBar = function(){
             if (scope.tcProgress <= scope.tcTotal) {
                 scope.tcProgressConvert = scope.setTC(scope.tcProgress);
<<<<<<< HEAD
                 scope.tcTotalConvert = scope.setTC(scope.tcTotal); 
                 scope.cursorPercent = (scope.tcProgress * 100) / scope.tcTotal;
                 // scope.setWidth(scope.cursorPercent+'%');
=======
                 scope.cursorPercent = (scope.tcProgress * 100) / scope.tcTotal;
                 scope.setWidth(scope.cursorPercent+'%');
>>>>>>> init-app-socket
             }
            }
            scope.updateBar();
            scope.tcProgressConvert = scope.setTC(scope.tcProgress);
            scope.tcTotalConvert = scope.setTC(scope.tcTotal); 

            console.log('get GameCtrl.tcTotal = ' + scope.tcTotal);

            setInterval(function(){
                scope.tcProgress = scope.tcProgress + 1000;
                scope.updateBar();
            }, 1000);

        }
    }
}]);
