harrisControllers.controller('HistoryCtrl', ['$rootScope', '$scope', '$http', 'RestFactory', 'ChartFactory',
    function($rootScope, $scope, $http, RestFactory, ChartFactory){

        // Local Properties
        var maxCarsChecked = 8;
        var curCarsChecked = 0;
        var maxProps = 4;
        var curProps = 0;
        var propertyFields = ["vehicle_speed", "engine_rpm", "run_time_since_start", "fuel_level", "oil_temp",
            "accel_pos", "dist_with_MIL"];

        // Local Functions
        function getCarList() {
            var carList = RestFactory.getVehicles();
            var list = [];

            carList.success(function (cList) {
                cList.forEach(function(car){
                    list.push(car);
                });
            });

            return list;
        }

        // Root Scope Properties
        $rootScope.pageTitle = "History";

        // Scope Properties
        $scope.cars = getCarList();
        $scope.queuedCars = [];
        $scope.queuedProps = [];
        $scope.disableCars = false;
        $scope.disableProperties = false;
        $scope.carProperties = propertyFields;
        $scope.charts = [];
        $scope.chartCount = 1;
        $scope.minDate = "2014-12-01";
        $scope.dateRange = {};
        $scope.dateRange.start = {};
        $scope.dateRange.start.date = "2015-03-01";
        $scope.dateRange.start.time = "00:00:01";
        $scope.dateRange.end = {};
        $scope.dateRange.end.date = "2015-03-07";
        $scope.dateRange.end.time = "23:59:59";
        $scope.chartError = false;
        $scope.chartErrorMsg = '';

        // Scope Methods
        $scope.currentDate = function() {
            var today = new Date();
            var retStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

            return retStr;
        };

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

                $scope.disableCars = !(curCarsChecked < maxCarsChecked);
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

                $scope.disableProperties = !(curProps < maxProps);
            }
        };

        $scope.propInQueue = function(prop) {
            var foundProp = false;

            $scope.queuedProps.forEach(function(element){
                if(element == prop) {
                    foundProp = true;
                }
            });

            return foundProp;
        };

        $scope.carInQueue = function(car) {
            var foundCar = false;

            $scope.queuedCars.forEach(function(element){
                if(element.pk_vin == car.pk_vin) {
                    foundCar = true;
                }
            });

            return foundCar;
        };

        // TODO: Refactor the heck out of this createCharts function.
        $scope.createCharts = function() {

            // Local Properties
            var cars = $scope.queuedCars;
            var props = $scope.queuedProps;
            var startDate = $scope.dateRange.start.date;
            var startTime = $scope.dateRange.start.time;
            var endDate = $scope.dateRange.end.date;
            var endTime = $scope.dateRange.end.time;
            var start = "[";
            var end = ']';
            var vins = [];
            var vinString = start;
            var propString = start;
            var dataObj = {};
            var vdataRestObj = {};
            var cHeight = 400;
            var cWidth = "100%";

            // Base Properties for ZingChart Render
            var renderDefaultObj = {};
            renderDefaultObj.id = 'chartDiv';
            renderDefaultObj.height = cHeight;
            renderDefaultObj.width = cWidth;

            $scope.chartError = false;
            $scope.chartErrorMsg = "";

            // If we are creating new charts we need to make sure to delete the old ones
            if($scope.charts.length > 0) {
                $scope.chartCount = 1;

                zingchart.exec('chartDiv1', 'destroy');
                zingchart.exec('chartDiv2', 'destroy');
                zingchart.exec('chartDiv3', 'destroy');
                zingchart.exec('chartDiv4', 'destroy');
            }

            // If we have at least 1 car and 1 prop selected
            if( cars.length >= 1 && props.length >= 1 && startDate && endDate) {
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
                dataObj.startDate = startDate + " " + startTime;
                dataObj.endDate = endDate + " " + endTime;

                vdataRestObj = RestFactory.getVehicleData(dataObj);

                vdataRestObj.success(function(data){

                    if(data != '') {
                        $scope.charts = ChartFactory.getCharts(cars, props, data);

                        if($scope.charts[0].error.hasOne) {
                            $scope.chartError = true;
                            $scope.chartErrorMsg = $scope.charts[0].error.vins.join() + ' have no data. Un-select these vehicles for the ' +
                            'charts to work';
                        } else {
                            $scope.charts.forEach(function (chart) {
                                $scope['chartName' + ($scope.chartCount)] = chart.propName;
                                renderDefaultObj.id = 'chartDiv' + $scope.chartCount;
                                renderDefaultObj.data = chart.chart;

                                $scope.chartCount++;

                                zingchart.render(renderDefaultObj);
                            });
                        }
                    } else {
                        $scope.chartError = true;
                        $scope.chartErrorMsg = "No cars selected have data.";
                    }
                });
            }
        }
    }
]);

function carInSelected(selectedCars, testDataWithVin) {
    var carInSelected = false;

    selectedCars.forEach(function(sc){
        testDataWithVin.forEach(function(td){
            console.log(sc,td);
            if(sc.pk_vin == td.vin) {
                carInSelected = true;
            }
        });
    });

    return carInSelected
}