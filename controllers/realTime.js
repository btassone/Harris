harrisControllers.controller('RealTimeResultsCtrl', ['$rootScope', '$scope', '$http', 'RealTimeResultsService', 'RestFactory',
    function($rootScope, $scope, $http, RealTimeResultsService, RestFactory) {

        // Root Scope Properties
        $rootScope.pageTitle = "Real Time Monitoring";
        $rootScope.activeLink = "realTime";

        // Scope Properties
        $scope.errors = [];
        $scope.selected_car = null;

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

            var cvin = '["' + car.pk_vin + '"]';
            var dels = '["vehicle_speed", "engine_rpm", "run_time_since_start", "fuel_level", "oil_temp", "accel_pos", "dist_with_MIL"]';
            var today = new Date();
            var start = "2015-03-02 00:00:00";
            var end = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate() + " 23:59:59";
            var dataObj = {};

            dataObj.vinString = cvin;
            dataObj.propString = dels;
            dataObj.startDate = start;
            dataObj.endDate = end;

            car.clicked = ($scope.selected_car == car)  ? null : true;

            var vehicleData = RestFactory.getVehicleData(dataObj);
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
        };

        // Run Scope Setup Methods
        $scope.getVehicles();
        $scope.getAlerts();
    }
]);