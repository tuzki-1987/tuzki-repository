/**
 * @author ccq
 *
 * 本月累计 图表实现
 **/


/**
* 曲线图
*
* */ 
function lineCharFunc(contnerObj, title, subTitle, yAxisTitle, xAxisData, seriesData) {
	title = title.trim() == "" || title == undefined ? "" : title;
	subTitle = subTitle.trim() == "" || subTitle == undefined ? "" : subTitle;
    if((seriesData == "" || seriesData.length == 0) && title == ""){
        title = "暂无记录";
    }

	$(contnerObj).highcharts({
        chart: {
            backgroundColor: '#fff',
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
    if(seriesData != "" || seriesData.length > 0){  // 数据非空时
        var dataLength = seriesData.length; // 数据个数
        var randomDataLength;  // 随机数的范围(数据个数 )

        for (var i = 0; i < dataLength - 2; i++) {  // 随机显示两个图例
            randomDataLength = Math.random()*dataLength;
            var randomNum = parseInt(randomDataLength, 10); // 返回 范围内的 (10进制)随机整数
            var seriesObj = chartObj.series[randomNum]; // 随机隐藏
            seriesObj.hide();  //方式2(参数为空，默认为false) seriesObj.setVisible(); 设置默认隐藏的图例（两种方式）
        }
    }
}


/**
* 饼图
*
* */
function pieCharFunc(contnerObj, title, subTitle, seriesData) {
    title = title.trim() == "" || title == undefined ? "" : title;
    if((seriesData == "" || seriesData.length == 0) && title == ""){
        title = "暂无记录";
    }
    
	$(contnerObj).highcharts({
        chart: {
            backgroundColor: '#fff',
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
* 柱状图
*
**/
function columnCharFunc(contnerObj, showCharType, title, subTitle, yAxisTitle, xAxisData, seriesData) {
    title = title.trim() == "" || title == undefined ? "" : title;
    if((seriesData == "" || seriesData.length == 0) && title == ""){
        title = "暂无记录";
    }

    $(contnerObj).highcharts({
        chart: {
            backgroundColor: '#fafbfb',
            type: showCharType
        },
        credits: {enabled: false},
        title: {
            text: title
        },
        subtitle: {
            text: subTitle
        },
        xAxis: {
            categories: xAxisData,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '人次'
            }
        },
        tooltip: {
            format: '<span style="font-size:10px;padding-right:10px;">{point.key}</span>',
            pointFormat: '<span style="color:{series.color};padding:0;">{series.name}: </span>' +
                '<span>{point.y:.0f} 人次</span><br />',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: seriesData
    });
}

/**
* 准备展示图表。根据接口数据，调用对应类型图表函数
*
* */
function showCharFunc(contnerObj, dataResult, charType, showCharType, title, subTitle, yAxisTitle, pieCharDate) {
    var noDataHtml = "<img class='tip-light' src='images/tip.png'><span class='tip-text-nodata fs20 clr8'>暂无数据，您可在生成排片后查看</span>";

	var dataObj;   // 对应图表类型的数据对象
    if(charType == "lineChar"){ // 曲线图
        dataObj = dataResult.data;
    }
    if(charType == "pieChar"){  // 饼图
        dataObj = dataResult.one;
    }
    if(charType == "columnChar"){   // 柱状图
        dataObj = dataResult.data;
    }

    if(dataObj != undefined){
        if(dataObj.length > 0){
            $("#char_load").hide();
            $(".char-up").hide();
            
            // 曲线图
            if(charType == "lineChar"){
                var returnObj = processDataFunc(charType, dataObj, pieCharDate);
                var xAxisData = returnObj.xAxDa;
                var seriesData = returnObj.serDa;

                lineCharFunc(contnerObj, title, subTitle, yAxisTitle, xAxisData, seriesData);
            }

            // 饼图
            if(charType == "pieChar"){
                // var tempDate22 = pieCharDate;
                var returnObj = processDataFunc(charType, dataObj, pieCharDate);
                var seriesData = returnObj.serDa;

                pieCharFunc(contnerObj, title, subTitle, seriesData);
            }

            // 柱状图
            if(charType == "columnChar"){
                var returnObj = processDataFunc(charType, dataObj, pieCharDate);
                var xAxisData = returnObj.xAxDa;
                var seriesData = returnObj.serDa;

                columnCharFunc(contnerObj, showCharType, title, subTitle, yAxisTitle, xAxisData, seriesData);
            }
        }else{
            tipMsg_Single('mtShowBox', 0, "暂无数据展示", 0, '', '');
            $("#char_load").hide();
            $(".char-up").show();

            if(charType == "columnChar"){
                columnCharFunc(contnerObj, "column", title, subTitle, yAxisTitle, [], []);
                $("#chartContainer").html(noDataHtml);
            }
            $(contnerObj).highcharts().destroy();
        }
    }else{
        tipMsg_Single('mtShowBox', 0, "暂无数据展示", 0, '', '');
        $("#char_load").hide();
        $(".char-up").show();

        if(charType == "lineChar"){
            lineCharFunc(contnerObj, title, subTitle, yAxisTitle, xAxisData, []);
            $("#chartContainer").html(noDataHtml);
        }
        if(charType == "pieChar"){
            pieCharFunc(contnerObj, title, subTitle, []);
            $("#chartContainer").html(noDataHtml);
        }

        // 删除图表并清除内存, 以防止泄漏。另: 防止开启调试工具后, 拖动工具窗口时, (先查一次有数据, 再查一次无数据)无数据时仍会出现图表
        $(contnerObj).highcharts().destroy();
    }
}

/**
* 数据处理（处理为对应图表类型所需要的数据，并返回）
*
* */
function processDataFunc(charType, processData, pieCharDate) {
    var returnObj = {};
    var xAxisData = [];
    var seriesData = [];
    var seriesDataArr = [];     // seriesData 的结果集（饼图）
    var seriesDataObj = {};    // seriesData 的结果集（曲线图）

    // 处理曲线图数据
    if (charType == "lineChar") {
        for (var i = 0; i < processData.length; i++) {
            var seriesTempData = [];    //seriesDataObj 中data项的结果集（曲线图）
            
            var tempData = processData[i].data, tempDataL = tempData.length;
            for (var j = tempDataL - 1; j >= 0; j--) {   // 降序结果倒着取
                var seriesTempDataChild = [];   // seriesTempData 的子集（曲线图）
                var a_index = tempData.length - j -1;
                var tempSessionCount = tempData[j].item == 0 ? null : tempData[j].item; // 无数据时设为null，可设置曲线起始点
                
                var theShowDate = tempData[j].showDate;
                var theShowDateArr = theShowDate.split("-");
                theShowDateArr[1] = parseInt(theShowDateArr[1]) - 1;    // 月份减 1，因为UTC中的月份参数从0开始。与接口返回日期数据保持一致

                seriesTempDataChild[0] = Date.UTC(theShowDateArr[0], theShowDateArr[1], theShowDateArr[2]); // 返回日期的时间戳
                seriesTempDataChild[1] = tempSessionCount;

                seriesTempData[a_index] = seriesTempDataChild;
            }

            seriesDataObj.name = processData[i].filmName;
            seriesDataObj.data = seriesTempData;

            seriesData[i] = seriesDataObj;
            seriesDataObj = {};     // 避免数据被冲刷
        }

        returnObj.xAxDa = xAxisData;
        returnObj.serDa = seriesData;
    }

    // 处理饼图数据
    if (charType == "pieChar") {
        var seriesDataArrIndex = 0, processDataL = processData.length;
        for (var i = 0; i < processDataL; i++) {
            seriesDataArrIndex = seriesDataArr.length;
            // var tempData = processData[i].data;
            // for (var j = 0; j < tempData.length; j++) {
                if(processData[i].showDate == pieCharDate){     // 取每部影片符合单日日期值的比率
                    var tempRate = (processData[i].rate)*100;
                    tempRate = tempRate == 0 ? null : tempRate.toString();
                    if(tempRate != null && tempRate.indexOf(".") != -1){
                        var tempRateArr = tempRate.split(".");
                        if(tempRateArr[1].length > 2)
                            tempRate = tempRateArr[0] + "." + tempRateArr[1].substring(0, 2);

                        var seriesDataArrInner = [];    // seriesDataArr 的具体值（饼图）
                        seriesDataArrInner[0] = processData[i].filmName;
                        seriesDataArrInner[1] = tempRate*1;
                        seriesDataArr[seriesDataArrIndex] = seriesDataArrInner;
                    }else{
                        var seriesDataArrInner = [];    // seriesDataArr 的具体值（饼图）
                        seriesDataArrInner[0] = processData[i].filmName;
                        seriesDataArrInner[1] = tempRate*1;
                        seriesDataArr[seriesDataArrIndex] = seriesDataArrInner;
                    }
                }/*else{
                    seriesDataArr[i] = [null];
                }*/
            // }
        }

        returnObj.serDa = seriesDataArr;
    }

    // 处理柱状图数据
    if(charType == "columnChar") {
        var processDataL = processData.length, filmL = columnCharFilm.length;

        for(var t = 0; t < processDataL; t++) {
            xAxisData[t] = processData[t].showTime;
        }
        returnObj.xAxDa = xAxisData;

        for(var j = 0; j < filmL; j++) {
            for(var i = 0; i < processDataL; i++) {
                var tempObj = {}, tempData = [];   // seriesData 的结果集, 影片数据集

                // 结果集中已包含该影片
                if(seriesData[j] != undefined) {
                    tempObj = seriesData[j];
                    tempData = tempObj.data;

                    if(processData[i].filmId == columnCharFilm[j]) {  // 当前影片
                        if(tempObj.name == "") {    // 设置影片名
                            tempObj.name = processData[i].filmName;
                        }
                        tempData[tempData.length] = processData[i].totalTicketCount;
                    }else { // 非当前影片
                        tempData[tempData.length] = null;
                    }
                }else {
                    // 结果集中未包含该影片
                    if(processData[i].filmId == columnCharFilm[j]) {  // 当前影片
                        tempData[0] = processData[i].totalTicketCount;
                        tempObj.name = processData[i].filmName;
                    }else { // 非当前影片
                        tempData[0] = null;
                        tempObj.name = "";
                    }
                    
                }

                tempObj.data = tempData;
                seriesData[j] = tempObj;

            }
        }

        returnObj.serDa = seriesData;
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
