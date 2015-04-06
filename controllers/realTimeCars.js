harrisControllers.controller('RealTimeCarCtrl', ['$rootScope', '$scope', '$interval', '$http', 'RestFactory', 'TestCarFactory',
    function($rootScope, $scope, $interval, $http, RestFactory, TestCarFactory) {
        $scope.testCars = [];

        // Scope Methods
        $scope.getVehicles = function() {
            // Local Properties
            var vehicles = RestFactory.getVehicles();

            vehicles.success(function (cars) {
                cars.forEach(function(car){
                    var dashboardCar = TestCarFactory.getTestCar(car);
                    $scope.testCars.push(dashboardCar);
                });
                $scope.startCarsRunning();
            });
        };


        $scope.toggleRunning = function(index) {

        };

        $scope.startCarsRunning = function() {
            $scope.testCars.forEach(function(car){
                $interval(car.updateData, car.intervalTime);
            });
        };

        $scope.getVehicles();
    }]);