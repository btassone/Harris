// Handles car data services generation
harrisApp.service('CarDataService', function(GeneratorUtilityService) {

    var make = "";

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

    function generateStatus() {
        var statuses = ["ok", "warning", "error"];
        var status = statuses[parseInt(GeneratorUtilityService.getRandomNumber(statuses.length)-1)];

        return status;
    }

    return {
        randomCars: function(amt) {
            var results = [];
            var cells = 4;
            var rows = parseInt(amt / cells);

            for(var i = 0; i < rows; i++) {
                var row = [];
                for(var g = 0; g < cells; g++) {
                    var result = {};
                    result.pk_vin = GeneratorUtilityService.generateVin();
                    result.make = generateMake();
                    result.model = generateModel();
                    result.year = generateYear();
                    result.description = "This is a description";
                    result.status = generateStatus();

                    row.push(result);
                }
                results.push(row);
            }

            return results;
        }
    }
});

// Handles error data generation
harrisApp.service('ErrorDataService', function(GeneratorUtilityService) {
   return {
       randomErrors: function(amt) {
           var results = [];

           for(var i = 0; i < amt; i++) {
               var result = {}
               result.vin = GeneratorUtilityService.generateVin();
               result.code = "P00" + (getRandomNumberWithTwoPlaces());
               result.message = "This is an error message";

               results.push(result);
           }

           return results;
       }
   }
});

// Helper Service
harrisApp.service('GeneratorUtilityService', function() {


    return {
        // Takes a string, returns an array
        toCharArray: function(str)
        {
            var arr = [];

            for (var i = 0; i < str.length; i++) {
                arr.push(str.charAt(i));
            }

            return arr;
        },
        getRandomNumber: function(max) {
            return (Math.random() * max) + 1;
        },
        generateVin: function() {
            var uppercase = this.toCharArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            var numbers = this.toCharArray("0123456789");
            var combined = uppercase.concat(numbers);
            var vin_length = 17;
            var vin = "";

            for (var i = 0; i < vin_length; i++) {
                vin += combined[parseInt(this.getRandomNumber(combined.length - 1))];
            }

            return vin;
        }
    }
});

function getRandomNumberWithTwoPlaces() {
    var num = parseInt(Math.random() * 100);

    if(num.toString().length % 2 != 0) {
        num = "0" + num;
    }

    return num;
}