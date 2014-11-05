mmmApp.service('GmapService',['$http', '$q',
	function ($http, $q){

		this.Map = null;

		this.init = function(){
			if (self.Map === null) {
				self.Map = new google.maps;
			}
		}

		var self = this;

	}
]);