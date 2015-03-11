harrisControllers.controller('SettingsCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http){
        $rootScope.activeLink = "settings";
        $rootScope.pageTitle = "Settings";
        $scope.setup = true;
    }
]);