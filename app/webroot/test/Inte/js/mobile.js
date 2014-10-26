/* --------------- DEMO STEP --------------- */

var nextBtn = document.getElementById('nextStep');
var step_1 = document.getElementById('step1');
var step_2 = document.getElementById('step2');
var step_3 = document.getElementById('step3');
var otherPlayerBar = document.getElementsByClassName('otherPlayer')[0];
var stepPostition = 1;
var albumCover = document.getElementById('albumCoverP2');
var START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);

nextBtn.addEventListener('click', nextStep,false);

function nextStep() {
    // console.log('stepposition : ' + stepPostition);
    switch(stepPostition) {
        case 1: 
            step_1.style.display = 'none';
            step_2.style.display = 'block';
            stepPostition = 2;
        break;

        case 2: 
            step_2.style.display = 'none';
            step_3.style.display = 'block';
            window.scrollTo(0,50);
            stepPostition = 3;
            START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
            resetElement();
        break;

        case 3: 
            stepPostition = 4;
        break;
    }
};


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
        }, 400);
    }, 2000);
}


resetElement();

window.onresize = function() {
    START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
    resetElement();
};


