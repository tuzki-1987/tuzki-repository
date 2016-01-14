/*
 * 影院管理 - 查看报告
 *
 * @author ccq
 */


/*
* 票房比较对象
*
* price1: 影院实际排片票房
* price2: 系统排片票房
*/
var sumPriceObj = {
	"price1": 0,
	"price2": 0
};
/**
* 加载报告列表
**/
function loadCinemaReport() {
	// alert("here : "+$("#curCinemaID").val())
	var cinemaId = $("#curCinemaID").val();
	var queryDate = $("#queryDate").val();

	// 获取报告数据
	getRealReport(cinemaId, queryDate);
	getSysReport(cinemaId, queryDate);
}

/**
* 获取影院实际报告列表
* 
* @param cinemaId 当前影院ID
* @param queryDate 查询日期
**/
function getRealReport(cinemaId, queryDate) {
	$("#cinemaRealTbl").find("thead").nextAll().remove();
	$("#cinemaRealTbl").find("thead").after("<tr><td colspan='3' style='border-bottom-width: 0;'><center><img src='images/loading.gif' /></center></td></tr>");

	server.getRealReport(cinemaId, queryDate, function(callback) {
		if(callback.ret) {
			var datas = callback.data, datasL = 0;
			var totalSessionCount = callback.totalSessionCount == undefined ? 0 : callback.totalSessionCount;
			var totalSumPrice = callback.totalSumPrice == undefined ? 0 : callback.totalSumPrice;
			sumPriceObj.price1 = totalSumPrice;

			var percentage = 0, boPercentage = 0, totalTpercentage = 100;
			var listHmtl = "", totalHtml = "";
			var descData = callback.statisticsProve, descDataL = 0, descHtml = "";

			if(datas != "" && datas != undefined) {
				datasL = datas.length;

				for (var i = 0; i < datasL; i++) {
					percentage = datas[i].percentage;
					boPercentage = datas[i].boPercentage;
					//totalTpercentage += percentage;

					listHmtl += "<tr>"
								+ "<td>" + datas[i].filmName + "</td>"
								+ "<td>" + datas[i].sessionCount + "</td>"
								+ "<td>" + Math.round(percentage*100) + "%</td>"
								+ "<td>" + datas[i].totalPrice + "</td>"
								+ "<td>" + Math.round(boPercentage*100) + "%</td>"
							+ "</tr>";
				}

				totalHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td>" + totalSessionCount + "</td>"
								+ "<td>" + totalTpercentage + "%</td>"
								+ "<td>" + totalSumPrice + "</td>"
								+ "<td>" + totalTpercentage + "%</td>"
							+ "</tr>";
			}else {
				listHmtl = "<tr>"
							+ "<td colspan='5'>"
						        + "<div class='empty-data-div'>"
							        + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
								+ "</div>"
						    + "</td>"
						+ "</tr>";

				totalHtml = "";
			}

			$("#cinemaRealTbl").find("thead").nextAll().remove();
			$("#cinemaRealTbl").find("thead").after(listHmtl + totalHtml);

			// 上述统计证明信息
			if(descData != "" && descData != undefined) {
				descDataL = descData.length;

				for (var i = 0; i < descDataL; i++) {
					descHtml += "<p class='desc-p'>" + descData[i] + "</p>";
				}

				$(".prove-cnt").html(descHtml);
			}
		}
	});
}

/**
* 获取系统报告列表
* 
* @param cinemaId 当前影院ID
* @param queryDate 查询日期
**/
function getSysReport(cinemaId, queryDate) {
	$("#sysSchTbl").find("thead").nextAll().remove();
	$("#sysSchTbl").find("thead").after("<tr><td colspan='3' style='border-bottom-width: 0;'><center><img src='images/loading.gif' /></center></td></tr>");

	server.getSysReport(cinemaId, queryDate, function(callback) {
		if(callback.ret) {
			var datas = callback.data, datasL = 0;
			var totalSessionCount = callback.totalSessionCount == undefined ? 0 : callback.totalSessionCount;
			var totalSumPrice = callback.totalSumPrice == undefined ? 0 : callback.totalSumPrice;
			sumPriceObj.price2 = totalSumPrice;

			var percentage = 0, boPercentage = 0, totalTpercentage = 100;
			var listHmtl = "", totalHtml = "";

			var conclusion = callback.conclusion == undefined || callback.conclusion == "" ? "" : callback.conclusion;
			var reportDescription = callback.summary == undefined || callback.summary == "" ? "" : callback.summary;
			var sameAnalysis = callback.sameAnalysis, actualPrompt = callback.actualPrompt, sysPrompt = callback.sysPrompt;
			var sameHtml = "", actualHtml = "", sysHtml = "";

			if(datas != "" && datas != undefined) {
				datasL = datas.length;

				for (var i = 0; i < datasL; i++) {
					percentage = datas[i].percentage;
					boPercentage = datas[i].boPercentage;
					//totalTpercentage += percentage;

					listHmtl += "<tr>"
								+ "<td>" + datas[i].filmName + "</td>"
								+ "<td>" + datas[i].sessionCount + "</td>"
								+ "<td>" + Math.round(percentage*100) + "%</td>"
								+ "<td>" + datas[i].totalPrice + "</td>"
								+ "<td>" + Math.round(boPercentage*100) + "%</td>"
							+ "</tr>";
				}

				totalHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td>" + totalSessionCount + "</td>"
								+ "<td>" + totalTpercentage + "%</td>"
								+ "<td>" + totalSumPrice + "</td>"
								+ "<td>" + totalTpercentage + "%</td>"
							+ "</tr>";
			}else {
				listHmtl = "<tr>"
							+ "<td colspan='5'>"
						        + "<div class='empty-data-div'>"
							        + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在生成排期查看</span>"
								+ "</div>"
						    + "</td>"
						+ "</tr>";

				totalHtml = "";
			}

			$("#sysSchTbl").find("thead").nextAll().remove();
			$("#sysSchTbl").find("thead").after(listHmtl + totalHtml);

			/* 描述信息 */
			// 结论
			if(conclusion != "" && conclusion != undefined)
				$(".conclusion-cnt").html(conclusion);
			else
				$(".conclusion-cnt").html("");

			// 相同影院分析
			if(sameAnalysis != "" && sameAnalysis != undefined) {
				var sLen = sameAnalysis.length;
				for (var i = 0; i < sLen; i++) {
					sameHtml += "<p class='desc-p'>" + sameAnalysis[i] + "</p>";
				}

				$(".same-film-ana-cnt").html(sameHtml);
			}else {
				$(".same-film-ana-cnt").html("");
				$(".same-film-ana-cnt").hide();
			}

			// 只在实际排片中出现
			if(actualPrompt != "" && actualPrompt != undefined) {
				var acLen = actualPrompt.length;
				for (var i = 0; i < acLen; i++) {
					actualHtml += "<p class='desc-p'>" + actualPrompt[i] + "</p>";
				}

				$(".desc-real").html(actualHtml);
			}else {
				$(".desc-real").html("");
				$(".desc-real-box").hide();
			}

			// 只在系统推荐中出现
			if(sysPrompt != "" && sysPrompt != undefined) {
				var sysLen = sysPrompt.length;
				for (var i = 0; i < sysLen; i++) {
					sysHtml += "<p class='desc-p'>" + sysPrompt[i] + "</p>";
				}

				$(".desc-sys").html(sysHtml);
			}else {
				$(".desc-sys").html("");
				$(".desc-sys-box").hide();
			}

			// 综上所述
			$(".summary-cnt").html(reportDescription);

			// 实际高于系统
			// reportDescription = reportDescription.replace(/\[/g, "<span class='clr10 fw6 pdrt5 pdlt5'>");
			// reportDescription = reportDescription.replace(/\]/g, "</span>");
			$(".report-cnt").html(reportDescription);
			/* 描述信息 */

			/* 显示对应模板描述信息 */
			// 实际高于系统
			if(sumPriceObj.price1 > sumPriceObj.price2) {
				$(".sys-more-cinema-box").hide();
				$(".cinema-more-sys-box").show();
			}

			// 系统高于实际
			if(sumPriceObj.price2 > sumPriceObj.price1) {
				$(".cinema-more-sys-box").hide();
				$(".sys-more-cinema-box").fadeIn();
			}
			/* 显示对应模板描述信息 */
		}
	});
}

/**
* 导出报告
**/
function downReport() {
	var cinemaId = $("#curCinemaID").val();
	var queryDate = $("#queryDate").val();

	window.open("/schedule/apis/boxOffice/downBoxOfficeCompareJH.html?cinemaId=" + cinemaId + "&dcode=" + queryDate,'newwindow');
}