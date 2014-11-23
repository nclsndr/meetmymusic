mmmApp.directive('tcTrack', [function (){
	return {
		restrict: 'E',
		template : '<header><a href="http://mmm.nclsndr.fr:3000/#/dashboard"><h1 class="animated fadeInDown">MEET MY MUSIC</h1></a><div id="userOption" ng-click="dropdown()"><div id="username">{{me.username}}</div><div><img src="{{me.avatar_url}}" alt=""></div><div id="dropDownIcon">▼</div></div></header><ul class="dropdownUser animated fadeInDown"><li>My profile</li><li>Edit my profil</li><li>Parameters</li></ul>',
		link: function(scope, element, attrs){
			
		}
		
	}
}]);
