/**
 * 本月累计 图表实现
 **/


/**
* 曲线图
*
* @param contnerObj 展示图表的容器ID（example:#ID）
* @param dataResult 图表数据集
* @param title 一级标题
* @param subTitle 二级标题
* @param yAxisTitle Y轴标题
* @param xAxisData X轴数据集
* @param seriesData 图表展现数据集。
* 数据类型1(未使用)：[{name:String, data:[int,int,int,...]}, {name:String, data:[int,int,int,...]},......]
* 说明：适合固定日期数据，数据列起始点默认一致，可通过设置data索引对应值为null来设置起始点或断点；X轴若为日期类型，则不能很好的实现自动计算；数据按Y轴伸缩
*
* 数据类型2(使用)：[{name:String, data:[Date.UTC(year, month, day), Number]}, {name:String, data:[Date.UTC(year, month, day), Number]}, ......]
* 说明：适合动态设定日期数据，数据列起始点是每组数据的起始时间（戳）；X轴若为日期类型，可以自动计算并展现数据；数据按X/Y轴伸缩
*
* @return
* */ 
function lineCharFunc(contnerObj, title, subTitle, yAxisTitle, xAxisData, seriesData){
	title = title.trim() == "" || title == undefined ? "" : title;
	subTitle = subTitle.trim() == "" || subTitle == undefined ? "" : subTitle;
    if(seriesData == "" || seriesData.length == 0)title = "暂无数据展示";

	$(contnerObj).highcharts({
        chart: {
            type: 'spline'
            //plotBackgroundImage: 'http://www.highcharts.com/demo/gfx/skies.jpg',
        },
        credits: {enabled: false},
        title: {
            text: title
        },
        subtitle: {
            text: subTitle
        },
        tooltip:{
            formatter: function(){
                return "<b>《" + this.series.name + "》</b><br /><b>" + Highcharts.dateFormat('%m-%d', this.x) + " : </b><b>" + this.y + "</b>";
            }
        },
        xAxis: {
            // tickmarkPlacement: 'on',     // X轴刻度对齐方式（between, on）
            startOnTick: false,
            type: 'datetime',
            labels: {
                formatter: function(){
                    // var d = new Date(this.value);
                    // var y = d.getFullYear();
                    // var m = d.getMonth() + 1;
                    // var day = d.getDate();
                    // if(m < 10)m = "0" + m;
                    // if(day < 10)day = "0" + day;
                    // var curDate = m+"-"+day;
                    return Highcharts.dateFormat('%m-%d', this.value);
                }
            }
            // categories: xAxisData
        },
        yAxis: {
            title: {
                text: yAxisTitle,
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

    var hideCharArr = [0, 3, 5, 6, 7]; // 定义初始隐藏的图例索引。从0开始
    var chartObj = $(contnerObj).highcharts();
    for (var i = 0; i < hideCharArr.length; i++) {
        var seriesObj = chartObj.series[hideCharArr[i]];
        seriesObj.hide();  //方式2(参数为空，默认为false) seriesObj.setVisible(); 设置默认隐藏的图例（两种方式）
    }

    // var xArr = chartObj.xAxis;
}


/**
* 饼图
*
* @param contnerObj 展示图表的容器ID（example:#ID）
* @param dataResult 图表数据集
* @param title 一级标题
* @param subTitle 二级标题
* @param seriesData 图表展现数据集。数据类型：[[String, int],[String, int],[String, int],...]
*
* @return
* */
function pieCharFunc(contnerObj, title, subTitle, seriesData){
    if(seriesData == "" || seriesData.length == 0)title = "暂无数据展示";
    
	$(contnerObj).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        credits: {enabled: false},
        title: {
            text: title
        },
        tooltip: {
            formatter: function(){  // 格式化提示框的数据
                var percentage = this.percentage;
                if(percentage.toString().length >= 4){
                    percentage = percentage.toFixed(1);
                }
                return "<b>《" + this.point.name + "》</b>  <b>" + percentage + "%</b>";
            },
            style: {
                paddingTop: 10
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>《{point.name}》</b> {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: false // 是否显示图例
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: seriesData
        }]
    });
}

/**
* 准备展示图表。根据接口数据，调用对应类型图表函数
*
* @param contnerObj 容器对象
* @param dataResult 数据集
* @param charType 图表类型（展示方式）
* @param title 一级标题
* @param subTitle 二级标题
* @param yAxisTitle Y轴标题
* @param pieCharDate 单日选项卡的日期值
*
* @return
* */
function showCharFunc(contnerObj, dataResult, charType, title, subTitle, yAxisTitle, pieCharDate){
	var dataObj = dataResult.data;

    if(dataObj != undefined){
        if(dataObj.length > 0){
            // 曲线图
            if(charType == "lineChar"){
                var returnObj = processDataFunc(charType, dataObj, pieCharDate);
                var xAxisData = returnObj.xAxDa;
                var seriesData = returnObj.serDa;

                lineCharFunc(contnerObj, title, subTitle, yAxisTitle, xAxisData, seriesData);
            }

            // 饼图
            if(charType == "pieChar"){
                var tempDate22 = pieCharDate;
                var returnObj = processDataFunc(charType, dataObj, pieCharDate);
                var seriesData = returnObj.serDa;

                pieCharFunc(contnerObj, title, subTitle, seriesData);
            }
        }else
            tipMsg_Single('mtShowBox', 0, "暂无数据展示", 0, '', '');
    }else{
        if(charType == "lineChar")
            lineCharFunc(contnerObj, title, subTitle, yAxisTitle, xAxisData, []);
        if(charType == "pieChar")
            pieCharFunc(contnerObj, title, subTitle, []);
    }
}

/**
* 数据处理（处理为对应图表类型所需要的数据，并返回）
*
* @param charType 图表类型
* @param processData 待处理数据
*
* @return Object
* */
function processDataFunc(charType, processData, pieCharDate){
    var returnObj = {};
    var xAxisData = [];
    var seriesData = [];
    var seriesDataArr = [];     // seriesData 的结果集（饼图）
    var seriesDataObj = {};    // seriesData 的结果集（曲线图）

    if (charType == "lineChar") {   // 处理曲线图数据
        for (var i = 0; i < processData.length; i++) {
            var seriesTempData = [];    //seriesDataObj 中data项的结果集（曲线图）
            
            var tempData = processData[i].data;
            for (var j = tempData.length -  1; j >= 0; j--) {   // 降序结果倒着取
                var seriesTempDataChild = [];   // seriesTempData 的子集（曲线图）
                var a_index = tempData.length - j -1;
                var tempSessionCount = tempData[j].sessionCount == 0 ? null : tempData[j].sessionCount; // 无数据时设为null，可设置曲线起始点
                
                var theShowDate = tempData[j].showDate;
                var theShowDateArr = theShowDate.split("-");
                theShowDateArr[1] = parseInt(theShowDateArr[1]) - 1;    // 月份减 1，因为UTC中的月份参数从0开始。与接口返回日期数据保持一致

                seriesTempDataChild[0] = Date.UTC(theShowDateArr[0], theShowDateArr[1], theShowDateArr[2]); // 返回日期的时间戳
                seriesTempDataChild[1] = tempSessionCount;

                seriesTempData[a_index] = seriesTempDataChild;
            }

            /*for (var j = 0; j < tempData.length; j++) {   // 升序结果正着取
                var tempSessionCount = tempData[j].sessionCount;
                var theShowDate = tempData[j].showDate;
                var theShowDateArr = theShowDate.split("-");
                seriesTempDataChild[0] = Date.UTC(theShowDateArr[0], theShowDateArr[1], theShowDateArr[2]); // 返回日期的时间戳
                seriesTempDataChild[1] = tempSessionCount;

                seriesTempData[j] = seriesTempDataChild;
            }*/

            seriesDataObj.name = processData[i].filmName;
            seriesDataObj.data = seriesTempData;

            seriesData[i] = seriesDataObj;
            seriesDataObj = {};     // 避免数据被冲刷
        }

        returnObj.xAxDa = xAxisData;
        returnObj.serDa = seriesData;
    }

    if (charType == "pieChar") {   // 处理饼图数据
        for (var i = 0; i < processData.length; i++) {
            var tempData = processData[i].data;
            for (var j = 0; j < tempData.length; j++) {
                if(tempData[j].showDate == pieCharDate){     // 取每部影片符合单日日期值的比率
                    var tempRate = (tempData[j].sessionCountRate)*100;
                    tempRate = tempRate == 0 ? null : tempRate.toString();
                    if(tempRate != null && tempRate.indexOf(".") != -1){
                        var tempRateArr = tempRate.split(".");
                        if(tempRateArr[1].length > 2)
                            tempRate = tempRateArr[0] + "." + tempRateArr[1].substring(0, 2);
                    }

                    var seriesDataArrInner = [];    // seriesDataArr 的具体值（饼图）
                    seriesDataArrInner[0] = processData[i].filmName;
                    seriesDataArrInner[1] = tempRate*1;
                    seriesDataArr[i] = seriesDataArrInner;
                }
            }
        }

        returnObj.serDa = seriesDataArr;
    }

    return returnObj;

    /*if (charType == "lineChar") {   // 处理基线图数据 - 数据类型1
        var curMonthEveryDay = getCurMonthEveryDay();
        
        for (var i = 0; i < processData.length; i++) {
            // xAxisData = [];     // 清空
            var seriesTempData = [];    //seriesDataObj 中data项的结果集（基线图）

            var tempData = processData[i].data;
            for (var j = tempData.length -  1; j >= 0; j--) {   // 降序结果倒着取
                var a_index = tempData.length - j -1;
                var tempSessionCount = tempData[j].sessionCount == 0 ? null : tempData[j].sessionCount; // 无数据时设为null，可设置曲线起始点
                seriesTempData[a_index] = tempSessionCount;
                var theShowDate = tempData[j].showDate;
                var theShowDateArr = theShowDate.split("-");
                xAxisData[a_index] = Date.UTC(theShowDateArr[0], theShowDateArr[1], theShowDateArr[2]);
            }

            /*for (var j = 0; j < tempData.length; j++) {   // 升序结果正着取
                seriesTempData[j] = tempData[j].sessionCount;
                xAxisData[j] = tempData[j].showDate;
            }*/

            /*seriesDataObj.name = processData[i].filmName;
            seriesDataObj.data = seriesTempData;

            seriesData[i] = seriesDataObj;
            seriesDataObj = {};     // 避免数据被冲刷
        }

        returnObj.xAxDa = xAxisData;
        returnObj.serDa = seriesData;
    }*/
}
