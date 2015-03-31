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
        },
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
});