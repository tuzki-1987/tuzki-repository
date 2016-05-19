/**
* 条形图JS文件
* @description Highcharts 实现
*
* @author ccq
**/


/**
* 条形图
**/
function chartsOfHBar(containerObj, xAxisData, seriesData) {
	$(containerObj).highcharts({
        chart: {
            type: 'bar'
        },
        credits: {enabled: false},
        title: {
            text: 'Hightcharts 实现的条形图'
        },
        xAxis: {
            categories: xAxisData
        },
        yAxis: {
        	title: {
        		text: ""
        	}
        },
        legend: {
            reversed: true
        },
        plotOptions: {
        	bar: {

        	},
        	series: {
                pointWidth: 15
            }
        },
        tooltip: {
            pointFormat: '实时票房: <b>{point.y}</b>'
        },
        series: seriesData
    });
}

/**
* 数据处理
*
* @param datas 接口数据
**/
function processBarChartData(datas, containerObj) {
	var datasL = datas.length;
	var tempDataArr = [];
	var xAxisData = [];
	var seriesData = [];

	// 处理图例个数(影片数量)
	for (var i = 0; i < datasL; i++) {
		tempDataArr = [];	// 每个图例初始数据为空
		var tempSerieaObj = {};	// 实例化每个图例

		// 确定X轴刻度值
		if(datas[i].filmName != "totalprice") {
			xAxisData[xAxisData.length] = datas[i].filmName;
		}

		// 处理数据个数(每个图例的, 非当前图例的数据为null)
		for (var j = 0; j < datasL; j++) {
			if(datas[j].filmName != "totalprice") {
				// 当前图例(j == i)
				if(j == i) {
					tempDataArr[j] = datas[j].totalPrice;
				}else {
					tempDataArr[j] = null;
				}

				tempSerieaObj = {
					"name": datas[i].filmName,
					"data": tempDataArr
				};
			}
		}

		// 排除非法数据的最终有效数据
		if(datas[i].filmName != "totalprice") {
			seriesData[i] = tempSerieaObj;
		}

		// 释放变量(内存)
		tempSerieaObj = null;
	}

	chartsOfHBar(containerObj, xAxisData, seriesData);

	// 释放变量(内存)
	tempDataArr = null;
	xAxisData = null;
	seriesData = null;
}
