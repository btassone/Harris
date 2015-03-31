// Handles car data services generation
harrisApp.factory('CarFactory', ['GeneratorUtilityService', function(GeneratorUtilityService) {

    function generateMake() {
        var makes = ["Ford", "Chrysler", "Hyundai", "Oldsmobile", "Saturn"];
        var make = makes[parseInt(GeneratorUtilityService.getRandomNumber(makes.length-1))];
        this.make = make;

        return make;
    }

    function generateModel() {
        var cars = {
            "Ford": [ "2GA", "300", "7W", "Abeille", "Anglia", "Consul" ],
            "Chrysler": [ "150", "200", "300M", "Airflow", "Airstream", "Aspen" ],
            "Hyundai": [ "Accent", "Elentra", "Elentra Coupe", "Elantra GT", "Veloster" ],
            "Oldsmobile": [ "Series 70", "Firenza", "Omega", "Regency", "Toronado", "Starfire" ],
            "Saturn": [ "Astra", "Outlook", "Ion", "Curve", "Aura", "Vue" ]
        };
        var cset = cars[this.make];
        var car = cset[parseInt(GeneratorUtilityService.getRandomNumber(cset.length-1))];

        return car;
    }

    function generateYear() {
        var maxYears = 15;
        var baseYear = 2000;

        return baseYear + parseInt(GeneratorUtilityService.getRandomNumber(maxYears));
    }

    function generateTimestamp() {

        function generateDate() {
            var year = "2015";
            var month = "03";
            var days = ["01", "02", "03", "04", "05", "06", "07"];

            return year + "-" + month + "-" + days[parseInt(GeneratorUtilityService.getRandomNumber(days.length))-1]
        }

        function generateTime() {
            var hours = 24;
            var minutes = 60;
            var seconds = 60;

            var rn = GeneratorUtilityService.getRandomNumber;

            var hour = makeTwoDigits(parseInt(rn(hours)-1));
            var minute = makeTwoDigits(parseInt(rn(minutes)-1));
            var second = makeTwoDigits(parseInt(rn(seconds)-1));

            return hour + ":" + minute + ":" + second;
        }

        return generateDate() + " " + generateTime();
    }

    function generateVehicleSpeed() {
        var maxSpeed = 255;

        return parseInt(GeneratorUtilityService.getRandomNumber(maxSpeed));
    }

    function generateEngineRpm() {
        var maxRPM = 16834;
        var minRPM = 1;

        var randRPM = parseInt(GeneratorUtilityService.getRandomNumber(maxRPM));

        while(randRPM < 1) {
            randRPM = parseInt(GeneratorUtilityService.getRandomNumber(maxRPM));
        }

        return randRPM;
    }

    function generateRunTimeSinceStart() {
        var min = 0;
        var max = 65535

        return parseInt(GeneratorUtilityService.getRandomInt(min, max));
    }

    function generateFuelLevel() {
        var max = 100;

        return parseInt(GeneratorUtilityService.getRandomNumber(max));
    }

    function generateOilTemp() {
        var min = -40;
        var max = 210;

        return parseInt(GeneratorUtilityService.getRandomInt(min, max));
    }

    function generateAccelPos() {
        var max = 100;

        return parseInt(GeneratorUtilityService.getRandomNumber(max));
    }

    function generateDistWithMil() {
        var min = 0;
        var max = 65535;

        return parseInt(GeneratorUtilityService.getRandomInt(min, max));
    }

    function makeTwoDigits(num) {
        if(num.toString().length < 2) {
            num = "0" + num;
        }
        return num;
    }

    return {
        generateAlerts: function(cars) {
            var len = (cars.length < 10) ? cars.length : parseInt(cars.length / 3);
            var alerts = [];

            for(var i = 0; i < len; i++) {
                alerts.push([{
                    VIN: cars[i].pk_vin,
                    timestamp: generateTimestamp(),
                    trouble_code: "P0001"
                }]);
            }

            return alerts;
        },
        generateTravelData: function(cars, amt) {
            var results = [];

            for(var car in cars) {
                var carResults = {};
                carResults.results = [];

                for (var i = 0; i < amt; i++) {
                    var result = {};
                    result.timestamp = generateTimestamp();
                    result.vehicle_speed = generateVehicleSpeed();
                    result.engine_rpm = generateEngineRpm();
                    result.run_time_since_start = generateRunTimeSinceStart();
                    result.fuel_level = generateFuelLevel();
                    result.oil_temp = generateOilTemp();
                    result.accel_pos = generateAccelPos();
                    result.dist_with_MIL = generateDistWithMil();

                    carResults.results.push(result);
                }
                carResults.pk_vin = cars[car].pk_vin;
                results.push(carResults)
            }

            return results;
        },
        randomCars: function(amt) {
            var results = [];

            for(var i = 0; i < amt; i++) {
                var result = {};
                result.pk_vin = GeneratorUtilityService.generateVin();
                result.make = generateMake();
                result.model = generateModel();
                result.year = generateYear();
                result.description = "This is a description";

                results.push(result);
            }

            return results;
        },
        makeCarsSQL: function(cars) {
            var results = [];
            var start = "INSERT INTO vehicles (pk_vin, make, model, year, description) VALUES(";
            var end = ");";

            cars.forEach(function(car){
                var count = 1;
                var str = start;

                for(var prop in car) {

                    if(count == Object.size(car)) {
                        str += "'" + car[prop] + "'"
                    } else {
                        str += "'" + car[prop] + "',"
                    }
                    count++;
                }

                str = str + end;
                results.push(str);
            });

            return results;
        }
    }
}]);