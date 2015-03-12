harrisControllers.controller('HistoryCtrl', ['$rootScope', '$scope', '$http', 'RestFactory', 'ChartFactory',
    function($rootScope, $scope, $http, RestFactory, ChartFactory){

        // Local Properties
        var maxCarsChecked = 8;
        var curCarsChecked = 0;
        var maxProps = 4;
        var curProps = 0;
        var propertyFields = ["vehicle_speed", "engine_rpm", "run_time_since_start", "fuel_level", "oil_temp",
            "accel_pos", "dist_with_MIL"];

        // Root Scope Properties
        $rootScope.pageTitle = "History";

        // Scope Properties
        $scope.cars = RestFactory.getVehicles();
        $scope.queuedCars = [];
        $scope.queuedProps = [];
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

        $scope.charts = [];
        $scope.chartCount = 1;

        // TODO: Refactor the heck out of this createCharts function.
        $scope.createCharts = function() {
            var cars = $scope.queuedCars;
            var props = $scope.queuedProps;
            var start = "[";
            var end = ']';
            var vins = [];
            var vinString = start;
            var propString = start;
            var dataObj = {};
            var vdataRestObj = {};
            var cHeight = 400;
            var cWidth = "100%";

            var renderDefaultObj = {};
            renderDefaultObj.id = 'chartDiv';
            renderDefaultObj.height = cHeight;
            renderDefaultObj.width = cWidth;

            if($scope.charts.length > 0) {
                $scope.chartCount = 1;

                zingchart.exec('chartDiv1', 'destroy');
                zingchart.exec('chartDiv2', 'destroy');
                zingchart.exec('chartDiv3', 'destroy');
                zingchart.exec('chartDiv4', 'destroy');
            }

            if( cars.length >= 1 && props.length >= 1) {
                var vcount = 0;
                var pcount = 0;

                cars.forEach(function(it){
                    vins.push(it.pk_vin);
                });

                vins.forEach(function(it) {

                    if(vcount < vins.length-1) {
                        vinString += '"' + it + '",';
                    } else {
                        vinString += '"' + it + '"';
                    }
                    vcount++;
                });

                props.forEach(function(it){
                    if(pcount < props.length-1) {
                        propString += '"' + it + '",';
                    } else {
                        propString += '"' + it + '"';
                    }
                    pcount++
                });

                vinString += end;
                propString += end;

                dataObj.vinString = vinString;
                dataObj.propString = propString;

                vdataRestObj = RestFactory.getVehicleData(dataObj);

                vdataRestObj.success(function(data){
                    $scope.charts = ChartFactory.getCharts(cars, props, data);

                    $scope.charts.forEach(function(chart){
                        $scope['chartName' + ($scope.chartCount)] = chart.propName;
                        renderDefaultObj.id = 'chartDiv' + $scope.chartCount;
                        renderDefaultObj.data = chart.chart;

                        $scope.chartCount++;

                        zingchart.render(renderDefaultObj);
                    })
                });
            }
        }
    }
]);