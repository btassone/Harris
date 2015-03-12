'use strict';

// Declare app level module which depends on views, and components
var harrisApp = angular.module('harrisApp', ['ngRoute', 'harrisControllers']);
var harrisControllers = angular.module('harrisControllers', []);

// Values for Routes (used in RestFactory)
harrisApp.value('alert', '/alert');
harrisApp.value('alertNew', '/alert/new');
harrisApp.value('alertId', '/alert/');

harrisApp.value('data', '/data');
harrisApp.value('dataSchema', '/data/schema');

harrisApp.value('vehicleList', '/vehicle/list');
harrisApp.value('vehicleVin', '/vehicle/');
harrisApp.value('vehicleInfo', '/vehicle/info/');
harrisApp.value('vehicleData', '/vehicle/data/');

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
            when('/dataGen', {
                templateUrl: 'partials/dataGen.html',
                controller: 'AdminCtrl'
            })
    }
]);

$("header .navigation .container .item").on('click', function() {
    $("header .navigation .container .item").removeClass("active");
    $(this).addClass("active");
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};