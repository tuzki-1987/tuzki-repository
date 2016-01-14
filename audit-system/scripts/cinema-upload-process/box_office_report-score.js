/**
* 当日票房成绩单
*
* @author ccq by 2015-11-10
**/

/**
 * 加载当日票房成绩单
 * 
 * @param 
 * 		cinemaId  影院ID
 * 		queryDate 日期参数
 * @return
 * */
function loadBoxOfficeTotals(cinemaId, queryDate){
	$("#boxTotalTbl").find("thead").nextAll().remove();
	$("#boxTotalTbl").append("<tr><td colspan='9' align='center'><img src='images/loading.gif' /></td></tr>");
	
	/**
	 * 汇总数据html
	 * */
	var boxOfficeCntHTML = "";
	/**
	* 内容展示html
	**/
	var boxOfficeHTML = "";
	/**
	 * 合并单元格个数
	 * */
	var colspanNums = 9;
	/**
	 * 总计HTML
	 * */
	var totalHTML = "";
	/**
	 * 是否可编辑
	 * */
	var isEdit = false;
	/**
	 * 数据对象和长度
	 * */
	var dataObj = null, dataObjL = 0;
	
	server.boxOfficeList(cinemaId, queryDate, function(callback){
		if(callback.ret){
			$("#boxTotalTbl").find("thead").nextAll().remove();
			isEdit = callback.isEdit;
			dataObj = callback.data, dataObjL = dataObj.length;
			
			if(isEdit){	// 来自排期
				$("#noTotalDataFlag").val("0");	// 无汇总数据标记
				boxOfficeCntHTML = "<tr>"
						            + "<td colspan='" + colspanNums + "'>"
						            	+ "<div>"
							            	+ "<img src='images/tip.png' width='80' />"
											+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
										+ "</div>"
						            + "</td>"
						           + "</tr>";
				totalHTML = "";
			}else{	// 来自票房明细
				if(dataObjL < 1){
					$("#noTotalDataFlag").val("0");	// 无汇总数据标记
					boxOfficeCntHTML = "<tr>"
						            	+ "<td colspan='" + colspanNums + "'>"
						            		+ "<div>"
							            		+ "<img class='tip-light' src='images/tip.png' width='80' />"
												+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
											+ "</div>"
						            	+ "</td>"
						            + "</tr>";
					totalHTML = "";
				}else{
					$("#noTotalDataFlag").val("1");	// 有汇总数据标记
					var totalPrice = 0;	// 单日票房
					var sessionCount = 0;	// 单日场次
					var ticketCount = 0;	// 单日人次
					var avgPrice = 0;	// 平均票价
					var avgSessionCount = 0;	// 场均人次
					var seatRate = 0;	// 上座率
					var avgTotalPrice = 0;	// 场均票房
					
					var totalAvgSessionCount = 0;	// 场均人次总数
					// var trClassName = "";
					
					for(var i = 0; i < dataObjL; i++){
						// if(i % 2 == 0) {
						// 	trClassName = " show-list-tbl-data-odd";
						// }else {
						// 	trClassName = " show-list-tbl-data-even";
						// }

						if(dataObj[i].totalPrice == undefined)
							totalPrice = "";
						else
							totalPrice = dataObj[i].totalPrice;

						if(dataObj[i].sessionCount == undefined)
							sessionCount = "";
						else
							sessionCount = dataObj[i].sessionCount;

						if(dataObj[i].ticketCount == undefined)
							ticketCount = "";
						else
							ticketCount = dataObj[i].ticketCount;

						if(dataObj[i].avgPrice == undefined)
							avgPrice = "";
						else
							avgPrice = dataObj[i].avgPrice;

						if(dataObj[i].avgSessionCount == undefined){
							avgSessionCount = "";
							totalAvgSessionCount = "";
						}else{
							avgSessionCount = dataObj[i].avgSessionCount;
							totalAvgSessionCount += avgSessionCount;
						}

						seatRate = (dataObj[i].seatRate) * 100;
						seatRate = seatRate.toFixed(2);
						// if(seatRate.indexOf(".") != -1)
						// 	seatRate = seatRate.substring(0, seatRate.indexOf("."));

						if(dataObj[i].avgTotalPrice == undefined)
							avgTotalPrice = "";
						else
							avgTotalPrice = dataObj[i].avgTotalPrice;
						
						boxOfficeCntHTML += "<tr>"
												+"<td><input type='hidden' value='" + dataObj[i].filmId + "' /><span>" + dataObj[i].filmName + "</span></td>"
												+"<td>" + dataObj[i].showDate + "</td>"
												+"<td>" + totalPrice + "</td>"
												+"<td>" + sessionCount + "</td>"
												+"<td>"
													+"<span id='ticketCount" + i + "'>" + ticketCount + "</span>"
												+ "</td>"
												+"<td>" + avgPrice + "</td>"
												+"<td><span id='avgSessionCount" + i + "'>" + avgSessionCount + "</span></td>"
												+"<td>" + seatRate + "%</td>"
												+"<td><span id='ticketRate" + i + "'>" + avgTotalPrice + "</span></td>"
											+"</tr>";
					}
					
					// if(dataObjL % 2 == 0) {
					// 	trClassName = " show-list-tbl-data-odd";
					// }else {
					// 	trClassName = " show-list-tbl-data-even";
					// }
					totalHTML = "<tr>"
									+"<td colspan='2'><B>合计</B></td>"
									+"<td><span id='totalSessionCount'><B>" + callback.totalAllPrice + "</B></span></td>"
									+"<td><span id='totalSessionRate'><B>" + callback.totalSessionCount + "</B></span></td>"
									+"<td><span id='totalTicketCount'><B>" + callback.totalTicketCount + "</B></span></td>"
									+"<td><span id='totalTicketRate'></span></td>"
									+"<td><span id='totalAvgSessionCount'></span></td>"
									+"<td><span id='totalTicketRate'></span></td>"
									+"<td><span id='totalTicketRate'></span></td>"
								+"</tr>";
				}
			}
			
			boxOfficeHTML = boxOfficeCntHTML + totalHTML;	// 数据区html组装(列表标题+数据列表+合计)
			
			$("#boxTotalTbl").append(boxOfficeHTML);	// 装载数据区

			// // 表格数据排序等相关功能
			// $("#reportCntTbl").dataTable({
			// 	"bDestroy":true,
			// 	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],	// 指定第一列不参与排序
			// 	"asStripClasses":["odd", "even"],
			// 	"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			// 	"order": [[ 1, "asc" ]],
			// 	"bStateSave": false,
			// 	"bPaginate":true, //翻页功能
			// 	"bSortClasses":true,
			// 	"bLengthChange" : true,//改变每页显示数据数量
			// 	"bFilter": true, //过滤功能
			// 	"bInfo": true,//页脚信息
			// 	"iDisplayLength" : 10,// 每页显示行数
			// 	"language": {
			// 	    "url": "http://cdn.datatables.net/plug-ins/e9421181788/i18n/Chinese.json"
			// 	    // "sEmptyTable": "暂无汇总数据"
			// 	}
			// });
			// // 修改相关项的默认样式
			// $(".dataTable").css({"border-collapse":"collapse", "width":"99.9%"});
			// $(".dataTable thead th").css({"padding":"0 8px", "border-bottom":"1px solid #7098a3"});
			// $(".dataTable thead td").css({"padding":"0 8px"});
			// $(".dataTable thead .sorting").css("background-position", "50% 0%");
			// $(".dataTable thead .sorting_asc").css("background-position", "50% 0%");
			// $(".dataTable thead .sorting_desc").css("background-position", "50% 0%");
		}else{
			$("#noTotalDataFlag").val("0");	// 无汇总数据标记
			$("#boxTotalTbl").find("thead").nextAll().remove();
			boxOfficeCntHTML = "<tr>"
					            + "<td colspan='" + colspanNums + "'>"
					            	+ "<div>"
						            	+ "<img src='images/tip.png' width='80' />"
										+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
									+ "</div>"
					            + "</td>"
					        + "</tr>";
			
			$("#boxTotalTbl").append(boxOfficeHTML);	// 装载数据区
		}
	});
}

/**
 * 查询票房成绩单
 * */
function queryBoxOfficeTotal(){
	loginStatus();

	// var cinemaId = getCookie("cinemaId");
	var cinemaId = cinemaObj.id;
	var queryDate = $dp.cal.getDateStr();
	// $("#initSchDate").val(queryDate);	// 保留查询日期
	
	if(queryDate == "")
		tipMsg_Single('reportTitle', 0, "请选择查询日期", 0, '', '');
	else{
		loadBoxOfficeTotals(cinemaId, queryDate);
		$dp.hide();
	}
}

/**
* 场次分析按钮
*
* @param
**/
function handleEventAnalysis() {
	loginStatus();

	// 数据标记
	var dataFlag = $("#noTotalDataFlag").val();
	if(parseInt(dataFlag) == 0) {	// 无汇总数据
		tipMsg_Single('reportTitle', 0, "暂无数据，请上传票房后再次体验", 0, '', '');
	}else {
		$(".cinema-up-area1").slideUp();
		$(".cinema-up-area2").slideDown();

		var curCinemaId = cinemaObj.id;
		var analysisDate = $("#initSchDate").val();
		
		$("#alldayNnalysisTbl").find("thead").nextAll().remove();
		$("#alldayNnalysisTbl").append("<tr><td colspan='5' align='center'><img src='images/loading.gif' /></td></tr>");

		$("#goldNnalysisTbl").find("thead").nextAll().remove();
		$("#goldNnalysisTbl").append("<tr><td colspan='5' align='center'><img src='images/loading.gif' /></td></tr>");

		$("#generalNnalysisTbl").find("thead").nextAll().remove();
		$("#generalNnalysisTbl").append("<tr><td colspan='5' align='center'><img src='images/loading.gif' /></td></tr>");

		saveAnalysis(curCinemaId, analysisDate);
	}
}

/**
* 保存场次分析结果
*
* @param cinemaId 当前被操作的影院id
* @param analysisDate 查询日期
**/
function saveAnalysis(cinemaId, analysisDate) {
	server.saveAnalysis(cinemaId, analysisDate, function(callback) {
		if(callback.ret) {
			showAnalysisDetail(cinemaId, analysisDate)
		}else {
			tipMsg_Single('reportTitle', 0, "分析出现异常，请稍后重试", 0, '', '');
		}
	});
}

/**
* 分时段展示场次分析结果
*
* @param cinemaId 当前被操作的影院id
* @param analysisDate 查询日期
**/
function showAnalysisDetail(cinemaId, analysisDate) {
	server.showAnalysisDetail(cinemaId, analysisDate, function(callback) {
		if(callback.ret) {
			$("#alldayNnalysisTbl").find("thead").nextAll().remove();
			$("#goldNnalysisTbl").find("thead").nextAll().remove();
			$("#generalNnalysisTbl").find("thead").nextAll().remove();

			var datas = callback.data, datasL = datas.length;
			var allDayObj = null, goldTimeObj = null, generalTimeObj = null;
			var allDayObjL = 0, goldTimeObjL = 0, generalTimeObjL = 0;
			var dayHtml = "", goldHtml = "", generalHtml = "";

			// 获取各时段数据对象
			for(var i = 0; i < datasL; i++) {
				if(datas[i].timeSlotId == 0) {
					// 总场次
					allDayObj = datas[i].viewAnalysis;
					allDayObjL = allDayObj.length;
				}

				if(datas[i].timeSlotId == 1) {
					// 黄金时段
					goldTimeObj = datas[i].viewAnalysis;
					goldTimeObjL = goldTimeObj.length;
				}

				if(datas[i].timeSlotId == 2) {
					// 非黄金时段
					generalTimeObj = datas[i].viewAnalysis;
					generalTimeObjL = generalTimeObj.length;
				}
			}

			// 遍历全天数据对象
			if(allDayObjL > 0) {
				var totalAllDaySessionCount = 0, totalAllDayPrice = 0, totalAllDaySeatRate = 0, totalAllDayHtml = "";

				for (var day = 0; day < allDayObjL; day++) {
					dayHtml += "<tr>"
								+ "<td>" + allDayObj[day].filmName + "</td>"
								+ "<td>" + allDayObj[day].sessionCount + "</td>"
								+ "<td>" + allDayObj[day].avgTotalPrice + "</td>"
								+ "<td>" + Math.round((allDayObj[day].seatRate) * 100) + "%</td>"
								+ "<td>" + allDayObj[day].totalPrice + "</td>"
							+ "</tr>";

					totalAllDaySessionCount += allDayObj[day].sessionCount;
					totalAllDayPrice += allDayObj[day].totalPrice;
					totalAllDaySeatRate += (allDayObj[day].seatRate) * 100;
				}

				totalAllDayHtml = "<tr>"
									+ "<td><B>合计</B></td>"
									+ "<td><B>" + totalAllDaySessionCount + "</B></td>"
									+ "<td>&nbsp;</td>"
									+ "<td>&nbsp;</td>"
									// + "<td><B>" + totalAllDaySeatRate + "%</B></td>"
									+ "<td><B>" + totalAllDayPrice + "</B></td>"
								+ "</tr>";
			}else {
				dayHtml = "<tr>"
							+ "<td colspan='5'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			// 遍历黄金时段数据对象
			if(goldTimeObjL > 0) {
				var totalGoldSessionCount = 0, totalGoldPrice = 0, totalGoldSeatRate = 0, totalGoldHtml = "";

				for (var gold = 0; gold < goldTimeObjL; gold++) {
					goldHtml += "<tr>"
								+ "<td>" + goldTimeObj[gold].filmName + "</td>"
								+ "<td>" + goldTimeObj[gold].sessionCount + "</td>"
								+ "<td>" + goldTimeObj[gold].avgTotalPrice + "</td>"
								+ "<td>" + Math.round((goldTimeObj[gold].seatRate) * 100) + "%</td>"
								+ "<td>" + goldTimeObj[gold].totalPrice + "</td>"
							+ "</tr>";

					totalGoldSessionCount += goldTimeObj[gold].sessionCount;
					totalGoldPrice += goldTimeObj[gold].totalPrice;
					totalGoldSeatRate += (goldTimeObj[gold].seatRate) * 100;
				}

				totalGoldHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td><B>" + totalGoldSessionCount + "</B></td>"
								+ "<td>&nbsp;</td>"
								+ "<td>&nbsp;</td>"
								// + "<td><B>" + totalGoldSeatRate + "%</B></td>"
								+ "<td><B>" + totalGoldPrice + "</B></td>"
							+ "</tr>";
			}else {
				goldHtml = "<tr>"
							+ "<td colspan='5'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			// 遍历非黄金时段数据对象
			if(generalTimeObjL > 0) {
				var totalGeneralSessionCount = 0, totalGeneralPrice = 0, totalGeneralSeatRate = 0, totalGeneralHtml = "";

				for (var general = 0; general < generalTimeObjL; general++) {
					generalHtml += "<tr>"
								+ "<td>" + generalTimeObj[general].filmName + "</td>"
								+ "<td>" + generalTimeObj[general].sessionCount + "</td>"
								+ "<td>" + generalTimeObj[general].avgTotalPrice + "</td>"
								+ "<td>" + Math.round((generalTimeObj[general].seatRate) * 100) + "%</td>"
								+ "<td>" + generalTimeObj[general].totalPrice + "</td>"
							+ "</tr>";

					totalGeneralSessionCount += generalTimeObj[general].sessionCount;
					totalGeneralPrice += generalTimeObj[general].totalPrice;
					totalGeneralSeatRate += (generalTimeObj[general].seatRate) * 100;
				}

				totalGeneralHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td><B>" + totalGeneralSessionCount + "</B></td>"
								+ "<td>&nbsp;</td>"
								+ "<td>&nbsp;</td>"
								// + "<td><B>" + totalGeneralSeatRate + "%</B></td>"
								+ "<td><B>" + totalGeneralPrice + "</B></td>"
							+ "</tr>";
			}else {
				generalHtml = "<tr>"
							+ "<td colspan='5'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			$("#alldayNnalysisTbl").append(dayHtml + totalAllDayHtml);
			$("#goldNnalysisTbl").append(goldHtml + totalGoldHtml);
			$("#generalNnalysisTbl").append(generalHtml + totalGeneralHtml);

			// 隐藏所有，只显示黄金时段
			$(".analysis-btn-label").removeClass("active");
			$(".analysis-btn-label:eq(0)").addClass("active");
			$(".analysis-total-tbl").hide();
			$(".gold-tbl").show();
		}
	});
}

/**
* 返回按钮
**/
function handleBack() {
	loginStatus();

	$(".cinema-up-area2").slideUp();
	$(".cinema-up-area1").slideDown();
}

/**
* 下一步按钮(转到'系统排期生成')
**/
function handleNext() {
	// 限制日期修改
	// $("#ctrlCreateSchBtn").val("1");
	$(".main").html(muObj.loadImg);
	$(".main").load(muObj.url_ps_2);
}

$(function() {
	// 黄金时段、非黄金时段、总场次点击
	$(".analysis-btn-label").click(function() {
		var labelIndex = $(this).index();

		$(".analysis-btn-label").removeClass("active");
		$(this).addClass("active");

		// 隐藏所有，只显示黄金时段
		$(".analysis-total-tbl").hide();
		if(labelIndex == 0)
			$(".gold-tbl").show();
		if(labelIndex == 1)
			$(".general-tbl").show();
		if(labelIndex == 2)
			$(".allday-tbl").show();
	});
});