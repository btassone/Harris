harrisApp.factory('RestFactory', ['$http', function($http) {
    return {
        getVehicles: function() {
            return $http.get('/vehicle/list');
        },
        getVehicleData: function(vDataObj) {

            // TODO: Remove backup date ranges once date picker is added
            var urlString = '/data?VIN=' + encodeURIComponent(vDataObj.vinString) +
                '&data_elements=' + encodeURIComponent(vDataObj.propString) +
                '&start_time=' + encodeURIComponent(vDataObj.startTime || '2015-01-07T22:11:01.000Z') +
                '&end_time=' + encodeURIComponent(vDataObj.endTime || '2015-07-07T22:11:01.000Z');

            return $http.get(urlString);
        },
        postVehicleData: function(dataObj) {
            return $http.post('/data', dataObj);
        },
        deleteVehicle: function(vin) {
            var urlString = '/vehicle/' + vin;
            return $http.delete(urlString);
        },
        getNewAlerts: function() {
            return $http.get('/alert/new');
        },
        postAlerts: function(alert) {
            return $http.post('/alert', alert);
        },
        makeAlertOld: function(id) {
            var urlString = '/alert/' + id;
            return $http.put(urlString, {});
        }
    }
}]);