harrisControllers.controller('AdminCtrl', ['$rootScope', '$scope', '$http', 'CarFactory',
    function($rootScope, $scope, $http, CarFactory){
        $scope.car_amount = 0;
        $scope.car_data = null;
        $scope.init_car_listing = null;
        $scope.car_list_amt = 0;
        $scope.travel_data_amount = 0;
        $scope.no_cars = false;
        $scope.temp_data = null;
        $scope.travelData = null;
        $scope.alertData = null;

        (function setCarListAmt() {
            $http.get('/vehicle/list').success((function($scope){
                return function(data) {
                    $scope.car_list_amt = Object.size(data);
                    $scope.init_car_listing = data;
                }
            })($scope));
        })();

        $scope.generateCars = function(amount) {
            $scope.car_data = CarFactory.makeCarsSQL(CarFactory.randomCars(amount));
        };

        $scope.generateAlerts = function() {
            $scope.alertData = CarFactory.generateAlerts($scope.init_car_listing);

            for(var alert in $scope.alertData) {
                var a = $scope.alertData[alert];

                $http.post('/alert', a).error(function(data){

                });
            }
        };

        $scope.generateTravelData = function(amount) {
            if($scope.init_car_listing) {
                $scope.travelData = CarFactory.generateTravelData($scope.init_car_listing, amount);
                console.log($scope.travelData.length);
                for(var car in $scope.travelData) {
                    var td = $scope.travelData[car];
                    var vin = td.pk_vin;

                    for(var result in td.results) {
                        var r = td.results[result];
                        var dObj = [{
                            timestamp: r.timestamp,
                            VIN: vin,
                            vehicle_speed: r.vehicle_speed,
                            engine_rpm: r.engine_rpm,
                            run_time_since_start: r.run_time_since_start,
                            fuel_level: r.fuel_level,
                            oil_temp: r.oil_temp,
                            accel_pos: r.accel_pos,
                            dist_with_MIL: r.dist_with_MIL
                        }];

                        $http.post('/data', dObj).error(function(data){
                            console.log(data);
                        });
                    }
                }
            }
        };

        $scope.handleGroupsLoaded = function(data, status){};

        $scope.deleteVehicles = function () {
            $http.get('/vehicle/list').success((function($scope){
                return function(data) {

                    if(Object.size(data) > 0) {
                        for (var key in data) {
                            var car = data[key];

                            $http.delete('/vehicle/' + car.pk_vin).success($scope.handleGroupsLoaded, (function(vin) {
                                console.log("Deleted " + vin + "...");
                            })(car.pk_vin));
                        }
                    } else {
                        $scope.no_cars = true;
                    }
                }
            })($scope));
        };
    }
]);

