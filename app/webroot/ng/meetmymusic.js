'use strict';

var mmmApp = angular.module('mmmApp', ['ngRoute', 'ngResource', 'btford.socket-io']);


mmmApp.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider) {
   
    console.log();
    var partialsF = 'http://mmm.nclsndr.fr/ng/partials'
    $routeProvider
    .when('/', {
        templateUrl: partialsF+'/debug.html',
        controller: 'DebugCtrl'
    })
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
    
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://mmm.nclsndr.fr/**'
    ]);

    // $sceDelegateProvider.resourceUrlBlacklist([
    //     'http://myapp.example.com/clickThru**'
    // ]);
}]);



















