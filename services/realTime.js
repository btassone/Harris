harrisApp.service('RealTimeResultsService', ['$http', 'RestFactory',
    function($http, RestFactory) {
        return {
            rowifyData: function(data) {
                var colMax = 4;
                var rowMax = parseInt(data.length / colMax);
                var totalCount = 0;
                var results = [];

                for(var i = 0; i <= rowMax; i++) {
                    var cols = [];

                    for(var g = 0; g < colMax; g++) {
                        if(data[totalCount]) {
                            cols.push(data[totalCount]);
                            totalCount++;
                        }
                    }
                    results.push(cols);
                }

                return results;
            }
        }
    }]);