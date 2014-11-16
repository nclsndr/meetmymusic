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
            var value = modelValue || viewValue;
            // Lookup user by username
            
            return UserFactory.usernameExists.
               then(function resolved() {
                 //username exists, this means validation fails
                 return $q.reject('exists');
               }, function rejected() {
                 //username does not exist, therefore this validation passes
                 return true;
               });
            };
      };
    }
  };
});