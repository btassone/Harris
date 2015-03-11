harrisApp.factory('ChartFactory', ['$http', 'GeneratorUtilityService', 'RestFactory',
    function($http, GeneratorUtilityService, RestFactory) {

        var chart_data = {
            "type": "line"
        };

        return {
            getCharts: function(cars, props, carData) {
                carData.forEach(function(cData){
                    cData.success(function(data){
                        var car = cars.forEach(function(c){
                            var the_car = null;

                            if(data[0].vin == c.pk_vin) {
                                the_car = c;
                            }

                            console.log(the_car);
                            return the_car;
                        });
                        console.log("car", car);
                        chart_data.series = [];
                    });
                });
            }
        }
    }]);