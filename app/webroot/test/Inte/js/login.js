document.addEventListener('DOMContentLoaded',function(){
	var windowY = window.innerHeight;
	var loginPage = document.getElementById('loginPage');
	loginPage.style.min-height = (windowY)+"px";
	window.onresize = function(event) {
		loginPage.style.min-height = (windowY)+"px";
	};

})