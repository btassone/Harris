'use strict';

// Declare app level module which depends on views, and components
var harrisApp = angular.module('harrisApp', ['ngRoute', 'harrisControllers']);

harrisApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/real-time.html',
                controller: 'RealTimeResultsCtrl'
            }).
            when('/history', {
                templateUrl: 'partials/history.html',
                controller: 'HistoryCtrl'
            }).
            when('/settings', {
               templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl'
            }).
            otherwise({
                redirectTo: '/app/'
            });
    }
]);

$("header .navigation .container .item").on('click', function() {
    $("header .navigation .container .item").removeClass("active");
    $(this).addClass("active");
});