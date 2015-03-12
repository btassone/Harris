harrisApp.factory('RestFactory', ['$http', function($http) {
    return {
        getVehicles: function() {
            function obj() {
                this.cars = [];
            }
            var d = new obj();

            $http.get('/vehicle/list').success(function (data) {
                for(var a in data) {
                    d.cars.push(data[a]);
                }
            });

            return d.cars;
        },
        getVehicleData: function(vdataObj) {

            var urlString = '/data?VIN=' + encodeURIComponent(vdataObj.vinString) +
                '&data_elements=' + encodeURIComponent(vdataObj.propString) +
                '&start_time=' + encodeURIComponent('2015-01-07T22:11:01.000Z') +
                '&end_time=' + encodeURIComponent('2015-07-07T22:11:01.000Z');
            var ret = $http.get(urlString);

            return ret;
        }
    }
}]);