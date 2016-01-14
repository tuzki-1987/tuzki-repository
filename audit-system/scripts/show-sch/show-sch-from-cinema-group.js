/**
* 票房明细比较
*
* @author ccq by 2015-11-10
**/


var schDetailData = null;	// 排期明细数据
var schTimeArrs = [];	// 影片播放明细

/**
* 加载系统已生成的排期汇总数据
*
* @param queryDate 排期日期
**/
function loadSchTotalList(queryDate) {
	$("#schTotalTbl").find("thead").nextAll().remove();
	$("#schTotalTbl").append("<tr><td colspan='3' align='center'><img src='images/loading.gif' /></td></tr>");

	server.getTotalSchData(cinemaObj.id, queryDate, function(callback) {
		if(callback.ret) {
			$("#schTotalTbl").find("thead").nextAll().remove();

			var datas = callback.data, datasL = 0;
			var dataHtml = "", totalHtml = "";

			if(datas != null && datas != undefined && datas != "") {
				datasL = datas.length;
				// 可比较控制项(0:不可比较, 1:可比较)
				$("#scheDateYet").attr("data", "1");

				// if(datasL == 0) {
				// 	dataHtml += "<tr>"
				// 				+ "<td>" + datas[0].filmName + "</td>"
				// 				+ "<td>" + datas[0].total + "</td>"
				// 				+ "<td>"
				// 					+ "<a href='javascript:;' onclick='viewSchDetail(" + datas[0].filmId + ");'>查看</a>"
				// 				+ "</td>"
				// 			+ "</tr>";
				// 	totalHtml = "<tr>"
				// 				+ "<td><B>合计</B></td>"
				// 				+ "<td><B>" + datas[0].total + "</B></td>"
				// 				+ "<td>&nbsp;</td>"
				// 			+ "</tr>";
				// }

				if(datasL > 0) {
					var totalCount = 0;
					for(var i = 0; i < datasL; i++) {
						dataHtml += "<tr>"
									+ "<td>" + datas[i].filmName + "</td>"
									+ "<td>" + datas[i].total + "</td>"
									+ "<td>"
										+ "<a href='javascript:;' onclick='viewSchDetail(" + datas[i].filmId + ");'>查看</a>"
									+ "</td>"
								+ "</tr>";

						totalCount += datas[i].total;
					}

					totalHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td><B>" + totalCount + "</B></td>"
								+ "<td>&nbsp;</td>"
							+ "</tr>";
				}
			}else {
				// 可比较控制项(0:不可比较, 1:可比较)
				$("#scheDateYet").attr("data", "0");

				dataHtml = "<tr>"
							+ "<td colspan='3'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在生成排期后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
				totalHtml = "";
			}

			$("#schTotalTbl").append(dataHtml + totalHtml);
		}
	});

	// 延迟获取排期明细数据
	setTimeout(function() {
		server.viewScheduleByFilm(cinemaObj.id, queryDate, function(callback) {
			if(callback.ret) {
				schDetailData = callback.data;
			}
		});
	}, 500);
}

/**
* 查看排期明细
*
* @param filmId 当前查看的影片ID
**/
function viewSchDetail(filmId) {
	$('#myModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});

	// 获取影片排期明细
	getSchTimeByFilmId(filmId);
}

/**
* 获取指定影片排期明细, 进行页面展现
**/
function getSchTimeByFilmId(filmId) {
	var viewScheduleStr = null, timeHtml = "";

	for (var i = 0; i < schDetailData.length; i++) {
		if(filmId == schDetailData[i].filmId) {
			viewScheduleStr = schDetailData[i].viewSchedule;
			break;
		}
	}

	schTimeArrs = [], viewScheduleStrL = viewScheduleStr.length;
	for ( var j = 0; j < viewScheduleStrL; j++) {
		var viewTagss = viewScheduleStr[j].viewTags.split(",");
		for( var k = 0; k < viewTagss.length; k++) {
			var startTime = viewTagss[k].substring(0, viewTagss[k].indexOf("-")-1);
			var viewParameters = {};
			viewParameters["hallName"] = viewScheduleStr[j].hallName;
			viewParameters["viewTagsTime"] = timeDataHandler(startTime);
			viewParameters["viewTagsTimes"] = viewTagss[k];
			schTimeArrs.push(viewParameters);
			
		}
	}
	
	var resultArr = sortSchDetailByTime(schTimeArrs), resultArrL = resultArr.length;
	console.log(resultArr);
	for (var k = 0; k < resultArrL; k++) {
		timeHtml += "<div class='time-block'>"
						+ "<p class='time-hall'>" + resultArr[k].hallName + "</p>"
						+ "<p class='time-start'>" + resultArr[k].viewTagsTime + "</p>"
						// + "<p class='time-start'>" + resultArr[k].viewTagsTimes + "</p>" 时间段
					+ "</div>";
	}
	$(".show-sch-body").html(timeHtml);
}

/**
* 排期明细按播放时间排序
**/
function sortSchDetailByTime(tempTimeArr) {
	var tempTimeArrL = tempTimeArr.length;
	for ( var i = 0; i < tempTimeArrL; i++) {
		for ( var j = i; j < tempTimeArr.length; j++) {
			if (tempTimeArr[i].viewTagsTime > tempTimeArr[j].viewTagsTime) {
				var temp = tempTimeArr[i];
				tempTimeArr[i] = tempTimeArr[j];
				tempTimeArr[j] = temp;
			}
		}
	}

	return tempTimeArr;
}

/**
* 时间处理
**/
function timeDataHandler(dateObj){
	if (!dateObj) 
		return ;

	var startHours = dateObj.substring(0, dateObj.indexOf(":"));
	var startSeconds = dateObj.substring(dateObj.indexOf(":")+1, dateObj.length);

	if (Number(startHours) == 0) {
		startHours = 24;
	}
	return startHours+":"+startSeconds;
}


$(function() {
	// 选项卡点击事件
	$('#manageTabs a').click(function (e) {
		// 当前选项卡索引
		var curTabIndex = $(this).parent().index();

		e.preventDefault();
		$(this).tab('show');

		// 系统预排 选项卡
		if(curTabIndex == 0)
			loadSchTotalList($("#scheDateYet").text());

		// 排期明细选项卡
		if(curTabIndex == 1)
			$(".sch-detail-show").load(muObj.url30_1);
	});

	// 排期展示、按影厅显示、按影片显示 点击
	$(".sch-btn-label").click(function() {
		var labelIndex = $(this).index();

		$(".sch-btn-label").removeClass("active");
		$(this).addClass("active");

		// 隐藏所有，只显示黄金时段
		$(".compare-total-tbl").hide();
		if(labelIndex == 0)
			$(".sch-detail-show").load(muObj.url30_1);
		if(labelIndex == 1)
			$(".sch-detail-show").load(muObj.url31_1);
		if(labelIndex == 2)
			$(".sch-detail-show").load(muObj.url32_1);
	});
});