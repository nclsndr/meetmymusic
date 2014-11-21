mmmApp.directive('dropdown', [function (){
	return {
		restrict: 'E',
		template : '<header><a href="http://mmm.nclsndr.fr:3000/#/dashboard"><h1 class="animated fadeInDown">MEET MY MUSIC</h1></a><div id="userOption" ng-click="dropdown()"><div id="username">{{me.username}}</div><div><img src="{{me.avatar_url}}" alt=""></div><div id="dropDownIcon">▼</div></div></header><ul class="dropdownUser animated fadeInDown"><li>My profile</li><li>Edit my profil</li><li>Parameters</li></ul>',
		link: function(scope, element, attrs){
			scope.dropdown = function() {
				var dropdownUser = document.getElementsByClassName('dropdownUser')[0];
	            var userOption = document.getElementById('userOption');
	            var dropDownIcon = document.getElementById('dropDownIcon');
		    	if(!dropdownUser.classList.contains('visible')){
	                dropdownUser.classList.add("visible");
	                dropdownUser.classList.remove("fadeOutUp");
	                dropDownIcon.classList.add("rotate");
	            }
	            else {
	                dropdownUser.classList.add("fadeOutUp");
	                setTimeout(function() {
	                    dropdownUser.classList.remove("visible");
	                    dropdownUser.classList.add("fadeOutUp");
	                    dropDownIcon.classList.remove("rotate");
	                }, 700) 
	            }
			};
		},
		
	}
}]);
