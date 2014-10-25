document.addEventListener('DOMContentLoaded',function(){
	// prevoir les resolutions trop grande pour le bg
	var windowY = window.innerHeight;
	var loginPage = document.getElementById('loginPage');
	var logo = document.querySelector('header img');

	loginPage.style.min-height = (windowY)+"px";
	window.onresize = function(event) {
		loginPage.style.min-height = (windowY)+"px";
	};


	

})