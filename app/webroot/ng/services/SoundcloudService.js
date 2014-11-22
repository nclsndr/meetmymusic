mmmApp.service('SoundcloudService',['$http', '$q', '$rootScope',
	function ($http, $q, $rootScope){

		this.SC = {};
		this.defineDigest = false;
		this.defineApply = [];
		this.SCUser = {};
		this.trackList = {};
		this.listIndex = 0;
		this.idList = new Array();
		this.redirectUrl = 'http://mmm.nclsndr.fr:3000/scauth';
		this.clientID = '268d90804476ee4483fd7dea94d198d4';
		
		this.choosenTrackId = false;

		

		this.init=function(callback){
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
			if (typeof callback!= 'undefined') {
				return callback.call(this);
			}
		}

		this.isDefine=function(callback){
			if (!self.isEmpty(self.SC)) {
				console.log('SC User connected : ',self.SC.isConnected());
				if (self.SC.isConnected()) {
					return callback.call(this);
				}else{
					self.connect().then(
						function(){
							return callback(this);
						}
					);
				}
			}else{
				self.init(function(){
					self.isDefine(callback);
				})
			}	
		}

		this.isEmpty=function(obj){
			if (obj == null) return true;
		    if (obj.length > 0)    return false;
		    if (obj.length === 0)  return true;
		    for (var key in obj) {
		        if (hasOwnProperty.call(obj, key)) return false;
		    }
		    return true;
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
			  // callback.call();
			});
			// deferred.reject('impossible de finaliser');
			return deferred.promise;
		}

		this.getSelfTracks=function(){
			var deferred = $q.defer();
			self.isDefine(function() {
				self.SC.get('/me/tracks', { limit: 10 }, function(tracks) {
					deferred.resolve(tracks);
				});
			});
			// deferred.reject('impossible de finaliser');
			return deferred.promise;
		}

		this.search=function(query){
			var deferred = $q.defer();
			self.isDefine(function(){
				self.SC.get('/tracks', { q: query, streamable: 'true', order : 'hotness'}, function(tracks) {
				 	deferred.resolve(tracks);
				});
			});
			
			return deferred.promise;
		}

		this.getHotTracks=function(){
			var deferred = $q.defer();
			self.isDefine(function() {
				self.SC.get('/tracks', { streamable: 'true', order : 'hotness', limit: 100}, function(tracks) {
			 		deferred.resolve(tracks);
				});
			});
			return deferred.promise;
		}
		
		this.getFavoritesTracks=function(){
			var deferred = $q.defer();
			self.isDefine(function(){
				self.SC.get('/me/favorites', { limit: 50 }, function(tracks) {
					deferred.resolve(tracks);
				});
			})
			return deferred.promise;
		}
		
		// this.addSound=function(soundId){
		// 	if (!soundId) return false;
		// 	var deferred = $q.defer();
		// 	var store = {};
		// 	store.id = soundId;
		// 	self.isDefine(function(){
		// 		self.SC.get("/tracks/"+soundId, function(track){
		// 			store.sc = track;
		// 			self.SC.stream("/tracks/"+soundId, function(soundObj){
		// 				self.idList.push(store.id);
		// 				store.obj = soundObj;
		// 				console.log('store : ', store);
		// 				self.trackList[self.listIndex] = store;
		// 				self.listIndex++;
		// 				deferred.resolve(self.trackList);
		// 			});
		// 		});	
		// 	});
		// 	// deferred.reject('impossible de finaliser');
		// 	return deferred.promise;
		// }

		this.getTrackInfo=function(){
			var deferred = $q.defer();
			self.isDefine(function(){
				self.SC.get('/tracks/',{ids: self.choosenTrackId}, function(tracks) {
					// self.tcTotal = tracks.trackChosen.$$state.value.duration;
					deferred.resolve(tracks[0]);
				});	
			});
			return deferred.promise;
		}


		this.setTimeCode = function(length) {
		    var milliseconds = parseInt(length, 10);
		    var seconds = parseInt(milliseconds / 1000) % 60 ;
		    var minutes = parseInt((milliseconds / (1000*60)) % 60);
		    var hours   = parseInt((milliseconds / (1000*60*60)) % 24);
		    if (hours<=60) {hours = '0'+hours;};
		    if (minutes<=9) {minutes = '0'+minutes;};
		    if (seconds<=9) {seconds = '0'+seconds;};
		    return  hours + ':' + minutes + ':' + seconds;
		}

		this.chooseTrack = function(id) {
			self.choosenTrackId = id;
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