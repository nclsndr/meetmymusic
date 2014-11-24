mmmApp.controller('MbMusicRemoteCtrl', ['$q','$scope', '$location','$interval', 'UserFactory', 'SoundcloudService','SocketFactory',
	function ($q, $scope, $location, $interval, UserFactory, SoundcloudService, SocketFactory) {
		
		$scope.peer = UserFactory.Peer;
		$scope.track = SoundcloudService.currentTrackMobile;
		var isPlaying = false;
		$scope.pause = function() {
			if (isPlaying==true) {
				var store = {
					to : UserFactory.token.peer,
					ev : 'playPause',
					data : {
						play : false
					}
				};
				isPlaying = false;
				SocketFactory.emit('mmmRouterBroadcast', store);	
			}
		}
		$scope.play = function() {
			if (isPlaying==false) {
				var store = {
					to : UserFactory.token.peer,
					ev : 'playPause',
					data : {
						play : true
					}
				};
				isPlaying = true;
				SocketFactory.emit('mmmRouterBroadcast', store);	
			}
		}

		SocketFactory.on('DesktopPlayPause', function(data){
			if (data.play && !isPlaying) {
				isPlaying = true;
			}else{
				isPlaying = false;
			}
		});

		
		/* -------------------- HAMMER -------------------- */ 
		var otherPlayerBar = document.getElementsByClassName('otherPlayer')[0];
		var landscapeOverlay = document.getElementById('landscapeOverlay');
		var mobileWrapper = document.getElementById('mobileWrapper');
		var stepPostition = 1;
		var albumCover = document.getElementById('albumCoverP2');
		var START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);


		var reqAnimationFrame = (function () {
		    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
		        window.setTimeout(callback, 1000 / 60);
		    };
		})();

		var overlay           = document.getElementById('overlay');
		var songPassedOverlay = document.getElementById('songPassedOverlay');
		var addFrienOverlay   = document.getElementById('addFrienOverlay');
		var overlay           = document.getElementById('overlay');


		var ticking = false;
		var transform, timer;

		var onPanSwipe = false;
		var onPanState = null;


		var touchControl = new Hammer.Manager(albumCover);

		touchControl.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
		touchControl.add(new Hammer.Swipe()).recognizeWith(touchControl.get('pan'));

		// GESTION DE TOUT LES EVENTS
		touchControl.on("panmove panstart", onPan)
		            .on("panleft", onPanLeft)
		            .on("panright", onPanRight)
		            .on("panend", onPanEnd)
		            .on("swipeleft", onSwipeLeft)
		            .on("swiperight", onSwipeRight);


		function resetElement() {
		    albumCover.className = 'animate';
		    transform = {
		        translate: { x: START_X },
		        scale: 1,
		        angle: 0,
		        rx: 0,
		        ry: 0,
		        rz: 0
		    };
		   requestElementUpdate();
		}

		function updateElementTransform() {
		    var value = [
		        'translate3d(' + transform.translate.x + 'px, '  + '0px, 0)',
		        'scale(' + transform.scale + ', ' + transform.scale + ')',
		        'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
		    ];

		    value = value.join(" ");
		    albumCover.style.webkitTransform = value;
		    albumCover.style.mozTransform = value;
		    albumCover.style.transform = value;
		    ticking = false;
		}

		function requestElementUpdate() {
		    if(!ticking) {
		        reqAnimationFrame(updateElementTransform);
		        ticking = true;
		    }
		}

		function onPan(ev) {
		    overlay.classList.add("overlay-visible");  
		}

		function onPanRight(ev) {
		    ev.preventDefault();
		    albumCover.className = '';
		    transform.translate = {
		        x: START_X + ev.deltaX
		    };
		    requestElementUpdate();
		}


		function onPanLeft(ev) {
		    ev.preventDefault();
		    albumCover.className = '';
		    transform.translate = {
		        x: START_X + ev.deltaX
		    };
		    
		    requestElementUpdate();
		}

		function onPanEnd(ev) {
		    ev.preventDefault();
		    albumCover.className = '';
		    transform.translate = {
		        x: START_X
		    };
		    requestElementUpdate();

		    if(ev.deltaX>200 && onPanSwipe===false) {
		        onPanState="right";
		        onSwipeRight();
		        onPanSwipe=true;
		    }
		    else if(ev.deltaX<-200 && onPanSwipe===false) {
		        onSwipeLeft();
		        onPanSwipe=true;
		    }
		    overlay.classList.remove("overlay-visible");    
		    onPanSwipe = false;
		}

		function onSwipeLeft(ev) {
		    songPassedOverlay.style.display = "block";
		    step3.style.display = "none";

		    setTimeout(function() {
		        songPassedOverlay.classList.add("fadeOut");

		        var store = {
					to : UserFactory.token.peer,
					ev : 'leaveGame',
					data : {
						user : UserFactory.Peer.id
					}
				};

				SocketFactory.emit('mmmRouterBroadcast', store);
				var del = {
					token : UserFactory.token.me,
					finalToken : UserFactory.token.both
				}
				SocketFactory.emit('leaveRooms', store);


		        setTimeout(function() {
		            songPassedOverlay.style.display = "none";
		            songPassedOverlay.classList.remove("fadeOut");
		            step3.style.display = "block";
		            START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
		            resetElement();
		            $location.path('/landing');
		        }, 400);
		    }, 5000);
		}

		function onSwipeRight(ev) {
		    addFrienOverlay.style.display = "block";
		    step3.style.display = "none";
		    setTimeout(function() {
		        addFrienOverlay.classList.add("fadeOut");

		        var store = {
					to : UserFactory.token.peer,
					ev : 'friendRequest',
					data : {
						caller : UserFactory.User.id
					}
				};
				SocketFactory.emit('mmmRouterBroadcast', store);


		        setTimeout(function() {
		            addFrienOverlay.style.display = "none";
		            addFrienOverlay.classList.remove("fadeOut");
		            step3.style.display = "block";
		            START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
		            resetElement();
		        }, 400);
		    }, 2000);
		}

		resetElement();

		window.onresize = function() {
		    // START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
		    // resetElement();
		    setTimeout(function() {
		        START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
		        resetElement();
		    }, 600);
		};

		/* --------------- MUSIC PROGRESS BAR --------------- */
		if (typeof parseInt(SoundcloudService.currentTrackMobile.duration) == 'number') {
			var durationTrack = parseInt(SoundcloudService.currentTrackMobile.duration);
		}else{
			var durationTrack = 0;
		}
		
		$scope.musicBar = {
            tcTotal : durationTrack,
            tcTotalConvert : SoundcloudService.setTimeCode(durationTrack),
            tcProgressConvert : '00:00:00'
        }

		var svgCircle = document.getElementById('svgCircle');
		var svgBg = document.getElementById('svgBg');
		var progressBar = document.getElementById('bar');
		var progressBarBg = document.getElementById('barBg');
		var fillBg = document.getElementById('fillBg');
		var tcProgress = document.getElementById('tcProgress');
		var tcTotalCovert = document.getElementById('tcTotalCovert');
		var svgContainerSize = svgCircle.offsetHeight;

		var radiusB = 0;var radiusF = 0;
		var perimeterB = 0;var perimeterF = 0;
		var circlePercentB = 0;var circlePercentF = 0;

		var currentLine = document.getElementById('currentLine');
		var musicLength = $scope.musicBar.tcTotal;
		var musicProgress = 0;
		var progressPercent = 0;
		var interval;

		setTimeout(function() {
			refreshProgress();
		    setBorderSvgAttributs(progressBar);
		    setBorderSvgAttributs(barBg);
		    setFillSvgAttributs(fillBg);
		}, 3000)

		function refreshProgress() {
			interval = $interval(function(){
				if(isPlaying){
			        if(musicProgress<musicLength) {
			            musicProgress=musicProgress+1000;
			            $scope.musicBar.tcProgress=$scope.musicBar.tcProgress+1000;
			            updateProgressBar();
			        }  
			    }
		    }, 1000);
		}
		function setBorderSvgAttributs(circle) {
		    svgContainerSize = svgCircle.offsetHeight;
		    radiusB = svgContainerSize/2;
		    perimeterB = Math.PI*(radiusB*2);
		    // circle.setAttribute('cx',radiusB);
		    // circle.setAttribute('cY',radiusB);
		    circle.setAttribute('stroke-dasharray',perimeterB);
		    circle.setAttribute('stroke-offset',perimeterB);
		}
		function setFillSvgAttributs(circle) {
		    svgContainerSize = svgCircle.offsetHeight;
		    radiusF = svgContainerSize/2;
		    perimeterF = Math.PI*(radiusF*2);
		    circle.setAttribute('stroke-dasharray',perimeterF);
		    circle.setAttribute('stroke-offset',perimeterF);
		}

		function getRotationDegrees(el) {
		    var st = window.getComputedStyle(el, null);
		    var tr = 
		         st.getPropertyValue("-webkit-transform") ||
		         st.getPropertyValue("-moz-transform") ||
		         st.getPropertyValue("-ms-transform") ||
		         st.getPropertyValue("-o-transform") ||
		         st.getPropertyValue("transform");

		    var values = tr.split('(')[1];
		        values = values.split(')')[0];
		        values = values.split(',');

		    var a = values[0];
		    var b = values[1];
		    var c = values[2];
		    var d = values[3];

		    var scale = Math.sqrt(a*a + b*b);

		    var sin = b/scale;
		    var angle = Math.round(Math.asin(sin) * (180/Math.PI));
		    if(angle<0) {
		        angle = 360 + angle;
		    }
		    // console.log('Rotate de base : ' + angle );
		    return angle;
		}

		function setRotation(obj) {
		    var actualDeg = getRotationDegrees(currentLine);
		    var degRotation = (360*musicProgress)/musicLength;
		    // console.log('deg rotation = ' + degRotation);
		    obj.style.webkitTransform = "rotate(" + degRotation + ('deg)');
		    obj.style.MozTransform = "rotate(" + degRotation + ('deg)');
		    obj.style.transform = "rotate(" + degRotation + ('deg)');
		}


		function updateProgressBar()
		{
		    // update progress time code
		    $scope.musicBar.tcProgressConvert = SoundcloudService.setTimeCode(musicProgress);

		    if (isNaN(musicProgress)) {
		        musicProgress = 0; 
		    }
		    else{
		        progressPercent = (musicProgress*100)/musicLength;
		        circlePercentB = ((100-progressPercent)/100)*perimeterB;
		        circlePercentF = ((100-progressPercent)/100)*perimeterF;
		        bar.style.strokeDashoffset = circlePercentB;
		        fillBg.style.strokeDashoffset = circlePercentF;
		    }
		    setRotation(currentLine);
		}


		/* --------------- NO LANDSCAPE MODE --------------- */
		function doOnOrientationChange()
		{
		    switch(window.orientation) 
		    {  
		      case -90:
		      case 90:
		        landscapeOverlay.style.display = "block";
		        mobileWrapper.style.display = "none";
		        break; 
		      default:
		        landscapeOverlay.style.display = "none";
		        mobileWrapper.style.display = "block";
		        break; 
		    }
		}

		window.addEventListener('orientationchange', doOnOrientationChange);
		doOnOrientationChange();
}]);