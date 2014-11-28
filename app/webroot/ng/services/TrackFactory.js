mmmApp.factory('TrackFactory', ['UserFactory', '$q', '$http', 'SoundcloudService',
	function(UserFactory, $q, $http, SoundcloudService){

	var Factory = {

		UserHistoryList : [],
		UserHistory : [],
		SCSources : {},

		isEmpty:function(obj){
			if (obj == null) return true;
		    if (obj.length > 0)    return false;
		    if (obj.length === 0)  return true;
		    for (var key in obj) {
		        if (hasOwnProperty.call(obj, key)) return false;
		    }
		    return true;
		},

		addHistory:function(trackId){
			var deferred = $q.defer();
			if (trackId) {
				var url = 'http://mmm.nclsndr.fr/tracks/';
				var store = {
					user_id : UserFactory.User.id,
					sc_id: UserFactory.User.api_id,
					track_id :trackId
				};

				$http({method:'POST', data:store, url:url})
					.success(function(data, status){
						deferred.resolve(data);
					})
					.error(function(data, status){
						deferred.reject(data);
					});	
			}else{
				var error = 'No Track ID';
				deferred.reject(error);
			}
			return deferred.promise;
		},

		getHistory:function(user_id, limit){
			var deferred = $q.defer();
			var user_id = parseInt(user_id);
			if (user_id) {
				var limit = limit || 30;
				var url = 'http://mmm.nclsndr.fr/tracks/gethistory/'+user_id+'/'+limit;
				$http({method:'GET', url:url})
					.success(function(data, status){
						var IDS = '';
						for (var i = 0; i < data.length; i++) {
							// IDS.push(data[i].Track.sc_id);
							Factory.UserHistoryList.unshift(data[i].Track);
							if (data[i] != data.length-1) {
								IDS += data[i].Track.track_id+',';	
							}else{
								IDS += data[i].Track.track_id;
							}
						};
						SoundcloudService.isDefine(function(){
							SoundcloudService.getTrackList(IDS)
							.then(
								function(dataSuccess){
										Factory.UserHistory = [];
										for (var i = 0; i < dataSuccess.length; i++) {
											Factory.SCSources[dataSuccess[i].id] = dataSuccess[i];
										};
										for (var i = 0; i < Factory.UserHistoryList.length; i++) {
											Factory.UserHistoryList[i].sc = Factory.SCSources[Factory.UserHistoryList[i].track_id];
											Factory.UserHistory.push(Factory.UserHistoryList[i]);
										};
										deferred.resolve(Factory.UserHistory);
								}
							)
						});
					})
					.error(function(data, status){
						deferred.reject(data);
					});	
			}else{
				var error = 'No User ID';
				deferred.reject(error);
			}
			return deferred.promise;
		}


	};
	return Factory;
}
])