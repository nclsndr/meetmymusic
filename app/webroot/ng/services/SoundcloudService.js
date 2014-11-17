mmmApp.service('SoundcloudService',['$http', '$q', '$rootScope',
	function ($http, $q, $rootScope){

		this.SC = {};
		this.SCUser = {};
		this.trackList = {};
		this.listIndex = 0;
		this.idList = new Array();
		this.redirectUrl = 'http://mmm.nclsndr.fr:3000/scauth';
		this.clientID = '268d90804476ee4483fd7dea94d198d4'
		

		this.init=function(){
			// initialize client with app credentials
			if (window.SC) {
				self.SC = window.SC;
				self.SC.initialize({
				  client_id: self.clientID,
				  redirect_uri: self.redirectUrl
				});
			}else{
				alert('SoundCloud SDK is not loaded');
			}
		}

		this.isDefine=function(){
			if (self.SC.length<1) {
				self.init();
				console.log('init by isDefine');
			}
		}

		this.connect=function(){
			var deferred = $q.defer();
			// initiate auth popup
			self.SC.connect(function() {
			  self.SC.get('/me', function(me) {
			  	console.log(me);
			  	self.SCUser = me;
			  	$rootScope.$apply();
			  	deferred.resolve(me);
			  });
			});
			// deferred.reject('impossible de finaliser');
			return deferred.promise;
		}

		this.getSelfTracks=function(){
			var deferred = $q.defer();
			self.SC.get('/me/tracks', { limit: 10 }, function(tracks) {
				deferred.resolve(tracks);
			});
			// deferred.reject('impossible de finaliser');
			return deferred.promise;
		}

		this.getFavoritesTracks=function(){
			var deferred = $q.defer();
			self.SC.get('/me/favorites', { limit: 10 }, function(tracks) {
				deferred.resolve(tracks);
			});
			// deferred.reject('impossible de finaliser');
			return deferred.promise;
		}

		this.addSound=function(soundId){
			if (!soundId) return false;
			var deferred = $q.defer();
			var store = {};
			store.id = soundId;
			self.SC.get("/tracks/"+soundId, function(track){
				store.sc = track;
				self.SC.stream("/tracks/"+soundId, function(soundObj){
					self.idList.push(store.id);
					store.obj = soundObj;
					console.log('store : ', store);
					self.trackList[self.listIndex] = store;
					self.listIndex++;
					deferred.resolve(self.trackList);
				});
			});
			// deferred.reject('impossible de finaliser');
			return deferred.promise;
		}

		this.playThis=function(listIndex){
			self.trackList[listIndex].obj.play();
		}
		this.pauseThis=function(listIndex){
			self.trackList[listIndex].obj.pause();
		}
		
		self = this;
	}
]);