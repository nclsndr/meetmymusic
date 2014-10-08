var mmmApp = angular.module('mmmApp', ['ngRoute', 'ngResource']);


mmmApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
   
    // var partialsF = '/ng/partials'
    // $routeProvider
    // .when('/users/login', {
    //     templateUrl: partialsF+'/login.html',
    //     controller: 'UsersCtrl'
    // })
    // .when('/', {
    //     templateUrl: partialsF+'/dashboard.html',
    //     controller: 'DashboardCtrl',
    //     resolve: {
    //         auth : function(UserFactory, $location){
    //             if (!UserFactory.isAuth()) {
    //                 $location.path('/users/login');
    //             }
    //         }
    //     }
    // })
    // .when('/clients/edit', {
    //     templateUrl: partialsF+'/clients_edit.html',
    //     controller: 'ClientsCtrl',
    //     resolve: {
    //         auth : function(UserFactory, $location){
    //             if (!UserFactory.isAuth()) {
    //                 $location.path('/users/login');
    //             }
    //         }
    //     }
    // });
    // .otherwise({redirectTo : '/'});
  // .when('/Book/:bookId/ch/:chapterId', {
  //   templateUrl: 'chapter.html',
  //   controller: 'ChapterController'
  // });
}]);
