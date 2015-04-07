harrisControllers.controller('RealTimeCarCtrl', ['$rootScope', '$window', '$scope', '$interval', '$timeout', '$http', 'RestFactory', 'CarFactory',
    function($rootScope, $window, $scope, $interval, $timeout, $http, RestFactory, CarFactory) {

        $scope.getVehicles = function() {

            var vehicles = RestFactory.getVehicles();
            vehicles.success(function(cars){

                cars.forEach(function(car){
                    var inRunning = false;
                    var methodObj = null;

                    $rootScope.runningCars.forEach(function(runningCar){
                        if(runningCar.pk_vin == car.pk_vin) {
                            inRunning = true;
                            methodObj = runningCar.methods;
                        }
                    });

                    if(!inRunning)
                        car.methods = new Methods();
                    else
                        car.methods = methodObj;
                });

                $scope.cars = cars;

                if(!$rootScope.runningCarInternval)
                    $rootScope.runningCarInternval = $interval(carInternval, 1000);
            });
        };

        $scope.getVehicles();

        function Methods() {

            this.interval = null;
            this.carStarted = false;

            this.speed = 0;
            this.speedKPH = 0;
            this.fuelLevel = 100;
            this.accelPos = 0;
            this.distanceWithMIL = 0;
            this.timeSinceStart = 0.0;
            this.engineRPM = 0;
            this.oilTemp = 0;

            this.MIL = false;
            this.distanceTraveled = 0;
            this.distanceTraveledSession = 0;
            this.maxDistance = 850;
            this.troubleCode = '';

            var rgp = 3.08;
            var rpmConstant = 336;
            var tgr = 1.00;
            var td = 27;
            var ambientTemp = 23.8889;
            var oilTempConstant = 7.77;

            this.toggleRunning = function(car) {
                car.methods.carStarted = !car.methods.carStarted;

                if(car.methods.carStarted) {

                    this.start(car);

                } else {

                    this.stop(car);
                }
            };
            this.start = function(car) {
                $rootScope.runningCars.push(car);

            };
            this.stop = function(car) {
                // Remove car from running cars and clear the interval
                $rootScope.runningCars.forEach(function(runningCar, index){
                    if(car.pk_vin == runningCar.pk_vin) {
                        runningCar.methods.distanceTraveledSession = 0;
                        $rootScope.runningCars.splice(index, 1);
                    }
                });
            };

            this.setSpeed = function(s) {
                var min = 0;
                var max = 255;
                var erpm = 0;
                var ap = 0;

                var increasing = false;

                if (s >= min && s <= max) {

                    if(s >= this.speed)
                        increasing = true;

                    this.speed = s;
                    this.speedKPH = this.getSpeedKPH();
                    erpm = parseInt((rgp * s * rpmConstant * tgr) / td);

                    this.setEngineRPM(erpm);

                    if(increasing) {
                        ap = this.accelPos + 5;

                        if(ap > this.accelPos * 0.2) {
                            this.setAccelPos(ap);
                            carTimeout(this);
                        }
                    } else {
                        this.setAccelPos(this.speed * 0.2);
                    }


                }
            };
            this.getSpeedKPH = function() {

                var kphConversionNum = 1.60934;

                return parseInt(this.speed * kphConversionNum);
            };


            this.toggleMIL = function() {
                this.setDistanceWithMIL(0);
                this.MIL = !this.MIL;
            };

            this.setDistanceWithMIL = function(dwmil) {
                var min = 0;
                var max = 65535;

                if(dwmil >= min && dwmil <= max) {
                    this.distanceWithMIL = dwmil;
                }
            };

            this.setTimeSinceStart = function(tss) {
                var min = 0;
                var max = 65535;

                if(tss >= min && tss <= max) {
                    timeSinceStart = tss;
                }
            };

            this.setFuelLevel = function(fl) {
                var min = 0;
                var max = 100;

                if(fl >= min && fl <= max) {
                    this.fuelLevel = parseInt(fl);
                }
            };

            this.setAccelPos = function(ap) {
                var min = 0;
                var max = 100;

                if(ap >= min && ap <= max) {
                    if(ap >= (this.speed * 0.2)) {
                        this.accelPos = ap;
                    }
                }
            };

            this.setEngineRPM = function(erpm) {
                var min = 0;
                var max = 16834;

                if(erpm >= min && erpm <= max) {
                    this.engineRPM = erpm;
                }
            };

            this.setOilTemp = function() {
                var min = -40;
                var max = 104.44;

                if(this.oilTemp >= min && this.oilTemp <= max) {
                    this.oilTemp = parseInt(ambientTemp + (this.distanceTraveledSession * oilTempConstant));
                }
            };
            this.getOilTempFahrenheit = function() {

                var fh = parseInt((oilTemp * 1.8) + 32);

                return fh;
            };

            this.setDistanceTraveled = function(car, dps) {
                if(this.distanceTraveled <= this.maxDistance) {
                    this.distanceTraveled += dps;
                    this.distanceTraveledSession += dps;
                }
                else {
                    car.methods.stop(car);
                    car.methods.setSpeed(0);
                    car.methods.setFuelLevel(0);
                }
            };

            this.fuelLevelDepreciation = function() {
                return (this.maxDistance - this.distanceTraveled) / this.maxDistance;
            };

            this.getDataObj = function() {
                var dObj = [{
                    vehicle_speed: this.speed,
                    engine_rpm: this.engineRPM,
                    run_time_since_start: this.timeSinceStart,
                    fuel_level: this.fuelLevel,
                    oil_temp: this.oilTemp,
                    accel_pos: this.accelPos,
                    dist_with_MIL: parseInt(this.distanceWithMIL)
                }];

                return dObj;
            };

            this.generateAlert = function(car) {
                var alert = [{
                    VIN: car.pk_vin,
                    timestamp: Date.now(),
                    trouble_code: "P0001"
                }];
                var pAlert = RestFactory.postAlerts(alert);
            }

        }

        function carTimeout(car) {

            car.setAccelPos(car.accelPos - 1);

            if(car.accelPos > (car.speed * 0.2)) {
                $timeout(blank, 2000).then(function(result){
                    carTimeout(car);
                });
            }
        }

        // Blank Function - Do Not Delete
        function blank() {}

        // Main Real Time Car Loop
        function carInternval() {

            // UPDATE LOGIC EACH TICK GOES HERE
            $rootScope.runningCars.forEach(function(runningCar){

                // Increment Time
                runningCar.methods.setTimeSinceStart(runningCar.methods.timeSinceStart++);

                updateData(runningCar);

                var dObj = runningCar.methods.getDataObj();
                dObj[0].VIN = runningCar.pk_vin;
                dObj[0].timestamp = Date.now();

                var postVehicleData = RestFactory.postVehicleData(dObj);
                postVehicleData.error(function(data){
                    console.log(data);
                });

            });

            function updateData(car) {
                var distancePerSecond = car.methods.speed / 60 / 60;

                if (car.methods.MIL) {
                    car.methods.setDistanceWithMIL(car.methods.distanceWithMIL + distancePerSecond);
                }
                car.methods.setDistanceTraveled(car, distancePerSecond);
                car.methods.setFuelLevel(100 * car.methods.fuelLevelDepreciation());
                car.methods.setOilTemp();
            }
        }
    }]);