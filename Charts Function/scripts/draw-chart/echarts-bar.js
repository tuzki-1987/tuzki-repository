/**
* 条形图JS文件
* @description ECharts 实现
*
* @author ccq
**/


/**
* 混合图 - 条形图、饼图(大盘排期数据)
**/
function chartsOfEBar(xAxisData, seriesData, echart) {
	// 初始化echarts实例
	var EBarCharts = echart.init(document.getElementById("barChartContainerEC"));

	// 指定图表的配置项和数据
    var option = {
        title: {
        	x: 'center',
            text: 'ECharts 实现的条形图',
            textStyle: {
            	// fontFamily: '微软雅黑',
            	fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: true,
            y: 'bottom',
            data: xAxisData
        },
        grid: {
            x: 150,
            x2: 50,
            bottom: '80',
            height: 'auto'
        },
        xAxis: {
            type: 'value',
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    color: '#000',
                    type: 'solid',
                    width: 0.2
                }
            },
            axisLabel: {
                textStyle: {
                    fontFamily: '微软雅黑',
                    fontWeight: 'normal'
                }
            },
            axisTick: {
                // X轴刻度
                show: false
            }
        },
        yAxis: {
            'type':'category',
            axisLabel: {
                textStyle: {
                    fontFamily: '微软雅黑',
                    fontWeight: 'normal'
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                // Y轴刻度
                show: false
            },
            splitLine: {
                show: false
            },
            data: []
        },
        series: seriesData
    };

    // 使用以上指定的配置项和数据显示图表
    EBarCharts.setOption(option);
}

/**
* 数据处理(图表数据)
*
* @param datas 接口数据
**/
function processEBarChartData(datas, echart) {
	var datasL = datas.length;
	// 每个条形对象的data值(唯一值:当前影片值)
	var tempBarDataArr = [];
	// 每个条形对象值
	var tempBarDataObj = {};
	// 图例值
	var xAxisData = [];
	// 最终数据集
	var seriesData = [];

	// 条形图
	for (var i = 0; i < datasL; i++) {
		// 清空上次数据, 避免数据累积; 目的是确保每次只存当前影片一个场次值
		tempBarDataArr = [];

		// 排除非法数据(即汇总数据)
		if(datas[i].filmName != "totalprice") {
			xAxisData[xAxisData.length] = datas[i].filmName;
			
			// 条形图数据
			tempBarDataArr[tempBarDataArr.length] = datas[i].sessionCount;
			tempBarDataObj = {
                name: datas[i].filmName,
                type: 'bar',
                itemStyle: {
                    normal: {
                        label: {
                            'show': true,
                            'position': 'outside',
                            'formatter': '{a}'
                        }
                    }
                },
                tooltip: {
                    formatter: '{a} : {c} 场'
                },
                barGap: '90%',
                barWidth: 20,
                data: tempBarDataArr
            };

			// 储存数据
			seriesData[seriesData.length] = tempBarDataObj;
		}
	}

	chartsOfEBar(xAxisData, seriesData, echart);
}
