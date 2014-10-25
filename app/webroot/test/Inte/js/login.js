document.addEventListener('DOMContentLoaded',function(){ //DOCReady
	var loginForm = document.getElementById('loginForm');
	var registerForm = document.getElementById('registerForm');
	var loginSubmitBtn = document.getElementById('loginSubmitBtn');
	var registerSubmitBtn = document.getElementById('registerSubmitBtn');
	var connectElem = document.getElementsByClassName('connectElem');
	var accountBtn = document.getElementById("accountBtn");
	var soundCloudConnect = document.getElementById("soundCloudConnect");
	var registerElem = document.getElementsByClassName('registerElem');
	var toggleLoginRegister = 'login';

	//Submit Button 
	loginSubmitBtn.addEventListener('click', function(){
		loginForm.submit();
	},false);
	registerSubmitBtn.addEventListener('click', function(){
		registerForm.submit();
	},false);

	//Change Login <--> Registrer
	accountBtn.addEventListener('click', function(e){
		e.preventDefault();
		if(toggleLoginRegister==='login') {
			setTimeout(function() {
				for (var i = 0; i < connectElem.length; i++) {
					connectElem[i].classList.add('fadeOut');
					connectElem[i].style.display = "none";
				};
				for (var i = 0; i < registerElem.length; i++) {
					registerElem[i].style.display = 'block';
				};

				accountBtn.innerHTML='Already have an account?';
				soundCloudConnect.style.margin="40px auto 25px auto";
				for (var j = 0; j < connectElem.length-1; j++) {
					registerElem[j].style.display = 'block';
				};
			}, 400);
			toggleLoginRegister = 'register'
		}
		else {
			for (var i = 0; i < connectElem.length; i++) {
				connectElem[i].classList.remove('fadeOut');
				connectElem[i].style.display = "block";
			};
			for (var i = 0; i < registerElem.length; i++) {
				registerElem[i].style.display = 'none';
			};
			accountBtn.innerHTML='Create an account';
			soundCloudConnect.removeAttribute('style');
			
			for (var j = 0; j < registerElem.length-1; j++) {
				registerElem[j].style.display = 'none';
			};
			toggleLoginRegister = 'login';
			registerForm.style.display="none";
		}

		//When want to registrer + click on SoundCloud Connect 
		if(toggleLoginRegister === 'register') {
			soundCloudConnect.addEventListener('click', function(){
				registerForm.style.display="block";
			},false);
		}

	},false);
})