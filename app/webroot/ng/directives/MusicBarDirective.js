mmmApp.directive('musicbar', [function() {
    return {
        restrict: 'E',
        template: '<div class="timeCodeContainer"><span id="tcProgress">{{tcProgressConvert}}</span> / <span id="tcTotal">{{tcTotalConvert}}</span></div><div id="musicBar" class="animated zoomIn"><div id="musicBarCursor"></div></div>',
        link: function(scope, element, attrs) {
        	var tcProgress = document.getElementById('tcProgress');
            var tcTotal = document.getElementById('tcTotal');

            scope.setTimeCode = function(length) {
                var sec_num = parseInt(length, 10);
                var minutes = Math.floor((sec_num / 60));
                var seconds = sec_num - (minutes * 60);
                if (minutes <= 9) {minutes = '0' + minutes;};
                if (seconds <= 9) {seconds = '0' + seconds;};
                return  minutes + ':' + seconds;
            }

            scope.setWidth = function(w) {
                document.getElementById('musicBarCursor').style.width = w;
            };

        	scope.tcProgressConvert = scope.setTimeCode(scope.tcProgress);
            scope.tcTotalConvert = scope.setTimeCode(scope.tcTotal); 

            scope.updateBar = function(){
            	if (scope.tcProgress < scope.tcTotal) {
	                scope.setTimeCode(tcProgress, scope.tcProgress);
	                scope.cursorPercent = (scope.tcProgress * 100) / scope.tcTotal;
	                scope.setWidth(scope.cursorPercent+'%');
	                scope.tcProgressConvert = scope.setTimeCode(scope.tcProgress);
	            }
            }
            scope.updateBar();

            setInterval(function(){
            	scope.tcProgress++;
            	scope.updateBar();
            }, 1000);
            
        }
    }
}]);
