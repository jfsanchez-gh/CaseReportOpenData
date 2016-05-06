$(function () {
    var countryChart, barChart, scatterChart;

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
            $('.country-info #flag').attr('class', 'flag ' + points[0].flag);
            $('.country-info h2').html(points[0].name);
        } else if (length === 0) {
            $('.country-info #flag').attr('class', 'flag _United_Nations');
            $('.country-info h2').html('All the World');

        } else {
            $('.country-info #flag').attr('class', 'flag');
            $('.country-info h2').html('Comparing countries');

        }

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
                data: world,
                type: 'area',
                color: "#444444"
            }, false);
        }
        countryChart.redraw();

        if (!barChart) {
            barChart = $('#bar-chart').highcharts({
                title: {
                    text: null
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: bar_chart_categories
                },
            }).highcharts();
        }

        var seriesLength = barChart.series.length;

        if (points.length > 0){
            for(var i = seriesLength - 1; i > -1; i--)
            {
                barChart.series[i].remove();
            }

            var ages = ['Childs', 'Teenagers', 'Adults', 'Old'];
            var pae = [];

            $.each(points, function (i) {
                for (j = 0; j < countries_values[this.code3].length; j++){
                    barChart.addSeries(
                        {
                            type: 'column',
                            name: points.length > 1 ? ages[j]+'('+this.name+')' : ages[j],
                            data: countries_values[this.code3][j]
                        }
                    );
                }

                for (j = 0; j < countries_totals[this.code3].length; j++){
                    pae.push(
                        {
                            name: points.length > 1 ? ages[j]+'('+this.name+')' : ages[j],
                            y: countries_totals[this.code3][j],
                        }
                    );
                }
            });
            barChart.addSeries(
                {
                    type: 'pie',
                    name: 'Total of cases',
                    data: pae,
                    center: [100, 80],
                    size: 100,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }
            );
        }
        else{
            for(var i = seriesLength - 1; i > -1; i--)
            {
                barChart.series[i].remove();
            }
            var ages = ['Childs', 'Teenagers', 'Adults', 'Old'];
            for (i = 0; i < bar_chart_data.length; i++){
                barChart.addSeries(
                    {
                        type: 'column',
                        name: ages[i],
                        data: bar_chart_data[i]
                    }
                );
            }

            var pae = [];
            for (i = 0; i < bar_chart_totals.length; i++){
                pae.push(
                    {
                        name: ages[i],
                        y: bar_chart_totals[i],
                    }
                );
            }
            barChart.addSeries(
                {
                    type: 'pie',
                    name: 'Total of cases',
                    data: pae,
                    center: [100, 80],
                    size: 100,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }
            );
        }
        barChart.redraw();

        if (!scatterChart) {
            scatterChart = $('#scatter-chart').highcharts({
                chart: {
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {
                    text: null
                },
                subtitle: {
                    text: null
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        text: null
                    },
                    type: 'datetime',
                },
                yAxis: {
                    title: {
                        text: 'Age(years)'
                    }
                },
                legend: {
                    enabled:false,
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '',
                            pointFormat: 'Age: {point.y}; Date: {point.x}'
                        }
                    }
                },
            }).highcharts();
        }

        var seriesLength = scatterChart.series.length;

        if (points.length > 0){
            /*for(var i = seriesLength - 1; i > -1; i--)
            {
                if(scatterChart.series[i].name == 'World')
                    scatterChart.series[i].remove();
            }
            $.each(points, function (i) {
                // Update
                if (scatterChart.series[i]) {
                    scatterChart.series[i].update({
                        name: this.name,
                        data: countries[this.code3].data,
                        type: points.length > 1 ? 'line' : 'area'
                    }, false);
                } else {
                    scatterChart.addSeries({
                        name: this.name,
                        data: countries[this.code3].data,
                        type: points.length > 1 ? 'line' : 'area'
                    }, false);
                }
            });
            while (scatterChart.series.length > points.length) {
                scatterChart.series[scatterChart.series.length - 1].remove(false);
            }*/
        }
        else{
            for(var i = seriesLength - 1; i > -1; i--)
            {
                scatterChart.series[i].remove();
            }
            scatterChart.addSeries({
                name: 'Deads',
                data: scatter_total,
                color: "rgba(223, 83, 83, .5)"
            }, false);
        }
        scatterChart.redraw();



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
            enableMouseWheelZoom: false,
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
});

