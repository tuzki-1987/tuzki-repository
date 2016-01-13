$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                '13:30',
                '20:50',
                '20:00',
                '15:20',
                '15:10',
                '14:10'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (人次)'
            }
        },
        tooltip: {
            format: '<span style="font-size:10px;padding-right:10px;">{point.key}</span>',
            pointFormat: '<span style="color:{series.color};padding:0;">{series.name}: </span>' +
                '<span>{point.y:.1f} 人次</span><br />',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '捉妖记',
            data: [90, null, 88, null, null, null]

        }, {
            name: '黑猫警长之翡翠之星',
            data: [null, 87, 83, null, 82, 79]

        }, {
            name: '破风',
            data: [null, null, null, 82, null, null]

        }]
    });
});