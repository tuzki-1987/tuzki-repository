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

	// alert("here : "+filmId+" - "+schDetailData.length)
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

/**
* 开始比较
**/
function handleStartCompare() {
	// 获取当前可比较状态
	var compareFlag = $("#scheDateYet").attr("data");

	if(parseInt(compareFlag) == 0) {
		tipMsg_Single('totalDataArea', 0, "当前没有排期数据，请生成排期后再进行比较", 0, '', '');
	}else {
		var curCinemaId = cinemaObj.id;
		var yuanxianID = cinemaObj.platFormId;
		var schDate = $("#scheDateYet").text();
		$(".compare-result-area-process").fadeIn();

		// 请求比较接口
		startCompare(curCinemaId, schDate, yuanxianID);
	}
}

/**
* 实际与系统票房比较
*
* @param cinemaId 当前被操作的影院id
* @param analysisDate 查询日期
**/
function startCompare(cinemaId, compareDate, yuanxianID) {
	server.boxOfficeCompare(cinemaId, compareDate, yuanxianID, function(callback) {
		if(callback.ret)
			showCompareResult(cinemaId, compareDate);
	});
}

/**
* 分时段展示比较结果
*
* @param cinemaId 当前被操作的影院id
* @param analysisDate 查询日期
**/
function showCompareResult(cinemaId, analysisDate) {
	var colorArr = ["#D3DFEA", "#C7DBEF", "#BAD7F3", "#ADD2F8", "#9FCEFD", "#7CBBF9", "#5AABFC", "#3D9BF9"];
	$("#alldayCompareTbl").find("thead").nextAll().remove();
	$("#alldayCompareTbl").append("<tr><td colspan='6' align='center'><img src='images/loading.gif' /></td></tr>");

	server.queryBoxOfficeCompare(cinemaId, analysisDate, function(callback) {
		if(callback.ret) {
			$("#alldayCompareTbl").find("thead").nextAll().remove();
			$("#goldCompareTbl").find("thead").nextAll().remove();
			$("#generalCompareTbl").find("thead").nextAll().remove();

			var datas = callback.data, datasL = datas.length;
			var allDayObj = null, goldTimeObj = null, generalTimeObj = null;
			var allDayObjL = 0, goldTimeObjL = 0, generalTimeObjL = 0;
			var dayHtml = "", goldHtml = "", generalHtml = "", colorHtml = "";

			// 获取各时段数据对象
			for(var i = 0; i < datasL; i++) {
				if(datas[i].timeSlotId == 0) {
					// 总场次
					allDayObj = datas[i].viewCompares;
					allDayObjL = allDayObj.length;
				}

				if(datas[i].timeSlotId == 1) {
					// 黄金时段
					goldTimeObj = datas[i].viewCompares;
					goldTimeObjL = goldTimeObj.length;
				}

				if(datas[i].timeSlotId == 2) {
					// 非黄金时段
					generalTimeObj = datas[i].viewCompares;
					generalTimeObjL = generalTimeObj.length;
				}
			}

			// 是否可下载
			if(allDayObjL == 0 && goldTimeObjL == 0 && generalTimeObjL == 0)
				$("#downCompare").attr("data", "0");
			else
				$("#downCompare").attr("data", "1");

			// 遍历全天数据对象
			if(allDayObjL > 0) {
				var totalAllDaySessionCount = 0, totalAllDayPrice = 0, totalAllDaySeatRate = 0, totalAllDayHtml = "";
				var sysAllDayCount = 0, sysAllDayBoxffice = 0, totalAllDaySysCount = 0, totalAllDaySysBoxOffice = 0;

				for (var day = 0; day < allDayObjL; day++) {
					// colorHtml = " style='background-color:" + colorArr[day] + "'";	// 颜色递深
					colorHtml = " style='background-color: #9FCEFD; color: #fff;'";
					sysAllDayCount = allDayObj[day].sysSessionCount == undefined ? 0 : allDayObj[day].sysSessionCount;
					sysAllDayBoxffice = allDayObj[day].sysTotalPrice == undefined ? 0 : allDayObj[day].sysTotalPrice;

					dayHtml += "<tr>"
								+ "<td>" + allDayObj[day].filmName + "</td>"
								+ "<td><center>" + allDayObj[day].sessionCount + "</center></td>"
								+ "<td><center>" + allDayObj[day].totalPrice + "</center></td>"
								+ "<td" + colorHtml + "><center>" + allDayObj[day].avgTotalPrice + "</center></td>"
								+ "<td><center>" + sysAllDayCount + "</center></td>"
								+ "<td><center>" + sysAllDayBoxffice + "</center></td>"
							+ "</tr>";

					totalAllDaySessionCount += allDayObj[day].sessionCount;
					totalAllDayPrice += allDayObj[day].totalPrice;
					totalAllDaySysCount += sysAllDayCount;
					totalAllDaySysBoxOffice += sysAllDayBoxffice;
				}

				totalAllDayHtml = "<tr>"
									+ "<td><B>合计</B></td>"
									+ "<td><center><B>" + totalAllDaySessionCount + "</B></center></td>"
									+ "<td><center><B>" + totalAllDayPrice + "</B></center></td>"
									+ "<td>&nbsp;</td>"
									+ "<td><center><B>" + totalAllDaySysCount + "</B></center></td>"
									+ "<td><center><B>" + totalAllDaySysBoxOffice + "</B></center></td>"
								+ "</tr>";
			}else {
				dayHtml = "<tr>"
							+ "<td colspan='6'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在上传票房，或生成排期后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			// 遍历黄金时段数据对象
			if(goldTimeObjL > 0) {
				var totalGoldSessionCount = 0, totalGoldPrice = 0, totalGoldSeatRate = 0, totalGoldHtml = "";
				var sysGoldCount = 0, sysGoldBoxffice = 0, totalGoldSysCount = 0, totalGoldSysBoxOffice = 0;

				for (var gold = 0; gold < goldTimeObjL; gold++) {
					// colorHtml = " style='background-color:" + colorArr[gold] + "'";	// 颜色递深
					colorHtml = " style='background-color: #9FCEFD; color: #fff;'";
					sysGoldCount = goldTimeObj[gold].sysSessionCount == undefined ? 0 : goldTimeObj[gold].sysSessionCount;
					sysGoldBoxffice = goldTimeObj[gold].sysTotalPrice == undefined ? 0 : goldTimeObj[gold].sysTotalPrice;

					goldHtml += "<tr>"
								+ "<td>" + goldTimeObj[gold].filmName + "</td>"
								+ "<td><center>" + goldTimeObj[gold].sessionCount + "</center></td>"
								+ "<td><center>" + goldTimeObj[gold].totalPrice + "</center></td>"
								+ "<td" + colorHtml + "><center>" + goldTimeObj[gold].avgTotalPrice + "</center></td>"
								+ "<td><center>" + sysGoldCount + "</center></td>"
								+ "<td><center>" + sysGoldBoxffice + "</center></td>"
							+ "</tr>";

					totalGoldSessionCount += goldTimeObj[gold].sessionCount;
					totalGoldPrice += goldTimeObj[gold].totalPrice;
					totalGoldSysCount += sysGoldCount;
					totalGoldSysBoxOffice += sysGoldBoxffice;
				}

				totalGoldHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td><center><B>" + totalGoldSessionCount + "</B></center></td>"
								+ "<td><center><B>" + totalGoldPrice + "</B></center></td>"
								+ "<td>&nbsp;</td>"
								+ "<td><center><B>" + totalGoldSysCount + "</B></center></td>"
								+ "<td><center><B>" + totalGoldSysBoxOffice + "</B></center></td>"
							+ "</tr>";
			}else {
				goldHtml = "<tr>"
							+ "<td colspan='6'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在上传票房，或生成排期后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			// 遍历非黄金时段数据对象
			if(generalTimeObjL > 0) {
				var totalGeneralSessionCount = 0, totalGeneralPrice = 0, totalGeneralSeatRate = 0, totalGeneralHtml = "";
				var sysGeneralCount = 0, sysGeneralBoxffice = 0, totalGeneralSysCount = 0, totalGeneralSysBoxOffice = 0;

				for (var general = 0; general < generalTimeObjL; general++) {
					// colorHtml = " style='background-color:" + colorArr[general] + "'";	// 颜色递深
					colorHtml = " style='background-color: #9FCEFD; color: #fff;'";
					sysGeneralCount = generalTimeObj[general].sysSessionCount == undefined ? 0 : generalTimeObj[general].sysSessionCount;
					sysGeneralBoxffice = generalTimeObj[general].sysTotalPrice == undefined ? 0 : generalTimeObj[general].sysTotalPrice;

					generalHtml += "<tr>"
								+ "<td>" + generalTimeObj[general].filmName + "</td>"
								+ "<td><center>" + generalTimeObj[general].sessionCount + "</center></td>"
								+ "<td><center>" + generalTimeObj[general].totalPrice + "</center></td>"
								+ "<td" + colorHtml + "><center>" + generalTimeObj[general].avgTotalPrice + "</center></td>"
								+ "<td><center>" + sysGeneralCount + "</center></td>"
								+ "<td><center>" + sysGeneralBoxffice + "</center></td>"
							+ "</tr>";

					totalGeneralSessionCount += generalTimeObj[general].sessionCount;
					totalGeneralPrice += generalTimeObj[general].totalPrice;
					totalGeneralSysCount += sysGeneralCount;
					totalGeneralSysBoxOffice += sysGeneralBoxffice;
				}

				totalGeneralHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td><center><B>" + totalGeneralSessionCount + "</B></center></td>"
								+ "<td><center><B>" + totalGeneralPrice + "</B></center></td>"
								+ "<td>&nbsp;</td>"
								+ "<td><center><B>" + totalGeneralSysCount + "</B></center></td>"
								+ "<td><center><B>" + totalGeneralSysBoxOffice + "</B></center></td>"
							+ "</tr>";
			}else {
				generalHtml = "<tr>"
							+ "<td colspan='6'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在上传票房，或生成排期后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			$("#alldayCompareTbl").append(dayHtml + totalAllDayHtml);
			$("#goldCompareTbl").append(goldHtml + totalGoldHtml);
			$("#generalCompareTbl").append(generalHtml + totalGeneralHtml);

			// 隐藏所有，只显示全天时段
			$(".analysis-btn-label").removeClass("active");
			$(".analysis-btn-label:eq(0)").addClass("active");
			$(".compare-total-tbl").hide();
			$(".allday-tbl").show();

			// 加载比较信息
			if(datas != "" && datas != null && datas != undefined)
				compareMessage(totalAllDayPrice, totalAllDaySysBoxOffice, totalGoldPrice, totalGoldSysBoxOffice, totalGoldSessionCount, totalGoldSysCount, totalGeneralPrice, totalGeneralSysBoxOffice, totalGeneralSessionCount, totalGeneralSysCount);
		}
	});
}

/**
* 比对结果提示信息
*
* @param price 实际票房
* @param sysPrice 系统票房
* @param goldPrice 黄金时机票房
* @param goldSysPrice 黄金系统票房
* @param goldCount 黄金实际场次
* @param goldSysCount 黄金系统场次
* @param generalPrice 普通实际票房
* @param generalSysPrice 普通系统票房
* @param generalCount 普通实际场次
* generalSysCount 普通系统场次
**/
function compareMessage(price, sysPrice, goldPrice, goldSysPrice, goldCount, goldSysCount, generalPrice, generalSysPrice, generalCount, generalSysCount) {
	var msgHtml_start = "", msgHtml_end = "", resultHtml = "";
	var allDayHtml = "", goldHtml = "", generalHtml = "";
	// 得分, 二者比率, 相差百分点数, 系统基础分
	var compareScore = 0, compareScoreRate = 0, compareScoreRatePoint = 0, basicScore = 80;

	// 计算影院分值
	compareScoreRate = (sysPrice - price)/sysPrice;	// 取与系统的比值
	compareScoreRate = Math.round(compareScoreRate*100);

	// 全时段信息
	if(sysPrice > price) {	// 系统大于实际
		compareScore = basicScore - compareScoreRate;
		// var tempArr = [compareScoreRate, compareScoreRatePoint, compareScore];
		// console.log(tempArr);

		msgHtml_start = "很遗憾！";
		msgHtml_end = "为了提高您的收益，建议您使用 “影院智能排片系统”。"
		allDayHtml = "您的得分为<span class='num'>" + compareScore + "</span>分，还要继续加油！！"
					+ "系统排期票房比实际排期票房多收益<span class='num'>" + (sysPrice - price) + "</span>元！其中";
	}else {	// 实际大于系统
		compareScore = basicScore - compareScoreRate;
		// var tempArr = [compareScoreRate, compareScoreRatePoint, compareScore];
		// console.log(tempArr);

		msgHtml_start = "恭喜您！";
		msgHtml_end = "";
		allDayHtml = "您的得分为<span class='num'>" + compareScore + "</span>分，继续努力！！"
					+ "实际排期票房比系统排期票房多收益<span class='num'>" + (price - sysPrice) + "</span>元！其中";
	}

	// 黄金时段信息
	if(goldSysCount > goldCount) {	// 系统大于实际
		if(goldSysPrice > goldPrice)
			goldHtml = "系统黄金时段多收益<span class='num'>" + (goldSysPrice - goldPrice) + "</span>元、场次提高了<span class='num'>"
					+ (goldSysCount - goldCount) + "</span>场。";
		else
			goldHtml = "实际黄金时段多收益<span class='num'>" + (goldPrice - goldSysPrice) + "</span>元、场次少排了<span class='num'>"
					+ (goldSysCount - goldCount) + "</span>场。";
	}else {	// 实际大于系统
		if(goldSysPrice > goldPrice)
			goldHtml = "系统黄金时段多收益<span class='num'>" + (goldSysPrice - goldPrice) + "</span>元、场次少排了<span class='num'>"
					+ (goldCount - goldSysCount) + "</span>场。";
		else
			goldHtml = "实际黄金时段多收益<span class='num'>" + (goldPrice - goldSysPrice) + "</span>元、场次提高了<span class='num'>"
					+ (goldCount - goldSysCount) + "</span>场。";
	}

	// 非黄金时段信息
	if(generalSysCount > generalCount) {	// 系统大于实际
		if(generalSysPrice > generalPrice)
			generalHtml = "系统非黄金时段多收益<span class='num'>" + (generalSysPrice - generalPrice) + "</span>元、场次提高了<span class='num'>"
					+ (generalSysCount - generalCount) + "</span>场。";
		else
			generalHtml = "实际非黄金时段多收益<span class='num'>" + (generalPrice - generalSysPrice) + "</span>元、场次少排了<span class='num'>"
					+ (generalSysCount - generalCount) + "</span>场。";
	}else {	// 实际大于系统
		if(generalSysPrice > generalPrice)
			generalHtml = "系统非黄金时段多收益<span class='num'>" + (generalSysPrice - generalPrice) + "</span>元、场次少排了<span class='num'>"
					+ (generalCount - generalSysCount) + "</span>场。";
		else
			generalHtml = "实际非黄金时段多收益<span class='num'>" + (generalPrice - generalSysPrice) + "</span>元、场次提高了<span class='num'>"
					+ (generalCount - generalSysCount) + "</span>场。";
	}

	resultHtml = msgHtml_start + allDayHtml + goldHtml + generalHtml + msgHtml_end;
	$(".tip-box").html(resultHtml);
	$(".compare-tip").fadeIn();
}

/**
* 导出对比结果
**/
function downCompareResult() {
	var cinemaId = cinemaObj.id;
	var compareDate = $("#scheDateYet").text();
	var downFlag = $("#downCompare").attr("data");

	// start download
	if(downFlag == 0)
		tipMsg_Single('totalDataArea', 0, "当前没有对比结果，不能下载", 0, '', '');
	else
		window.open("/schedule/apis/boxOffice/" + cinemaId + "/" + compareDate + "/downBoxOfficeCompare.html",'newwindow');
}

$(function() {
	// 黄金时段、非黄金时段、全天对比点击
	$(".analysis-btn-label").click(function() {
		var labelIndex = $(this).index();

		$(".analysis-btn-label").removeClass("active");
		$(this).addClass("active");

		// 隐藏所有，只显示黄金时段
		$(".compare-total-tbl").hide();
		if(labelIndex == 0)
			$(".allday-tbl").show();
		if(labelIndex == 1)
			$(".gold-tbl").show();
		if(labelIndex == 2)
			$(".general-tbl").show();
	});
});