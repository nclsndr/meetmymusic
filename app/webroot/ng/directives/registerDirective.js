mmmApp.directive('overwriteEmail', function($q) {
  var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      if (ctrl && ctrl.$validators.email) {
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});

mmmApp.directive('username', function($q, $timeout, UserFactory) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {

    // var usernames = ['Jim', 'John', 'Jill', 'Jackie'];
        console.log(ctrl);

      ctrl.$asyncValidators.username = function(modelValue, viewValue) {

        console.log(modelValue);
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

        var time = $timeout(function() {
          // Mock a delayed response
          // if (usernames.indexOf(modelValue) === -1) {
          //   // The username is available
          //   def.resolve();
          // } else {
          //   def.reject();
          // }

        }, 2000);

        console.log(time);

        return def.promise;
      };
    }
  };
});