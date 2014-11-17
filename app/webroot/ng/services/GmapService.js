mmmApp.service('GmapService',['$http', '$q',
	function ($http, $q){

		this.Map = null;
		this.isInit = false;

		this.init = function(){
			if (self.Map === null) {
				self.Map = google.maps;
				self.isInit = true;
			}
		}

		this.autoComplete = function(elm){
			if (!self.isInit) {
				self.init();
			}
			return new self.Map.places.Autocomplete(elm, {types: ['(cities)']});
		}

		this.addListener = function(elmReady, event, callback){
			if (!self.isInit) {
				self.init();
			}
			return self.Map.event.addListener(elmReady, event, callback);
		}

		this.revGeocoder = function(lat, lng){
			if (!self.isInit) {
				self.init();
			}
			var deferred = $q.defer();
			var LatLngObj = new self.Map.LatLng(lat,lng);
			var geocoder = new self.Map.Geocoder();
			geocoder.geocode({'latLng': LatLngObj}, function(results, status) {
				if (status == self.Map.GeocoderStatus.OK) {
					if (results[0]) {
						deferred.resolve(results);	
					}
				} else {
					deferred.reject(status);
				}
			});
			return deferred.promise;
		}

		var self = this;
	}
]);