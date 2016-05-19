/*
 * 折线图
 *
 * @author ccq
 */


/**
* 折线图
*
* @param container 图表容器ID
* @param title 图表标题
* @param subTitle Y轴标题
* @param xAxisData X轴数据
* @param seriesData 图表数据
**/
function drawLineChart(container, title, yTitle, xAxisData, seriesData) {
	$(container).highcharts({
        chart: {
            backgroundColor: '#fafbfb'
            //plotBackgroundImage: 'http://www.highcharts.com/demo/gfx/skies.jpg',
        },
        credits: {enabled: false},
        title: {
            text: title
        },
        subtitle: {
            text: ""
        },
        tooltip:{
            formatter: function(){
                return "<b>" + this.series.name + "</b><br /><b>" + this.x + " min : </b><b>" + this.y + "</b>";
            }
        },
        xAxis: {
            categories: xAxisData
        },
        yAxis: {
            title: {
                text: yTitle,
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        plotOptions: {
            spline: {
                dataLabels: {
                    shape: 'callout'
                },
                marker: {
                    enabled: true
                }
            }
        },
        series: seriesData
    });
}

/**
* 数据处理
*
* @param container 图表容器ID
* @param title 图表标题
* @param subTitle Y轴标题
* @param datas 展示图表数据源
**/
function dealDataFunc(container, title, subTitle, datas) {
    var xAxisData = [];
    var seriesData = [];
    var realData = [];
    var sysData = [];
    var seriesDataObj1 = {};
    var seriesDataObj2 = {};
    var datasL = datas.length;

    for (var i = 0; i < datasL; i++) {
        xAxisData[xAxisData.length] = datas[i].diffDate;
        realData[realData.length] = datas[i].realCount;
        sysData[sysData.length] = datas[i].sysCount;
    }

    seriesDataObj1.name = "影院频率";
    seriesDataObj1.data = realData;
    seriesDataObj2.name = "系统频率";
    seriesDataObj2.data = sysData;

    seriesData[0] = seriesDataObj1;
    seriesData[1] = seriesDataObj2;

    drawLineChart(container, title, subTitle, xAxisData, seriesData);

    // 清空释放
    xAxisData = null;
    seriesData = null;
    realData = null;
    sysData = null;
    seriesDataObj1 = null;
    seriesDataObj2 = null;
}