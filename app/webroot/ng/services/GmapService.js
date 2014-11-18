mmmApp.service('GmapService',['$http', '$q', '$rootScope',
	function ($http, $q, $rootScope){

		this.Map = null;
		this.isInit = false;
		this.DomElm = null;
		this.DrawObj = null;
		this.markers = [];

		this.mapLayer = [
			{
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "on" },
					{ "color": "#B2B2B2" }
				]
			},{
				"featureType": "landscape",
				"elementType": "geometry.fill",
				"stylers": [
					{ "visibility": "on" },
					{ "color": "#404040" }
				]
			},{
				"featureType": "administrative.country",
				"elementType": "geometry",
				"stylers": [
					{ "color": "#595959" },
					{ "visibility": "on" }
				]
			}
		];

		// ——————————————————————————————————  GETTERS

		

		// ——————————————————————————————————  SET MAP

		this.init = function(){
			if (self.Map === null) {
				self.Map = google.maps;
				self.isInit = true;
			}
		}

		this.initDraw = function(DomElm, lat, lng, zoom){
			if (!self.isInit) {
				self.init();
			}
			if (lat===false) {
				lat = 48.858093;
			}
			if (lng===false) {
				lng = 2.294694;
			}
			if (zoom===false) {
				zoom = 8;
			}
			self.DomElm = DomElm;
			$rootScope.hiddenMap = true;
			
			var mapOptions = {
				zoom: zoom,
				center: new self.Map.LatLng(lat,lng),
				backgroundColor : '#222',
				disableDefaultUI : true,
				disableDoubleClickZoom : true,
				minZoom : 3,
				panControl : false,
				rotateControl : false,
				streetViewControl : false,
				styles : self.mapLayer
			};

			self.DrawObj = new self.Map.Map(DomElm,
			mapOptions);
			return self.DrawObj;
		}

		this.hideMap = function(bool){
			$rootScope.hiddenMap = bool;
		}

		this.setMarker = function(lat, lng, cursor){
			if (cursor===false) {
				cursor = 'http://mmm.nclsndr.fr/img/app/cursor.png';
			}
			var marker = new self.Map.Marker({
			    position: new self.Map.LatLng(lat,lng),
			    map: self.DrawObj,
			    opacity : 0.8,
			    icon : cursor
			});
			self.markers.push(marker);
			return marker;
		}

		// ——————————————————————————————————  MAPS SERVICES 

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

		this.getLatLng = function(lat, lng){
			return new self.Map.LatLng(lat,lng);
		}

		var self = this;
	}
]);