'use strict';
var container = document.getElementById('page');
var albumCover = document.getElementById('album-cover');
var albumCoverImg = albumCover.getElementsByTagName('img')[0];
var resetBtn = document.getElementById('resetBtn');
var msg = document.getElementById('msg');
var resetCount = 0;
var albumImgTab = ['ShakeShookShaken-The_Do.jpg','muse-knight.jpg','foals.jpg', 'daft-punk.jpg','flume.jpg','coldplay.jpg','am.jpg','johnny.jpg','blackkeys.jpg','village.jpg'];

function dragElement(event) {
	var elemtToDrag = event.target;
	elementToDrag.style.left = event.gesture.deltaX + 'px';
	console.log('dragged = '+elementToDrag.style.left);
}

function randomCover() {
	var albumImg = albumImgTab[Math.floor(Math.random()*albumImgTab.length)];
	albumCoverImg.src = "images/"+albumImg; 
}

function albumReset(){
	albumCover.classList.remove("swipeRight");
	albumCover.classList.remove("swipeLeft");
	albumCover.classList.remove("fadeInUp");
}

function hammerInit() {
	var hammerC = new Hammer(albumCover);

	hammerC
		.on("dragRight", dragElement)
		.on("swipeleft", function(ev) {
			albumReset();
			msg.innerHTML = ev.type + " -> <span class='nextMusic'>Musique suivante</span>";
			albumCover.classList.add("swipeLeft");
			setTimeout(function() {
				albumReset();
				randomCover(); 
			}, 300)
		})
		.on("swiperight", function(ev) {		
			albumReset();
			albumCover.classList.add("swipeRight");
			msg.innerHTML = ev.type + " -> <span class='friendAdded'>Ami ajouté</span>"; 
			setTimeout(function() {
				albumReset();
				randomCover();
			}, 300)
		})

	randomCover();
}


resetBtn.addEventListener('click',albumReset,false);
resetBtn.addEventListener('click',randomCover,false);

window.onload=hammerInit();



