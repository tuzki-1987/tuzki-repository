/**
* 混合图: 条形图、饼图 JS文件
* @description ECharts 实现
*
* @author ccq
**/


/**
* 混合图 - 条形图、饼图
**/
function chartsOfHunHe(xAxisData, seriesData, echart) {
	// 初始化echarts实例
	var hhCharts = echart.init(document.getElementById("barAndPieChartContainer"));

	// 指定图表的配置项和数据
    var option = {
        title: {
        	x: 'center',
            text: '条形图与饼图混合',
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
    hhCharts.setOption(option);
}

/**
* 数据处理(图表数据)
*
* @param datas 接口数据
**/
function processHHChartData(datas, echart) {
	var datasL = datas.length;
	// 每个条形对象的data值(唯一值:当前影片值)
	var tempBarDataArr = [];
	// 每个条形对象值
	var tempBarDataObj = {};
	// 饼图data的每个对象值
	var tempPieDataObj = {};
	// 饼图data值
	var tempPieDataArr = [];
	// 饼图最终数据
	var pieDataFinal = {};
	// 图例值
	var xAxisData = [];
	// 最终数据集
	var seriesData = [];
	// 容器高度
	var containerHeight = 0, datasL = datas.length;

	// 计算容器高度
	if(datasL > 12) {
		containerHeight = datasL*47;
	}else if(datasL > 9 && datasL < 12) {
		containerHeight = datasL*51;
	}else {
		containerHeight = datasL*63;
	}
	$(".market-container").css({"width":"auto", "height":containerHeight+"px"});

	// 混合图(条形图、饼图)
	for (var i = 0; i < datasL; i++) {
		// 清空上次数据, 避免数据累积; 目的是确保每次只存当前影片一个场次值
		tempBarDataArr = [];

		// 排除非法数据
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

			// 饼图数据
			tempPieDataObj = {
				value: datas[i].sessionCount,
				name: datas[i].filmName
			};
			tempPieDataArr[tempPieDataArr.length] = tempPieDataObj;

			// 储存数据
			seriesData[seriesData.length] = tempBarDataObj;
		}
	}

	// 饼图最终数据
    var xPos = 0, yPos = 0;
    var containerWidth = $("#barAndPieChartContainer").width();
    if(datasL > 12) {
        xPos = containerWidth*0.847;
        yPos = containerHeight*0.72;
    }else if(datasL > 9 && datasL < 12) {
        xPos = containerWidth*0.877;
        yPos = containerHeight*0.68;
    }else {
        xPos = containerWidth*0.897;
        yPos = containerHeight*0.6;
    }
    
	pieDataFinal = {
        name: '排期占比',
        type: 'pie',
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}场 ({d}%)"
        },
        center: [xPos, yPos],
        radius : ['30%', '20%'],
        hoverAnimation: false,
        itemStyle : {
            normal : {
                label : {
                    show : false
                },
                labelLine : {
                    show : false
                }
            }
        },
        
        data:tempPieDataArr
    };

    // 最终数据集
    seriesData[seriesData.length] = pieDataFinal;

	chartsOfHunHe(xAxisData, seriesData, echart);
}
