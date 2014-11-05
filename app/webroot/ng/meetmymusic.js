'use strict';

var mmmApp = angular.module('mmmApp', ['ngRoute', 'ngResource', 'btford.socket-io']);


mmmApp.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
   
    $httpProvider.defaults.headers.common['IniRequestAjax'] = 'angular request';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;

    var partialsF = 'http://mmm.nclsndr.fr/ng/partials';
    
    $routeProvider
    .when('/', {
        templateUrl: partialsF+'/home.html',
        controller: 'StartCtrl'
    })
    .when('/dashboard', {
        templateUrl: partialsF+'/dashboard.html',
        controller: 'DashboardCtrl' 
    })
    .when('/debug', {
        templateUrl: partialsF+'/debug.html',
        controller: 'DebugCtrl'
    })
    .when('/login', {
        templateUrl: partialsF+'/login.html',
        controller: 'UserCtrl'
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












