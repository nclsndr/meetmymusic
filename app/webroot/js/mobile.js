/* --------------- DEMO STEP --------------- */

var otherPlayerBar = document.getElementsByClassName('otherPlayer')[0];
var landscapeOverlay = document.getElementById('landscapeOverlay');
var mobileWrapper = document.getElementById('mobileWrapper');
var stepPostition = 1;
var albumCover = document.getElementById('albumCoverP2');
var START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);

var svg = document.getElementById('svgBorder');
var svgBg = document.getElementById('svgBg');
var borderContainer = document.getElementById('borderContainer');
var progressBar = document.getElementById('bar');
var progressBarBg = document.getElementById('barBg');
var tcProgress = document.getElementById('tcProgress');
var tcTotal = document.getElementById('tcTotal');
var svgContainerSize = borderContainer.offsetHeight;
var rayon = svgContainerSize/2;
var currentLine = document.getElementById('currentLine');

var musicLength = 30;
var musicProgress = 0;
var progressPercent = 0;


setInterval(function(){
    if(musicProgress<musicLength) {
        musicProgress++;
        updateProgressBar();
    }  
}, 1000);

setSvgAttributs(progressBar);
setSvgAttributs(barBg);

/* --------------- MUSIC PROGRESS BAR --------------- */
function setSvgAttributs(circle) {
    svgContainerSize = borderContainer.offsetHeight;
    rayon = svgContainerSize/2;
    perimetre = Math.PI*(rayon*2);
    circle.setAttribute('r',rayon);
    circle.setAttribute('cx',svgContainerSize/2);
    circle.setAttribute('cy',svgContainerSize/2);
    circle.setAttribute('stroke-dasharray',perimetre);
    circle.setAttribute('stroke-offset',perimetre);
}

function getRotationDegrees(obj) {
    
    var st = window.getComputedStyle(obj, null);
    var tr = st.getPropertyValue("-webkit-transform") ||
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
    console.log('Rotate de base : ' + angle );
    return angle;
}

function setRotation(obj) {
    var actualDeg = getRotationDegrees(currentLine);
    var degRotation = (360*musicProgress)/musicLength;
    console.log('deg rotation = ' + degRotation);
    obj.style.webkitTransform = "rotate(" + degRotation + ('deg)');
    obj.style.MozTransform = "rotate(" + degRotation + ('deg)');
    obj.style.transform = "rotate(" + degRotation + ('deg)');
}

function getTimeCodeFromSec(length) {
    var sec_num = parseInt(length, 10); 
    var minutes = Math.floor((sec_num / 60));
    var seconds = sec_num - (minutes * 60);
    if (minutes<=9) {minutes = '0'+minutes;};
    if (seconds<=9) {seconds = '0'+seconds;};
    return minutes + ':' + seconds;
}
// set the global timecode
tcTotal.innerHTML= getTimeCodeFromSec(musicLength);

function updateProgressBar()
{
    // update progress time code
    tcProgress.innerHTML= getTimeCodeFromSec(musicProgress);

    if (isNaN(musicProgress)) {
        musicProgress = 0; 
    }
    else{
        progressPercent = (musicProgress*100)/musicLength;
        circlePercent = ((100-progressPercent)/100)*perimetre;
        bar.style.strokeDashoffset = circlePercent;

    }
    setRotation(currentLine);

    // console.log('Progression : ' + progressPercent + '%');
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
