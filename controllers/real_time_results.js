var error_amount = 8;

harrisControllers.controller('RealTimeResultsCtrl', ['$rootScope', '$scope', '$http', 'RealTimeResultsService',
    function($rootScope, $scope, $http, RealTimeResultsService) {

        $scope.errors = null;

        $scope.getVehicles = function() {
            $http.get('/vehicle/list').
                success(function (data, status, headers, config) {
                    $scope.cars = data;
                    $scope.cars = RealTimeResultsService.setStatus($scope.cars);
                    $scope.cars = RealTimeResultsService.rowifyData($scope.cars);
                }).
                error(function (data, status, headers, config) {
                    console.log("Error");
                });
        }

        $scope.getAlerts = function () {
            $http.get('/alert/new').success(function (data) {
                $scope.errors = data;
            });
        };

        $scope.getVehicles();
        $scope.getAlerts();

        $rootScope.activeLink = "realTime";
        $scope.handleGroupsLoaded = function(data, status){

        };

        $scope.seenAlert = function(id) {
            $http.put('/alert/' + id).success(function(data){
                console.log("seen error");
            });
            $scope.getVehicles();
            $scope.getAlerts();
        };

        $scope.selected_car = null;
        $scope.clicked_car = function(car) {

            var cvin = '["' + car.pk_vin + '"]';
            var dels = '["vehicle_speed", "engine_rpm", "run_time_since_start", "fuel_level", "oil_temp", "accel_pos", "dist_with_MIL"]';
            var start = "2015-03-02 00:00:00";
            var end = "2015-03-06 00:00:00";

            cvin = encodeURIComponent(cvin);
            dels = encodeURIComponent(dels);
            start = encodeURIComponent(start);
            end = encodeURIComponent(end);

            car.clicked = ($scope.selected_car == car)  ? null : true;

            $http.get('/data' + "?VIN=" + cvin + "&data_elements=" + dels + "&start_time=" + start + "&end_time=" + end).success((function(c){
                return function(data) {
                    var clicked = c.clicked;
                    c = data[0];
                    c.clicked = clicked;

                    $scope.selected_car = ($scope.selected_car == c) ? null : c;
                }
            })(car));
        };
    }
]);