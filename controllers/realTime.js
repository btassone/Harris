harrisControllers.controller('RealTimeResultsCtrl', ['$rootScope', '$scope', '$interval', '$http', 'RealTimeResultsService', 'RestFactory',
    function($rootScope, $scope, $interval, $http, RealTimeResultsService, RestFactory) {

        // Root Scope Properties
        $rootScope.pageTitle = "Real Time Monitoring";
        $rootScope.activeLink = "realTime";

        // Scope Properties
        $scope.errors = [];
        $scope.selected_car = null;
        $scope.selectedCarInterval = null;
        $scope.selectedCarTimeInterval = 1000;
        $scope.alertInterval = null;
        $scope.alertintervalTime = 1000;

        // Scope Methods
        $scope.getVehicles = function() {
            // Local Properties
            var vehicles = RestFactory.getVehicles();

            vehicles.success(function (cars) {

                var alerts = RestFactory.getNewAlerts();
                cars.forEach(function(car){
                    car.status = "ok";
                });

                alerts.success(function(alerts) {

                    alerts.forEach(function(alert){

                        var aVin = alert.vin;

                        cars.forEach(function(car){

                            var cVin = car.pk_vin;

                            if(cVin == aVin) {
                                car.status = "error";
                            }
                        });
                    });
                }).then(function() {
                    $scope.cars = RealTimeResultsService.rowifyData(cars);
                    $scope.alertInterval = $interval(keepFetchingAlerts, $scope.alertintervalTime);
                });
            });
        };

        $scope.getAlerts = function () {
            var alerts = RestFactory.getNewAlerts();
            alerts.success(function (errors) {
                $scope.errors = [];
                var carsInfo = RestFactory.getVehicles();
                carsInfo.success(function(carInfo){

                    carInfo.forEach(function(ci){

                       errors.forEach(function(error){

                           if(ci.pk_vin == error.vin) {
                               $scope.errors.push({
                                   carInfo: ci,
                                   error: error
                               });
                           }
                       })
                    });
                });
            });
        };

        $scope.seenAlert = function(id) {

            var makeAlertOld = RestFactory.makeAlertOld(id);
            makeAlertOld.success(function() {
                $scope.getVehicles();
                $scope.getAlerts();
            });
        };

        $scope.clicked_car = function(car) {

            $interval.cancel($scope.selectedCarInterval);

            car.clicked = ($scope.selected_car == car)  ? null : true;

            var vehicleData = RestFactory.getVehicleDataByVin(car.pk_vin);
            vehicleData.success(function(vData) {
                if(vData) {
                    var clicked = car.clicked;
                    var d = {};
                    d.data = vData[0];
                    d.carInfo = car;
                    car.clicked = clicked;

                    $scope.selected_car = ($scope.selected_car == car) ? null : d;
                } else {
                    $scope.selected_car = 'no_data';
                }
            });

            $scope.selectedCarInterval = $interval(keepFetchingCarData, $scope.selectedCarTimeInterval);
        };

        // Run Scope Setup Methods
        $scope.getVehicles();
        $scope.getAlerts();

        function keepFetchingAlerts() {

            var alerts = RestFactory.getNewAlerts();
            var vehicles = RestFactory.getVehicles();

            alerts.success(function(alerts){
                alerts.forEach(function(alert){
                    var foundAlert = false;

                    $scope.errors.forEach(function(car){

                        if(alert.vin == car.error.vin && alert.timestamp == car.error.timestamp) {
                            foundAlert = true;
                        }
                    });

                    if(!foundAlert) {
                        vehicles.success(function(v){
                            v.forEach(function(vehicle){
                                if(vehicle.pk_vin == alert.vin){
                                    var newCarAlert = {};
                                    newCarAlert.error = alert;
                                    newCarAlert.carInfo = vehicle;

                                    $scope.errors.push(newCarAlert);
                                }
                            });
                        });
                    }

                });
            });
        }

        function keepFetchingCarData() {
            var carVin = $scope.selected_car.carInfo.pk_vin;

            var vehicleData = RestFactory.getVehicleDataByVin(carVin);

            vehicleData.success(function(mostRecentCarData){
                $scope.selected_car.data = mostRecentCarData[0];
            })
        }
    }
]);