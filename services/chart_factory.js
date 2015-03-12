harrisApp.factory('ChartFactory',
    function() {
        return {
            // TODO: Refactor the base Object into a separate file?
            getCharts: function(cars, props, vData) {

                var charts = [];

                props.forEach(function(prop){

                    var propObjToPush = {
                        propName: prop
                    };
                    propObjToPush.chart = {};

                    var chart_data = {
                        "type": "line",
                        "title": {
                            "text": prop
                        },
                        "scale-x": {
                            "label": {
                                "text": "Instances"
                            }
                        },
                        "scale-y": {
                            "label": {
                                "text": prop
                            }
                        }
                    };
                    chart_data.series = [];

                    cars.forEach(function(car){
                        var carPropValues = [];

                        vData.forEach(function(data){
                            if(data.vin == car.pk_vin) {
                                carPropValues.push(data[prop]);
                            }
                        });

                        chart_data.series.push({
                            "values": carPropValues
                        });
                    });

                    propObjToPush.chart = chart_data;
                    charts.push(propObjToPush);
                });

                return charts;
            }
        }
    });