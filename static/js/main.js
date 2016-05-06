$(function () {
    var countryChart;

    // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
    var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
    $.each(mapData, function () {
        this.id = this.properties['hc-key']; // for Chart.get()
        this.flag = this.id.replace('UK', 'GB').toLowerCase();
    });

    // Wrap point.select to get to the total selected points
    Highcharts.wrap(Highcharts.Point.prototype, 'select', onChange);

    function onChange(proceed) {
        if (proceed)
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var points = mapChart.getSelectedPoints();

        var length = points.length;

        //if (points.length) {
        if (length === 1) {
            $('#country-info #flag').attr('class', 'flag ' + points[0].flag);
            $('#country-info h2').html(points[0].name);
        } else if (length === 0) {
            $('#country-info #flag').attr('class', 'flag');
            $('#country-info h2').html('All World');

        } else {
            $('#country-info #flag').attr('class', 'flag');
            $('#country-info h2').html('Comparing countries');

        }
        $('#country-info .subheader').html('<h4>Case history</h4><small><em>Shift + Click on map to compare countries</em></small>');

        if (!countryChart) {
            countryChart = $('#country-chart').highcharts({
                chart: {
                    height: 250,
                    spacingLeft: 0,
                    zoomType: 'x',
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: null
                },
                subtitle: {
                    text: null
                },
                xAxis: {
                    tickPixelInterval: 50,
                    crosshair: true,
                },
                yAxis: {
                    title: 'number of cases',
                    opposite: true,
                    crosshair: true,
                },
                tooltip: {
                    shared: true
                },
                colors: ['#444444', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                plotOptions: {
                    series: {
                        animation: {
                            duration: 500
                        },
                        marker: {
                            //enabled: false
                        },
                        threshold: 0,
                        area: {
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    }
                }
            }).highcharts();
        }

        var seriesLength = countryChart.series.length;

        if (points.length > 0){
            for(var i = seriesLength - 1; i > -1; i--)
            {
                if(countryChart.series[i].name == 'World')
                    countryChart.series[i].remove();
            }
            $.each(points, function (i) {
                // Update
                if (countryChart.series[i]) {
                    countryChart.series[i].update({
                        name: this.name,
                        data: countries[this.code3].data,
                        type: points.length > 1 ? 'line' : 'area'
                    }, false);
                } else {
                    countryChart.addSeries({
                        name: this.name,
                        data: countries[this.code3].data,
                        type: points.length > 1 ? 'line' : 'area'
                    }, false);
                }
            });
            while (countryChart.series.length > points.length) {
                countryChart.series[countryChart.series.length - 1].remove(false);
            }
        }
        else{
            for(var i = seriesLength - 1; i > -1; i--)
            {
                countryChart.series[i].remove();
            }
            countryChart.addSeries({
                name: 'World',
                data: [[1991,123],[2000,500]],
                type: 'area',
                color: "#444444"
            }, false);
        }
        countryChart.redraw();

        /*} else {
         $('#country-info #flag').attr('class', '');
         $('#country-info h2').html('');
         $('#country-info .subheader').html('');
         if (countryChart) {
         countryChart = countryChart.destroy();
         }
         }*/

    }

    // Initiate the map chart
    mapChart = $('#main-world').highcharts('Map', {
        title : {
            text : 'Zika, Dengue and Chicungunya cases around the world'
        },
        subtitle: {
            text: ''
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        colorAxis: {
            type: 'linear',
            endOnTick: false,
            startOnTick: false,
            min: 0,
            max:20000,
            minColor: '#00c853',
            maxColor: '#ff3d00'
        },
        tooltip: {
            footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
        },
        credits: {
            enabled: false
        },
        series : [{
            data : data,
            mapData: mapData,
            joinBy: ['iso-a3', 'code3'],
            name: 'Amount of cases',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: '#444444',
                    borderColor: '#333333',
                    dashStyle: 'shortdot'
                }
            }
        }]
    }).highcharts();

    onChange(false);

    // Pre-select a country
    //mapChart.get('br').select();
});