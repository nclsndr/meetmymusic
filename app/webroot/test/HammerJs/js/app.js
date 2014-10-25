var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();


var msg           = document.getElementById('msg');
var albumCover    = document.getElementById('albumCover');
var overlay 	  = document.getElementById('overlay');
var albumImgTab   = ['ShakeShookShaken-The_Do.jpg','muse-knight.jpg','foals.jpg', 'daft-punk.jpg','flume.jpg','coldplay.jpg','am.jpg','johnny.jpg','blackkeys.jpg','village.jpg'];


var START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
// var START_Y = Math.round((window.innerHeight - albumCover.offsetHeight) / 2);

var ticking = false;
var transform, timer;

var onPanSwipe = false;
var onPanState = null;


var touchControl = new Hammer.Manager(albumCover);

touchControl.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
touchControl.add(new Hammer.Swipe()).recognizeWith(touchControl.get('pan'));


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
    console.log('PanLeft');
}


function onPanLeft(ev) {
	ev.preventDefault();
    albumCover.className = '';
    transform.translate = {
        x: START_X + ev.deltaX
    };
    
    requestElementUpdate();
    console.log('PanLeft');
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
	console.log('PanEnd');
}

function onSwipeLeft(ev) {
    albumReset();
	msg.innerHTML = "<span class='nextMusic animated flash'>Musique suivante</span>";
	albumCover.classList.add("swipeLeft");
	setTimeout(function() {
		albumReset();
		randomCover(); 
	}, 600)
	console.log('swipeLeft');
}

function onSwipeRight(ev) {
    albumReset();
	albumCover.classList.add("swipeRight");
	msg.innerHTML = "<span class='friendAdded animated pulse'>Ami ajouté</span>"; 
	setTimeout(function() {
		albumReset();
	}, 600)
	console.log('swipeRight');
}

function randomCover() {
	var albumImg = albumImgTab[Math.floor(Math.random()*albumImgTab.length)];
	albumCover.src = "images/"+albumImg; 
};

function albumReset(){
	albumCover.classList.remove("swipeRight");
	albumCover.classList.remove("swipeLeft");
	albumCover.classList.remove("fadeInUp");
};

resetElement();
window.onresize = function() {
    START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
    resetElement();
};
