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
        getVehicleData: function(vin) {
            var carDataHistory = new Object();
            carDataHistory.data = null;

            $http.get('/vehicle/data/' + vin).success(function(data){
               carDataHistory.data = data;
            });

            return carDataHistory.data;
        }
    }
}]);