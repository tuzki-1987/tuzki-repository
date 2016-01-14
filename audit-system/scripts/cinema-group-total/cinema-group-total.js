/*
 * 影院票房批量汇总统计
 *
 * @author ccq
 */


// 页面初始化
function initCinemaBoxOfficeMng(dateS, dateE) {
	boxOfficeTotalListByDate(dateS, dateE);
}

// 汇总列表
function boxOfficeTotalListByDate(dateS, dateE) {
	var groupId = "", startDate = dateS == "" ? $("#queryDateStart").val() : dateS, 
	endDate = dateE = "" ? $("#queryDateEnd").val() : dateE,
	current = 1, offset = "", datas = null, datasL = 0, listHtml = "", difTotalPrice = 0,
	clickHtml = "",totalP = 0, sysTotalP = 0, bfdvColor = "", bfdvImg = "";

	$("#cinemaBatchTotalTbl").find("thead").nextAll().remove();
	$("#cinemaBatchTotalTbl").find("thead").after("<tr><td colspan='4' style='border-bottom-width: 0;'><center><img src='images/loading.gif' /></center></td></tr>");

	server.queryCinemaBoxOfficeByDate(groupId, startDate, endDate, current, offset, function(callback) {
		if(callback.ret) {
			if(callback.data != "") {
				datas = callback.data, datasL = datas.length;

				for(var i = 0; i < datasL; i++) {
					if(datas[i].totalPrice == undefined) {
						totalP = "<a href='javascript:;' title='" + datas[i].cinemaName + "' id='" + datas[i].cinemaId + "' onclick='handleClickUnUpload(this, event);'>未上传</a>";
						sysTotalP = "---";
						difTotalPrice = "---";
						bfdvColor = "";
						bfdvImg = "";
						clickHtml = "";
					}else {
						totalP = datas[i].totalPrice;
						sysTotalP = datas[i].sysTotalPrice;
						difTotalPrice = totalP*1 - sysTotalP*1;
						bfdvColor = "";
						bfdvImg = "";
						clickHtml = "<div class='click-check' data='0' onclick='handleClickLayerLoadData(this, " + datas[i].cinemaId + ");' onmouseleave='hideClickLayerSelf(this);'>点击查看</div>";

						if(difTotalPrice*1 > 0) {
							bfdvColor = " style='color: #f30;'";
							bfdvImg = "<img src='images/up.png' class='img-arrow' />";
						}else {
							bfdvColor = " style='color: #05a93e;'";
							bfdvImg = "<img src='images/down.png' class='img-arrow' />";
						}
					}

					listHtml += "<tr>"
								+ "<td><a href='javascript:;' data='" + datas[i].platformId + "' id='" + datas[i].cinemaId + "' onclick='handleClickCinema2(this, event);'>" + datas[i].cinemaName + "</a></td>"
								+ "<td>" + totalP + "</td>"
								+ "<td>" + sysTotalP + "</td>"
								+ "<td" + bfdvColor + " onmouseenter='showClickLayer(this);'>"
									+ "<span class='td-num'>" + difTotalPrice + bfdvImg + "</span>"
									+ clickHtml
								+ "</td>"
							+ "</tr>";
				}
			}else {
				listHtml = "<tr>"
						    + "<td colspan='4'>"
						        + "<div class='empty-data-div'>"
							        + "<img src='images/tip.png' width='80' />"
									+ "<span class='pdlt10 fs20 clr8'>暂无数据，您可在分配影院或选择分组后查看</span>"
								+ "</div>"
						    + "</td>"
						+ "</tr>";
			}

			$("#cinemaBatchTotalTbl").find("thead").nextAll().remove();
			$("#cinemaBatchTotalTbl").find("thead").after(listHtml);
		}
	});
}

/**
* "点击查看"层 - 点击加载内容
*
* @param obj 当前对象
* @param cinemaName 影院名字
* @param cinemaId 影院ID
**/
function handleClickLayerLoadData(obj, cinemaId) {
	var startDate = $("#queryDateStart").val(), endDate = $("#queryDateEnd").val(), current = 1, offset = "",
	datas = null, datasL = 0, listHtml = "", difPrice = 0, bfdvColor = "", bfdvImg = "";

	$("#cinemaBatchDetailTbl").find("thead").nextAll().remove();
	$("#cinemaBatchDetailTbl").find("thead").after("<tr><td colspan='6' style='border-bottom-width: 0;'><center><img src='images/loading.gif' /></center></td></tr>");

	server.difBoxOfficeDetail(cinemaId, startDate, endDate, current, offset, function(callback) {
		if(callback.ret) {
			if(callback.data != "") {
				datas = callback.data, datasL = datas.length;

				for(var i = 0; i < datasL; i++) {
					difPrice = parseInt(datas[i].totalPrice) - parseInt(datas[i].sysTotalPrice);

					if(difPrice*1 > 0) {
						bfdvColor = " style='color: #f30;'";
						bfdvImg = "<img src='images/up.png' class='img-arrow' />";
					}else {
						bfdvColor = " style='color: #05a93e;'";
						bfdvImg = "<img src='images/down.png' class='img-arrow' />";
					}

					listHtml += "<tr>"
								+ "<td>" + datas[i].cinemaName + "</td>"
								+ "<td>" + datas[i].totalPrice + "</td>"
								+ "<td>" + datas[i].sysTotalPrice + "</td>"
								+ "<td" + bfdvColor + ">" + difPrice + bfdvImg + "</td>"
								+ "<td>" + datas[i].score + "</td>"
								+ "<td>" + datas[i].statisticsDate + "</td>"
							+ "</tr>";
				}
			}else {
				listHtml = "<tr>"
						    + "<td colspan='6'>"
						        + "<div class='empty-data-div'>"
							        + "<img src='images/tip.png' width='80' />"
									+ "<span class='pdlt10 fs20 clr8'>暂无数据，您可在分配影院或选择分组后查看</span>"
								+ "</div>"
						    + "</td>"
						+ "</tr>";
			}

			$("#cinemaBatchDetailTbl").find("thead").nextAll().remove();
			$("#cinemaBatchDetailTbl").find("thead").after(listHtml);
			$("body").css("overflow", "auto");
		}
	});

	$('#difBODetailModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});
}

/**
* 开始日期点击查询
**/
function handleQueryDateStart() {
	var startDate = $("#queryDateStart").val(), endDate = $("#queryDateEnd").val();
	boxOfficeTotalListByDate(startDate, endDate);
}

/**
* 结束日期点击查询
**/
function handleQueryDateEnd() {
	var startDate = $("#queryDateStart").val(), endDate = $("#queryDateEnd").val();
	boxOfficeTotalListByDate(startDate, endDate);
}

/**
* "点击查看"层本身 - 隐藏
**/
function hideClickLayerSelf(obj) {
	var status = $(obj).attr("data");

	if(status*1 == 0) {
		$(obj).slideDown();
		setTimeout(function() {
			$(obj).attr("data", 1);
		}, 200);
	}
	
	if(status*1 == 1) {
		$(obj).slideUp();
		setTimeout(function() {
			$(obj).attr("data", 0);
		}, 200);
	}
}

/**
* "点击查看"层 - 显示
**/
function showClickLayer(obj) {
	var status = $(obj).find(".click-check").attr("data");

	if(status*1 == 0) {
		// $(obj).find(".click-check").css({"margin-top":"-40px"});
		$(obj).find(".click-check").slideDown();
		setTimeout(function() {
			$(obj).find(".click-check").attr("data", 1);
		}, 200);
	}
	
	if(status*1 == 1) {
		$(obj).find(".click-check").slideUp();
		setTimeout(function() {
			$(obj).find(".click-check").attr("data", 0);
		}, 200);
	}
}

$(function() {
	
});