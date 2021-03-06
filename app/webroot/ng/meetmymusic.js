'use strict';

var mmmApp = angular.module('mmmApp', ['ngRoute', 'ngResource', 'btford.socket-io']);


mmmApp.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
   
    $httpProvider.defaults.headers.common['IniRequestAjax'] = 'angular request';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;

    var partialsF = 'http://mmm.nclsndr.fr/ng/partials';
    var mbPartialsF = 'http://mmm.nclsndr.fr/ng/mb_partials';

    if (window.location.pathname.search('/mobile/')>-1) {
        $routeProvider
        // .when('/', {
        //     templateUrl: mbPartialsF+'/start.html',
        //     controller: 'MbStartCtrl'
        // })
        .when('/', {
            templateUrl: mbPartialsF+'/songSelected.html',
            controller: 'MbSongSelectedCtrl'
        })
        .when('/remote', {
            templateUrl: mbPartialsF+'/musicRemote.html',
            controller: 'MbMusicRemoteCtrl'
        })
        .when('/landing', {
            templateUrl: mbPartialsF+'/start.html',
            controller: 'MbStartCtrl'
        })
        .otherwise({
            redirectTo: '/'
        }); 
        

    }else{
        $routeProvider
        .when('/', {
            templateUrl: partialsF+'/home.html',
            controller: 'StartCtrl'
        })
        .when('/dashboard', {
            templateUrl: partialsF+'/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                auth : function(UserFactory, $location, NotificationFactory){
                    if (UserFactory.isNotLogged()) {
                        NotificationFactory.add('You are not logged', 'error');
                        $location.path('/');
                    }
                }
            }
        })
        .when('/pregame', {
            templateUrl: partialsF+'/pregame.html',
            controller: 'PregameCtrl',
            resolve: {
                auth : function(UserFactory, $location, NotificationFactory){
                    if (UserFactory.isNotLogged()) {
                        NotificationFactory.add('You are not logged', 'error');
                        $location.path('/');
                    }
                }
            }
        })
        .when('/debug', {
            templateUrl: partialsF+'/debug.html',
            controller: 'DebugCtrl',
            resolve: {
                auth : function(UserFactory, $location, NotificationFactory){
                    if (UserFactory.isNotLogged()) {
                        NotificationFactory.add('You are not logged', 'error');
                        $location.path('/');
                    }
                }
            }
        })
        .when('/login', {
            templateUrl: partialsF+'/login.html',
            controller: 'UserCtrl',
            resolve: {
                auth : function(UserFactory, $location, NotificationFactory){
                    if (UserFactory.isNotLogged()) {
                        NotificationFactory.add('You are not logged', 'error');
                        $location.path('/');
                    }
                }
            }
        })
        .when('/search', {
            templateUrl: partialsF+'/search.html',
            controller: 'SearchCtrl',
            resolve: {
                auth : function(UserFactory, $location, NotificationFactory){
                    if (UserFactory.isNotLogged()) {
                        NotificationFactory.add('You are not logged', 'error');
                        $location.path('/');
                    }
                }
            }
        }).when('/game', {
            templateUrl: partialsF+'/game.html',
            controller: 'GameCtrl',
            resolve: {
                auth : function(UserFactory, $location, NotificationFactory){
                    if (UserFactory.isNotLogged()) {
                        NotificationFactory.add('You are not logged', 'error');
                        $location.path('/');
                    }
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        }); 
    }
    


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

mmmApp.run(['LSFactory', 'UserFactory',
    function (LSFactory, UserFactory){
        var user = LSFactory.get('User');
        UserFactory.User = user;
    }
]);
