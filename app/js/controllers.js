var harrisControllers = angular.module('harrisControllers', []);
var car_amount = 16;
var error_amount = 8;

harrisControllers.controller('RealTimeResultsCtrl', ['$rootScope', '$scope', '$http', 'CarDataService', 'ErrorDataService',
    function($rootScope, $scope, $http, CarDataService, ErrorDataService) {

        $rootScope.activeLink = "realTime";

        $scope.cars = CarDataService.randomCars(car_amount);
        $scope.errors = ErrorDataService.randomErrors(error_amount);

        $scope.selected_car = null;
        $scope.clicked_car = function(car) {

            car.clicked = ($scope.selected_car == car)  ? null : true;
            $scope.selected_car = ($scope.selected_car == car) ? null : car;

        };

}]);

harrisControllers.controller('HistoryCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $rootScope.activeLink = "history";
        $scope.setup = true;
}]);

harrisControllers.controller('SettingsCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $rootScope.activeLink = "settings";
        $scope.setup = true;
}]);