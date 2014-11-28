mmmApp.directive('overwriteEmail', function($q) {
  var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.emailFormat = function(modelValue, viewValue) {
          var value = modelValue || viewValue;
          return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
        };
        ctrl.$validators.emailEmpty = function(modelValue, viewValue) {
          var value = modelValue || viewValue;
          return !ctrl.$isEmpty(value);
        };
    }
  };
});

mmmApp.directive('username', function($q, $timeout, UserFactory) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
        ctrl.$asyncValidators.usernameexists = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            if (value == undefined) {
                return $q.reject('exists');
            }else{
                return UserFactory.usernameExists(value).
                    then(
                    function resolved(data) {
                        //username exists, this means validation fails
                        return $q.reject('exists');
                    }, 
                    function rejected(data) {
                        //username does not exist, therefore this validation passes
                        return true;
                    });    
            }
        }
    }
  };
});
mmmApp.directive('mapsAutoComplete', function($q, $timeout, GmapService) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {

      scope.autoComplete = GmapService.autoComplete(elm[0]);
      GmapService.addListener(scope.autoComplete, 'place_changed', function(){
        var place = scope.autoComplete.getPlace();
        console.log('----------place.geometry');
        console.log(place.geometry);

        scope.$apply(function() {
          scope.register.lat.$setViewValue(place.geometry.location.B);
          scope.register.lng.$setViewValue(place.geometry.location.k);
          ctrl.$setViewValue(place.formatted_address);
        });
      });

      ctrl.$validators.isComplete = function(modelValue, viewValue) {
        return !ctrl.$isEmpty(scope.register.lat.$viewValue);
      };

      ctrl.$validators.isEmpty = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return !ctrl.$isEmpty(value);
      };

    }
  };
});

