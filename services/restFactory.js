harrisApp.factory('RestFactory', ['$http', 'alert', 'alertNew', 'alertId', 'data', 'dataSchema', 'vehicleList',
    'vehicleVin', 'vehicleInfo', 'vehicleData',
    function($http, alert, alertNew, alertId, data, dataSchema, vehicleList, vehicleVin, vehicleInfo, vehicleData) {
        return {
            getVehicles: function() {
                return $http.get(vehicleList);
            },
            putVehicle: function(carInfo) {
                var data = {};
                data.model = carInfo.model;
                data.make = carInfo.make;
                data.year = carInfo.year;
                data.description = carInfo.description;

                return $http.put(vehicleVin + carInfo.vin, data);
            },
            getVehicleData: function(vDataObj) {

                // TODO: Remove backup date ranges once date picker is added
                var urlString = data + '?VIN=' + encodeURIComponent(vDataObj.vinString) +
                    '&data_elements=' + encodeURIComponent(vDataObj.propString) +
                    '&start_time=' + encodeURIComponent(vDataObj.startDate) +
                    '&end_time=' + encodeURIComponent(vDataObj.endDate);

                return $http.get(urlString);
            },
            postVehicleData: function(dataObj) {
                return $http.post(data, dataObj);
            },
            deleteVehicleData: function(vin) {
                return $http.delete(vehicleInfo + vin);
            },
            deleteVehicle: function(vin) {
                var urlString = vehicleVin + vin;
                return $http.delete(urlString);
            },
            getNewAlerts: function() {
                return $http.get(alertNew);
            },
            postAlerts: function(pAlert) {
                return $http.post(alert, pAlert);
            },
            makeAlertOld: function(id) {
                var urlString = alertId + id;
                return $http.put(urlString, {});
            }
        }
    }]);