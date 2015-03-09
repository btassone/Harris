harrisControllers.controller('SettingsCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $rootScope.activeLink = "settings";
        $scope.setup = true;
    }
]);