'use strict';

// Declare app level module which depends on views, and components
var harrisApp = angular.module('harris', []);

harrisApp.controller('RealTimeResultsCtrl', function($scope, $http) {

    $http.get('models/cars/cars.json').success(function(data){
        $scope.cars = data;
    });
    $http.get('models/errors/errors.json').success(function(data){
        $scope.errors = data;
    });

    $scope.selected_car = null;
    $scope.clicked_car = function(car) {

        car.clicked = ($scope.selected_car == car)  ? null : true;
        $scope.selected_car = ($scope.selected_car == car) ? null : car;

    };

});