<!DOCTYPE html>

<html>
	<head>
		<meta charset="utf-8">
		<title>Deezer Test Seaching Track</title>
	</head>

	<body ng-app="MonApp">
		<h1>Deezer Test Recherche</h1> <br>
		<div ng-view></div>
		<input type="text" id="searchInput" ng-model="query" value="muse" onkeyup="searchFunc()" placeholder="tapez pour rechercher" /> <br><br>
		{{"Elem recherché : " + query}} <br><br>
		{{"Lien du json :  http://api.deezer.com/search?q="+ query}} 
		<a href="http://api.deezer.com/search?q={{query}}" target="_blank">----->JSON</a> <br><br> <hr> <br><br>

		<div ng-controller="SearchCtrl">
			
			 <div ng-repeat="post in posts">
				<!-- <p>Content = {{post[$insdex]}}</p> -->
				<img src="{{post[$index].album.cover}}" alt="" style="float:left; margin-right : 20px;"> <br>
				
				<b>Artiste</b> = {{post[$index].artist.name}} <br>
				<b>Album</b> = {{post[$index].album.title}} <br>
				<b>Titre</b> = {{post[$index].title}} <br>
				<b>Lien Deezer</b> = <a href="{{post[$index].link}}" target="_blank">{{post[$index].link}}</a> <br>
				<b>Preview</b> = <a href="{{post[$index].preview}}" target="_blank">{{post[$index].preview}}</a>

				<br><br>
				<hr>
				<br>
			</div>

		</div>

		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js"></script>

		<script>

			// Creation du module
			var app = angular.module('MonApp',[]); 
			
			app.factory('Post', function($http,$q,$timeout) { // Injection de dépendance $http, $q, permet les requetes ajax
				var factory = {
					posts : false,
					getPosts : function() {
						var deferred = $q.defer();
						var inputVal = document.getElementById("searchInput").value;

						// $http.get("getJson.php?q='muse'")
						alert("getJson.php?q='"+ inputVal +"'")
						$http.get("getJson.php?q='"+ inputVal +"'")
						.success(function(data,status){
							factory.posts=data; //On recupere le fichier json,
							deferred.resolve(factory.posts);
							
							
						}).error(function(data,status){
							deferred.reject('Impossible de retourner les musiques.' +data + status)
						});
						
						
						return deferred.promise; 
					},
					getPost : function(id) {
						var deferred  = $q.defer();
						var post = {};
						var posts = factory.getPosts().then(function(posts){ //ne pas oublier then car promesses
							angular.forEach(posts, function(value, key) {
							  if (value.id == id){
							  	post = value;
							  }
							});
							deferred.resolve(post); 
						}, function(msg){
							deferred.reject(msg); 
						}); 
						
						return deferred.promise;
					}
				}
				return factory;
			})

			app.controller('SearchCtrl', function($scope, Post) {
				$scope.loading = true;
				$scope.posts = Post.getPosts().then(function(posts) {
					$scope.loading = false;
					$scope.posts = posts;  // en cas de réussite
				},function(msg) {
					alert(msg); // en cas d'échec
				}); //then lié au deferred

			})

			function searchFunc(){
				var inputVal = document.getElementById("searchInput").value;

				console.log('typing : ' +inputVal);
			}

			
		</script>
	</body>
</html>
