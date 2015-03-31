harrisControllers.controller('AdminCtrl', ['$rootScope', '$scope', '$http', 'CarFactory', 'RestFactory',
    function($rootScope, $scope, $http, CarFactory, RestFactory){

        // Local Methods
        function setCarListAmt() {

            var vehicleList = RestFactory.getVehicles();
            vehicleList.success(function(cars){
                $scope.car_list_amt = Object.size(cars);
                $scope.init_car_listing = cars;
            });
        }

        // Root Scope Property
        $rootScope.pageTitle = "Data Generation"

        // Scope Properties
        $scope.car_amount = 0;
        $scope.car_data = null;
        $scope.init_car_listing = null;
        $scope.car_list_amt = 0;
        $scope.travel_data_amount = 0;
        $scope.no_cars = false;
        $scope.temp_data = null;
        $scope.travelData = null;
        $scope.alertData = null;

        // Initial Functions - On page load
        setCarListAmt();

        // Scope Methods
        $scope.generateCars = function(amount) {
            $scope.car_data = CarFactory.makeCarsSQL(CarFactory.randomCars(amount));
        };

        $scope.generateAlerts = function() {
            $scope.alertData = CarFactory.generateAlerts($scope.init_car_listing);

            $scope.alertData.forEach(function(alert){
                var postAlerts = RestFactory.postAlerts(alert);
                postAlerts.error(function(data){});
            });
        };

        $scope.generateTravelData = function(amount) {
            if($scope.init_car_listing) {

                $scope.travelData = CarFactory.generateTravelData($scope.init_car_listing, amount);

                $scope.travelData.forEach(function(td){
                    var vin = td.pk_vin;

                    td.results.forEach(function(result){
                        var dObj = [{
                            timestamp: result.timestamp,
                            VIN: vin,
                            vehicle_speed: result.vehicle_speed,
                            engine_rpm: result.engine_rpm,
                            run_time_since_start: result.run_time_since_start,
                            fuel_level: result.fuel_level,
                            oil_temp: result.oil_temp,
                            accel_pos: result.accel_pos,
                            dist_with_MIL: result.dist_with_MIL
                        }];

                        var postVehicleData = RestFactory.postVehicleData(dObj);
                        postVehicleData.error(function(data){
                            console.log(data);
                        });
                    });
                });
            }
        };

        $scope.deleteVehicles = function () {
            var vehicleList = RestFactory.getVehicles();
            vehicleList.success(function(cars) {
                if(Object.size(cars) > 0) {
                    cars.forEach(function(car){
                        var deleteVehicle = RestFactory.deleteVehicle(car.pk_vin);
                        deleteVehicle.success(function(){
                            console.log("Deleted " + car.pk_vin + "...");
                        });
                    });
                } else {
                    $scope.no_cars = true;
                }
            });
        };
    }
]);