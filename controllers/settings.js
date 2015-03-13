harrisControllers.controller('SettingsCtrl', ['$rootScope', '$scope', '$http', 'RestFactory',
    function($rootScope, $scope, $http, RestFactory){

        function getCarList() {
            var carList = RestFactory.getVehicles();
            var list = [];

            carList.success(function (cList) {
                cList.forEach(function(car){
                    list.push(car);
                });
            });

            return list;
        }

        function deleteCarDataReset() {
            $scope.selectedCar = null;

            $scope.inputData.vin = "";
            $scope.inputData.model = "";
            $scope.inputData.make = "";
            $scope.inputData.year = "";
            $scope.inputData.description = "";
        }

        $rootScope.activeLink = "settings";
        $rootScope.pageTitle = "Settings";

        $scope.cars = getCarList();
        $scope.disableCars = false;
        $scope.selectedCar = null;

        $scope.inputData = {};
        $scope.inputData.vin = "";
        $scope.inputData.model = "";
        $scope.inputData.make = "";
        $scope.inputData.year = "";
        $scope.inputData.description = "";

        $scope.responseMessage = "";
        $scope.errorMessage = {};
        $scope.errorMessage.vin = "";
        $scope.errorMessage.message = "";

        $scope.selectCar = function(car) {
            $scope.selectedCar = car;

            $scope.inputData.vin = car.pk_vin;
            $scope.inputData.model = car.model;
            $scope.inputData.make = car.make;
            $scope.inputData.year = car.year;
            $scope.inputData.description = car.description;
        };

        $scope.saveCar = function(inputData) {

            var saveCar = RestFactory.putVehicle(inputData);
            saveCar.success(function(){
                $scope.errorMessage.vin = "";
                $scope.errorMessage.message = "";

                $scope.responseMessage = "Vehicle " + inputData.vin + " was successfully saved.";

                $scope.cars = getCarList();

                inputData.pk_vin = inputData.vin;
                $scope.selectedCar = inputData;
            }).error(function(data) {
                $scope.responseMessage = "";

                $scope.errorMessage.vin = inputData.vin;
                $scope.errorMessage.message = data.message;
            });
        };

        $scope.deleteCar = function(inputData) {
            var deleteCar = RestFactory.deleteVehicle(inputData.vin);
            deleteCar.success(function(){
                $scope.errorMessage.vin = "";
                $scope.errorMessage.message = "";

                $scope.responseMessage = "Vehicle " + inputData.vin + " was successfully deleted.";

                $scope.cars = getCarList();

                deleteCarDataReset();

            }).error(function(data){
                $scope.responseMessage = "";

                $scope.errorMessage.vin = inputData.vin;
                $scope.errorMessage.message = data.message;
            })
        };
    }
]);