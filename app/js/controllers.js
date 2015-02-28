var harrisControllers = angular.module('harrisControllers', []);
var car_amount = 16;
var error_amount = 8;

harrisControllers.controller('RealTimeResultsCtrl', ['$rootScope', '$scope', '$http', 'CarFactory', 'ErrorDataService',
    function($rootScope, $scope, $http, CarFactory, ErrorDataService) {

        $rootScope.activeLink = "realTime";

        $scope.cars = CarFactory.randomCars(car_amount);
        $scope.errors = ErrorDataService.randomErrors(error_amount);

        $scope.selected_car = null;
        $scope.clicked_car = function(car) {

            car.clicked = ($scope.selected_car == car)  ? null : true;
            $scope.selected_car = ($scope.selected_car == car) ? null : car;

        };

}]);

harrisControllers.controller('HistoryCtrl', ['$rootScope', '$scope', '$http', 'ChartFactory',
    function($rootScope, $scope, $http, ChartFactory){

        $rootScope.activeLink = "history";
        $scope.cars = ChartFactory.cars;
        $scope.clicked_car_fields = [];
        $scope.chart_fields = [];
        $scope.selected_car = null;

        $scope.clicked_car = function(car) {
            $scope.selected_car = car;
            $scope.getClickedCarFields(car);

            console.log($scope.selected_car);
        };

        $scope.getClickedCarFields = function(car) {
            var fields = [];
            Object.keys(car).forEach(function(cval, index, arr) {
                if(cval != "$$hashKey")
                    fields.push(cval);
            });
            $scope.clicked_car_fields = fields;

            // Clear Chart Fields
            $scope.chart_fields = [];
            $(".field_boxes").each(function(){
                $(this).removeAttr('checked');
            });
            $scope.charts = undefined;
        };

        $scope.clicked_field = function(field) {
            var field_index = $scope.chart_fields.indexOf(field);
            $scope.charts = true;
            if(field_index == -1) {
                $scope.chart_fields.push(field);
                ChartFactory.generateChart($scope.selected_car, $scope.chart_fields);
            } else {
                $scope.chart_fields.splice(field_index, 1);
            }
        };
}]);

harrisControllers.controller('SettingsCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $rootScope.activeLink = "settings";
        $scope.setup = true;
}]);