harrisControllers.controller('HistoryCtrl', ['$rootScope', '$scope', '$http', 'RestFactory',
    function($rootScope, $scope, $http, RestFactory){

        var maxCarsChecked = 8;
        var curCarsChecked = 0;
        var propertyFields = ["vehicle_spee", "engine_rpm", "run_time_since_start", "fuel_level", "oil_temp",
            "accel_pos", "dist_with_MIL"];


        $scope.cars = RestFactory.getVehicles();
        $scope.queuedCars = [];
        $scope.disableCars = false;
        $scope.carProperties = propertyFields;

        $scope.queueCar = function(car) {

            var carInQueue = false;

            $scope.queuedCars.forEach(function(element, index, array) {
                if(element.pk_vin == car.pk_vin) {
                    carInQueue = true;
                    array.splice(index, 1);
                    curCarsChecked--;
                }
            });

            if(curCarsChecked < maxCarsChecked) {
                if (!carInQueue) {
                    $scope.queuedCars.push(car);
                    curCarsChecked++;
                }

                if(curCarsChecked < maxCarsChecked) {
                    $scope.disableCars = false;
                } else {
                    $scope.disableCars = true;
                }
            }

        };

        $scope.carInQueue = function(car) {
            var foundCar = false;

            $scope.queuedCars.forEach(function(element, index, array){
                if(element.pk_vin == car.pk_vin) {
                    foundCar = true;
                }
            });

            return foundCar;
        }
    }
]);