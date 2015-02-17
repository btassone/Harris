harrisApp.service('CarDataService', function(GeneratorUtilityService) {

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
                    result.make = "Ford";
                    result.model = "Crown Victoria";
                    result.year = 2007;
                    result.description = "Rookie Car #1";
                    result.status = "ok";

                    row.push(result);
                }
                results.push(row);
            }

            return results;
        }
    }
});

harrisApp.service('ErrorDataService', function(GeneratorUtilityService) {
   return {
       randomErrors: function(amt) {
           var results = [];

           for(var i = 0; i < amt; i++) {
               var result = {}
               result.vin = GeneratorUtilityService.generateVin();
               result.code = "error.something";
               result.message = "message";

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
})