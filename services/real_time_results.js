harrisApp.service('RealTimeResultsService', ['$http', function($http) {
    return {
        setStatus: function(cars) {

            for(var car in cars) {
                var c = cars[car];
                c.status = "ok";
                $http.get('/alert/new').success((function(c) {

                    return function(data) {
                        for (var alert in data) {
                            var a = data[alert];

                            if (c.pk_vin == a.vin) {
                                c.status = "error";
                            }
                        }
                    }
                })(c));
            }

            return cars;
        },
        rowifyData: function(data) {
            var colMax = 4;
            var rowMax = parseInt(data.length / colMax);
            var totalCount = 0;
            var results = [];

            for(var i = 0; i <= rowMax; i++) {
                var cols = [];

                for(var g = 0; g < colMax; g++) {
                    if(data[totalCount]) {
                        cols.push(data[totalCount]);
                        totalCount++;
                    }
                }
                results.push(cols);
            }

            return results;
        },
        getVehicles: function() {
            var cars = null;

            $http.get('/vehicle/list').
                success(function (data, status, headers, config) {
                    cars = data;
                }).
                error(function (data, status, headers, config) {
                    console.log("Error");
                });

            return cars;
        }
    }
}]);