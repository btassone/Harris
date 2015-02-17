harrisApp.service('CarDataService', ['$http', function() {
    return {
        random: function(amt) {
            var results = [];
            var cells = 4;
            var rows = parseInt(amt / cells);

            for(var i = 0; i < rows; i++) {
                var row = [];
                for(var g = 0; g < cells; g++) {
                    var result = {};
                    result.pk_vin = generateVin();
                    result.make = "Ford";
                    result.model = "Crown Victoria";
                    result.year = 2007;
                    result.description = "Rookie Car #1";
                    result.status = "ok";

                    row.push(result);
                }
                results.push(row);
            }

            function generateVin() {
                var uppercase = toCharArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                var numbers = toCharArray("0123456789");
                var combined = uppercase.concat(numbers);
                var vin_length = 17;
                var vin = "";

                for(var i = 0; i < vin_length; i++) {
                    vin += combined[parseInt(getRandomNumber(combined.length-1))];
                }

                return vin;
            }

            // Takes a string, returns an array
            function toCharArray(str) {
                var arr = [];

                for(var i = 0; i < str.length; i++) {
                    arr.push(str.charAt(i));
                }

                return arr;
            }

            function getRandomNumber(max) {
                return (Math.random() * max) + 1;
            }

            return results;
        }
    }
}]);