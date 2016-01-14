/**
* 排期结果展示(影院管理 - 汇总统计 - 参考排片)
*
* @author ccq by 2015-11-10
**/


/**
* 分时段展示排期汇总结果
*
* @param cinemaId 当前被操作的影院id
* @param showDate 查询日期
* @param timeSlot 当前时段标识(初始默认0:全天)
**/
function showSchTotalResult(cinemaId, showDate, timeSlot) {
	$("#schDate").text("日期：" + $("#queryDate").val());
	
	if(timeSlot == 0) {
		$("#alldaySchTbl").find("thead").nextAll().remove();
		$("#alldaySchTbl").append("<tr><td colspan='5' align='center'><img src='images/loading.gif' /></td></tr>");
	}else {
		$("#otherTbl").find("thead").nextAll().remove();
		$("#otherTbl").append("<tr><td colspan='4' align='center'><img src='images/loading.gif' /></td></tr>");
	}

	server.schTotalData(cinemaId, showDate, timeSlot, function(callback) {
		if(callback.ret) {
			$("#alldaySchTbl").find("thead").nextAll().remove();
			$("#otherTbl").find("thead").nextAll().remove();

			var datas = callback.data, datasL = 0;
			var dataHtml = "", totalHtml = "", totalTotal = 0, totalSysTotalPrice = 0;
			var avgTotalPrice = 0, sysTotalPrice = 0;

			if(datas != "" && datas != null && datas != undefined) {
				datasL = datas.length;
				totalTotal = 0, totalSysTotalPrice = 0;
				avgTotalPrice = 0, sysTotalPrice = 0;

				// 遍历全天数据对象
				if(timeSlot == 0) {
					for (var day = 0; day < datasL; day++) {
						avgTotalPrice = datas[day].avgTotalPrice ? datas[day].avgTotalPrice : 0;
						sysTotalPrice = datas[day].sysTotalPrice ? datas[day].sysTotalPrice : 0;

						dataHtml += "<tr>"
									+ "<td>" + datas[day].filmName + "</td>"
									+ "<td><center>" + datas[day].total + "</center></td>"
									+ "<td><center>" + datas[day].totalPer + "</center></td>"
									+ "<td><center>" + avgTotalPrice + "</center></td>"
									+ "<td><center>" + sysTotalPrice + "</center></td>"
								+ "</tr>";

						totalTotal += datas[day].total;
						totalSysTotalPrice += sysTotalPrice;
					}

					totalHtml = "<tr>"
									+ "<td><B>合计</B></td>"
									+ "<td><center><B>" + totalTotal + "</B></center></td>"
									+ "<td>&nbsp;</td>"
									+ "<td>&nbsp;</td>"
									+ "<td><center><B>" + totalSysTotalPrice + "</B></center></td>"
								+ "</tr>";
				}

				// 遍历黄金时段/非黄金时段数据对象
				if(timeSlot == 1 || timeSlot == 2) {
					for (var day = 0; day < datasL; day++) {
						avgTotalPrice = datas[day].avgTotalPrice ? datas[day].avgTotalPrice : 0;
						sysTotalPrice = datas[day].sysTotalPrice ? datas[day].sysTotalPrice : 0;

						dataHtml += "<tr>"
									+ "<td>" + datas[day].filmName + "</td>"
									+ "<td><center>" + datas[day].total + "</center></td>"
									+ "<td><center>" + avgTotalPrice + "</center></td>"
									+ "<td><center>" + sysTotalPrice + "</center></td>"
								+ "</tr>";

						totalTotal += datas[day].total;
						totalSysTotalPrice += sysTotalPrice;
					}

					totalHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td><center><B>" + totalTotal + "</B></center></td>"
								+ "<td>&nbsp;</td>"
								+ "<td><center><B>" + totalSysTotalPrice + "</B></center></td>"
							+ "</tr>";
				}
			}else {
				if(timeSlot == 0) {
					dataHtml = "<tr>"
							+ "<td colspan='5'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在生成排期后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
				}

				if(timeSlot == 1 || timeSlot == 2) {
					dataHtml = "<tr>"
							+ "<td colspan='4'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在生成排期后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
				}

				totalHtml = "";
			}

			if(timeSlot == 0)
				$("#alldaySchTbl").append(dataHtml + totalHtml);
			if(timeSlot == 1 || timeSlot == 2)
				$("#otherTbl").append(dataHtml + totalHtml);

			// 隐藏所有，只显示全天时段
			$(".analysis-btn-label").removeClass("active");
			$(".analysis-btn-label:eq(" + timeSlot + ")").addClass("active");
			$(".sch-total-tbl").hide();
			if(timeSlot == 0)
				$(".allday-tbl").show();
			if(timeSlot == 1 || timeSlot == 2)
				$(".goldgen-tbl").show();
		}
	});
}

/**
* 无排期结果时数据展现
**/
function showSchTotalEmptyResult() {
	// if(timeSlot == 0) {
	// 	$("#alldaySchTbl").find("thead").nextAll().remove();
	// 	$("#alldaySchTbl").append("<tr><td colspan='5' align='center'><img src='images/loading.gif' /></td></tr>");
	// }else {
	// 	$("#otherTbl").find("thead").nextAll().remove();
	// 	$("#otherTbl").append("<tr><td colspan='3' align='center'><img src='images/loading.gif' /></td></tr>");
	// }

	var curLabel = $(".show-analysis-data-label").find("button.active").index();
	var dataHtml = "";

	if(curLabel == 0) {
		dataHtml = "<tr>"
				+ "<td colspan='5'>"
					+ "<div>"
			            + "<img src='images/tip.png' width='80' />"
						+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在生成排期后查看</span>"
					+ "</div>"
				+ "</td>"
			+ "</tr>";
	}

	if(curLabel == 1 || curLabel == 2) {
		dataHtml = "<tr>"
				+ "<td colspan='3'>"
					+ "<div>"
			            + "<img src='images/tip.png' width='80' />"
						+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无对比结果，您可在生成排期后查看</span>"
					+ "</div>"
				+ "</td>"
			+ "</tr>";
	}

	$("#alldaySchTbl").find("thead").nextAll().remove();
	$("#otherTbl").find("thead").nextAll().remove();

	if(curLabel == 0)
		$("#alldaySchTbl").append(dataHtml);
	if(curLabel == 1 || curLabel == 2)
		$("#otherTbl").append(dataHtml);

	// // 隐藏所有
	$(".sch-total-tbl").hide();
	if(curLabel == 0)
		$(".allday-tbl").show();
	if(curLabel == 1 || curLabel == 2)
		$(".goldgen-tbl").show();
}

$(function() {
	// 黄金时段、非黄金时段、全天排期点击
	$(".analysis-btn-label").click(function() {
		var labelIndex = $(this).index();
		var cinemaId = $("#curCinemaID").val();
		var queryDate = $("#queryDate").val();

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

		showSchTotalResult(cinemaId, queryDate, labelIndex);
	});
});