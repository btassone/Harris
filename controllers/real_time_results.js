harrisControllers.controller('RealTimeResultsCtrl', ['$rootScope', '$scope', '$http', 'RealTimeResultsService', 'RestFactory',
    function($rootScope, $scope, $http, RealTimeResultsService, RestFactory) {

        // Root Scope Properties
        $rootScope.pageTitle = "Real Time Monitoring";
        $rootScope.activeLink = "realTime";

        // Scope Properties
        $scope.errors = null;
        $scope.selected_car = null;

        // Scope Methods
        $scope.getVehicles = function() {
            var vehicles = RestFactory.getVehicles();
            vehicles.success(function (cars) {
                $scope.cars = cars;
                $scope.cars = RealTimeResultsService.setStatus($scope.cars);
                $scope.cars = RealTimeResultsService.rowifyData($scope.cars);
            });
        };

        $scope.getAlerts = function () {
            var alerts = RestFactory.getNewAlerts();
            alerts.success(function (data) {
                $scope.errors = data;
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
            var start = "2015-03-02 00:00:00";
            var end = "2015-03-06 00:00:00";
            var dataObj = {};

            dataObj.vinString = cvin;
            dataObj.propString = dels;
            dataObj.startTime = start;
            dataObj.endTime = end;

            car.clicked = ($scope.selected_car == car)  ? null : true;

            var vehicleData = RestFactory.getVehicleData(dataObj);
            vehicleData.success(function(vData) {
                var clicked = car.clicked;
                car = vData[0];
                car.clicked = clicked;

                $scope.selected_car = ($scope.selected_car == car) ? null : car;
            });
        };

        // Run Scope Setup Methods
        $scope.getVehicles();
        $scope.getAlerts();
    }
]);