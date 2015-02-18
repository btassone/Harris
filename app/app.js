'use strict';

// Declare app level module which depends on views, and components
var harrisApp = angular.module('harrisApp', []);

var car_amount = 16;
var error_amount = 8;

harrisApp.controller('RealTimeResultsCtrl', function($scope, $http, CarDataService, ErrorDataService) {

    $scope.cars = CarDataService.randomCars(car_amount);
    $scope.errors = ErrorDataService.randomErrors(error_amount);

    $scope.selected_car = null;
    $scope.clicked_car = function(car) {

        car.clicked = ($scope.selected_car == car)  ? null : true;
        $scope.selected_car = ($scope.selected_car == car) ? null : car;

    };

});