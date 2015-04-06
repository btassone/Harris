harrisApp.factory("TestCarFactory", [ 'RestFactory', function(RestFactory) {
    return {
        getTestCar: function(car) {
            return new TestCar(car);
        }
    };
}]);

function TestCar(car) {
    var speed = 0;
    var fuelLevel = 0;
    var accelPos = 0;
    var distanceWithMIL = 0;
    var timeSinceStart = 0.0;
    var engineRPM = 0;
    var oilTemp = 0;
    var running = false;

    var MIL = false;
    var distanceTraveled = 0;
    var maxDistance = 850;

    this.intervalTime = 1000;  // 1 second
    var interval = null;

    this.vin = car.pk_vin;
    this.description = car.description;
    this.make = car.make;
    this.model = car.model;
    this.year = car.year;

    this.updateData = function() {

        var distancePerSecond = speed / 60 / 60;
        console.log(distancePerSecond);

        if (MIL) {
            distanceWithMIL += distancePerSecond;
        }
        distanceTraveled += distancePerSecond;
        timeSinceStart++;
    };

    this.toggleMIL = function() {
        this.setDistanceWithMIL(0);
        MIL = !MIL;
    };
    this.getMIL = function() { return MIL; }

    this.toggleRunning = function($int) {
        running = !running;

        if(running) {
            interval = $int(this.updateData, this.intervalTime, 0, true, this);
            console.log("Running");
        } else {
            $int(interval);
            console.log("Stopped Running");
        }
    };
    this.getRunning = function() { return running; }

    this.setSpeed = function(s) {
        var min = 0;
        var max = 255;

        if(s >= min && s <= max) {
            speed = s;
        }


    };
    this.getSpeed = function() { return speed; };
    this.getSpeedKPH = function() {

        var kphConversionNum = 1.60934;

        return parseInt(speed * kphConversionNum);
    };

    this.setFuelLevel = function(fl) {
        var min = 0;
        var max = 100;

        if(fl >= min && fl <= max) {
            fuelLevel = fl;
        }
    };
    this.getFuelLevel = function() { return fuelLevel; }

    this.setAccelPos = function(ap) {
        var min = 0;
        var max = 100;

        if(ap >= min && ap <= max) {
            accelPos = ap;
        }
    };
    this.getAccelPos = function() { return accelPos; }

    this.setDistanceWithMIL = function(dwmil) {
        var min = 0;
        var max = 65535;

        if(dwmil >= min && dwmil <= max) {
            distanceWithMIL = dwmil;
        }
    };
    this.getDistanceWithMIL = function() { return distanceWithMIL; }

    this.setTimeSinceStart = function(tss) {
        var min = 0;
        var max = 65535;

        if(tss >= min && tss <= max) {
            timeSinceStart = tss;
        }
    };
    this.getTimeSinceStart = function() { return timeSinceStart; }
    this.getTimeSinceStartHours = function() {

        var timeHours = timeSinceStart * 60 * 60;

        return parseFloat(timeHours);
    };

    this.setEngineRPM = function(erpm) {
        var min = 0;
        var max = 16834;

        if(erpm >= min && erpm <= max) {
            engineRPM = erpm;
        }
    };
    this.getEngineRPM = function() { return engineRPM; }

    this.setOilTemp = function(ot) {
        var min = -40;
        var max = 210;

        if(ot >= min && ot <= max) {
            oilTemp = ot;
        }
    };

    this.getOilTemp = function() { return oilTemp; }
    this.getOilTempFahrenheit = function() {

        var fh = parseInt((oilTemp * 1.8) + 32);

        return fh;
    };
}