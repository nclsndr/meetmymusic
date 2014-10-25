// 'use strict';
var touchControl; 
var container     = document.getElementById('page');
var resetBtn      = document.getElementById('resetBtn');
var msg           = document.getElementById('msg');
var albumCover    = document.getElementById('album-cover');
var albumCoverImg = albumCover.getElementsByTagName('img')[0];
var albumImgTab   = ['ShakeShookShaken-The_Do.jpg','muse-knight.jpg','foals.jpg', 'daft-punk.jpg','flume.jpg','coldplay.jpg','am.jpg','johnny.jpg','blackkeys.jpg','village.jpg'];

var START_X = Math.round((window.innerWidth - albumCover.offsetWidth) / 2);
var START_Y = Math.round((window.innerHeight - albumCover.offsetHeight) / 2);


// document.addEventListener("DOMContentLoaded", hammerTouchControl);
resetBtn.addEventListener('click',albumReset,false);
resetBtn.addEventListener('click',randomCover,false);

randomCover();

touchControl = new Hammer(albumCover);
touchControl
	// .on("panstart panmove", onPan)
	.on("swipeleft", onSwipeLeft)
	.on("swiperight", onSwipeRight)


function dragElement(event) {
	var elementToDrag = event.target;
	elementToDrag.style.left = event.gesture.deltaX + 'px';
	console.log('dragged = '+elementToDrag.style.left);
};

function randomCover() {
	var albumImg = albumImgTab[Math.floor(Math.random()*albumImgTab.length)];
	albumCoverImg.src = "images/"+albumImg; 
};

function albumReset(){
	albumCover.classList.remove("swipeRight");
	albumCover.classList.remove("swipeLeft");
	albumCover.classList.remove("fadeInUp");
};

function onSwipeLeft(ev) {
    albumReset();
	msg.innerHTML = ev.type + " -> <span class='nextMusic'>Musique suivante</span>";
	albumCover.classList.add("swipeLeft");
	setTimeout(function() {
		albumReset();
		randomCover(); 
	}, 300)
}

function onSwipeRight(ev) {
    albumReset();
	albumCover.classList.add("swipeRight");
	msg.innerHTML = ev.type + " -> <span class='friendAdded'>Ami ajouté</span>"; 
	setTimeout(function() {
		albumReset();
		randomCover();
	}, 300)
}

// function onPan(ev) {
// 	 transform.translate = {
//             x: START_X + ev.deltaX,
//             y: START_Y + ev.deltaY
//         };
//     console.log('pan');

// }
