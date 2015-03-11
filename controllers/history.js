harrisControllers.controller('HistoryCtrl', ['$rootScope', '$scope', '$http', 'RestFactory', 'ChartFactory',
    function($rootScope, $scope, $http, RestFactory, ChartFactory){

        // Local Properties
        var maxCarsChecked = 8;
        var curCarsChecked = 0;
        var maxProps = 4;
        var curProps = 0;
        var propertyFields = ["vehicle_spee", "engine_rpm", "run_time_since_start", "fuel_level", "oil_temp",
            "accel_pos", "dist_with_MIL"];

        // Root Scope Properties
        $rootScope.pageTitle = "History";

        // Scope Properties
        $scope.cars = RestFactory.getVehicles();
        $scope.queuedCars = [];
        $scope.queuedProps = [];
        $scope.carDataCharts = [];
        $scope.disableCars = false;
        $scope.disableProperties = false;
        $scope.carProperties = propertyFields;


        // Scope Methods
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

        $scope.queueProp = function(prop) {
            var propInQueue = false;

            $scope.queuedProps.forEach(function(element, index, array) {
                if(element == prop) {
                    propInQueue = true;
                    array.splice(index, 1);
                    curProps--;
                }
            });

            if(curProps < maxProps) {
                if (!propInQueue) {
                    $scope.queuedProps.push(prop);
                    curProps++;
                }

                if(curProps < maxProps) {
                    $scope.disableProperties = false;
                } else {
                    $scope.disableProperties = true;
                }
            }
        };

        $scope.propInQueue = function(prop) {
            var foundProp = false;

            $scope.queuedProps.forEach(function(element, index, array){
                if(element == prop) {
                    foundProp = true;
                }
            });

            return foundProp;
        };

        $scope.carInQueue = function(car) {
            var foundCar = false;

            $scope.queuedCars.forEach(function(element, index, array){
                if(element.pk_vin == car.pk_vin) {
                    foundCar = true;
                }
            });

            return foundCar;
        };

        $scope.createCharts = function() {
            var cars = $scope.queuedCars;
            var props = $scope.queuedProps;

            var carData = [];
            var charts = [];

            if( cars.length >= 1 && props.length >= 1) {
                cars.forEach(function(car, index, array){
                    carData.push(RestFactory.getVehicleData(car.pk_vin));
                });
            }

            charts = ChartFactory.getCharts(cars, props, carData)
        }
    }
]);