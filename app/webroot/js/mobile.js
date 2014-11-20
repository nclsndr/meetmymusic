/* --------------- DEMO STEP --------------- */

var otherPlayerBar = document.getElementsByClassName('otherPlayer')[0];
var landscapeOverlay = document.getElementById('landscapeOverlay');
var mobileWrapper = document.getElementById('mobileWrapper');
var stepPostition = 1;
var albumCover = document.getElementById('albumCoverP2');
var START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);

var svgCircle = document.getElementById('svgCircle');
var svgBg = document.getElementById('svgBg');
var progressBar = document.getElementById('bar');
var progressBarBg = document.getElementById('barBg');
var fillBg = document.getElementById('fillBg');
var tcProgress = document.getElementById('tcProgress');
var tcTotal = document.getElementById('tcTotal');
var svgContainerSize = svgCircle.offsetHeight;

var radiusB = 0;var radiusF = 0;
var perimeterB = 0;var perimeterF = 0;
var circlePercentB = 0;var circlePercentF = 0;

var currentLine = document.getElementById('currentLine');
var musicLength = 700000;
var musicProgress = 0;
var progressPercent = 0;


setInterval(function(){
    if(musicProgress<musicLength) {
        musicProgress=musicProgress+1200;
        updateProgressBar();
    }  
}, 1000);

setBorderSvgAttributs(progressBar);
setBorderSvgAttributs(barBg);
setFillSvgAttributs(fillBg);


/* --------------- MUSIC PROGRESS BAR --------------- */
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
    console.log(svgContainerSize);
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


function getTimeCodeFromMillisec(length) {
    var milliseconds = parseInt(length, 10);
    var seconds = parseInt(milliseconds / 1000) % 60 ;
    var minutes = parseInt((milliseconds / (1000*60)) % 60);
    var hours   = parseInt((milliseconds / (1000*60*60)) % 24);
    // // var minutes=(ms/(1000*60))%60;
    // var minutes = Math.floor((sec_num / 60));
    // var hours=(ms/(1000*60*60))%24;
   

    if (hours<=60) {hours = '0'+hours;};
    if (minutes<=9) {minutes = '0'+minutes;};
    if (seconds<=9) {seconds = '0'+seconds;};
    return  hours + ':' + minutes + ':' + seconds;
}

// set the global timecode
tcTotal.innerHTML= getTimeCodeFromMillisec(musicLength);

function updateProgressBar()
{
    // update progress time code
    tcProgress.innerHTML= getTimeCodeFromMillisec(musicProgress);

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

/* --------------- HAMMER INITIALISATION --------------- */

var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// var albumCover = document.getElementById('albumCoverP2');
// var START_X    = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);

var overlay           = document.getElementById('overlay');
var songPassedOverlay = document.getElementById('songPassedOverlay');
var addFrienOverlay   = document.getElementById('addFrienOverlay');
var overlay           = document.getElementById('overlay');


// On bloque les gesture en Y
// var START_Y = Math.round((window.innerHeight - albumCover.offsetHeight) / 2); 

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

        setTimeout(function() {
            songPassedOverlay.style.display = "none";
            songPassedOverlay.classList.remove("fadeOut");
            step3.style.display = "block";
            START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
            resetElement();
        }, 400);
    }, 5000);
}

function onSwipeRight(ev) {
    addFrienOverlay.style.display = "block";
    step3.style.display = "none";
    setTimeout(function() {
        addFrienOverlay.classList.add("fadeOut");

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
