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
                    propObjToPush.error = {};
                    propObjToPush.error.hasOne = false;
                    propObjToPush.error.vins = [];

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
                        var hasError = true;

                        vData.forEach(function(data){
                            if(data.vin == car.pk_vin) {
                                carPropValues.push(data[prop]);
                                hasError = false;
                            }
                        });

                        if(hasError) {
                            propObjToPush.error.hasOne = true;
                            propObjToPush.error.vins.push(car.pk_vin);
                        }

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