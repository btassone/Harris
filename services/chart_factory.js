// Helper Factory
harrisApp.factory('ChartFactory', function(GeneratorUtilityService, CarFactory) {

    var num_of_cars = 5;
    var cars = {};
    var charts = {};
    var maxes = {
        speed: 150,
        engine_rpm: 5000,
        run_time_since_start: 200000,
        fuel_level: 100,
        oil_temp: 100,
        accel_pos: 100,
        dist_with_mil: 20000
    };

    cars.info = CarFactory.randomCarsNoRows(num_of_cars);
    cars.data = generateData(cars.info, maxes);

    function generateData(cars, maxes) {

        var results = [];

        for(var i = 0; i < cars.length; i++) {
            var data = {};

            Object.keys(maxes).forEach(function (cval, index, arr) {
                var value = maxes[cval];

                data[cval] = parseInt(GeneratorUtilityService.getRandomNumber(value));
            });
            data.vin = cars[i].pk_vin;

            results.push(data);
        }
        return results;
    }

    function generateDataForACar(maxes, field, amount) {
        var results = [];

        for(var i = 0; i < amount; i++) {
            results.push(parseInt(GeneratorUtilityService.getRandomNumber(maxes[field])));
        }
        return results;
    }

    return {
        cars: cars,
        generateChart: function (car, field_set) {
            var chart_data = {
                "type": "line"
            };
            var fuel_test_data = generateDataForACar(maxes, field_set[0], 10);

            console.log(fuel_test_data);
            chart_data.series = [];
            chart_data.series.push({ "values": fuel_test_data });
            console.log(chart_data);

            var chart_args = {
                id: 'chartDiv',
                height: 400,
                width: "100%",
                data: chart_data
            };

            zingchart.render(chart_args);
        },
        maxes: maxes
    }
});