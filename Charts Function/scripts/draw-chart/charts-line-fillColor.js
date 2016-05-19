/*
 * 折线图 - 填充背景色、设置背景透明度、设置变色、图例颜色
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
function drawLineChartOfAll(container, title, yTitle, xAxisData, seriesData) {
	$(container).highcharts({
		chart: {
            type: 'area'	// 去掉则无背景
            //plotBackgroundImage: 'http://www.highcharts.com/demo/gfx/skies.jpg',
        },
        credits: {enabled: false},
        title: {
            text: title
        },
        subtitle: {
            text: ""
        },
        legend: {},
        tooltip:{
            formatter: function(){
                return "<b>" + this.series.name + "</b><br />开始时间 : " + this.x + "<br />场间间隔 : " + this.y + " min";
            }
        },
        xAxis: {
            categories: xAxisData
        },
        yAxis: {
            title: {
                text: yTitle,
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        plotOptions: {
            series: {
            	// fillOpacity: 0.5
            }
        },
        series: seriesData
	});
}

/**
* 总场次数据处理
* @description 处理各区段(实例)数据, 用处理完的数据组合实现图表。数据采用后连接的方式, 
* 即每个实例的数据的最后一个值, 是后一个实例的第一个值; 从第二个实例开始, 其数据数组都前置N
* (N=前一个实例的数据个数)个null, 以此实现折线的连续性
*
* @param container 图表容器ID
* @param title 图表标题
* @param subTitle Y轴标题
* @param datas 展示图表数据源
**/
function dealDataFuncOfAll(container, title, yTitle, datas) {
	var xAxisData = [];
    var seriesData = [];
    var dataArr0 = [];	// 上午普通场
    var dataArr1 = [];	// 下午黄金场
    var dataArr2 = [];	// 下午普通场
    var dataArr3 = [];	// 晚上黄金场
    var dataArr4 = [];	// 晚场普通场
    var tempDataArr = [];
    var seriesDataObj0 = {};
    var seriesDataObj1 = {};
    var seriesDataObj2 = {};
    var seriesDataObj3 = {};
    var seriesDataObj4 = {};
    var datasL = datas.length;
    var num = 0;
    var dataLen = 0;	// 累计每个实例数据的长度, 作为插入null的个数的基础数据

    // 处理各区段数据
    for(var i = 0; i < datasL; i++) {
    	xAxisData[xAxisData.length] = datas[i].diffDate;

    	if(datas[i].diffDate < "13:00") {
    		// morning general
    		dataArr0[dataArr0.length] = datas[i].realCount;
    	}

    	if(datas[i].diffDate >= "13:00" && datas[i].diffDate < "17:00") {
    		// afternoon gold
    		dataArr1[dataArr1.length] = datas[i].realCount;
    	}

    	if(datas[i].diffDate >= "17:00" && datas[i].diffDate < "19:00") {
    		// afternoon general
    		dataArr2[dataArr2.length] = datas[i].realCount;
    	}

    	if(datas[i].diffDate >= "19:00" && datas[i].diffDate < "21:30") {
    		// night gold
    		dataArr3[dataArr3.length] = datas[i].realCount;
    	}

    	if(datas[i].diffDate >= "21:30") {
    		// night general
    		dataArr4[dataArr4.length] = datas[i].realCount;
    	}
    }

    // 依次处理各区段数据, 使其符合图表实例数据格式
    if(dataArr0.length > 0) {
    	if(dataArr1.length > 0)
    		dataArr0[dataArr0.length] = dataArr1[0];
    	else if(dataArr2.length > 0)
    		dataArr0[dataArr0.length] = dataArr2[0];
    	else if(dataArr3.length > 0)
    		dataArr0[dataArr0.length] = dataArr3[0];
    	else if(dataArr4.length > 0)
    		dataArr0[dataArr0.length] = dataArr4[0];
    	
    	seriesDataObj0 = {
			name: '上午普通场',
			color: 'rgba(132,190,246, 0.5)',
			data: dataArr0,
			lineColor: '#7cb5ec',
			fillColor: 'rgba(132,190,246, 0.5)'
			// fillOpacity: 0.1		// API description : Fill opacity for the area. Note that when you set an explicit fillColor, the fillOpacity is not applied. Instead, you should define the opacity in the fillColor with an rgba color definition.
		};

		seriesData[seriesData.length] = seriesDataObj0;
		dataLen = dataArr0.length - 1;
    }
    
    if(dataArr1.length > 0) {
    	if(dataArr2.length > 0)
    		dataArr1[dataArr1.length] = dataArr2[0];
    	else if(dataArr3.length > 0)
    		dataArr1[dataArr1.length] = dataArr3[0];
    	else if(dataArr4.length > 0)
    		dataArr1[dataArr1.length] = dataArr4[0];

    	// 前一个实例数据不为空, 前置null
		if(dataLen > 0) {
			tempDataArr = insertNullForSeriesData(dataLen, dataArr1);
		}else {
			tempDataArr = dataArr1;
		}
		dataLen = tempDataArr.length - 1;

	    seriesDataObj1 = {
	    	name: '下午黄金场',
	    	color: 'rgba(251,219,76, 0.5)',
			data: tempDataArr,
			lineColor: '#face06',
			fillColor: 'rgba(251,219,76, 0.5)'
			// fillOpacity: 0.1
	    };
	    tempDataArr = [];

	    seriesData[seriesData.length] = seriesDataObj1;
	}

	if(dataArr2 != null) {
		if(dataArr3.length > 0)
    		dataArr2[dataArr2.length] = dataArr3[0];
    	else if(dataArr4.length > 0)
    		dataArr2[dataArr2.length] = dataArr4[0];
		
		if(dataLen > 0) {
			tempDataArr = insertNullForSeriesData(dataLen, dataArr2);
		}else {
    		tempDataArr = dataArr2;
    	}
    	dataLen = tempDataArr.length - 1;

	    seriesDataObj2 = {
	    	name: '下午普通场',
	    	color: 'rgba(132,190,246, 0.5)',
			data: tempDataArr,
			lineColor: '#7cb5ec',
			fillColor: 'rgba(132,190,246, 0.5)'
			// fillOpacity: 0.1
	    };
	    tempDataArr = [];

	    seriesData[seriesData.length] = seriesDataObj2;
	}

	if(dataArr3 != null) {
		if(dataArr4.length > 0)
    		dataArr3[dataArr3.length] = dataArr4[0];

    	if(dataLen > 0) {
    		tempDataArr = insertNullForSeriesData(dataLen, dataArr3);
    	}else {
    		tempDataArr = dataArr3;
    	}
    	dataLen = tempDataArr.length - 1;

		seriesDataObj3 = {
			name: '晚上黄金场',
			color: 'rgba(251,219,76, 0.5)',
			data: tempDataArr,
			lineColor: '#face06',
			fillColor: 'rgba(251,219,76, 0.5)'
			// fillOpacity: 0.1
		};
		tempDataArr = [];

		seriesData[seriesData.length] = seriesDataObj3;
	}
    
    if(dataArr4 != null) {
    	if(dataLen > 0) {
    		tempDataArr = insertNullForSeriesData(dataLen, dataArr4);
    	}else {
    		tempDataArr = dataArr4;
    	}

    	seriesDataObj4 = {
    		name: '晚上普通场',
    		color: 'rgba(132,190,246, 0.5)',
			data: tempDataArr,
			lineColor: '#7cb5ec',
			fillColor: 'rgba(132,190,246, 0.5)'
			// fillOpacity: 0.1
    	};
    	tempDataArr = [];

    	seriesData[seriesData.length] = seriesDataObj4;
    }

    drawLineChartOfAll(container, title, yTitle, xAxisData, seriesData);
    // 清空释放
    xAxisData = null;
	seriesData = null;
	dataArr0 = null;
	dataArr1 = null;
	dataArr2 = null;
	dataArr3 = null;
	dataArr4 = null;
	tempDataArr = null;
	seriesDataObj0 = null;
	seriesDataObj1 = null;
	seriesDataObj2 = null;
	seriesDataObj3 = null;
	seriesDataObj4 = null;
}

/*
* 添加null
* @description 为实例数据添加N个null
*
* @param arrLen 前一个实例数据的长度
* @param tempDataArr 要处理的实例数据
*
* @return 实例数据数组
*/
function insertNullForSeriesData(arrLen, tempDataArr) {
	for (var i = 0; i < arrLen; i++) {
		tempDataArr.unshift(null);
	}

	return tempDataArr;
}