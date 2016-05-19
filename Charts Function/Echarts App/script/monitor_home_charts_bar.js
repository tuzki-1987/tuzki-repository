/**
* 条形图JS文件
* @description Highcharts 实现
*
* @author ccq
**/


// 获取数据
function getMarketBoxOffice() {
	var datas = null, containerObj = $("#boxOfficeContainer");

	var callback = { 'ver' : '1.0' , 'ret' : true , 'errcode' : 0 , 'errmsg' : '' , 'data' : [{"sourceId":2,"filmId":1789,"filmName":"北京遇上西雅图之不二情书","totalPrice":8446,"sumTotalPrice":43804,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1783,"filmName":"奇幻森林","totalPrice":5067,"sumTotalPrice":90619,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1450,"filmName":"魔宫魅影","totalPrice":1190,"sumTotalPrice":6399,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1780,"filmName":"梦想合伙人","totalPrice":937,"sumTotalPrice":6135,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1571,"filmName":"大唐玄奘","totalPrice":498,"sumTotalPrice":2309,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1759,"filmName":"谁的青春不迷茫","totalPrice":486,"sumTotalPrice":17042,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1829,"filmName":"青蛙总动员","totalPrice":217,"sumTotalPrice":692,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1787,"filmName":"猎神：冬日之战","totalPrice":153,"sumTotalPrice":10397,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1825,"filmName":"阿里巴巴2所罗门封印","totalPrice":130,"sumTotalPrice":399,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":838,"filmName":"马小乐之玩具也疯狂","totalPrice":128,"sumTotalPrice":586,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1791,"filmName":"刑警兄弟","totalPrice":97,"sumTotalPrice":2758,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1765,"filmName":"伦敦陷落","totalPrice":65,"sumTotalPrice":33909,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1782,"filmName":"垫底辣妹","totalPrice":27,"sumTotalPrice":3704,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1764,"filmName":"我的新野蛮女友","totalPrice":8,"sumTotalPrice":3394,"statisticsDate":"2016-05-02"},{"sourceId":2,"filmId":1682,"filmName":"火锅英雄","totalPrice":5,"sumTotalPrice":37050,"statisticsDate":"2016-05-02"}]};

	// 动态数据
	// server.loadMarketBoxOffice(sourceId, date, function(callback) {
	if(callback.ret) {
		if(callback.data != "") {
			datas = callback.data;
			
			processBarChartData(datas, containerObj);
		}else {
			containerObj.html("暂无数据");
			$(".container").css({"text-align":"center", "color":"#f30"});
		}
	}
	// });
}

/**
* 条形图
**/
function chartsOfBar(containerObj, xAxisData, seriesData) {
	$(containerObj).highcharts({
        chart: {
            type: 'bar'
        },
        credits: {enabled: false},
        title: {
            text: '实时票房（单位：万）'
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
	}

	chartsOfBar(containerObj, xAxisData, seriesData);
}