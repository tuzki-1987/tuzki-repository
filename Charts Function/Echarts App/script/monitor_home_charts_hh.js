/**
* 混合图: 条形图、饼图 JS文件
* @description ECharts 实现
*
* @author ccq
**/


// 获取数据
var containerHeight = 0, datasL = 0;
function getMarketSch(flag) {
	var datas = null, callback = null;

    // 模拟接口数据
    if(flag == 0) {
	   callback = { 'ver' : '1.0' , 'ret' : true , 'errcode' : 0 , 'errmsg' : '' , 'data' : [{"id":1844,"filmId":1783,"filmName":"奇幻森林","scheduleRate":28.2,"sessionCount":46176,"scheduleDate":"2016-04-28","sourceId":2},{"id":1845,"filmId":1759,"filmName":"谁的青春不迷茫","scheduleRate":24,"sessionCount":39353,"scheduleDate":"2016-04-28","sourceId":2},{"id":1846,"filmId":1787,"filmName":"猎神：冬日之战","scheduleRate":18.4,"sessionCount":30066,"scheduleDate":"2016-04-28","sourceId":2},{"id":1847,"filmId":1764,"filmName":"我的新野蛮女友","scheduleRate":10.8,"sessionCount":17670,"scheduleDate":"2016-04-28","sourceId":2},{"id":1848,"filmId":1791,"filmName":"刑警兄弟","scheduleRate":6.7,"sessionCount":10958,"scheduleDate":"2016-04-28","sourceId":2},{"id":1849,"filmId":1765,"filmName":"伦敦陷落","scheduleRate":3.8,"sessionCount":6177,"scheduleDate":"2016-04-28","sourceId":2},{"id":1850,"filmId":1782,"filmName":"垫底辣妹","scheduleRate":1.6,"sessionCount":2625,"scheduleDate":"2016-04-28","sourceId":2},{"id":1851,"filmId":1784,"filmName":"冰河追凶","scheduleRate":1,"sessionCount":1605,"scheduleDate":"2016-04-28","sourceId":2},{"id":1852,"filmId":1682,"filmName":"火锅英雄","scheduleRate":0.9,"sessionCount":1441,"scheduleDate":"2016-04-28","sourceId":2},{"id":1853,"filmId":1785,"filmName":"恐怖照相机","scheduleRate":0.8,"sessionCount":1338,"scheduleDate":"2016-04-28","sourceId":2},{"id":1854,"filmId":0,"filmName":"其它","scheduleRate":3.8,"sessionCount":6289,"scheduleDate":"2016-04-28","sourceId":2}]};
    }

    if(flag == 1) {
       callback = { 'ver' : '1.0' , 'ret' : true , 'errcode' : 0 , 'errmsg' : '' , 'data' : [{'id':2098,'filmId':1789,'filmName':'北京遇上西雅图之不二情书','scheduleRate':37.1,'sessionCount':67795,'scheduleDate':'2016-05-02','sourceId':2},{'id':2099,'filmId':1783,'filmName':'奇幻森林','scheduleRate':18.6,'sessionCount':34122,'scheduleDate':'2016-05-02','sourceId':2},{'id':2100,'filmId':1780,'filmName':'梦想合伙人','scheduleRate':13.1,'sessionCount':24007,'scheduleDate':'2016-05-02','sourceId':2},{'id':2101,'filmId':1450,'filmName':'魔宫魅影','scheduleRate':10.8,'sessionCount':19830,'scheduleDate':'2016-05-02','sourceId':2},{'id':2102,'filmId':1571,'filmName':'大唐玄奘','scheduleRate':6.1,'sessionCount':11110,'scheduleDate':'2016-05-02','sourceId':2},{'id':2103,'filmId':1759,'filmName':'谁的青春不迷茫','scheduleRate':4.5,'sessionCount':8290,'scheduleDate':'2016-05-02','sourceId':2},{'id':2104,'filmId':1829,'filmName':'青蛙总动员','scheduleRate':2.7,'sessionCount':4985,'scheduleDate':'2016-05-02','sourceId':2},{'id':2105,'filmId':1825,'filmName':'阿里巴巴2所罗门封印','scheduleRate':2,'sessionCount':3682,'scheduleDate':'2016-05-02','sourceId':2},{'id':2106,'filmId':838,'filmName':'马小乐之玩具也疯狂','scheduleRate':1.7,'sessionCount':3141,'scheduleDate':'2016-05-02','sourceId':2},{'id':2107,'filmId':1787,'filmName':'猎神：冬日之战','scheduleRate':1,'sessionCount':1890,'scheduleDate':'2016-05-02','sourceId':2},{'id':2108,'filmId':0,'filmName':'其它','scheduleRate':2.2,'sessionCount':4094,'scheduleDate':'2016-05-02','sourceId':2}]};
    }

    if(flag == 2) {
       callback = { 'ver' : '1.0' , 'ret' : true , 'errcode' : 0 , 'errmsg' : '' , 'data' : [{"id":7508,"filmId":1840,"filmName":"美国队长3","scheduleRate":54.3,"sessionCount":78950,"scheduleDate":"2016-05-10","sourceId":2},{"id":7509,"filmId":1789,"filmName":"北京遇上西雅图之不二情书","scheduleRate":19.9,"sessionCount":28901,"scheduleDate":"2016-05-10","sourceId":2},{"id":7510,"filmId":1783,"filmName":"奇幻森林","scheduleRate":8.9,"sessionCount":12911,"scheduleDate":"2016-05-10","sourceId":2},{"id":7511,"filmId":1450,"filmName":"魔宫魅影","scheduleRate":3.9,"sessionCount":5662,"scheduleDate":"2016-05-10","sourceId":2},{"id":7512,"filmId":1780,"filmName":"梦想合伙人","scheduleRate":2.8,"sessionCount":4145,"scheduleDate":"2016-05-10","sourceId":2},{"id":7513,"filmId":1261,"filmName":"判我有罪","scheduleRate":1.9,"sessionCount":2694,"scheduleDate":"2016-05-10","sourceId":2},{"id":7514,"filmId":1865,"filmName":"百鸟朝凤","scheduleRate":1.6,"sessionCount":2339,"scheduleDate":"2016-05-10","sourceId":2},{"id":7515,"filmId":1759,"filmName":"谁的青春不迷茫","scheduleRate":1.5,"sessionCount":2248,"scheduleDate":"2016-05-10","sourceId":2},{"id":7516,"filmId":1571,"filmName":"大唐玄奘","scheduleRate":1.3,"sessionCount":1860,"scheduleDate":"2016-05-10","sourceId":2},{"id":7517,"filmId":1411,"filmName":"妄想症","scheduleRate":1.2,"sessionCount":1756,"scheduleDate":"2016-05-10","sourceId":2},{"id":7518,"filmId":0,"filmName":"其它","scheduleRate":2.7,"sessionCount":3898,"scheduleDate":"2016-05-10","sourceId":2}]};
    }

	if(callback.ret) {
		if(callback.data != "") {
            datas = callback.data;
            datasL = datas.length;
            if(datasL > 12) {
                containerHeight = datasL*47;
            }else if(datasL > 9 && datasL < 12) {
                containerHeight = datasL*51;
            }else {
                containerHeight = datasL*63;
            }
			$(".market-container").css({"width":"auto", "height":containerHeight+"px"});
			
            // 数据处理
			processHHChartData(datas);
		}else {
			$(".market-container").css({"width":"auto", "height":"auto"});
			$("#scheduleContainer").html("暂无数据");
			$(".container").css({"text-align":"center", "color":"#f30"});
		}
	}
}

/**
* 混合图 - 条形图、饼图
**/
function chartsOfHunHe(xAxisData, seriesData) {
	// 初始化echarts实例
	var hhCharts = hhCharts = echarts.init(document.getElementById("scheduleContainer"));

	// 指定图表的配置项和数据
    var option = {
        title: {
        	x: 'center',
            text: '大盘排期',
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
function processHHChartData(datas) {
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

	// 混合图(条形图、饼图)
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
    var containerWidth = $("#scheduleContainer").width();
    if(datasL > 12) {
        xPos = containerWidth*0.83;
        yPos = containerHeight*0.72;
    }else if(datasL > 9 && datasL < 12) {
        xPos = containerWidth*0.86;
        yPos = containerHeight*0.68;
    }else {
        xPos = containerWidth*0.885;
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

	$("#scheduleContainer").html("");
	chartsOfHunHe(xAxisData, seriesData);
}