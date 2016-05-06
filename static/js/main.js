$(function () {
    categories = ["1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];

    var data2 = [
        {
            code3: 'CAN',
            value: 123,
        },
        {
            code3: 'BRA',
            value: 10000,
        },
        {
            code3: 'EGY',
            value: 15000,
        },
    ];

    var countries ={
        CAN:{
            code3: 'CAN',
            data: [
                [1991, 234],
                [1992, 345],
                [1994, 234],
                [1995, 23],
                [1999, 234],
                [2000, 123],
                [2004, 123],
                [2007, 23],
                [2013, 234],
            ]
        },
        BRA:{
            code3: 'BRA',
            data: [
                [2001, 5],
                [2005, 344],
                [2010, 56],
                [2015, 343],
            ]
        },
        EGY:{
            code3: 'EGY',
            data: [
                [2000, 1],
                [2005, 32],
                [2007, 543],
                [2016, 3],
            ]
        }
    };

    var countryChart;

    // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
    var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
    $.each(mapData, function () {
        this.id = this.properties['hc-key']; // for Chart.get()
        this.flag = this.id.replace('UK', 'GB').toLowerCase();
    });

    // Wrap point.select to get to the total selected points
    Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var points = mapChart.getSelectedPoints();

        if (points.length) {
            if (points.length === 1) {
                $('#country-info #flag').attr('class', 'flag ' + points[0].flag);
                $('#country-info h2').html(points[0].name);
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
            countryChart.redraw();

        } else {
            $('#country-info #flag').attr('class', '');
            $('#country-info h2').html('');
            $('#country-info .subheader').html('');
            if (countryChart) {
                countryChart = countryChart.destroy();
            }
        }

    });

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
            data : data2,
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

    // Pre-select a country
    mapChart.get('br').select();
});